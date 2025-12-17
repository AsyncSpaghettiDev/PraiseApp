/** @format */

import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { closeE2EApp, createE2EApp } from '../test/e2e-utils'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let mongo: any

  beforeAll(async () => {
    const setup = await createE2EApp()
    app = setup.app
    mongo = setup.mongo
  })

  afterAll(async () => {
    await closeE2EApp({ app, mongo })
  })

  it('/api/songs (GET)', () => {
    return request(app.getHttpServer()).get('/api/songs').expect(200)
  })
})
