// Turns a public LeetCode profile into "where you're thin and what to solve next".
// LeetCode publishes per-topic solved counts, the difficulty split, contest rating and the
// last 20 accepted solves. It does not publish the full list of solved problems, so
// "already solved" means: in your last 20 accepted solves, or ticked in Practice here.
import { patterns, allQuestions, questionId } from './data/dsa';

// Each Practice pattern, the LeetCode topic tags that count towards it, and how many
// solves in those tags we treat as interview-ready for a mid-level loop.
export const PATTERN_TAGS = {
  'arrays-hashing': { tags: ['hash-table', 'array'], target: 40 },
  'two-pointers': { tags: ['two-pointers'], target: 20 },
  'prefix-sum': { tags: ['prefix-sum'], target: 10 },
  'sliding-window': { tags: ['sliding-window'], target: 12 },
  'binary-search': { tags: ['binary-search'], target: 18 },
  stack: { tags: ['stack', 'monotonic-stack'], target: 15 },
  'linked-list': { tags: ['linked-list'], target: 12 },
  trees: { tags: ['tree', 'binary-tree', 'binary-search-tree'], target: 25 },
  heap: { tags: ['heap-priority-queue'], target: 12 },
  intervals: { tags: ['sweep-line', 'line-sweep'], target: 4, note: 'LeetCode rarely tags intervals, so this one is a rough guess.' },
  graphs: { tags: ['graph', 'breadth-first-search', 'depth-first-search', 'union-find', 'topological-sort'], target: 25 },
  dp: { tags: ['dynamic-programming'], target: 30 },
  backtracking: { tags: ['backtracking'], target: 10 },
  greedy: { tags: ['greedy'], target: 18 },
  tries: { tags: ['trie'], target: 5 },
  bits: { tags: ['bit-manipulation'], target: 6 },
};
const TIER_WEIGHT = (t) => (String(t)[0] === '1' ? 3 : String(t)[0] === '2' ? 2 : 1);

export async function fetchProfile(username) {
  const res = await fetch(`./api/leetcode?u=${encodeURIComponent(username.trim())}`);
  let body = null;
  try { body = await res.json(); } catch { /* fall through */ }
  if (!res.ok) throw new Error(body?.error || 'Lookup failed. Try again.');
  return body;
}

