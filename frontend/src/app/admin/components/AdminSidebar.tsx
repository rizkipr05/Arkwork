'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'

export default function AdminSidebar() {
  const currentPath = usePathname() ?? ''
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [currentPath])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = open ? 'hidden' : prev || ''
    return () => { document.body.style.overflow = prev || '' }
  }, [open])

  const handleOpenMenu = useCallback(() => setOpen(true), [])
  const handleCloseMenu = useCallback(() => setOpen(false), [])

  const menu = [
    { name: 'Dashboard', path: '/admin', icon: HomeIcon },
    { name: 'Manage Landing Page', path: '/admin/landing', icon: LayoutIcon },
    { name: 'Jobs Management', path: '/admin/jobs', icon: BriefcaseIcon },
    { name: 'Tenders Management', path: '/admin/tenders', icon: LayersIcon },
    { name: 'User Management', path: '/admin/users', icon: UsersIcon },
  ]

  const isActive = (path: string) =>
    path === '/admin' ? currentPath === path : currentPath === path || currentPath.startsWith(path + '/')

  const Desktop = (
    <aside
      aria-label="Admin navigation"
      className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-72 flex-col border-r border-blue-900/15 bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 text-white"
    >
      <div className="flex h-16 items-center px-4 border-b border-white/10">
        <div className="h-9 w-9 rounded-xl bg-white/10 grid place-items-center">
          <SparkIcon className="h-5 w-5 text-white" />
        </div>
        <div className="ml-3 leading-tight">
          <div className="text-sm font-semibold">Admin Panel</div>
          <div className="text-xs text-white/70">ArkWork CMS</div>
        </div>
      </div>

      <nav className="mt-1 flex-1 overflow-y-auto px-2">
        <ul className="space-y-1" role="list">
          {menu.map(({ name, path, icon: Icon }) => {
            const active = isActive(path)
            return (
              <li key={path}>
                <Link
                  href={path}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition',
                    active ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/5 hover:text-white',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full',
                      active ? 'bg-amber-400' : 'bg-transparent',
                    ].join(' ')}
                  />
                  <Icon className="h-5 w-5" />
                  <span className="truncate">{name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="mt-auto border-t border-white/10 px-4 py-3 text-xs text-white/70">
        © {new Date().getFullYear()} ArkWork Admin
      </div>
    </aside>
  )

  return (
    <>
      {/* Topbar mobile */}
      <div className="md:hidden sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-neutral-200">
        <div className="h-14 flex items-center justify-between px-3">
          <button
            onClick={handleOpenMenu}
            aria-label="Open menu"
            className="grid h-10 w-10 place-items-center rounded-xl border border-neutral-200 text-neutral-700 active:scale-95"
          >
            <BurgerIcon className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-blue-600 grid place-items-center">
              <SparkIcon className="h-4 w-4 text-white" />
            </div>
            <div className="text-sm font-semibold">Admin Panel</div>
          </div>
          <div className="w-10" />
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          onClick={handleCloseMenu}
          className="fixed inset-0 z-50 md:hidden bg-black/40"
          aria-hidden="true"
        />
      )}

      {/* Drawer mobile */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Admin menu drawer"
        className={[
          'fixed inset-y-0 left-0 z-50 w-[85%] max-w-[18rem] md:hidden',
          'transform transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
        style={{ visibility: open ? 'visible' : 'hidden' }}
      >
        <div className="flex h-full flex-col bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 text-white shadow-2xl">
          <div className="flex h-14 items-center justify-between px-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-white/10 grid place-items-center">
                <SparkIcon className="h-4 w-4 text-white" />
              </div>
              <div className="text-sm font-semibold">Admin Panel</div>
            </div>
            <button
              onClick={handleCloseMenu}
              aria-label="Close menu"
              className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 active:scale-95"
            >
              <CloseIcon className="h-5 w-5 text-white/90" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-2">
            <ul className="space-y-1" role="list">
              {menu.map(({ name, path, icon: Icon }) => {
                const active = isActive(path)
                return (
                  <li key={path}>
                    <Link
                      href={path}
                      aria-current={active ? 'page' : undefined}
                      className={[
                        'group relative flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] transition',
                        active ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/5 hover:text-white',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          'absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full',
                          active ? 'bg-amber-400' : 'bg-transparent',
                        ].join(' ')}
                      />
                      <Icon className="h-5 w-5" />
                      <span className="truncate">{name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="border-t border-white/10 px-4 py-3 text-xs text-white/70">
            © {new Date().getFullYear()} ArkWork Admin
          </div>
        </div>
      </aside>

      {Desktop}
    </>
  )
}

/* Icons */
function BurgerIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" {...props}><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
}
function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" {...props}><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
}
function SparkIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" {...props}><path d="M12 2l2.2 5.4L20 9l-5 3.8L16 20l-4-3-4 3 1-7.2L4 9l5.8-1.6L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
}
function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" {...props}><path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-10.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
}
function LayoutIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" {...props}><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M3 10h18M10 20V10" stroke="currentColor" strokeWidth="2"/></svg>
}
function BriefcaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" {...props}><rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2"/></svg>
}
function LayersIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" {...props}><path d="M12 3l8 4-8 4-8-4 8-4Z" stroke="currentColor" strokeWidth="2"/><path d="M4 11l8 4 8-4" stroke="currentColor" strokeWidth="2"/><path d="M4 15l8 4 8-4" stroke="currentColor" strokeWidth="2"/></svg>
}
function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" {...props}><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="2"/><circle cx="16" cy="11" r="3" stroke="currentColor" strokeWidth="2"/><path d="M3 20a5 5 0 0 1 7-4.6M14 20a5 5 0 0 1 5-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
}
