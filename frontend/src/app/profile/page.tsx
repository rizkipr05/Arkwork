'use client'
import { useAuth } from '@/hooks/useAuth'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const { user } = useAuth()
  const [name, setName] = useState(''); const [location, setLocation] = useState('')
  const [phone, setPhone] = useState(''); const [skills, setSkills] = useState('')
  const [cv, setCv] = useState<{name:string,data:string}|null>(null)

  useEffect(() => {
    if (!user) { window.location.href='/auth/signin'; return }
    const users = JSON.parse(localStorage.getItem('ark_users') ?? '[]')
    const u = users.find((x:any)=>x.email===user.email)
    setName(u?.name ?? ''); setLocation(u?.profile?.location ?? '')
    setPhone(u?.profile?.phone ?? ''); setSkills(u?.profile?.skills ?? '')
    setCv(u?.profile?.cv ?? null)
  }, [user])

  if (!user) return null

  const save = () => {
    const users = JSON.parse(localStorage.getItem('ark_users') ?? '[]')
    const idx = users.findIndex((x:any)=>x.email===user.email)
    if (idx>=0) {
      users[idx].name = name
      users[idx].profile = { location, phone, skills, cv }
      localStorage.setItem('ark_users', JSON.stringify(users))
      alert('Profile updated!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-brand-blue mb-8">My Profile</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
              <input value={name} onChange={e=>setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"/>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input readOnly value={user.email} className="w-full px-3 py-2 border rounded-lg bg-gray-100"/>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
              <input value={location} onChange={e=>setLocation(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"/>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
              <input value={phone} onChange={e=>setPhone(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"/>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Skills (comma-separated)</label>
            <textarea value={skills} onChange={e=>setSkills(e.target.value)} rows={3}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue" />
            <div className="mt-2 flex flex-wrap gap-2">
              {skills.split(',').map(s=>s.trim()).filter(Boolean).map((s,i)=>(
                <span key={i} className="px-2 py-1 bg-brand-blue text-white text-xs rounded-full">#{s}</span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Upload CV</label>
            <input type="file" accept=".pdf,.doc,.docx"
                   onChange={async (e)=>{
                     const f = e.target.files?.[0]; if (!f) return
                     const data = await f.arrayBuffer()
                     const base64 = btoa(String.fromCharCode(...new Uint8Array(data)))
                     const dataUrl = `data:${f.type};base64,${base64}`
                     setCv({ name: f.name, data: dataUrl })
                   }}
                   className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"/>
            {cv && (
              <div className="mt-2 flex items-center space-x-2 text-sm text-green-600">
                <i className="fa-solid fa-file-pdf" />
                <span>{cv.name}</span>
                <a href={cv.data} download={cv.name} className="text-brand-blue hover:underline">Download</a>
              </div>
            )}
          </div>

          <div className="mt-8">
            <button onClick={save} className="bg-brand-blue text-white px-6 py-2 rounded-lg hover:bg-brand-blue-light">Save Profile</button>
          </div>
        </div>
      </div>
    </div>
  )
}

