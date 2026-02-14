import { useMemo, useState } from 'react'
import type { Goal } from '../../types/models'
import type { OnboardingInput } from '../../state/userStore'

interface Props {
  onSubmit: (input: OnboardingInput) => Promise<void>
}

const goals: { label: string; value: Goal }[] = [
  { label: 'Fat Loss', value: 'fat_loss' },
  { label: 'Muscle Gain', value: 'muscle_gain' },
  { label: 'Endurance', value: 'endurance' },
  { label: 'General Fitness', value: 'general_fitness' },
]

const equipmentOptions = ['none', 'dumbbells', 'resistance_bands', 'mat', 'kettlebell']

export function OnboardingForm({ onSubmit }: Props) {
  const [age, setAge] = useState('28')
  const [weightKg, setWeightKg] = useState('72')
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>(['general_fitness'])
  const [equipment, setEquipment] = useState<string[]>(['none'])
  const [scheduleDays, setScheduleDays] = useState('4')
  const [consentAccepted, setConsentAccepted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const canSubmit = useMemo(
    () =>
      Number(age) >= 13 &&
      Number(weightKg) > 0 &&
      selectedGoals.length > 0 &&
      Number(scheduleDays) >= 1 &&
      Number(scheduleDays) <= 7 &&
      consentAccepted,
    [age, consentAccepted, scheduleDays, selectedGoals.length, weightKg],
  )

  const toggleGoal = (value: Goal) => {
    setSelectedGoals((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    )
  }

  const toggleEquipment = (value: string) => {
    setEquipment((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    )
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return

    setSubmitting(true)
    try {
      await onSubmit({
        age: Number(age),
        weightKg: Number(weightKg),
        goals: selectedGoals,
        equipment,
        scheduleDays: Number(scheduleDays),
        consentAccepted,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="panel form-grid" onSubmit={handleSubmit} aria-label="Onboarding questionnaire">
      <h2>Build your personal plan</h2>
      <label>
        Age
        <input type="number" min={13} max={100} value={age} onChange={(e) => setAge(e.target.value)} required />
      </label>

      <label>
        Weight (kg)
        <input type="number" min={30} max={300} value={weightKg} onChange={(e) => setWeightKg(e.target.value)} required />
      </label>

      <fieldset>
        <legend>Goals</legend>
        <div className="chips">
          {goals.map((goal) => (
            <label key={goal.value} className="chip-control">
              <input
                type="checkbox"
                checked={selectedGoals.includes(goal.value)}
                onChange={() => toggleGoal(goal.value)}
              />
              <span>{goal.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Equipment</legend>
        <div className="chips">
          {equipmentOptions.map((item) => (
            <label key={item} className="chip-control">
              <input type="checkbox" checked={equipment.includes(item)} onChange={() => toggleEquipment(item)} />
              <span>{item.replace('_', ' ')}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label>
        Workout days / week
        <input
          type="number"
          min={1}
          max={7}
          value={scheduleDays}
          onChange={(e) => setScheduleDays(e.target.value)}
          required
        />
      </label>

      <label className="checkbox-line">
        <input
          type="checkbox"
          checked={consentAccepted}
          onChange={(e) => setConsentAccepted(e.target.checked)}
          required
        />
        <span>I consent to secure data storage and privacy policy terms (GDPR-ready flow).</span>
      </label>

      <button className="btn btn-primary" type="submit" disabled={!canSubmit || submitting}>
        {submitting ? 'Generating plan...' : 'Complete onboarding'}
      </button>
    </form>
  )
}
