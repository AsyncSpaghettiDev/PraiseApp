const { execCommand, clearScreen } = require('./utils/child-process')
const { datasourceFile } = require('./utils/migration-utils');

(async () => {
  clearScreen()
  console.log('Reverting migration...')
  await execCommand(`pnpm typeorm migration:revert -d ${datasourceFile}`)
}
)()
