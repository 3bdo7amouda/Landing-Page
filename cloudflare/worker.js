// Serves https://3bdo7amouda.github.io on https://3bdo7amouda.tech.
// GitHub Pages stays the single source of truth and keeps working on its own
// address, so if this domain ever lapses the github.io site is unaffected.
// Do NOT add a CNAME file / custom domain on the GitHub side: that would make
// github.io redirect here and the two would no longer be independent.

const ORIGIN = 'https://3bdo7amouda.github.io';
const APEX = '3bdo7amouda.tech';

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // http -> https, www -> apex
    if (url.protocol === 'http:' || url.hostname !== APEX) {
      url.protocol = 'https:';
      url.hostname = APEX;
      return Response.redirect(url.toString(), 301);
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405, headers: { allow: 'GET, HEAD' } });
    }

    const upstream = await fetch(ORIGIN + url.pathname + url.search, {
      method: request.method,
      redirect: 'manual',
      cf: { cacheEverything: true, cacheTtl: 300 },
    });

    // Keep visitors on this domain when GitHub redirects (e.g. /Landing-Page -> /Landing-Page/)
    if (upstream.status >= 300 && upstream.status < 400) {
      const loc = upstream.headers.get('location');
      if (loc) return Response.redirect(loc.replace(ORIGIN, 'https://' + APEX), upstream.status);
    }

    const headers = new Headers(upstream.headers);
    for (const h of ['x-github-request-id', 'x-fastly-request-id', 'x-served-by', 'x-cache', 'x-cache-hits', 'x-timer', 'via']) headers.delete(h);
    headers.set('x-content-type-options', 'nosniff');
    headers.set('referrer-policy', 'strict-origin-when-cross-origin');
    return new Response(upstream.body, { status: upstream.status, headers });
  },
};
