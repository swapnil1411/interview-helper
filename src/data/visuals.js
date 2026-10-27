// Step-through diagrams. Each builder actually RUNS the algorithm on a tiny input and records a frame per step,
// so the picture can never drift from the logic. Frame = { panels: Panel[], msg, vars?: [name, value][] }.
// Panels:
//   arr   { label, cells, mark?: {i: cls}, ptr?: {i: text}, idx?, empty? }
//   graph { w, h, nodes: [{id, label, x, y}], edges: [[from, to, label?]], directed?, mark?, emark?: {'a>b': cls}, badge? }
//   grid  { label, cells: [[v]], mark?: {'r,c': cls}, rows?, cols? }
//   iv    { label, items: [{s, e, cls?}], min, max, lane? }
// Mark classes: cur (now), win (in window / reachable), hit (answer / match), ok (done), bad (removed), dim (eliminated), c0..c2 (groups).

const arr = (label, cells, o = {}) => ({ t: 'arr', label, cells, ...o });
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const ptrs = (l, r, a = 'L', b = 'R') => (l === r ? { [l]: `${a} ${b}` } : { [l]: a, [r]: b });

/* ---------- Arrays & Hashing: Two Sum ---------- */
function twoSum() {
  const a = [4, 1, 7, 3, 5], target = 8, seen = new Map(), F = [];
  const map = (hit) => arr('hashmap  value → index', [...seen].map(([k, i]) => `${k}→${i}`), {
    empty: '{ }', mark: hit == null ? {} : { [[...seen.keys()].indexOf(hit)]: 'hit' },
  });
  F.push({ panels: [arr('nums', a, { idx: true }), map()], msg: `Find two numbers that add to ${target}. Walk once, and for each x ask the map whether ${target} − x has been seen.` });
  for (let i = 0; i < a.length; i++) {
    const need = target - a[i];
    if (seen.has(need)) {
      const j = seen.get(need);
      F.push({ panels: [arr('nums', a, { idx: true, mark: { [j]: 'hit', [i]: 'hit' } }), map(need)], msg: `x = ${a[i]} → need ${need}. It IS in the map at index ${j}. Answer [${j}, ${i}] in one pass, O(n) instead of the O(n²) nested loop.`, vars: [['i', i], ['need', need]] });
      return F;
    }
    seen.set(a[i], i);
    F.push({ panels: [arr('nums', a, { idx: true, mark: { [i]: 'cur' } }), map()], msg: `x = ${a[i]} → need ${need}. Not seen yet, so store ${a[i]}→${i} for later numbers.`, vars: [['i', i], ['need', need]] });
  }
  return F;
}

/* ---------- Two Pointers: Two Sum II ---------- */
function twoPointers() {
  const a = [1, 3, 4, 6, 8, 11], target = 10, F = [];
  let l = 0, r = a.length - 1;
  const dim = () => Object.fromEntries(a.map((_, i) => [i, i < l || i > r ? 'dim' : '']));
  F.push({ panels: [arr('sorted nums', a, { idx: true, ptr: ptrs(l, r) })], msg: `Sorted input, target ${target}. L starts at the smallest value, R at the largest.` });
  while (l < r) {
    const s = a[l] + a[r];
    if (s === target) {
      F.push({ panels: [arr('sorted nums', a, { idx: true, mark: { ...dim(), [l]: 'hit', [r]: 'hit' }, ptr: ptrs(l, r) })], msg: `${a[l]} + ${a[r]} = ${s} ✓ Found. Every pair we skipped was provably impossible, so this is O(n).`, vars: [['sum', s]] });
      return F;
    }
    const big = s > target;
    F.push({
      panels: [arr('sorted nums', a, { idx: true, mark: { ...dim(), [l]: 'cur', [r]: 'cur' }, ptr: ptrs(l, r) })],
      msg: big
        ? `${a[l]} + ${a[r]} = ${s} > ${target}. Too big, and ${a[r]} is too big even with the smallest remaining number. Drop it: R moves left.`
        : `${a[l]} + ${a[r]} = ${s} < ${target}. Too small, and ${a[l]} is too small even with the largest remaining number. Drop it: L moves right.`,
      vars: [['sum', s]],
    });
    big ? r-- : l++;
  }
  return F;
}

