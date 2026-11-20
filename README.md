# Portfolio

Source for my portfolio site: **https://3bdo7amouda.github.io/**

- `layouts/index.html` — the whole page (HTML, CSS and JavaScript in one file)
- `static/images/portrait.jpg` — profile photo
- `static/fav.png` — browser tab icon
- `hugo.yaml` — site settings
- `.github/workflows/deploy.yml` — builds with Hugo and publishes to GitHub Pages on every push to `master`

The same built page is also copied to the
[3bdo7amouda.github.io](https://github.com/3bdo7amouda/3bdo7amouda.github.io) repo so it is served at the root address.

## Custom domain: 3bdo7amouda.tech

`cloudflare/worker.js` is a Cloudflare Worker (named `portfolio`) attached to
`3bdo7amouda.tech` and `www.3bdo7amouda.tech`. It serves the GitHub Pages site
on the domain, redirects `www` and `http` to `https://3bdo7amouda.tech`, and
caches for 5 minutes.

GitHub Pages has **no** custom domain set on purpose. Both addresses work on
their own, and `3bdo7amouda.github.io` keeps working even if the domain lapses.
Never add a `CNAME` file to either GitHub repo: it would redirect github.io to
the domain and tie the two together again.

Redeploy after editing the Worker: Cloudflare dashboard → Workers & Pages →
`portfolio` → Edit code, paste `worker.js`, Deploy.
