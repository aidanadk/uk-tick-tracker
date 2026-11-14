import 'leaflet/dist/leaflet.css'
import Header from '../assets/components/Header'
import Sidebar from '../assets/components/Sidebar'
import SightingDetailsPanel from '../assets/components/SightingDetailsPanel'
import { useSightings } from '../hooks/useSightings'
import SightingsMap from '../assets/components/SightingsMap'
import { useState } from 'react'
import type { Sighting } from '../types/sighting'

function Map() {
  const { sightings, isLoading, error } = useSightings()
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  const selectedSightings: Sighting[] = sightings.filter(
    (sighting) => sighting.location.trim() === selectedLocation,
  )
  return (
    <div className="flex h-dvh flex-col">
      <Header />

      <div className="flex min-h-0 flex-1">
        <div className="shrink-0 overflow-y-auto">
          <Sidebar />
        </div>

        <div className="relative min-w-0 flex-1">
          <SightingsMap
            onLocationSelect={setSelectedLocation}
            sightings={sightings}
          ></SightingsMap>
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

export default Map
