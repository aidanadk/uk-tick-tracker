import { useEffect, useState } from 'react'
import {
  getLocations,
  getSeasonalActivity,
  type MonthCount,
  type UkLocation,
} from '../../api/stats'

export default function SeasonalChart() {
  const [locations, setLocations] = useState<UkLocation[]>([])
  const [location, setLocation] = useState('')
  const [months, setMonths] = useState<MonthCount[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    getLocations()
      .then(setLocations)
      .catch((err) => setError(err.message))
  }, [])

  useEffect(() => {
    getSeasonalActivity(location)
      .then(setMonths)
      .catch((err) => setError(err.message))
  }, [location])

  const maxCount = Math.max(1, ...months.map((m) => m.count))
  const placeName = location || 'the UK'

  return (
    <>
      <label
        htmlFor="activity-location"
        className="text-title mt-4 block text-base"
      >
        Choose a location
      </label>

      <select
        id="activity-location"
        value={location}
        onChange={(event) => {
          setError('')
          setLocation(event.target.value)
        }}
        className="text-title mt-2 w-full max-w-[300px] rounded-[4px] border border-[#A6A6A6] bg-white px-3 py-3 text-base"
      >
        <option value="">All UK locations</option>
        {locations.map((loc) => (
          <option key={loc.name} value={loc.name}>
            {loc.name}
          </option>
        ))}
      </select>

      <h3 className="text-title mt-6 text-base font-medium">
        Sightings per month in {placeName} (all years combined)
      </h3>

      {error && <p className="mt-5 text-base text-red-700">{error}</p>}

      <div className="relative mt-5 grid grid-cols-12 gap-2 px-2 sm:gap-5">
        {months.map((item) => (
          <div key={item.month}>
            <div className="flex h-[120px] flex-col items-center justify-end border-b border-[#E5E5E5]">
              <span className="text-text mb-1 text-sm">{item.count}</span>
              <div
                className="w-full max-w-[44px] rounded-t-[3px] bg-[#909090]"
                style={{ height: `${(item.count / maxCount) * 100}%` }}
              />
            </div>

            <p className="text-text mt-3 text-center text-sm">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      <p className="text-text mt-6 max-w-[760px] text-base leading-6">
        This chart uses the sample dataset, which is spread fairly evenly
        across the year. In reality, UK tick activity usually peaks in spring
        and early autumn.
      </p>
    </>
  )
}
