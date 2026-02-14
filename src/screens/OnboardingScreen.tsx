import { OnboardingForm } from '../components/onboarding/OnboardingForm'
import { usePlanStore } from '../state/planStore'
import { useUserStore } from '../state/userStore'

interface Props {
  onFinished: () => void
}

export function OnboardingScreen({ onFinished }: Props) {
  const completeOnboarding = useUserStore((state) => state.completeOnboarding)
  const generatePlan = usePlanStore((state) => state.generatePlan)

  const handleSubmit = async (input: Parameters<typeof completeOnboarding>[0]) => {
    const profile = await completeOnboarding(input)
    if (!profile) return
    await generatePlan(profile)
    onFinished()
  }

  return <OnboardingForm onSubmit={handleSubmit} />
}
