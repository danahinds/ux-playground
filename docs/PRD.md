# The Playground — PRD

**Status:** v0.1 shipped · v0.2 in design
**Owner:** Dana
**Last updated:** 2026-04-20

---

## 1. Summary

The Playground is an internal web app for capturing structured feedback from unstructured prototype testing. A PM uploads a static HTML prototype, shares a link with volunteer testers, and — after testers interact with it — receives self-reported intent and confusion signals alongside behavioral data from Microsoft Clarity.

The product is deliberately **not a task-validation tool**. Early-stage prototypes are ambiguous, exploratory, and evolving. Forcing testers into predefined tasks misses the point of testing in that stage. The Playground supports *learning*, not validation — though a guided task mode exists for flows that are defined enough to warrant it.

## 2. Users

- **PM / designer** — uploads prototypes, optionally writes a prompt, shares the link, reviews results.
- **Volunteer tester** — opens a link, answers a short intake, explores the prototype, reports what they were trying to do and how it went.

## 3. Product philosophy

**Frame:** "Exploration + signal detection," not "task validation."

The PM usually doesn't need to know whether a tester *completed a task* — they need to know **what the tester tried to do** and **whether it worked for them**. That signal is captured three ways:

1. **Self-reported intent** — "What were you trying to do?"
2. **Self-reported success** — Yes / Partial / No
3. **Behavioral signal** — Clarity recording (hesitation, repeated clicks, abandonment)

Tasks exist only as an advanced mode for flows with defined steps (checkout, signup). They are **optional**. The default is open exploration with an optional prompt.

## 4. Product surface — what's built (v0.1)

### 4.1 Marketing / showcase — `/`
`src/App.jsx` → `Showcase`
- Landing page: hero, "How it works," FAQ, footer.
- Embedded live demo of the tester flow.
- Dashboard preview (mocked — not connected to real data).
- "Tweaks" panel for theme experimentation.
- Quickstart CTA with a mocked CLI snippet.

### 4.2 Upload page — `/upload`
`src/components/upload/UploadPage.jsx`
- Drag-and-drop or click to pick a file. Accepts `.html`, `.htm`, `.zip`.
- ZIP handling: auto-uses the only HTML file, or shows a picker if multiple.
- Size limits: 512KB per HTML file, 10MB per ZIP.
- Test name auto-slugifies, shown inline (`Slug: checkout-v3 · Link: /t?proto=checkout-v3`).
- Submits base64-encoded HTML + slug to the upload function.
- Success screen: confirmation, link preview, copy button.

### 4.3 Upload backend — Netlify Function
`netlify/functions/upload-prototype.js`
- Validates slug (`^[a-z0-9][a-z0-9-]*[a-z0-9]$`, ≤60 chars) and HTML payload.
- Rejects duplicate slug (409).
- Commits file to `public/prototypes/<slug>/index.html` on `main` via the GitHub Contents API.
- Uses `GITHUB_TOKEN` env var set in Netlify.
- Tester link is live after Netlify's next build (~1–2 min).

### 4.4 Tester wrapper — `/t?proto=<slug>`
`src/wrapper/WrapperPage.jsx`
- **Intake** (`WrapperIntake`): 3 hard-coded questions — age range, tech comfort, product familiarity. Submits to Netlify Forms (`playground-intake`).
- **Viewer** (`PrototypeViewer`): full-viewport sandboxed iframe (`allow-scripts allow-same-origin allow-forms allow-popups`), floating "End session" button.
- **Thank you** (`WrapperThankYou`): static confirmation, session ID displayed.
- Missing `?proto=` → friendly error page.

### 4.5 Session tagging — Microsoft Clarity
`src/wrapper/clarity.js`, `src/wrapper/session.js`
- Clarity loaded via script tag in `index.html`.
- Every session gets a random ID shared between Clarity and Netlify Forms so the PM can cross-reference manually.
- Tags set on the Clarity session: `session_id`, `prototype`, and each demographic field.

## 5. v0.2 direction

### 5.1 Dual-mode test creation

On the upload page, after naming the test, the PM picks a mode:

**Exploration (default)**
- Optional prompt field (1–2 lines, shown to the tester before they start).
  - Example: *"Explore this as if you were trying to buy something."*
- No tasks. Tester explores freely.

