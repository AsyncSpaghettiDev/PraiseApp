import { http, HttpResponse } from 'msw'
import { route } from './const'
import { type SetlistResponse } from '@praise-app/types'

const setlists: SetlistResponse[] = [
  {
    _id: 'setlist_1',
    name: 'Sunday Morning',
    date: '2025-12-21',
    tags: [],
    songs: [
      {
        _id: 'song_1',
        name: 'Great Are You Lord',
        artist: 'All Sons & Daughters',
        style: 'worship',
        tempo: { variant: 'default', tempo: 75, signature: '4/4' },
        key: { variant: 'default', key: 'G' },
        lyrics: { variant: 'default', lyrics: '' },
        structure: { variant: 'default', structure: [] }
      },
      {
        _id: 'song_2',
        name: 'What A Beautiful Name',
        artist: 'Hillsong Worship',
        style: 'worship',
        tempo: { variant: 'default', tempo: 75, signature: '4/4' },
        key: { variant: 'default', key: 'G' },
        lyrics: { variant: 'default', lyrics: '' },
        structure: { variant: 'default', structure: [] }
      }
    ]
  },
  {
    _id: 'setlist_2',
    name: 'Youth Night',
    date: '2025-12-27',
    tags: [],
    songs: [
      {
        _id: 'song_3',
        name: 'Way Maker',
        artist: 'Sinach',
        style: 'praise',
        tempo: { variant: 'default', tempo: 75, signature: '4/4' },
        key: { variant: 'default', key: 'G' },
        lyrics: { variant: 'default', lyrics: '' },
        structure: { variant: 'default', structure: [] }
      }
    ]
  }
]

export const handlers = [
  http.get(route, () => {
    return HttpResponse.json(setlists)
  })
]
