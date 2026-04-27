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
              {category.children && (
                <ul className="category-topics">
                  {category.children.slice(0, 5).map((child) => (
                    <li key={child.text}>
                      {child.link ? (
                        <Link to={child.link} className="category-topic-link">
                          {child.text}
                        </Link>
                      ) : (
                        <span className="category-topic-group">
                          {child.text}
                        </span>
                      )}
                    </li>
                  ))}
                  {category.children.length > 5 && (
                    <li className="category-more">
                      还有 {category.children.length - 5} 个子分类...
                    </li>
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
