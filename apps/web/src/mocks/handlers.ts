import { handlers as loginMockHandlers } from '../api/auth/login/handlers'
import { handlers as registerMockHandlers } from '../api/auth/register/handlers'

export const handlers = [
  ...loginMockHandlers,
  ...registerMockHandlers
]
