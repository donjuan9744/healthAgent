import { useState } from 'react'

interface Props {
  mode: 'login' | 'register'
  onLogin: (email: string, password: string) => Promise<void>
  onRegister: (email: string, password: string, displayName: string) => Promise<void>
  loading: boolean
}

export function AuthPanel({ mode, onLogin, onRegister, loading }: Props) {
  const [currentMode, setCurrentMode] = useState(mode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (currentMode === 'register') {
      await onRegister(email, password, displayName)
    } else {
      await onLogin(email, password)
    }
  }

  return (
    <section className="panel auth-panel" aria-label="Authentication form">
      <h1>Health Agent</h1>
      <p>Personalized workouts, nutrition, progress analytics, and motivation in one place.</p>
      <form className="form-grid" onSubmit={handleSubmit}>
        {currentMode === 'register' && (
          <label>
            Name
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
          </label>
        )}
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Please wait...' : currentMode === 'register' ? 'Create account' : 'Login'}
        </button>
      </form>
      <button
        className="btn btn-link"
        type="button"
        onClick={() => setCurrentMode(currentMode === 'login' ? 'register' : 'login')}
      >
        {currentMode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
      </button>
    </section>
  )
}
