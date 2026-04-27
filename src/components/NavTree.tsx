import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import type { NavNode } from '@/types/nav'
import './NavTree.css'

interface NavTreeProps {
  nodes: NavNode[]
  depth?: number
}

interface NavItemProps {
  node: NavNode
  depth: number
}

function NavItem({ node, depth }: NavItemProps) {
  const [open, setOpen] = useState(depth === 0)
  const hasChildren = node.children && node.children.length > 0

  if (!hasChildren && node.link) {
    return (
      <NavLink
        to={node.link}
        className={({ isActive }) =>
          `nav-leaf${isActive ? ' nav-leaf--active' : ''}`
        }
        style={{ paddingLeft: `${(depth + 1) * 14 + 8}px` }}
      >
        {node.text}
      </NavLink>
    )
  }

  return (
    <div className="nav-group">
      <button
        className={`nav-group-header${open ? ' nav-group-header--open' : ''}`}
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="nav-group-arrow">{open ? '▾' : '▸'}</span>
        <span>{node.text}</span>
      </button>
      {open && hasChildren && (
        <div className="nav-group-children">
          <NavTree nodes={node.children!} depth={depth + 1} />
        </div>
      )}
    </div>
  )
}

export default function NavTree({ nodes, depth = 0 }: NavTreeProps) {
  return (
    <nav className="nav-tree">
      {nodes.map((node, i) => (
        <NavItem key={`${node.text}-${i}`} node={node} depth={depth} />
      ))}
    </nav>
  )
}
