import { route } from './const'
import type { LoginRequest, LoginResponse } from '@praise-app/types'

export type { LoginRequest, LoginResponse }
export const key = ['auth', 'login', 'post'] as const

export async function postLogin (payload: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(route, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    const message = (errorBody as { message?: string } | null)?.message ?? 'Login failed'
    throw new Error(message)
  }

  return response.json()
}
