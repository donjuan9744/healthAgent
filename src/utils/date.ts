export const isoDate = (date: Date = new Date()): string => date.toISOString().slice(0, 10)

export const startOfWeekIso = (base: Date = new Date()): string => {
  const date = new Date(base)
  const day = date.getDay() === 0 ? 7 : date.getDay()
  date.setDate(date.getDate() - (day - 1))
  return isoDate(date)
}

export const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
