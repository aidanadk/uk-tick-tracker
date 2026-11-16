import { useState } from 'react'
import type { Sighting } from '../../types/sighting'
import {
  getMonthlyTrends,
  getWeeklyTrends,
} from '../../utils/sightingTrends'

type SightingDetailsPanelProps = {
  location: string
  sightings: Sighting[]
  onClose: () => void
}

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export default function SightingDetailsPanel({
  location,
  sightings,
  onClose,
}: SightingDetailsPanelProps) {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('monthly')
  const [shareMessage, setShareMessage] = useState('')

  const directionsUrl =
    'https://www.google.com/maps/dir/?api=1&destination=' +
    encodeURIComponent(location + ', UK')

  async function handleShare() {
    const text = `${sightings.length} tick sightings in ${location}: ${window.location.origin}`
    try {
      await navigator.clipboard.writeText(text)
      setShareMessage('Link copied!')
    } catch {
      setShareMessage('Could not copy the link.')
    }
  }

  const newestFirst = [...sightings].sort((a, b) => b.date.localeCompare(a.date))
  const chartEnd =
    newestFirst.length > 0 ? new Date(newestFirst[0].date) : new Date()

  const trends =
    period === 'monthly'
      ? getMonthlyTrends(sightings, chartEnd)
      : getWeeklyTrends(sightings, chartEnd)

  const hasActivity = trends.some((item) => item.count > 0)
  const maxCount = Math.max(1, ...trends.map((item) => item.count))

  const recentSightings = newestFirst.slice(0, 7)

  return (
    <section className="w-[400px] shrink-0 border-r border-[#D4D4D4] p-[26px]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-title text-2xl font-bold">{location}</h2>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close sighting details"
          className="text-text flex h-9 w-9 shrink-0 items-center justify-center rounded hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <p className="text-title text-xl font-bold">
          {sightings.length}
          <span className="ml-1 text-base font-medium">
            {sightings.length === 1 ? 'sighting' : 'sightings'}
          </span>
        </p>

        <p className="text-text mt-1 text-sm">
          Approximate location, city centre
        </p>
      </div>

      <div className="mt-[22px] border-b border-[#A6A6A6] pb-6">
        <div className="flex gap-2">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-title flex-1 rounded-[4px] border border-[#A6A6A6] py-[15px] text-center"
          >
            Get directions
          </a>

          <button
            type="button"
            onClick={handleShare}
            className="text-title flex-1 rounded-[4px] border border-[#A6A6A6] py-[15px]"
          >
            Share
          </button>
        </div>

        <p role="status" className="text-text mt-2 text-sm">
          {shareMessage}
        </p>
      </div>

      <div className="mt-6">
        <h3 className="text-text text-xl font-bold">
          Activity in this area
        </h3>

        <div className="mt-3 flex overflow-hidden rounded-[4px] border border-[#383838]">
          {(['weekly', 'monthly'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setPeriod(option)}
              aria-pressed={period === option}
              className={`flex-1 py-2 text-sm font-medium ${
                period === option
                  ? 'bg-[#383838] text-white'
                  : 'text-title bg-white hover:bg-[#F2F2F2]'
              }`}
            >
              {option === 'weekly' ? 'Weekly' : 'Monthly'}
            </button>
          ))}
        </div>

        <div className="mt-5 border-b border-[#D4D4D4] pb-6">
          <p className="text-text text-sm">
            {period === 'monthly' ? 'Sightings per month' : 'Sightings per week'}
            {newestFirst.length > 0 && ` · up to ${formatDate(chartEnd)}`}
          </p>

          <div className="mt-4 grid grid-cols-12 gap-1">
            {trends.map((item, index) => (
              <div key={item.key} title={`${item.label}: ${item.count}`}>
                <div className="flex h-[140px] flex-col items-center justify-end border-b border-[#D4D4D4]">
                  {item.count > 0 && (
                    <span className="text-text mb-1 text-xs">{item.count}</span>
                  )}
                  <div
                    className="w-full max-w-[20px] rounded-t-[2px] bg-[#383838]"
                    style={{ height: `${(item.count / maxCount) * 100}%` }}
                  />
                </div>

                <p className="text-text mt-2 text-center text-xs">
                  {period === 'weekly' && index % 2 !== 0 ? '' : item.label}
                </p>
              </div>
            ))}
          </div>

          {!hasActivity && (
            <p className="text-text mt-2 text-center text-sm">
              No sightings recorded during this period.
            </p>
          )}
        </div>

        <div className="mt-5">
          <h3 className="text-title text-lg font-bold">
            Recent sightings in {location}
          </h3>

          <ul className="mt-2 divide-y divide-[#D4D4D4]">
            {recentSightings.map((sighting) => (
              <li
                key={sighting.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <span className="text-title text-sm font-medium">
                  {sighting.species || 'Unknown species'}
                </span>

                <time
                  dateTime={sighting.date}
                  className="text-text whitespace-nowrap text-sm"
                >
                  {formatDate(sighting.date)}
                </time>
              </li>
            ))}
          </ul>

          {recentSightings.length === 0 && (
            <p className="text-text mt-3 text-sm">
              No sightings yet.
            </p>
          )}

          <a
            href="/learn"
            className="text-title mt-4 inline-block text-base underline underline-offset-4"
          >
            Learn how to identify ticks →
          </a>
        </div>
      </div>
    </section>
  )
}