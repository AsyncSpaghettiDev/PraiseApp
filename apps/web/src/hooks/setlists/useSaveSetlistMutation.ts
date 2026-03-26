import { useMutation } from '@tanstack/react-query'
import { saveSetlist, type SaveSetlistRequest, type SaveSetlistResponse } from '../../api/setlists/post'

export function useSaveSetlistMutation () {
  return useMutation<SaveSetlistResponse, Error, SaveSetlistRequest>({
    mutationFn: saveSetlist
  })
}
