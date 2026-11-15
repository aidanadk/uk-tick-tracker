import { CircleMarker, useMapEvents } from 'react-leaflet'

type ReportLocationPickerProps = {
  position: [number, number] | null
  onPositionSelect: (position: [number, number]) => void
}

export default function ReportLocationPicker({
  position,
  onPositionSelect,
}: ReportLocationPickerProps) {
  useMapEvents({
    click(event) {
      onPositionSelect([event.latlng.lat, event.latlng.lng])
    },
  })

  if (!position) return null

  return (
    <CircleMarker
      center={position}
      radius={10}
      interactive={false}
      pathOptions={{
        color: '#ffffff',
        weight: 3,
        fillColor: '#2563eb',
        fillOpacity: 1,
      }}
    ></CircleMarker>
  )
}
