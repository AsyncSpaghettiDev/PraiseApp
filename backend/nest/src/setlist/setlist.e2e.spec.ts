import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { closeE2EApp, createE2EApp } from '../../test/e2e-utils'

function createSongPayload(name: string) {
  return {
    name,
    style: 'praise',
    artist: 'Tester',
    tags: ['setlist-tag'],
    tempo: [{ variant: 'default', tempo: 100 }],
    key: [{ variant: 'default', key: 'C' }],
    lyrics: [{ variant: 'default', lyrics: JSON.stringify({ v1: 'hello' }) }],
    structure: [{ variant: 'default', structure: JSON.stringify(['v1']) }]
  }
}

describe('Setlist (e2e)', () => {
  let app: INestApplication
  let mongo: any

  let songId: string
  let setlistSongPayload: any

  let setlistId: string
  let setlistSongId: string

  beforeAll(async () => {
    const setup = await createE2EApp()
    app = setup.app
    mongo = setup.mongo

    const song = await request(app.getHttpServer())
      .post('/api/songs')
      .send(createSongPayload('Setlist Song'))
      .expect(201)

    songId = song.body._id ?? song.body.id

    const currentSong = await request(app.getHttpServer())
      .get(`/api/songs/${songId}`)
      .expect(200)

    setlistSongPayload = {
      name: currentSong.body.name,
      style: currentSong.body.style,
      artist: currentSong.body.artist,
      tags: currentSong.body.tags,
      tempo: {
        variant: currentSong.body.tempo?.[0]?.variant,
        tempo: currentSong.body.tempo?.[0]?.tempo
      },
      key: {
        variant: currentSong.body.key?.[0]?.variant,
        key: currentSong.body.key?.[0]?.key
      },
      lyrics: {
        variant: currentSong.body.lyrics?.[0]?.variant,
        lyrics: currentSong.body.lyrics?.[0]?.lyrics
      },
      structure: {
        variant: currentSong.body.structure?.[0]?.variant,
        structure: currentSong.body.structure?.[0]?.structure
      }
    }

    const setlist = await request(app.getHttpServer())
      .post('/api/setlist')
      .send({
        name: 'My Setlist',
        tags: ['tag1'],
        date: new Date().toISOString(),
        songs: [setlistSongPayload]
      })
      .expect(201)

    setlistId = setlist.body._id ?? setlist.body.id
    setlistSongId = setlist.body.songs[0]._id
  })

  afterAll(async () => {
    await closeE2EApp({ app, mongo })
  })

  it('/api/setlist/list (GET)', async () => {
    await request(app.getHttpServer()).get('/api/setlist/list').expect(200)
  })

  it('/api/setlist/tags (GET)', async () => {
    await request(app.getHttpServer())
      .get('/api/setlist/tags')
      .query({ tag: 'tag1' })
      .expect(200)
  })

  it('/api/setlist/:id (GET)', async () => {
    await request(app.getHttpServer())
      .get(`/api/setlist/${setlistId}`)
      .expect(200)
  })

  it('/api/setlist/song/:id (GET)', async () => {
    await request(app.getHttpServer())
      .get(`/api/setlist/song/${songId}`)
      .expect(200)
  })

  it('/api/setlist/:id (PUT)', async () => {
    await request(app.getHttpServer())
      .put(`/api/setlist/${setlistId}`)
      .send({
        id: setlistId,
        name: 'My Setlist (Updated)',
        tags: ['tag1'],
        date: new Date().toISOString(),
        songs: [{ ...setlistSongPayload, id: setlistSongId }]
      })
      .expect(200)
  })

  it('/api/setlist/archive/:id (DELETE)', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/setlist')
      .send({
        name: 'Archive Setlist',
        tags: ['tag-archive'],
        date: new Date().toISOString(),
        songs: [setlistSongPayload]
      })
      .expect(201)

    const id = created.body._id ?? created.body.id

    await request(app.getHttpServer())
      .delete(`/api/setlist/archive/${id}`)
      .expect(200)
  })

  it('/api/setlist/remove/:id (DELETE)', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/setlist')
      .send({
        name: 'Remove Setlist',
        tags: ['tag-remove'],
        date: new Date().toISOString(),
        songs: [setlistSongPayload]
      })
      .expect(201)

    const id = created.body._id ?? created.body.id

    await request(app.getHttpServer())
      .delete(`/api/setlist/remove/${id}`)
      .expect(200)
  })
})
