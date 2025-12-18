import { handlers as loginMockHandlers } from '../api/auth/login/handlers'
import { handlers as registerMockHandlers } from '../api/auth/register/handlers'
import { handlers as songsMockHandlers } from '../api/songs/handlers'
import { handlers as setlistsMockHandlers } from '../api/setlists/handlers'

export const handlers = [
  ...loginMockHandlers,
  ...registerMockHandlers,
  ...songsMockHandlers,
  ...setlistsMockHandlers
]
