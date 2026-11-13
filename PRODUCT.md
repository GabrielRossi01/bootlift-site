# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary:** Java/Spring developers and tech leads whose services run on Spring Boot 3 and who are planning, or being pushed toward, the move to Spring Boot 4. They arrive wanting to know how far their codebase is from Boot 4 and how to stop new code from widening the gap, and they decide whether to add a GitHub Action to their pipeline. They read YAML, care about CI cost and noise, and distrust tools that block merges over legacy code.

**Secondary:** recruiters, clients and peers viewing the page as a portfolio piece by the author (Gabriel Oliveira Rossi, Fullstack Developer). The page must hold up to their scrutiny, but decisions favor the adopting developer when the two pull apart.

## Product Purpose

Bootlift is an open-source (MIT) GitHub Action, published on the GitHub Marketplace, that measures how ready a Java/Spring project is for Spring Boot 4 and acts directly on the pull request: a 0–100 readiness score, a guardrail that only fails on newly added lines, and one-click fix suggestions.

The landing page is the product page. Success means a visitor:

1. understands what Bootlift is and why it matters within about five seconds;
2. adds the action to their workflow (primary action) or tries it in the in-browser playground;
3. sees it as open source and is invited to contribute;
4. leaves with a strong impression of the author's craft.

## Positioning

- **Guardrail, not a wall.** In PRs only *added* lines can fail the job. Legacy code counts in the score but never blocks anyone. Teams can adopt it on a large legacy codebase on day one.
- **Fixes land in the PR.** Deterministic corrections become native GitHub "Commit suggestion" lines, one click each.
- **No JDK, no build.** Pure static analysis that runs in seconds, which is also why the same rule engine runs client-side in the page's playground.
- Free, MIT, single-author open source.

## Operating Context

- Installed as a workflow step: `uses: GabrielRossi01/bootlift@v1` (current version v1.0.1). Requires `contents: read` and `pull-requests: write`.
- Reports through one PR comment (updated on every push), the job summary, and line annotations.
- Reads `pom.xml`, Gradle (Groovy and Kotlin DSL), version catalogs, `gradle-wrapper.properties`, `application.*` (YAML and .properties), and Java/Kotlin source.
- Visitors evaluating it typically compare against doing the migration by hand or running OpenRewrite recipes; the 96 renamed properties come from the OpenRewrite recipe.
- Links: repo https://github.com/GabrielRossi01/bootlift · demo PRs https://github.com/GabrielRossi01/bootlift-demo/pulls?q=is%3Apr · author portfolio https://rossidev.vercel.app · LinkedIn https://www.linkedin.com/in/gabriel-oliveira-rossi/

## Capabilities and Constraints

Product facts (use exactly; do not invent other numbers):

- **12 rules:** `BOOT_VERSION`, `JAVA_BASELINE`, `GRADLE_VERSION`, `JAKARTA_NAMESPACE`, `JACKSON3_NAMESPACE`, `MOCKBEAN_REMOVED`, `UNDERTOW_REMOVED`, `SPOCK_REMOVED`, `SESSION_REMOVED`, `STARTER_RENAMED`, `LAUNCH_SCRIPT`, `PROPERTY_RENAMED`.
- **96** renamed properties detected.
- **Score** 0–100: each rule found subtracts its severity weight once (error 15, warning 5, info 1), +1 per extra occurrence, capped at +10 per rule.
- **Inputs:** `path`, `mode` (guardrail/full), `fail-on` (none/warning/error), `comment-on-pr`, `suggestions`, `github-token`. **Outputs:** `score`, `blocking`, `errors`.
- **Fork PRs:** report yes, suggestions no. **Monorepos:** one run per service via matrix.
- **Severity semantics** are a product convention, consistent everywhere: error = red, warning = amber, info = blue (matching the 🔴🟡🔵 in the PR report).
- **Engine:** pure TypeScript, Node-free; the playground runs the real engine synced from `bootlift@v1.0.1` (never rewritten). Engine messages are in Portuguese; the English site maps `ruleId → { message, fix }`.
- **Site stack (from BRIEF.md):** Next.js App Router, strict TypeScript, Tailwind v4, `next-intl` with `/en` (default) and `/pt`, Motion, Shiki server-side, deployed on Vercel, static per locale where possible. No hardcoded copy in components.
- **Quality bar:** Lighthouse mobile ≥ 95 in all four categories, LCP < 2.5 s, CLS < 0.05, WCAG 2.2 AA, 360–1920 px, `prefers-reduced-motion` and `prefers-reduced-transparency` respected.
- Full section list, playground behavior and work phases live in `BRIEF.md`; it is the build spec, this file is the product record.

## Brand Commitments

- Name: **Bootlift** ("lift" as in lifting a version). Voice: technical, confident and precise, like a premium engineering tool, with a little lightness from the name.
- Bilingual: English (default) and Brazilian Portuguese.
- Binding visual constraints given by the owner in BRIEF.md: dark theme; brand green taken from the logo SVGs and used as an accent only; liquid-glass treatment as the signature on floating elements; Inter, Roboto and system-ui are banned as display faces. Visual direction beyond these is decided in design work, not here.
- Credit line: "Feito por / Made by Gabriel Oliveira Rossi" linking to the portfolio and LinkedIn.

## Evidence on Hand

- **Real:** the `bootlift-demo` repository and its PRs. Demo story: `main` scores 94 → a PR with old code drops to 60 and fails with 6 suggestions → applying them returns it to 94, green.
- **Real, fetched at build:** GitHub star count (API, revalidated hourly).
- **Pending from owner:** logo SVGs (`public/brand/`) and the demo video WebM/MP4 plus GIF fallback (`public/media/`). Both folders are currently empty. The brand green cannot be extracted until the logo arrives.
- **Absent, never fabricate:** users or adopting companies, testimonials, press, download/usage metrics, benchmarks.

## Product Principles

1. **Never block on the past.** Every explanation reinforces that legacy code informs, and only new code gates.
2. **Show the real thing.** Real engine in the playground, real demo PRs, exact numbers from the facts table. No mock metrics, no invented proof.
3. **Install is one paste away.** The workflow snippet, permissions and version pinning are always within reach of the primary action.
4. **Precision over hype.** Copy states mechanisms (what it reads, how the score is computed) rather than superlatives.
5. **Open by default.** Contribution paths are concrete (issue templates, CONTRIBUTING, good first issues), not a generic "star us".

## Accessibility & Inclusion

WCAG 2.2 AA: full keyboard navigation, visible focus in the brand green, real AA contrast on glass surfaces, opaque fallback under `prefers-reduced-transparency`, no pointer-follow or parallax under `prefers-reduced-motion`, and the looping hero card kept out of live-region narration.
