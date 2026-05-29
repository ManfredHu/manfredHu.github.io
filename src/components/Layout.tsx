import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import MobileTopBar from './MobileTopBar'
import './Layout.css'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const closeSidebar = useCallback(() => setSidebarOpen(false), [])
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), [])

  // Close drawer + scroll to top on route change
  useEffect(() => {
    setSidebarOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Close on Escape
  useEffect(() => {
    if (!sidebarOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sidebarOpen])

  // Lock body scroll while drawer open
  useEffect(() => {
    if (!sidebarOpen) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [sidebarOpen])

  return (
    <div className={`layout${sidebarOpen ? ' layout--drawer-open' : ''}`}>
      <MobileTopBar open={sidebarOpen} onToggle={toggleSidebar} />
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  )
}
