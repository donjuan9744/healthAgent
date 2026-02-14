import type { ReactNode } from 'react'
import type { AppRoute } from '../types/routes'
import { useUserStore } from '../state/userStore'

interface Props {
  route: AppRoute
  onNavigate: (route: AppRoute) => void
  children: ReactNode
}

const links: { route: AppRoute; label: string }[] = [
  { route: 'dashboard', label: 'Dashboard' },
  { route: 'workouts', label: 'Workouts' },
  { route: 'nutrition', label: 'Nutrition' },
  { route: 'motivation', label: 'Motivation' },
  { route: 'profile', label: 'Profile' },
]

export function AppLayout({ route, onNavigate, children }: Props) {
  const profile = useUserStore((state) => state.profile)

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>Health Agent</h1>
          <p>{profile?.onboardingComplete ? 'Personal fitness cockpit' : 'Complete onboarding to unlock your plan'}</p>
        </div>
      </header>
      <main className="content" id="main-content" tabIndex={-1}>
        {children}
      </main>
      <nav className="bottom-nav" aria-label="Primary navigation">
        {links.map((link) => (
          <button
            key={link.route}
            type="button"
            className={route === link.route ? 'active' : ''}
            onClick={() => onNavigate(link.route)}
          >
            {link.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
