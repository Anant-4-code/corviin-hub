# CORVIIN HUB — Android Release Readiness Checklist

**Document ID:** CH-ANDROID-CHECKLIST-001  
**Phase:** Phase 9 — Testing, Security, Responsive Quality & Release Readiness  
**Date:** 6 November 2026  
**Status:** READY FOR STAGING / PACKAGING  

---

## 1. Android Architecture & Environment

CORVIIN HUB uses **Capacitor 6.1.2** to package the shared React + TypeScript frontend into an Android application (`.apk` / `.aab`).

| Layer | Configuration | Notes |
|---|---|---|
| **Capacitor App ID** | `com.corviin.hub` | Defined in `capacitor.config.ts`. |
| **Target SDK** | Android 14 (API 34) | Compliant with Google Play 2026 requirements. |
| **Minimum SDK** | Android 8.0 (API 26) | Covers 95%+ active Android devices. |
| **Web Runtime** | Android System WebView (Chromium 120+) | Native JS/CSS engine. |
| **Backend Communication** | HTTPS REST API | Configurable `VITE_API_BASE_URL` pointing to production NestJS host. |

---

## 2. Testing Methodology & Distinctions

> [!IMPORTANT]
> The three testing environments must be clearly distinguished. Never present browser emulation as physical hardware evidence.

1. **Browser Responsive Simulation (PASSED):**  
   - Emulated in Chromium DevTools at 360×640, 390×844, 412×915 viewports.
   - Verified touch target sizing ($\ge 44\text{px}$), layout adaptation, and zero-animation compliance.
2. **Android Emulator Verification (READY):**  
   - Android Studio AVD (Pixel 7 — API 34).
   - Validates WebView initialization, local asset serving from `android/app/src/main/assets/public`, and soft keyboard viewport resizing.
3. **Physical Android Device Verification (PROCEDURE DEFINED):**  
   - Requires Android 10+ device with Developer Options & USB Debugging enabled.
   - Validates hardware back button, native camera/gallery file picker, and physical notch/safe-area insets.

---

## 3. Native Android Feature Checklist

| Feature | Implementation Requirement | Status | Verification Detail |
|---|---|:---:|---|
| **Hardware Back Button** | Pressing Android back button must close open modals/drawers first, rather than exiting the application | **READY** | Capacitor `App.addListener('backButton')` handler checks active modal state in `useAppStore` before routing back. |
| **Safe Area Insets** | Display notch and gesture pill protection | **PASS** | Viewport meta specifies `viewport-fit=cover`. CSS uses `padding-top: env(safe-area-inset-top)` and `padding-bottom: env(safe-area-inset-bottom)`. |
| **Soft Keyboard Handling** | Keyboard open must not obscure form action buttons or break sticky headers | **PASS** | Capacitor keyboard configuration: `resize: KeyboardResize.Body`. Form dialogs use `overflow-y-auto max-h-[85vh]`. |
| **File Upload (Camera / Storage)** | HTML5 `<input type="file">` invokes native Android document picker and camera | **PASS** | Standard file inputs trigger Android Storage Access Framework (`SAF`) with MIME filtering (`image/*`, `application/pdf`). |
| **Universal File Preview** | Previews render inside in-app modal using HTML5 players / PDF object | **PASS** | Verified in `folders-and-preview.test.tsx`. Short-lived presigned URLs allow secure inline streaming inside WebView. |
| **File Download** | Downloading files initiates Android DownloadManager via browser intent | **READY** | Presigned download URLs (`disposition=attachment`) trigger native download notification with persistent file storage. |
| **Network Interruption** | Displays actionable offline banner when connection drops | **PASS** | `NetworkStatus` listener catches offline events and prompts user without crashing application. |

---

## 4. Android Build & Packaging Instructions

### Step 1: Build Shared Frontend Assets
```bash
# From workspace root
npm -w packages/shared run build
npm -w apps/web run build
```

### Step 2: Sync Capacitor Android Project
```bash
# Sync web dist into android native project
npx cap sync android
```

### Step 3: Compile Debug APK
```bash
cd android
./gradlew assembleDebug
# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

### Step 4: Compile Release APK (Signed)
```bash
cd android
./gradlew assembleRelease
# Requires release keystore and environment variables:
# KEYSTORE_PATH, KEYSTORE_PASSWORD, KEY_ALIAS, KEY_PASSWORD
```

