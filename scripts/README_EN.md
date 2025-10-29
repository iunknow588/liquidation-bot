# Script Usage Guide

## Overview

This directory contains all automation scripts for the Solana Liquidation Bot project, organized by functional domain to ensure only one effective script per domain.

## Script List

| Script Name | Domain | Description | Use Case |
|-------------|--------|-------------|----------|
| `sync-config.sh` | Configuration | Sync backend config to frontend | Development setup |
| `verify-security.sh` | Security | Verify project security | Pre-deployment check |
| `setup-env.sh` | Environment | Configure Vercel environment variables | Production setup |
| `upload-github.sh` | Code Management | Upload code to GitHub | Version control |
| `deploy.sh` | Deployment | Deploy to Vercel | Application deployment |
| `full-deploy.sh` | Complete Flow | Complete deployment process | One-click deployment |

## Detailed Script Descriptions

### 1. Configuration Management

#### `sync-config.sh` - Configuration Sync Script

**Function**: Sync Rust backend configuration to Next.js frontend

**Usage**:
```bash
cd /home/lc/luckee_dao/solana-liquidation-dashboard
./scripts/sync-config.sh
```

**Actions**:
- Reads `../solana-liquidation-bot/env/.info` configuration file
- Generates `public.env` environment variables file
- Syncs version information and RPC configuration

**Output**:
- Creates `public.env` file
- Displays current configuration information
- Provides next step recommendations

### 2. Security Verification

#### `verify-security.sh` - Security Verification Script

**Function**: Verify project security to ensure safe deployment

**Usage**:
```bash
cd /home/lc/luckee_dao/solana-liquidation-dashboard
./scripts/verify-security.sh
```

**Checks**:
- ✅ `public.env` file exists
- ✅ Public configuration content is valid
- ✅ Version information is configured
- ✅ RPC configuration is set
- ✅ API Route exists
- ✅ Frontend doesn't directly use Solana Connection
- ✅ No API Key leaks in build files

**Output**:
- Pass/fail status
- Detailed check results
- Fix recommendations

### 3. Environment Configuration

#### `setup-env.sh` - Environment Variables Configuration Script

**Function**: Configure Vercel environment variables

**Usage**:
```bash
cd /home/lc/luckee_dao/solana-liquidation-dashboard
./scripts/setup-env.sh
```

**Configuration**:
- Version information (frontend visible)
- Solana configuration (frontend visible)
- API Key (server-side, private)

**Prerequisites**:
- Vercel CLI installed
- Logged into Vercel account

### 4. Code Management

#### `upload-github.sh` - GitHub Upload Script

**Function**: Upload code to GitHub repository

**Usage**:
```bash
cd /home/lc/luckee_dao/solana-liquidation-dashboard
./scripts/upload-github.sh
```

**Security Features**:
- Automatically excludes sensitive files
- Validates `.gitignore` configuration
- Cleans tracked sensitive files
- Checks API Key protection

**Output**:
- Repository information
- Security status
- Next step recommendations

### 5. Deployment Management

#### `deploy.sh` - Vercel Deployment Script

**Function**: Deploy application to Vercel

**Usage**:
```bash
cd /home/lc/luckee_dao/solana-liquidation-dashboard
./scripts/deploy.sh
```

**Deployment Process**:
1. Pre-checks (Node.js, npm, Vercel CLI)
2. Security verification
3. Dependency installation
4. Build testing
5. Environment variable preparation
6. Vercel authentication
7. Deployment environment selection
8. Execute deployment
9. Post-deployment verification

**Deployment Options**:
- Preview environment (testing)
- Production environment (official)

### 6. Complete Flow

#### `full-deploy.sh` - Complete Deployment Process Script

**Function**: One-click complete deployment process

**Usage**:
```bash
cd /home/lc/luckee_dao/solana-liquidation-dashboard
./scripts/full-deploy.sh
```

