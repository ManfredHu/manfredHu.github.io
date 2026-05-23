import { createContext, useContext } from 'react'

interface LayoutContextType {
  sidebarOpen: boolean
  toggleSidebar: () => void
  closeSidebar: () => void
}

export const LayoutContext = createContext<LayoutContextType>({
  sidebarOpen: false,
  toggleSidebar: () => {},
  closeSidebar: () => {},
})

export const useLayout = () => useContext(LayoutContext)
