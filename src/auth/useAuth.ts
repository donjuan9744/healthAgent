import { useEffect } from 'react'
import { authService } from './authService'
import { useUserStore } from '../state/userStore'

export const useAuth = (): void => {
  const setAuthUser = useUserStore((state) => state.setAuthUser)

  useEffect(() => {
    const unsubscribe = authService.subscribe((user) => {
      setAuthUser(user)
    })
    return unsubscribe
  }, [setAuthUser])
}
