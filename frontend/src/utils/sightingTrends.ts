import type { Sighting } from '../types/sighting'

export type Trend = {
  key: string
  label: string
  count: number
}

function addDays(date: Date, days: number) {
  const result = new Date(date)
  result.setUTCDate(result.getUTCDate() + days)
  return result
}

function toDateString(date: Date) {
  return date.toISOString().slice(0, 10)
}

export function getWeeklyTrends(sightings: Sighting[], end: Date): Trend[] {
  let monday = new Date(toDateString(end))
  while (monday.getUTCDay() !== 1) {
    monday = addDays(monday, -1)
  }

  const weeks: Trend[] = []
  for (let i = 11; i >= 0; i--) {
    const start = addDays(monday, -7 * i)
    weeks.push({
      key: toDateString(start),
      label: start.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        timeZone: 'UTC',
      }),
      count: 0,
    })
  }

  for (const sighting of sightings) {
    const day = sighting.date.slice(0, 10)
    for (const week of weeks) {
      const nextWeek = toDateString(addDays(new Date(week.key), 7))
      if (day >= week.key && day < nextWeek) {
        week.count += 1
      }
    }
  }

  return weeks
}

export function getMonthlyTrends(sightings: Sighting[], end: Date): Trend[] {
  const months: Trend[] = []
  for (let i = 11; i >= 0; i--) {
    const date = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - i, 1))
    months.push({
      key: toDateString(date).slice(0, 7),
      label: date.toLocaleDateString('en-GB', {
        month: 'short',
        timeZone: 'UTC',
      }),
      count: 0,
    })
  }

  for (const sighting of sightings) {
    const month = months.find((m) => m.key === sighting.date.slice(0, 7))
    if (month) {
      month.count += 1
    }
  }

  return months
}
