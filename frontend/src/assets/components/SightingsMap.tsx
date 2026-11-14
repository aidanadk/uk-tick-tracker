import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { cityCoordinates } from '../../data/ukLocations'
import type { Sighting } from '../../types/sighting'

type SightingsMapProps = {
  sightings: Sighting[]
  onLocationSelect: (location: string) => void
}

export default function SightingsMap({
  sightings,
  onLocationSelect,
}: SightingsMapProps) {
  const locationCounts: Record<string, number> = {}
  for (const sighting of sightings) {
    const location = sighting.location
    if (locationCounts[location] === undefined) {
      locationCounts[location] = 1
    } else {
      locationCounts[location] += 1
    }
  }

  const markers: {
    location: string
    count: number
    position: [number, number]
  }[] = []
  for (const location in locationCounts) {
    const position = cityCoordinates[location]

    if (!position) {
      console.warn('Нет координат для города:', location)
      continue
    }

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

      {markers.map((marker) => (
        <CircleMarker
          key={marker.location}
          center={marker.position}
          radius={7}
          eventHandlers={{
            click: () => onLocationSelect(marker.location),
          }}
          pathOptions={{
            color: '#ffffff',
            weight: 2,
            fillColor: '#383838',
            fillOpacity: 1,
          }}
        >
          <Popup>
            <strong>{marker.location}</strong>
            <br />
            Sightings: {marker.count}
            <br />
            Approximate location · city centre
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
