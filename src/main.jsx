import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ProgressProvider, safeGet, safeSet } from './progress';
import { Home, DSA, SystemDesign, Company, Sites } from './components/Sections';
import './styles.css';

const TABS = [
  { id: 'home', label: 'Dashboard', icon: '◎', C: Home },
  { id: 'dsa', label: 'DSA Patterns', icon: '{ }', C: DSA },
  { id: 'sd', label: 'System Design', icon: '⧉', C: SystemDesign },
  { id: 'company', label: 'Company Intel', icon: '◆', C: Company },
  { id: 'sites', label: 'Interview Sites', icon: '↗', C: Sites },
];

const fromHash = () => {
  const h = window.location.hash.slice(1);
  return TABS.some((t) => t.id === h) ? h : 'home';
};

function App() {
  const [tab, setTab] = useState(fromHash);
  const [theme, setTheme] = useState(() =>
    safeGet('interview-prep-theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

  useEffect(() => {
    const onHash = () => setTab(fromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    safeSet('interview-prep-theme', theme);
  }, [theme]);

  const go = (id) => { window.location.hash = id; window.scrollTo(0, 0); };
  const Active = TABS.find((t) => t.id === tab).C;

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="brand">Prep<span>Hub</span></div>
        {TABS.map((t) => (
          <button key={t.id} className={`nav ${tab === t.id ? 'active' : ''}`} onClick={() => go(t.id)}>
            <span className="nav-icon">{t.icon}</span><span className="nav-label">{t.label}</span>
          </button>
        ))}
        <button className="nav theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          <span className="nav-icon">{theme === 'dark' ? '☀' : '☾'}</span><span className="nav-label">{theme === 'dark' ? 'Light' : 'Dark'} mode</span>
        </button>
      </nav>
      <main className="content"><Active go={go} /></main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode><ProgressProvider><App /></ProgressProvider></StrictMode>,
);
