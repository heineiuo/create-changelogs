const core = require('@actions/core');
const { getReleaseType, createChangelogs } = require('./main')


async function run() {
  try {
    core.setOutput('release_type', await getReleaseType());
    core.setOutput('changelogs', await createChangelogs());
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;