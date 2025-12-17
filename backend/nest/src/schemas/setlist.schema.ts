import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import {
  SongTempoSchema,
  SongKeySchema,
  SongLyricsSchema,
  SongStructureSchema,
  SongTempo,
  SongKey,
  SongLyrics,
  SongStructure
} from './song.schema'

@Schema({ _id: true })
export class SetlistSong {
  _id: Types.ObjectId

  @Prop({ required: true })
  name: string

  @Prop({ required: true, enum: ['praise', 'worship'] })
  style: 'praise' | 'worship'

  @Prop({ required: true })
  artist: string

  @Prop({ type: SongTempoSchema })
  tempo: SongTempo

  @Prop({ type: SongKeySchema })
  key: SongKey

  @Prop({ type: SongLyricsSchema })
  lyrics: SongLyrics

  @Prop({ type: SongStructureSchema })
  structure: SongStructure
}

const SetlistSongSchema = SchemaFactory.createForClass(SetlistSong)

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Setlist {
  _id: Types.ObjectId

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  date: Date

  @Prop({ required: true, type: [String], default: [] })
  tags: string[]

  @Prop({ type: [SetlistSongSchema], default: [] })
  songs: SetlistSong[]

  @Prop()
  createdAt: Date

  @Prop()
  updatedAt: Date

  @Prop()
  deletedAt?: Date
}

export type SetlistDocument = HydratedDocument<Setlist>

export const SetlistSchema = SchemaFactory.createForClass(Setlist)
