# Development Memory & Verification Report

This document records the exact changes, fixes, and architectural adjustments made during this implementation cycle.

---

## 1. Backend Server & Database Connectivity
* **Problem**: Stale backend processes were blocking port `5000`. The server lacked a `.env` configuration file, forcing it to fall back to an in-memory mock database which caused all analytics, categories, and customizer dashboards to appear blank.
* **Fixes**:
  * Cleaned port `5000` from stale processes.
  * Created `server/.env` with `MONGODB_URI=mongodb://127.0.0.1:27017/anka` and `JWT_SECRET`.
  * Ran the MongoDB seeding script to insert **9 active categories**, **12 design themes**, **coupons**, and super-admin credentials.
  * Added two preloaded test instances (`virtual-date-test` and `birthday-test`) for instant login and verification.

---

## 2. Customer Customizer Crash Fix
* **Problem**: Opening the customer edit panel for `virtual-date-test` crashed the frontend because `getDreamIcon` was destructured but not passed down as a prop in `CustomerMiniPanel.jsx`.
* **Fixes**:
  * Added the `getDreamIcon` helper prop inside the `valProps` block in [CustomerMiniPanel.jsx](file:///C:/Users/khush/OneDrive/Desktop/Anka/client/src/pages/CustomerMiniPanel.jsx#L1371), resolving the crash completely.

---

## 3. Reversion of Component 1 (Schema Mixed Type Demo Config)
* **Problem**: Reverted the database mixed type schema column modifications from `Demo.js` and deleted the static `demoRegistry.js` file to support a cleaner, component-driven configuration style.
* **Fixes**:
  * Restored [Demo.js](file:///C:/Users/khush/OneDrive/Desktop/Anka/server/models/Demo.js), [demos.js](file:///C:/Users/khush/OneDrive/Desktop/Anka/server/routes/demos.js), [useThemes.js](file:///C:/Users/khush/OneDrive/Desktop/Anka/client/src/hooks/useThemes.js), [CreateThemeModal.jsx](file:///C:/Users/khush/OneDrive/Desktop/Anka/client/src/components/themes/CreateThemeModal.jsx), [EditThemeModal.jsx](file:///C:/Users/khush/OneDrive/Desktop/Anka/client/src/components/themes/EditThemeModal.jsx), and [CategoryPage.jsx](file:///C:/Users/khush/OneDrive/Desktop/Anka/client/src/pages/CategoryPage.jsx) to their pre-feat code.
  * Deleted `client/src/registry/demoRegistry.js`.
  * Removed temporary features hooks in [CategoryCard.jsx](file:///C:/Users/khush/OneDrive/Desktop/Anka/client/src/components/categories/CategoryCard.jsx) and [ThemeList.jsx](file:///C:/Users/khush/OneDrive/Desktop/Anka/client/src/components/themes/ThemeList.jsx).

---

## 4. Dynamic Demo Link Configuration Modal
* **Problem**: The "Configure Demo Link" action button inside vibe layout themes was hardcoded to display birthday inputs only.
* **Fixes**:
  * Refactored [ConfigureDemoLinkModal.jsx](file:///C:/Users/khush/OneDrive/Desktop/Anka/client/src/components/birthday/ConfigureDemoLinkModal.jsx) to import `OccasionRegistry` and dynamically render the exact customizer component matching the theme category slug (e.g. `BirthdayCustomizer`, `VirtualDateCustomizer`, `ValentineCustomizer`).
  * Updated [useDemoLink.js](file:///C:/Users/khush/OneDrive/Desktop/Anka/client/src/hooks/useDemoLink.js) to manage occasion-specific states, load initial configs, and save them correctly under the surprise's `config` payload object.

---

## 5. Customer Customizer Missing Props Resolution
* **Problem**: The Customer Mini Panel page (`CustomerMiniPanel.jsx`) was failing to load the individual customizer configurations because `recipientName` and `api` variables were missing from `mergedProps`. Calling AI-powered helpers or loading the recipient labels resulted in script execution issues.
* **Fixes**:
  * Added both `recipientName` and `api` references directly inside the merged parameters payload mapping in [CustomerMiniPanel.jsx](file:///C:/Users/khush/OneDrive/Desktop/Anka/client/src/pages/CustomerMiniPanel.jsx#L1374).

