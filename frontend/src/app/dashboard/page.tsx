'use client'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const { user } = useAuth()
  const [recent, setRecent] = useState<any[]>([])

  useEffect(() => {
    if (!user) { window.location.href='/auth/signin'; return }
    const apps = JSON.parse(localStorage.getItem('ark_apps') ?? '{}')
    const jobs = JSON.parse(localStorage.getItem('ark_jobs') ?? '[]')
    const arr = (apps[user.email] ?? []).slice(-3).map((a:any)=>({
      ...a, title: jobs.find((j:any)=>j.id===a.jobId)?.title ?? `Job ${a.jobId}`
    }))
    setRecent(arr)
  }, [user])

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-brand-blue mb-8">Hi, {user.name}!</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Search Jobs</h3>
            <div className="space-y-4">
              <input placeholder="Keyword..." className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"/>
              <Link href="/jobs" className="block text-center bg-brand-blue text-white py-2 rounded-lg hover:bg-brand-blue-light">Browse</Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">My Profile</h3>
            <p className="text-gray-600 mb-4">Complete your profile to get better job recommendations</p>
            <Link href="/profile" className="block text-center bg-brand-yellow text-white py-2 rounded-lg hover:bg-yellow-600">Edit Profile</Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-2">
              {recent.length === 0 ? <p className="text-gray-600">No activity yet</p> :
                recent.map((r,i)=><p key={i} className="text-sm text-gray-600">Applied to {r.title} - {r.date}</p>)}
            </div>
            <Link href="/applications" className="block text-center mt-4 text-brand-blue border border-brand-blue py-2 rounded-lg hover:bg-brand-blue hover:text-white">View All</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
