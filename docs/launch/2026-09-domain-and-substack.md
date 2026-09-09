# Launch handoff — September 6, 2026

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

**Superseded hosting recommendation, September 8:** San asked to consider Vercel.
Use [the Vercel setup walkthrough](2026-09-vercel-setup.md) for the current path.
The temporary GitHub domain binding was removed; do not enter the GitHub Pages
DNS addresses below when connecting the Vercel project. Substack remains paused.

San has bought **paperrobots.studio**. Public DNS now shows GoDaddy nameservers
`ns73.domaincontrol.com` and `ns74.domaincontrol.com`, with parking A records
`76.223.105.230` and `13.248.243.5` (observed September 6). The assistant has GitHub
access but no authenticated GoDaddy/Cloudflare connection. No DNS was changed.

The public website repository is https://github.com/spsanps/paper-robots-site.
GitHub Pages is configured to deploy with Actions. Initial review address:
https://spsanps.github.io/paper-robots-site/.

The first release, `049dab9`, deployed successfully in Actions run 34065548843.
The public homepage returned HTTP 200. All 18 browser/viewport checks also passed
against the actual GitHub Pages address, including its project-prefixed asset
paths, the full essay without JavaScript, and click-to-load video.

## Connect the domain

Keep the review address working until San is ready to change DNS. First set
**paperrobots.studio** as the GitHub Pages custom domain (repository Settings →
Pages, or the GitHub REST API). Then add the following at the domain’s DNS host:

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | spsanps.github.io |

Replace only conflicting parking/site records for `@` or `www`; preserve mail,
verification, and other unrelated records. If using Cloudflare, begin with these
records set to **DNS only** while GitHub provisions HTTPS. No Cloudflare account
is required if the registrar already provides DNS.

After setting the custom domain, rerun Publish Paper Robots so its base path is
empty. Confirm DNS and certificate issuance, then enable Enforce HTTPS when
available. Verify both apex and www. GitHub recommends configuring the domain in
Pages before its DNS records:
https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site.

After the domain works, update the personal repository’s `src/data/links.js`
and its `public/llms.txt` Paper Robots link from the temporary review address to
`https://paperrobots.studio/`, then build and push that small change.

## Connect Substack

- Author profile: **San Kala**, handle `sankala` if available, personal headshot.
- Publication: **Paper Robots**, robot logo, author credited as San Kala.
- Try `paperrobots.substack.com`; availability is unverified. If taken, try
  `paperrobotsfilms.substack.com`, matching the YouTube handle.
- Description: **Illustrated essays and animated films about AI, robots, and
  possible futures. By San Kala.**
- Keep paid subscriptions, pledges, and Stripe off.
- Once the publication exists, set its verified origin in `site.config.mjs`,
  build/check, commit/push. Do not connect the independent domain to Substack;
  paperrobots.studio is the publication’s own website.

The profile-edit screen is for the author. In the current Substack interface,
Home → + → Post starts publishing; the profile’s three-dot menu exposes Publisher
dashboard. In Website editor, a Custom theme supports distinct publication
branding. No empty post needs to be published or emailed during setup.
Official guide checked September 6:
https://support.substack.com/hc/en-us/articles/29152946791188-How-can-I-publish-on-Substack.

The first complete reading edition is in
`publishing/substack/gpt7-will-have-arms/`. It is prepared, not published or emailed.
See that folder’s README for the upload steps.
