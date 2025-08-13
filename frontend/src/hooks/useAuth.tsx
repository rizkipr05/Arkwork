// src/hooks/useAuth.tsx
'use client'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type UserLite = { name: string; email: string; profile?: any }
type AuthCtx = {
  user: UserLite | null
  signin: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  social: (provider: 'google'|'linkedin'|'microsoft', mode: 'login'|'signup') => Promise<void>
  logout: () => void
}

const Ctx = createContext<AuthCtx>(null as any)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserLite | null>(null)

  useEffect(() => {
    const cur = localStorage.getItem('ark_current')
    const users = JSON.parse(localStorage.getItem('ark_users') ?? '[]')
    if (cur) {
      const u = users.find((x: any) => x.email === cur)
      if (u) setUser({ name: u.name, email: u.email, profile: u.profile })
    }
  }, [])

  const signin: AuthCtx['signin'] = async (email, password) => {
    const users = JSON.parse(localStorage.getItem('ark_users') ?? '[]')
    const u = users.find((x: any) => x.email === email && x.password === password)
    if (!u) throw new Error('Email or password is incorrect!')
    setUser({ name: u.name, email: u.email, profile: u.profile })
    localStorage.setItem('ark_current', u.email)
  }

  const signup: AuthCtx['signup'] = async (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('ark_users') ?? '[]')
    if (users.find((u: any) => u.email === email)) throw new Error('Email already registered!')
    users.push({ name, email, password, profile: { location: '', phone: '', skills: '', cv: null } })
    localStorage.setItem('ark_users', JSON.stringify(users))
    localStorage.setItem('ark_current', email)
    setUser({ name, email })
  }

  const social: AuthCtx['social'] = async (provider, mode) => {
    const providerName = { google: 'Google', linkedin: 'LinkedIn', microsoft: 'Microsoft' }[provider]
    const email = (mode === 'signup' ? 'newuser' : 'user') + `@${provider}.com`
    const name = `${providerName} User`
    const password = `${mode === 'signup' ? 'social_signup_' : 'social_login_'}${Date.now()}`
    const users = JSON.parse(localStorage.getItem('ark_users') ?? '[]')
    let u = users.find((x: any) => x.email === email)
    if (!u) {
      u = { name, email, password, socialProvider: provider, profile: { location: 'Jakarta', phone: '', skills: '', cv: null } }
      users.push(u)
      localStorage.setItem('ark_users', JSON.stringify(users))
    }
    localStorage.setItem('ark_current', email)
    setUser({ name: u.name, email: u.email, profile: u.profile })
  }

  const logout = () => { localStorage.removeItem('ark_current'); setUser(null) }

  const value = useMemo(() => ({ user, signin, signup, social, logout }), [user])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
