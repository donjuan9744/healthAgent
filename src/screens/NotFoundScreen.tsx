interface Props {
  onGoDashboard: () => void
}

export function NotFoundScreen({ onGoDashboard }: Props) {
  return (
    <section className="panel">
      <h2>Page not found</h2>
      <p>The page you requested does not exist.</p>
      <button className="btn" type="button" onClick={onGoDashboard}>
        Go to dashboard
      </button>
    </section>
  )
}
