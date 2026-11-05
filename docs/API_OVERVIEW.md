# CORVIIN HUB — Backend API Overview

**Document ID:** CH-API-001  
**Version:** 1.0  
**Base URL:** `/api/v1`  
**Swagger UI:** `/api/docs`  

---

## 1. REST Architecture & Conventions

- **Protocol:** HTTP/1.1 (TLS in staging/production)
- **Data Exchange:** JSON payloads with ISO 8601 UTC timestamps (`YYYY-MM-DDTHH:mm:ss.sssZ`).
- **Standard Envelope:**
  ```json
  {
    "data": { ... },
    "meta": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "hasNextPage": true
    }
  }
  ```
- **Error Format:**
  ```json
  {
    "statusCode": 404,
    "code": "PROFILE_NOT_FOUND",
    "message": "Profile a1b2c3d4-e5f6-7890-abcd-ef1234567890 not found",
    "requestId": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"
  }
  ```

---

## 2. Request Context Headers

Every operational request issued by the frontend includes two context headers:

| Header | Description | Required | Example |
|---|---|:---:|---|
| `x-profile-id` | Stable UUID of the selected acting profile | Yes (except `/profiles`, `/workspaces`, `/health`) | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` |
| `x-workspace-id` | Stable UUID of the active workspace | Yes (except `/profiles`, `/workspaces`, `/health`) | `ws-tech-0001-0000-000000000001` |

These are decoded in NestJS controllers using the custom `@ActingProfile()` and `@ActiveWorkspace()` parameter decorators.

---

## 3. Endpoint Catalog (Phase 1 Implemented & Placeholders)

### System & Foundation Endpoints

#### `GET /api/v1/health`
Returns system health, version, and server uptime.
```json
{
  "status": "ok",
  "timestamp": "2026-11-05T14:00:00.000Z",
  "version": "0.1.0",
  "uptime": 142
}
```

#### `GET /api/v1/profiles`
Returns available acting profile records (Anant, Rohit, Utkarsh) for the shared-device profile selector.

#### `GET /api/v1/profiles/:id`
Returns a specific profile record by UUID. Returns 404 if not found.

#### `GET /api/v1/workspaces`
Returns accessible workspace records (`Corviin Tech`, `Corviin Real Estate`).

#### `GET /api/v1/workspaces/:id`
Returns a specific workspace by UUID. Returns 404 if not found.

---

### Module Placeholder Endpoints (Phase 3 Foundation)

The following endpoints are established with clean module boundaries and swagger metadata:
- `GET /api/v1/dashboard`
- `GET /api/v1/tasks`
- `GET /api/v1/plans-goals`
- `GET /api/v1/calendar`
- `GET /api/v1/campaigns`
- `GET /api/v1/assets`
- `GET /api/v1/crm`
- `GET /api/v1/meetings`
- `GET /api/v1/team`
- `GET /api/v1/notifications`
- `GET /api/v1/settings`
