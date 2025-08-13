'use client'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

export default function SignIn() {
  const { signin, social } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState<'google'|'linkedin'|'microsoft'|null>(null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full mx-4 bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-brand-blue">Sign in to ArkWork</h2>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Demo Account:</h3>
          <p className="text-sm text-blue-700">Email: demo@arkwork.com</p>
          <p className="text-sm text-blue-700">Password: demo123</p>
          <button type="button" onClick={() => { setEmail('demo@arkwork.com'); setPassword('demo123'); }}
                  className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Use Demo Account</button>
        </div>

        <form onSubmit={async e => { e.preventDefault(); await signin(email, password); window.location.href='/dashboard'; }}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
                   className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"/>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required
                   className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"/>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <label className="flex items-center"><input type="checkbox" className="mr-2"/><span className="text-sm text-gray-700">Remember me</span></label>
            <a className="text-sm text-brand-blue hover:underline">Forgot password?</a>
          </div>
          <button type="submit" className="w-full bg-brand-blue text-white py-2 rounded-lg hover:bg-brand-blue-light">Sign In</button>
        </form>

        <div className="mt-6">
          <div className="text-center text-gray-500 mb-4">or continue with</div>
          <div className="space-y-2">
            {(['google','linkedin','microsoft'] as const).map(p=>(
              <button key={p} onClick={async ()=>{ setLoading(p); await social(p,'login'); window.location.href='/dashboard'; }}
                      className="w-full flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-gray-50">
                {loading===p ? <i className="fa-solid fa-spinner fa-spin mr-2" /> :
                  <i className={`fab fa-${p==='microsoft'?'microsoft':p} mr-2`} />}
                {p==='google'?'Google':p==='linkedin'?'LinkedIn':'Microsoft'}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center mt-6 text-gray-600">
          Don&apos;t have an account? <Link href="/auth/signup" className="text-brand-blue hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