**Execution Process**:
1. Security verification
2. GitHub upload
3. Vercel deployment
4. Verify deployment results

**Features**:
- Automated complete process
- Colored output interface
- Detailed progress display
- Error handling and recovery

## Usage Scenarios

### Development Environment Setup

```bash
# 1. Set permissions
./scripts/setup-permissions.sh

# 2. Sync configuration
./scripts/sync-config.sh

# 3. Verify security
./scripts/verify-security.sh

# 4. Start development
npm run dev
```

### Production Environment Deployment

```bash
# Method 1: Complete deployment process (recommended)
./scripts/full-deploy.sh

# Method 2: Step-by-step deployment
./scripts/upload-github.sh
./scripts/setup-env.sh
./scripts/deploy.sh
```

### Environment Variables Configuration

```bash
# Configure Vercel environment variables
./scripts/setup-env.sh
```

## Configuration Requirements

### Environment Dependencies

- **Node.js**: Version 18+
- **npm**: Latest version
- **Vercel CLI**: Installed and logged in
- **Git**: SSH key configured

### File Dependencies

- `../solana-liquidation-bot/env/.info` - Backend configuration file
- `.gitignore` - Git ignore rules
- `package.json` - Project configuration

### Permission Settings

```bash
# Add execution permissions
chmod +x scripts/*.sh
```

## Security Considerations

### 1. Sensitive File Protection

Ensure the following files are in `.gitignore`:
- `public.env` (public configuration)
- `安全*.md`
- `配置*.md`
- `*deploy*.sh`

### 2. API Key Protection

- Don't use `NEXT_PUBLIC_` prefix
- Configure in Vercel Dashboard manually
- Rotate API Keys regularly

### 3. Pre-deployment Verification

- Run `verify-security.sh`
- Check build files for leaks
- Verify environment variable configuration

## Troubleshooting

### Common Issues

#### 1. Permission Errors
```bash
# Solution
chmod +x scripts/*.sh
```

#### 2. Vercel Not Logged In
```bash
# Solution
vercel login
```

#### 3. Git Configuration Errors
```bash
# Check SSH key
ssh -T git@github.com

# Check remote repository
git remote -v
```

#### 4. Build Failures
```bash
# Check dependencies
npm install

# Check code
npm run build
```

### Debugging Methods

#### 1. View Detailed Logs
```bash
# Security verification logs
./scripts/verify-security.sh > security.log 2>&1

# Build logs
npm run build > build.log 2>&1
```

#### 2. Check Environment Variables
```bash
# View public configuration
cat public.env

# View Vercel environment variables
vercel env ls
```

#### 3. Verify Deployment Status
```bash
# View Vercel deployments
vercel ls

# View deployment logs
vercel logs
```

## Related Documentation

- [Project Documentation](../docs/README.md)
- [Deployment Guide](../docs/deployment/vercel.md)
- [Environment Configuration](../docs/deployment/environment.md)
- [Security Guide](../docs/architecture/security.md)

## Script Maintenance

### Updating Scripts

1. Modify script content
2. Test script functionality
3. Update documentation
4. Commit to Git

### Adding New Scripts

1. Determine functional domain
2. Write script code
3. Add usage instructions
4. Update README.md

### Removing Deprecated Scripts

1. Confirm script is deprecated
2. Delete script file
3. Update documentation
4. Commit changes

## Best Practices

### 1. Script Naming Convention

- Use lowercase letters and hyphens
- Clear functional description
- Avoid duplicate naming

### 2. Error Handling

- Use `set -e` to exit on errors
- Provide clear error messages
- Include fix recommendations

### 3. User-Friendly

- Colored output interface
- Progress display
- Detailed operation instructions

### 4. Security

- Verify sensitive file protection
- Check API Key leaks
- Provide security recommendations

---

**Document Version**: v2.0.0  
**Last Updated**: 2025-01-29  
**Maintainer**: Development Team
