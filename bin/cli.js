const argv = require('yargs').argv
const { getReleaseType, createChangelogs } = require('../src/main')

async function main() {
  if (argv.releaseType) {
    console.log(await getReleaseType())
    return
  }

  console.log(await createChangelogs())
}

main()