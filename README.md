# Paper Robots

Web Analytics setup and verification: [Vercel Web Analytics](docs/launch/2026-09-web-analytics.md).

September 8 launch update: San imported the project into Vercel and connected
GoDaddy DNS. The production origin is https://www.paperrobots.studio/; the apex
redirects there. A @ is 216.198.79.1 and CNAME www is
 d2a0066b926ad6c7.vercel-dns-017.com. Both backend addresses pass HTTPS checks.
Local DNS caches may still reach the former GoDaddy parking page. No further DNS
edits are indicated. https://paper-robots-site.vercel.app/ is a working fallback.
Cloudflare proxy/cache is not configured. GitHub Pages has no custom domain.

The redesigned homepage now features both films, including San's newly supplied
https://youtu.be/wswbqJNMFBw. Film details, chapters, script and sources are at
/films/capricious-god/. See docs/content/2026-09-capricious-god.md.
Substack remains paused; no revenue features or account settings were changed.
This is an ambitious design revision, not an award claim or visitor validation.

Earlier setup notes (superseded where they describe pending import or DNS):

Illustrated essays and animated films by San Kala. Intended home:
**https://paperrobots.studio**. This is the public website repository; film
production lives separately and remains private.

Windows: `C:\Users\sanps\Desktop\Projects\paper-robots\site`
WSL: `/home/san/Projects/paper-robots/site`

## Start here

```bash
npm ci
npm run dev
```

Open http://127.0.0.1:4174. The production build is ordinary static HTML, CSS,
local fonts, and a little JavaScript for the mobile menu and film player. The
complete essay is readable without JavaScript. YouTube loads after pressing play.

## Where things belong

| Folder | Purpose |
| --- | --- |
| `src/pages/` | Editable homepage and About page |
| `src/templates/` | Shared header, footer, metadata, and follow links |
| `src/styles/` | Typography, layouts, and reading styles |
| `src/scripts/` | Browser interactions |
| `content/essays/<slug>/` | Complete article, manuscript, source dates and checksums |
| `public/assets/` | Identity, illustrations, and essay figures served by the site |
| `public/fonts/` | Local fonts with licenses and provenance |
| `publishing/substack/` | Ready-to-use reading edition, original figures, profile assets, instructions |
| `design/illustrations/` | Source cover and its generation prompt |
| `design/social-cards/` | Editable HTML source for the link preview |
| `design/reviews/` | Browser checks and desktop/mobile captures |
| `scripts/` | Build, local server, checks, and manuscript sync |
| `docs/launch/` | Domain/hosting setup and release state |

`site.config.mjs` holds the public links. Set `substack` to the verified
publication origin when San finishes creating it. The follow buttons then use
the publication’s subscribe page. There is no collecting form or payment setup.

## Publish and update

**September 8 update:** Vercel is now the recommended primary host, matching
sankala.me. The repository includes `vercel.json`; import it into San's existing
Vercel account using [this walkthrough](docs/launch/2026-09-vercel-setup.md).
The Vercel import and domain connection remain pending. The GitHub Pages setup
below remains available while the switch is completed.

GitHub Actions builds and deploys `main` to GitHub Pages. The workflow reads the
Pages base path, so the temporary GitHub project address and the custom domain
both work without editing asset links. Project-address previews use `noindex`.

```bash
npm run build
npm run check
# With npm run dev in another terminal:
node scripts/check-browser.mjs
```

The full GPT-7 essay comes from San’s existing rich edition. Update its original
source and generated mirror first, then sync this repository:

```bash
npm run sync:essay -- /home/san/Projects/sankala.me
npm run build
```

This copies the entire article and its three figures, localizes image URLs, and
records source checksums. The build also prepares the full Substack edition.
Cross-domain canonical metadata points to the original author-site essay.
The original December 2025 date and September 2026 adaptation date remain distinct.

See [the launch handoff](docs/launch/2026-09-domain-and-substack.md).
