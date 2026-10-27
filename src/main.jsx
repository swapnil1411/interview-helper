import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ProgressProvider, useProgress, ids, pct, safeGet, safeSet } from './progress';
import { Home, DSA, SystemDesign, Company, Sites } from './components/Sections';
import { Learn } from './components/Learn';
import { Icon } from './components/ui';
import './styles.css';

const TABS = [
  { id: 'home', label: 'Dashboard', short: 'Home', icon: 'home', C: Home },
  { id: 'dsa', label: 'DSA Patterns', short: 'DSA', icon: 'braces', n: '01', C: DSA },
  { id: 'sd', label: 'System Design', short: 'Design', icon: 'network', n: '02', C: SystemDesign },
  { id: 'company', label: 'Company Intel', short: 'Intel', icon: 'briefcase', n: '03', C: Company },
  { id: 'sites', label: 'Interview Sites', short: 'Sites', icon: 'compass', n: '04', C: Sites },
  { id: 'learn', label: 'Learn Scroll', short: 'Learn', icon: 'play', n: '05', C: Learn },
];
const THEMES = [['light', 'sun', 'Light'], ['dark', 'moon', 'Dark'], ['system', 'monitor', 'Auto']];

const fromHash = () => {
  const h = window.location.hash.slice(1);
  return TABS.some((t) => t.id === h) ? h : 'home';
};

// Chrome fires beforeinstallprompt once, possibly before React mounts, so catch it at module load.
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  window.dispatchEvent(new Event('pwa-installable'));
});

const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

function useInstall() {
  const [ready, setReady] = useState(() => !!deferredPrompt);
  const [installed, setInstalled] = useState(isStandalone);
  useEffect(() => {
    const onReady = () => setReady(true);
    const onInstalled = () => { setInstalled(true); setReady(false); deferredPrompt = null; };
    window.addEventListener('pwa-installable', onReady);
    window.addEventListener('appinstalled', onInstalled);
    return () => { window.removeEventListener('pwa-installable', onReady); window.removeEventListener('appinstalled', onInstalled); };
  }, []);
  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    setReady(false);
    if (outcome === 'accepted') setInstalled(true);
  };
  return { canInstall: ready && !installed, installed, install };
}

function App() {
  const { done } = useProgress();
  const [tab, setTab] = useState(fromHash);
  const [theme, setTheme] = useState(() => safeGet('interview-prep-theme', 'system'));
  const [systemDark, setSystemDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
  const install = useInstall();

  useEffect(() => {
    const onHash = () => setTab(fromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => setSystemDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  useEffect(() => {
    const resolved = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;
    document.documentElement.dataset.theme = resolved;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolved === 'dark' ? '#0b0c0f' : '#ffffff');
    safeSet('interview-prep-theme', theme);
  }, [theme, systemDark]);

  const go = (id, anchor) => {
    window.location.hash = id;
    window.scrollTo(0, 0);
    if (anchor) setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };
  const active = TABS.find((t) => t.id === tab);
  const Active = active.C;
  const overall = pct([...ids.dsa, ...ids.sd, ...ids.company, ...ids.sites, ...ids.scroll], done);
  const nextTheme = THEMES[(THEMES.findIndex(([v]) => v === theme) + 1) % THEMES.length];

  return (
    <div className="layout">
      <header className="topbar">
        <button className="brand" onClick={() => go('home')} aria-label="PrepHub home"><span className="brand-mark" aria-hidden="true" />PrepHub</button>
        <span className="topbar-title">{active.id === 'home' ? '' : active.label}</span>
        {install.canInstall && <button className="icon-btn install-btn" onClick={install.install}><Icon name="download" size={18} /><span>Install</span></button>}
        <button className="icon-btn" onClick={() => setTheme(nextTheme[0])} aria-label={`Theme: ${theme}. Switch to ${nextTheme[2]}`}>
          <Icon name={THEMES.find(([v]) => v === theme)[1]} size={18} />
        </button>
      </header>

      <nav className="sidebar" aria-label="Sections">
        <button className="brand" onClick={() => go('home')}><span className="brand-mark" aria-hidden="true" />PrepHub</button>
        <div className="nav-list">
          {TABS.map((t) => (
            <button key={t.id} className={`nav ${tab === t.id ? 'active' : ''}`} onClick={() => go(t.id)} aria-current={tab === t.id ? 'page' : undefined}>
              <span className="nav-icon"><Icon name={t.icon} size={19} /></span>
              <span className="nav-label">{t.label}</span>
              <span className="nav-short">{t.short}</span>
              {t.n && <span className="nav-n">{t.n}</span>}
            </button>
          ))}
        </div>
        <div className="side-foot">
          <div className="side-progress"><span>Overall</span><b>{overall}%</b><div className="bar"><div className="bar-fill" style={{ width: `${overall}%` }} /></div></div>
          {install.canInstall && <button className="btn btn-signal install-wide" onClick={install.install}><Icon name="download" size={16} /> Install app</button>}
          <div className="theme-switch" role="radiogroup" aria-label="Theme">
            {THEMES.map(([v, icon, l]) => (
              <button key={v} role="radio" aria-checked={theme === v} className={theme === v ? 'on' : ''} onClick={() => setTheme(v)} title={l}>
                <Icon name={icon} size={15} /><span>{l}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="content" key={tab}>
        {active.n && <p className="eyebrow">Section {active.n} · {active.label}</p>}
        <Active go={go} install={install} />
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode><ProgressProvider><App /></ProgressProvider></StrictMode>,
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => { /* offline mode unavailable */ });
  });
}
