import { expect, test } from 'bun:test';
import { previewAllowed, requestAllowed } from '../dev/preview-policy';
test('preview requires dev command, explicit opt-in and exact loopback bind', () => {
  expect(previewAllowed('serve', 'development', '1', '127.0.0.1')).toBe(true);
  for (const args of [ ['build','development','1','127.0.0.1'], ['serve','production','1','127.0.0.1'], ['serve','development',undefined,'127.0.0.1'], ['serve','development','1','0.0.0.0'], ['serve','development','1',true] ] as const) {
    expect(previewAllowed(args[0], args[1], args[2], args[3])).toBe(false);
  }
});
test('requests require local socket, exact host, same origin, no queries and GET', () => {
  const req = { method: 'GET', url: '/__local/specimens', remote: '127.0.0.1', host: '127.0.0.1:4321' };
  expect(requestAllowed(req)).toBe(true);
  for (const change of [{method:'POST'}, {remote:'192.0.2.1'}, {host:'evil.example'}, {origin:'https://evil.example'}, {url:'/__local/specimens?file=secret'}, {fetchSite:'cross-site'}]) {
    expect(requestAllowed({...req,...change})).toBe(false);
  }
});
