# Publishing to NPM

This guide walks you through publishing React Form packages to NPM.

## Prerequisites

1. **NPM Account**: Create an account at [npmjs.com](https://www.npmjs.com/)
2. **NPM Login**: Run `npm login` in your terminal
3. **Organization (Optional)**: Create an organization for scoped packages

## Pre-Publish Checklist

- [ ] All tests pass (`npm test`)
- [ ] Code is linted (`npm run lint`)
- [ ] Documentation is up to date
- [ ] CHANGELOG.md is updated
- [ ] Version numbers are correct
- [ ] README files are complete
- [ ] Examples are working

## Publishing Steps

### 1. Update Version Numbers

Update version in all `package.json` files:
- `package.json` (root)
- `packages/core/package.json`
- `packages/react/package.json`
- `packages/visualizer/package.json`

```bash
# Or use npm version
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

### 2. Build All Packages

```bash
npm run build
```

### 3. Test Locally

Test packages locally before publishing:

```bash
# In each package directory
cd packages/core
npm pack
# This creates a .tgz file you can install locally for testing
```

### 4. Publish to NPM

**Option A: Publish All Packages**
```bash
npm publish --workspaces --access public
```

**Option B: Publish Individual Packages**
```bash
cd packages/core
npm publish --access public

cd ../react
npm publish --access public

cd ../visualizer
npm publish --access public
```

### 5. Create Git Tag

```bash
git tag v1.0.0
git push origin v1.0.0
```

### 6. Create GitHub Release

1. Go to your repository on GitHub
2. Click "Releases" → "Create a new release"
3. Select the tag you just created
4. Add release notes from CHANGELOG.md
5. Publish the release

## NPM Scripts for Publishing

Add these to your root `package.json`:

```json
{
  "scripts": {
    "prepublishOnly": "npm run build && npm test",
    "publish:all": "npm publish --workspaces --access public",
    "version:patch": "npm version patch --workspaces",
    "version:minor": "npm version minor --workspaces",
    "version:major": "npm version major --workspaces"
  }
}
```

## Scoped Packages

If you want to use scoped packages (e.g., `@yourname/React Form-core`):

1. Update package names in all `package.json` files:
   ```json
   {
     "name": "@yourname/React Form-core"
   }
   ```

2. Publish with access flag:
   ```bash
   npm publish --access public
   ```

## Automated Publishing with GitHub Actions

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to NPM

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm test
      - run: npm publish --workspaces --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Post-Publish

1. **Verify Installation**: Test installing your package
   ```bash
   npm install react-form-engine
   ```

2. **Update Documentation**: Ensure all links and badges are correct

3. **Announce**: Share on social media, dev.to, etc.

## Troubleshooting

### "Package already exists"
- You cannot republish the same version
- Increment the version number

### "You do not have permission"
- Make sure you're logged in: `npm whoami`
- Check package name doesn't conflict with existing packages

### "Invalid package.json"
- Validate your package.json files
- Ensure all required fields are present

## Best Practices

1. **Semantic Versioning**: Follow semver strictly
2. **Changelog**: Always update CHANGELOG.md
3. **Testing**: Never publish without passing tests
4. **Documentation**: Keep docs in sync with code
5. **Deprecation**: Use `npm deprecate` for old versions if needed

## Useful Commands

```bash
# Check what will be published
npm pack --dry-run

# View package info
npm view react-form-engine

# Unpublish (only within 72 hours)
npm unpublish react-form-engine@1.0.0

# Deprecate a version
npm deprecate react-form-engine@1.0.0 "Use version 1.0.1 instead"
```


