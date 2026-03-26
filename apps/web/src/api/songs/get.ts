import type { SongResponse } from '@praise-app/types'

export const route = '/api/songs'

export const key = ['songs'] as const

export type Song = SongResponse

export async function getSongs (): Promise<Song[]> {
  const response = await fetch(route)

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    const message = (errorBody as { message?: string } | null)?.message ?? 'Failed to load songs'
    throw new Error(message)
  }

  return response.json()
}
