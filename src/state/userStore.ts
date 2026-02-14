import { authService } from '../auth/authService'
import type { AuthUser, Goal, UserProfile } from '../types/models'
import { createStore } from './createStore'

export interface OnboardingInput {
  age: number
  weightKg: number
  goals: Goal[]
  equipment: string[]
  scheduleDays: number
  consentAccepted: boolean
}

interface UserState {
  authUser: AuthUser | null
  profile: UserProfile | null
  loading: boolean
  error: string | null
}

interface UserActions {
  setAuthUser: (user: AuthUser | null) => void
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => Promise<void>
  loadProfile: (userId: string) => Promise<void>
  completeOnboarding: (input: OnboardingInput) => Promise<UserProfile | null>
  updatePreferences: (updates: Partial<UserProfile['preferences']>) => Promise<void>
}

type UserStoreState = UserState & UserActions

const defaultPreferences: UserProfile['preferences'] = {
  highContrast: false,
  fontScale: 'normal',
  locale: 'en-US',
  consentAccepted: false,
}

const initialState: UserState = {
  authUser: null,
  profile: null,
  loading: false,
  error: null,
}

const store = createStore<UserStoreState>({
  ...initialState,

  setAuthUser: (authUser) => store.setState({ authUser }),

  login: async (email, password) => {
    store.setState({ loading: true, error: null })
    try {
      const user = await authService.login(email, password)
      store.setState({ authUser: user })
      await store.getState().loadProfile(user.uid)
    } catch (error) {
      store.setState({ error: 'Unable to login. Please check your credentials.' })
      throw error
    } finally {
      store.setState({ loading: false })
    }
  },

  register: async (email, password, displayName) => {
    store.setState({ loading: true, error: null })
    try {
      const user = await authService.register(email, password, displayName)
      store.setState({ authUser: user })
      await store.getState().loadProfile(user.uid)
    } catch (error) {
      store.setState({ error: 'Unable to register at this time.' })
      throw error
    } finally {
      store.setState({ loading: false })
    }
  },

  logout: async () => {
    await authService.logout()
    store.setState({ authUser: null, profile: null })
  },

  loadProfile: async (userId) => {
    const profile = await authService.getUserProfile(userId)
    store.setState({ profile })
  },

  completeOnboarding: async (input) => {
    const currentUser = store.getState().authUser
    if (!currentUser) return null

    const now = new Date().toISOString()
    const existing = store.getState().profile

    const profile: UserProfile = {
      uid: currentUser.uid,
      email: currentUser.email,
      age: input.age,
      weightKg: input.weightKg,
      goals: input.goals,
      equipment: input.equipment,
      scheduleDays: input.scheduleDays,
      onboardingComplete: true,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      preferences: {
        ...defaultPreferences,
        ...(existing?.preferences ?? {}),
        consentAccepted: input.consentAccepted,
      },
    }

    await authService.saveUserProfile(profile)
    store.setState({ profile })
    return profile
  },

  updatePreferences: async (updates) => {
    const profile = store.getState().profile
    if (!profile) return
    const updated: UserProfile = {
      ...profile,
      updatedAt: new Date().toISOString(),
      preferences: {
        ...profile.preferences,
        ...updates,
      },
    }
    await authService.saveUserProfile(updated)
    store.setState({ profile: updated })
  },
})

export const useUserStore = store.useStore
