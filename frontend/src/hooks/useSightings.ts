import { useEffect, useState } from 'react'
import type { Sighting } from '../types/sighting'
import { getSightings, toSighting } from '../api/sightings'

export function useSightings() {
  const [sightings, setSightings] = useState<Sighting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getSightings()
      .then((data) => setSightings(data.map(toSighting)))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  return { sightings, isLoading, error }
}
