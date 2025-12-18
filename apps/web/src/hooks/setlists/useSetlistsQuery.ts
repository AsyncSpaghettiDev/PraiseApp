import { useQuery } from '@tanstack/react-query'
import { getSetlists, key as setlistsKey, type Setlist } from '../../api/setlists/get'

export function useSetlistsQuery () {
  return useQuery<Setlist[], Error>({
    queryKey: setlistsKey,
    queryFn: getSetlists
  })
}
