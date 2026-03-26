import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { closeE2EApp, createE2EApp } from '../../test/e2e-utils'

describe('Users (e2e)', () => {
  let app: INestApplication
  let mongo: any

  const user = {
    firstName: 'Profile',
    lastName: 'User',
    username: 'profileuser',
    password: 'password123'
  }

  beforeAll(async () => {
    const setup = await createE2EApp()
    app = setup.app
    mongo = setup.mongo

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(user)
      .expect(201)
  })

  afterAll(async () => {
    await closeE2EApp({ app, mongo })
  })

  it('/api/users/profile (GET) requires auth', async () => {
    await request(app.getHttpServer()).get('/api/users/profile').expect(401)
  })

  it('/api/users/profile (GET) returns jwt payload', async () => {
    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: user.username, password: user.password })
      .expect(201)

    const accessToken = login.body.accessToken

    const res = await request(app.getHttpServer())
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)

    expect(res.body).toHaveProperty('sub')
    expect(res.body).toHaveProperty('username', user.username)
  })
})
