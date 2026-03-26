export const route = '/api/setlist'

export interface SaveSetlistTempo {
  variant: string
  tempo: number
  signature: string
}

export interface SaveSetlistKey {
  variant: string
  key: string
}

export interface SaveSetlistLyrics {
  variant: string
  lyrics: string
}

export interface SaveSetlistStructure {
  variant: string
  structure: string
}

export interface SaveSetlistSong {
  name: string
  style: 'praise' | 'worship'
  artist: string
  tempo: SaveSetlistTempo
  key: SaveSetlistKey
  lyrics: SaveSetlistLyrics
  structure: SaveSetlistStructure
}

export interface SaveSetlistRequest {
  name: string
  tags: string[]
  date: Date | string
  songs: SaveSetlistSong[]
}

export interface SaveSetlistResponse {
  _id: string
  name: string
  tags: string[]
  date: string
  songs: SaveSetlistSong[]
  createdAt: string
  updatedAt: string
}

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
