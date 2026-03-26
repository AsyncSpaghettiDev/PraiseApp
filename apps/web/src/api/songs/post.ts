import type { CreateSongRequest as SaveSongRequest, SongResponse as SaveSongResponse } from '@praise-app/types'

export const route = '/api/songs'

export type { SaveSongRequest, SaveSongResponse }

export async function saveSong (data: SaveSongRequest): Promise<SaveSongResponse> {
  const response = await fetch(route, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    const message = (errorBody as { message?: string } | null)?.message ?? 'Failed to save song'
    throw new Error(message)
  }

  return response.json()
}
