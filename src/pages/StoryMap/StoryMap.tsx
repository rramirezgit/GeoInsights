import { useRef, useEffect, useCallback } from 'react'
import Map, { type MapRef } from 'react-map-gl/mapbox'
import { MAPBOX_TOKEN, MAP_STYLES } from '@/constants/mapbox'
import { CHAPTERS } from './chapters.data'
import type { Chapter } from './chapters.data'
import 'mapbox-gl/dist/mapbox-gl.css'

interface StoryMapProps {
  activeChapterId: string
}

export function StoryMap({ activeChapterId }: StoryMapProps) {
  const mapRef = useRef<MapRef>(null)
  const prevChapterRef = useRef<string>('')

  const flyToChapter = useCallback((chapter: Chapter) => {
    const map = mapRef.current?.getMap()
    if (!map) return

    map.flyTo({
      center: [chapter.coordinates.longitude, chapter.coordinates.latitude],
      zoom: chapter.zoom,
      pitch: chapter.pitch,
      bearing: chapter.bearing,
      speed: 0.8,
      curve: 1.5,
      essential: true,
    })
  }, [])

  useEffect(() => {
    if (!activeChapterId || activeChapterId === prevChapterRef.current) return

    const chapter = CHAPTERS.find((c) => c.id === activeChapterId)
    if (chapter) {
      flyToChapter(chapter)
      prevChapterRef.current = activeChapterId
    }
  }, [activeChapterId, flyToChapter])

  const initial = CHAPTERS[0]

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: initial.coordinates.longitude,
        latitude: initial.coordinates.latitude,
        zoom: initial.zoom,
        pitch: initial.pitch,
        bearing: initial.bearing,
      }}
      mapboxAccessToken={MAPBOX_TOKEN}
      mapStyle={MAP_STYLES.dark}
      interactive={false}
      style={{ width: '100%', height: '100%' }}
      attributionControl={false}
    />
  )
}
