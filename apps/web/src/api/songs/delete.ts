import { route } from './get'

export async function deleteSong (id: string, permanent: boolean = false): Promise<{ message: string }> {
  const url = permanent ? `${route}/remove/${id}` : `${route}/archive/${id}`

  const response = await fetch(url, {
    method: 'DELETE'
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    const message = (errorBody as { message?: string } | null)?.message ?? 'Failed to delete song'
    throw new Error(message)
  }

  return response.json()
}
