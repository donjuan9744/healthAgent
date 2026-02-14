import { normalizeGeneratedPlan, planGenerator } from '../services/planGenerator'
import type { GeneratedPlan, UserProfile } from '../types/models'
import { createStore } from './createStore'

interface PlanStoreState {
  plan: GeneratedPlan | null
  loading: boolean
  generatePlan: (profile: UserProfile) => Promise<GeneratedPlan>
  loadPlan: (userId: string) => Promise<void>
}

const store = createStore<PlanStoreState>({
  plan: null,
  loading: false,

  generatePlan: async (profile) => {
    store.setState({ loading: true })
    const generated = normalizeGeneratedPlan(planGenerator.generate(profile))
    localStorage.setItem(`plan:${profile.uid}`, JSON.stringify(generated))
    store.setState({ plan: generated, loading: false })
    return generated
  },

  loadPlan: async (userId) => {
    store.setState({ loading: true })
    const raw = localStorage.getItem(`plan:${userId}`)
    if (!raw) {
      store.setState({ plan: null, loading: false })
      return
    }

    try {
      const parsed = JSON.parse(raw) as GeneratedPlan
      const normalized = normalizeGeneratedPlan(parsed)
      localStorage.setItem(`plan:${userId}`, JSON.stringify(normalized))
      store.setState({ plan: normalized, loading: false })
    } catch {
      store.setState({ plan: null, loading: false })
    }
  },
})

export const usePlanStore = store.useStore
