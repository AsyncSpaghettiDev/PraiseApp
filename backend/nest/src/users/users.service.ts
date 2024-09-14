import { Injectable } from '@nestjs/common'

export type User = {
  id: number
  name: string
  username: string
  password: string
  permissions?: string[]
}

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      username: 'john_doe',
      password: 'pass',
      permissions: ['songs:read', 'songs:write', 'playlists:read', 'playlists:write']
    },
    {
      id: 2,
      name: 'Jane Doe',
      username: 'jane_doe',
      password: 'pass',
      permissions: ['songs:read', 'playlists:read']
    }
  ]

  async findOne (username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username)
  }
}
