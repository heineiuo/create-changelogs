const semver = require("semver");
const simpleGit = require("simple-git");

const git = simpleGit(process.cwd());

function parseCommitMessage(message) {
  const result = {};
  for (const outputName of [
    "valid",
    "raw",
    "major",
    "minor",
    "patch",
    "is_prerelease",
    "prerelease_name",
    "prerelease_number",
    "build_number",
    "version",
  ]) {
    result[outputName] = null;
  }
  result.valid = false;
  result.is_prerelease = false;

  try {
    const parsed = semver.parse(message);
    if (parsed) {
      Object.assign(result, parsed);
      result.valid = true;
      if (parsed.build.length > 0) {
        try {
          result.build_number = parseInt(parsed.build[0], 10);
        } catch (e) {}
      }
      if (parsed.prerelease.length > 0) {
        result.is_prerelease = true;
        result.prerelease_name = parsed.prerelease[0];
        result.prerelease_number = parsed.prerelease[1];
      } else {
        result.is_prerelease = false;
      }
    }
  } catch (e) {
    console.log(e);
  }
  return result;
}

async function parseLatestCommitMessage() {
  const log = await git.log();
  return parseCommitMessage(log.latest.message);
}

async function createChangelogs() {
  const logs = await git.log();

  let isFirst = true;
  let hasPrereleaseReached = false;
  const messagesAfterLatestPrerelease = [];
  const messagesAfterLatestRelease = [];

  for (const log of logs.all) {
    const semverInfo = parseCommitMessage(log.message);
    if (!semverInfo.valid) {
      if (!hasPrereleaseReached) {
        messagesAfterLatestPrerelease.unshift(`* ${log.message}`);
      } else {
        messagesAfterLatestRelease.unshift(`* ${log.message}`);
      }
      isFirst = false;
      continue;
    } else if (isFirst) {
      isFirst = false;
      continue;
    } else if (semverInfo.is_prerelease) {
      hasPrereleaseReached = true;
      continue;
    } else {
      break;
    }
  }

  messagesAfterLatestPrerelease.sort();
  messagesAfterLatestRelease.sort();

  if (messagesAfterLatestRelease.length > 0) {
    return `Changes \n${messagesAfterLatestPrerelease.join(
      "\n"
    )}\n Recent Changes\n ${messagesAfterLatestPrerelease.join("\n")}`;
  } else {
    return `Changes \n${messagesAfterLatestPrerelease.join("\n")}`;
  }
}

function escapeChangelog(input) {
  let changelog = input;
  changelog = changelog.replace(/%/g, "%25");
  changelog = changelog.replace(/\n/g, "%0A");
  changelog = changelog.replace(/\r/g, "%0D");
  return changelog;
}

async function getReleaseType() {
  const latest = await parseLatestCommitMessage();
  if (!latest.valid) {
    return null;
  }
  return latest.is_prerelease ? "prerelease" : "release";
}

async function getTagName() {
  const latest = await parseLatestCommitMessage();
  if (!latest.valid) {
    return null;
  }
  return latest.raw;
}

module.exports = {
  getTagName,
  createChangelogs,
  getReleaseType,
  escapeChangelog,
  parseLatestCommitMessage,
};
