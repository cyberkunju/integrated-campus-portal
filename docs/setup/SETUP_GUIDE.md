# Setup Guide

## Complete Installation and Configuration Guide

This guide covers all setup methods for the Student Portal project.

## Prerequisites

### Required Software

1. **Node.js** (v18.x or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **npm** (v9.x or higher)
   - Comes with Node.js
   - Verify: `npm --version`

3. **Git**
   - Download: https://git-scm.com/
   - Verify: `git --version`

### Optional (Based on Setup Method)

4. **Docker Desktop** (for Docker setup)
   - Download: https://www.docker.com/products/docker-desktop
   - Verify: `docker --version` and `docker-compose --version`

5. **XAMPP** (for local PHP development)
   - Download: https://www.apachefriends.org/
   - Includes Apache, MySQL, PHP

## Quick Start (Frontend Only)

### 1. Clone Repository

```bash
git clone <repository-url>
cd studentportal-main
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

Built files will be in the `dist` folder.

## Setup Methods

Choose one of the following setup methods based on your needs:

### Method 1: Docker Setup (Recommended for Development)
See [Docker Setup Guide](./DOCKER_SETUP.md)

**Pros:**
- Isolated environment
- Consistent across all machines
- Includes database and backend
- Easy to reset and rebuild

**Cons:**
- Requires Docker installation
- Higher resource usage
- Slower on some systems

### Method 2: Local Setup with XAMPP
See [Local Setup Guide](./LOCAL_SETUP.md)

**Pros:**
- Direct access to files
- Faster development cycle
- Familiar environment
- Lower resource usage

**Cons:**
- Manual configuration required
- Platform-specific issues
- Dependency management

### Method 3: Frontend Only (Current State)

**Use Case**: Frontend development without backend

**Steps:**
1. Install Node.js and npm
2. Clone repository
3. Run `npm install`
4. Run `npm run dev`
5. Use mock data in `src/services/api.js`

## Environment Configuration

### Create Environment File

Create `.env` file in project root:

```env
# API Configuration
VITE_API_URL=http://localhost:8000/api
VITE_API_TIMEOUT=10000

# Application Settings
VITE_APP_NAME=Student Portal
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_ANIMATIONS=true

# Development
VITE_DEBUG_MODE=true
VITE_MOCK_API=false
```

### Environment Variables Explained

- `VITE_API_URL`: Backend API base URL
- `VITE_API_TIMEOUT`: API request timeout in milliseconds
- `VITE_APP_NAME`: Application display name
- `VITE_APP_VERSION`: Current version number
- `VITE_ENABLE_DARK_MODE`: Enable/disable dark mode feature
- `VITE_ENABLE_ANIMATIONS`: Enable/disable UI animations
- `VITE_DEBUG_MODE`: Show debug information in console
- `VITE_MOCK_API`: Use mock data instead of real API

## Project Structure

```
studentportal-main/
├── docs/                    # Documentation
├── public/                  # Static assets
├── src/
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   │   ├── student/       # Student portal pages
│   │   ├── teacher/       # Teacher portal pages
│   │   └── admin/         # Admin portal pages
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── .env                    # Environment variables
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
└── tailwind.config.js     # Tailwind configuration
```

## Verification Steps

### 1. Check Node.js Installation

```bash
node --version
# Should output: v18.x.x or higher
```

### 2. Check npm Installation

```bash
npm --version
# Should output: 9.x.x or higher
```

### 3. Verify Dependencies

```bash
npm list --depth=0
# Should show all installed packages
```

### 4. Test Development Server

```bash
npm run dev
# Should start server on http://localhost:5173
```

### 5. Test Build Process

```bash
npm run build
# Should create dist folder with built files
```

## Common Setup Issues

### Issue 1: Port Already in Use

**Error**: `Port 5173 is already in use`

**Solution**:
```bash
# Kill process on port 5173
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5173 | xargs kill -9
```

### Issue 2: Module Not Found

**Error**: `Cannot find module 'xyz'`

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

### Issue 3: Permission Denied

**Error**: `EACCES: permission denied`

**Solution**:
```bash
# Fix npm permissions (Linux/Mac)
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config

# Windows: Run terminal as Administrator
```

### Issue 4: Vite Build Fails

**Error**: Build process fails

**Solution**:
```bash
# Increase Node.js memory
set NODE_OPTIONS=--max_old_space_size=4096

# Then run build
npm run build
```

## IDE Setup

### Visual Studio Code (Recommended)

**Required Extensions**:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets

**Settings** (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### WebStorm

1. Enable ESLint: Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint
2. Enable Prettier: Settings → Languages & Frameworks → JavaScript → Prettier
3. Install Tailwind CSS plugin

## Next Steps

After completing setup:

1. Read [Development Workflow](../DEVELOPMENT_WORKFLOW.md)
2. Review [Code Standards](../CODE_STANDARDS.md)
3. Explore [Component Library](../components/COMPONENT_LIBRARY.md)
4. Check [API Documentation](../api/API_OVERVIEW.md)

## Getting Help

- Check [Troubleshooting Guide](../TROUBLESHOOTING.md)
- Review [Common Issues](../TROUBLESHOOTING.md#common-issues)
- Open GitHub issue for bugs
- Contact development team

---

**Document Version**: 1.0  
**Last Updated**: November 14, 2025
