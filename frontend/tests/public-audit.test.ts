import { expect, test } from 'bun:test';
import { inspectPublicText } from '../scripts/audit-public';

test('public audit rejects private retrieval, profile payloads and credentials without opening private files', () => {
  for (const value of ['/__local/specimens', 'design-specimens.json', 'private/normalized/', 'be-design.arifian.web.id', 'ELARA_API_URL', 'Rosewood / Subtle', 'sourceText', 'sk-proj-abcdefghijk123456789']) {
    expect(inspectPublicText(value).length).toBeGreaterThan(0);
  }
  expect(inspectPublicText('Arifian Design System. Synthetic collections. #f5f4ed')).toEqual([]);
});
