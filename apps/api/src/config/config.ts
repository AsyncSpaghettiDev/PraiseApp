let envFile

export const config = () => {
  if (envFile === undefined) envFile = process.env
  const variables = {
    port: envFile.PORT ?? 7000,
    jwtSecret: envFile.JWT_SECRET,
    jwtAccessSecret: envFile.JWT_ACCESS_SECRET,
    jwtRefreshSecret: envFile.JWT_REFRESH_SECRET,
    environment: envFile.NODE_ENV,
    mongodb: {
      uri: envFile.MONGODB_URI
    }
  }
  return variables
}
