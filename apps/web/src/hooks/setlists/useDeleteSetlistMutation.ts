import { useMutation } from '@tanstack/react-query'
import { deleteSetlist } from '../../api/setlists/delete'

export function useDeleteSetlistMutation () {
  return useMutation<{ message: string }, Error, { id: string; permanent?: boolean }>({
    mutationFn: ({ id, permanent = false }) => deleteSetlist(id, permanent)
  })
}
