# Execution Rules

You are implementing the app described in healthAgent-spec.md.

## Non-negotiables
- Do NOT ask me questions unless absolutely blocking. Make reasonable defaults.
- Work in small commits/steps but finish end-to-end in one run.
- After any code change, run:
  - `npm test` (if present) else skip
  - `npm run lint` (if present) else skip
  - `npm run build` (must pass)
- If a command fails, fix it and re-run until it passes.
- Prefer TypeScript if this is a JS project.
- Generate README instructions to run locally.

## Output
- Fully working app matching PRD.md
- Any env vars in `.env.example`
