import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import FormField from './FormField'
import ReportLocationPicker from './ReportLocationPicker'

type LocationFieldProps = {
  position: [number, number] | null
  onPositionSelect: (position: [number, number]) => void
  locationError?: string
  positionError?: string
}

export default function LocationField({
  position,
  onPositionSelect,
  locationError,
  positionError,
}: LocationFieldProps) {
  return (
    <div className="space-y-3">
      <FormField
        id="location"
        label="Location"
        hint="Enter a town or place name, then select its position on the map."
        error={locationError}
      >
        <input
          id="location"
          name="location"
          type="text"
          required
          placeholder="Town, city or place"
          aria-invalid={Boolean(locationError)}
          aria-describedby={
            locationError ? 'location-hint location-error' : 'location-hint'
          }
          className="text-title w-full rounded-[4px] border border-[#A6A6A6] bg-white px-3 py-3 text-base focus-visible:outline-2 focus-visible:outline-offset-2"
        />
      </FormField>

      <div
        id="position"
        tabIndex={-1}
        className="relative h-[320px] overflow-hidden rounded-[4px] border border-[#A6A6A6]"
      >
        <MapContainer
          center={[54.5, -3]}
          zoom={6}
          minZoom={6}
          maxBounds={[
            [49.5, -9],
            [61, 2],
          ]}
          maxBoundsViscosity={1}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <ReportLocationPicker
            position={position}
            onPositionSelect={onPositionSelect}
          />
        </MapContainer>
      </div>

      <p role="status" className="text-text text-sm">
        {position
          ? 'Location selected. Click elsewhere to move the pin.'
          : 'Click the map to select the location.'}
      </p>

      {positionError && (
        <p className="text-sm text-red-700">{positionError}</p>
      )}
    </div>
  )
}
