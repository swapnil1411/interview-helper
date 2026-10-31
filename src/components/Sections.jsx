import { useState } from 'react';
import { useProgress, ids, pct, safeSet } from '../progress';
import { ExtLink, Check, Bar, Star, Callout, LinkGrid, Icon } from './ui';
import { patterns, retainRules, masteryLadder, dsaLinks, lcUrl, questionId, allQuestions } from '../data/dsa';
import { primaryGuide, roadmap, concepts, framework, problems, reminderChips, resources, ytSearch } from '../data/systemDesign';
import {
  motorq, remoteIndiaGeneral, linkedinSearches, hiringNow, hiringSnapshotDate, remoteJobBoards, openings, atsSearches,
} from '../data/companies';
import { siteGroups, interviewDayChecklist } from '../data/sites';
import { drawers } from '../data/loop';

/* ---------------- Today: the catalog drawer ---------------- */
const DAY = 86400000;
const FOR = { Motorq: 'Motorq', Both: 'Motorq + remote', Remote: 'Remote' };

function Mark({ done, label, onClick }) {
  return <button type="button" className={`mark ${done ? 'is-filled' : ''}`} aria-pressed={done} aria-label={`${done ? 'Unmark' : 'Mark'} ${label} done`} onClick={onClick} />;
}

