import 'leaflet/dist/leaflet.css'
import Header from '../assets/components/Header'
import Sidebar from '../assets/components/Sidebar'
import SightingDetailsPanel from '../assets/components/SightingDetailsPanel'
import { useSightings } from '../hooks/useSightings'
import SightingsMap from '../assets/components/SightingsMap'
import type { Sighting } from '../types/sighting'
import ReportSighting from '../assets/components/ReportSighting'
import type { SightingFilters } from '../types/sightingFilters'
import { useState } from 'react'

function MapPage() {
  const { sightings, isLoading, error, reload } = useSightings()
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [isReporting, setIsReporting] = useState(false)
  const [showReportForm, setShowReportForm] = useState(false)

  const [reportPosition, setReportPosition] = useState<[number, number] | null>(
    null,
  )
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

    const date = (sighting.date ?? '').slice(0, 10)

    if (filters.from || filters.to) {
      if (!Number.isFinite(Date.parse(sighting.date))) return false
      if (filters.from && date < filters.from) return false
      if (filters.to && date > filters.to) return false
    }

    if (filters.species && sighting.species !== filters.species) {
      return false
    }

    const search = filters.location.trim().toLowerCase()

    if (!sighting.location.toLowerCase().includes(search)) {
      return false
    }

    return true
  })
  const selectedSightings: Sighting[] = filteredSightings.filter(
    (sighting) => sighting.location.trim() === selectedLocation,
  )
  if (showReportForm) {
    return (
      <ReportSighting
        speciesOptions={speciesOptions}
        initialPosition={reportPosition}
        onSubmitted={() => {
          reload()
          setShowReportForm(false)
          setIsReporting(false)
          setReportPosition(null)
        }}
        onCancel={() => {
          setShowReportForm(false)
          setIsReporting(false)
          setReportPosition(null)
        }}
      />
    )
  }
  return (
    <div className="flex h-dvh flex-col">
      <Header
        onReportSighting={() => {
          setSelectedLocation(null)
          setShowReportForm(true)
        }}
      />

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
            isReporting={isReporting}
            reportPosition={reportPosition}
            onReportPositionSelect={setReportPosition}
          />
          {isReporting && (
            <div className="absolute right-3 top-3 z-[1000] max-w-[280px] rounded border border-[#D4D4D4] bg-white p-4 shadow">
              <p role="status" className="text-title text-[14px]">
                {reportPosition
                  ? 'Location selected. Click elsewhere on the map to move it.'
                  : 'Click the map to choose where you saw the tick.'}
              </p>

              {reportPosition && (
                <p className="text-text mt-2 text-[12px]">
                  Selected coordinates: {reportPosition[0].toFixed(4)},{' '}
                  {reportPosition[1].toFixed(4)}
                </p>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsReporting(false)
                  setReportPosition(null)
                }}
                className="text-title mt-3 text-[14px] underline underline-offset-4"
              >
                Cancel report
              </button>
            </div>
          )}
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
