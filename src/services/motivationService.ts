import type { Badge, Reminder } from '../types/models'

export const motivationService = {
  buildBadges(streakDays: number, totalWorkouts: number): Badge[] {
    const badges: Badge[] = []

    if (streakDays >= 3) {
      badges.push({
        id: 'b-streak-3',
        title: 'Momentum Builder',
        description: '3-day activity streak achieved.',
        earnedAt: new Date().toISOString(),
      })
    }

    if (totalWorkouts >= 10) {
      badges.push({
        id: 'b-workout-10',
        title: 'Consistent Athlete',
        description: '10 completed workouts logged.',
        earnedAt: new Date().toISOString(),
      })
    }

    if (totalWorkouts >= 20) {
      badges.push({
        id: 'b-workout-20',
        title: 'Elite Discipline',
        description: '20 workouts completed. Keep the pace.',
        earnedAt: new Date().toISOString(),
      })
    }

    return badges
  },

  defaultReminders(): Reminder[] {
    return [
      {
        id: 'r-workout',
        title: 'Workout Block',
        message: 'Your training block starts in 30 minutes.',
        schedule: '18:00',
        enabled: true,
      },
      {
        id: 'r-meal',
        title: 'Meal Prep',
        message: 'Prepare your next recovery meal.',
        schedule: '12:30',
        enabled: true,
      },
    ]
  },

  async triggerReminderNotifications(reminders: Reminder[]): Promise<void> {
    if (!('Notification' in window)) return
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return

    reminders
      .filter((reminder) => reminder.enabled)
      .forEach((reminder) => {
        // Client-side notifications for MVP; production should use scheduled push.
        new Notification(reminder.title, { body: reminder.message })
      })
  },
}
