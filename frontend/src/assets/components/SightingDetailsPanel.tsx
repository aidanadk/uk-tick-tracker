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

  const now = new Date()

  // Find the latest valid sighting for this city.
  const latestTimestamp = sightings.reduce<number | null>(
    (latest, sighting) => {
      const timestamp = Date.parse(sighting.date)

      if (!Number.isFinite(timestamp) || timestamp > now.getTime()) {
        return latest
      }

      return latest === null ? timestamp : Math.max(latest, timestamp)
    },
    null,
  )

  // Anchor both chart periods to the latest sighting.
  const chartEnd =
    latestTimestamp === null ? now : new Date(latestTimestamp)

  const trends =
    period === 'monthly'
      ? getMonthlyTrends(sightings, chartEnd)
      : getWeeklyTrends(sightings, chartEnd)

  const hasActivity = trends.some((item) => item.count > 0)
  const maxCount = Math.max(2, ...trends.map((item) => item.count))
  const chartMax = Math.ceil(maxCount / 2) * 2

  const getX = (index: number) =>
    28 + (index * 304) / Math.max(1, trends.length - 1)

  const getY = (count: number) => 70 - (count / chartMax) * 60

  const chartPoints = trends
    .map((item, index) => `${getX(index)},${getY(item.count)}`)
    .join(' ')

  const recentSightings = sightings
    .filter((sighting) => Number.isFinite(Date.parse(sighting.date)))
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, 7)

  return (
    <section className="w-[400px] shrink-0 border-r border-[#D4D4D4] p-[26px]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-title text-[24px] font-bold">{location}</h2>

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
        <p className="text-title text-[20px] font-bold">
          {sightings.length}
          <span className="ml-1 text-[16px] font-medium">
            {sightings.length === 1 ? 'sighting' : 'sightings'}
          </span>
        </p>

        <p className="text-text mt-1 text-[12px]">
          Approximate location, city centre
        </p>
      </div>

      {/* Directions and sharing handlers can be added later. */}
      <div className="mt-[22px] flex gap-2 border-b border-[#A6A6A6] pb-6">
        <button
          type="button"
          className="text-title flex-1 rounded-[4px] border border-[#A6A6A6] py-[15px]"
        >
          Get directions
        </button>

        <button
          type="button"
          className="text-title flex-1 rounded-[4px] border border-[#A6A6A6] py-[15px]"
        >
          Share
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-text text-[20px] font-bold">
          Activity in this area
        </h3>

        <div className="mt-2 flex gap-2">
          {(['weekly', 'monthly'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setPeriod(option)}
              aria-pressed={period === option}
              className={`flex-1 rounded-[4px] border py-[15px] ${
                period === option
                  ? 'border-[#383838] bg-[#383838] text-white'
                  : 'text-title border-[#A6A6A6]'
              }`}
            >
              {option === 'weekly' ? 'Weekly' : 'Monthly'}
            </button>
          ))}
        </div>

        <div className="mt-5 border-b border-[#D4D4D4] pb-6">
          <p className="text-text text-[12px]">
            {period === 'monthly'
              ? 'Sightings per month · 12 calendar months'
              : 'Sightings per week · 12 calendar weeks'}
          </p>

          <p className="text-text mt-1 text-[11px]">
            {latestTimestamp === null
              ? 'No valid, non-future sightings available'
              : `Period ending with latest sighting: ${formatDate(chartEnd)}`}
          </p>

          {latestTimestamp !== null && (
            <p className="text-text mt-1 text-[11px]">
              {period === 'monthly'
                ? 'Final month includes records through this date'
                : 'Weeks start Monday · final week includes records through this date'}
            </p>
          )}

          <svg
            viewBox="0 0 340 110"
            className="mt-3 block w-full"
            role="img"
            aria-label={`${period} sightings in ${location}`}
          >
            <title>
              {period === 'monthly' ? 'Monthly' : 'Weekly'} sightings in{' '}
              {location}
            </title>

            <desc>
              {latestTimestamp === null
                ? 'No valid, non-future sightings available.'
                : `Period ending ${formatDate(chartEnd)}. ${trends
                    .map((item) => `${item.label}: ${item.count} sightings`)
                    .join(', ')}`}
            </desc>

            {/* Horizontal grid lines and counts */}
            {[0, chartMax / 2, chartMax].map((value) => (
              <g key={value}>
                <text
                  x="0"
                  y={getY(value) + 3}
                  fontSize="9"
                  fill="#666666"
                >
                  {value}
                </text>

                <line
                  x1="28"
                  y1={getY(value)}
                  x2="332"
                  y2={getY(value)}
                  stroke="#D4D4D4"
                />
              </g>
            ))}

            {/* Activity line */}
            <polyline
              points={chartPoints}
              fill="none"
              stroke="#484848"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Month or week labels */}
            {trends.map((item, index) => {
              if (period === 'weekly' && index % 2 !== 0) {
                return null
              }

              return (
                <text
                  key={item.key}
                  x={getX(index)}
                  y="92"
                  textAnchor="middle"
                  fontSize="8"
                  fill="#666666"
                >
                  {item.label}
                </text>
              )
            })}
          </svg>

          {!hasActivity && (
            <p className="text-text mt-2 text-center text-[12px]">
              No sightings recorded during this period.
            </p>
          )}
        </div>

        <div className="mt-5">
          <h3 className="text-title text-[18px] font-bold">
            Recent sightings in {location}
          </h3>

          <ul className="mt-2 divide-y divide-[#D4D4D4]">
            {recentSightings.map((sighting) => (
              <li
                key={sighting.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <span className="text-title text-[13px] font-medium">
                  {sighting.species || 'Unknown species'}
                </span>

                <time
                  dateTime={sighting.date}
                  className="text-text whitespace-nowrap text-[12px]"
                >
                  {formatDate(sighting.date)}
                </time>
              </li>
            ))}
          </ul>

          {recentSightings.length === 0 && (
            <p className="text-text mt-3 text-[13px]">
              No sightings with valid dates available.
            </p>
          )}

          <a
            href="/learn"
            className="text-title mt-4 inline-block text-[14px] underline underline-offset-4"
          >
            Learn how to identify ticks →
          </a>
        </div>
      </div>
    </section>
  )
}