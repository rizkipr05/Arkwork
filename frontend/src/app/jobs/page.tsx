'use client'
import { useEffect, useMemo, useState } from 'react'

type Job = {
  id: number
  title: string
  location: string
  industry: 'Oil & Gas' | 'Renewable Energy' | 'Mining'
  contract: 'Full-time' | 'Contract' | 'Part-time'
  function: 'Engineering' | 'Operations' | 'Management'
  remote: 'On-site' | 'Remote' | 'Hybrid'
  posted: string
  description: string
}

const SEED: Job[] = [
  { id:1, title:'Senior Petroleum Engineer', location:'Jakarta', industry:'Oil & Gas', contract:'Full-time', function:'Engineering', remote:'On-site', posted:'2024-01-15', description:'Looking for an experienced petroleum engineer for oil & gas exploration projects.' },
  { id:2, title:'Project Manager - Renewable Energy', location:'Surabaya', industry:'Renewable Energy', contract:'Contract', function:'Management', remote:'Hybrid', posted:'2024-01-14', description:'Lead large-scale renewable energy projects in East Java.' },
  { id:3, title:'Operations Supervisor', location:'Balikpapan', industry:'Oil & Gas', contract:'Full-time', function:'Operations', remote:'On-site', posted:'2024-01-13', description:'Supervise daily operations at an oil & gas production facility.' },
  { id:4, title:'Mining Engineer', location:'Bandung', industry:'Mining', contract:'Full-time', function:'Engineering', remote:'On-site', posted:'2024-01-12', description:'Design and oversee mineral mining operations.' },
  { id:5, title:'Environmental Consultant', location:'Jakarta', industry:'Oil & Gas', contract:'Contract', function:'Engineering', remote:'Remote', posted:'2024-01-11', description:'Provide environmental consulting for energy projects.' },
  { id:6, title:'Solar Panel Technician', location:'Bali', industry:'Renewable Energy', contract:'Part-time', function:'Operations', remote:'On-site', posted:'2024-01-10', description:'Install and maintain PV systems for solar projects.' },
  { id:7, title:'Drilling Engineer', location:'Pekanbaru', industry:'Oil & Gas', contract:'Full-time', function:'Engineering', remote:'On-site', posted:'2024-01-09', description:'Plan and supervise oil well drilling operations.' },
  { id:8, title:'Energy Analyst', location:'Jakarta', industry:'Renewable Energy', contract:'Full-time', function:'Management', remote:'Hybrid', posted:'2024-01-08', description:'Analyze trends and market data in renewable energy.' }
]

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filters, setFilters] = useState({ q:'', loc:'', industry:'', contract:'', func:'', remote:'' })
  const [selected, setSelected] = useState<Job | null>(null)
  const [saved, setSaved] = useState<number[]>([])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('ark_jobs') ?? 'null')
    if (!stored) localStorage.setItem('ark_jobs', JSON.stringify(SEED))
    setJobs(stored ?? SEED)

    const s = JSON.parse(localStorage.getItem('ark_saved_global') ?? '[]')
    setSaved(s)
  }, [])

  const filtered = useMemo(() => {
    const k = filters.q.toLowerCase()
    const loc = filters.loc.toLowerCase()
    return jobs.filter(j =>
      (k === '' || j.title.toLowerCase().includes(k)) &&
      (loc === '' || j.location.toLowerCase().includes(loc)) &&
      (filters.industry === '' || j.industry === filters.industry) &&
      (filters.contract === '' || j.contract === filters.contract) &&
      (filters.func === '' || j.function === filters.func) &&
      (filters.remote === '' || j.remote === filters.remote)
    )
  }, [jobs, filters])

  const toggleSave = (id: number) => {
    const next = saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id]
    setSaved(next)
    localStorage.setItem('ark_saved_global', JSON.stringify(next))
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-brand-blue mb-8">Jobs</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 grid md:grid-cols-6 gap-4">
          <input placeholder="Keyword..." className="px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                 value={filters.q} onChange={e=>setFilters(s=>({...s,q:e.target.value}))}/>
          <input placeholder="Location..." className="px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                 value={filters.loc} onChange={e=>setFilters(s=>({...s,loc:e.target.value}))}/>
          <select className="px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                  value={filters.industry} onChange={e=>setFilters(s=>({...s,industry:e.target.value}))}>
            <option value="">All Industries</option>
            <option>Oil & Gas</option><option>Renewable Energy</option><option>Mining</option>
          </select>
          <select className="px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                  value={filters.contract} onChange={e=>setFilters(s=>({...s,contract:e.target.value}))}>
            <option value="">All Contracts</option>
            <option>Full-time</option><option>Contract</option><option>Part-time</option>
          </select>
          <select className="px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                  value={filters.func} onChange={e=>setFilters(s=>({...s,func:e.target.value}))}>
            <option value="">All Functions</option>
            <option>Engineering</option><option>Operations</option><option>Management</option>
          </select>
          <select className="px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                  value={filters.remote} onChange={e=>setFilters(s=>({...s,remote:e.target.value}))}>
            <option value="">Any</option>
            <option>On-site</option><option>Remote</option><option>Hybrid</option>
          </select>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* List */}
          <div className="space-y-4">
            {filtered.map(job => (
              <div key={job.id}
                   className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                   onClick={() => setSelected(job)}>
                <h3 className="text-xl font-semibold text-brand-blue mb-2">{job.title}</h3>
                <p className="text-gray-600 mb-2"><i className="fa-solid fa-location-dot mr-2" />{job.location}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{job.contract}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">{job.industry}</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">{job.remote}</span>
                </div>
                <p className="text-gray-500 text-sm">Posted: {job.posted}</p>
              </div>
            ))}
          </div>

          {/* Detail */}
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24 h-fit">
            {!selected ? (
              <p className="text-gray-500 text-center py-8">Select a job to see details</p>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-brand-blue mb-4">{selected.title}</h2>
                <div className="space-y-3 mb-6">
                  <p><strong>Location:</strong> {selected.location}</p>
                  <p><strong>ID:</strong> {selected.id}</p>
                  <p><strong>Industry:</strong> {selected.industry}</p>
                  <p><strong>Contract:</strong> {selected.contract}</p>
                  <p><strong>Function:</strong> {selected.function}</p>
                  <p><strong>Work Mode:</strong> {selected.remote}</p>
                  <p><strong>Posted:</strong> {selected.posted}</p>
                </div>
                <p className="text-gray-700 mb-6">{selected.description}</p>
                <div className="space-y-3">
                  <button onClick={()=>{
                    const cur = localStorage.getItem('ark_current')
                    if (!cur) { window.location.href='/auth/signin'; return }
                    const apps = JSON.parse(localStorage.getItem('ark_apps') ?? '{}')
                    const arr = apps[cur] ?? []
                    if (arr.find((a:any)=>a.jobId===selected.id)) { alert('You already applied to this job!'); return }
                    arr.push({ jobId: selected.id, date: new Date().toISOString().split('T')[0] })
                    apps[cur]=arr; localStorage.setItem('ark_apps', JSON.stringify(apps))
                    alert('Application submitted!')
                  }} className="w-full bg-brand-blue text-white py-2 rounded-lg hover:bg-brand-blue-light">Apply</button>

                  <button onClick={()=>toggleSave(selected.id)}
                          className={`w-full ${saved.includes(selected.id)?'bg-yellow-500 text-white':'bg-gray-200 text-gray-800'} py-2 rounded-lg hover:bg-yellow-400`}>
                    {saved.includes(selected.id)?'Saved':'Save Job'}
                  </button>

                  <button onClick={()=>{
                    const url = `${window.location.origin}?job=${selected.id}`
                    navigator.clipboard.writeText(url).then(()=>alert('Job link copied to clipboard!'))
                  }} className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300">Share</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
