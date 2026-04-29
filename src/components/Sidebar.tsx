import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { load } from 'js-yaml'
import NavTree from './NavTree'
import type { NavNode } from '@/types/nav'
import './Sidebar.css'
import logoImg from '/images/myself/manfredhu.svg'

// Import nav.yml as raw text — Vite handles ?raw imports
import navRaw from '/config/nav.yml?raw'

export default function Sidebar() {
  const navNodes = useMemo<NavNode[]>(() => {
    try {
      const data = load(navRaw)
      return Array.isArray(data) ? (data as NavNode[]) : []
    } catch (e) {
      console.error('Failed to parse nav.yml:', e)
      return []
    }
  }, [])

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo-img-link">
          <img src={logoImg} alt="ManfredHu" className="sidebar-logo-img" />
        </Link>
        <div className="sidebar-header-info">
          <div className="sidebar-header-row">
            <Link to="/" className="sidebar-logo-text">
              ManfredHu
            </Link>
            <div className="sidebar-social">
              <a
                href="https://github.com/ManfredHu"
                target="_blank"
                rel="noopener noreferrer"
                className="sidebar-social-link"
                aria-label="GitHub"
                title="GitHub"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a
                href="mailto:manfredhufe@gmail.com"
                className="sidebar-social-link"
                aria-label="Email"
                title="manfredhufe@gmail.com"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </a>
            </div>
          </div>
          <p className="sidebar-subtitle">技术与生活</p>
        </div>
      </div>
      <div className="sidebar-nav">
        <NavTree nodes={navNodes} depth={0} />
      </div>
    </aside>
  )
}
