# CORVIIN HUB — Repository Structure

**Document ID:** CH-DOC-003  
**Version:** 1.0  
**Product:** CORVIIN HUB  

---

```text
corviin-hub/
│
├── apps/
│   ├── web/                               # React + Vite + Capacitor Frontend Application
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── App.tsx                # Application root with providers
│   │   │   │   ├── router/
│   │   │   │   │   └── AppRouter.tsx      # React Router configuration covering all routes
│   │   │   │   ├── providers/
│   │   │   │   │   ├── QueryProvider.tsx  # TanStack Query client & cache configuration
│   │   │   │   │   └── ThemeProvider.tsx  # Light/Dark/System theme context
│   │   │   │   └── layouts/
│   │   │   │       └── AppLayout.tsx      # Responsive desktop/mobile shell
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── ui/                    # Standardized UI component primitives
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Input.tsx
│   │   │   │   │   ├── Select.tsx
│   │   │   │   │   ├── Textarea.tsx
│   │   │   │   │   ├── FormField.tsx
│   │   │   │   │   ├── Card.tsx
│   │   │   │   │   ├── DataTable.tsx
│   │   │   │   │   ├── ResponsiveRecordList.tsx
│   │   │   │   │   ├── StatusBadge.tsx
│   │   │   │   │   ├── PriorityIndicator.tsx
│   │   │   │   │   ├── Avatar.tsx
│   │   │   │   │   ├── Tabs.tsx
│   │   │   │   │   ├── Dialog.tsx
│   │   │   │   │   ├── Drawer.tsx
│   │   │   │   │   ├── States.tsx         # EmptyState, LoadingState, ErrorState
│   │   │   │   │   ├── PageHeader.tsx     # Standard header with breadcrumbs
│   │   │   │   │   ├── SearchInput.tsx
│   │   │   │   │   ├── Pagination.tsx
│   │   │   │   │   ├── ActivityTimeline.tsx
│   │   │   │   │   ├── Toast.tsx
│   │   │   │   │   └── ModulePlaceholder.tsx
│   │   │   │   └── navigation/
│   │   │   │       ├── navigation-config.ts # Single source of truth for navigation
│   │   │   │       ├── DesktopSidebar.tsx  # Collapsible grouped sidebar
│   │   │   │       ├── TopBar.tsx          # Workspace, profile, theme, search bar
│   │   │   │       ├── MobileBottomNavigation.tsx # 5-tab fixed thumb bar
│   │   │   │       ├── WorkspaceSwitcher.tsx # Corviin Tech vs Real Estate selector
│   │   │   │       ├── ProfileMenu.tsx     # Acting profile indicator & switcher
│   │   │   │       └── ThemeSwitcher.tsx   # Light/Dark/System selector
│   │   │   │
│   │   │   ├── features/                  # Domain modules (Placeholders in Phase 1)
│   │   │   │   ├── profile/SelectProfilePage.tsx # No-login acting profile selector
│   │   │   │   ├── dashboard/DashboardPage.tsx
│   │   │   │   ├── tasks/MyTasksPage.tsx
│   │   │   │   ├── tasks/AllTasksPage.tsx
│   │   │   │   ├── plans-goals/PlansGoalsPage.tsx
│   │   │   │   ├── calendar/CalendarPage.tsx
│   │   │   │   ├── calendar/CalendarContentPage.tsx
│   │   │   │   ├── calendar/CalendarTeamTasksPage.tsx
│   │   │   │   ├── calendar/CalendarMeetingsPage.tsx
│   │   │   │   ├── campaigns/CampaignsPage.tsx
│   │   │   │   ├── campaigns/CampaignDetailPage.tsx
│   │   │   │   ├── assets/AssetsPage.tsx
│   │   │   │   ├── crm/CrmPage.tsx
│   │   │   │   ├── crm/CrmTechPage.tsx
│   │   │   │   ├── crm/CrmPartnersPage.tsx
│   │   │   │   ├── crm/CrmBuyersPage.tsx
│   │   │   │   ├── meetings/MeetingsPage.tsx
│   │   │   │   ├── meetings/MeetingDetailPage.tsx
│   │   │   │   ├── team/TeamPage.tsx
│   │   │   │   ├── team/TeamMemberPage.tsx
│   │   │   │   ├── settings/SettingsPage.tsx
│   │   │   │   └── common/NotFoundPage.tsx
│   │   │   │
│   │   │   ├── hooks/                     # Custom React Query & utility hooks
│   │   │   │   ├── useProfiles.ts
│   │   │   │   ├── useWorkspaces.ts
│   │   │   │   ├── useHealthCheck.ts
│   │   │   │   └── useMediaQuery.ts
│   │   │   ├── lib/
│   │   │   │   ├── api.ts                 # Typed fetch client with context headers
│   │   │   │   ├── store.ts               # Zustand store for client UI state
│   │   │   │   └── cn.ts                  # Tailwind clsx utility
│   │   │   ├── services/                  # REST API data fetching services
│   │   │   │   ├── profiles.ts
│   │   │   │   ├── workspaces.ts
│   │   │   │   └── health.ts
│   │   │   ├── styles/
│   │   │   │   └── index.css              # Design tokens (Light/Dark themes)
│   │   │   └── test/                      # Vitest unit test suite (15 tests)
│   │   │
│   │   ├── capacitor.config.ts            # Capacitor Android configuration
│   │   ├── vite.config.ts                 # Vite bundler & test setup
│   │   ├── tailwind.config.js             # Semantic color & typography mapping
│   │   └── package.json
│   │
│   └── api/                               # NestJS Backend REST API
│       ├── src/
│       │   ├── main.ts                    # Bootstrap, CORS, validation pipe, Swagger
│       │   ├── app.module.ts              # Root NestJS module importing all domains
│       │   ├── common/
│       │   │   ├── api-response.ts        # ApiSuccessResponse & ApiErrorResponseDto
│       │   │   └── request-context.ts     # @ActingProfile & @ActiveWorkspace decorators
│       │   └── modules/
│       │       ├── health/                # GET /api/v1/health (with unit tests)
│       │       ├── profiles/              # GET /api/v1/profiles (with unit tests)
│       │       ├── workspaces/            # GET /api/v1/workspaces (with unit tests)
│       │       ├── dashboard/             # GET /api/v1/dashboard (Placeholder)
│       │       ├── tasks/                 # GET /api/v1/tasks (Placeholder)
│       │       ├── plans-goals/           # GET /api/v1/plans-goals (Placeholder)
│       │       ├── calendar/              # GET /api/v1/calendar (Placeholder)
│       │       ├── campaigns/             # GET /api/v1/campaigns (Placeholder)
│       │       ├── assets/                # GET /api/v1/assets (Placeholder)
│       │       ├── crm/                   # GET /api/v1/crm (Placeholder)
│       │       ├── meetings/              # GET /api/v1/meetings (Placeholder)
│       │       ├── team/                  # GET /api/v1/team (Placeholder)
│       │       ├── notifications/         # GET /api/v1/notifications (Placeholder)
│       │       └── settings/              # GET /api/v1/settings (Placeholder)
│       ├── package.json
│       ├── tsconfig.json
│       └── nest-cli.json
│
├── packages/
│   └── shared/                            # Shared Types, Zod Schemas, Contracts
│       ├── src/
│       │   ├── types/index.ts             # Profile, Workspace, BaseEntity, ApiMeta
│       │   ├── enums/index.ts             # TaskStatus, CampaignStage, CrmType, Priority
│       │   ├── schemas/index.ts           # Zod validation schemas
│       │   ├── contracts/index.ts         # API_PATHS, REQUEST_HEADERS, STORAGE_KEYS
│       │   └── index.ts                   # Barrel export
│       ├── package.json
│       └── tsconfig.json
│
├── docs/                                  # Master requirements & architecture docs
│   ├── PRD.md
│   ├── TRD.md
│   ├── UPDATED_FEATURE_SCOPE.md
│   ├── WEB_MOBILE_ARCHITECTURE_AND_FLOW.md
│   ├── CORVIIN_HUB_UI_UX_SPECIFICATION.md
│   ├── DECISIONS_AND_OPEN_QUESTIONS.md
│   ├── REPOSITORY_STRUCTURE.md
│   ├── ARCHITECTURE_OVERVIEW.md
│   ├── API_OVERVIEW.md
│   ├── ENVIRONMENT_SETUP.md
│   ├── implementation/
│   │   ├── CORVIIN_HUB_BUILD_PHASES.md
│   │   └── BUILD_STATUS.md
│   └── features/                          # 18 individual feature markdown documents
│
├── infrastructure/                        # Cloud & database orchestration
│   ├── database/                          # Phase 4 PostgreSQL schemas & Prisma
│   ├── storage/                           # Phase 7 S3 bucket definitions
│   └── deployment/                        # Phase 10 Dockerfiles & CI/CD configs
│
├── .env.example                           # Global environment variable documentation
├── .gitignore
├── .prettierrc
├── tsconfig.json
└── package.json
```
