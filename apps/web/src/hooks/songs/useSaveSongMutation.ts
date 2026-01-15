import { useMutation } from '@tanstack/react-query'
import { saveSong, type SaveSongRequest, type SaveSongResponse } from '../../api/songs/post'

export function useSaveSongMutation () {
  return useMutation<SaveSongResponse, Error, SaveSongRequest>({
    mutationFn: saveSong
  })
}
