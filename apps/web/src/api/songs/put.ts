import type { UpdateSongRequest, SongResponse as UpdateSongResponse } from '@praise-app/types'

export const route = '/api/songs'

export type { UpdateSongRequest, UpdateSongResponse }

export async function updateSong (id: string, data: UpdateSongRequest): Promise<UpdateSongResponse> {
  const response = await fetch(`${route}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    const message = (errorBody as { message?: string } | null)?.message ?? 'Failed to update song'
    throw new Error(message)
  }

  return response.json()
}
