import axios from 'axios'

export interface AiWorkoutExercise {
  name: string
  type: 'reps' | 'time'
  sets: number
  reps: number | null
  seconds: number | null
}

export interface AiWorkoutDay {
  day: string
  dayType: 'training' | 'conditioning' | 'recovery' | 'rest'
  focus: string
  exercises: AiWorkoutExercise[]
}

export interface AiWeeklyPlanJson {
  days: AiWorkoutDay[]
}

export interface GenerateAiWorkoutPayload {
  userId: string
  savedWorkouts: unknown[]
  goals: unknown
  preferences: unknown
  startDate: string
  days?: number
}

export interface GenerateAiWorkoutResponse {
  week: string
  planId?: string
  startDate?: string | null
  days?: number
  plan: AiWeeklyPlanJson
}

const AI_WEEKLY_PLAN_ENDPOINT = 'http://localhost:5001/generate-weekly-plan'
const WEEKLY_PLAN_ENDPOINT = 'http://localhost:5001/weekly-plan'

function isValidAiPlanJson(plan: unknown): plan is AiWeeklyPlanJson {
  if (!plan || typeof plan !== 'object') return false
  const candidate = plan as Partial<AiWeeklyPlanJson>
  return Array.isArray(candidate.days)
}

export async function generateAiWorkoutPlan(payload: GenerateAiWorkoutPayload): Promise<GenerateAiWorkoutResponse> {
  try {
    const response = await axios.post<GenerateAiWorkoutResponse>(AI_WEEKLY_PLAN_ENDPOINT, payload)
    if (!response.data || !isValidAiPlanJson(response.data.plan)) {
      throw new Error('AI service returned an invalid weekly plan format.')
    }
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverMessage = (error.response?.data as { error?: string } | undefined)?.error
      throw new Error(serverMessage ?? 'Unable to generate your weekly workout plan right now.')
    }
    throw new Error('Unable to generate your weekly workout plan right now.')
  }
}

export async function fetchAiWorkoutPlan(userId: string, options?: { startDate?: string; days?: number }): Promise<AiWeeklyPlanJson | null> {
  try {
    const response = await axios.get<{ plan?: AiWeeklyPlanJson }>(`${WEEKLY_PLAN_ENDPOINT}/${userId}`, {
      params: {
        startDate: options?.startDate,
        days: options?.days ?? 7,
      },
    })
    if (!isValidAiPlanJson(response.data?.plan)) {
      throw new Error('Weekly plan service returned an invalid format.')
    }
    return response.data.plan
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null
    }

    if (axios.isAxiosError(error)) {
      const serverMessage = (error.response?.data as { error?: string } | undefined)?.error
      throw new Error(serverMessage ?? 'Unable to load your weekly workout plan right now.')
    }

    throw new Error('Unable to load your weekly workout plan right now.')
  }
}
