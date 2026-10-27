import { createContext, useCallback, useContext, useState } from 'react';
import { patterns, allQuestions, questionId } from './data/dsa';
import { concepts, problems } from './data/systemDesign';
import { motorq } from './data/companies';
import { interviewDayChecklist } from './data/sites';

const KEY = 'interview-prep-progress-v1';

export function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — progress just won't persist */
  }
}

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [done, setDone] = useState(() => safeGet(KEY, {}));
  const toggle = useCallback((id) => {
    setDone((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = Date.now();
      safeSet(KEY, next);
      return next;
    });
  }, []);
  const reset = useCallback(() => {
    setDone({});
    safeSet(KEY, {});
  }, []);
  return <ProgressContext.Provider value={{ done, toggle, reset }}>{children}</ProgressContext.Provider>;
}

export const useProgress = () => useContext(ProgressContext);

// ID catalogs — the single source for every section's totals.
export const ids = {
  dsa: patterns.flatMap((p) => allQuestions(p).map(({ q }) => questionId(p.id, q[1]))),
  dsaCore: patterns.flatMap((p) => p.questions.map((q) => questionId(p.id, q[1]))),
  sd: [...concepts.flatMap((t) => t.items.map((c) => `sd:c:${c.id}`)), ...problems.map((p) => `sd:p:${p.id}`)],
  company: [
    ...motorq.jdMatch.map((j) => `co:jd:${j.id}`),
    ...motorq.priorities.map((_, i) => `co:pri:${i}`),
  ],
  sites: interviewDayChecklist.map((c) => `site:${c.id}`),
  scroll: patterns.map((p) => `scroll:${p.id}`),
};

export function pct(list, done) {
  if (!list.length) return 0;
  return Math.round((list.filter((id) => done[id]).length / list.length) * 100);
}
