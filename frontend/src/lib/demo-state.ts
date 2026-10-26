export const sampleRecords = [
  { name: 'Fieldwork', type: 'Editorial', state: 'In review', value: 72 },
  { name: 'Atlas', type: 'Application', state: 'Ready', value: 94 },
  { name: 'Index', type: 'Collection', state: 'Draft', value: 48 },
];
export function sortRecords<T extends { name: string }>(records: readonly T[], ascending: boolean): T[] {
  return [...records].sort((a, b) => ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
}
export type Task = { id: number; title: string; stage: number };
export function moveTask(tasks: readonly Task[], id: number, direction: number): Task[] {
  return tasks.map(task => task.id === id ? { ...task, stage: Math.max(0, Math.min(2, task.stage + direction)) } : task);
}
