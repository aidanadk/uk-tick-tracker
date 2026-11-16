import type { SightingFilters } from '../../types/sightingFilters'

type SidebarProps = {
  filters: SightingFilters
  onFiltersChange: (filters: SightingFilters) => void
  speciesOptions: string[]
  resultCount: number
  invalidDateRange: boolean
}

function formatInputDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default function Sidebar({
  filters,
  onFiltersChange,
  speciesOptions,
  resultCount,
  invalidDateRange,
}: SidebarProps) {
  const inputStyle =
    'w-full min-w-0 rounded-[4px] border border-[#A6A6A6] p-[10px]'

  const buttonStyle =
    'text-title w-full rounded-[4px] border border-[#A6A6A6] py-[15px] hover:bg-black/5'

  function changeFilter(
    field: keyof SightingFilters,
    value: string,
  ) {
    onFiltersChange({
      ...filters,
      [field]: value,
    })
  }

  function selectLastDays(days: number) {
    const end = new Date()
    const start = new Date(end)

    start.setDate(start.getDate() - (days - 1))

    onFiltersChange({
      ...filters,
      from: formatInputDate(start),
      to: formatInputDate(end),
    })
  }

  function selectThisYear() {
    const today = new Date()
    const start = new Date(today.getFullYear(), 0, 1)

    onFiltersChange({
      ...filters,
      from: formatInputDate(start),
      to: formatInputDate(today),
    })
  }

  function resetFilters() {
    onFiltersChange({
      from: '',
      to: '',
      species: '',
      location: '',
    })
  }

  return (
    <section className="w-[356px] shrink-0 border-r border-[#D4D4D4] p-[26px]">
      <h2 className="text-title text-2xl font-bold">
        Filters
      </h2>

      <div className="mt-[22px] border-b border-[#D4D4D4] pb-6">
        <h3 className="text-title text-base font-bold">
          Date range
        </h3>

        <div className="mt-4 grid grid-cols-2 gap-[15px]">
          <div className="flex min-w-0 flex-col gap-2">
            <label
              htmlFor="date-from"
              className="text-text text-base font-medium"
            >
              From
            </label>

            <input
              id="date-from"
              type="date"
              value={filters.from}
              onChange={(event) =>
                changeFilter('from', event.target.value)
              }
              aria-invalid={invalidDateRange}
              aria-describedby={
                invalidDateRange ? 'date-range-error' : undefined
              }
              className={inputStyle}
            />
          </div>

          <div className="flex min-w-0 flex-col gap-2">
            <label
              htmlFor="date-to"
              className="text-text text-base font-medium"
            >
              To
            </label>

            <input
              id="date-to"
              type="date"
              value={filters.to}
              onChange={(event) =>
                changeFilter('to', event.target.value)
              }
              aria-invalid={invalidDateRange}
              aria-describedby={
                invalidDateRange ? 'date-range-error' : undefined
              }
              className={inputStyle}
            />
          </div>
        </div>

        {invalidDateRange && (
          <p
            id="date-range-error"
            role="alert"
            className="mt-2 text-sm text-red-700"
          >
            The end date must be on or after the start date.
          </p>
        )}

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => selectLastDays(7)}
            className={buttonStyle}
          >
            Last 7 days
          </button>

          <button
            type="button"
            onClick={() => selectLastDays(30)}
            className={buttonStyle}
          >
            Last 30 days
          </button>

          <button
            type="button"
            onClick={selectThisYear}
            className={buttonStyle}
          >
            This year
          </button>
        </div>
      </div>

      <div className="mt-[22px] border-b border-[#D4D4D4] pb-6">
        <label
          htmlFor="species"
          className="text-title block text-base font-bold"
        >
          Species
        </label>

        <select
          id="species"
          name="species"
          value={filters.species}
          onChange={(event) =>
            changeFilter('species', event.target.value)
          }
          className="text-title mt-4 w-full rounded-[4px] border border-[#A6A6A6] p-[10px]"
        >
          <option value="">All species</option>

          {speciesOptions.map((species) => (
            <option key={species} value={species}>
              {species}
            </option>
          ))}
        </select>

        <p className="text-text mt-3 text-sm">
          Select a species or show all.
        </p>
      </div>

      <div className="mt-[22px] flex flex-col gap-3 border-b border-[#D4D4D4] pb-6">
        <label
          htmlFor="location-search"
          className="text-title text-base font-bold"
        >
          Location
        </label>

        <p id="location-search-hint" className="text-text text-sm">
          Search by town or city name.
        </p>

        <input
          id="location-search"
          type="search"
          placeholder="Search location"
          value={filters.location}
          onChange={(event) =>
            changeFilter('location', event.target.value)
          }
          aria-describedby="location-search-hint"
          className={inputStyle}
        />

        <button
          type="button"
          onClick={resetFilters}
          className="text-title w-full py-[14px] underline underline-offset-4"
        >
          Reset filters
        </button>
      </div>

      <div className="mt-[22px] pb-6" role="status">
        <p className="text-title text-base font-bold">
          Showing {resultCount.toLocaleString('en-GB')}{' '}
          {resultCount === 1 ? 'sighting' : 'sightings'}
        </p>

        <p className="text-text mt-1 text-sm">
          {resultCount === 0
            ? 'Try changing or resetting your filters.'
            : 'Filters apply to the map and city details.'}
        </p>
      </div>
    </section>
  )
}