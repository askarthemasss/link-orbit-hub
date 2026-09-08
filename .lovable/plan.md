# Developer's Arena

A second surface on every LTReee page where developers showcase real projects — not just links. Same address, one toggle.

## What visitors see

`ltreee.app/username` gains two tabs at the top of the page:

```text
        [ Links ]   [ Arena ]
```

- **Links** stays exactly as today (default tab).
- **Arena** shows the developer's project showcase. Deep-linkable as `ltreee.app/username?view=arena` so it can be shared directly.
- The Arena tab only appears when the developer has at least one published project, so non-developer pages stay clean.

The Arena is where the visual identity lands: a realistic deep-space backdrop — layered starfield with slow drift and parallax, faint nebula haze, and a black hole low in the scene with an accretion glow and light-bending ring. Projects float above it as glass cards connected by faint node-and-edge lines, matching the existing constellation motif. Motion is paused for visitors who prefer reduced motion, and the heavy layers only load on the Arena tab so the Links tab stays fast.

Each project card shows: cover image, title, short description, a **Live demo** button, a **Code** button, and a small view/click count. Cards open a detail view with the full description.

## What the developer manages

A new **Arena** page in the dashboard:

- Add, edit, delete and reorder projects (same drag-and-drop feel as Links).
- Fields per project: title, description, live demo URL, repository URL, cover image (upload), and a show/hide switch.
- Cover images upload to the existing avatars-style private bucket and are served only for published profiles, same rule as avatars.
- A live preview panel so the developer sees the space layout while editing.

## Tracking

Per-project analytics, wired into the existing Stats page:

- **Views** — counted once per visitor session when the Arena tab is opened, attributed per project shown.
- **Clicks** — counted separately for the live-demo button and the code button.
- Stats page gains an "Arena" section: total project views, total clicks, click-through rate, and a ranked table of projects by clicks with a live/code split. History is kept for deleted projects, matching how embed clicks already behave.

Only the owner can read their own numbers.

## SEO

The Arena content is server-rendered with the profile, so search engines see the project titles and descriptions. The profile page's structured data is extended so each project is listed as a creative work by the developer, and the page description mentions the project count when the Arena is active.

## Technical notes

- **Database** (one migration): `public.projects` (profile_id, title, description, demo_url, repo_url, cover_path, display_order, is_visible, timestamps) and `public.project_events` (project_id, kind: `view` | `demo_click` | `repo_click`, created_at). Both get explicit GRANTs. RLS: owners full access to their own rows; anonymous read on `projects` only through the published-profile path already used for links, with HTTP(S) check constraints on both URL columns. `project_events` is insert-only via a validated service-role endpoint (`/api/public/project-event`, same shape as `embed-track`), owner-only read.
- **Public read**: extend `getPublicProfile` to return visible projects for published profiles, so the tab needs no extra round trip.
- **Routing**: `?view=arena` as a validated search param on `/$username` — no new public route, no duplicate URL for SEO.
- **Dashboard**: new `/arena` route under `_authenticated`, plus a nav entry; `useProjects` hooks alongside `useLTReee`.
- **Visuals**: new `SpaceScene` component (CSS/SVG layers + one canvas-free black hole built from radial gradients and a rotating conic ring), lazy-loaded on the Arena tab, gated by `prefers-reduced-motion`. All colors go through existing tokens; new tokens added in `src/styles.css` for the accretion glow.
- Storage: reuse the private bucket + published-profile-gated public route pattern from avatars for cover images.

## Build order

1. Migration: `projects`, `project_events`, grants, RLS, constraints.
2. Public read + `?view=arena` tab shell on the profile page.
3. `SpaceScene` deep-space background and project card design.
4. Dashboard Arena editor with cover upload, reorder, preview.
5. Event tracking endpoint + Stats page Arena section.
6. SEO metadata and structured data.
