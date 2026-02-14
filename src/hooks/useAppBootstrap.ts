import { useEffect } from 'react'
import { usePlanStore } from '../state/planStore'
import { useProgressStore } from '../state/progressStore'
import { useUserStore } from '../state/userStore'

export const useAppBootstrap = (): void => {
  const authUser = useUserStore((state) => state.authUser)
  const profile = useUserStore((state) => state.profile)
  const loadProfile = useUserStore((state) => state.loadProfile)
  const loadPlan = usePlanStore((state) => state.loadPlan)
  const loadProgress = useProgressStore((state) => state.loadProgress)
  const hydrateMotivation = useProgressStore((state) => state.hydrateMotivation)

  useEffect(() => {
    if (!authUser) return
    void loadProfile(authUser.uid)
    void loadPlan(authUser.uid)
    void loadProgress(authUser.uid)
    hydrateMotivation()
  }, [authUser, loadProfile, loadPlan, loadProgress, hydrateMotivation])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.contrast = profile?.preferences.highContrast ? 'high' : 'normal'
    root.dataset.fontScale = profile?.preferences.fontScale ?? 'normal'
  }, [profile?.preferences.fontScale, profile?.preferences.highContrast])
}
