import { describe, it, expect, beforeEach } from 'vitest'
import { useMapStore } from './mapStore'
import { ARGENTINA_CENTER } from '@/constants/mapbox'

describe('mapStore', () => {
  beforeEach(() => {
    useMapStore.getState().resetViewport()
    useMapStore.getState().setBaseStyle('dark')
  })

  it('starts centered on Argentina with the dark style', () => {
    const { viewport, baseStyle } = useMapStore.getState()
    expect(viewport).toEqual(ARGENTINA_CENTER)
    expect(baseStyle).toBe('dark')
  })

  it('merges partial viewport updates', () => {
    useMapStore.getState().setViewport({ zoom: 10 })
    const { viewport } = useMapStore.getState()
    expect(viewport.zoom).toBe(10)
    expect(viewport.longitude).toBe(ARGENTINA_CENTER.longitude)
  })

  it('changes the base style', () => {
    useMapStore.getState().setBaseStyle('satellite')
    expect(useMapStore.getState().baseStyle).toBe('satellite')
  })

  it('flies to coordinates with default zoom and a transition', () => {
    useMapStore.getState().flyTo([-58.38, -34.6])
    const { viewport } = useMapStore.getState()
    expect(viewport.longitude).toBe(-58.38)
    expect(viewport.latitude).toBe(-34.6)
    expect(viewport.zoom).toBe(12)
    expect(viewport.transitionDuration).toBe(2000)
  })

  it('flies to coordinates with custom zoom and pitch', () => {
    useMapStore.getState().flyTo([-73.05, -50.5], 14, 60)
    const { viewport } = useMapStore.getState()
    expect(viewport.zoom).toBe(14)
    expect(viewport.pitch).toBe(60)
  })

  it('resets the viewport back to Argentina', () => {
    useMapStore.getState().flyTo([-58.38, -34.6])
    useMapStore.getState().resetViewport()
    expect(useMapStore.getState().viewport).toEqual(ARGENTINA_CENTER)
  })
})
