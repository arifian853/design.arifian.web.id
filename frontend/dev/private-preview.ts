import type { Plugin } from 'vite';
import { readFile, stat } from 'node:fs/promises';
import { previewAllowed, requestAllowed } from './preview-policy';
import { parseProfiles } from '../src/lib/profile';

// No build hooks, client imports, raw-source serving or caller-supplied paths.
export function privatePreview(): Plugin {
  let enabled = false;
  return {
    name: 'loopback-specimen-preview', apply: 'serve',
    configResolved(config) {
      enabled = previewAllowed(config.command, config.mode, process.env.DESIGN_PRIVATE_PREVIEW, config.server.host);
      // Explicit deny even when opt-in is absent: Vite must never serve private sources via /@fs.
      config.server.fs.deny.push('**/private/**', '**/.env*', '**/Implementation*.md', '**/ProjectTimeline.md');
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/__local/')) return next();
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Robots-Tag', 'noindex, nofollow');
        res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
        res.removeHeader('Access-Control-Allow-Origin');
        if (!enabled || server.config.server.host !== '127.0.0.1' || !requestAllowed({
          method: req.method, url: req.url, remote: req.socket.remoteAddress,
          host: req.headers.host, origin: req.headers.origin, fetchSite: req.headers['sec-fetch-site'] as string | undefined,
        })) { res.statusCode = 404; return res.end(); }
        try {
          const path = new URL('../../private/normalized/specimens.json', import.meta.url);
          const info = await stat(path);
          if ((info.mode & 0o777) !== 0o600 || info.size > 50000) throw new Error('Unavailable');
          const profiles = parseProfiles(JSON.parse(await readFile(path, 'utf8')));
          if (profiles.length !== 2) throw new Error('Unavailable');
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(profiles));
        } catch {
          // Never print private parser errors or payloads.
          res.statusCode = 503; res.end();
        }
      });
    },
  };
}
