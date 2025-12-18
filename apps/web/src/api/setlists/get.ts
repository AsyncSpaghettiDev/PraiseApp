export const route = '/api/setlist'

export const key = ['setlists'] as const

export interface SetlistItem {
  _id: string
  name: string
  artist: string
  style: string
}

export interface Setlist {
  _id: string
  name: string
  date: string
  songs: SetlistItem[]
}

export async function getSetlists (): Promise<Setlist[]> {
  const response = await fetch(route)

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    const message = (errorBody as { message?: string } | null)?.message ?? 'Failed to load setlists'
    throw new Error(message)
  }

  return response.json()
}
