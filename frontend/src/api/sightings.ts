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
  region: string | null
  latitude: number | null
  longitude: number | null
  location_precision: 'city' | 'exact'
  tick_count: number
  found_on: string | null
  source: 'user' | 'elanco'
  created_at: string
  image_url: string | null
}

export class ValidationError extends Error {
  fieldErrors: Record<string, string>
  constructor(fieldErrors: Record<string, string>) {
    super('Validation failed')
    this.fieldErrors = fieldErrors
  }
}

export async function uploadSightingImage(id: number, file: File) {
  const body = new FormData()
  body.append('file', file)

  const res = await fetch(`/api/sightings/${id}/image`, { method: 'POST', body })
  if (!res.ok) throw new Error('Could not upload the photo.')
  return res.json()
}

export async function createSighting(data: SightingInput): Promise<SightingOutput> {
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

export async function getSightings(): Promise<SightingOutput[]> {
  const res = await fetch('/api/sightings?limit=2000')
  if (!res.ok) throw new Error('Could not load sightings. Please try again.')
  return res.json()
}

export function toSighting(s: SightingOutput): Sighting {
  return {
    id: `${s.source}-${s.id}`,
    source: s.source,
    date: s.date_seen,
    latinName: s.latin_name ?? '',
    location: s.location,
    species: s.species,
    region: s.region,
    imageUrl: s.image_url,
    position:
      s.latitude != null && s.longitude != null
        ? [s.latitude, s.longitude]
        : undefined,
  }
}
