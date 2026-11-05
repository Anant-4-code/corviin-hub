# CORVIIN HUB — Environment Setup Guide

**Document ID:** CH-ENV-001  
**Version:** 1.0  
**Product:** CORVIIN HUB  

---

## 1. Prerequisites

Before setting up the environment, verify the installed tools:
- **Node.js:** `>= 20.0.0`
- **npm:** `>= 10.0.0`
- **Git**

---

## 2. Environment Variables Configuration

Copy `.env.example` to create local environment files:

```bash
# Root environment configuration
cp .env.example .env

# Backend API environment configuration
cp apps/api/.env.example apps/api/.env
```

### Key Environment Variables

#### Root & API (`apps/api/.env`)
```ini
# Server Port & Host
API_PORT=3001
API_HOST=0.0.0.0
NODE_ENV=development

# Allowed CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Application Version
APP_VERSION=0.1.0

# Future Database Connection (Phase 4)
# DATABASE_URL=postgresql://user:password@localhost:5432/corviin_hub

# Future S3 Storage (Phase 7)
# S3_ENDPOINT=https://<accountid>.r2.cloudflarestorage.com
# S3_ACCESS_KEY=
# S3_SECRET_KEY=
# S3_BUCKET=corviin-hub-assets
```

#### Frontend Web Client (`apps/web/.env`)
```ini
# Backend API Base URL
VITE_API_BASE_URL=http://localhost:3001/api/v1
```

---

## 3. Installation & Verification Routine

Execute the following commands in the monorepo root:

```bash
# 1. Install all dependencies
npm install

# 2. Build the shared TypeScript contract package
npm run build:shared

# 3. Typecheck the entire monorepo
npm run typecheck

# 4. Execute all automated test suites
npm run test

# 5. Compile production builds for API and Frontend
npm run build
```

---

## 4. Running the Development Servers

In separate terminal sessions or using background tasks:

```bash
# Terminal 1: NestJS API (watch mode)
npm run dev:api

# Terminal 2: React + Vite Client (HMR)
npm run dev:web
```

- Web application will be accessible at: `http://localhost:5173`
- Backend API will be accessible at: `http://localhost:3001/api/v1`
- Interactive Swagger documentation at: `http://localhost:3001/api/docs`