export function Home({ go }) {
  const { done, toggle } = useProgress();
  const left = (d) => d.cards.filter((c) => !done[c.id]).length;
  // The thinnest drawer leads: largest share of cards still to pull; ties go to the drawer with more cards left.
  const share = (d) => left(d) / d.cards.length;
  const thinnest = drawers.reduce((best, d) => (share(d) > share(best) || (share(d) === share(best) && left(d) > left(best)) ? d : best), drawers[0]);
  const [openId, setOpenId] = useState(null);
  const open = drawers.find((d) => d.id === openId) || thinnest;
  const next = open.cards.find((c) => !done[c.id]);
  const allLeft = drawers.reduce((n, d) => n + left(d), 0);
  const week = Object.values(done).filter((t) => typeof t === 'number' && Date.now() - t < 7 * DAY).length;
  const nextLearn = patterns.find((p) => !done[`scroll:${p.id}`]);

  const onTabKey = (e, i) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    const d = drawers[(i + step + drawers.length) % drawers.length];
    setOpenId(d.id);
    document.getElementById(`drawer-tab-${d.id}`)?.focus();
  };

  return (
    <>
      <header className="today-head">
        <p className="kicker">Today · interview loop</p>
        <h1>{allLeft === 0 ? 'Every card is pulled. Run the loop again, timed.' : <>{thinnest.name} is your thinnest round. Pull the next card.</>}</h1>
        <p className="today-meta"><span>{allLeft} cards left across both targets</span>{week > 0 && <span>{week} pulled this week</span>}</p>
      </header>

      <div className="drawer-tabs" role="tablist" aria-label="Interview rounds">
        {drawers.map((d, i) => (
          <button key={d.id} id={`drawer-tab-${d.id}`} role="tab" aria-selected={d === open} aria-controls="drawer-card" tabIndex={d === open ? 0 : -1}
            className={`drawer-tab ${d === open ? 'is-open' : ''} ${left(d) === 0 ? 'is-spent' : ''}`} style={{ '--stagger': i % 3 }}
            onClick={() => setOpenId(d.id)} onKeyDown={(e) => onTabKey(e, i)}>
            <span className="drawer-tab-name">{d.tab}</span>
            <span className="drawer-tab-left">{left(d) === 0 ? 'all pulled' : `${left(d)} left`}</span>
          </button>
        ))}
      </div>

      <article id="drawer-card" className="index-card" role="tabpanel" aria-labelledby={`drawer-tab-${open.id}`} key={open.id}>
        <p className="call">{open.name} · <span className="for">{FOR[open.for]}</span></p>
        <h2>{next ? next.title : `All ${open.cards.length} cards pulled.`}{next?.asked && <span className="tag tag-asked">Asked at Motorq</span>}</h2>
        <p className="index-note">{open.note}</p>
        <ol className="card-rows">
          {open.cards.map((c) => (
            <li key={c.id} className={`card-row ${done[c.id] ? 'is-done' : ''} ${c === next ? 'is-next' : ''}`}>
              <Mark done={!!done[c.id]} label={c.title} onClick={() => toggle(c.id)} />
              <span className="card-title">{c.slug ? <ExtLink href={lcUrl(c.slug)}>{c.title}</ExtLink> : c.title}</span>
              <span className="card-call">{c.call}</span>
            </li>
          ))}
        </ol>
        <div className="btn-row">
          {next && (next.slug
            ? <a className="btn btn-signal" href={lcUrl(next.slug)} target="_blank" rel="noopener noreferrer">Pull next card: {next.title} <Icon name="arrow" size={16} /></a>
            : <button className="btn btn-signal" onClick={() => toggle(next.id)}>Mark “{next.title.split(/[—(]/)[0].trim()}” done</button>)}
          <button className="btn-ghost" onClick={() => go('company')}>Full round intel</button>
        </div>
      </article>

      <section className="also">
        <h2 className="section-title">Also on the desk</h2>
        <ul className="also-list">
          {nextLearn && <li><button onClick={() => { safeSet('interview-prep-learn-mode', 'general'); go('learn', `learn-${nextLearn.id}`); }}><span className="card-call">LEARN·{String(patterns.indexOf(nextLearn) + 1).padStart(2, '0')}</span>{nextLearn.name.replace(/\s*\(.*\)/, '')}<span className="also-go">Watch walkthrough</span></button></li>}
          <li><button onClick={() => go('dsa')}><span className="card-call">PRACTICE</span>{count(ids.dsa, done)} of {ids.dsa.length} problems solved<span className="also-go">Open Practice</span></button></li>
          <li><button onClick={() => go('company')}><span className="card-call">JOBS</span>Remote openings snapshot, {hiringSnapshotDate}<span className="also-go">Check live links</span></button></li>
        </ul>
      </section>
    </>
  );
}
const count = (list, done) => list.filter((i) => done[i]).length;

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
        <h1>Company Intel</h1>
        <Bar value={pct(ids.company, done)} label="Overall" />
      </header>

      <section className="hero">
        <div className="row-between">
          <h2>Motorq <Star>Primary target</Star></h2>
          <div className="btn-row">
            <ExtLink href={motorq.careers} className="btn">Careers</ExtLink>
            <ExtLink href={motorq.linkedinPeople} className="btn">Find referrals on LinkedIn</ExtLink>
          </div>
        </div>
        <p>{motorq.what}</p>

        <h3>What Motorq actually asks — round by round</h3>
        <div className="asked-grid">
          {motorq.rounds.map((r, i) => (
            <div key={r.round} className="asked">
              <div className="asked-head"><span className="asked-num">{i + 1}</span>{r.round}</div>
              <ul>
                {r.asked.map((a) => (
                  <li key={a.q}>
                    <span className="asked-q">{a.q}</span>
                    {a.practice.length > 0 && (
                      <span className="asked-practice">
                        Practice: {a.practice.map(([t, slug]) => <ExtLink key={slug} href={lcUrl(slug)}>{t}</ExtLink>)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h3>Interview loop</h3>
        <ol className="loop">{motorq.loop.map((s) => <li key={s}>{s}</li>)}</ol>
        <ul>{motorq.loopNotes.map((s) => <li key={s}>{s}</li>)}</ul>

        <h3>Confirmed question types (summary)</h3>
        <table className="table"><tbody>
          {motorq.questionTypes.map(([k, v]) => <tr key={k}><th>{k}</th><td>{v}</td></tr>)}
        </tbody></table>

        <Callout title="OA character" tone="warn"><p>{motorq.oa}</p></Callout>

        <div className="two-col">
          <div>
            <h3>How I match the JD</h3>
            <ul className="qlist">
              {motorq.jdMatch.map((j) => (
                <li key={j.id}><Check id={`co:jd:${j.id}`}>{j.ok ? '✓ ' : '⚠ '}{j.label}</Check></li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Prep priorities (ranked)</h3>
            <ol className="qlist">
              {motorq.priorities.map((p, i) => <li key={p}><Check id={`co:pri:${i}`}>{i + 1}. {p}</Check></li>)}
            </ol>
          </div>
        </div>
        <h3>Sources</h3>
        <LinkGrid items={motorq.sources} />
      </section>

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
