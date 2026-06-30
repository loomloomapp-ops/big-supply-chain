# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This is a **design/branding workspace** for **BIG Supply Chain — "Strategic Logistic Solutions"**, a transport & logistics brand. It is not (yet) a running software project: there is no `package.json`, build system, test suite, or framework. The work here is producing premium frontend/design output (website, brand assets) for this logistics brand, driven by the design skills in `.claude/rules/`.

Because there is no build/lint/test tooling, do not invent commands for those. To preview the reference template, open the static HTML directly in a browser (e.g. `open "assets/SaveWeb2ZIP Website Copier (1)/index.html"`).

## Source material (the two inputs)

- `assets/BIG_Supply_Chain_logo_reference.png` — the brand logo: bold near-black "BIG" wordmark with a blue motion-streak through the "G", "SUPPLY CHAIN" beneath, tagline "STRATEGIC LOGISTIC SOLUTIONS". This defines the brand identity: deep navy/charcoal + a single electric-blue accent, confident and motion-forward.
- `assets/SaveWeb2ZIP Website Copier (1)/` — a fully downloaded **Webflow "Transio" logistics template** (static HTML/CSS/JS, saved via SaveWeb2ZIP). This is a **structural and content reference**, not the deliverable. Key facts:
  - Single `index.html` (one minified line, ~103 wrapped lines) containing the full homepage.
  - Section order in the homepage: `hero` → `key-feature` → `service` → `about` → `booking-steps` → `booking` → `pricing` → `cta` → `map` → `testimonial` → `blog` → `footer`. Useful as a section inventory for a logistics landing page.
  - Styling is one large Webflow CSS file (`css/transio.webflow.shared.b627b224c.css`); interactions are jQuery + Webflow runtime chunks in `js/`. Fonts are **Inter Tight + Urbanist** (note: the design skills below ban Inter for premium work — treat the template's type choices as reference, not as a standard to copy).
  - Real assets live in `images/` (78 files) and `media/` (hero + feature videos). Reuse these or replace with art-directed equivalents.

## Design skills — the operating instructions

The most important thing about this repo is `.claude/rules/`, a curated library of design skills. `.claude/rules/llms.txt` is the index/router — **read it first** to pick the right skill for a task. Each subfolder has a `SKILL.md`. These are loaded as project instructions and **override default behavior**; follow them exactly when producing design output.

Skill selection (per `llms.txt`):

- **taste-skill** — default skill for premium frontend code (React/Tailwind, layout, type, color, motion, anti-AI-slop).
- **gpt-tasteskill** — Awwwards-level GSAP-heavy generation; requires a `<design_plan>` pre-flight block with simulated Python RNG before any UI code.
- **soft-skill** — expensive "soft UI" look (premium fonts, depth, nested double-bezel cards, fluid motion).
- **minimalist-skill** — editorial Notion/Linear monochrome interfaces.
- **brutalist-skill** — Swiss/industrial/telemetry, extreme scale contrast (beta).
- **redesign-skill** — audit + fix an existing project's design problems in place (do not rewrite from scratch).
- **image-to-code-skill** — image-first: generate reference images, deeply analyze, then implement to match.
- **imagegen-frontend-web / imagegen-frontend-mobile / brandkit** — image-generation-only skills (no code) for web comps, mobile screens, and brand-kit boards respectively.
- **stitch-skill** — emits a `DESIGN.md` in Google Stitch's semantic design language (see `.claude/rules/stitch-skill/DESIGN.md` for the active token system).
- **output-skill** — anti-laziness enforcement: never emit `// ...`, "rest follows the same pattern", or skeleton stand-ins; deliver every requested deliverable in full.

### Cross-cutting rules shared by these skills

These recur across nearly every skill and should be treated as house style regardless of which one is active:

- **No emojis** anywhere — code, markup, comments, or alt text.
- **Banned font: `Inter`** (and Roboto/Open Sans/Arial) for premium contexts. Use `Geist`, `Satoshi`, `Cabinet Grotesk`, or `Outfit`. Generic serifs (Times, Georgia, Garamond) are banned; only distinctive serifs (Fraunces, Instrument Serif) if a serif is needed, and never serifs in dashboards.
- **No pure `#000000`** — use off-black/Zinc-950/charcoal. Max one accent color, saturation < 80%. The "AI purple/blue neon glow" aesthetic is banned (note: this brand's own accent is a clean electric blue — keep it controlled, not neon).
- **Layout:** CSS Grid over flexbox percentage math; `min-h-[100dvh]` never `h-screen`; max-width containment (~1400px); banned "3 equal cards in a row" feature rows; no overlapping/nested-box-in-box clutter; generous section spacing.
- **Motion:** animate only `transform`/`opacity`; spring physics not linear easing; `IntersectionObserver`/`whileInView` not scroll listeners; isolate perpetual animations in their own client components.
- **Content:** no placeholder names ("John Doe", "Acme"), no fake round numbers (`99.99%`), no AI clichés ("Elevate", "Seamless", "Unleash", "Next-Gen"); use `picsum.photos/seed/{id}/...` placeholders, never Unsplash.
- **Dependency safety:** before importing any library, verify it exists in the project's dependency file and output the install command if missing — never assume it's installed.

## Working conventions

- This directory is **not a git repository**. Do not assume git history or run git workflows.
- When asked to "build the site" or "design X", first consult `.claude/rules/llms.txt`, pick the matching skill, then follow that `SKILL.md` literally — including any mandatory pre-flight blocks (`<design_plan>`, brand-strategy inference, etc.).
- Keep the BIG Supply Chain identity consistent: deep navy/charcoal base, single electric-blue motion accent, logistics/transport vocabulary (freight, cargo tracking, shipping, global reach).