**Guided tasks (for defined flows)**
- PM defines 1–N ordered task prompts.
  - Example: *"Task 1: Find a product you'd buy. Task 2: Add it to your cart. Task 3: Complete checkout."*
- Each task shows in the wrapper with **"I'm done"** and **"I'm stuck"** controls.
- Per-task timing captured.

The mode is set at test creation and cannot be changed later (changing it would invalidate cross-session comparisons).

### 5.2 Tester flow (v0.2)

1. **Intake** — demographics (as today). Long-term: PM configurable.
2. **Prompt screen** (exploration mode) or **Task screen** (guided mode) — shown before the prototype loads.
3. **Prototype** — full-viewport iframe; Clarity captures behavior.
4. **End session** — tester clicks "End session" (exploration) or completes the final task (guided).
5. **Post-session capture:**
   - **Intent:** *"What were you trying to do?"* (free text)
   - **Success:** Yes / Partial / No (3 pills)
   - **Confusion:** *"What, if anything, confused you?"* (optional free text)
   - **Ease:** 1–5 rating (optional)
6. **Thank you** — as today.

### 5.3 Results view (PM-facing, new)

At `/results?proto=<slug>` (auth-gated, TBD):

- **At a glance:** N testers, self-reported success breakdown (Yes / Partial / No as stacked bar), average ease score.
- **Confusion themes:** raw list of confusion quotes; later, LLM-clustered themes.
- **Intent quotes:** raw list of "what were you trying to do" answers.
- **Per-tester rows:** demographic tags + their success + link to Clarity recording.
- **Guided mode only:** per-task completion rate + median duration.

### 5.4 Post-upload polish

- **Live-status polling** — after upload, poll the prototype URL until 200. Success screen flips from "deploying" to "live."
- **Preview button** — open the tester flow in a new tab to sanity-check rendering before sharing.
- **Prototype index** at `/prototypes` — list of all uploaded prototypes, with link + response count + archive action.

## 6. Data model (what we capture)

Per session:
- **Session ID** — random, links Clarity + Forms + any future store.
- **Prototype slug.**
- **Demographics** — age, tech comfort, familiarity.
- **Mode** — `exploration` | `guided`.
- **Prompt shown** (exploration) or **tasks shown** (guided).
- **Intent** — free text.
- **Success** — `yes` | `partial` | `no`.
- **Confusion** — free text.
- **Ease** — 1–5 (optional).
- **Per-task timing + completion** (guided only).
- **Clarity recording** (external, linked by session ID).

## 7. Architecture & stack

- **Frontend:** React 19 + Vite, React Router v7.
- **Runtime dependencies:** `react`, `react-dom`, `react-router-dom`, `jszip`, `@netlify/functions`. Intentionally minimal.
- **Styling:** CSS custom properties, inline `style={}`. No CSS-in-JS library.
- **Hosting:** Netlify. Netlify Functions for upload. Netlify Forms for intake + post-session capture.
- **Prototype storage:** files committed to the repo under `public/prototypes/<slug>/`, served statically.
- **Recording:** delegated to Microsoft Clarity.

## 8. Conventions

- Feature branches `step-N/description` → PR to `main`.
- Components: named exports; page-level components use default export.
- Prototypes live in `public/prototypes/<name>/`.

## 9. Known gaps (not in v0.2 scope)

**Access / governance**
- No auth on `/upload` — anyone with the URL can upload.
- No rate limiting on the upload function.
- No content scan on uploaded HTML.

**Aggregation**
- No LLM-clustered confusion themes (raw list only in v0.2).
- No cross-prototype comparison.

**Tester experience**
- Intake questions still hard-coded in v0.2 — PM can't customize.
- No mobile-specific affordances for the tester flow.

**Session management**
- No "close test" step; results accumulate indefinitely.
- No rename / delete / archive flow for existing prototypes (prototype index in v0.2 adds archive only).

## 10. Constraints & non-goals

- **Minimal dependencies.** Don't add frameworks casually.
- **Static HTML prototypes only.** No build step per prototype, no SPA prototypes that need routing.
- **Internal tool.** Not positioned for public / multi-tenant use.
- **Not a task-validation tool.** Tasks exist as an advanced mode, not the primary model.
- **Behavioral recording lives in Clarity.** The Playground does not build its own session replay.
