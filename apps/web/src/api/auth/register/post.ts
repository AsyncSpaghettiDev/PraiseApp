import { route } from './const'
import type { RegisterRequest, RegisterResponse } from '@praise-app/types'

export type { RegisterRequest, RegisterResponse }
export const key = ['auth', 'register', 'post'] as const

export async function postRegister (payload: RegisterRequest): Promise<RegisterResponse> {
  const response = await fetch(route, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    const message = (errorBody as { message?: string } | null)?.message ?? 'Registration failed'
    throw new Error(message)
  }

  return response.json()
}
