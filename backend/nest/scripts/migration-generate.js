const { execCommand, clearScreen } = require('./utils/child-process')
const { migrationsFolder, datasourceFile } = require('./utils/migration-utils')

const migrationName = process.argv[2]
const migrationFile = `${migrationsFolder}/${migrationName}`;

(async () => {
  clearScreen()
  console.log('Generating migration ...')
  if (!migrationName) {
    console.error('Migration name is required!')
    process.exit(1)
  }
  await execCommand(`pnpm run typeorm migration:generate ${migrationFile} -d ${datasourceFile}`)
  console.log('Running eslint fix ...')
  await execCommand('eslint --fix src/migrations')
  console.log('Migration generated and eslint fixed successfully!')
})()
