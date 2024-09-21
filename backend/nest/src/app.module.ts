import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'

import entities from './entities'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { config } from './config/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities,
        migrations: ['./dist/src/migrations/*.js'],
        migrationsRun: true
      })
    }),

    UsersModule,
    AuthModule
  ]
})
export class AppModule {}
