# CORVIIN HUB — Known Limitations & Architectural Boundaries

**Document ID:** CH-KNOWN-LIMITATIONS-001  
**Phase:** Phase 9 — Testing, Security, Responsive Quality & Release Readiness  
**Date:** 6 November 2026  
**Status:** PUBLISHED  

---

## 1. Authentication & Identity Management

1. **Acting-Profile Selector (Prototype Model):**
   - The current application utilizes an acting-profile switcher (*Anant, Rohit, Utkarsh*) to facilitate testing and prototype evaluation across roles on shared development devices.
   - **Limitation:** There is no server-verified password, biometric, or OIDC cryptographic identity verification.
   - **Action Required Prior to Public Release:** Implement production authentication (e.g. Supabase Auth or Auth0) with JWT session tokens and server-side authorization guards.

---

## 2. Push Notifications & Background Delivery

1. **In-App Notifications vs. Background Push:**
   - In-app notifications with badge counts, read/unread states, deduplication, and user preference suppression are fully implemented and operational.
   - **Limitation:** Background system tray push notifications via Firebase Cloud Messaging (FCM) or Apple Push Notification Service (APNs) while the app is closed are not yet configured. Notifications are delivered upon launching or polling the application.

---

## 3. Document Editing & Office Previews

1. **Universal File Preview Scope:**
   - Universal preview provides direct in-app viewing for Images (PNG, JPG, SVG, WebP with zoom/rotation), PDF (embedded reader), Video (MP4, WebM), Audio (MP3, WAV), Text, Code, CSV, and Markdown.
   - **Limitation:** Proprietary Microsoft Office documents (`.docx`, `.xlsx`, `.pptx`) render structured metadata cards with version history and authorized 1-click download links rather than embedded editable Office 365 suites.

---

## 4. Offline Mutation Queueing

1. **Network Connectivity Requirements:**
   - CORVIIN HUB gracefully handles transient network drops using automatic exponential backoff retries (`StorageService.withRetry`) and displays offline status banners.
   - **Limitation:** When disconnected from the internet, read-only cache data is preserved via React Query, but write operations (creating tasks, uploading assets, updating CRM leads) require an active network connection and are not queued in IndexedDB for deferred background synchronization.

---

## 5. Visual Styling Constraints

1. **Strict Zero-Animation Rule:**
   - **Specification Requirement:** The product specification enforces a strict zero-animation rule (`transition: none !important; animation: none !important;`) for maximum operational clarity, responsiveness, and zero vestibular trigger.
   - **Deliberate Design:** Smooth transition fades, sliding menus, or bounce keyframes are intentionally disallowed across all UI components.

---

## 6. Single-Node PostgreSQL Architecture

1. **Database Infrastructure:**
   - The persistence layer runs on PostgreSQL 17 using Prisma ORM with strict foreign keys, unique constraints, and deterministic seeds.
   - **Limitation:** Read-replica load balancing and multi-region active-active database replication are not configured for the initial release tier.

