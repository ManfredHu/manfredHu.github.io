import { Link } from 'react-router-dom'
import './MobileTopBar.css'

interface MobileTopBarProps {
  open: boolean
  onToggle: () => void
}

export default function MobileTopBar({ open, onToggle }: MobileTopBarProps) {
  return (
    <header className="mobile-topbar">
      <button
        type="button"
        className="mobile-topbar-hamburger"
        aria-label={open ? '关闭导航' : '打开导航'}
        aria-expanded={open}
        aria-controls="site-sidebar"
        onClick={onToggle}
      >
        <span
          className={`hamburger-icon${open ? ' is-open' : ''}`}
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
        </span>
      </button>
      <Link to="/" className="mobile-topbar-brand">
        ManfredHu
      </Link>
      <span className="mobile-topbar-spacer" />
    </header>
  )
}
