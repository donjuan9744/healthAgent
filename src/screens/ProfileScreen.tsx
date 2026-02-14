import { useUserStore } from '../state/userStore'

export function ProfileScreen() {
  const authUser = useUserStore((state) => state.authUser)
  const profile = useUserStore((state) => state.profile)
  const logout = useUserStore((state) => state.logout)
  const updatePreferences = useUserStore((state) => state.updatePreferences)

  if (!authUser || !profile) {
    return <section className="panel"><p>Login required.</p></section>
  }

  return (
    <div className="stack">
      <section className="panel">
        <h2>Account</h2>
        <p><strong>Email:</strong> {authUser.email}</p>
        <p><strong>Goal focus:</strong> {profile.goals.join(', ')}</p>
        <p><strong>Schedule:</strong> {profile.scheduleDays} training days per week</p>
        <button className="btn" onClick={() => void logout()}>Sign out</button>
      </section>

      <section className="panel">
        <h2>Accessibility</h2>
        <label className="checkbox-line">
          <input
            type="checkbox"
            checked={profile.preferences.highContrast}
            onChange={(e) => void updatePreferences({ highContrast: e.target.checked })}
          />
          <span>High contrast mode</span>
        </label>

        <label>
          Font size
          <select
            value={profile.preferences.fontScale}
            onChange={(e) =>
              void updatePreferences({ fontScale: e.target.value as 'normal' | 'large' | 'xlarge' })
            }
          >
            <option value="normal">Normal</option>
            <option value="large">Large</option>
            <option value="xlarge">Extra Large</option>
          </select>
        </label>
      </section>

      <section className="panel">
        <h2>Privacy and help</h2>
        <p>Data is stored securely with encrypted transport. You can request deletion in account settings.</p>
        <p>Need help? Open the FAQ/help center in the support tab (placeholder for MVP).</p>
      </section>
    </div>
  )
}
