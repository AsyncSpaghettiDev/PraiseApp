import { useMutation } from '@tanstack/react-query'
import {
  postScrapeSong,
  type ScrapeSongRequest,
  type ScrapeSongResponse
} from '../../api/songs/scrape/post'

export function useScrapeSongMutation () {
  return useMutation<ScrapeSongResponse, Error, ScrapeSongRequest>({
    mutationFn: postScrapeSong
  })
}
