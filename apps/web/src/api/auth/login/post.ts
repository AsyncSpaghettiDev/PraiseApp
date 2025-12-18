export const route = '/api/auth/login'

export const key = ['auth', 'login']

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
}

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
