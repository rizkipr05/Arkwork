import { Router, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import Parser from "rss-parser";
import pLimit from "p-limit";
import { getPreviewImage } from "../utils/preview";

const router = Router();

const limiter = rateLimit({ windowMs: 60 * 1000, max: 60 });
router.use(limiter);

const parser = new Parser({ headers: { "User-Agent": "arkwork-energy-news/1.0" } });

function gnewsUrl(query: string, lang = "id", country = "ID") {
  const base = "https://news.google.com/rss/search";
  const p = new URLSearchParams({ q: query, hl: lang, gl: country, ceid: `${country}:${lang}` });
  return `${base}?${p.toString()}`;
}

const ID_QUERIES = [
  "(migas OR minyak OR gas OR energi) site:esdm.go.id",
  "(migas OR minyak OR gas OR energi) site:katadata.co.id",
  "(migas OR minyak OR gas OR energi) site:cnbcindonesia.com",
  "(migas OR minyak OR gas OR energi) site:bisnis.com",
  "(migas OR minyak OR gas OR energi) site:cnnindonesia.com",
];

const GLOBAL_QUERIES = [
  "(oil OR gas OR LNG OR energy) site:reuters.com",
  "(oil OR gas OR LNG OR energy) site:aljazeera.com",
  "(oil OR gas OR LNG OR energy) site:bloomberg.com",
  "(oil OR gas OR LNG OR energy) site:ft.com",
  "(oil OR gas OR LNG OR energy) site:wsj.com",
];

router.get("/energy", async (req: Request, res: Response) => {
  try {
    const limit = Math.min(Number(req.query.limit ?? 20), 50);
    const scope = String(req.query.scope ?? "both"); // id | global | both
    const lang = String(req.query.lang ?? "id");
    const country = String(req.query.country ?? "ID");
    const customKeywords = (req.query.keywords ?? "").toString().trim();

    let queries: string[] = [];
    if (scope === "id") queries = ID_QUERIES;
    else if (scope === "global") queries = GLOBAL_QUERIES;
    else queries = [...ID_QUERIES, ...GLOBAL_QUERIES];

    if (customKeywords) {
      queries = queries.map(() => customKeywords);
    }

    const feeds = await Promise.all(
      queries.map(async (q) => {
        const feed = await parser.parseURL(gnewsUrl(q, lang, country));
        return (
          feed.items?.map((it) => ({
            title: it.title ?? "",
            link: it.link ?? "",
            pubDate: it.pubDate ? new Date(it.pubDate).toISOString() : null,
            source: (it as any).source || it.creator || it.author || "Google News",
          })) ?? []
        );
      })
    );

    const all = feeds.flat();

    // Deduplicate
    const seen = new Set<string>();
    const deduped = all.filter((a) => {
      const key = a.link || a.title;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Sort desc by date
    deduped.sort((a, b) => (b.pubDate || "").localeCompare(a.pubDate || ""));

    // Fetch og:image (batasi concurrency)
    const limitRun = pLimit(5);
    const withImages = await Promise.all(
      deduped.slice(0, limit).map((item) =>
        limitRun(async () => {
          const image = item.link ? await getPreviewImage(item.link) : null;
          return { ...item, image };
        })
      )
    );

    res.json({
      scope,
      lang,
      country,
      count: withImages.length,
      items: withImages, // sudah berisi field `image`
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Gagal mengambil berita" });
  }
});

export default router;
