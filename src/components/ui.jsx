import { useProgress } from '../progress';

export function ExtLink({ href, children, className = '' }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`ext ${className}`}>
      {children}
      <span aria-hidden="true" className="ext-icon">↗</span>
    </a>
  );
}

export function Check({ id, children }) {
  const { done, toggle } = useProgress();
  const checked = !!done[id];
  return (
    <label className={`check ${checked ? 'is-done' : ''}`}>
      <input type="checkbox" checked={checked} onChange={() => toggle(id)} />
      <span className="check-body">{children}</span>
    </label>
  );
}

export function Bar({ value, label }) {
  return (
    <div className="bar-wrap" title={`${value}%`}>
      {label && <span className="bar-label">{label}</span>}
      <div className="bar" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
        <div className="bar-fill" style={{ width: `${value}%` }} />
      </div>
      <span className="bar-num">{value}%</span>
    </div>
  );
}

export function Star({ children = '★ Motorq-confirmed' }) {
  return <span className="tag tag-star">{children}</span>;
}

export function Callout({ title, children, tone = 'info' }) {
  return (
    <section className={`callout callout-${tone}`}>
      {title && <h3>{title}</h3>}
      {children}
    </section>
  );
}

// 24px stroke icons (Lucide-style) so the UI doesn't depend on emoji/glyph fonts.
const ICONS = {
  home: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  braces: <><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1" /><path d="M16 21h1a2 2 0 0 0 2-2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1" /></>,
  network: <><rect x="16" y="16" width="6" height="6" rx="1" /><rect x="2" y="16" width="6" height="6" rx="1" /><rect x="9" y="2" width="6" height="6" rx="1" /><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3M12 12V8" /></>,
  briefcase: <><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /><rect x="2" y="6" width="20" height="14" rx="2" /></>,
  compass: <><circle cx="12" cy="12" r="10" /><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z" /></>,
  play: <><rect x="2" y="3" width="20" height="18" rx="4" /><path d="m10 8.5 5.5 3.5-5.5 3.5z" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></>,
  moon: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
  monitor: <><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></>,
  download: <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  flame: <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z" />,
  check: <path d="M20 6 9 17l-5-5" />,
};

export function Icon({ name, size = 20 }) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

export function Ring({ value, size = 120, stroke = 10, children }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle className="ring-track" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} />
        <circle className="ring-fill" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
      </svg>
      <div className="ring-center">{children ?? <b>{value}%</b>}</div>
    </div>
  );
}

export function LinkGrid({ items }) {
  return (
    <ul className="link-grid">
      {items.map((it) => (
        <li key={it.url + it.name}>
          <ExtLink href={it.url}>{it.name}</ExtLink>
          {it.note && <small>{it.note}</small>}
        </li>
      ))}
    </ul>
  );
}
