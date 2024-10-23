export const days: string[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]

export const shortDays: string[] = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']

export const months: string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export const shortMonths: string[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

export function formatDate(d: number) {
  const date = new Date(d)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function formatTime(d: number, ampm = false) {
  const date = new Date(d)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  if (!ampm) return `${hours}:${minutes}`
  return `${parseInt(hours) % 12}:${minutes} ${parseInt(hours) >= 12 ? 'PM' : 'AM'}`
}
