let envFile

export const config = () => {
  if (envFile === undefined) envFile = process.env
  const variables = {
    jwtSecret: envFile.JWT_SECRET,
    jwtAccessSecret: envFile.JWT_ACCESS_SECRET,
    jwtRefreshSecret: envFile.JWT_REFRESH_SECRET,
    environment: envFile.NODE_ENV,
    database: {
      host: envFile.DATABASE_HOST,
      port: parseInt(envFile.DATABASE_PORT, 10),
      username: envFile.DATABASE_USER,
      password: envFile.DATABASE_PASSWORD,
      database: envFile.DATABASE_NAME
    }
  }
  return variables
}
