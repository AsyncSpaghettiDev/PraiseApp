import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { closeE2EApp, createE2EApp } from '../../test/e2e-utils'

function createSongPayload(name: string) {
  return {
    name,
    style: 'praise',
    artist: 'Tester',
    tags: ['alpha', 'beta'],
    tempo: [{ variant: 'default', tempo: 120, signature: '4/4' }],
    key: [{ variant: 'default', key: 'C' }],
    lyrics: [
      { variant: 'default', lyrics: JSON.stringify({ v1: 'hello world' }) }
    ],
    structure: [{ variant: 'default', structure: JSON.stringify(['v1']) }]
  }
}

describe('Songs (e2e)', () => {
  let app: INestApplication
  let mongo: any

  let songId: string

  beforeAll(async () => {
    const setup = await createE2EApp()
    app = setup.app
    mongo = setup.mongo

    const created = await request(app.getHttpServer())
      .post('/api/songs')
      .send(createSongPayload('My Song'))
      .expect(201)

    songId = created.body._id ?? created.body.id
  })

  afterAll(async () => {
    await closeE2EApp({ app, mongo })
  })

  it('/api/songs (GET)', async () => {
    await request(app.getHttpServer()).get('/api/songs').expect(200)
  })

  it('/api/songs/tags (GET)', async () => {
    await request(app.getHttpServer())
      .get('/api/songs/tags')
      .query({ tag: 'alpha' })
      .expect(200)
  })

  it('/api/songs/searchByLyrics (GET)', async () => {
    await request(app.getHttpServer())
      .get('/api/songs/searchByLyrics')
      .query({ q: 'hello' })
      .expect(200)
  })

  it('/api/songs/:id (GET)', async () => {
    await request(app.getHttpServer()).get(`/api/songs/${songId}`).expect(200)
  })

  it('/api/songs/:id (PUT)', async () => {
    const current = await request(app.getHttpServer())
      .get(`/api/songs/${songId}`)
      .expect(200)

    const tempoId = current.body.tempo?.[0]?._id
    const keyId = current.body.key?.[0]?._id
    const lyricsId = current.body.lyrics?.[0]?._id
    const structureId = current.body.structure?.[0]?._id

    const updatePayload = {
      ...createSongPayload('My Song (Updated)'),
      id: songId,
      tempo: [
        { id: tempoId, variant: 'default', tempo: 121, signature: '3/4' }
      ],
      key: [{ id: keyId, variant: 'default', key: 'D' }],
      lyrics: [
        {
          id: lyricsId,
          variant: 'default',
          lyrics: JSON.stringify({ v1: 'hello updated' })
        }
      ],
      structure: [
        {
          id: structureId,
          variant: 'default',
          structure: JSON.stringify(['v1'])
        }
      ]
    }

    await request(app.getHttpServer())
      .put(`/api/songs/${songId}`)
      .send(updatePayload)
      .expect(200)
  })

  it('/api/songs/archive/:id (DELETE)', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/songs')
      .send(createSongPayload('Archive Me'))
      .expect(201)

    const id = created.body._id ?? created.body.id

    await request(app.getHttpServer())
      .delete(`/api/songs/archive/${id}`)
      .expect(200)
  })

  it('/api/songs/remove/:id (DELETE)', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/songs')
      .send(createSongPayload('Remove Me'))
      .expect(201)

    const id = created.body._id ?? created.body.id

    await request(app.getHttpServer())
      .delete(`/api/songs/remove/${id}`)
      .expect(200)
  })
})
