const core = require("@actions/core");
const {
  getReleaseType,
  createChangelogs,
  parseLatestCommitMessage,
  getTagName,
} = require("./main");

async function run() {
  try {
    const [releaseType, changelogs, tagName, messageParsed] = await Promise.all(
      [
        getReleaseType(),
        createChangelogs(),
        getTagName(),
        parseLatestCommitMessage(),
      ]
    );

    console.log("release_type", releaseType);
    console.log("changelogs", changelogs);
    console.log("tag_name", tagName);

    console.log("valid", messageParsed.valid);
    console.log("raw", messageParsed.raw);
    console.log("major", messageParsed.major);
    console.log("minor", messageParsed.minor);
    console.log("patch", messageParsed.patch);
    console.log("is_prerelease", messageParsed.is_prerelease);
    console.log("prerelease_name", messageParsed.prerelease_name);
    console.log("prerelease_number", messageParsed.prerelease_number);
    console.log("build_number", messageParsed.build_number);
    console.log("version", messageParsed.version);

    core.setOutput("release_type", releaseType);
    core.setOutput("changelogs", changelogs);
    core.setOutput("tag_name", tagName);

    core.setOutput("valid", messageParsed.valid);
    core.setOutput("raw", messageParsed.raw);
    core.setOutput("major", messageParsed.major);
    core.setOutput("minor", messageParsed.minor);
    core.setOutput("patch", messageParsed.patch);
    core.setOutput("is_prerelease", messageParsed.is_prerelease);
    core.setOutput("prerelease_name", messageParsed.prerelease_name);
    core.setOutput("prerelease_number", messageParsed.prerelease_number);
    core.setOutput("build_number", messageParsed.build_number);
    core.setOutput("version", messageParsed.version);
  } catch (error) {
    console.log(error);
    core.setFailed(error.message);
  }
}

if (require.main === module) {
  run();
}
