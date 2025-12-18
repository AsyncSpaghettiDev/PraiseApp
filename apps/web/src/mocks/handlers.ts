import { handlers as loginMockHandlers } from '../api/auth/login'
import { handlers as registerMockHandlers } from '../api/auth/register'

export const handlers = [
  ...loginMockHandlers,
  ...registerMockHandlers
]
