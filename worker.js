// Cloudform website, served with my top bar above it. The site's own files are never changed.
// When someone opens a Cloudform page directly, they get project/frame/ (my bar plus a frame);
// the frame then asks for the same page again, and that request gets the real file.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const last = url.pathname.split('/').pop();
    const isPage = last === '' || last.endsWith('.html') || !last.includes('.');
    const topLevel = request.headers.get('Sec-Fetch-Dest') === 'document';   // not inside a frame
    if (request.method === 'GET' && topLevel && isPage && !url.pathname.startsWith('/project/')) {
      const shell = await env.ASSETS.fetch(new URL('/project/frame/', url));
      return new Response(shell.body, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' } });
    }
    return env.ASSETS.fetch(request);
  },
};
