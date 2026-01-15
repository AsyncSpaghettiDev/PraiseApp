import { useMutation } from '@tanstack/react-query'
import { deleteSong } from '../../api/songs/delete'

export function useDeleteSongMutation () {
  return useMutation<{ message: string }, Error, { id: string; permanent?: boolean }>({
    mutationFn: ({ id, permanent = false }) => deleteSong(id, permanent)
  })
}
