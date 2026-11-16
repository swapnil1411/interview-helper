import { useState } from 'react';
import { useProgress, ids, pct } from '../progress';
import { ExtLink, Check, Bar, Star, Callout, LinkGrid, Icon } from './ui';
import { patterns, retainRules, masteryLadder, dsaLinks, lcUrl, questionId, allQuestions } from '../data/dsa';
import { primaryGuide, roadmap, concepts, framework, problems, reminderChips, resources, ytSearch } from '../data/systemDesign';
import {
  motorq, remoteIndiaGeneral, linkedinSearches, hiringNow, hiringSnapshotDate, remoteJobBoards, openings, atsSearches,
} from '../data/companies';
import { siteGroups, interviewDayChecklist } from '../data/sites';

/* ---------------- DSA ---------------- */
function QRow({ pid, t, slug, note, star }) {
  return (
    <li className="qrow">
      <Check id={questionId(pid, slug)}>
        <ExtLink href={lcUrl(slug)}>{t}</ExtLink>
        {note && <span className={`tag sm ${star ? 'tag-star' : ''}`}>{note}</span>}
      </Check>
      <a className="solve" href={lcUrl(slug)} target="_blank" rel="noopener noreferrer">Solve on LeetCode →</a>
    </li>
  );
}

function PatternCard({ p, index, open, onToggle }) {
  const { done } = useProgress();
  const list = allQuestions(p);
  const pid = list.map(({ q }) => questionId(p.id, q[1]));
  const corePid = p.questions.map((q) => questionId(p.id, q[1]));
  return (
    <article className={`pattern ${open ? 'open' : ''}`}>
      <button className="pattern-head" onClick={onToggle} aria-expanded={open}>
        <span className="pattern-num">{index + 1}</span>
        <span className="pattern-title">
          <span className="pattern-name">{p.name}</span>
          <span className="tags">
            <span className={`tag tier tier-${String(p.tier)[0]}`}>Tier {p.tier}</span>
            {p.motorq && <Star />}
          </span>
          <span className="trigger">{p.trigger}</span>
        </span>
        <span className="pattern-prog"><Bar value={pct(pid, done)} /></span>
        <span className="chev">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="pattern-body">
          <div className="tmpl">
            <div><b>Template</b><p>{p.template}</p></div>
            <div><b>Pitfalls</b><p>{p.pitfalls}</p></div>
          </div>
          <h4>Core 7 <small className="muted">· {pct(corePid, done)}% — solve + re-solve these first</small></h4>
          <ul className="qlist">
            {p.questions.map(([t, slug, note]) => <QRow key={'c' + slug} pid={p.id} t={t} slug={slug} note={note} star />)}
          </ul>
          {p.extra.length > 0 && (
            <>
              <h4>Mastery set <small className="muted">· do after the core 7 to make it reflex</small></h4>
              <ul className="qlist">
                {p.extra.map(([t, slug, note]) => <QRow key={'e' + slug} pid={p.id} t={t} slug={slug} note={note} />)}
              </ul>
            </>
          )}
        </div>
      )}
    </article>
  );
}