/* ---------- Prefix Sum: Subarray Sum Equals K ---------- */
function prefixSum() {
  const a = [1, 2, 3, -2, 2], k = 3, F = [];
  const count = new Map([[0, 1]]), at = new Map([[0, [-1]]]), pre = [];
  let run = 0, ans = 0;
  const mapRow = (hl) => arr('seen prefix sums → count', [...count].map(([p, c]) => `${p}:${c}`), { mark: hl == null ? {} : { [[...count.keys()].indexOf(hl)]: 'hit' } });
  const preRow = (i) => arr('prefix (running sum)', a.map((_, x) => (x < pre.length ? pre[x] : '')), { mark: i == null ? {} : { [i]: 'cur' } });
  F.push({ panels: [arr('nums', a, { idx: true }), preRow(), mapRow()], msg: `Count subarrays that sum to ${k}. Seed the map with {0:1}, the empty prefix, so subarrays starting at index 0 are counted too.`, vars: [['k', k], ['count', 0]] });
  for (let i = 0; i < a.length; i++) {
    run += a[i]; pre.push(run);
    const need = run - k, c = count.get(need) || 0, mark = {};
    if (c) { const j = at.get(need).at(-1); for (let x = j + 1; x <= i; x++) mark[x] = 'hit'; } else mark[i] = 'cur';
    ans += c;
    F.push({
      panels: [arr('nums', a, { idx: true, mark }), preRow(i), mapRow(c ? need : null)],
      msg: c ? `running = ${run}. need running − k = ${need}, seen ${c}× → count += ${c}. The highlighted subarray sums to ${k}.` : `running = ${run}. need ${need}, never seen → count += 0.`,
      vars: [['running', run], ['need', need], ['count', ans]],
    });
    count.set(run, (count.get(run) || 0) + 1);
    at.set(run, [...(at.get(run) || []), i]);
  }
  F.push({ panels: [arr('nums', a, { idx: true }), preRow(), mapRow()], msg: `Done: ${ans} subarrays sum to ${k}, found in one O(n) pass. A sliding window can't do this because of the negative number.`, vars: [['count', ans]] });
  return F;
}

/* ---------- Sliding Window: Longest Substring Without Repeating ---------- */
function slidingWindow() {
  const s = [...'abcabcbb'], last = new Map(), F = [];
  let l = 0, best = 0, bestL = 0;
  F.push({ panels: [arr('s', s, { idx: true })], msg: 'Find the longest substring with no repeated character. R grows the window; when a repeat appears, L jumps just past the earlier copy.' });
  for (let r = 0; r < s.length; r++) {
    const c = s[r];
    let msg;
    if (last.has(c) && last.get(c) >= l) {
      const old = l; l = last.get(c) + 1;
      msg = `'${c}' is already in the window (index ${last.get(c)}). L jumps from ${old} to ${l}.`;
    } else msg = `'${c}' is new, so the window grows.`;
    last.set(c, r);
    if (r - l + 1 > best) { best = r - l + 1; bestL = l; msg += ` New best = ${best}.`; }
    const mark = Object.fromEntries(s.map((_, i) => [i, i < l ? 'dim' : i <= r ? 'win' : '']));
    mark[r] = 'cur';
    F.push({ panels: [arr('s', s, { idx: true, mark, ptr: ptrs(l, r) }), arr('last index of each char', [...last].map(([ch, i]) => `${ch}:${i}`))], msg, vars: [['window', s.slice(l, r + 1).join('')], ['best', best]] });
  }
  const mark = Object.fromEntries(range(bestL, bestL + best - 1).map((i) => [i, 'hit']));
  F.push({ panels: [arr('s', s, { idx: true, mark })], msg: `Answer ${best} ("${s.slice(bestL, bestL + best).join('')}"). Each character entered and left the window at most once, so this is O(n).`, vars: [['best', best]] });
  return F;
}

/* ---------- Binary Search on Answer: Koko ---------- */
function koko() {
  const piles = [3, 6, 7, 11], h = 8, F = [], max = Math.max(...piles), space = range(1, max);
  const hours = (k) => piles.reduce((t, p) => t + Math.ceil(p / k), 0);
  let lo = 1, hi = max;
  const spaceRow = (mid, extra = {}) => {
    const mark = Object.fromEntries(space.map((k, i) => [i, k < lo || k > hi ? 'dim' : '']));
    if (mid) mark[mid - 1] = 'cur';
    return arr('answer space: eating speed k', space, { mark: { ...mark, ...extra }, ptr: ptrs(lo - 1, hi - 1, 'lo', 'hi') });
  };
  F.push({ panels: [arr('piles', piles), spaceRow()], msg: `Finish every pile within h = ${h} hours. Don't search the piles; search the SPEED k in 1..${max}. If speed k works, any faster speed works too, so the answer space is sorted.` });
  while (lo < hi) {
    const mid = (lo + hi) >> 1, t = hours(mid), ok = t <= h;
    F.push({
      panels: [arr(`hours per pile at k = ${mid}`, piles.map((p) => Math.ceil(p / mid)), { mark: Object.fromEntries(piles.map((_, i) => [i, ok ? 'ok' : 'bad'])) }), spaceRow(mid)],
      msg: `mid = ${mid}: ${piles.map((p) => `⌈${p}/${mid}⌉`).join(' + ')} = ${t} hours. ${ok ? `≤ ${h} ✓ Works, so try slower: hi = ${mid}.` : `> ${h} ✗ Too slow: lo = ${mid + 1}.`}`,
      vars: [['lo', lo], ['hi', hi], ['mid', mid], ['hours', t]],
    });
    ok ? (hi = mid) : (lo = mid + 1);
  }
  F.push({ panels: [arr('piles', piles), spaceRow(0, { [lo - 1]: 'hit' })], msg: `lo = hi = ${lo}. The minimum speed is ${lo}, found with ${F.length - 1} feasibility checks instead of ${space.length}. That is O(n log max).`, vars: [['answer', lo]] });
  return F;
}

