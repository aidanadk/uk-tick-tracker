import { useState } from 'react'
import type { FormEvent } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import FormField from './FormField'
import ReportLocationPicker from './ReportLocationPicker'
import { createSighting, ValidationError } from '../../api/sightings'

type ReportSightingFormProps = {
  onCancel: () => void
  onSubmitted: () => void
  speciesOptions: string[]
  initialPosition?: [number, number] | null
}

export default function ReportSightingForm({
  onSubmitted,
  onCancel,
  speciesOptions,
  initialPosition = null,
}: ReportSightingFormProps) {
  const [position, setPosition] = useState<[number, number] | null>(
    initialPosition,
  )
  const [species, setSpecies] = useState('Not sure')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const now = new Date()
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-')

  const inputClass =
    'text-title w-full rounded-[4px] border border-[#A6A6A6] bg-white px-3 py-3 text-[14px] focus-visible:outline-2 focus-visible:outline-offset-2'

  const availableSpecies = [...new Set(speciesOptions)]
    .filter((name) => name && name !== 'Not sure')
    .sort()

  const fieldMap: Record<string, string> = {
    date_seen: 'date',
    location: 'location',
    latitude: 'position',
    longitude: 'position',
    species: 'species',
    tick_count: 'count',
    found_on: 'foundOn',
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget

    const data = new FormData(form)
    const date = String(data.get('date') ?? '')
    const location = String(data.get('location') ?? '').trim()
    const count = Number(data.get('count'))
    const foundOn = String(data.get('foundOn') ?? '')

    const nextErrors: Record<string, string> = {}
    if (!date || date > today)
      nextErrors.date = 'Choose today or an earlier date.'
    if (!location) nextErrors.location = 'Enter a town or place name.'
    if (!position) nextErrors.position = 'Select the location on the map.'
    if (!Number.isInteger(count) || count < 1)
      nextErrors.count = 'Enter a whole number of at least 1.'
    if (!foundOn) nextErrors.foundOn = 'Select where the tick was found.'

    setErrors(nextErrors)
    setStatus('')
    if (Object.keys(nextErrors).length > 0) return
    setSubmitting(true)
    try {
      await createSighting({
        date_seen: date,
        species,
        location,
        latitude: position![0],
        longitude: position![1],
        tick_count: count,
        found_on: foundOn.toLowerCase() as 'dog' | 'cat' | 'person' | 'other',
      })
      setStatus('Thank you! Your sighting has been submitted.')
      form.reset()
      setPosition(null)
      setSpecies('Not sure')
      onSubmitted()
    } catch (err) {
      if (err instanceof ValidationError) {
        const serverErrors: Record<string, string> = {}
        for (const [field, message] of Object.entries(err.fieldErrors)) {
          serverErrors[fieldMap[field] ?? 'form'] = message
        }
        setErrors(serverErrors)
      } else {
        setStatus((err as Error).message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <p className="text-text text-[12px]">
        All fields are required unless marked optional.
      </p>

      {Object.keys(errors).length > 0 && (
        <div
          role="alert"
          className="rounded border border-[#383838] border-l-4 bg-[#F2F2F2] p-3"
        >
          <h2 className="text-title text-[14px] font-semibold">
            Please fix {Object.keys(errors).length}{' '}
            {Object.keys(errors).length === 1 ? 'error' : 'errors'} before
            submitting
          </h2>

          <ul className="mt-2 space-y-1 text-[12px]">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>
                <a href={`#${field}`} className="underline">
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <FormField
        id="date"
        label="Date seen"
        hint="Choose today or an earlier date."
        error={errors.date}
      >
        <input
          id="date"
          name="date"
          type="date"
          required
          max={today}
          aria-invalid={Boolean(errors.date)}
          aria-describedby={errors.date ? 'date-hint date-error' : 'date-hint'}
          className={inputClass}
        />
      </FormField>

      <div className="space-y-3">
        <FormField
          id="location"
          label="Location"
          hint="Enter a town or place name, then select its position on the map."
          error={errors.location}
        >
          <input
            id="location"
            name="location"
            type="text"
            required
            placeholder="Town, city or place"
            aria-invalid={Boolean(errors.location)}
            aria-describedby={
              errors.location ? 'location-hint location-error' : 'location-hint'
            }
            className={inputClass}
          />
        </FormField>

        <div
          id="position"
          tabIndex={-1}
          className="relative h-[320px] overflow-hidden rounded-[4px] border border-[#A6A6A6]"
        >
          <MapContainer
            center={initialPosition ?? [54.5, -3]}
            zoom={initialPosition ? 12 : 6}
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
              onPositionSelect={(value) => {
                setPosition(value)
                setStatus('')
              }}
            />
          </MapContainer>
        </div>

        <p role="status" className="text-text text-[12px]">
          {position
            ? 'Location selected. Click elsewhere to move the pin.'
            : 'Click the map to select the location.'}
        </p>

        {errors.position && (
          <p className="text-[12px] text-red-700">{errors.position}</p>
        )}
      </div>

      <div>
        <div className="mb-2 flex justify-end">
          <a
            href="/learn"
            className="text-title text-[12px] underline underline-offset-4"
          >
            Help me identify →
          </a>
        </div>

        <FormField
          id="species"
          label="Species"
          hint="Choose a species, or select “Not sure” if you cannot identify it."
        >
          <select
            id="species"
            name="species"
            value={species}
            onChange={(event) => setSpecies(event.target.value)}
            className={inputClass}
          >
            <option value="Not sure">Not sure</option>

            {availableSpecies.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </FormField>

        {species === 'Not sure' && (
          <p className="text-title mt-3 rounded-[4px] border border-[#A6A6A6] bg-[#F2F2F2] p-3 text-[12px]">
            Not sure? Your report will be marked as unverified.
          </p>
        )}
      </div>

      <FormField
        id="count"
        label="Number of ticks"
        hint="Enter the total number you saw (at least 1)."
        error={errors.count}
      >
        <input
          id="count"
          name="count"
          type="number"
          min="1"
          step="1"
          defaultValue="1"
          required
          aria-invalid={Boolean(errors.count)}
          aria-describedby={
            errors.count ? 'count-hint count-error' : 'count-hint'
          }
          className={inputClass}
        />
      </FormField>

      <fieldset>
        <legend className="text-title text-[14px] font-semibold">
          Found on
        </legend>

        <p className="text-text mt-1 text-[12px]">
          Select where the tick was found.
        </p>

        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {['Dog', 'Cat', 'Person', 'Other'].map((option) => (
            <label
              key={option}
              className="text-title flex cursor-pointer items-center gap-2 rounded-[4px] border border-[#A6A6A6] px-3 py-3 text-[14px] has-[:checked]:border-[#383838] has-[:checked]:bg-[#F2F2F2]"
            >
              <input
                type="radio"
                name="foundOn"
                value={option}
                required
                className="accent-[#383838]"
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>

      {status && (
        <p role="status" className="text-title text-[14px]">
          {status}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 rounded-[4px] bg-[#383838] px-4 py-3 text-[14px] font-medium text-white hover:bg-[#262626] disabled:opacity-50"
        >
          {submitting ? 'Submitting…' : 'Submit sighting'}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="text-title rounded-[4px] border border-[#A6A6A6] px-8 py-3 text-[14px]"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
