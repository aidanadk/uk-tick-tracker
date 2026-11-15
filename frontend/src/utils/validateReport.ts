const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_PHOTO_SIZE = 5 * 1024 * 1024

type ReportValues = {
  date: string
  location: string
  position: [number, number] | null
  count: number
  foundOn: string
  photo: File | null
}

export function validateReport(values: ReportValues, today: string) {
  const errors: Record<string, string> = {}

  if (!values.date || values.date > today) {
    errors.date = 'Choose today or an earlier date.'
  }
  if (!values.location) {
    errors.location = 'Enter a town or place name.'
  }
  if (!values.position) {
    errors.position = 'Select the location on the map.'
  }
  if (!Number.isInteger(values.count) || values.count < 1) {
    errors.count = 'Enter a whole number of at least 1.'
  }
  if (!values.foundOn) {
    errors.foundOn = 'Select where the tick was found.'
  }
  if (values.photo && !PHOTO_TYPES.includes(values.photo.type)) {
    errors.photo = 'Photo must be a JPEG, PNG or WebP image.'
  } else if (values.photo && values.photo.size > MAX_PHOTO_SIZE) {
    errors.photo = 'Photo must be 5 MB or smaller.'
  }

  return errors
}
