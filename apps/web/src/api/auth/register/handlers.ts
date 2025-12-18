import { http, HttpResponse } from 'msw'
import { route } from './post'

export const handlers = [
  http.post(route, async ({ request }) => {
    const body = (await request.json().catch(() => null)) as
      | { firstName?: string; lastName?: string; username?: string; password?: string }
      | null

    if (!body?.firstName || !body?.username || !body?.password) {
      return HttpResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    return HttpResponse.json({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token'
    })
  })
]
