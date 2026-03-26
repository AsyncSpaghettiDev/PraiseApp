import { http, HttpResponse } from 'msw'
import { route, type Song } from './get'
import { type SaveSongRequest } from './post'
import { route as scrapeRoute, type ScrapeSongRequest } from './scrape/post'

const songs: Song[] = [
  {
    _id: 'song_1',
    name: 'Great Are You Lord',
    artist: 'All Sons & Daughters',
    tags: ['worship', 'slow'],
    key: [{ variant: 'default', key: 'G' }],
    tempo: [{ variant: 'default', tempo: 74, signature: '4/4' }],
    lyrics: [{ variant: 'default', lyrics: 'Great are you Lord, mighty in strength...' }],
    structure: [{ variant: 'default', structure: ['verse', 'chorus', 'bridge', 'chorus'] }],
    style: 'worship'
  },
  {
    _id: 'song_2',
    name: 'What A Beautiful Name',
    artist: 'Hillsong Worship',
    tags: ['worship', 'popular'],
    key: [{ variant: 'default', key: 'D' }],
    tempo: [{ variant: 'default', tempo: 68, signature: '4/4' }],
    lyrics: [{ variant: 'default', lyrics: 'You were the Word at the beginning...' }],
    structure: [{ variant: 'default', structure: ['verse', 'chorus', 'bridge', 'chorus'] }],
    style: 'worship'
  },
  {
    _id: 'song_3',
    name: 'Way Maker',
    artist: 'Sinach',
    tags: ['praise', 'upbeat'],
    key: [{ variant: 'default', key: 'A' }],
    tempo: [{ variant: 'default', tempo: 84, signature: '4/4' }],
    lyrics: [{ variant: 'default', lyrics: 'You are here moving in our midst...' }],
    structure: [{ variant: 'default', structure: ['verse', 'chorus', 'bridge', 'chorus'] }],
    style: 'worship'
  }
]

export const handlers = [
  http.get(route, () => {
    return HttpResponse.json(songs)
  }),

  http.post(scrapeRoute, async ({ request }) => {
    const body = (await request.json()) as ScrapeSongRequest
    const query = body.query?.trim?.() ?? ''

    if (!query) return HttpResponse.json({ results: [] })

    return HttpResponse.json({
      results: [
        {
          title: query,
          artist: 'Unknown',
          key: 'C',
          duration: '',
          bpm: '120',
          links: { spotify: '', apple: '' }
        }
      ]
    })
  }),

  http.post(route, async ({ request }) => {
    const newSong = await request.json() as SaveSongRequest
    const songWithId: Song = {
      ...newSong,
      _id: `song_${Date.now()}`,
      tags: newSong.tags || [],
      lyrics: newSong.lyrics || [],
      tempo: newSong.tempo || [],
      key: newSong.key || [],
      structure: (newSong.structure as any) || []
    }
    songs.push(songWithId)
    return HttpResponse.json(songWithId, { status: 201 })
  }),

  http.put(`${route}/:id`, async ({ request, params }) => {
    const { id } = params as { id: string }
    const updatedSong = await request.json() as SaveSongRequest
    const index = songs.findIndex(song => song._id === id)

    if (index === -1) {
      return HttpResponse.json({ error: 'Song not found' }, { status: 404 })
    }

    const songWithId: Song = {
      ...updatedSong,
      _id: id,
      tags: updatedSong.tags || [],
      lyrics: updatedSong.lyrics || [],
      tempo: updatedSong.tempo || [],
      key: updatedSong.key || [],
      structure: (updatedSong.structure as any) || []
    }

    songs[index] = songWithId
    return HttpResponse.json(songWithId)
  }),

  http.delete(`${route}/:id`, async ({ params }) => {
    const { id } = params as { id: string }
    const index = songs.findIndex(song => song._id === id)

    if (index === -1) {
      return HttpResponse.json({ error: 'Song not found' }, { status: 404 })
    }

    songs.splice(index, 1)
    return HttpResponse.json({ message: 'Song deleted successfully' })
  })
]
