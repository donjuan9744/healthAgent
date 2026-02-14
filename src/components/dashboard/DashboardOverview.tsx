import type { ProgressSnapshot, WeeklySummary } from '../../types/models'

interface Props {
  snapshot: ProgressSnapshot
  summary: WeeklySummary
}

export function DashboardOverview({ snapshot, summary }: Props) {
  return (
    <section className="panel">
      <h2>Progress dashboard</h2>
      <div className="stats-grid" role="list" aria-label="Progress statistics">
        <article role="listitem" className="stat">
          <h3>{snapshot.streakDays}</h3>
          <p>Current streak</p>
        </article>
        <article role="listitem" className="stat">
          <h3>{snapshot.totalWorkouts}</h3>
          <p>Total workouts</p>
        </article>
        <article role="listitem" className="stat">
          <h3>{snapshot.weeklyCompletionRate}%</h3>
          <p>Weekly completion</p>
        </article>
        <article role="listitem" className="stat">
          <h3>{summary.avgCalories}</h3>
          <p>Avg daily calories</p>
        </article>
      </div>
    </section>
  )
}
