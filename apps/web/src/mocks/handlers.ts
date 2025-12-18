import { http, HttpResponse } from 'msw'
import { loginRoute } from '../api/auth/login'

export const handlers = [
  http.post(loginRoute, async ({ request }) => {
    const body = (await request.json().catch(() => null)) as
      | { username?: string; password?: string }
      | null

    if (!body?.username || !body?.password) {
      return HttpResponse.json({ message: 'Missing credentials' }, { status: 400 })
    }

    if (body.password !== 'password') {
      return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    return HttpResponse.json({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token'
    })
  })
]
