import { route } from './const'
import type { SetlistResponse, SetlistItem } from '@praise-app/types'

export const key = ['setlists', 'get'] as const

export type Setlist = SetlistResponse
export type { SetlistItem }

export async function getSetlists (): Promise<Setlist[]> {
  const response = await fetch(route)

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    const message = (errorBody as { message?: string } | null)?.message ?? 'Failed to load setlists'
    throw new Error(message)
  }

  return response.json()
}
