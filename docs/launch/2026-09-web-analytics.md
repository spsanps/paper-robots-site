# Vercel Web Analytics

Requested by San on September 9, 2026. Basic pageview analytics only.

Paper Robots is a static HTML site. Its shared layout uses Vercel's HTML queue and
`/_vercel/insights/script.js`; the React/Next.js import does not apply here.
`scripts/build.mjs` includes the integration only when `VERCEL=1` and no Pages base
path is present. Every generated production page receives one script. Local builds
and the GitHub Pages fallback omit it because the endpoint is served by Vercel.

Enable Web Analytics for the `paper-robots-site` project in the Vercel dashboard,
then deploy. The deployment creates the managed analytics endpoints. Adding the
script alone does not confirm that collection is enabled. The dashboard setting
has not been changed by the assistant; no Vercel API credentials are available.
After deployment of runtime commit `4040d84`, the live script returned JavaScript
with HTTP 200, and homepage and `/films/` pageviews were both accepted with HTTP
200. There is one analytics script per page. The collection endpoint is active;
no further dashboard setup is needed. Private dashboard graphs were not inspected.

No custom events, user identification, cookie/session features, advertising, or
paid upgrades were added. This does not affect the nonmonetized publishing setup.

Validation: normal builds, Vercel builds, and Pages builds are checked for the
appropriate inclusion/omission of the script. The managed endpoint is exempt from
the repository-file check; all ordinary public assets are still checked.

Official setup: https://vercel.com/docs/analytics/quickstart
