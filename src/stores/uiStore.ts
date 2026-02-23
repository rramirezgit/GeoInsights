import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { DemoId } from '@/types/map.types'

interface UIStore {
  leftPanelOpen: boolean
  rightPanelOpen: boolean
  mobileMenuOpen: boolean
  activeDemo: DemoId | null

  toggleLeftPanel: () => void
  toggleRightPanel: () => void
  toggleMobileMenu: () => void
  setActiveDemo: (demo: DemoId | null) => void
}

const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024

export const useUIStore = create<UIStore>()(
  devtools(
    (set) => ({
      leftPanelOpen: isDesktop,
      rightPanelOpen: isDesktop,
      mobileMenuOpen: false,
      activeDemo: null,

      toggleLeftPanel: () => set((state) => ({ leftPanelOpen: !state.leftPanelOpen })),
      toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
      toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
      setActiveDemo: (demo) => set({ activeDemo: demo }),
    }),
    { name: 'ui-store' }
  )
)
