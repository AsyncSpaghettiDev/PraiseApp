export const route = '/api/songs'

export const key = ['songs'] as const

export interface Song {
  _id: string
  name: string
  style: string
  artist: string
  tags: string[]
  lyrics: {
    variant: string
    lyrics: string
  }[]
  key: {
    variant: string
    key: string
  }[]
  tempo: {
    variant: string
    tempo: number
    signature: string
  }[]
  structure: {
    variant: string
    structure: string[]
  }[]
}

export async function getSongs (): Promise<Song[]> {
  const response = await fetch(route)

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    const message = (errorBody as { message?: string } | null)?.message ?? 'Failed to load songs'
    throw new Error(message)
  }

  return response.json()
}
