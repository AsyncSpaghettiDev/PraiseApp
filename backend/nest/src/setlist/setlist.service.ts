import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Setlist } from '../schemas/setlist.schema'
import { Song } from '../schemas/song.schema'
import { CreateSetlistDTO, UpdateSetlistDTO } from './setlist.dto'

type IdLike = Types.ObjectId | string

@Injectable()
export class SetlistService {
  constructor(
    @InjectModel(Setlist.name) private setlistModel: Model<Setlist>,
    @InjectModel(Song.name) private songModel: Model<Song>
  ) {}

  private idToString(id: IdLike | null | undefined): string {
    if (!id) return ''
    return id.toString()
  }

  listAll(): Promise<Setlist[]> {
    return this.setlistModel.find().lean<Setlist[]>().exec()
  }

  async findOne(setlistId: string): Promise<Setlist> {
    if (!Types.ObjectId.isValid(setlistId))
      throw new HttpException('Setlist not found', HttpStatus.NOT_FOUND)
    const setlist = await this.setlistModel
      .findById(setlistId)
      .lean<Setlist | null>()
      .exec()
    if (!setlist)
      throw new HttpException('Setlist not found', HttpStatus.NOT_FOUND)
    return setlist
  }

  async searchByTag(tag: string): Promise<Setlist[]> {
    const setlists = await this.setlistModel
      .find({ tags: { $regex: tag, $options: 'i' } })
      .lean<Setlist[]>()
      .exec()
    return setlists
  }

  async songAppearances(songId: string): Promise<object> {
    // Count how many times a specific song appears in setlists
    if (!Types.ObjectId.isValid(songId))
      return { count: 0, lastSetlistSong: null }
    const song = await this.songModel
      .findById(songId)
      .lean<Pick<Song, 'name' | 'artist'> | null>()
      .exec()
    if (!song) return { count: 0, lastSetlistSong: null }

    const query = {
      'songs.name': song.name,
      'songs.artist': song.artist
    }

    const count = await this.setlistModel.countDocuments(query).exec()
    const lastSetlist = await this.setlistModel
      .findOne(query)
      .sort({ date: -1 })
      .lean<Setlist | null>()
      .exec()
    const lastSetlistSong = (lastSetlist as any)?.songs?.find(
      (ss) => ss?.name === song.name && ss?.artist === song.artist
    )
    return {
      count,
      lastSetlistSong
    }
  }

  async create(createSetlist: CreateSetlistDTO): Promise<Setlist> {
    const { date, name, songs, tags } = createSetlist
    try {
      return await this.setlistModel.create({
        name,
        date,
        tags,
        songs
      })
    } catch (err) {
      // since we have errors lets rollback the changes we made
      console.log(err)
      throw new HttpException({ err }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update(
    setlistId: string,
    updateSetlist: UpdateSetlistDTO
  ): Promise<any> {
    const { date, name, songs, tags } = updateSetlist
    if (!Types.ObjectId.isValid(setlistId))
      throw new HttpException('Setlist not found', HttpStatus.NOT_FOUND)
    const setlistToUpdate = await this.setlistModel.findById(setlistId).exec()
    if (!setlistToUpdate)
      throw new HttpException('Setlist not found', HttpStatus.NOT_FOUND)

    try {
      setlistToUpdate.date = date
      setlistToUpdate.name = name
      setlistToUpdate.tags = tags
      for (const setlistSong of songs) {
        const subdoc = setlistToUpdate.songs.find(
          (ss) =>
            this.idToString(ss._id) === this.idToString((setlistSong as any).id)
        )
        if (subdoc) {
          subdoc.name = (setlistSong as any).name
          subdoc.style = (setlistSong as any).style
          subdoc.artist = (setlistSong as any).artist
          subdoc.tempo = (setlistSong as any).tempo
          subdoc.key = (setlistSong as any).key
          subdoc.lyrics = (setlistSong as any).lyrics
          subdoc.structure = (setlistSong as any).structure
        }
      }
      await (setlistToUpdate as any).save()
    } catch (err) {
      // since we have errors lets rollback the changes we made
      console.log(err)
      throw new HttpException({ err }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    return this.findOne(setlistId)
  }

  async delete(
    setlistId: string,
    hardDelete: boolean = false
  ): Promise<unknown> {
    if (!Types.ObjectId.isValid(setlistId)) return null
    return hardDelete
      ? this.setlistModel.deleteOne({ _id: setlistId }).exec()
      : this.setlistModel
          .findByIdAndUpdate(
            setlistId,
            { deletedAt: new Date() },
            { new: true }
          )
          .exec()
  }
}
