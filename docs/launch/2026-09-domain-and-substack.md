# Launch handoff — September 6, 2026

San has bought **paperrobots.studio**. Registration is confirmed by San; the
registrar and DNS account have not been identified in this session. The assistant
has GitHub access but no authenticated registrar/Cloudflare connection.

The public website repository is https://github.com/spsanps/paper-robots-site.
GitHub Pages is configured to deploy with Actions. Initial review address:
https://spsanps.github.io/paper-robots-site/.

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
