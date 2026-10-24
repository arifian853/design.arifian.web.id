export function previewAllowed(command: string, mode: string, flag: string | undefined, host: unknown) {
  return command === 'serve' && mode === 'development' && flag === '1' && host === '127.0.0.1';
}
export function requestAllowed(req: { method?: string; url?: string; remote?: string; host?: string; origin?: string; fetchSite?: string }) {
  return req.method === 'GET' && req.url === '/__local/specimens' && req.remote === '127.0.0.1'
    && /^127\.0\.0\.1:\d+$/.test(req.host ?? '')
    && (!req.origin || req.origin === `http://${req.host}`)
    && (!req.fetchSite || ['same-origin', 'none'].includes(req.fetchSite));
}
