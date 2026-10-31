// The catalog drawer: interview rounds across both targets (Motorq + remote India), each holding cards to pull.
// Built only from companies.js intel; nothing here is invented.
import { motorq } from './companies';
import { patterns, questionId } from './dsa';

// Reuse the Practice tab's progress id when a slug already lives in a DSA pattern, so ticking it in either place counts once.
const dsaIdFor = (slug) => {
  const p = patterns.find((pt) => [...pt.questions, ...(pt.extra || [])].some((q) => q[1] === slug));
  return p ? questionId(p.id, slug) : `loop:lc:${slug}`;
};
const round = (name) => motorq.rounds.find((r) => r.round === name).asked;
const lcCards = (prefix, asked) => asked.flatMap((a) => a.practice.map(([title, slug]) => ({ id: dsaIdFor(slug), title, slug, call: `${prefix}·${slug.split('-').slice(0, 2).join('-')}` })));
const askedCards = (prefix, asked) => asked.map((a, i) => ({ id: `loop:${prefix.toLowerCase()}:${i}`, title: a.q, asked: true, call: `${prefix}·Q${i + 1}` }));

export const drawers = [
  { id: 'oa', tab: 'OA', name: 'Online Assessment', for: 'Motorq', note: motorq.oa, cards: [...askedCards('OA', round('Online Assessment')), ...lcCards('OA', round('Online Assessment'))] },
  { id: 'dsa', tab: 'DSA', name: 'DSA rounds', for: 'Both', note: 'Motorq reports these patterns; remote-India loops run 1–2 LeetCode-medium rounds.', cards: lcCards('DSA', round('DSA rounds')) },
  { id: 'mc', tab: 'Machine coding', name: 'Machine coding / LLD', for: 'Both', note: 'Remote-India loops weight LLD heavily at 2–3 yrs; Motorq runs a timed build.', cards: askedCards('MC', round('Machine coding / take-home')) },
  { id: 'sd', tab: 'System design', name: 'System design', for: 'Both', note: 'Lean on Kafka + time-series experience.', cards: askedCards('SD', round('System design')) },
  { id: 'fun', tab: 'Fundamentals + SQL', name: 'Fundamentals + SQL', for: 'Motorq', note: 'Consistency, indexing, OS, DBMS, networking, SQL.', cards: [...askedCards('FUN', round('Fundamentals + SQL')), ...lcCards('SQL', round('Fundamentals + SQL'))] },
  { id: 'hm', tab: 'CTO / HM', name: 'CTO / hiring manager', for: 'Both', note: 'Motorq: CTO resume deep-dive. Remote: hiring manager + culture round.', cards: askedCards('HM', round('CTO round')) },
];
