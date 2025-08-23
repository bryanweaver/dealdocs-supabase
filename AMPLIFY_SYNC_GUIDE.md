# Amplify Environment Synchronization Guide

## Problem
When working with AWS Amplify across multiple development machines, environments can get out of sync because:
- `aws-exports.js` is gitignored (auto-generated file)
- API keys can rotate or change
- Backend configurations may differ between machines

## Solution: Sync Procedure

### For New Team Members or New Machines
```bash
# 1. Clone the repository
git clone [repo-url]
cd dealdocs

# 2. Install dependencies
npm install

# 3. Pull Amplify backend configuration
amplify pull --appId d1v26x6qc0g3vu --envName dev

# 4. Start development
npm run dev
```

### When Contracts Don't Load (API Key Issue)
```bash
# This regenerates aws-exports.js with the correct API key
amplify pull --appId d1v26x6qc0g3vu --envName dev --yes
```

### After Backend Changes by Another Developer
```bash
# 1. Pull latest code
git pull

# 2. Sync Amplify backend
amplify pull --yes

# 3. Install any new dependencies
npm install
```

### Before Making Backend Changes
```bash
# 1. Always pull latest backend state first
amplify pull

# 2. Make your changes
# (modify schema, add functions, etc.)

# 3. Push changes to cloud
amplify push

# 4. Commit and push code changes
git add .
git commit -m "feat: backend changes description"
git push
```

## Important Files

### Gitignored (Auto-generated)
- `src/aws-exports.js` - Contains API endpoints and keys
- `amplify/backend/amplify-meta.json` - Backend metadata
- `amplify/.config/local-*` - Local configuration

### Version Controlled
- `amplify/backend/` - Backend definitions
- `amplify/team-provider-info.json` - Team environment settings
- `amplify/cli.json` - CLI configuration

## Troubleshooting

### Missing auth parameters error
If you see: `File at path: '.../auth/dealdocsef4d1e4c/parameters.json' does not exist`

Run: `amplify pull --yes` to regenerate all configuration files.

### Contracts not loading
1. Check API key in `src/aws-exports.js`
2. Compare with `amplify status` output
3. If different, run `amplify pull --yes`

### Multiple "backend" folders with numbers
These are artifacts from merge conflicts or interrupted operations.
Safe to delete folders like:
- `amplify/backend/api 2/`
- `amplify/backend/function 3/`
- etc.

Keep only the main folders without numbers.

## Current Environment Details
- App ID: `d1v26x6qc0g3vu`
- Environment: `dev`
- Region: `us-east-1`
- GraphQL Endpoint: `https://qi5ihbubezehzlpkfac7v63vvy.appsync-api.us-east-1.amazonaws.com/graphql`