/* ---------- Monotonic Stack: Daily Temperatures ---------- */
function dailyTemps() {
  const T = [73, 74, 75, 71, 69, 72, 76, 73], ans = T.map(() => null), st = [], F = [];
  const panels = (mark = {}, smark = {}) => [
    arr('temps', T, { idx: true, mark }),
    arr('stack: waiting days (temps decreasing, top →)', st.map((i) => `d${i}:${T[i]}`), { empty: 'empty', mark: smark }),
    arr('answer: days until warmer', ans.map((x) => x ?? '·'), { idx: true }),
  ];
  F.push({ panels: panels(), msg: 'For each day, how long until a warmer day? Keep a stack of days still waiting. Their temps only decrease toward the top.' });
  for (let i = 0; i < T.length; i++) {
    while (st.length && T[st.at(-1)] < T[i]) {
      const j = st.at(-1);
      ans[j] = i - j;
      F.push({ panels: panels({ [i]: 'cur', [j]: 'hit' }, { [st.length - 1]: 'bad' }), msg: `${T[i]} > ${T[j]}, so day ${j} finally has a warmer day: wait ${i - j}. Pop it.`, vars: [['i', i], ['top', `d${j}`]] });
      st.pop();
    }
    st.push(i);
    F.push({ panels: panels({ [i]: 'cur' }, { [st.length - 1]: 'cur' }), msg: `Push day ${i} (${T[i]}). It waits for something warmer.`, vars: [['i', i]] });
  }
  st.forEach((j) => { ans[j] = 0; });
  F.push({ panels: panels(), msg: 'Days still on the stack never see a warmer day, so they get 0. Each index is pushed and popped at most once: O(n), not O(n²).' });
  return F;
}

/* ---------- Linked List: reverse ---------- */
function reverseList() {
  const vals = [1, 2, 3, 4], F = [];
  const nodes = [{ id: 'nL', label: '∅', x: 28, y: 50 }, ...vals.map((v, i) => ({ id: `n${v}`, label: v, x: 100 + i * 82, y: 50 })), { id: 'nR', label: '∅', x: 418, y: 50 }];
  const next = { n1: 'n2', n2: 'n3', n3: 'n4', n4: 'nR' };
  let prev = 'nL', curr = 'n1';
  const g = (o = {}) => {
    const badge = {};
    const add = (id, t) => { badge[id] = badge[id] ? `${badge[id]}, ${t}` : t; };
    add(prev, 'prev'); add(curr, 'curr'); if (o.nxt) add(o.nxt, 'next');
    return { t: 'graph', w: 446, h: 100, directed: true, nodes, edges: Object.entries(next).map(([a, b]) => [a, b]), badge, mark: o.mark || {}, emark: o.emark || {} };
  };
  F.push({ panels: [g({ mark: { nL: 'dim', nR: 'dim' } })], msg: 'Reverse 1→2→3→4 in place with three pointers: prev, curr and next. prev starts at null.' });
  while (curr !== 'nR') {
    const nxt = next[curr], label = curr.slice(1);
    next[curr] = prev;
    F.push({ panels: [g({ nxt, mark: { [curr]: 'cur', nL: 'dim', nR: 'dim' }, emark: { [`${curr}>${prev}`]: 'hit' } })], msg: `Save next = ${nxt === 'nR' ? 'null' : nxt.slice(1)} (so we don't lose the rest), then flip ${label}.next to point back at ${prev === 'nL' ? 'null' : prev.slice(1)}.` });
    prev = curr; curr = nxt;
    F.push({ panels: [g({ mark: { [prev]: 'ok', nL: 'dim', nR: 'dim' } })], msg: `Step forward: prev = ${prev.slice(1)}, curr = ${curr === 'nR' ? 'null' : curr.slice(1)}.` });
  }
  F.push({ panels: [g({ mark: { n1: 'hit', n2: 'hit', n3: 'hit', n4: 'hit', nL: 'dim', nR: 'dim' } })], msg: 'curr is null, so stop. prev (4) is the new head: 4→3→2→1. O(n) time, O(1) space.' });
  return F;
}

