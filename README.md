# Create Changelogs

An action can create changelogs between tags



### Outputs

- `release_type`: {string} `prerelease` or `release`
- `changelogs`: {string} generated changelogs
- `tag_name`: {string} git tag name, like `v1.0.0`
- `valid`: {boolean} is raw value a valid semver
- `raw`: {string} raw value
- `major`: {number|null} major
- `minor`: number|null} minor
- `patch`: {number|null} patch
- `is_prerelease`: {boolean|null} is prerelease
- `prerelease_name`: {string|null} prerelease name, like beta in v1.2.3-beta.4
- `prerelease_number`: {number|null} prerelease number, like 4 in v1.2.3-beta.4
- `build_number`: {number|null} build number, like 55555 in v1.2.3+55555
- `version`:{string|null} version, like 1.2.3-beta.1 in v1.2.3-beta.1 or 1.2.3 in v1.2.3+4444
    
### Example workflow - create changelogs
On every `push` to a tag matching the pattern `v*`

```yaml
on:
  push:
    # Sequence of patterns matched against refs/tags
    tags:
      - 'v*' # Push events to matching v*, i.e. v1.0, v20.15.10

name: Create Release

jobs:
  build:
    name: Create Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      
      - run: |
        git fetch --prune --unshallow --tags

      - name: Create changelogs
        id: changelogs
        uses: heineiuo/create-changelogs@master # 👀

      - name: Create Release
        id: create_release
        uses: actions/create-release@latest
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: ${{ github.ref }}
          body: ${{ steps.changelogs.outputs.changelogs }}
          draft: false
          prerelease: ${{ steps.changelogs.outputs.release_type == 'prerelease' }}


```
