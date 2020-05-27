const core = require("@actions/core");
const { getReleaseType, createChangelogs, getTagName } = require("./main");

async function run() {
  try {
    core.setOutput("release_type", await getReleaseType());
    core.setOutput("changelogs", await createChangelogs());
    core.setOutput("tag_name", await getTagName());
  } catch (error) {
    core.setFailed(error.message);
  }
}

if (require.main === module) {
  run();
}
