// src/lib/api.ts

export type Scope = 'id' | 'global' | 'both';

export interface FetchEnergyNewsParams {
  scope: Scope;          // 'id' | 'global' | 'both'
  limit: number;         // jumlah maksimum item
  lang: string;          // 'id' | 'en'
  country: string;       // 'ID' | 'US' | lainnya (kode ISO-2)
  keywords?: string;     // kata kunci tambahan, contoh: "pertamina, geothermal"
}

export interface EnergyNewsItem {
  title: string;
  link: string;
  pubDate?: string;
  source?: string;
  description?: string;  // ringkasan yang sudah di-strip HTML
  summary?: string;      // alias untuk compatibility dengan UI
  image?: string | null;
}

export interface EnergyNewsResponse {
  items: EnergyNewsItem[];
}

/**
 * Utility: bersihkan tag HTML dasar
 */
function stripHtml(input?: string): string {
  if (!input) return '';
  return input.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Utility: ambil domain dari URL
 */
function getDomain(url?: string): string {
  try {
    if (!url) return '';
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

/**
 * Bangun URL Google News RSS sesuai parameter
 * Docs (tidak resmi): https://news.google.com/rss
 */
function buildGoogleNewsRssUrl(params: {
  q: string;   // query
  lang: string; // 'id' | 'en'
  country: string; // 'ID' | 'US' | ...
}) {
  const { q, lang, country } = params;

  // hl = language-region, gl = country, ceid = Country:Lang
  // contoh: hl=id-ID&gl=ID&ceid=ID:id
  const hl = `${lang}-${country}`;
  const ceid = `${country}:${lang}`;

  const usp = new URLSearchParams({
    q,
    hl,
    gl: country,
    ceid,
  });

  return `https://news.google.com/rss/search?${usp.toString()}`;
}

/**
 * Ambil JSON dari rss2json.com (gratis; rate limit wajar)
 * Contoh: https://api.rss2json.com/v1/api.json?rss_url=<encoded RSS URL>
 */
async function fetchRssAsJson(rssUrl: string) {
  const api = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
  const res = await fetch(api, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`RSS fetch failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<{
    status: string;
    feed: { title?: string };
    items: Array<{
      title: string;
      link: string;
      pubDate?: string;
      author?: string;
      description?: string;
      content?: string;
      enclosure?: { link?: string };
    }>;
  }>;
}

/**
 * Bangun query default untuk sektor energi/oil & gas + kata kunci custom
 */
function buildQuery(baseKeywords?: string) {
  const defaults = [
    'oil',
    'gas',
    'energy',
    'petroleum',
    'geothermal',
    'renewable',
    'minyak',
    'energi',
    'migas',
  ];
  const extra = (baseKeywords || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  // Gabungkan dan hilangkan duplikat
  const all = Array.from(new Set([...defaults, ...extra]));
  // Google News: gunakan OR
  return all.map(k => `"${k}"`).join(' OR ');
}

/**
 * Mapper item RSS2JSON → EnergyNewsItem
 */
function mapItem(it: any): EnergyNewsItem {
  const desc = stripHtml(it.description || it.content || '');
  const image =
    it?.enclosure?.link && /^https?:\/\//i.test(it.enclosure.link)
      ? it.enclosure.link
      : null;

  return {
    title: it.title,
    link: it.link,
    pubDate: it.pubDate,
    source: it.author || getDomain(it.link),
    description: desc,
    summary: desc,     // <— tambahkan ini supaya page.tsx bisa pakai it.summary
    image,
  };
}


/**
 * Ambil berita energi dari Google News (via rss2json)
 * Tanpa API key, cocok untuk prototipe/learning.
 */
export async function fetchEnergyNews(
  params: FetchEnergyNewsParams
): Promise<EnergyNewsResponse> {
  const { scope, limit, lang, country, keywords } = params;
  const q = buildQuery(keywords);

  // Buat 1 atau 2 RSS URL sesuai scope
  const urls: string[] = [];
  if (scope === 'id' || scope === 'both') {
    urls.push(buildGoogleNewsRssUrl({ q, lang: 'id', country: 'ID' }));
  }
  if (scope === 'global' || scope === 'both') {
    // Global: pakai EN + US biar cakupan luas
    urls.push(buildGoogleNewsRssUrl({ q, lang: 'en', country: 'US' }));
  }
  // Jika user memilih scope yang spesifik (bukan both), hormati pilihan lang/country dari UI
  if (scope !== 'both' && !(scope === 'id' && lang === 'id' && country === 'ID') && !(scope === 'global' && lang === 'en' && country === 'US')) {
    urls.length = 0;
    urls.push(buildGoogleNewsRssUrl({ q, lang, country }));
  }

  // Fetch paralel
  const results = await Promise.allSettled(urls.map(u => fetchRssAsJson(u)));

  const items: EnergyNewsItem[] = [];
  for (const r of results) {
    if (r.status === 'fulfilled') {
      for (const it of r.value.items ?? []) {
        items.push(mapItem(it));
      }
    }
  }

  // sort terbaru → teratas
  items.sort((a, b) => {
    const ta = a.pubDate ? +new Date(a.pubDate) : 0;
    const tb = b.pubDate ? +new Date(b.pubDate) : 0;
    return tb - ta;
  });

  // batasi sesuai limit
  const sliced = items.slice(0, Math.max(1, limit));

  return { items: sliced };
}