/* ---------- Trees: max depth (post-order) ---------- */
function maxDepth() {
  const T = { 3: [9, 20], 9: [null, null], 20: [15, 7], 15: [null, null], 7: [null, null] };
  const pos = { 3: [210, 28], 9: [110, 92], 20: [310, 92], 15: [255, 156], 7: [365, 156] };
  const nodes = Object.entries(pos).map(([id, [x, y]]) => ({ id, label: id, x, y }));
  const edges = [['3', '9'], ['3', '20'], ['20', '15'], ['20', '7']];
  const badge = {}, mark = {}, F = [];
  const snap = (msg) => F.push({ panels: [{ t: 'graph', w: 420, h: 196, nodes, edges, mark: { ...mark }, badge: { ...badge } }], msg });
  snap('Max depth: every node asks its children for THEIR depth, then returns 1 + max(left, right). A null child returns 0.');
  const dfs = (id) => {
    if (id == null) return 0;
    mark[id] = 'cur'; snap(`Visit ${id}. Ask its children first (post-order).`); mark[id] = 'win';
    const [l, r] = T[id];
    const dl = dfs(l), dr = dfs(r), d = 1 + Math.max(dl, dr);
    badge[id] = `d=${d}`; mark[id] = 'ok';
    snap(l == null && r == null ? `${id} is a leaf: 1 + max(0, 0) = 1. Return 1 to the parent.` : `${id}: 1 + max(${dl}, ${dr}) = ${d}. Return ${d} up.`);
    return d;
  };
  const ans = dfs(3);
  mark['3'] = 'hit'; snap(`Root returns ${ans}. Every node visited once: O(n). The same "ask children, combine, return" shape solves diameter, balanced tree and path sums.`);
  return F;
}

/* ---------- Heap: Kth largest with a size-k min-heap ---------- */
function kthLargest() {
  const nums = [3, 2, 1, 5, 6, 4], k = 2, h = [], F = [];
  const up = (i) => { while (i > 0) { const p = (i - 1) >> 1; if (h[p] <= h[i]) break; [h[p], h[i]] = [h[i], h[p]]; i = p; } };
  const down = (i) => { for (;;) { let m = i; const l = 2 * i + 1, r = l + 1; if (l < h.length && h[l] < h[m]) m = l; if (r < h.length && h[r] < h[m]) m = r; if (m === i) return; [h[m], h[i]] = [h[i], h[m]]; i = m; } };
  const tree = (mark = {}) => {
    const W = 260, nodes = h.map((v, i) => { const d = Math.floor(Math.log2(i + 1)), p = i - (2 ** d - 1); return { id: `h${i}`, label: v, x: ((p + 0.5) * W) / 2 ** d, y: 26 + d * 58 }; });
    const edges = h.slice(1).map((_, j) => [`h${(j) >> 1}`, `h${j + 1}`]);
    return { t: 'graph', w: W, h: 104, nodes, edges, mark };
  };
  const panels = (i, tm = {}, am = {}) => [arr('nums', nums, { idx: true, mark: i == null ? {} : { [i]: 'cur' } }), tree(tm), arr(`min-heap (size ≤ k = ${k}) as array`, [...h], { empty: 'empty', mark: am })];
  F.push({ panels: panels(), msg: `Kth largest (k = ${k}). Keep a MIN-heap of the k largest seen so far. Its top is the smallest of them, which is exactly the k-th largest.` });
  nums.forEach((x, i) => {
    h.push(x); up(h.length - 1);
    F.push({ panels: panels(i), msg: `Push ${x} and sift it up so the minimum stays on top.`, vars: [['size', h.length]] });
    if (h.length > k) {
      F.push({ panels: panels(i, { h0: 'bad' }, { 0: 'bad' }), msg: `Size ${h.length} > k, so pop the minimum ${h[0]}. It is smaller than k other numbers and can't be the answer.` });
      const last = h.pop(); if (h.length) { h[0] = last; down(0); }
    }
  });
  F.push({ panels: panels(null, { h0: 'hit' }, { 0: 'hit' }), msg: `The heap top ${h[0]} is the ${k}nd largest. O(n log k) time, O(k) memory. That matters for streams where n is huge.`, vars: [['answer', h[0]]] });
  return F;
}

