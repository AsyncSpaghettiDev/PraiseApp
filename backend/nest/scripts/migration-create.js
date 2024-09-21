// pnpm typeorm migration:create ./migrations/init
const { execCommand, clearScreen } = require('./utils/child-process')
const { migrationsFolder } = require('./utils/migration-utils')

const migrationName = process.argv[2]
const migrationFile = `${migrationsFolder}/${migrationName}`

;(async () => {
  clearScreen()
  console.log('Creating migration ...')
  await execCommand(`pnpm run typeorm migration:create ${migrationFile}`)
  console.log('Running eslint fix ...')
  await execCommand('eslint --fix src/migrations')
  console.log('Migration created and eslint fixed successfully!')
})()
