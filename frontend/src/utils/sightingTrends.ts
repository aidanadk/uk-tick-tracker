import type { Sighting } from '../types/sighting'

export type MonthlyTrend = {
  key: string
  label: string
  count: number
}

export type WeeklyTrend = {
  key: string
  label: string
  count: number
}

export function getWeeklyTrends(
  sightings: Sighting[],
  now = new Date(),
): WeeklyTrend[] {
  const currentMonday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  )

  const daysSinceMonday = (currentMonday.getUTCDay() + 6) % 7

  currentMonday.setUTCDate(currentMonday.getUTCDate() - daysSinceMonday)

  const weekMs = 7 * 24 * 60 * 60 * 1000
  const firstWeekStart = currentMonday.getTime() - 11 * weekMs

  const weeks: WeeklyTrend[] = Array.from({ length: 12 }, (_, index) => {
    const start = new Date(firstWeekStart + index * weekMs)

    return {
      key: start.toISOString().slice(0, 10),
      label: start.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        timeZone: 'UTC',
      }),
      count: 0,
    }
  })

  for (const sighting of sightings) {
    const timestamp = new Date(sighting.date).getTime()

    if (
      !Number.isFinite(timestamp) ||
      timestamp < firstWeekStart ||
      timestamp > now.getTime()
    ) {
      continue
    }

    const index = Math.floor((timestamp - firstWeekStart) / weekMs)

    if (index >= 0 && index < weeks.length) {
      weeks[index].count += 1
    }
  }

  return weeks
}

export function getMonthlyTrends(
  sightings: Sighting[],
  now = new Date(),
): MonthlyTrend[] {
  const currentYear = now.getUTCFullYear()
  const currentMonth = now.getUTCMonth()

  const months: MonthlyTrend[] = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(Date.UTC(currentYear, currentMonth - 11 + index, 1))

    return {
      key: `${date.getUTCFullYear()}-${date.getUTCMonth()}`,
      label: date.toLocaleDateString('en-GB', {
        month: 'short',
        timeZone: 'UTC',
      }),
      count: 0,
    }
  })

  for (const sighting of sightings) {
    const date = new Date(sighting.date)

    if (!Number.isFinite(date.getTime()) || date > now) {
      continue
    }

    const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`
    const month = months.find((month) => month.key === key)

    if (month) {
      month.count += 1
    }
  }

  return months
}