/* ---------- Intervals: merge ---------- */
function mergeIntervals() {
  const iv = [[1, 3], [2, 6], [8, 10], [9, 12], [15, 18]], out = [], F = [];
  const panels = (cur, cls = 'cur', hit = -1) => [
    { t: 'iv', label: 'input (sorted by start)', min: 0, max: 19, items: iv.map(([s, e], i) => ({ s, e, cls: i === cur ? cls : i < cur ? 'dim' : '' })) },
    { t: 'iv', label: 'merged output', min: 0, max: 19, lane: true, items: out.map(([s, e], i) => ({ s, e, cls: i === hit ? 'hit' : 'ok' })) },
  ];
  F.push({ panels: panels(-1), msg: 'Sort by start first. Then one pass: does the next interval start before the last merged one ends?' });
  iv.forEach(([s, e], i) => {
    const last = out.at(-1);
    if (last && s <= last[1]) {
      const old = last[1]; last[1] = Math.max(last[1], e);
      F.push({ panels: panels(i, 'cur', out.length - 1), msg: `[${s},${e}] starts at ${s} ≤ ${old}, so it overlaps. Extend the end: [${last[0]},${last[1]}].` });
    } else {
      out.push([s, e]);
      F.push({ panels: panels(i, 'cur', out.length - 1), msg: last ? `[${s},${e}] starts at ${s} > ${last[1]}, so there's a gap. Start a new merged interval.` : `First interval [${s},${e}] opens the output.` });
    }
  });
  F.push({ panels: panels(iv.length), msg: `Result ${out.map(([a, b]) => `[${a},${b}]`).join(' ')}. O(n log n) for the sort plus O(n) for the pass.` });
  return F;
}

/* ---------- Graphs: Number of Islands (BFS flood fill) ---------- */
function islands() {
  const G = [[1, 1, 0, 0, 0], [1, 1, 0, 0, 1], [0, 0, 1, 0, 1], [0, 0, 0, 1, 1]];
  const R = G.length, C = G[0].length, seen = G.map((r) => r.map(() => null)), F = [], names = 'ABC';
  const panel = (mark = {}) => ({
    t: 'grid', label: '1 = land, 0 = water',
    cells: G.map((row, r) => row.map((v, c) => (seen[r][c] != null ? names[seen[r][c]] : v))),
    mark: { ...Object.fromEntries(G.flatMap((row, r) => row.map((v, c) => [`${r},${c}`, seen[r][c] != null ? `c${seen[r][c]}` : v ? '' : 'dim']))), ...mark },
  });
  let count = 0;
  F.push({ panels: [panel()], msg: 'Scan every cell. Unvisited land starts a new island; flood-fill it (BFS) so none of its cells is counted again.', vars: [['islands', 0]] });
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    if (!G[r][c] || seen[r][c] != null) continue;
    const id = count++, q = [[r, c]];
    seen[r][c] = id;
    F.push({ panels: [panel({ [`${r},${c}`]: 'cur' })], msg: `(${r},${c}) is unvisited land, so it's island ${names[id]}. count = ${count}. BFS from here.`, vars: [['islands', count]] });
    while (q.length) {
      const [x, y] = q.shift(), added = [];
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < R && ny < C && G[nx][ny] && seen[nx][ny] == null) { seen[nx][ny] = id; q.push([nx, ny]); added.push(`(${nx},${ny})`); }
      }
      if (added.length) F.push({ panels: [panel({ [`${x},${y}`]: 'cur' })], msg: `Pop (${x},${y}). Land neighbours ${added.join(' ')} get marked ${names[id]} and queued.`, vars: [['islands', count], ['queue', q.length]] });
    }
  }
  F.push({ panels: [panel()], msg: `Answer: ${count} islands. Each cell is visited once: O(R·C). Same idea: rotting oranges (multi-source BFS), max area, surrounded regions.`, vars: [['islands', count]] });
  return F;
}

