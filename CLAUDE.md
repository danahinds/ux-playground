# The Playground

## Project
Internal UX prototype testing platform. React + Vite, deployed on Netlify.

## Commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build locally

## Conventions
- Feature branches per issue: `step-N/description`, PR to merge into `main`
- Minimal dependencies — React, React Router, Vite only
- CSS custom properties for theming (no CSS-in-JS library)
- Components use named exports except page-level components (default export)
- Prototypes live in `public/prototypes/<name>/` as static HTML files

## Structure
- `src/components/` — shared UI and showcase site components
- `src/wrapper/` — tester-facing wrapper (intake, iframe viewer, thank-you)
- `public/prototypes/` — uploaded HTML prototype files (served statically)
