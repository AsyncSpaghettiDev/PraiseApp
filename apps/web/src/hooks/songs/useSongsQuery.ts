import { useQuery } from '@tanstack/react-query'
import { getSongs, key as songsKey, type Song } from '../../api/songs/get'

export function useSongsQuery () {
  return useQuery<Song[], Error>({
    queryKey: songsKey,
    queryFn: getSongs
  })
}
