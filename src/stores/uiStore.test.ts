import { describe, it, expect, beforeEach } from 'vitest'
import { useUIStore } from './uiStore'

describe('uiStore', () => {
  beforeEach(() => {
    useUIStore.setState({
      leftPanelOpen: true,
      rightPanelOpen: true,
      mobileMenuOpen: false,
      activeDemo: null,
    })
  })

  it('toggles the left panel independently', () => {
    useUIStore.getState().toggleLeftPanel()
    expect(useUIStore.getState().leftPanelOpen).toBe(false)
    expect(useUIStore.getState().rightPanelOpen).toBe(true)
  })

  it('toggles the right panel back and forth', () => {
    useUIStore.getState().toggleRightPanel()
    useUIStore.getState().toggleRightPanel()
    expect(useUIStore.getState().rightPanelOpen).toBe(true)
  })

  it('toggles the mobile menu', () => {
    useUIStore.getState().toggleMobileMenu()
    expect(useUIStore.getState().mobileMenuOpen).toBe(true)
  })

  it('tracks the active demo', () => {
    useUIStore.getState().setActiveDemo('heatmap')
    expect(useUIStore.getState().activeDemo).toBe('heatmap')

    useUIStore.getState().setActiveDemo(null)
    expect(useUIStore.getState().activeDemo).toBeNull()
  })
})
