import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { cityCoordinates } from '../../data/ukLocations'
import type { Sighting } from '../../types/sighting'

type SightingsMapProps = {
  sightings: Sighting[]
  selectedLocation: string | null
  onLocationSelect: (location: string) => void
}

export default function SightingsMap({
  sightings,
  selectedLocation,
  onLocationSelect,
}: SightingsMapProps) {
  const locationCounts: Record<string, number> = {}
  const fallbackPositions: Record<string, [number, number]> = {}

  for (const sighting of sightings) {
    const location = sighting.location.trim()
    if (!location) continue

    locationCounts[location] = (locationCounts[location] ?? 0) + 1
    if (sighting.position && !fallbackPositions[location]) {
      fallbackPositions[location] = sighting.position
    }
  }

  const markers: {
    location: string
    count: number
    position: [number, number]
  }[] = []

  for (const location in locationCounts) {
    const position = cityCoordinates[location] ?? fallbackPositions[location]

    if (!position) continue

    markers.push({
      location,
      count: locationCounts[location],
      position,
    })
  }

  return (
    <MapContainer
      maxBounds={[
        [49.5, -9],
        [61, 2],
      ]}
      maxBoundsViscosity={1}
      center={[54.5, -3]}
      zoom={6}
      minZoom={6}
      style={{ position: 'absolute', inset: 0 }}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {markers.map((marker) => {
        const isSelected = selectedLocation === marker.location

        return (
          <CircleMarker
            key={marker.location}
            center={marker.position}
            radius={isSelected ? 22 : 18}
            eventHandlers={{
              click: () => onLocationSelect(marker.location),
            }}
            pathOptions={{
              color: isSelected ? '#383838' : '#ffffff',
              weight: isSelected ? 4 : 2,
              fillColor: isSelected ? '#ffffff' : '#383838',
              fillOpacity: 1,
              className: 'sighting-marker',
            }}
          >
            <Tooltip
              permanent
              direction="center"
              opacity={1}
              className="sighting-marker-count"
            >
              <span
                style={{
                  color: isSelected ? '#383838' : '#ffffff',
                }}
              >
                {marker.count}
              </span>
            </Tooltip>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
