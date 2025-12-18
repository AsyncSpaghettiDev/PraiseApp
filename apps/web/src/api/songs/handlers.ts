import { http, HttpResponse } from 'msw'
import { route, type Song } from './get'

const songs: Song[] = [
  {
    _id: 'song_1',
    name: 'Great Are You Lord',
    artist: 'All Sons & Daughters',
    key: [{ variant: 'default', key: 'G' }],
    tempo: [{ variant: 'default', tempo: 74 }]
  },
  {
    _id: 'song_2',
    name: 'What A Beautiful Name',
    artist: 'Hillsong Worship',
    key: [{ variant: 'default', key: 'D' }],
    tempo: [{ variant: 'default', tempo: 68 }]
  },
  {
    _id: 'song_3',
    name: 'Way Maker',
    artist: 'Sinach',
    key: [{ variant: 'default', key: 'A' }],
    tempo: [{ variant: 'default', tempo: 84 }]
  }
]

export const handlers = [
  http.get(route, () => {
    return HttpResponse.json(songs)
  })
]
