'use client'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

export default function SignUp() {
  const { signup, social } = useAuth()
  const [name, setName] = useState(''); const [email, setEmail] = useState('')
  const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState<'google'|'linkedin'|'microsoft'|null>(null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full mx-4 bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-brand-blue">Create your ArkWork account</h2>
        <form onSubmit={async e=>{ e.preventDefault(); if (password!==confirm) { alert('Passwords do not match!'); return; } await signup(name,email,password); window.location.href='/dashboard'; }}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"/>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"/>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} minLength={6} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"/>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
            <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"/>
          </div>
          <button type="submit" className="w-full bg-brand-yellow text-white py-2 rounded-lg hover:bg-yellow-600">Sign Up</button>
        </form>

        <div className="mt-6">
          <div className="text-center text-gray-500 mb-4">or sign up with</div>
          <div className="space-y-2">
            {(['google','linkedin','microsoft'] as const).map(p=>(
              <button key={p} onClick={async ()=>{ setLoading(p); await social(p,'signup'); window.location.href='/dashboard'; }}
                      className="w-full flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-gray-50">
                {loading===p ? <i className="fa-solid fa-spinner fa-spin mr-2" /> :
                  <i className={`fab fa-${p==='microsoft'?'microsoft':p} mr-2`} />}
                {p==='google'?'Google':p==='linkedin'?'LinkedIn':'Microsoft'}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center mt-6 text-gray-600">
          Already have an account? <Link href="/auth/signin" className="text-brand-blue hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
