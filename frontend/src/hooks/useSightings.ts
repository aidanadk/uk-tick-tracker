import { useCallback, useEffect, useState } from 'react'
import type { Sighting } from '../types/sighting'
import { getElancoSightings, getSightings, toSighting } from '../api/sightings'

export function useSightings() {
  const [sightings, setSightings] = useState<Sighting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadSightings() {
      setIsLoading(true)
      setError(null)

      const [elanco, user] = await Promise.allSettled([
        getElancoSightings(controller.signal),
        getSightings({ limit: 2000 }, controller.signal),
      ])
      if (controller.signal.aborted) return

      const merged: Sighting[] = []
      if (elanco.status === 'fulfilled') merged.push(...elanco.value)
      if (user.status === 'fulfilled') merged.push(...user.value.map(toSighting))

      const failures = [elanco, user].filter((r) => r.status === 'rejected').length
      if (failures === 2) setError('Failed to load sightings')
      else if (failures === 1) setError('some sightings could not be loaded')

      setSightings(merged)
      setIsLoading(false)
    }

    loadSightings()
    return () => controller.abort()
  }, [reloadKey])

  const reload = useCallback(() => setReloadKey((k) => k + 1), [])

  return { sightings, isLoading, error, reload }
}