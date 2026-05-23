import { createContext, useContext } from 'react'

interface LayoutContextType {
  sidebarOpen: boolean
  toggleSidebar: () => void
  closeSidebar: () => void
}

const defaultContext: LayoutContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
  closeSidebar: () => {},
}

export const LayoutContext = createContext<LayoutContextType>(defaultContext)

export const useLayout = () => {
  const ctx = useContext(LayoutContext)
  if (process.env.NODE_ENV !== 'production' && ctx === defaultContext) {
    console.error('useLayout must be used within a LayoutContext.Provider')
  }
  return ctx
}
