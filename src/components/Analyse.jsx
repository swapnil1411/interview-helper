import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar as RBar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, LabelList } from 'recharts';
import { fetchProfile, analyse, tagSlug } from '../leetcode';
import { useProgress, ids, safeGet, safeSet } from '../progress';
import { ExtLink, Check, Callout, LinkGrid, Icon } from './ui';
import { lcUrl } from '../data/dsa';
import { motorq, hiringSnapshotDate } from '../data/companies';
import { companyIntel, INTEL_DATE } from '../data/companyIntel';

const LC_USER = 'interview-prep-lc-user';
const LC_CACHE = 'interview-prep-lc-cache';
const LC_CO = 'interview-prep-analyse-company';
const HOUR = 3600000;
const ago = (ts) => {
  const d = Math.floor((Date.now() / 1000 - Number(ts)) / 86400);
  return d <= 0 ? 'today' : d === 1 ? 'yesterday' : `${d}d ago`;
};
const short = (name) => name.replace(/\s*\(.*\)/, '');
const count = (list, done) => list.filter((i) => done[i]).length;

function Mark({ done, label, onClick }) {
  return <button type="button" className={`mark ${done ? 'is-filled' : ''}`} aria-pressed={done} aria-label={`${done ? 'Unmark' : 'Mark'} ${label} done`} onClick={onClick} />;
}

function LookupForm({ initial = '', busy, onSubmit, compact }) {
  const [u, setU] = useState(initial);
  return (
    <form className={`lc-form ${compact ? 'is-compact' : ''}`} onSubmit={(e) => { e.preventDefault(); if (u.trim()) onSubmit(u.trim()); }}>
      <label htmlFor="lc-user" className="lc-prefix">leetcode.com/u/</label>
      <input id="lc-user" value={u} onChange={(e) => setU(e.target.value)} placeholder="your-username" autoComplete="off" autoCapitalize="off" spellCheck="false" />
      <button className="btn btn-signal" disabled={busy || !u.trim()}>{busy ? 'Reading…' : compact ? 'Refresh' : 'Read my profile'}</button>
    </form>
  );
}

/* ---------- charts (Recharts; colours come from --chart-* tokens via CSS classes) ---------- */
// One tooltip for every chart: value first, label after.
function Tip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="ch-tip">
      <b>{d.tipValue}</b>
      <span>{d.label}</span>
      {d.tipNote && <span className="muted">{d.tipNote}</span>}
    </div>
  );
}

