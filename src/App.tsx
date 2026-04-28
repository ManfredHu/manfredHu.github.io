import { Component, type ReactNode } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import HomePage from '@/pages/HomePage'
import ArticlePage from '@/pages/ArticlePage'

class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: '2rem',
            fontFamily: 'monospace',
            color: '#f38ba8',
            background: '#1e1e2e',
            minHeight: '100vh',
          }}
        >
          <h2 style={{ color: '#cba6f7' }}>React 渲染错误</h2>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              marginTop: '1rem',
              color: '#fab387',
            }}
          >
            {this.state.error.message}
          </pre>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              marginTop: '1rem',
              fontSize: '0.8em',
              color: '#6c7086',
            }}
          >
            {this.state.error.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            {/* Catch-all: any path like /broswer/foo or /js/bar loads ArticlePage */}
            <Route path="*" element={<ArticlePage />} />
          </Route>
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  )
}
