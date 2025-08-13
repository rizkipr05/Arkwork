'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (!t.closest('#mobileMenu') && !t.closest('#mobileBtn')) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <svg className="w-8 h-8 text-brand-blue" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2Zm9 7V7L15 1 9 7v2c0 1.1.9 2 2 2v11h2V11c1.1 0 2-.9 2-2Z"/>
          </svg>
          <span className="text-xl font-bold text-brand-blue">ArkWork</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-700 hover:text-brand-blue">Home</Link>
          <Link href="/jobs" className="text-gray-700 hover:text-brand-blue">Jobs</Link>
          <Link href="/tender" className="text-gray-700 hover:text-brand-blue">Tenders</Link>
          <Link href="/news" className="text-gray-700 hover:text-brand-blue">News</Link>
          <Link href="/about" className="text-gray-700 hover:text-brand-blue">About</Link>
        </div>

        {/* Auth Buttons (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {!user ? (
            <>
              <Link href="/auth/signin" className="px-4 py-2 text-brand-blue border border-brand-blue rounded-lg hover:bg-brand-blue hover:text-white">Sign In</Link>
              <Link href="/auth/signup" className="px-4 py-2 bg-brand-yellow text-white rounded-lg hover:bg-yellow-600">Sign Up</Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="text-gray-700 hover:text-brand-blue">Dashboard</Link>
              <span className="text-gray-700">Hi, {user.name}!</span>
              <button onClick={logout} className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white">Logout</button>
            </>
          )}
        </div>

        {/* Mobile Button */}
        <button id="mobileBtn" className="md:hidden p-2" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
          <i className="fa-solid fa-bars text-gray-700" />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        id="mobileMenu"
        className={`md:hidden fixed inset-y-0 right-0 w-64 bg-white shadow-xl z-[60] transform transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}
        aria-hidden={!open}
      >
        <div className="p-4">
          <button onClick={() => setOpen(false)} className="float-right p-2" aria-label="Close menu">
            <i className="fa-solid fa-xmark text-gray-700" />
          </button>

          <div className="clear-both pt-8 space-y-4">
            <Link href="/" onClick={() => setOpen(false)} className="block py-2 text-gray-700">Home</Link>
            <Link href="/jobs" onClick={() => setOpen(false)} className="block py-2 text-gray-700">Jobs</Link>
            <Link href="/tender" onClick={() => setOpen(false)} className="block py-2 text-gray-700">Tenders</Link>
            <Link href="/news" onClick={() => setOpen(false)} className="block py-2 text-gray-700">News</Link>
            <Link href="/about" onClick={() => setOpen(false)} className="block py-2 text-gray-700">About</Link>
            <hr className="my-4" />

            {!user ? (
              <>
                <Link href="/auth/signin" onClick={() => setOpen(false)} className="block w-full py-2 text-brand-blue border border-brand-blue rounded-lg text-center">Sign In</Link>
                <Link href="/auth/signup" onClick={() => setOpen(false)} className="block w-full py-2 bg-brand-yellow text-white rounded-lg mt-2 text-center">Sign Up</Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="block w-full py-2 text-center text-gray-700">Dashboard</Link>
                <button
                  onClick={() => { setOpen(false); logout() }}
                  className="block w-full py-2 text-red-600 border border-red-600 rounded-lg"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