// Ranked horizontal bars. rows: {label, value, lack, tipValue, tipNote, end}. `end` is the text at the bar tip.
function HBars({ rows, max, unit = '', name }) {
  const h = rows.length * 30 + 28;
  return (
    <figure className="ch" aria-label={name}>
      <ResponsiveContainer width="100%" height={h}>
        <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 56, bottom: 4, left: 4 }} barCategoryGap={8}>
          <CartesianGrid horizontal={false} className="ch-grid" />
          <XAxis type="number" domain={[0, max || 'auto']} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}${unit}`} allowDecimals={false} />
          <YAxis type="category" dataKey="label" width={118} tickLine={false} axisLine={false} interval={0} />
          <Tooltip content={<Tip />} cursor={{ className: 'ch-cursor' }} isAnimationActive={false} />
          <RBar dataKey="value" barSize={14} radius={[0, 4, 4, 0]} isAnimationActive={false}>
            {rows.map((r) => <Cell key={r.label} className={r.lack ? 'ch-lack' : 'ch-ok'} />)}
            <LabelList dataKey="end" position="right" className="ch-end" />
          </RBar>
        </BarChart>
      </ResponsiveContainer>
      <details className="ch-table">
        <summary>Show as table</summary>
        <table className="table"><tbody>
          {rows.map((r) => <tr key={r.label}><th>{r.label}</th><td>{r.tipValue}</td><td className="muted">{r.tipNote}</td></tr>)}
        </tbody></table>
      </details>
    </figure>
  );
}

function Legend() {
  return (
    <p className="ch-legend" aria-hidden="true">
      <span><i className="ch-key ch-key-lack" />You lack here</span>
      <span><i className="ch-key ch-key-ok" />Covered</span>
    </p>
  );
}

/* ---------- page ---------- */
export function Analyse({ go }) {
  const { done, toggle } = useProgress();
  const [user, setUser] = useState(() => safeGet(LC_USER, ''));
  const [raw, setRaw] = useState(() => safeGet(LC_CACHE, null));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [level, setLevel] = useState('fundamental');
  const [focusId, setFocusId] = useState(null);
  const [coId, setCoId] = useState(() => safeGet(LC_CO, 'motorq'));

  const load = async (name) => {
    setBusy(true); setError('');
    try {
      const data = await fetchProfile(name);
      const entry = { at: Date.now(), data };
      setRaw(entry); setUser(data.matchedUser.username);
      safeSet(LC_CACHE, entry); safeSet(LC_USER, data.matchedUser.username);
    } catch (e) { setError(e.message); }
    setBusy(false);
  };
  useEffect(() => { if (user && (!raw || Date.now() - raw.at > 6 * HOUR)) load(user); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const forget = () => { setUser(''); setRaw(null); safeSet(LC_USER, ''); safeSet(LC_CACHE, null); };
  const r = useMemo(() => (raw?.data ? analyse(raw.data, done) : null), [raw, done]);
  const pickCo = (id) => { setCoId(id); safeSet(LC_CO, id); };

  if (!r) {
    return (
      <>
        <header className="today-head">
          <p className="kicker">Analyse · LeetCode read-out</p>
          <h1>Where are you actually weak?</h1>
          <p className="index-note">Enter your LeetCode username. PrepHub reads your public profile: solves by topic, Easy/Medium/Hard split, contest rating and your last 20 accepted solves. It then charts every area, names the patterns you lack and the problems to do next, and matches you against the companies you’re targeting.</p>
        </header>
        <article className="index-card lc-start">
          <LookupForm busy={busy} onSubmit={load} />
          {error && <p className="lc-error" role="alert">{error}</p>}
          <p className="lc-fine">Username only. PrepHub never asks for your LeetCode password or session cookie, and doesn’t need them: everything it reads is already public on your profile.</p>
        </article>
        <CompanyBox r={null} coId={coId} pickCo={pickCo} done={done} />
      </>
    );
  }

  const gapIds = new Set(r.gaps.map((g) => g.p.id));
  const gapTags = new Set(r.gaps.flatMap((g) => g.tags));
  const focus = r.rows.find((x) => x.p.id === focusId) || r.gaps[0] || r.rows[0];

  const diffRows = ['Easy', 'Medium', 'Hard'].map((d) => {
    const n = r.ac[d] || 0; const all = r.allCount[d] || 0;
    return { label: d, value: n, end: `${n}`, lack: d !== 'Easy' && n < (d === 'Medium' ? 100 : 20), tipValue: `${n} solved`, tipNote: all ? `of ${all} on LeetCode · ${Math.round((n / (r.total || 1)) * 100)}% of your solves` : '' };
  });
  const patternRows = [...r.rows].sort((a, b) => a.cover - b.cover).map((x) => ({
    label: short(x.p.name), value: Math.round(x.cover * 100), lack: x.cover < 1,
    end: `${x.solved}/${x.target}${x.known ? '' : '*'}`,
    tipValue: `${x.solved} of ${x.target}`, tipNote: x.cover < 1 ? `${Math.ceil(x.target - x.solved)} more to target` : 'target met',
  }));
  const areaRows = r.areas.filter((a) => a.level === level).slice(0, 18).map((a) => ({
    label: a.name, value: a.solved, end: `${a.solved}`, lack: gapTags.has(a.slug) || a.solved < 5,
    tipValue: `${a.solved} solved`, tipNote: gapTags.has(a.slug) ? 'feeds a pattern you lack' : a.solved < 5 ? 'barely touched' : '',
  }));
  const untouched = r.rows.filter((x) => x.known && x.solved === 0).map((x) => short(x.p.name));

  return (
    <>
      <header className="today-head">
        <p className="kicker">Analyse · {r.username}</p>
        <h1>{r.gaps.length ? <>You lack {r.gaps.length} of {r.rows.length} patterns. Start with {short(r.gaps[0].p.name)}.</> : 'Every pattern is covered. Do mixed, timed sets now.'}</h1>
        <p className="today-meta">
          <span>{r.total} solved</span>
          {r.contest?.attendedContestsCount > 0 && <span>contest {Math.round(r.contest.rating)} · top {r.contest.topPercentage}%</span>}
          <span>read {raw.at && ago(raw.at / 1000)}</span>
          <button type="button" className="lc-link" onClick={() => load(user)} disabled={busy}>{busy ? 'refreshing…' : 'refresh'}</button>
          <button type="button" className="lc-link" onClick={forget}>change user</button>
        </p>
        {error && <p className="lc-error" role="alert">{error}</p>}
      </header>

      {r.next.length > 0 && (
        <article className="index-card">
          <p className="call">Do these next · one from each pattern you lack most</p>
          <ol className="card-rows">
            {r.next.map((q, i) => (
              <li key={q.id} className={`card-row ${i === 0 ? 'is-next' : ''}`}>
                <Mark done={!!done[q.id]} label={q.title} onClick={() => toggle(q.id)} />
                <span className="card-title"><ExtLink href={lcUrl(q.slug)}>{q.title}</ExtLink></span>
                <span className="card-call">{short(q.p.name)}</span>
              </li>
            ))}
          </ol>
          <div className="btn-row">
            <a className="btn btn-signal" href={lcUrl(r.next[0].slug)} target="_blank" rel="noopener noreferrer">Solve {r.next[0].title} <Icon name="arrow" size={16} /></a>
            <button className="btn-ghost" onClick={() => { safeSet('interview-prep-learn-mode', 'general'); go('learn', `learn-${r.next[0].p.id}`); }}>Watch the {short(r.next[0].p.name)} walkthrough</button>
          </div>
        </article>
      )}

      <section className="lc-grid">
        <div className="lc-panel">
          <h2 className="section-title">Readiness <span className="lc-score">{r.score}<small>/100</small></span></h2>
          <p className="lc-fine">70% pattern coverage weighted by tier, 30% how much of your work is Medium or Hard. A PrepHub estimate, not a LeetCode number.</p>
          <h3 className="ch-title">Easy · Medium · Hard solved</h3>
          <HBars rows={diffRows} name="Solved by difficulty" />
          {r.advice.length > 0 && <ul className="lc-advice">{r.advice.map((a) => <li key={a}>{a}</li>)}</ul>}
        </div>

        <div className="lc-panel">
          <h2 className="section-title">Patterns vs target</h2>
          <p className="lc-fine">% of the interview-ready target per pattern. Bar-end shows solved/target.</p>
          <Legend />
          <HBars rows={patternRows} max={100} unit="%" name="Pattern coverage against target" />
          {r.rows.some((x) => !x.known) && <p className="lc-fine lc-foot">* LeetCode doesn’t publish this topic on profiles, so it counts what you’ve ticked in Practice.</p>}
        </div>
      </section>

      <section className="also">
        <div className="row-between">
          <h2 className="section-title">Every LeetCode area</h2>
          <div className="seg" role="tablist" aria-label="Topic level">
            {[['fundamental', 'Fundamental'], ['intermediate', 'Intermediate'], ['advanced', 'Advanced']].map(([k, l]) => (
              <button key={k} role="tab" aria-selected={level === k} className={level === k ? 'on' : ''} onClick={() => setLevel(k)}>{l}</button>
            ))}
          </div>
        </div>
        <Legend />
        {areaRows.length ? <HBars rows={areaRows} name={`Solved per ${level} topic`} /> : <p className="lc-fine">No {level} topics on this profile yet.</p>}
      </section>

      <section className="also">
        <h2 className="section-title">Where you lack, and what remains</h2>
        {r.gaps.length === 0 ? <p className="lc-fine">Nothing under target. Keep a weekly contest going.</p> : (
          <ul className="gap-list">
            {r.gaps.map((g) => (
              <li key={g.p.id}>
                <button type="button" className={`gap ${focus === g ? 'is-on' : ''}`} onClick={() => setFocusId(g.p.id)} aria-pressed={focus === g}>
                  <span className="gap-name">{short(g.p.name)}{g.p.motorq && <span className="for"> · Motorq</span>}</span>
                  <span className="lc-meter" aria-hidden="true"><i style={{ width: `${Math.round(g.cover * 100)}%` }} /></span>
                  <span className="card-call">{g.need} more · {g.left} left here</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {untouched.length > 0 && <p className="lc-sync">Never touched on LeetCode: {untouched.join(', ')}.</p>}

        {focus && (
          <article className="index-card ladder">
            <p className="call">To master {short(focus.p.name)} · {focus.solved}/{focus.target}</p>
            <p className="index-note">{focus.p.trigger}</p>
            {focus.queue.length ? (
              <ol className="card-rows">
                {focus.queue.slice(0, 8).map((q, i) => (
                  <li key={q.id} className={`card-row ${i === 0 ? 'is-next' : ''}`}>
                    <Mark done={!!done[q.id]} label={q.title} onClick={() => toggle(q.id)} />
                    <span className="card-title"><ExtLink href={lcUrl(q.slug)}>{q.title}</ExtLink></span>
                    <span className="card-call">{q.core ? 'Core' : q.note || 'Mastery'}</span>
                  </li>
                ))}
              </ol>
            ) : <p className="lc-fine">You’ve done every problem PrepHub lists here. Do timed re-solves.</p>}
            <div className="btn-row">
              <button className="btn-ghost" onClick={() => go('dsa')}>Open {short(focus.p.name)} in Practice</button>
            </div>
          </article>
        )}
      </section>

      <section className="also">
        <h2 className="section-title">Recent accepted solves</h2>
        {r.syncable.length > 0 && (
          <p className="lc-sync">{r.syncable.length} of these {r.syncable.length === 1 ? 'is' : 'are'} on your Practice list but not ticked.{' '}
            <button type="button" className="lc-link" onClick={() => r.syncable.forEach((q) => toggle(q.id))}>Tick {r.syncable.length === 1 ? 'it' : 'them'}</button></p>
        )}
        <ul className="also-list">
          {r.recent.slice(0, 6).map((s) => (
            <li key={s.titleSlug + s.timestamp}><a className="lc-recent" href={lcUrl(s.titleSlug)} target="_blank" rel="noopener noreferrer"><span className="card-call">{ago(s.timestamp)}</span>{s.title}<span className="also-go">Re-solve</span></a></li>
          ))}
          {r.recent.length === 0 && <li className="lc-fine">No public accepted solves yet.</li>}
          <li><button onClick={() => go('dsa')}><span className="card-call">PRACTICE</span>{count(ids.dsa, done)} of {ids.dsa.length} problems ticked<span className="also-go">Open Practice</span></button></li>
        </ul>
      </section>

      <CompanyBox r={r} coId={coId} pickCo={pickCo} done={done} toggle={toggle} gapIds={gapIds} go={go} />
    </>
  );
}

/* ---------- last box: company-specific ---------- */
function CompanyBox({ r, coId, pickCo, gapIds = new Set(), go }) {
  const c = companyIntel.find((x) => x.id === coId) || companyIntel[0];
  const row = (pid) => r?.rows.find((x) => x.p.id === pid);
  const topicRows = c.lc && c.lc.topics.map(([name, n]) => {
    const mine = r?.tagCounts?.[tagSlug(name)];
    return {
      label: name, value: Math.round((n / c.lc.n) * 100), end: `${Math.round((n / c.lc.n) * 100)}%`,
      lack: r ? (mine || 0) < 10 : false,
      tipValue: `${n} of ${c.lc.n} tagged questions`, tipNote: r ? (mine == null ? 'not on your profile' : `you: ${mine} solved`) : '',
    };
  });

  return (
    <section className="co-box" aria-labelledby="co-title">
      <p className="kicker">Company-specific · remote-friendly, ~2 yrs backend</p>
      <h2 id="co-title">What {c.name} asks, and how you match</h2>
      <div className="seg co-pick" role="tablist" aria-label="Company">
        {companyIntel.map((x) => (
          <button key={x.id} role="tab" aria-selected={x.id === c.id} className={x.id === c.id ? 'on' : ''} onClick={() => pickCo(x.id)}>{x.name}</button>
        ))}
      </div>

      <p className="co-meta"><b>{c.workModel}</b> · {c.fit}</p>

      <h3>Interview process</h3>
      <ol className="loop">{c.process.map((s) => <li key={s}>{s}</li>)}</ol>
      {c.id === 'motorq' && <ul className="lc-advice">{motorq.loopNotes.map((s) => <li key={s}>{s}</li>)}</ul>}

      <h3>Question types that come up</h3>
      <ul className="lc-advice">{c.types.map((t) => <li key={t}>{t}</li>)}</ul>

      {c.lc && (
        <>
          <h3>What they prioritise on LeetCode</h3>
          <p className="lc-fine">Share of {c.name}’s {c.lc.n} LeetCode-tagged questions per topic ({c.lc.diff.E} Easy · {c.lc.diff.M} Medium · {c.lc.diff.H} Hard).{r && ' Blue = you have under 10 solves in it.'}</p>
          {r && <Legend />}
          <HBars rows={topicRows} max={100} unit="%" name={`${c.name} topic frequency`} />
          <h3>Most-asked problems</h3>
          <ul className="also-list">
            {c.lc.top.map(([t, slug, d]) => (
              <li key={slug}><a className="lc-recent" href={lcUrl(slug)} target="_blank" rel="noopener noreferrer"><span className="card-call">{d === 'E' ? 'Easy' : d === 'M' ? 'Medium' : 'Hard'}</span>{t}<span className="also-go">Solve</span></a></li>
            ))}
          </ul>
        </>
      )}

      {c.patterns.length > 0 && (
        <>
          <h3>Patterns they test{r && ', against your coverage'}</h3>
          <ul className="co-pats">
            {c.patterns.map((cp) => {
              const x = row(cp.p);
              const nextQ = cp.q?.[0] || (x?.picks[0] && [x.picks[0].title, x.picks[0].slug]);
              return (
                <li key={cp.p} className={x && gapIds.has(cp.p) ? 'is-lack' : ''}>
                  <span className="gap-name">{x ? short(x.p.name) : cp.p}{cp.reported && <span className="for"> · reported</span>}</span>
                  <span className="co-why">{cp.why}</span>
                  {x && <span className="card-call">{x.solved}/{x.target}{gapIds.has(cp.p) ? ' · lacking' : ' · ok'}</span>}
                  {nextQ && <ExtLink href={lcUrl(nextQ[1])}>{nextQ[0]}</ExtLink>}
                </li>
              );
            })}
          </ul>
        </>
      )}

      {c.id === 'motorq' && (
        <>
          <h3>Round by round</h3>
          <div className="asked-grid">
            {motorq.rounds.map((rd, i) => (
              <div key={rd.round} className="asked">
                <div className="asked-head"><span className="asked-num">{i + 1}</span>{rd.round}</div>
                <ul>{rd.asked.map((a) => (
                  <li key={a.q}><span className="asked-q">{a.q}</span>
                    {a.practice.length > 0 && <span className="asked-practice">Practice: {a.practice.map(([t, slug]) => <ExtLink key={slug} href={lcUrl(slug)}>{t}</ExtLink>)}</span>}
                  </li>
                ))}</ul>
              </div>
            ))}
          </div>
          <Callout title="OA character" tone="warn"><p>{motorq.oa}</p></Callout>
          <div className="two-col">
            <div>
              <h3>How I match the JD</h3>
              <ul className="qlist">{motorq.jdMatch.map((j) => <li key={j.id}><Check id={`co:jd:${j.id}`}>{j.ok ? '✓ ' : '⚠ '}{j.label}</Check></li>)}</ul>
            </div>
            <div>
              <h3>Prep priorities (ranked)</h3>
              <ol className="qlist">{motorq.priorities.map((p, i) => <li key={p}><Check id={`co:pri:${i}`}>{i + 1}. {p}</Check></li>)}</ol>
            </div>
          </div>
        </>
      )}

      {c.beyond.length > 0 && <Callout title="Beyond LeetCode"><ul>{c.beyond.map((b) => <li key={b}>{b}</li>)}</ul></Callout>}

      {c.sources.length > 0 && (<><h3>Sources</h3><LinkGrid items={c.sources} /></>)}
      <p className="lc-fine">Curated {INTEL_DATE} from Glassdoor, LeetCode Discuss, Taro and company hiring pages; Glassdoor can’t be read live. LeetCode topic data: liquidslr/leetcode-company-wise-problems (Oct 2025). Openings snapshot {hiringSnapshotDate}.
        {go && <> <button type="button" className="lc-link" onClick={() => go('company')}>Open roles →</button></>}</p>
    </section>
  );
}
