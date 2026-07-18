# React Architecture Refactor Report

## Summary

This refactor reorganized the application from a mostly flat React workspace into a more scalable production-style structure. Route-level screens now live under `src/pages`, reusable UI lives under `src/components`, shared state/effect logic lives under `src/hooks`, and static source assets live under `src/assets`.

The production build was verified with:

```bash
npm run build
```

## Folder Structure Changes

The app now follows these primary boundaries:

```text
src/
  api/
  assets/
  auth/
  companies/
  components/
  hooks/
  pages/
  utils/
```

Key page folders added:

```text
src/pages/community/
src/pages/companies/
src/pages/company/
src/pages/dashboard/
src/pages/home/
src/pages/insights/
src/pages/join/
src/pages/landing/
src/pages/login/
```

Page-specific CSS files were moved next to their page components. For example, `CommunityApp.tsx` and `community.css` now live together in `src/pages/community/`, and dashboard-specific UI pieces live in `src/pages/dashboard/components/`.

## Shared Components and Assets

Shared navigation was moved from flat root files into:

```text
src/components/navigation/AppSidebar.tsx
src/components/navigation/app-sidebar.css
src/components/navigation/app-topbar.css
```

Landing-page shared visual components were moved into clearer component folders:

```text
src/components/ipo-lifecycle/
src/components/investor-testimonials/
```

Legacy source HTML and news logos were moved into source-managed asset folders:

```text
src/assets/legacy/caplore.html
src/assets/logos/
```

This keeps imports inside `src`, improves bundler consistency, and makes asset ownership easier to understand.

## Monolithic Component Breakdown

### Community Page

`CommunityApp.tsx` was reduced from a large all-in-one component into a page shell plus local child components:

```text
src/pages/community/components/CommunityTopbar.tsx
src/pages/community/components/ProfileCard.tsx
src/pages/community/components/PostComposer.tsx
src/pages/community/components/FeedList.tsx
src/pages/community/components/CommunityRightRail.tsx
src/pages/community/components/Panel.tsx
src/pages/community/components/CommunityIcon.tsx
```

Community API and state logic was extracted into:

```text
src/pages/community/api.ts
src/pages/community/hooks/useCommunity.ts
src/pages/community/types.ts
src/hooks/useObjectUrlPreviews.ts
```

This separates feed loading, image upload presigning, likes, comments, and connection actions from rendering. Future changes to community data behavior can now happen in the hook/API layer without editing the page layout.

### Dashboard Page

Dashboard presentation pieces were extracted into local components:

```text
src/pages/dashboard/components/DashboardTopbar.tsx
src/pages/dashboard/components/PasswordDialog.tsx
src/pages/dashboard/components/StatsRow.tsx
src/pages/dashboard/components/OpportunitiesPanel.tsx
src/pages/dashboard/components/DashboardPanel.tsx
src/pages/dashboard/components/DashboardIcon.tsx
```

The AI Daily Brief data-fetching logic was extracted into:

```text
src/hooks/useAiDailyBriefs.ts
```

Company-list loading was shared through:

```text
src/hooks/useCompanyIndex.ts
```

This makes the dashboard easier to scan because the main page now composes sections instead of containing every header, modal, card list, and fetch routine inline.

## Shared App Logic

Repeated API/auth/person helpers were centralized:

```text
src/api/config.ts
src/auth/storage.ts
src/utils/person.ts
```

This removes duplicated API base URL handling, auth storage key usage, localStorage parsing, and initials generation. Centralizing these rules reduces drift between pages and makes future auth or environment changes safer.

## Routing and Import Updates

The route loader in `src/main.tsx` was updated to import pages and colocated CSS from their new folders. The standalone join entry in `src/join-main.tsx` was also updated.

Insights imports were updated after moving the old root-level `insights/` folder under:

```text
src/pages/insights/
```

Logo imports now point to `src/assets/logos/`, and the landing page raw HTML import now points to `src/assets/legacy/caplore.html`.

## Why This Helps

The new structure improves maintainability by making ownership obvious: pages own route-level layout, local `components/` folders own page-specific UI, shared `components/` hold reusable app-wide UI, and hooks own reusable logic.

It also reduces component complexity. The community page no longer mixes rendering with network requests, upload orchestration, comment mutations, and connection state. The dashboard page no longer carries its topbar, modal, stat cards, opportunity cards, and daily-brief fetch logic in one file.

This architecture is easier to test, easier to onboard into, and safer to extend because future changes can be made in smaller files with clearer responsibilities.

