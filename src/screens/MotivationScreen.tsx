import { useMemo } from 'react'
import { BadgeGrid } from '../components/motivation/BadgeGrid'
import {
  getEngagementMetrics,
  selectBadges,
  selectCelebrationActive,
  selectDismissCelebration,
  selectMotivationInteractions,
  selectReminders,
  selectSendReminders,
  selectWorkoutLogs,
  useProgressStore,
} from '../state/progressStore'

export function MotivationScreen() {
  const badges = useProgressStore(selectBadges)
  const reminders = useProgressStore(selectReminders)
  const sendReminders = useProgressStore(selectSendReminders)
  const celebrationActive = useProgressStore(selectCelebrationActive)
  const dismissCelebration = useProgressStore(selectDismissCelebration)
  const workoutLogs = useProgressStore(selectWorkoutLogs)
  const motivationInteractions = useProgressStore(selectMotivationInteractions)
  const engagement = useMemo(
    () => getEngagementMetrics(workoutLogs, motivationInteractions),
    [workoutLogs, motivationInteractions],
  )

  return (
    <div className="stack">
      {celebrationActive && (
        <section className="panel celebration" role="status" aria-live="polite">
          <h2>New achievement unlocked</h2>
          <p>Your consistency is compounding. Keep this streak alive.</p>
          <button className="btn" onClick={dismissCelebration}>Dismiss</button>
        </section>
      )}

      <BadgeGrid badges={badges} />

      <section className="panel">
        <h2>Reminders</h2>
        <ul className="simple-list">
          {reminders.map((reminder) => (
            <li key={reminder.id}>
              <strong>{reminder.title}</strong> at {reminder.schedule} - {reminder.message}
            </li>
          ))}
        </ul>
        <button className="btn btn-primary" onClick={() => void sendReminders()}>
          Send test reminders
        </button>
      </section>

      <section className="panel">
        <h2>Engagement analytics</h2>
        <p>DAU/WAU ratio: {engagement.dauWauRatio}</p>
        <p>30-day retention estimate: {engagement.retention30d}%</p>
        <p>Motivation interactions: {engagement.motivationInteractions}</p>
      </section>
    </div>
  )
}
