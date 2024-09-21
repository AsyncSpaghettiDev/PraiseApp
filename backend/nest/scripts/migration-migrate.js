const { execCommand, clearScreen } = require('./utils/child-process')
const { datasourceFile } = require('./utils/migration-utils')

;(async () => {
  clearScreen()
  console.log('Running migration...')
  await execCommand('pnpm build')
  await execCommand(`pnpm typeorm migration:run -d ${datasourceFile}`)
})()
