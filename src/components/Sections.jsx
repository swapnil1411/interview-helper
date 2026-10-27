import { useState } from 'react';
import { useProgress, ids, pct } from '../progress';
import { ExtLink, Check, Bar, Star, Callout, LinkGrid } from './ui';
import { patterns, retainRules, masteryLadder, dsaLinks, lcUrl, questionId, allQuestions } from '../data/dsa';
import { primaryGuide, roadmap, concepts, framework, problems, reminderChips, resources } from '../data/systemDesign';
import {
  motorq, remoteIndiaGeneral, linkedinSearches, hiringNow, hiringSnapshotDate, remoteJobBoards,
} from '../data/companies';
import { siteGroups, interviewDayChecklist } from '../data/sites';

/* ---------------- Home ---------------- */
export function Home({ go }) {
  const { done, reset } = useProgress();
  const all = [...ids.dsa, ...ids.sd, ...ids.company, ...ids.sites];
  const cards = [
    { tab: 'dsa', name: 'DSA Patterns', v: pct(ids.dsa, done), sub: `Core set ${pct(ids.dsaCore, done)}% · ${ids.dsa.filter((i) => done[i]).length}/${ids.dsa.length} problems` },
    { tab: 'sd', name: 'System Design', v: pct(ids.sd, done), sub: `${ids.sd.filter((i) => done[i]).length}/${ids.sd.length} concepts & problems` },
    { tab: 'company', name: 'Company Intel', v: pct(ids.company, done), sub: 'Motorq JD match + priorities' },
    { tab: 'sites', name: 'Interview Sites', v: pct(ids.sites, done), sub: 'Interview-day checklist' },
  ];
  return (
    <>
      <header className="page-head">
        <h1>Interview Prep Hub</h1>
        <p className="muted">SDE · ~2.5 yrs · Java · Kafka · Go · Python · Databricks — target: <b>Motorq</b> + remote product companies in India.</p>
      </header>
      <div className="overall">
        <div className="ring" style={{ '--p': pct(all, done) }}><span>{pct(all, done)}%</span></div>
        <div>
          <h2>Overall progress</h2>
          <p className="muted">{all.filter((i) => done[i]).length} of {all.length} items done. Every checkbox is saved in this browser.</p>
        </div>
      </div>
      <div className="cards">
        {cards.map((c) => (
          <button key={c.tab} className="card card-btn" onClick={() => go(c.tab)}>
            <h3>{c.name}</h3>
            <Bar value={c.v} />
            <small className="muted">{c.sub}</small>
          </button>
        ))}
      </div>
      <Callout title="This week's Motorq focus" tone="star">
        <ol>{motorq.priorities.slice(0, 5).map((p) => <li key={p}>{p}</li>)}</ol>
      </Callout>
      <p className="reset-row">
        <button className="btn-ghost" onClick={() => { if (window.confirm('Reset all progress?')) reset(); }}>Reset all progress</button>
      </p>
    </>
  );
}

/* ---------------- DSA ---------------- */
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
            {p.questions.map(([t, slug, note]) => (
              <li key={'c' + slug}>
                <Check id={questionId(p.id, slug)}>
                  <ExtLink href={lcUrl(slug)}>{t}</ExtLink>
                  {note && <span className="tag tag-star sm">{note}</span>}
                </Check>
              </li>
            ))}
          </ul>
          {p.extra.length > 0 && (
            <>
              <h4>Mastery set <small className="muted">· do after the core 7 to make it reflex</small></h4>
              <ul className="qlist">
                {p.extra.map(([t, slug, note]) => (
                  <li key={'e' + slug}>
                    <Check id={questionId(p.id, slug)}>
                      <ExtLink href={lcUrl(slug)}>{t}</ExtLink>
                      {note && <span className="tag sm">{note}</span>}
                    </Check>
                  </li>
                ))}
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
          {p.link && <ExtLink href={p.link}>Full walkthrough</ExtLink>}
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

      <h2>D. 45-minute answer framework</h2>
      <ol className="steps">
        {framework.map((f) => (
          <li key={f.step}><div><b>{f.step}</b> <span className="tag">{f.mins} min</span><p className="muted">{f.detail}</p></div></li>
        ))}
      </ol>
      <Callout title="LLM-feature variant">
        <p>Motorq's JD requires LLM/agentic-tool fluency — be ready for "add an LLM-backed feature": latency budget (stream tokens, async where possible), cost (caching, smaller model for routing, batch), and fallback when the model fails or times out (rules-based default, circuit breaker, human-review queue). Also: eval set, prompt/version logging, PII redaction.</p>
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

        <h3>Interview loop</h3>
        <ol className="loop">{motorq.loop.map((s) => <li key={s}>{s}</li>)}</ol>
        <ul>{motorq.loopNotes.map((s) => <li key={s}>{s}</li>)}</ul>

        <h3>Confirmed question types</h3>
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

      <h2>Remote companies hiring in India now</h2>
      <p className="muted">
        Snapshot {hiringSnapshotDate}. LinkedIn needs a login to browse, so the always-current view is the live searches below
        (filters: Remote · India · posted in the past week). Check each role's location before applying.
      </p>
      <div className="chips">
        {linkedinSearches.map((s) => <ExtLink key={s.url} href={s.url} className="chip chip-link">{s.name}</ExtLink>)}
      </div>
      <table className="table hiring">
        <thead><tr><th>Company</th><th>Work model</th><th>Why it fits you</th></tr></thead>
        <tbody>
          {hiringNow.map((c) => (
            <tr key={c.name}>
              <td><ExtLink href={c.url}>{c.name}</ExtLink></td>
              <td>{c.workModel}</td>
              <td>{c.fit}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Remote job boards</h3>
      <LinkGrid items={remoteJobBoards} />

      <h2>Remote product companies in India — interview pattern</h2>
      <p>{remoteIndiaGeneral.summary}</p>
      <LinkGrid items={remoteIndiaGeneral.research} />
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
