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
