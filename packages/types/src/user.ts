export interface CreateUser {
  firstName: string;
  lastName?: string;
  username: string;
  password?: string;
  refreshToken?: string;
}

export interface UpdateUser {
  firstName?: string;
  lastName?: string;
  username?: string;
  password?: string;
  refreshToken?: string;
}

export interface UserResponse {
  _id: string;
  firstName: string;
  lastName?: string;
  username: string;
  createdAt: string;
  deletedAt?: string;
}
