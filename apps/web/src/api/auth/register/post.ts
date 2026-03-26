import { route } from './const'

export const key = ['auth', 'register']
export interface RegisterRequest {
  firstName: string
  lastName?: string
  username: string
  password: string
}

export interface RegisterResponse {
  accessToken: string
  refreshToken: string
}

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
