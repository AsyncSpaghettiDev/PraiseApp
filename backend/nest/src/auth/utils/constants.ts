// TODO: Change this to come from an environment variable
export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'tempSecret' // -> 💡 This is the secret key used to sign the JWT
}
