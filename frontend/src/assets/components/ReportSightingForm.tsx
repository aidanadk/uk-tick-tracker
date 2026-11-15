import { useState } from 'react'
import type { FormEvent } from 'react'
import FormField from './FormField'
import ErrorSummary from './ErrorSummary'
import LocationField from './LocationField'
import { validateReport } from '../../utils/validateReport'
import {
  createSighting,
  uploadSightingImage,
  ValidationError,
} from '../../api/sightings'

const SPECIES = [
  'Fox/badger tick',
  'Marsh tick',
  'Passerine tick',
  'Southern rodent tick',
  'Tree-hole tick',
]

const FOUND_ON = ['Dog', 'Cat', 'Person', 'Other']

const inputClass =
  'text-title w-full rounded-[4px] border border-[#A6A6A6] bg-white px-3 py-3 text-base focus-visible:outline-2 focus-visible:outline-offset-2'

const fieldMap: Record<string, string> = {
  date_seen: 'date',
  location: 'location',
  latitude: 'position',
  longitude: 'position',
  species: 'species',
  tick_count: 'count',
  found_on: 'foundOn',
}

export default function ReportSightingForm() {
  const [position, setPosition] = useState<[number, number] | null>(null)
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget

    const data = new FormData(form)
    const date = String(data.get('date') ?? '')
    const location = String(data.get('location') ?? '').trim()
    const count = Number(data.get('count'))
    const foundOn = String(data.get('foundOn') ?? '')
    const file = data.get('photo') as File | null
    const photo = file && file.size > 0 ? file : null

    const nextErrors = validateReport(
      { date, location, position, count, foundOn, photo },
      today,
    )
    setErrors(nextErrors)
    setStatus('')
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      const saved = await createSighting({
        date_seen: date,
        species,
        location,
        latitude: position![0],
        longitude: position![1],
        tick_count: count,
        found_on: foundOn.toLowerCase() as 'dog' | 'cat' | 'person' | 'other',
      })
      form.reset()
      setPosition(null)
      setSpecies('Not sure')

      if (photo) {
        try {
          await uploadSightingImage(saved.id, photo)
        } catch {
          setStatus('Your sighting was saved, but the photo could not be uploaded.')
          return
        }
      }

      setStatus('Thank you! Your sighting has been submitted.')
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
      <p className="text-text text-sm">
        All fields are required unless marked optional.
      </p>

      <ErrorSummary errors={errors} />

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

      <LocationField
        position={position}
        onPositionSelect={(value) => {
          setPosition(value)
          setStatus('')
        }}
        locationError={errors.location}
        positionError={errors.position}
      />

      <div>
        <div className="mb-2 flex justify-end">
          <a
            href="/learn"
            className="text-title text-sm underline underline-offset-4"
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
            {SPECIES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </FormField>

        {species === 'Not sure' && (
          <p className="text-title mt-3 rounded-[4px] border border-[#A6A6A6] bg-[#F2F2F2] p-3 text-sm">
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

      <fieldset id="foundOn">
        <legend className="text-title text-base font-semibold">
          Found on
        </legend>

        <p className="text-text mt-1 text-sm">
          Select where the tick was found.
        </p>

        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {FOUND_ON.map((option) => (
            <label
              key={option}
              className="text-title flex cursor-pointer items-center gap-2 rounded-[4px] border border-[#A6A6A6] px-3 py-3 text-base has-[:checked]:border-[#383838] has-[:checked]:bg-[#F2F2F2]"
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

      <FormField
        id="photo"
        label="Photo (optional)"
        hint="A clear photo helps us confirm the species. JPEG, PNG or WebP, up to 5 MB."
        error={errors.photo}
      >
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-invalid={Boolean(errors.photo)}
          aria-describedby={errors.photo ? 'photo-hint photo-error' : 'photo-hint'}
          className="text-title w-full text-base file:mr-3 file:rounded-[4px] file:border file:border-[#A6A6A6] file:bg-white file:px-4 file:py-2"
        />
      </FormField>

      {status && (
        <p role="status" className="text-title text-base">
          {status}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 rounded-[4px] bg-[#383838] px-4 py-3 text-base font-medium text-white hover:bg-[#262626] disabled:opacity-50"
        >
          {submitting ? 'Submitting…' : 'Submit sighting'}
        </button>

        <a
          href="/"
          className="text-title rounded-[4px] border border-[#A6A6A6] px-8 py-3 text-base"
        >
          Back to map
        </a>
      </div>
    </form>
  )
}
