// src/hooks/useAuth.tsx
'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type User = {
  id: string;
  email: string;
  name?: string | null;
  photoUrl?: string | null;
  cvUrl?: string | null;
};

type AuthCtx = {
  user: User | null;
  loading: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  social: (provider: 'google' | 'linkedin' | 'microsoft', mode: 'login' | 'signup') => Promise<void>;
  signout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>(null as any);
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // bootstrap session dari cookie (GET /auth/me)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`${API}/auth/me`, { credentials: 'include', cache: 'no-store' });
        if (r.ok) {
          const u = (await r.json()) as User;
          if (alive) setUser(u);
        } else {
          if (alive) setUser(null);
        }
      } catch {
        if (alive) setUser(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const signin: AuthCtx['signin'] = async (email, password) => {
    const r = await fetch(`${API}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.message || 'Login gagal');
    setUser(data as User);
  };

  const signup: AuthCtx['signup'] = async (name, email, password) => {
    const r = await fetch(`${API}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.message || 'Gagal mendaftar');
    setUser(data as User);
  };

  const social: AuthCtx['social'] = async (_provider, _mode) => {
    throw new Error('Login sosial belum diaktifkan');
  };

  const signout: AuthCtx['signout'] = async () => {
    await fetch(`${API}/auth/signout`, { method: 'POST', credentials: 'include' });
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, signin, signup, social, signout }),
    [user, loading]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
