# buDaoVoid

An anonymous portfolio and writing site. Warm paper, one vertical line, no trackers.

- **Frontend:** Astro 5, static HTML, hand-written CSS, self-hosted fonts.
- **Backend:** Cloudflare Pages Functions + D1 (SQLite).
- **Features:** case studies, dated essays, guestbook with moderation, private contact form, per-page view counts, password-protected admin.
- **URL:** https://budaovoid.is-a.dev (custom domain pending is-a.dev review) and https://budaovoid.pages.dev

## Local development

```bash
npm install
npm run assets          # generate og.png and apple-touch-icon.png
npm run db:local        # create the local D1 schema

cp .dev.vars.example .dev.vars
# edit .dev.vars: ADMIN_PASSWORD, SESSION_SECRET, IP_SALT

npm run build
npx wrangler pages dev dist --port 8788
```

Open http://127.0.0.1:8788. The local D1 database lives under `.wrangler/state`.

## Content

- Case studies: `src/content/work/*.md`
- Essays: `src/content/writing/*.md`
- Log / now: `src/data/log.ts`, `src/data/now.ts`
- Site metadata: `src/lib/site.ts`

Frontmatter is validated in `src/content.config.ts`. Dates are kept as the date the
thinking happened, not the date the file was edited.

## Backend

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET/POST | `/api/views` | Read or increment a page counter |
| GET/POST | `/api/guestbook` | List published notes / post a note |
| POST | `/api/contact` | Private message |
| POST | `/api/admin/login` | Password login, sets an HttpOnly session cookie |
| POST | `/api/admin/logout` | Clear the session |
| GET | `/api/admin/overview` | Stats, guestbook, messages, pages |
| POST/DELETE | `/api/admin/guestbook/:id` | Hide/publish/delete a note |
| POST/DELETE | `/api/admin/messages/:id` | Mark read/delete a message |

Rate limits are per-IP-hash and stored in D1. IPs are salted and hashed; raw addresses are
never stored. Guestbook notes publish immediately unless they exceed the link/script check,
in which case they are held as `pending`. The admin can hide or delete anything.

## Deploy

```bash
npx wrangler login
npx wrangler d1 create budaovoid-db
# put the returned database_id into wrangler.toml
npm run db:remote

npx wrangler pages secret put ADMIN_PASSWORD --project-name budaovoid
npx wrangler pages secret put SESSION_SECRET --project-name budaovoid
npx wrangler pages secret put IP_SALT --project-name budaovoid

npm run deploy
```

Pages Functions are read from `functions/` and deployed alongside `dist/`.

### Custom domain

The is-a.dev DNS record is submitted as a pull request to `is-a-dev/register`:

```json
{
  "owner": { "username": "shawnclink" },
  "records": { "CNAME": "budaovoid.pages.dev" },
  "proxied": true
}
```

Add the domain to the Pages project with the Cloudflare API:

```bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects/budaovoid/domains" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"name":"budaovoid.is-a.dev"}'
```

## Admin

`/admin` is password protected and `noindex`. The session is a signed HttpOnly cookie with
`SameSite=Strict`; mutating admin requests also require a same-origin request. The password
lives only in Cloudflare secrets and `.dev.vars` (gitignored).

## Design notes

- Palette: warm paper, near-black ink, terracotta accent.
- Type: Newsreader (serif), Inter (sans), JetBrains Mono (metadata), self-hosted via Fontsource.
- The vertical line is the mark: a right angle to the horizontal feed.
- Default theme is light. Dark mode is a manual toggle stored in `localStorage`.
- CSP blocks third-party scripts, fonts, and frames. The site makes no third-party requests.
