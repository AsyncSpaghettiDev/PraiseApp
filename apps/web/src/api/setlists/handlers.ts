import { http, HttpResponse } from 'msw'
import { route, type Setlist } from './get'

const setlists: Setlist[] = [
  {
    _id: 'setlist_1',
    name: 'Sunday Morning',
    date: '2025-12-21',
    tags: [],
    songs: [
      { _id: 'song_1', name: 'Great Are You Lord', artist: 'All Sons & Daughters', style: 'Worship' },
      { _id: 'song_2', name: 'What A Beautiful Name', artist: 'Hillsong Worship', style: 'Worship' }
    ]
  },
  {
    _id: 'setlist_2',
    name: 'Youth Night',
    date: '2025-12-27',
    tags: [],
    songs: [
      { _id: 'song_3', name: 'Way Maker', artist: 'Sinach', style: 'Praise' }
    ]
  }
]

export const handlers = [
  http.get(route, () => {
    return HttpResponse.json(setlists)
  })
]
