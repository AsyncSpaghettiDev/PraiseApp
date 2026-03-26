import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { AppModule } from '../src/app.module'
import { MongoMemoryServer } from 'mongodb-memory-server'

export async function createE2EApp(): Promise<{
  app: INestApplication
  mongo: MongoMemoryServer
}> {
  process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-jwt-secret'
  process.env.JWT_ACCESS_SECRET =
    process.env.JWT_ACCESS_SECRET ?? 'test-jwt-access-secret'
  process.env.JWT_REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET ?? 'test-jwt-refresh-secret'

  const mongo = await MongoMemoryServer.create()
  process.env.MONGODB_URI = mongo.getUri('praise-app-db')

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule]
  }).compile()

  const app = moduleFixture.createNestApplication()
  app.useGlobalPipes(new ValidationPipe())
  app.setGlobalPrefix('api')
  await app.init()

  return { app, mongo }
}

export async function closeE2EApp({
  app,
  mongo
}: {
  app: INestApplication
  mongo: MongoMemoryServer
}) {
  await app?.close()
  await mongo?.stop()
}
