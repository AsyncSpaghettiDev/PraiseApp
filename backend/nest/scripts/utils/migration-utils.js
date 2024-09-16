const path = require('path')

const migrationsFolder = path.resolve(__dirname, '../../src/migrations')
const datasourceFile = path.resolve(__dirname, '../../src/config/datasource.ts')

module.exports = {
  migrationsFolder,
  datasourceFile
}
