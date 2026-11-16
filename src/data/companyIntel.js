// Company box on the Analyse page: Motorq first, then remote-first companies that hire
// ~2-year backend engineers (Kafka / Go / Java / Python / Databricks) in India.
// Curated from Glassdoor, LeetCode Discuss, Taro, Interview Query and company hiring pages
// (Glassdoor can't be scraped live, so this is a snapshot). `lc` = LeetCode company-tag data
// from github.com/liquidslr/leetcode-company-wise-problems (updated Oct 2025): how many
// tagged questions, the difficulty split, the most frequent topics and the most-asked problems.
import { focusCompanies } from './learn';
import { motorq } from './companies';

const focus = Object.fromEntries(focusCompanies.map((c) => [c.id, c]));
export const INTEL_DATE = 'Nov 2026';

const intel = [
  {
    id: 'motorq', name: 'Motorq', workModel: 'Hybrid / some remote', primary: true,
    fit: 'Primary target. Kafka + telemetry + Databricks is exactly their stack.',
    process: motorq.loop,
    types: ['Competitive-style OA with long statements and edge cases', 'DSA: monotonic stack, binary search on answer, DP, graphs, heap', 'Machine coding in Java (parking system, extended twice, no LLM)', 'Telemetry system design (alerts pipeline, out-of-order readings)', 'SQL + OS / DBMS / networking fundamentals', 'CTO resume deep-dive: "did the job get done?"'],
    priorities: motorq.priorities,
    sources: motorq.sources,
  },
  {
    id: 'confluent', name: 'Confluent', workModel: 'Remote (India)',
    fit: 'The Kafka company. Your Kafka work is the strongest story you have anywhere.',
    process: ['Recruiter', 'Coding', 'Coding', 'System design (distributed KV)', 'Values / behavioral'],
    types: ['Medium–hard DSA, design-flavoured (LRU, time-based KV)', 'Backtracking / matrix (Sudoku)', 'Distributed KV store: replication, partitioning, consensus', 'Kafka internals: ISR, compaction, exactly-once'],
    lc: { n: 9, diff: { E: 0, M: 6, H: 3 }, topics: [['Hash Table', 5], ['Array', 4], ['Design', 3], ['Matrix', 2], ['Backtracking', 2], ['Linked List', 2], ['Binary Search', 2]],
      top: [['Valid Sudoku', 'valid-sudoku', 'M'], ['LRU Cache', 'lru-cache', 'M'], ['Time Based Key-Value Store', 'time-based-key-value-store', 'M'], ['Sudoku Solver', 'sudoku-solver', 'H'], ['Design Authentication Manager', 'design-authentication-manager', 'M'], ['Combination Sum', 'combination-sum', 'M']] },
  },
  {
    id: 'atlassian', name: 'Atlassian', workModel: 'Team Anywhere (remote in India)',
    fit: 'Java backend at scale. Every round eliminates, so prepare Code Design specifically.',
    process: ['Karat screen', 'Code Design (runnable + tests)', 'DSA', 'System design', 'Values'],
    types: ['Code Design: classes under given signatures (Snake Game, voting)', 'Medium DSA: hashing, sorting, intervals, heaps', 'System design: tagging / feed, APIs, pagination', 'Values round mapped to Atlassian values (STAR)'],
    lc: { n: 57, diff: { E: 5, M: 37, H: 15 }, topics: [['Array', 38], ['Hash Table', 24], ['String', 17], ['Sorting', 11], ['Dynamic Programming', 10], ['Design', 9], ['Depth-First Search', 8], ['Greedy', 8]],
      top: [['Rank Teams by Votes', 'rank-teams-by-votes', 'M'], ['Stock Price Fluctuation', 'stock-price-fluctuation', 'M'], ['All O`one Data Structure', 'all-oone-data-structure', 'H'], ['Design Snake Game', 'design-snake-game', 'M'], ['Merge Intervals', 'merge-intervals', 'M'], ['Meeting Rooms II', 'meeting-rooms-ii', 'M'], ['Lowest Common Ancestor of a Binary Tree', 'lowest-common-ancestor-of-a-binary-tree', 'M'], ['High-Access Employees', 'high-access-employees', 'M']] },
  },
  {
    id: 'coinbase', name: 'Coinbase', workModel: 'Remote-first',
    fit: 'Go backend with a high bar. Their coding is practical, close to production code.',
    process: ['Recruiter', 'CodeSignal OA (long)', 'Live coding screen', 'Onsite: coding · practical coding · system design · behavioral'],
    types: ['Design-a-class problems (bank system, file system, KV store)', 'Multi-part practical coding that grows each step', 'System design with money: idempotency, ledgers, consistency', 'Behavioral against Coinbase cultural tenets'],
    lc: { n: 11, diff: { E: 2, M: 8, H: 1 }, topics: [['Design', 6], ['Array', 5], ['Hash Table', 5], ['String', 5], ['Binary Search', 2], ['Queue', 2], ['Trie', 2]],
      top: [['Simple Bank System', 'simple-bank-system', 'M'], ['Time Based Key-Value Store', 'time-based-key-value-store', 'M'], ['Zigzag Iterator', 'zigzag-iterator', 'M'], ['Design File System', 'design-file-system', 'M'], ['Design In-Memory File System', 'design-in-memory-file-system', 'H'], ['Random Pick with Weight', 'random-pick-with-weight', 'M']] },
    sources: [
      { name: 'Coinbase interview process (Exponent)', url: 'https://www.tryexponent.com/blog/coinbase-interview-process' },
      { name: 'Coinbase SWE guide (Interview Query)', url: 'https://www.interviewquery.com/guides/coinbase-software-engineer' },
    ],
  },
  {
    id: 'akamai', name: 'Akamai', workModel: 'Remote (India)',
    fit: 'Distributed systems and Linux. DSA bar is moderate; fundamentals matter more.',
    process: ['Recruiter (often via Naukri)', 'Technical 1: DSA + resume', 'Technical 2: HLD + domain', 'HR / behavioral'],
    types: ['One LeetCode-variation DSA per round, Easy–Medium', 'Networking: HTTPS, TCP vs UDP, DNS, CDN caching', 'Security basics on security teams: hashing, TLS, crypto', 'OS, Docker → Kubernetes, resume deep-dive'],
    lc: { n: 15, diff: { E: 8, M: 7, H: 0 }, topics: [['Array', 8], ['Hash Table', 6], ['String', 4], ['Dynamic Programming', 3], ['Math', 2], ['Sliding Window', 2], ['Prefix Sum', 1]],
      top: [['Contiguous Array', 'contiguous-array', 'M'], ['Best Time to Buy and Sell Stock', 'best-time-to-buy-and-sell-stock', 'E'], ['Unique Paths', 'unique-paths', 'M'], ['Spiral Matrix', 'spiral-matrix', 'M'], ['First Unique Character in a String', 'first-unique-character-in-a-string', 'E'], ['Two Sum', 'two-sum', 'E']] },
    sources: [{ name: 'Akamai India SWE experiences (Taro)', url: 'https://www.jointaro.com/interviews/companies/akamai-technologies/experiences/software-engineer-india-october-16-2025-declined-offer-positive-c2c421e4' }],
  },
  {
    id: 'grafana', name: 'Grafana Labs', workModel: 'Fully remote',
    fit: 'Go + observability + time-series. Your telemetry work maps straight onto it.',
    process: ['Recruiter', 'Hiring manager (45 min)', 'Practical exercise (take-home + pairing)', 'Non-abstract system design (60 min)'],
    types: ['No trick puzzles: a realistic Go task, then pair on extending it', 'System design on real constraints (metrics ingestion, storage)', 'Remote-collaboration and async-writing questions'],
    patterns: [{ p: 'arrays-hashing', why: 'Everyday data handling in the practical task.' }, { p: 'heap', why: 'Top-K / merging time-series streams.' }, { p: 'sliding-window', why: 'Rate and window aggregation over metrics.' }],
    sources: [
      { name: 'Inside Grafana Labs’ hiring process for backend engineers', url: 'https://grafana.com/blog/inside-grafana-labs-hiring-process-for-backend-engineers/' },
      { name: 'Interviewing at Grafana Labs', url: 'https://grafana.com/careers/interviewing/' },
    ],
  },
  {
    id: 'elastic', name: 'Elastic', workModel: 'Distributed / remote',
    fit: 'Java, search and observability. Practical coding and PR review over puzzles.',
    process: ['Recruiter', 'Engineering manager', 'Coding (live or take-home / PR review)', 'System design', 'Hiring manager wrap-up'],
    types: ['Practical coding in Java, sometimes a live PR review', 'System design: search, indexing, log ingestion', 'Very selective in India: expect Medium DSA done cleanly'],
    patterns: [{ p: 'arrays-hashing', why: 'Practical coding staple.' }, { p: 'linked-list', why: 'Reported in India coding rounds.', reported: true }, { p: 'tries', why: 'Search / prefix problems fit the domain.' }],
    sources: [
      { name: 'How we hire (Elastic)', url: 'https://www.elastic.co/careers/how-we-hire' },
      { name: 'Elastic SWE guide (Interview Query)', url: 'https://www.interviewquery.com/guides/elastic-software-engineer' },
    ],
  },
  {
    id: 'gitlab', name: 'GitLab', workModel: 'All-remote',
    fit: 'No algorithm puzzles. You are judged on a real PR and how you review code.',
    process: ['Take-home PR', '90-min technical review of your PR', 'Behavioral', 'Manager'],
    types: ['Production-quality PR with tests and clear commits', 'Defending trade-offs; reviewing someone else’s code', 'Values (CREDIT) behavioral questions'],
  },
  {
    id: 'atlan', name: 'Atlan', workModel: 'Remote-first',
    fit: 'Data platform; your Databricks and Kafka story fits. Culture round really filters.',
    process: ['HackerRank coding test', 'Take-home assignment', 'HLD + DSA + fundamentals', 'Culture / HR'],
    types: ['Backend-focused coding test', 'Take-home: build a small service; expect "what if the API goes down?"', 'HLD of a data / metadata pipeline', 'Culture-fit round (people do get rejected here)'],
    patterns: [{ p: 'arrays-hashing', why: 'Coding test staple.' }, { p: 'graphs', why: 'Data lineage is a graph problem.' }, { p: 'trees', why: 'Metadata hierarchies.' }],
    sources: [{ name: 'Atlan interviews (Glassdoor)', url: 'https://www.glassdoor.co.in/Interview/Atlan-Interview-E1028768-RVW67768940.htm' }],
  },
];

export const companyIntel = intel.map((c) => {
  const f = focus[c.id];
  return { ...c, patterns: c.patterns || f?.patterns || [], beyond: f?.beyond || [], sources: c.sources || f?.links || [] };
});
