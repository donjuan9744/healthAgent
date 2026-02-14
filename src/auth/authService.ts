import type { AuthUser, UserProfile } from '../types/models'

const LOCAL_AUTH_KEY = 'health-agent-local-auth'

const readLocalAuth = (): AuthUser | null => {
  const raw = localStorage.getItem(LOCAL_AUTH_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export const authService = {
  async register(email: string, password: string, displayName: string): Promise<AuthUser> {
    void password
    const user: AuthUser = {
      uid: `local-${crypto.randomUUID()}`,
      email,
      displayName,
    }
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(user))
    return user
  },

  async login(email: string, password: string): Promise<AuthUser> {
    void password
    const existing = readLocalAuth()
    if (existing && existing.email === email) return existing

    const user: AuthUser = {
      uid: `local-${crypto.randomUUID()}`,
      email,
      displayName: email.split('@')[0],
    }
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(user))
    return user
  },

  async logout(): Promise<void> {
    localStorage.removeItem(LOCAL_AUTH_KEY)
  },

  subscribe(callback: (user: AuthUser | null) => void): () => void {
    callback(readLocalAuth())
    return () => undefined
  },

  async saveUserProfile(profile: UserProfile): Promise<void> {
    localStorage.setItem(`profile:${profile.uid}`, JSON.stringify(profile))
  },

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const raw = localStorage.getItem(`profile:${userId}`)
    if (!raw) return null
    try {
      return JSON.parse(raw) as UserProfile
    } catch {
      return null
    }
  },
}
