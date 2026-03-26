import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

@Schema({ _id: true })
export class SongTempo {
  _id: Types.ObjectId

  @Prop({ required: true })
  variant: string

  @Prop({ required: true })
  tempo: number

  @Prop({ required: true })
  signature: string
}

export const SongTempoSchema = SchemaFactory.createForClass(SongTempo)

@Schema({ _id: true })
export class SongKey {
  _id: Types.ObjectId

  @Prop({ required: true })
  variant: string

  @Prop({ required: true })
  key: string
}

export const SongKeySchema = SchemaFactory.createForClass(SongKey)

@Schema({ _id: true })
export class SongLyrics {
  _id: Types.ObjectId

  @Prop({ required: true })
  variant: string

  @Prop({ required: true })
  lyrics: string
}

export const SongLyricsSchema = SchemaFactory.createForClass(SongLyrics)

@Schema({ _id: true })
export class SongStructure {
  _id: Types.ObjectId

  @Prop({ required: true })
  variant: string

  @Prop({ required: true, type: [String] })
  structure: string[]
}

export const SongStructureSchema = SchemaFactory.createForClass(SongStructure)

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Song {
  _id: Types.ObjectId

  @Prop({ required: true })
  name: string

  @Prop({ required: true, enum: ['praise', 'worship'] })
  style: 'praise' | 'worship'

  @Prop({ required: true })
  artist: string

  @Prop({ required: true, type: [String], default: [] })
  tags: string[]

  @Prop({ type: [SongTempoSchema], default: [] })
  tempo: SongTempo[]

  @Prop({ type: [SongKeySchema], default: [] })
  key: SongKey[]

  @Prop({ type: [SongLyricsSchema], default: [] })
  lyrics: SongLyrics[]

  @Prop({ type: [SongStructureSchema], default: [] })
  structure: SongStructure[]

  @Prop()
  createdAt: Date

  @Prop()
  updatedAt: Date

  @Prop()
  deletedAt?: Date
}

export type SongDocument = HydratedDocument<Song>

export const SongSchema = SchemaFactory.createForClass(Song)
