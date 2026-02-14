import { AuthPanel } from '../components/auth/AuthPanel'
import { useUserStore } from '../state/userStore'

export function AuthScreen() {
  const login = useUserStore((state) => state.login)
  const register = useUserStore((state) => state.register)
  const loading = useUserStore((state) => state.loading)
  const error = useUserStore((state) => state.error)

  return (
    <div className="auth-shell">
      <AuthPanel mode="login" onLogin={login} onRegister={register} loading={loading} />
      {error ? <p className="error-message">{error}</p> : null}
    </div>
  )
}
