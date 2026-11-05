# CORVIIN HUB

> Internal operations platform for Corviin Group (Corviin Tech & Corviin Real Estate).

---

## 1. Overview

**CORVIIN HUB** is an internal business operations platform consolidating daily task management, customer pipelines (CRM), 5-stage content creation campaigns, meetings/site visits, strategic plans/goals, media asset storage, and team activity tracking into one unified experience.

### Core Architecture
- **Monorepo:** npm workspaces with `apps/web`, `apps/api`, and `packages/shared`.
- **Frontend:** Single React 18 + TypeScript + Vite codebase serving Web (Desktop, Tablet, Mobile) and Android APK via Capacitor.
- **Backend:** Node.js + NestJS REST API under `/api/v1` with Swagger/OpenAPI documentation.
- **Workspaces:** Server-isolated operational boundaries for **Corviin Tech** and **Corviin Real Estate**.
- **Acting Profiles:** Shared-device acting profile selector (Anant, Rohit, Utkarsh) for trusted internal prototype use (no passwords/login).
- **Visual Design:** Clean, mature CRM styling inspired by Pinterest CRM layouts. **Strict zero-animation policy** and full Light/Dark mode parity.

---

## 2. Prerequisites

- **Node.js:** `>= 20.0.0` (tested on v22.18.0)
- **npm:** `>= 10.0.0` (tested on v10.9.3)
- **Git**

---

## 3. Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` in root, `apps/api`, and `apps/web`:
```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
```

### 3. Build Shared Packages
```bash
npm run build:shared
```

### 4. Run Development Servers
To run both API and Web concurrently:
- **Backend API (NestJS):**
  ```bash
  npm run dev:api
  ```
  Runs at `http://localhost:3001/api/v1`.  
  Swagger documentation available at `http://localhost:3001/api/docs`.

- **Frontend Client (React + Vite):**
  ```bash
  npm run dev:web
  ```
  Runs at `http://localhost:5173`.

---

## 4. Quality & Build Commands

```bash
# Typecheck all workspaces
npm run typecheck

# Run all test suites (Jest for API, Vitest for Web)
npm run test

# Full production build
npm run build

# Code formatting check
npm run format:check
```

---

## 5. Repository Documentation

For detailed architectural and module guides, consult the [`docs/`](./docs) directory:
- [docs/README.md](./docs/README.md): Master documentation index
- [docs/ARCHITECTURE_OVERVIEW.md](./docs/ARCHITECTURE_OVERVIEW.md): Comprehensive system architecture
- [docs/API_OVERVIEW.md](./docs/API_OVERVIEW.md): NestJS REST endpoints, Swagger, and context headers
- [docs/REPOSITORY_STRUCTURE.md](./docs/REPOSITORY_STRUCTURE.md): Directory and module breakdown
- [docs/ENVIRONMENT_SETUP.md](./docs/ENVIRONMENT_SETUP.md): Local development setup guide
- [docs/DECISIONS_AND_OPEN_QUESTIONS.md](./docs/DECISIONS_AND_OPEN_QUESTIONS.md): Architecture decisions log
- [docs/implementation/BUILD_STATUS.md](./docs/implementation/BUILD_STATUS.md): Master phase and feature implementation tracker