/* ---------- Graphs: Dijkstra ---------- */
function dijkstra() {
  const pos = { A: [36, 88], B: [170, 28], C: [170, 148], D: [300, 88], E: [420, 88] };
  const nodes = Object.entries(pos).map(([id, [x, y]]) => ({ id, label: id, x, y }));
  const E = [['A', 'B', 4], ['A', 'C', 1], ['C', 'B', 2], ['B', 'D', 1], ['C', 'D', 5], ['D', 'E', 3]];
  const dist = { A: 0, B: Infinity, C: Infinity, D: Infinity, E: Infinity }, done = new Set(), F = [];
  let pq = [['A', 0]];
  const fmt = (d) => (d === Infinity ? '∞' : d);
  const snap = (msg, mark = {}, emark = {}) => F.push({
    panels: [
      { t: 'graph', w: 456, h: 176, directed: true, nodes, edges: E.map(([a, b, w]) => [a, b, w]), mark: { ...Object.fromEntries([...done].map((n) => [n, 'ok'])), ...mark }, emark, badge: Object.fromEntries(Object.entries(dist).map(([n, d]) => [n, `d=${fmt(d)}`])) },
      arr('min-heap (node:dist)', [...pq].sort((a, b) => a[1] - b[1]).map(([n, d]) => `${n}:${d}`), { empty: 'empty' }),
    ], msg,
  });
  snap('Shortest paths from A with weighted edges. Always expand the closest unsettled node (min-heap). Once popped, its distance is final.');
  while (pq.length) {
    pq.sort((a, b) => a[1] - b[1]);
    const [u, d] = pq.shift();
    if (done.has(u)) { snap(`Pop ${u}:${d}. It's stale (${u} is already settled at ${dist[u]}), so skip it.`, { [u]: 'dim' }); continue; }
    done.add(u);
    snap(`Pop ${u} at distance ${d}. Nothing closer is left, so ${u} is settled.`, { [u]: 'cur' });
    for (const [a, b, w] of E) {
      if (a !== u || done.has(b)) continue;
      if (d + w < dist[b]) {
        const old = dist[b]; dist[b] = d + w; pq.push([b, dist[b]]);
        snap(`Relax ${u}→${b}: ${d} + ${w} = ${d + w} < ${fmt(old)}. Update ${b} and push it.`, { [u]: 'cur', [b]: 'win' }, { [`${u}>${b}`]: 'hit' });
      } else snap(`${u}→${b}: ${d} + ${w} = ${d + w} is not better than ${dist[b]}, so keep ${dist[b]}.`, { [u]: 'cur' }, { [`${u}>${b}`]: 'bad' });
    }
  }
  snap(`Final: ${Object.entries(dist).map(([n, d]) => `${n}=${d}`).join(', ')}. O((V+E) log V). Network Delay Time is max(dist).`, Object.fromEntries(Object.keys(dist).map((n) => [n, 'hit'])));
  return F;
}

/* ---------- DP: LCS table ---------- */
function lcs() {
  const a = 'abcde', b = 'ace', m = a.length, n = b.length, F = [];
  const dp = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => (i === 0 || j === 0 ? 0 : null)));
  const panel = (mark = {}) => ({ t: 'grid', label: `dp[i][j] = LCS of "${a}"[0..i) and "${b}"[0..j)`, cells: dp.map((r) => r.map((v) => (v == null ? '' : v))), rows: ['∅', ...a], cols: ['∅', ...b], mark });
  F.push({ panels: [panel()], msg: 'dp[i][j] = LCS length of the first i chars of a and the first j chars of b. The empty row and column are 0.' });
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    if (a[i - 1] === b[j - 1]) {
      dp[i][j] = dp[i - 1][j - 1] + 1;
      F.push({ panels: [panel({ [`${i},${j}`]: 'cur', [`${i - 1},${j - 1}`]: 'hit' })], msg: `'${a[i - 1]}' = '${b[j - 1]}' match → diagonal + 1 = ${dp[i][j]}.`, vars: [['i', i], ['j', j]] });
    } else {
      const up = dp[i - 1][j], left = dp[i][j - 1];
      dp[i][j] = Math.max(up, left);
      F.push({ panels: [panel({ [`${i},${j}`]: 'cur', [up >= left ? `${i - 1},${j}` : `${i},${j - 1}`]: 'win' })], msg: `'${a[i - 1]}' ≠ '${b[j - 1]}' → max(up ${up}, left ${left}) = ${dp[i][j]}. Drop one char from either string.`, vars: [['i', i], ['j', j]] });
    }
  }
  const path = {}, out = [];
  for (let i = m, j = n; i > 0 && j > 0;) {
    if (a[i - 1] === b[j - 1]) { path[`${i},${j}`] = 'hit'; out.unshift(a[i - 1]); i--; j--; } else { path[`${i},${j}`] = 'ok'; dp[i - 1][j] >= dp[i][j - 1] ? i-- : j--; }
  }
  F.push({ panels: [panel(path)], msg: `Answer dp[${m}][${n}] = ${dp[m][n]}. Walking back from the corner along the diagonal matches spells "${out.join('')}". Edit Distance uses the same table shape.`, vars: [['LCS', out.join('')]] });
  return F;
}

