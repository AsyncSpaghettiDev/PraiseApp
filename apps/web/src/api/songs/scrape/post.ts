export const route = '/api/songs/scrape'

export interface ScrapeSongRequest {
  query: string
}

export interface ScrapeSongResult {
  title: string
  artist: string
  key: string
  duration: string
  bpm: string
  links: {
    spotify: string
    apple: string
  }
}

export interface ScrapeSongResponse {
  results: ScrapeSongResult[]
}

export async function postScrapeSong (payload: ScrapeSongRequest): Promise<ScrapeSongResponse> {
  const response = await fetch(route, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    const message = (errorBody as { message?: string } | null)?.message ?? 'Failed to scrape song data'
    throw new Error(message)
  }

  return response.json()
}
