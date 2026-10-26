import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
type Theme = 'light' | 'dark';
export default function ThemeToggle() {
  const [theme,setTheme] = useState<Theme>('light');
  useEffect(() => { setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'); }, []);
  function toggle() {
    const next = theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#141413' : '#f5f4ed');
    try { localStorage.setItem('arifian-design-theme-v1',next); } catch { /* Theme still works when storage is unavailable. */ }
    setTheme(next);
  }
  return <Button type="button" variant="ghost" className="theme-toggle" onClick={toggle} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>{theme === 'light' ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}</Button>;
}
