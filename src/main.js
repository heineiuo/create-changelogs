const semver = require('semver');
const simpleGit = require('simple-git/promise')

function findPrevVersionTag(tagList) {
  let latestVer = semver.parse(tagList.latest)
  if (!latestVer) return null
  for (tagName of tagList.all) {
    const ver = semver.parse(tagName)
    if (tagName === tagList.latest) continue
    if (!ver) continue
    if (ver.prerelease.length > 0) continue
    return tagName
  }
  return null
}

async function getCommitsBetweenTags(git, prevTag, nextTag) {
  const results = await git.log({ from: prevTag, to: nextTag })
  const { all } = results

  const messages = []
  for (const line of all) {
    if (line.refs.indexOf('tag') > -1) continue
    messages.push(`* ${line.message}`)
  }

  return messages.sort()
}

async function getSortedTagList(git) {
  const tagList = await git.tags({ '--sort': 'creatordate' })
  const all = tagList.all.reverse()
  const latest = tagList.all[0]
  return { all, latest }
}

async function createChangelogs() {
  const git = simpleGit(process.cwd())
  const tagList = await getSortedTagList(git)

  if (!tagList.latest) {
    throw new Error('Error: No tags found.')
  }

  const prevVersionTag = findPrevVersionTag(tagList)

  const commits = await getCommitsBetweenTags(git, prevVersionTag, tagList.latest)
  let changelog = `Changes \n${commits.join('\n')}`
  changelog = changelog.replace(/%/g, '%25')
  changelog = changelog.replace(/\n/g, '%0A')
  changelog = changelog.replace(/\r/g, '%0D')

  return changelog
}

function escapeChangelog(input) {
  let changelog = input
  changelog = changelog.replace(/%/g, '%25')
  changelog = changelog.replace(/\n/g, '%0A')
  changelog = changelog.replace(/\r/g, '%0D')
  return changelog
}

async function getReleaseType() {
  const git = simpleGit(process.cwd())
  const tagList = await getSortedTagList(git)
  if (!tagList.latest) {
    throw new Error('Error: No tags found.')
    return
  }

  const ver = semver.parse(tagList.latest)
  if (!ver) {
    throw new Error('Error: Invalid tag')
  }

  return ver.prerelease.length > 0 ? 'prerelease' : 'release'
}


module.exports = {
  createChangelogs,
  getReleaseType,
  escapeChangelog
}