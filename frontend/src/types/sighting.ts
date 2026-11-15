export type Sighting = {
  id: string
  date: string
  latinName: string
  location: string
  species: string
  source: 'elanco' | 'user'
  position?: [number, number]
}