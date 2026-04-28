import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { load } from 'js-yaml'
import type { NavNode } from '@/types/nav'
import navRaw from '/config/nav.yml?raw'
import { useSEO } from '@/hooks/useSEO'
import './HomePage.css'

function getCategoryIcon(text: string): string {
  const icons: Record<string, string> = {
    前端基础: '🌐',
    计算机科学基础: '💻',
    小程序: '📱',
    效率工具: '⚡',
    AI: '🤖',
    其他: '📖',
  }
  return icons[text] ?? '📄'
}

function countLeaves(node: NavNode): number {
  if (!node.children) return node.link ? 1 : 0
  return node.children.reduce((sum, child) => sum + countLeaves(child), 0)
}

/** Collect all leaf nodes (articles) from a subtree */
function collectLeaves(node: NavNode): NavNode[] {
  if (node.link) return [node]
  if (node.children) return node.children.flatMap(collectLeaves)
  return []
}

export default function HomePage() {
  useSEO({})
  const navNodes = useMemo<NavNode[]>(() => {
    try {
      const data = load(navRaw)
      return Array.isArray(data) ? (data as NavNode[]) : []
    } catch {
      return []
    }
  }, [])

  return (
    <div className="home-page">
      <section className="home-hero">
        <h1 className="home-title">ManfredHu's Blog</h1>
        <p className="home-desc">前端技术 · 计算机科学 · 效率工具 · 生活随笔</p>
      </section>

      <section className="home-categories">
        <h2 className="home-section-title">分类</h2>
        <div className="category-grid">
          {navNodes.map((category) => (
            <div key={category.text} className="category-card">
              <div className="category-card-header">
                <span className="category-icon">
                  {getCategoryIcon(category.text)}
                </span>
                <h3 className="category-name">{category.text}</h3>
                <span className="category-count">
                  {countLeaves(category)} 篇
                </span>
              </div>
              {(() => {
                const leaves = collectLeaves(category)
                return leaves.length > 0 ? (
                  <ul className="category-topics">
                    {leaves.map((leaf) => (
                      <li key={leaf.link}>
                        <Link to={leaf.link!} className="category-topic-link">
                          {leaf.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null
              })()}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
