# fbl-hugo Project Handoff

Generated/updated for transfer readiness on 2026-09-28. This file is the setup and credential map for reopening or moving this project without starting over.

Do not put real passwords, API keys, webhook URLs, private keys, OAuth tokens, database passwords, Supabase keys, Vercel tokens, GitHub tokens, or production env values in this file. Keep real values in local env files, the hosting provider, a password manager, or an approved secret store.

## Project Boundary

Project folder:

```text
/Users/productivebot/productivebot/projects/fbl-hugo
```

This handoff applies to this folder and its child app folders only. Do not assume similarly named sibling folders share deployment settings, data, credentials, or APIs.

## Read First

- `README.md`

## Stack Detected

- Hugo/static site

## Config / Deployment Files Found

- `.github/workflows/hugo.yml`
- `.github/workflows/pages-domain.yml`
- `hugo.toml`
- `themes/fbl/hugo.toml`

## CLI Requirements

- Git for version control and transfer.
- Node.js/npm for any folder with a `package.json`. Check `package.json` `engines` before installing.
- Provider CLIs only when needed: Vercel CLI for Vercel projects, Netlify CLI for Netlify projects, Supabase CLI for Supabase projects, Hugo for Hugo projects, or Wrangler for Cloudflare projects.

Recommended checks:

```bash
node --version
npm --version
git --version
```

## Local Setup

```bash
# No npm app was detected. Read project docs and open/edit files directly.
```

## Project Commands

No `package.json` was found at handoff review time. Use the project docs for any manual commands.

## Active / Suspected Integrations

- GitHub
- GitHub Actions
- Google
- Stripe
- Zapier

Treat code and provider config as the source of truth when older docs disagree. Any integration listed only because of historical docs or dependency names should be verified before production use.

## Environment Variables

Create a local env file only when the project needs one. Use `.env.example` as the template when present. Configure matching values in the production host.

```bash
No app-controlled environment variables were detected during this audit.
```

If this section is empty, no env var names were detected by the automated scan. That does not guarantee the project has no secrets; verify provider dashboards before launch.

## Secret Handling

Never commit real secret-bearing files or values:

```text
.env
.env.local
.env.production
.env.*.local
.vercel/
.netlify/
*.pem
*.key
```

Commit `.env.example` only when it contains placeholder names and blank values.

## MCP / Agent Tooling

No project-local MCP config file was found during handoff review. If this project needs MCP access later, document server name, purpose, auth requirements, and where credentials live.

## Vercel / Supabase / GitHub Notes

- Vercel: if `vercel.json`, `.vercel/`, or Vercel env names are present, production env vars must be recreated in the Vercel project settings after transfer. Do not copy `.vercel` as the authority for secrets.
- Supabase: if Supabase config or env names are present, recreate project URL/anon/service keys through Supabase and store them in env vars. Never commit service role keys.
- GitHub: if `.github/workflows` exists, review repository secrets and actions variables before transfer. They do not live in the repo checkout.

## Transfer Checklist

When moving this project anywhere else, bring:

- The full project folder.
- Lockfiles such as `package-lock.json`, `pnpm-lock.yaml`, or `yarn.lock` when present.
- Source folders, public assets, config files, and deployment files listed above.
- This `PROJECT-HANDOFF.md` file.
- Real secret values from the approved secret store or provider dashboard, not from git.

After transfer:

1. Install dependencies for any app folder.
2. Recreate local env files from `.env.example`.
3. Reconnect provider projects such as Vercel, Supabase, GitHub Actions, Netlify, or Cloudflare.
4. Run the listed build/test commands.
5. Submit a safe test form or smoke test any API route before going live.

## Known Cleanup Items

- Confirm production domains and hosting project ownership before launch.
- Confirm each listed integration is still active and not a stale dependency/doc reference.
- Add missing env vars to `.env.example` if new integrations are added later.
