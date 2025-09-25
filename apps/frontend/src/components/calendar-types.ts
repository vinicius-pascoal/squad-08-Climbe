export type CalendarEvent = {
  id: string
  dayIndex: number // 0=Dom ... 6=Sab
  start: string    // 'HH:mm'
  end: string      // 'HH:mm'
  title: string
  resume: string
  color: 'blue' | 'green' | 'mint'
}
