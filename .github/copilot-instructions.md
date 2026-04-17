# Copilot instructions - ciibague-landing

## Context
- Stack: Astro 5 + React islands + TypeScript.
- Styling: Tailwind + Biome.
- Main goals: performance, SEO, and stable public UX.

## Review and change priorities
- Favor server-rendered/static approaches over unnecessary client-side complexity.
- Protect page performance: avoid heavy bundles and redundant client hydration.
- Keep semantic HTML and accessibility intact.
- Reuse existing design and component patterns before adding new ones.
- Preserve route/content behavior unless the PR explicitly changes it.

## Expected checks for touched areas
- Run type checks/build for modified pages/components.
- Validate responsive behavior and critical user flows for property browsing.
- Keep metadata, canonical/SEO-related output, and sitemap behavior consistent.

