import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import HomePage from '@/pages/HomePage'
import ArticlePage from '@/pages/ArticlePage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          {/* Catch-all: any path like /broswer/foo or /js/bar loads ArticlePage */}
          <Route path="*" element={<ArticlePage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
