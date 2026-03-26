import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { closeE2EApp, createE2EApp } from '../../test/e2e-utils'

describe('Auth (e2e)', () => {
  let app: INestApplication
  let mongo: any

  const user = {
    firstName: 'Test',
    lastName: 'User',
    username: 'testuser',
    password: 'password123'
  }

  beforeAll(async () => {
    const setup = await createE2EApp()
    app = setup.app
    mongo = setup.mongo
  })

  afterAll(async () => {
    await closeE2EApp({ app, mongo })
  })

  it('/api/auth/register (POST) returns tokens', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(user)
      .expect(201)

    expect(res.body).toHaveProperty('accessToken')
    expect(res.body).toHaveProperty('refreshToken')
  })

  it('/api/auth/login (POST) returns tokens', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: user.username, password: user.password })
      .expect(201)

    expect(res.body).toHaveProperty('accessToken')
    expect(res.body).toHaveProperty('refreshToken')
  })

  it('/api/auth/refresh (GET) returns new tokens', async () => {
    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: user.username, password: user.password })
      .expect(201)

    const refreshToken = login.body.refreshToken

    const res = await request(app.getHttpServer())
      .get('/api/auth/refresh')
      .set('Authorization', `Bearer ${refreshToken}`)
      .expect(200)

    expect(res.body).toHaveProperty('accessToken')
    expect(res.body).toHaveProperty('refreshToken')
  })

  it('/api/auth/logout (POST) succeeds with access token', async () => {
    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: user.username, password: user.password })
      .expect(201)

    const accessToken = login.body.accessToken

    await request(app.getHttpServer())
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201)
  })
})
