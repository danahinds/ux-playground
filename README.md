# The Playground

Internal UX prototype testing platform from UX Testground.

A lightweight tool that lets PMs upload HTML prototypes, collect tester demographics, and capture behavioral data (heatmaps, session replays, rage clicks) using Microsoft Clarity and Netlify Forms. Zero servers, zero cost.

## Architecture

- **Showcase site** (`/`) — Marketing and documentation site explaining the tool
- **Tester wrapper** (`/t?proto=<name>`) — The page testers visit: intake form, iframe-loaded prototype, thank-you screen
- **Prototypes** (`public/prototypes/`) — Self-contained HTML files uploaded by PMs

## Stack


oral capture)
- Netlify Forms (demographic storage)
- Netlify (static hosting)

## Getting Started

```bash
npm install
npm run dev
```

## License

Internal use only.
