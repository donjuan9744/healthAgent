import { useEffect, useState } from 'react'
import { useAuth } from './auth/useAuth'
import { useAppBootstrap } from './hooks/useAppBootstrap'
import { AppLayout } from './layouts/AppLayout'
import { AuthScreen } from './screens/AuthScreen'
import { DashboardScreen } from './screens/DashboardScreen'
import { MotivationScreen } from './screens/MotivationScreen'
import { NutritionScreen } from './screens/NutritionScreen'
import { OnboardingScreen } from './screens/OnboardingScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { WorkoutScreen } from './screens/WorkoutScreen'
import { useUserStore } from './state/userStore'
import type { AppRoute } from './types/routes'

const normalizeHashRoute = (hash: string): AppRoute | null => {
  const clean = hash.replace('#', '').replace('/', '')
  if (clean === 'dashboard') return 'dashboard'
  if (clean === 'workouts') return 'workouts'
  if (clean === 'nutrition') return 'nutrition'
  if (clean === 'motivation') return 'motivation'
  if (clean === 'profile') return 'profile'
  return null
}

function ScreenRouter({ route }: { route: AppRoute }) {
  if (route === 'dashboard') return <DashboardScreen />
  if (route === 'workouts') return <WorkoutScreen />
  if (route === 'nutrition') return <NutritionScreen />
  if (route === 'motivation') return <MotivationScreen />
  return <ProfileScreen />
}

export default function App() {
  useAuth()
  useAppBootstrap()

  const authUser = useUserStore((state) => state.authUser)
  const profile = useUserStore((state) => state.profile)
  const [route, setRoute] = useState<AppRoute>(() => normalizeHashRoute(window.location.hash) ?? 'dashboard')

  useEffect(() => {
    const onHashChange = () => {
      const normalized = normalizeHashRoute(window.location.hash)
      if (normalized) setRoute(normalized)
    }

    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = (next: AppRoute) => {
    setRoute(next)
    window.location.hash = `/${next}`
  }

  if (!authUser) return <AuthScreen />
  if (!profile?.onboardingComplete) return <OnboardingScreen onFinished={() => navigate('dashboard')} />

  return (
    <AppLayout route={route} onNavigate={navigate}>
      <ScreenRouter route={route} />
    </AppLayout>
  )
}
