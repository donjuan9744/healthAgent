import type { Badge } from '../../types/models'

interface Props {
  badges: Badge[]
}

export function BadgeGrid({ badges }: Props) {
  return (
    <section className="panel">
      <h2>Badges</h2>
      {badges.length === 0 ? (
        <p>No badges yet. Complete workouts to unlock your first achievement.</p>
      ) : (
        <div className="badge-grid">
          {badges.map((badge) => (
            <article key={badge.id} className="badge-item">
              <h3>{badge.title}</h3>
              <p>{badge.description}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
