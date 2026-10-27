import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useProgress, ids, pct, safeGet, safeSet } from '../progress';
import { ExtLink, Check, Bar, Star, Callout } from './ui';
import { patterns, lcUrl, questionId, allQuestions } from '../data/dsa';
import { learn, community, focusCompanies, redditSearch } from '../data/learn';
import { visuals } from '../data/visuals';
import { motorq } from '../data/companies';

const byId = Object.fromEntries(patterns.map((p) => [p.id, p]));
const shortName = (p) => p.name.replace(/\s*\(.*\)/, '');

/* ---------------- diagram renderers ---------------- */
function ArrPanel({ p }) {
  const empty = !p.cells.length;
  return (
    <div className="vz-panel">
      <div className="vz-label">{p.label}</div>
      <div className={`vz-row ${p.cells.length > 8 ? 'dense' : ''}`}>
        {empty && <span className="vz-empty">{p.empty || '—'}</span>}
        {p.cells.map((c, i) => (
          <div key={i} className="vz-cellwrap">
            {p.idx && <span className="vz-idx">{i}</span>}
            <span className={`vz-cell ${p.mark?.[i] || ''}`}>{c === '' ? ' ' : c}</span>
            <span className="vz-ptr">{p.ptr?.[i] || ''}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GraphPanel({ p }) {
  const uid = useId().replace(/:/g, '');
  const r = p.small ? 15 : 17;
  const at = Object.fromEntries(p.nodes.map((n) => [n.id, n]));
  return (
    <div className="vz-panel">
      <svg className="vz-svg" viewBox={`0 0 ${p.w} ${p.h}`} role="img" aria-label="diagram">
        <defs>
          {['n', 'hit', 'bad'].map((k) => (
            <marker key={k} id={`${uid}-${k}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" className={`vz-arrow ${k}`} />
            </marker>
          ))}
        </defs>
        {p.edges.map(([a, b, label]) => {
          const A = at[a], B = at[b];
          if (!A || !B) return null;
          const dx = B.x - A.x, dy = B.y - A.y, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
          const cls = p.emark?.[`${a}>${b}`] || '';
          const x1 = A.x + ux * r, y1 = A.y + uy * r, x2 = B.x - ux * (r + (p.directed ? 2 : 0)), y2 = B.y - uy * (r + (p.directed ? 2 : 0));
          return (
            <g key={`${a}>${b}`}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} className={`vz-edge ${cls}`} markerEnd={p.directed ? `url(#${uid}-${cls === 'hit' || cls === 'bad' ? cls : 'n'})` : undefined} />
              {label != null && <text x={(x1 + x2) / 2 - uy * 10} y={(y1 + y2) / 2 + ux * 10 + 4} className={`vz-elabel ${cls}`} textAnchor="middle">{label}</text>}
            </g>
          );
        })}
        {p.nodes.map((n) => (
          <g key={n.id} className={`vz-node ${p.mark?.[n.id] || ''}`}>
            <circle cx={n.x} cy={n.y} r={r} />
            <text x={n.x} y={n.y + 4} textAnchor="middle" className={String(n.label).length > 2 ? 'tiny' : ''}>{n.label}</text>
            {p.badge?.[n.id] && <text x={n.x} y={n.y + r + 13} textAnchor="middle" className="vz-badge">{p.badge[n.id]}</text>}
          </g>
        ))}
      </svg>
    </div>
  );
}

function GridPanel({ p }) {
  const cols = p.cells[0].length + (p.rows ? 1 : 0);
  return (
    <div className="vz-panel">
      {p.label && <div className="vz-label">{p.label}</div>}
      <div className="vz-grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 40px))` }}>
        {p.cols && (
          <>
            {p.rows && <span className="vz-gh" />}
            {p.cols.map((c, j) => <span key={`h${j}`} className="vz-gh">{c}</span>)}
          </>
        )}
        {p.cells.map((row, i) => (
          <div key={i} className="vz-grow">
            {p.rows && <span className="vz-gh">{p.rows[i]}</span>}
            {row.map((v, j) => <span key={j} className={`vz-gc ${p.mark?.[`${i},${j}`] || ''}`}>{v}</span>)}
          </div>
        ))}
      </div>
    </div>
  );
}

function IvPanel({ p }) {
  const span = p.max - p.min, pctOf = (x) => `${((x - p.min) / span) * 100}%`;
  const ticks = [];
  for (let t = p.min; t <= p.max; t += 2) ticks.push(t);
  const rows = p.lane ? [p.items] : p.items.map((it) => [it]);
  return (
    <div className="vz-panel">
      <div className="vz-label">{p.label}</div>
      <div className="vz-iv">
        {rows.map((row, i) => (
          <div key={i} className="vz-ivrow">
            {row.map((it) => (
              <span key={`${it.s}-${it.e}`} className={`vz-ivbar ${it.cls || ''}`} style={{ left: pctOf(it.s), width: `calc(${pctOf(it.e)} - ${pctOf(it.s)})` }}>
                {it.s},{it.e}
              </span>
            ))}
            {!row.length && <span className="vz-empty">empty</span>}
          </div>
        ))}
        <div className="vz-axis">{ticks.map((t) => <span key={t} style={{ left: pctOf(t) }}>{t}</span>)}</div>
      </div>
    </div>
  );
}

const PANELS = { arr: ArrPanel, graph: GraphPanel, grid: GridPanel, iv: IvPanel };

export function StepPlayer({ vizKey }) {
  const { title, build } = visuals[vizKey];
  const frames = useMemo(build, [build]);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const touch = useRef(null);
  const last = frames.length - 1;

  useEffect(() => {
    if (!playing) return undefined;
    if (i >= last) { setPlaying(false); return undefined; }
    const t = setTimeout(() => setI((x) => Math.min(x + 1, last)), 1600);
    return () => clearTimeout(t);
  }, [playing, i, last]);

  const step = (d) => { setPlaying(false); setI((x) => Math.max(0, Math.min(last, x + d))); };
  const play = () => { if (i >= last) setI(0); setPlaying((p) => !p || i >= last); };
  const f = frames[i];

  return (
    <div
      className="viz"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); }}
      onTouchStart={(e) => { touch.current = [e.touches[0].clientX, e.touches[0].clientY]; }}
      onTouchEnd={(e) => {
        if (!touch.current) return;
        const dx = e.changedTouches[0].clientX - touch.current[0], dy = e.changedTouches[0].clientY - touch.current[1];
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
        touch.current = null;
      }}
    >
      <div className="viz-head">
        <b>{title}</b>
        <span className="viz-count">{i + 1} / {frames.length}</span>
      </div>
      <div className="viz-stage">
        {f.panels.map((p, k) => { const P = PANELS[p.t]; return <P key={k} p={p} />; })}
      </div>
      <p className="viz-msg" aria-live="polite">{f.msg}</p>
      {f.vars && <div className="viz-vars">{f.vars.map(([k, v]) => <span key={k}><i>{k}</i> {String(v)}</span>)}</div>}
      <input className="viz-scrub" type="range" min={0} max={last} value={i} onChange={(e) => { setPlaying(false); setI(+e.target.value); }} aria-label="Step" />
      <div className="viz-controls">
        <button onClick={() => step(-1)} disabled={i === 0} aria-label="Previous step">‹ Prev</button>
        <button className="primary" onClick={play}>{playing ? '❚❚ Pause' : i >= last ? '↺ Replay' : '▶ Play'}</button>
        <button onClick={() => step(1)} disabled={i === last} aria-label="Next step">Next ›</button>
      </div>
      <p className="viz-hint">Swipe or use ← → to step</p>
    </div>
  );
}

/* ---------------- lite YouTube embed ---------------- */
const watchUrl = (m) => (m.list ? `https://www.youtube.com/playlist?list=${m.list}` : `https://www.youtube.com/watch?v=${m.id}`);

function LiteYT({ m }) {
  const [on, setOn] = useState(false);
  const src = m.list
    ? `https://www.youtube-nocookie.com/embed/videoseries?list=${m.list}&autoplay=1&rel=0&playsinline=1`
    : `https://www.youtube-nocookie.com/embed/${m.id}?autoplay=1&rel=0&playsinline=1`;
  return (
    <div className="yt">
      {on ? (
        <iframe src={src} title={m.t} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      ) : (
        <button className={`yt-thumb ${m.list ? 'is-list' : ''}`} onClick={() => setOn(true)} style={m.id ? { backgroundImage: `url(https://i.ytimg.com/vi/${m.id}/hqdefault.jpg)` } : undefined}>
          <span className="yt-play" aria-hidden="true">▶</span>
          <span className="yt-cap">{m.list && <b>Playlist · </b>}{m.t}<small> · {m.by}</small></span>
        </button>
      )}
    </div>
  );
}

/* ---------------- one scroll card ---------------- */
function PracticeRow({ pid, t, slug }) {
  const inPattern = allQuestions(byId[pid]).some(({ q }) => q[1] === slug);
  const link = <ExtLink href={lcUrl(slug)}>{t}</ExtLink>;
  return (
    <li className="qrow">
      {inPattern ? <Check id={questionId(pid, slug)}>{link}</Check> : <span className="qrow-plain">{link}</span>}
      <a className="solve" href={lcUrl(slug)} target="_blank" rel="noopener noreferrer">Solve on LeetCode →</a>
    </li>
  );
}

function LearnCard({ p, n, focus, company }) {
  const L = learn[p.id];
  const media = [...L.videos, ...L.playlists];
  const [active, setActive] = useState(0);
  const [viz, setViz] = useState(0);
  const cur = media[active];
  const practice = focus?.q?.length ? focus.q : p.questions.slice(0, 3).map(([t, slug]) => [t, slug]);

  return (
    <article className="lcard" id={`learn-${p.id}`}>
      <header className="lcard-head">
        <span className="lcard-num">{n}</span>
        <div className="lcard-title">
          <h2>{shortName(p)}</h2>
          <div className="tags">
            <span className={`tag tier-${String(p.tier)[0]}`}>Tier {p.tier}</span>
            {p.motorq && <Star />}
            {focus?.reported && <span className="tag tag-asked">Reported at {company.name}</span>}
          </div>
        </div>
        <div className="lcard-check"><Check id={`scroll:${p.id}`}><b>Learned</b></Check></div>
      </header>

      {focus && <p className="lcard-why"><b>{focus.reported ? 'What was asked:' : 'Why it matters here:'}</b> {focus.why}</p>}
      <p className="lcard-idea">{L.idea}</p>
      <dl className="lcard-spot">
        <dt>Spot it</dt><dd>{p.trigger}</dd>
        <dt>Template</dt><dd>{p.template}</dd>
      </dl>

      <h3 className="lsub">See it work</h3>
      {L.visuals.length > 1 && (
        <div className="seg sm">
          {L.visuals.map((k, i) => <button key={k} className={i === viz ? 'on' : ''} onClick={() => setViz(i)}>{visuals[k].title.split(':')[0]}</button>)}
        </div>
      )}
      <StepPlayer key={L.visuals[viz]} vizKey={L.visuals[viz]} />

      <h3 className="lsub">Watch</h3>
      <LiteYT key={cur.id || cur.list} m={cur} />
      <div className="media-list">
        {media.map((m, i) => (
          <button key={m.id || m.list} className={`media-chip ${i === active ? 'on' : ''}`} onClick={() => setActive(i)}>
            <span aria-hidden="true">{m.list ? '☰' : '▶'}</span> {m.t} <small>{m.by}</small>
          </button>
        ))}
      </div>
      <p className="small"><ExtLink href={watchUrl(cur)}>Open this on YouTube</ExtLink></p>

      <h3 className="lsub">Read</h3>
      <ul className="reads">
        {L.blogs.map((b) => <li key={b.url}><ExtLink href={b.url}>{b.name}</ExtLink>{b.note && <small>{b.note}</small>}</li>)}
      </ul>
      <div className="chips">
        <ExtLink href={redditSearch(shortName(p))} className="chip chip-link">r/leetcode threads on {shortName(p)}</ExtLink>
        {company && company.id !== 'remote-india' && (
          <ExtLink href={redditSearch(`${company.name} ${shortName(p)}`, 'developersIndia')} className="chip chip-link">r/developersIndia · {company.name}</ExtLink>
        )}
      </div>

      <h3 className="lsub">{focus?.q?.length ? `Practice: reported at / closest to ${company.name}` : 'Practice now'}</h3>
      <ul className="qlist">{practice.map(([t, slug]) => <PracticeRow key={slug} pid={p.id} t={t} slug={slug} />)}</ul>
    </article>
  );
}

/* ---------------- page ---------------- */
export function Learn() {
  const { done } = useProgress();
  const [mode, setMode] = useState(() => safeGet('interview-prep-learn-mode', 'general'));
  const [cid, setCid] = useState(() => safeGet('interview-prep-learn-company', 'motorq'));
  useEffect(() => { safeSet('interview-prep-learn-mode', mode); }, [mode]);
  useEffect(() => { safeSet('interview-prep-learn-company', cid); }, [cid]);
  useEffect(() => {
    document.documentElement.classList.add('snap');
    return () => document.documentElement.classList.remove('snap');
  }, []);

  const company = mode === 'company' ? focusCompanies.find((c) => c.id === cid) || focusCompanies[0] : null;
  const list = company ? company.patterns.map((f) => ({ p: byId[f.p], focus: f })) : patterns.map((p) => ({ p }));
  const links = company?.id === 'motorq' ? motorq.sources : company?.links || [];
  const listIds = list.map(({ p }) => `scroll:${p.id}`);
  const jump = (id) => document.getElementById(`learn-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <>
      <header className="page-head">
        <h1>Learn Scroll</h1>
        <p className="muted">One pattern per card: step through the diagram, watch the best video, read one explainer, then solve. Built for your phone.</p>
        <Bar value={pct(company ? listIds : ids.scroll, done)} label={company ? `${company.name} patterns learned` : 'Patterns learned'} />
      </header>

      <div className="learn-bar">
        <div className="learn-bar-row">
          <div className="seg" role="tablist" aria-label="Scroll mode">
            <button role="tab" aria-selected={mode === 'general'} className={mode === 'general' ? 'on' : ''} onClick={() => setMode('general')}>All patterns</button>
            <button role="tab" aria-selected={mode === 'company'} className={mode === 'company' ? 'on' : ''} onClick={() => setMode('company')}>Company focus</button>
          </div>
          {mode === 'company' && (
            <select className="company-select" value={cid} onChange={(e) => setCid(e.target.value)} aria-label="Company">
              {focusCompanies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )}
        </div>
        <div className="jump-row">
          {list.map(({ p }, i) => (
            <button key={p.id} className={`jump ${done[`scroll:${p.id}`] ? 'is-done' : ''}`} onClick={() => jump(p.id)}>
              {i + 1}. {shortName(p).replace(/ & .*/, '')}{done[`scroll:${p.id}`] ? ' ✓' : ''}
            </button>
          ))}
        </div>
      </div>

      {company ? (
        <section className="hero company-intro">
          <h2>{company.name}</h2>
          <p>{company.tagline}</p>
          <p className="small"><b>Loop:</b> {company.loop}</p>
          <h4>Beyond DSA: prepare these too</h4>
          <ul>{company.beyond.map((b) => <li key={b}>{b}</li>)}</ul>
          <h4>Sources</h4>
          <div className="chips">
            {links.map((l) => <ExtLink key={l.url} href={l.url} className="chip chip-link">{l.name}</ExtLink>)}
            <ExtLink href={redditSearch(`${company.id === 'remote-india' ? 'remote product company' : company.name} interview`, 'developersIndia')} className="chip chip-link">r/developersIndia threads</ExtLink>
          </div>
          <p className="muted small">Patterns are ordered by how often they come up in {company.name} reports. "Reported" means a sourced interview write-up mentions it.</p>
        </section>
      ) : (
        <section className="card start-here">
          <h2>Start here</h2>
          <LiteYT m={community.starter} />
          <Callout title="What the community recommends">
            <ul>{community.points.map((x) => <li key={x}>{x}</li>)}</ul>
            <p className="small muted">Reddit blocks automated reading, so these picks come from Blind and GitHub roundups. Read the actual threads here:</p>
            <div className="chips">
              {community.reddit.map((l) => <ExtLink key={l.url} href={l.url} className="chip chip-link">{l.name}</ExtLink>)}
            </div>
            <div className="chips">
              {community.sources.map((l) => <ExtLink key={l.url} href={l.url} className="chip chip-link">{l.name}</ExtLink>)}
            </div>
          </Callout>
          <p className="muted small">On Android, Chrome ⋮ → <b>Install app</b> puts this on your home screen. It opens full-screen and the diagrams work offline.</p>
        </section>
      )}

      <div className="feed">
        {list.map(({ p, focus }, i) => <LearnCard key={`${company?.id || 'all'}-${p.id}`} p={p} n={i + 1} focus={focus} company={company} />)}
      </div>
    </>
  );
}
