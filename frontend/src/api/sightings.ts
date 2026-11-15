import type { Sighting } from '../types/sighting'

export interface SightingInput {
  date_seen: string
  species: string
  location: string
  latitude?: number
  longitude?: number
  tick_count: number
  found_on: 'dog' | 'cat' | 'person' | 'other'
}

export interface SightingOutput {
  id: number
  date_seen: string
  latin_name: string | null
  species: string
  location: string
  latitude: number | null
  longitude: number | null
  location_precision: 'city' | 'exact'
  tick_count: number
  found_on: string | null
  source: 'user' | 'elanco'
  created_at: string
}

export interface SightingFilters {
  from?: string
  to?: string
  species?: string
  location?: string
  limit?: number
}

export class ValidationError extends Error {
  fieldErrors: Record<string, string>
  constructor(fieldErrors: Record<string, string>) {
    super('Validation failed')
    this.fieldErrors = fieldErrors
  }
}

export async function createSighting(data: SightingInput) {
  const res = await fetch('/api/sightings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (res.status === 422) {
    const body = await res.json()
    throw new ValidationError(body.errors)
  }
  if (!res.ok) {
    throw new Error('Something went wrong. Please try again.')
  }
  return res.json()
}

export async function getSightings(
  filters: SightingFilters = {},
  signal?: AbortSignal,
): Promise<SightingOutput[]> {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== '') params.set(key, String(value))
  }

  const res = await fetch(`/api/sightings?${params}`, { signal })

  if (res.status === 422) {
    throw new Error('Some filters are invalid. Please check the dates.')
  }
  if (!res.ok) {
    throw new Error('Could not load sightings. Please try again.')
  }
  return res.json()
}

const ELANCO_URL = 'https://dev-task.elancoapps.com/data/tick-sightings'
export async function getElancoSightings(
  signal?: AbortSignal,
): Promise<Sighting[]> {
  const res = await fetch(ELANCO_URL, { signal })
  if (!res.ok) throw new Error(`Elanco API: HTTP ${res.status}`)
  const data: Omit<Sighting, 'source'>[] = await res.json()
  return data.map((s) => ({ ...s, source: 'elanco' }))
}

export function toSighting(s: SightingOutput): Sighting {
  return {
    id: `user-${s.id}`,
    date: s.date_seen,
    latinName: s.latin_name ?? '',
    location: s.location,
    species: s.species,
    source: 'user',
    position:
      s.latitude != null && s.longitude != null
        ? [s.latitude, s.longitude]
        : undefined,
  }
}
