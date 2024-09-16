import { DataSource, DataSourceOptions as Options } from 'typeorm'
import 'dotenv/config'
import entities from '../entities'

export const DataSourceOptions: Options = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: +process.env.DATABASE_PORT || 5432,
  username: process.env.DATABASE_USER || 'test',
  password: process.env.DATABASE_PASSWORD || 'test',
  database: process.env.DATABASE_NAME || 'test',
  entities,
  migrations: ['./dist/src/migrations/*.js'],
  migrationsRun: true
}

const AppDataSource: DataSource = new DataSource(DataSourceOptions)

export default AppDataSource
