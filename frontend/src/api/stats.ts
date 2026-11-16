export type UkLocation = {
  name: string
  region: string
  lat: number
  lng: number
}

export type MonthCount = {
  month: number
  label: string
  count: number
}

export async function getLocations(): Promise<UkLocation[]> {
  const res = await fetch('/api/locations')
  if (!res.ok) throw new Error('Could not load locations.')
  return res.json()
}

export async function getSeasonalActivity(location: string): Promise<MonthCount[]> {
  const res = await fetch(`/api/stats/seasonal?location=${encodeURIComponent(location)}`)
  if (!res.ok) throw new Error('Could not load seasonal activity. Please try again.')
  return res.json()
}