export function analyse(data, done) {
  const user = data.matchedUser;
  const tagCounts = {};
  const areas = [];
  for (const level of ['fundamental', 'intermediate', 'advanced']) {
    for (const t of user.tagProblemCounts?.[level] || []) {
      tagCounts[t.tagSlug] = t.problemsSolved;
      areas.push({ name: t.tagName, slug: t.tagSlug, level, solved: t.problemsSolved });
    }
  }
  areas.sort((a, b) => b.solved - a.solved);
  const ac = Object.fromEntries((user.submitStatsGlobal?.acSubmissionNum || []).map((d) => [d.difficulty, d.count]));
  const total = ac.All || 0;
  const recent = data.recentAcSubmissionList || [];
  const recentSlugs = new Set(recent.map((r) => r.titleSlug));

  const rows = patterns.map((p) => {
    const m = PATTERN_TAGS[p.id] || { tags: [], target: 10 };
    // A problem carries several tags, so take the largest tag rather than adding them up.
    // LeetCode leaves some tags (Heap, Prefix Sum) out of public profiles entirely; then
    // fall back to what you've ticked in Practice instead of reporting a false zero.
    const known = m.tags.some((t) => t in tagCounts);
    const list = allQuestions(p).map(({ q }) => ({ title: q[0], slug: q[1], note: q[2], id: questionId(p.id, q[1]) }));
    const core = new Set(p.questions.map((q) => q[1]));
    const todo = list.filter((q) => !done[q.id] && !recentSlugs.has(q.slug));
    const solved = known ? Math.max(0, ...m.tags.map((t) => tagCounts[t] || 0)) : list.length - todo.length;
    const target = known ? m.target : list.length;
    const cover = Math.min(1, solved / target);
    const queue = [...todo.filter((q) => core.has(q.slug)).map((q) => ({ ...q, core: true })), ...todo.filter((q) => !core.has(q.slug))];
    const picks = queue.slice(0, 3);
    return { p, solved, target, cover, known, note: known ? m.note : 'LeetCode doesn’t publish this topic on profiles, so this counts what you’ve ticked in Practice.', weight: TIER_WEIGHT(p.tier), picks, queue, tags: m.tags, left: todo.length, size: list.length };
  });

  // Readiness: topic coverage weighted by tier (70%), plus how much of your work is Medium/Hard (30%),
  // because interviews are mostly Mediums.
  const wSum = rows.reduce((n, r) => n + r.weight, 0);
  const coverage = rows.reduce((n, r) => n + r.cover * r.weight, 0) / wSum;
  const medHardShare = total ? ((ac.Medium || 0) + (ac.Hard || 0)) / total : 0;
  const mix = Math.min(1, medHardShare / 0.6);
  const score = Math.round((coverage * 0.7 + mix * 0.3) * 100);

  // Weakest: the lowest coverage, Motorq-flagged and higher tiers first on ties; tier 3 only once the rest are covered.
  const rank = (r) => r.cover - (r.p.motorq ? 0.05 : 0) - r.weight * 0.02;
  const pool = rows.filter((r) => r.picks.length && r.known && (r.weight > 1 || rows.every((x) => x.weight === 1 || x.cover >= 1)));
  // Once every published topic meets its target, point at the topics LeetCode doesn't publish instead.
  const thin = pool.filter((r) => r.cover < 1);
  const fallback = rows.filter((r) => r.picks.length && r.cover < 1);
  const weakest = [...(thin.length ? thin : fallback)].sort((a, b) => rank(a) - rank(b));

  const advice = [];
  if (total < 50) advice.push('Under 50 solves: work through the Core 7 of each tier-1 pattern before anything else.');
  if (total && (ac.Easy || 0) / total > 0.5) advice.push(`${Math.round(((ac.Easy || 0) / total) * 100)}% of your solves are Easy. Interviews are mostly Medium, so move to Mediums now.`);
  if ((ac.Medium || 0) >= 80 && (ac.Hard || 0) < 10) advice.push('You have plenty of Mediums. Add a Hard each week in DP or Graphs.');
  const contest = data.userContestRanking;
  if (!contest?.attendedContestsCount) advice.push('No contests yet. One weekly contest is the cheapest timed-pressure practice there is.');
  else if (contest.rating < 1600) advice.push(`Contest rating ${Math.round(contest.rating)}: aim to solve Q1 and Q2 every week in under 30 minutes.`);
  const stale = recent.length ? (Date.now() / 1000 - Number(recent[0].timestamp)) / 86400 : null;
  if (stale != null && stale > 7) advice.push(`Your last accepted solve was ${Math.round(stale)} days ago. Do one today to restart the habit.`);

  // Where you lack: every pattern under target, with how many more solves it needs.
  const gaps = rows.filter((r) => r.cover < 1)
    .map((r) => ({ ...r, need: Math.max(1, Math.ceil(r.target - r.solved)) }))
    .sort((a, b) => rank(a) - rank(b));
  // Do these next: the top pick from each of the five weakest patterns.
  const next = gaps.filter((r) => r.picks.length).slice(0, 5).map((r) => ({ ...r.picks[0], p: r.p }));

  // Recent solves that are on the Practice list but not ticked yet.
  const syncable = rows.flatMap((r) => allQuestions(r.p).map(({ q }) => ({ slug: q[1], id: questionId(r.p.id, q[1]) })))
    .filter((q) => recentSlugs.has(q.slug) && !done[q.id]);

  return {
    username: user.username, ranking: user.profile?.ranking, ac, total,
    allCount: Object.fromEntries((data.allQuestionsCount || []).map((d) => [d.difficulty, d.count])),
    contest, recent, rows, weakest, areas, gaps, next, tagCounts, score, coverage, medHardShare, advice, syncable,
  };
}

// LeetCode topic name ("Heap (Priority Queue)") → its tag slug ("heap-priority-queue").
export const tagSlug = (name) => name.toLowerCase().replace(/[()]/g, '').trim().replace(/\s+/g, '-');
