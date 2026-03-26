import { route } from './const'
import type { CreateSetlistRequest as SaveSetlistRequest, SetlistResponse as SaveSetlistResponse, SetlistSongRequest as SaveSetlistSong } from '@praise-app/types'

export const key = ['setlists', 'post'] as const
export type { SaveSetlistRequest, SaveSetlistResponse, SaveSetlistSong }

export async function saveSetlist (data: SaveSetlistRequest): Promise<SaveSetlistResponse> {
  const response = await fetch(route, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    const message = (errorBody as { message?: string } | null)?.message ?? 'Failed to save setlist'
    throw new Error(message)
  }

  return response.json()
}
