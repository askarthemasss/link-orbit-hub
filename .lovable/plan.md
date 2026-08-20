Polish empty states across LinkOrbit so users always know exactly what to do next and the product feels friendly instead of broken.

## Scope

Improve the main empty states that a real user will hit during their first few minutes:

1. Dashboard Links section (no links yet)
2. Public profile page (profile exists but has no links)
3. Settings page (profile not created yet)

Out of scope: auth onboarding, 404 page, and loading skeletons.

## What we will change

### Dashboard Links empty state

Current: a dashed border box with "Your Orbit is empty. Add your first link and start building your profile."

New direction:
- Use a friendly illustration-style icon (inline SVG) matching the space theme, e.g. a small planet or orbit ring.
- Keep the copy short and action-oriented: "Add your first link" as the primary headline.
- Add a secondary line of context: "Your public page will show links here once you add them."
- Keep the prominent "Add your first link" button.

File: `src/components/dashboard/LinkManager.tsx`

### Public profile empty state

Current: "Links are coming soon." inside a glass card.

New direction:
- Different message for the owner vs. a visitor. Since the public page only renders published profiles, an empty links list means the user hasn't added links yet.
- For the owner viewing their own page: explain the page is live and encourage them to add links from the dashboard.
- For visitors: keep it simple and friendly, "No links here yet."
- Include a small CTA button that navigates to the dashboard when the owner is signed in.

We will need a lightweight way to know if the current visitor owns the profile. Use the existing `supabase` client to check the session and compare `user_id` against the profile's `user_id`.

Files: `src/components/PublicProfileView.tsx`, `src/lib/public-profile.functions.ts` (return `user_id` if needed for ownership check)

### Settings page empty state

Current: plain text "Create your profile first from the editor."

New direction:
- Use a card with the same friendly space icon.
- Headline: "Finish setting up your LinkOrbit"
- Body: "Create your profile first, then you can customize your username and share your link."
- CTA button linking to `/dashboard`.

File: `src/routes/_authenticated/settings.tsx`

## Design notes

- Keep all new UI within the existing glass/card aesthetic and the space theme.
- Use semantic design tokens (`text-muted-foreground`, `bg-secondary`, `border-border`) so both light and dark themes look correct.
- No new colors or hardcoded hex values.
- Empty state icons should be inline SVGs (no external image assets) to keep the app fast and dependency-free.
- Keep copy concise. The strongest feeling should still be "I can set this up in two minutes."

## Verification

- Run `bun run build` to confirm type-check and bundle pass.
- Visit the dashboard as a new user with no links to confirm the new empty state renders.
- Visit the public profile of a published user with no links to confirm both owner and visitor messages.
- Visit `/settings` before creating a profile to confirm the new empty state renders.
