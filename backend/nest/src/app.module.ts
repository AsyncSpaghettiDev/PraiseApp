import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { config } from './config/config'
import { SongModule } from './song/song.module'
import { SetlistModule } from './setlist/setlist.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
      load: [config]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb.uri')
      })
    }),

    UsersModule,
    AuthModule,
    SongModule,
    SetlistModule
  ]
})
export class AppModule {}