export function DSA() {
  const { done } = useProgress();
  const [open, setOpen] = useState(() => new Set([patterns[0].id]));
  const [motorqOnly, setMotorqOnly] = useState(false);
  const toggle = (id) => setOpen((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const shown = patterns.map((p, i) => [p, i]).filter(([p]) => !motorqOnly || p.motorq);
  return (
    <>
      <header className="page-head">
        <h1>DSA Patterns & LeetCode</h1>
        <Bar value={pct(ids.dsa, done)} label="Overall" />
      </header>
      <Callout title="How to actually retain this" tone="warn">
        <ul>{retainRules.map((r) => <li key={r}>{r}</li>)}</ul>
      </Callout>
      <Callout title="When is a pattern mastered?">
        <ol>{masteryLadder.map((r) => <li key={r}>{r}</li>)}</ol>
      </Callout>
      <div className="toolbar">
        <label className="switch"><input type="checkbox" checked={motorqOnly} onChange={(e) => setMotorqOnly(e.target.checked)} /> Motorq-confirmed only</label>
        <button className="btn-ghost" onClick={() => setOpen(new Set(patterns.map((p) => p.id)))}>Expand all</button>
        <button className="btn-ghost" onClick={() => setOpen(new Set())}>Collapse all</button>
      </div>
      {shown.map(([p, i]) => <PatternCard key={p.id} p={p} index={i} open={open.has(p.id)} onToggle={() => toggle(p.id)} />)}
      <h2>Global problem lists</h2>
      <LinkGrid items={dsaLinks} />
    </>
  );
}

/* ---------------- System Design ---------------- */
function Concept({ c }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="concept">
      <div className="concept-row">
        <Check id={`sd:c:${c.id}`}><b>{c.name}</b></Check>
        <button className="btn-ghost sm" onClick={() => setOpen(!open)}>{open ? 'Hide' : 'Learn'}</button>
      </div>
      {open && (
        <div className="concept-body">
          <p>{c.what}</p>
          <ul>{c.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
          <p className="say"><b>Say it:</b> {c.interviewLine}</p>
          <div className="btn-row">
            {c.read && <ExtLink href={c.read} className="chip chip-link">Read</ExtLink>}
            <ExtLink href={ytSearch(`${c.name.replace(/\(.*\)/, '')} system design`)} className="chip chip-link">▶ Watch on YouTube</ExtLink>
          </div>
        </div>
      )}
    </li>
  );
}

function Problem({ p, n }) {
  const [open, setOpen] = useState(!!p.star);
  return (
    <li className={`problem ${p.star ? 'problem-star' : ''}`}>
      <div className="concept-row">
        <Check id={`sd:p:${p.id}`}><b>{n}. {p.star && '★ '}{p.name}</b></Check>
        <button className="btn-ghost sm" onClick={() => setOpen(!open)}>{open ? 'Hide' : 'Outline'}</button>
      </div>
      {p.note && <p className="note">{p.note}</p>}
      {open && (
        <div className="concept-body">
          <p className="muted small">Attempt cold first, then compare with this outline.</p>
          <ul>{p.outline.map((o) => <li key={o}>{o}</li>)}</ul>
          <div className="btn-row">
            {p.link && <ExtLink href={p.link} className="chip chip-link">Full walkthrough</ExtLink>}
            <ExtLink href={ytSearch(`system design ${p.name.split(' — ')[0]}`)} className="chip chip-link">▶ YouTube walkthroughs</ExtLink>
          </div>
        </div>
      )}
    </li>
  );
}

export function SystemDesign() {
  const { done } = useProgress();
  const groups = [...new Set(problems.map((p) => p.group))];
  let n = 0;
  return (
    <>
      <header className="page-head">
        <h1>System Design</h1>
        <p className="muted">Your differentiating round — you've operated Kafka and Databricks. Every concept below has a "Learn" panel, so you can study straight from this page.</p>
        <Bar value={pct(ids.sd, done)} label="Overall" />
      </header>

      <Callout title="Practice OUT LOUD with another person" tone="star">
        <p>That's the #1 thing people skip. Use the 45-minute framework on every problem, timed.</p>
        <div className="chips">{reminderChips.map((c) => <span key={c} className="chip">{c}</span>)}</div>
      </Callout>

      <h2>A. Primary guide — pick ONE, finish it</h2>
      <LinkGrid items={primaryGuide.map((g) => ({ ...g, name: g.primary ? `★ ${g.name}` : g.name }))} />

      <h3>Study roadmap</h3>
      <table className="table">
        <tbody>{roadmap.map((r) => <tr key={r.week}><th>{r.week}</th><td>{r.focus}</td></tr>)}</tbody>
      </table>

      <h2>B. Concepts checklist</h2>
      {concepts.map((t) => {
        const tid = t.items.map((c) => `sd:c:${c.id}`);
        return (
          <section key={t.tier} className="card">
            <div className="row-between"><h3>{t.title}</h3><Bar value={pct(tid, done)} /></div>
            <ul className="concepts">{t.items.map((c) => <Concept key={c.id} c={c} />)}</ul>
          </section>
        );
      })}

      <h2>C. Practice problems (in order)</h2>
      {groups.map((g) => (
        <section key={g} className="card">
          <h3>{g}{g === 'Motorq-shaped' && <> <Star>★ over-prepare these</Star></>}</h3>
          <ul className="concepts">{problems.filter((p) => p.group === g).map((p) => <Problem key={p.id} p={p} n={++n} />)}</ul>
        </section>
      ))}

      <h2>D. 45-minute answer framework</h2>
      <ol className="steps">
        {framework.map((f) => (
          <li key={f.step}><div><b>{f.step}</b> <span className="tag">{f.mins} min</span><p className="muted">{f.detail}</p></div></li>
        ))}
      </ol>
      <Callout title="LLM-feature variant">
        <p>Motorq's JD requires LLM/agentic-tool fluency — be ready for "add an LLM-backed feature": latency budget (stream tokens, async where possible), cost (caching, smaller model for routing, batch), and fallback when the model fails or times out (rules-based default, circuit breaker, human-review queue). Also: eval set, prompt/version logging, PII redaction.</p>
      </Callout>

      <h2>E. Learning resources</h2>
      <div className="res-groups">
        {resources.map((g) => (
          <section key={g.group} className="card"><h3>{g.group}</h3><LinkGrid items={g.items} /></section>
        ))}
      </div>
    </>
  );
}

/* ---------------- Company Intel ---------------- */
export function Company() {
  const { done } = useProgress();
  return (
    <>
      <header className="page-head">
        <h1>Remote jobs</h1>
      </header>

      <p className="muted">Motorq and per-company interview intel now live at the bottom of Analyse.</p>

      <h2>Remote product companies in India — interview pattern</h2>
      <p>{remoteIndiaGeneral.summary}</p>
      <LinkGrid items={remoteIndiaGeneral.research} />
      <h2>Remote jobs in India — hiring now</h2>
      <p className="muted">
        Snapshot {hiringSnapshotDate}. LinkedIn needs a login to browse, so the always-current view is the live searches below
        (filters: Remote · India · posted in the past week). Check each role's location before applying.
      </p>
      <div className="chips">
        {linkedinSearches.map((s) => <ExtLink key={s.url} href={s.url} className="chip chip-link">{s.name}</ExtLink>)}
      </div>
      <h3>Current openings found ({hiringSnapshotDate})</h3>
      <table className="table hiring">
        <thead><tr><th>Role</th><th>Company</th><th>Experience</th><th>Pay</th><th>Location</th><th>Fit</th></tr></thead>
        <tbody>
          {openings.map((o) => (
            <tr key={o.url + o.role}>
              <td data-label="Role"><ExtLink href={o.url}>{o.role}</ExtLink><br /><small className="muted">seen {o.seen}</small></td>
              <td data-label="Company">{o.company}</td><td data-label="Experience">{o.exp}</td><td data-label="Pay">{o.pay}</td><td data-label="Location">{o.model}</td>
              <td data-label="Fit"><span className={`tag ${o.fit === 'match' ? 'tier-1' : 'tag-star'}`}>{o.fit === 'match' ? 'Matches 2.5 yrs' : 'Stretch'}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted small">Openings close fast — confirm on the employer's own site. To find roles before they reach LinkedIn, search the ATS boards directly:</p>
      <div className="chips">
        {atsSearches.map((s) => <ExtLink key={s.url} href={s.url} className="chip chip-link">{s.name}</ExtLink>)}
      </div>

      <h3>Remote-friendly companies to watch</h3>
      <table className="table hiring">
        <thead><tr><th>Company</th><th>Work model</th><th>Why it fits you</th></tr></thead>
        <tbody>
          {hiringNow.map((c) => (
            <tr key={c.name}>
              <td data-label="Company"><ExtLink href={c.url}>{c.name}</ExtLink></td>
              <td data-label="Work model">{c.workModel}</td>
              <td data-label="Why it fits">{c.fit}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Remote job boards</h3>
      <LinkGrid items={remoteJobBoards} />

    </>
  );
}

/* ---------------- Sites ---------------- */
export function Sites() {
  const { done, reset } = useProgress();
  return (
    <>
      <header className="page-head">
        <h1>Sites that help in the interview</h1>
        <p className="muted">Practice, mocks, LLD, SQL, resume, salary research and referrals.</p>
      </header>
      <section className="card">
        <div className="row-between"><h3>Interview-day checklist</h3><Bar value={pct(ids.sites, done)} /></div>
        <ul className="qlist">{interviewDayChecklist.map((c) => <li key={c.id}><Check id={`site:${c.id}`}>{c.label}</Check></li>)}</ul>
      </section>
      <div className="res-groups">
        {siteGroups.map((g) => <section key={g.title} className="card"><h3>{g.title}</h3><LinkGrid items={g.items} /></section>)}
      </div>
      <p className="reset-row">
        <button className="btn-ghost" onClick={() => { if (window.confirm('Reset all progress? Every pulled card goes back in the drawer.')) reset(); }}>Reset all progress</button>
      </p>
    </>
  );
}
