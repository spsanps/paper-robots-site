# Paper Robots on Vercel

September 8, 2026. San asked why this site should not use Vercel, which already
hosts sankala.me. The recommendation is now to use the same Vercel account for
both sites. GitHub Pages remains a working fallback while the Vercel project is
connected. Do not use the older GitHub Pages DNS table for a Vercel deployment.

The assistant briefly attached paperrobots.studio to GitHub Pages when San
reached his GoDaddy DNS screen, then removed that binding after his Vercel
question. GitHub's API confirms cname=null and the original GitHub Pages URL.
The assistant has not changed registrar records. DNS was still GoDaddy parking
at the time of this handoff. No authenticated Vercel connector or CLI login was
available; the account import is a user step.

## Import the existing repository

1. Sign in at https://vercel.com/new using the account that hosts sankala.me.
2. Import `spsanps/paper-robots-site`. If it is not listed, use the GitHub account
   configuration link to allow Vercel access to that repository.
3. Use project name `paper-robots-site` and leave the root directory at `./`.
   The repository's vercel.json supplies the configuration:
   - Framework preset: Other.
   - Build: `npm run build && npm run check`.
   - Output directory: `dist`.
   - Environment variables: none needed. Do not set SITE_BASE_PATH; that variable
     is only for the existing GitHub Pages project-address build.
4. Deploy. Open the assigned vercel.app URL and confirm the homepage and an essay.

## Connect the domain

1. Open the new project's Settings → Domains.
2. Add `paperrobots.studio` as the production domain, then `www.paperrobots.studio`
   as a redirect to it.
3. Vercel will show the required A and CNAME values. Copy those exact values to
   the domain's GoDaddy DNS records. Vercel can supply project-specific records;
   do not guess a shared IP or reuse the GitHub Pages addresses.
4. Replace conflicting parking records only for @ and www. Preserve unrelated
   mail and verification records. Keep TTL at the provider default.
5. Wait for Vercel to show valid configuration and issue HTTPS; verify the apex,
   www redirect, homepage, films page and full essay.

No domain transfer, Cloudflare account, payment integration or site API key is
required for this path. Once the domain is verified, update the author-site
Paper Robots link and record the actual Vercel project/deployment URL here.

Official references checked September 8:
- https://vercel.com/docs/git
- https://vercel.com/docs/domains/working-with-domains/add-a-domain
- https://vercel.com/docs/project-configuration

## Design scope retained

San explicitly wants an ambitious, distinctive design for **both** Paper Robots
and sankala.me. His personal site must retain the photographs, full history and
easy browsing; reducing it to a few project cards was rejected. Paper Robots
keeps the existing painted cream/cobalt/vermilion universe, with clear reading
and film destinations. No award submission or award result is implied.