/* ---------- Backtracking: Subsets decision tree ---------- */
function subsets() {
  const nums = [1, 2, 3], W = 480, F = [], shown = new Set(['']), results = [];
  const label = (path) => { const s = [...path].map((c, i) => (c === 'L' ? nums[i] : '')).join(''); return s || '∅'; };
  const all = [''];
  for (let d = 0; d < nums.length; d++) all.push(...all.filter((p) => p.length === d).flatMap((p) => [`${p}L`, `${p}R`]));
  const xy = (p) => { const d = p.length, k = parseInt([...p].map((c) => (c === 'L' ? 0 : 1)).join('') || '0', 2); return [((k + 0.5) * W) / 2 ** d, 24 + d * 60]; };
  const snap = (cur, msg) => {
    const nodes = all.filter((p) => shown.has(p)).map((p) => ({ id: p || 'root', label: label(p), x: xy(p)[0], y: xy(p)[1] }));
    const edges = all.filter((p) => p && shown.has(p)).map((p) => [p.slice(0, -1) || 'root', p, p.at(-1) === 'L' ? `+${nums[p.length - 1]}` : 'skip']);
    const mark = Object.fromEntries(nodes.map((nd) => [nd.id, nd.id.length === nums.length ? 'ok' : '']));
    mark[cur || 'root'] = 'cur';
    F.push({ panels: [{ t: 'graph', w: W, h: 230, nodes, edges, mark, small: true }, arr('results', results.map((r) => `{${r}}`), { empty: '[ ]' })], msg });
  };
  snap('', 'Subsets of [1,2,3]. At depth d, decide on nums[d]: TAKE it (left) or SKIP it (right). Every leaf is one subset.');
  const go = (p) => {
    if (p.length === nums.length) {
      results.push([...p].map((c, i) => (c === 'L' ? nums[i] : null)).filter((x) => x != null).join(','));
      snap(p, `Leaf: no numbers left, so record {${results.at(-1)}}. Return and undo the last choice.`);
      return;
    }
    for (const c of ['L', 'R']) {
      shown.add(p + c);
      snap(p + c, c === 'L' ? `Choose: take ${nums[p.length]} → path {${label(p + c)}}.` : `Un-choose ${nums[p.length]} and explore the skip branch.`);
      go(p + c);
    }
  };
  go('');
  snap('', `All ${results.length} = 2³ subsets found. The tree has depth n and 2ⁿ leaves, so this is O(n·2ⁿ). Permutations/combinations change only the branching rule.`);
  return F;
}

/* ---------- Greedy: Jump Game ---------- */
function jumpGame() {
  const F = [];
  const run = (a, tag) => {
    let far = 0;
    const row = (i, extra = {}) => arr(`${tag}: nums (max jump from each index)`, a, { idx: true, mark: { ...Object.fromEntries(a.map((_, x) => [x, x <= far ? 'win' : 'dim'])), ...(i == null ? {} : { [i]: 'cur' }), ...extra }, ptr: { [Math.min(far, a.length - 1)]: 'far' } });
    F.push({ panels: [row(null)], msg: `${tag} [${a}]: can we reach the last index? Track one number, far = the farthest index reachable so far.`, vars: [['far', far]] });
    for (let i = 0; i < a.length; i++) {
      if (i > far) { F.push({ panels: [row(null, { [i]: 'bad' })], msg: `Index ${i} > far = ${far}. We can never step here, so the answer is false. (nums[${far}] = ${a[far]} is the wall.)`, vars: [['far', far]] }); return; }
      const before = far; far = Math.max(far, i + a[i]);
      F.push({ panels: [row(i)], msg: `i = ${i}: from here we reach ${i} + ${a[i]} = ${i + a[i]}. far = max(${before}, ${i + a[i]}) = ${far}.`, vars: [['i', i], ['far', far]] });
      if (far >= a.length - 1) { F.push({ panels: [row(null, { [a.length - 1]: 'hit' })], msg: `far ≥ last index ${a.length - 1}, so the answer is true. One pass, O(n), no DP table.`, vars: [['far', far]] }); return; }
    }
  };
  run([2, 3, 1, 1, 4], 'Case 1');
  run([3, 2, 1, 0, 4], 'Case 2');
  return F;
}

