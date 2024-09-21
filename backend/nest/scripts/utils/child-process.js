const childProcess = require('child_process')

// Get the index of the --no-push argument
// let noPush = false
// noPush = argv.indexOf('--no-push') !== -1

// Finish the script with success -> process.exit(0)
// Finish the script with error -> process.exit(1)

const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    const process = childProcess.exec(command)

    process.stdout.on('data', (data) => {
      console.log(data.toString())
    })

    process.stderr.on('data', (data) => {
      console.error(data.toString())
    })

    process.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Command failed with exit code ${code}`))
      }
    })
  })
}

const clearScreen = () => process.stdout.write('\x1b\x63')

module.exports = {
  execCommand,
  clearScreen
}
