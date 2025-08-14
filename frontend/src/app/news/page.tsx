'use client'

import { useEffect, useMemo, useState } from 'react'
import { fetchEnergyNews, type EnergyNewsItem } from '@/lib/api'

export default function NewsPage() {
  const [items, setItems] = useState<EnergyNewsItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // filters
  const [scope, setScope] = useState<'id' | 'global' | 'both'>('id')
  const [limit, setLimit] = useState(15)
  const [lang, setLang] = useState('id')
  const [country, setCountry] = useState('ID')
  const [keywords, setKeywords] = useState('')
  const [quick, setQuick] = useState('') // local quick filter

  const load = async () => {
    setLoading(true); setError(null)
    try {
      const data = await fetchEnergyNews({ scope, limit, lang, country, keywords })
      setItems(data.items)
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load news')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, []) // initial fetch

  const filtered = useMemo(() => {
    const k = quick.trim().toLowerCase()
    if (!k) return items
    return items.filter(it =>
      (it.title ?? '').toLowerCase().includes(k) ||
      (it.source ?? '').toLowerCase().includes(k)
    )
  }, [items, quick])

  // helpers
  const getDomain = (url?: string) => {
    try {
      if (!url) return ''
      const u = new URL(url)
      return u.hostname.replace(/^www\./, '')
    } catch { return '' }
  }
  const summarize = (it: EnergyNewsItem) =>
    (it.summary || it.description || '').replace(/\s+/g, ' ').trim()

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-brand-blue mb-6">Energy &amp; Oil &amp; Gas News</h1>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6 grid md:grid-cols-6 gap-3 md:gap-4">
          <select className="px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                  value={scope} onChange={e=>setScope(e.target.value as any)}>
            <option value="id">Scope: Indonesia</option>
            <option value="global">Scope: Global</option>
            <option value="both">Scope: Both</option>
          </select>

          <select className="px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                  value={lang} onChange={e=>setLang(e.target.value)}>
            <option value="id">Lang: ID</option>
            <option value="en">Lang: EN</option>
          </select>

          <select className="px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                  value={country} onChange={e=>setCountry(e.target.value)}>
            <option value="ID">Country: ID</option>
            <option value="US">Country: US</option>
          </select>

          <select className="px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                  value={limit} onChange={e=>setLimit(Number(e.target.value))}>
            {[10,15,20,30,50].map(n=>(
              <option key={n} value={n}>Limit: {n}</option>
            ))}
          </select>

          <input
            placeholder="Custom keywords (optional)"
            className="px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            value={keywords} onChange={e=>setKeywords(e.target.value)}
          />

          <button onClick={load}
                  className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-light disabled:opacity-60"
                  disabled={loading}>
            {loading ? 'Loading…' : 'Fetch News'}
          </button>

          <input
            placeholder="Quick filter by title/source…"
            className="md:col-span-3 px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            value={quick} onChange={e=>setQuick(e.target.value)}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* List style (no images) */}
        <section className="bg-white rounded-xl shadow">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-blue" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 3v2h3.59L7 15.59 8.41 17 19 6.41V10h2V3zM5 5h6V3H3v8h2z"/><path d="M19 19H5V8H3v13h18V10h-2z"/>
              </svg>
              <span className="font-semibold">Latest Industry News</span>
            </div>
            {quick && (
              <button
                onClick={()=>setQuick('')}
                className="text-sm text-brand-blue hover:underline"
              >
                Clear Filter
              </button>
            )}
          </div>

          {filtered.map((it, i) => (
            <article key={`${it.link}-${i}`} className="px-5 md:px-6 py-5 border-b last:border-none">
              {/* Title + source badge */}
              <div className="flex items-start justify-between gap-3">
                <a href={it.link} target="_blank" rel="noreferrer" className="hover:underline">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900">
                    {it.title}
                  </h3>
                </a>
                <span className="shrink-0 inline-flex items-center rounded-full border px-2.5 py-1 text-xs text-gray-700">
                  {it.source || getDomain(it.link) || 'Source'}
                </span>
              </div>

              {/* Summary */}
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {summarize(it) || '…'}
              </p>

              {/* Footer: date + Read More */}
              <div className="mt-3 flex items-center justify-between text-sm">
                <time className="text-gray-500">
                  {it.pubDate ? new Date(it.pubDate).toLocaleDateString() : ''}
                </time>
                <a
                  href={it.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-blue hover:underline inline-flex items-center gap-1"
                >
                  Read More
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z"/><path d="M5 5h6V3H3v8h2z"/>
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </section>

        {!loading && !error && filtered.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No articles found.</p>
        )}
      </div>
    </div>
  )
}