/* ---------- Tries ---------- */
function trie() {
  const words = ['cat', 'car', 'dog'], F = [];
  const pos = { '': [200, 22], c: [120, 76], ca: [120, 130], cat: [70, 184], car: [170, 184], d: [290, 76], do: [290, 130], dog: [290, 184] };
  const exist = new Set(['']), end = new Set();
  const snap = (mark, msg) => F.push({
    panels: [{
      t: 'graph', w: 380, h: 214,
      nodes: [...exist].map((id) => ({ id: id || 'root', label: id ? id.at(-1) : '•', x: pos[id][0], y: pos[id][1] })),
      edges: [...exist].filter(Boolean).map((id) => [id.slice(0, -1) || 'root', id]),
      mark: { ...Object.fromEntries([...end].map((id) => [id, 'ok'])), ...mark },
      badge: Object.fromEntries([...end].map((id) => [id, 'end ★'])),
    }], msg,
  });
  snap({}, 'A trie: each edge is one character. Words that share a prefix share a path. ★ marks the end of a word.');
  for (const w of words) {
    let made = [];
    for (let i = 1; i <= w.length; i++) { const id = w.slice(0, i); if (!exist.has(id)) { exist.add(id); made.push(w[i - 1]); } }
    end.add(w);
    const mark = Object.fromEntries(range(1, w.length).map((i) => [w.slice(0, i), 'win']));
    snap({ ...mark, [w]: 'cur' }, made.length < w.length ? `insert("${w}"): walk the existing prefix "${w.slice(0, w.length - made.length)}", create ${made.map((c) => `'${c}'`).join(', ')}, mark ★.` : `insert("${w}"): create ${made.map((c) => `'${c}'`).join(' → ')}, mark the last node ★.`);
  }
  snap({ c: 'hit', ca: 'hit' }, 'startsWith("ca"): walk c → a. Both exist, so true. Cost is O(2) no matter how many words are stored.');
  snap({ c: 'hit', root: 'cur' }, 'search("cow"): c exists, but there is no "o" under c, so false. Search fails as soon as a character is missing.');
  snap({ do: 'bad', d: 'win' }, 'search("do"): the path exists but "o" has no ★, so false. That is the only difference between search() and startsWith().');
  return F;
}

/* ---------- Bits: XOR single number ---------- */
function xorSingle() {
  const nums = [4, 1, 2, 1, 2], F = [];
  const bits = (x) => [...x.toString(2).padStart(3, '0')].map(Number);
  let acc = 0;
  const grid = (x, res, mark = {}) => ({ t: 'grid', label: 'binary (4s · 2s · 1s)', rows: ['acc', '⊕ x', '= acc'], cols: ['4', '2', '1'], cells: [bits(acc), x == null ? ['', '', ''] : bits(x), res == null ? ['', '', ''] : bits(res)], mark });
  F.push({ panels: [arr('nums', nums, { idx: true }), grid(null, null)], msg: 'Every number appears twice except one. x ^ x = 0 and x ^ 0 = x, so XOR everything and the pairs cancel.', vars: [['acc', 0]] });
  nums.forEach((x, i) => {
    const res = acc ^ x, mark = {};
    bits(acc).forEach((b, c) => { if (b && bits(x)[c]) mark[`2,${c}`] = 'bad'; else if (bits(res)[c]) mark[`2,${c}`] = 'ok'; });
    F.push({ panels: [arr('nums', nums, { idx: true, mark: { [i]: 'cur' } }), grid(x, res, mark)], msg: `${acc} ^ ${x} = ${res}. ${Object.values(mark).includes('bad') ? 'Red bits were 1 in both and cancelled.' : 'No shared 1-bits, so nothing cancels yet.'}`, vars: [['acc', res]] });
    acc = res;
  });
  F.push({ panels: [arr('nums', nums, { idx: true, mark: { 0: 'hit' } }), grid(null, null, { '0,0': 'hit' })], msg: `acc = ${acc}. The pairs (1,1) and (2,2) cancelled, leaving the single number. O(n) time, O(1) space.`, vars: [['answer', acc]] });
  return F;
}

export const visuals = {
  twoSum: { title: 'Two Sum: one pass with a hashmap', build: twoSum },
  twoPointers: { title: 'Two Sum II: converging pointers', build: twoPointers },
  prefixSum: { title: 'Subarray Sum = K: prefix + hashmap', build: prefixSum },
  slidingWindow: { title: 'Longest substring without repeats', build: slidingWindow },
  koko: { title: 'Koko: binary search on the answer', build: koko },
  dailyTemps: { title: 'Daily Temperatures: monotonic stack', build: dailyTemps },
  reverseList: { title: 'Reverse a linked list', build: reverseList },
  maxDepth: { title: 'Max depth: post-order recursion', build: maxDepth },
  kthLargest: { title: 'Kth largest: size-k min-heap', build: kthLargest },
  mergeIntervals: { title: 'Merge intervals', build: mergeIntervals },
  islands: { title: 'Number of islands: BFS flood fill', build: islands },
  dijkstra: { title: 'Dijkstra: weighted shortest path', build: dijkstra },
  lcs: { title: 'LCS: filling the 2D DP table', build: lcs },
  subsets: { title: 'Subsets: choose / explore / un-choose', build: subsets },
  jumpGame: { title: 'Jump Game: greedy farthest reach', build: jumpGame },
  trie: { title: 'Trie: insert & prefix search', build: trie },
  xor: { title: 'Single Number: XOR cancels pairs', build: xorSingle },
};
