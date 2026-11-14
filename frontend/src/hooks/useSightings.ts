import { useEffect, useState } from 'react'
import type { Sighting } from '../types/sighting'

export function useSightings() {
  const [sightings, setSightings] = useState<Sighting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadSightings() {
      try {
        const response = await fetch(
          'https://dev-task.elancoapps.com/data/tick-sightings',
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data: Sighting[] = await response.json()

        if (!controller.signal.aborted) {
          setSightings(data)
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(
            error instanceof Error
              ? error.message
              : 'Failed to load sightings',
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadSightings()

    return () => controller.abort()
  }, [])

  return { sightings, isLoading, error }
}