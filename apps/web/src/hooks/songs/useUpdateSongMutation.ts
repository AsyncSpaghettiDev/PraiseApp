import { useMutation } from '@tanstack/react-query'
import { updateSong, type UpdateSongRequest, type UpdateSongResponse } from '../../api/songs/put'

export function useUpdateSongMutation () {
  return useMutation<UpdateSongResponse, Error, { id: string; data: UpdateSongRequest }>({
    mutationFn: ({ id, data }) => updateSong(id, data)
  })
}
