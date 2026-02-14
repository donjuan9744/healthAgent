import { useMemo } from 'react'
import { DashboardOverview } from '../components/dashboard/DashboardOverview'
import { usePlanStore } from '../state/planStore'
import {
  getProgressSnapshot,
  getTrendData,
  getWeeklySummary,
  selectNutritionLogs,
  selectWorkoutLogs,
  useProgressStore,
} from '../state/progressStore'
import { useUserStore } from '../state/userStore'

export function DashboardScreen() {
  const profile = useUserStore((state) => state.profile)
  const plan = usePlanStore((state) => state.plan)
  const addWorkoutLog = useProgressStore((state) => state.addWorkoutLog)
  const addNutritionLog = useProgressStore((state) => state.addNutritionLog)
  const workoutLogs = useProgressStore(selectWorkoutLogs)
  const nutritionLogs = useProgressStore(selectNutritionLogs)

  if (!profile || !plan) {
    return <section className="panel"><p>Finish onboarding to generate your personalized dashboard.</p></section>
  }

  const plannedPerWeek = profile.scheduleDays ?? 4
  const snapshot = useMemo(
    () => getProgressSnapshot(workoutLogs, nutritionLogs, plannedPerWeek),
    [workoutLogs, nutritionLogs, plannedPerWeek],
  )
  const summary = useMemo(
    () => getWeeklySummary(workoutLogs, nutritionLogs, plannedPerWeek),
    [workoutLogs, nutritionLogs, plannedPerWeek],
  )
  const trends = useMemo(() => getTrendData(workoutLogs, nutritionLogs), [workoutLogs, nutritionLogs])

  const todayPlan = plan.weeklyPlan[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]
  const recentWorkoutLogs = workoutLogs.slice(0, 3)
  const recentNutritionLogs = nutritionLogs.slice(0, 3)

  return (
    <div className="stack">
      <DashboardOverview snapshot={snapshot} summary={summary} />

      <section className="panel">
        <h2>Today at a glance</h2>
        <p>{todayPlan.day}: {todayPlan.notes}</p>
        <div className="button-row">
          <button
            className="btn btn-primary"
            onClick={() => addWorkoutLog(profile.uid, todayPlan.workout.map((item) => item.id), 35)}
          >
            Log workout
          </button>
          <button
            className="btn"
            onClick={() => addNutritionLog(profile.uid, todayPlan.meals.map((item) => item.id), 1850)}
          >
            Log nutrition
          </button>
        </div>
      </section>

      <section className="panel">
        <h2>7-day trends</h2>
        <div className="trend-list" role="img" aria-label="Trend chart of workouts and calories">
          {trends.length === 0 ? (
            <p>Start logging to see trend analytics.</p>
          ) : (
            trends.map((point) => (
              <div key={point.label} className="trend-row">
                <span>{point.label.slice(5)}</span>
                <div className="bar-track">
                  <div className="bar-workout" style={{ width: `${Math.max(8, point.workouts * 32)}px` }} />
                </div>
                <small>{point.calories} kcal</small>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="panel">
        <h2>Milestones</h2>
        {snapshot.milestones.length === 0 ? (
          <p>Log your first workout or meals to unlock milestones.</p>
        ) : (
          <ul className="simple-list">
            {snapshot.milestones.map((milestone) => (
              <li key={milestone.id}>
                <strong>{milestone.title}</strong>: {milestone.detail}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel">
        <h2>Recent logs</h2>
        <p>Workout logs: {workoutLogs.length} | Nutrition logs: {nutritionLogs.length}</p>
        <div className="stats-grid" role="list" aria-label="Most recent workout and nutrition logs">
          <article className="stat" role="listitem">
            <h3>{recentWorkoutLogs.length}</h3>
            <p>Recent workouts</p>
            <ul className="simple-list">
              {recentWorkoutLogs.length === 0 ? (
                <li>No workouts logged yet.</li>
              ) : (
                recentWorkoutLogs.map((log) => (
                  <li key={log.id}>{log.date} · {log.durationMin} min</li>
                ))
              )}
            </ul>
          </article>
          <article className="stat" role="listitem">
            <h3>{recentNutritionLogs.length}</h3>
            <p>Recent nutrition logs</p>
            <ul className="simple-list">
              {recentNutritionLogs.length === 0 ? (
                <li>No nutrition logs yet.</li>
              ) : (
                recentNutritionLogs.map((log) => (
                  <li key={log.id}>{log.date} · {log.calories} kcal</li>
                ))
              )}
            </ul>
          </article>
        </div>
      </section>
    </div>
  )
}
