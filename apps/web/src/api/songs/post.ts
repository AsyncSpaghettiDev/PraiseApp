export const route = '/api/songs'

export interface SaveSongTempo {
  variant: string
  signature: string
  tempo: number
}

export interface SaveSongKey {
  variant: string
  key: string
}

export interface SaveSongLyrics {
  variant: string
  lyrics: string
}

export interface SaveSongStructure {
  variant: string
  structure: string
}

export interface SaveSongRequest {
  name: string
  style: 'praise' | 'worship'
  artist: string
  tags: string[]
  tempo: SaveSongTempo[]
  key: SaveSongKey[]
  lyrics: SaveSongLyrics[]
  structure: SaveSongStructure[]
}

export interface SaveSongResponse {
  _id: string
  name: string
  style: 'praise' | 'worship'
  artist: string
  tags: string[]
  tempo: SaveSongTempo[]
  key: SaveSongKey[]
  lyrics: SaveSongLyrics[]
  structure: SaveSongStructure[]
  createdAt: string
  updatedAt: string
}

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
