const core = require("@actions/core");
const { getReleaseType, createChangelogs, getTagName } = require("./main");

async function run() {
  try {
    const [releaseType, changelogs, tagName] = await Promise.all([
      getReleaseType(),
      createChangelogs(),
      getTagName(),
    ]);

    console.log("release_type", releaseType);
    console.log("changelogs", changelogs);
    console.log("tag_name", tagName);

    core.setOutput("release_type", releaseType);
    core.setOutput("changelogs", changelogs);
    core.setOutput("tag_name", tagName);
  } catch (error) {
    console.log(error);
    core.setFailed(error.message);
  }
}

if (require.main === module) {
  run();
}
