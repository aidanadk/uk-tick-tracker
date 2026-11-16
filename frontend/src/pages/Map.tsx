import 'leaflet/dist/leaflet.css'
import Header from '../assets/components/Header'
import Sidebar from '../assets/components/Sidebar'
import SightingDetailsPanel from '../assets/components/SightingDetailsPanel'
import { useSightings } from '../hooks/useSightings'
import SightingsMap from '../assets/components/SightingsMap'
import type { Sighting } from '../types/sighting'
import type { SightingFilters } from '../types/sightingFilters'
import { useState } from 'react'

function MapPage() {
  const { sightings, isLoading, error } = useSightings()
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [filters, setFilters] = useState<SightingFilters>({
    from: '',
    to: '',
    species: '',
    location: '',
  })

  const speciesOptions = [
    ...new Set(sightings.map((sighting) => sighting.species)),
  ]
    .filter(Boolean)
    .sort()

  const invalidDateRange =
    Boolean(filters.from && filters.to) && filters.from > filters.to

  const filteredSightings = sightings.filter((sighting) => {
    if (invalidDateRange) return false
    if (filters.from && sighting.date < filters.from) return false
    if (filters.to && sighting.date > filters.to) return false
    if (filters.species && sighting.species !== filters.species) return false

    const search = filters.location.trim().toLowerCase()
    return sighting.location.toLowerCase().includes(search)
  })

  const selectedSightings: Sighting[] = filteredSightings.filter(
    (sighting) => sighting.location.trim() === selectedLocation,
  )
  return (
    <div className="flex h-dvh flex-col">
      <Header />

      <div className="flex min-h-0 flex-1">
        <div className="shrink-0 overflow-y-auto">
          <Sidebar
            filters={filters}
            onFiltersChange={(nextFilters) => {
              setFilters(nextFilters)
              setSelectedLocation(null)
            }}
            speciesOptions={speciesOptions}
            resultCount={filteredSightings.length}
            invalidDateRange={invalidDateRange}
          />
        </div>

        <div className="relative min-w-0 flex-1">
          <SightingsMap
            sightings={filteredSightings}
            selectedLocation={selectedLocation}
            onLocationSelect={setSelectedLocation}
          />
          {(isLoading || error) && (
            <p
              role={error ? 'alert' : 'status'}
              className="absolute left-14 top-3 z-[1000] rounded bg-white px-4 py-2 text-sm shadow"
            >
              {error
                ? `Could not load sightings: ${error}`
                : 'Loading sightings…'}
            </p>
          )}
        </div>
        <div className="shrink-0 overflow-y-auto">
          {selectedLocation && (
            <SightingDetailsPanel
              location={selectedLocation}
              sightings={selectedSightings}
              onClose={() => setSelectedLocation(null)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default MapPage
