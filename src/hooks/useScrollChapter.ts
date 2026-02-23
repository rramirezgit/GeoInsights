import { useState, useRef, useEffect, useCallback } from 'react'

export function useScrollChapter() {
  const [activeChapter, setActiveChapter] = useState<string>('')
  const elementsRef = useRef<Map<string, HTMLElement>>(new Map())
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-chapter-id')
            if (id) setActiveChapter(id)
          }
        }
      },
      { threshold: 0.5 }
    )

    // Observe all registered elements
    for (const el of elementsRef.current.values()) {
      observerRef.current.observe(el)
    }

    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  const chapterRefs = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      if (el) {
        el.setAttribute('data-chapter-id', id)
        elementsRef.current.set(id, el)
        observerRef.current?.observe(el)
      } else {
        const existing = elementsRef.current.get(id)
        if (existing) {
          observerRef.current?.unobserve(existing)
          elementsRef.current.delete(id)
        }
      }
    },
    []
  )

  return { activeChapter, chapterRefs }
}
