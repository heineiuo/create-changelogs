const argv = require('yargs').argv
const main = require('../src/main')

async function cli() {
  if (argv.releaseType) {
    console.log(await main.getReleaseType())
    return
  }

  const rawChangelog = await main.createChangelogs()
  console.log(main.escapeChangelog(rawChangelog))
}

cli()