export const route = '/api/songs'

export interface UpdateSongTempo {
  variant: string
  signature: string
  tempo: number
}

export interface UpdateSongKey {
  variant: string
  key: string
}

export interface UpdateSongLyrics {
  variant: string
  lyrics: string
}

export interface UpdateSongStructure {
  variant: string
  structure: string
}

export interface UpdateSongRequest {
  name: string
  style: 'praise' | 'worship'
  artist: string
  tags: string[]
  tempo: UpdateSongTempo[]
  key: UpdateSongKey[]
  lyrics: UpdateSongLyrics[]
  structure: UpdateSongStructure[]
}

export interface UpdateSongResponse {
  _id: string
  name: string
  style: 'praise' | 'worship'
  artist: string
  tags: string[]
  tempo: UpdateSongTempo[]
  key: UpdateSongKey[]
  lyrics: UpdateSongLyrics[]
  structure: UpdateSongStructure[]
  createdAt: string
  updatedAt: string
}

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
