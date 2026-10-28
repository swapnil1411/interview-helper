import { useState } from 'react';
import { useProgress, ids, pct, safeSet } from '../progress';
import { ExtLink, Check, Bar, Star, Callout, LinkGrid, Icon, Ring } from './ui';
import { patterns, retainRules, masteryLadder, dsaLinks, lcUrl, questionId, allQuestions } from '../data/dsa';
import { primaryGuide, roadmap, concepts, framework, problems, reminderChips, resources, ytSearch } from '../data/systemDesign';
import {
  motorq, remoteIndiaGeneral, linkedinSearches, hiringNow, hiringSnapshotDate, remoteJobBoards, openings, atsSearches,
} from '../data/companies';
import { siteGroups, interviewDayChecklist } from '../data/sites';

/* ---------------- Home ---------------- */
const DAY = 86400000;
const dayKey = (t) => new Date(t).toDateString();
function streakOf(done) {
  const days = new Set(Object.values(done).filter((v) => typeof v === 'number').map(dayKey));
  let n = 0, t = Date.now();
  if (!days.has(dayKey(t))) t -= DAY; // nothing yet today: the streak is still alive from yesterday
  while (days.has(dayKey(t))) { n += 1; t -= DAY; }
  return n;
}
const greeting = () => {
  const h = new Date().getHours();
  return h < 5 ? 'Late-night prep' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};
const short = (name) => name.replace(/\s*\(.*\)/, '');

export function Home({ go, install }) {
  const { done, reset } = useProgress();
  const all = [...ids.dsa, ...ids.sd, ...ids.company, ...ids.sites, ...ids.scroll];
  const count = (list) => list.filter((i) => done[i]).length;
  const week = Object.values(done).filter((t) => typeof t === 'number' && Date.now() - t < 7 * DAY).length;
  const nextLearn = patterns.find((p) => !done[`scroll:${p.id}`]);
  const nextQ = patterns.map((p) => [p, p.questions.find((q) => !done[questionId(p.id, q[1])])]).find(([, q]) => q);
  const sdItems = [
    ...concepts.flatMap((t) => t.items.map((c) => ({ id: `sd:c:${c.id}`, name: c.name }))),
    ...problems.map((p) => ({ id: `sd:p:${p.id}`, name: p.name })),
  ];
  const nextSD = sdItems.find((c) => !done[c.id]);
  const tracks = [
    { tab: 'learn', icon: 'play', name: 'Learn', list: ids.scroll, sub: 'patterns understood' },
    { tab: 'dsa', icon: 'braces', name: 'Practice', list: ids.dsa, sub: `coding problems · core ${pct(ids.dsaCore, done)}%` },
    { tab: 'sd', icon: 'network', name: 'System Design', list: ids.sd, sub: 'concepts & problems' },
    { tab: 'company', icon: 'briefcase', name: 'Companies', list: ids.company, sub: 'targets & interview notes' },
    { tab: 'sites', icon: 'compass', name: 'Resources', list: ids.sites, sub: 'tools & interview checklist' },
  ];
  const overall = pct(all, done);
  const primary = nextLearn
    ? { kind: 'Learn next', icon: 'play', title: short(nextLearn.name), copy: 'Understand the pattern with a visual walkthrough, then try it yourself.', label: 'Continue learning', action: () => { safeSet('interview-prep-learn-mode', 'general'); go('learn', `learn-${nextLearn.id}`); } }
    : nextQ
      ? { kind: 'Practice next', icon: 'braces', title: nextQ[1][0], copy: 'Your next unsolved core problem. Name the pattern before you start coding.', label: 'Start problem', href: lcUrl(nextQ[1][1]) }
      : nextSD
        ? { kind: 'Design next', icon: 'network', title: nextSD.name, copy: 'Explain it out loud in two minutes, as if the interviewer just asked.', label: 'Open System Design', action: () => go('sd') }
        : null;

  return (
    <>
      <section className="home-hero">
        <div className="home-hero-text">
          <p className="eyebrow">Your interview plan</p>
          <h1>{greeting()}.</h1>
          <p className="lede">Keep it simple: finish one focused session today.</p>
          <div className="stat-row">
            <div className="stat stat-hot"><Icon name="flame" size={18} /><b>{streakOf(done)}</b><span>day streak</span></div>
            <div className="stat"><b>{week}</b><span>done this week</span></div>
            <div className="stat"><b>{count(ids.dsa)}</b><span>of {ids.dsa.length} problems</span></div>
          </div>
        </div>
        <Ring value={overall} size={148} stroke={12}><b>{overall}%</b><small>{count(all)} / {all.length}</small></Ring>
      </section>

      <h2 className="section-title">Continue where you left off</h2>
      {primary ? (
        <article className="focus-card">
          <div className="focus-icon"><Icon name={primary.icon} size={22} /></div>
          <div className="focus-copy">
            <span className="next-kind">{primary.kind} · about 15 min</span>
            <h3>{primary.title}</h3>
            <p>{primary.copy}</p>
          </div>
          {primary.href
            ? <a className="btn btn-signal" href={primary.href} target="_blank" rel="noopener noreferrer">{primary.label} <Icon name="arrow" size={16} /></a>
            : <button className="btn btn-signal" onClick={primary.action}>{primary.label} <Icon name="arrow" size={16} /></button>}
        </article>
      ) : (
        <article className="focus-card"><div className="focus-copy"><h3>You finished the plan.</h3><p>Redo the priority set with a 35-minute timer and explain your decisions out loud.</p></div></article>
      )}

      {(nextQ || nextSD) && nextLearn && (
        <div className="quick-actions" aria-label="More ways to practice">
          <span>Or choose:</span>
          {nextQ && <a href={lcUrl(nextQ[1][1])} target="_blank" rel="noopener noreferrer"><Icon name="braces" size={16} /> Solve {nextQ[1][0]}</a>}
          {nextSD && <button onClick={() => go('sd')}><Icon name="network" size={16} /> Review {nextSD.name}</button>}
        </div>
      )}

      <h2 className="section-title">Your tracks</h2>
      <div className="track-grid">
        {tracks.map((t) => (
          <button key={t.tab} className="track" onClick={() => go(t.tab)}>
            <span className="track-top">
              <span className="track-icon"><Icon name={t.icon} /></span>
              <span className="track-pct">{pct(t.list, done)}%</span>
            </span>
            <span className="track-name">{t.name}</span>
            <span className="track-meta">{count(t.list)}/{t.list.length} {t.sub}</span>
            <span className="bar"><span className="bar-fill" style={{ width: `${pct(t.list, done)}%` }} /></span>
          </button>
        ))}
      </div>

      <details className="focus-details">
        <summary>This week’s Motorq focus <span>5 priorities</span></summary>
        <ol>{motorq.priorities.slice(0, 5).map((p) => <li key={p}>{p}</li>)}</ol>
      </details>
      <p className="reset-row">
        <button className="btn-ghost" onClick={() => { if (window.confirm('Reset all progress?')) reset(); }}>Reset all progress</button>
      </p>
    </>
  );
}

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
  const { done } = useProgress();
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
    </>
  );
}
