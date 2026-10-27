// Company intel. `hiring` list is a snapshot — re-check with the live LinkedIn links before applying.

export const motorq = {
  what: 'Connected-vehicle / telemetry data company. My Kafka + Databricks + time-series background maps directly to their product — lean on it in design rounds.',
  careers: 'https://motorq.com/careers/',
  linkedinPeople: 'https://www.linkedin.com/search/results/people/?keywords=motorq%20software%20engineer',
  loop: ['Online Assessment', 'DSA round', 'System Design (1–2 rounds)', 'CS fundamentals', 'CTO round'],
  loopNotes: [
    'Resume is discussed in every round.',
    'Process is fast — reported as days to a few weeks.',
    'Historically heavy on campus hiring, so for a lateral application a REFERRAL matters a lot. Find Motorq engineers on LinkedIn and ask.',
  ],
  questionTypes: [
    ['Monotonic stack', 'reported "difficult" implementation'],
    ['Graphs', ''],
    ['Dynamic programming', '"overlapping subsequences" → LCS family'],
    ['Binary search on answer', 'Koko Eating Bananas asked directly'],
    ['Heap / top-K', '"k max sums from two arrays, pick one element from each"'],
    ['Arrays + stack', 'one DSA round explicitly on these'],
    ['Greedy / matrix min-cost', 'OA: min spend to buy all item types across N shops'],
    ['SQL', 'database design, top-N and range queries'],
    ['Machine coding', 'build a parking system WITHOUT LLM help, then extend it level by level'],
    ['REST API design', 'take-home + dedicated round'],
    ['System design (event streaming)', 'speeding-alert pipeline; out-of-order vehicle readings with 10-min window'],
    ['Fundamentals', 'SQL vs NoSQL, consistency models + follow-ups, indexing, OS, DBMS, networking'],
  ],
  // What gets asked in each round, with direct practice links.
  rounds: [
    { round: 'Online Assessment', asked: [
      { q: 'Min spend to buy all item types across N shops (greedy / matrix min-cost)', practice: [['Minimum Path Sum', 'minimum-path-sum'], ['Path With Minimum Effort', 'path-with-minimum-effort']] },
      { q: 'K max sums from two arrays, one element from each (heap)', practice: [['Find K Pairs with Smallest Sums', 'find-k-pairs-with-smallest-sums']] },
      { q: 'Long CP-style statements with many edge cases', practice: [] },
    ]},
    { round: 'DSA rounds', asked: [
      { q: 'Monotonic stack — reported "very hard" implementation', practice: [['Largest Rectangle in Histogram', 'largest-rectangle-in-histogram'], ['Sum of Subarray Minimums', 'sum-of-subarray-minimums'], ['Remove K Digits', 'remove-k-digits']] },
      { q: 'Binary search on answer — Koko Eating Bananas asked directly', practice: [['Koko Eating Bananas', 'koko-eating-bananas'], ['Capacity To Ship Packages', 'capacity-to-ship-packages-within-d-days']] },
      { q: 'DP — "overlapping subsequences" (LCS family)', practice: [['Longest Common Subsequence', 'longest-common-subsequence'], ['Edit Distance', 'edit-distance'], ['Maximum Length of Repeated Subarray', 'maximum-length-of-repeated-subarray']] },
      { q: 'Graphs', practice: [['Number of Islands', 'number-of-islands'], ['Course Schedule II', 'course-schedule-ii'], ['Network Delay Time', 'network-delay-time']] },
      { q: 'Arrays + stack round; sliding window also reported (2025)', practice: [['Daily Temperatures', 'daily-temperatures'], ['Longest Substring Without Repeating Characters', 'longest-substring-without-repeating-characters']] },
    ]},
    { round: 'Machine coding / take-home', asked: [
      { q: 'Parking system WITHOUT LLM help, extended level by level (reported Bengaluru, Jun 2025)', practice: [] },
      { q: 'Backend assignment / REST API take-home + dedicated API design round', practice: [] },
    ]},
    { round: 'System design', asked: [
      { q: 'Speeding-alert pipeline for millions of vehicles', practice: [] },
      { q: 'Out-of-order vehicle readings from multiple queues, 10-min window, 95% on time', practice: [] },
    ]},
    { round: 'Fundamentals + SQL', asked: [
      { q: 'SQL vs NoSQL, consistency models + follow-ups, indexing, OS, DBMS, networking', practice: [] },
      { q: 'SQL: database design, top-N per group, range queries', practice: [['Department Top Three Salaries', 'department-top-three-salaries'], ['Nth Highest Salary', 'nth-highest-salary'], ['Rank Scores', 'rank-scores']] },
    ]},
    { round: 'CTO round', asked: [
      { q: 'Deep resume walkthrough — "did the job get done?" real-world orientation; why Motorq', practice: [] },
    ]},
  ],
  oa: 'Competitive-programming-flavoured, long statements, many edge cases. Read the statement twice and hand-check boundaries before submitting.',
  jdMatch: [
    { id: 'kafka', label: 'Kafka / streaming', ok: true },
    { id: 'langs', label: 'Go / Java / Python', ok: true },
    { id: 'ts', label: 'Time-series / telemetry via Databricks', ok: true },
    { id: 'ai', label: 'AI-assisted & agentic dev tools (hard filter most 2-yr candidates can\'t claim)', ok: true },
    { id: 'cloud', label: 'AWS / Azure / GCP — confirm my cloud story', ok: false },
    { id: 'dist', label: 'Distributed systems at scale — frame from Kafka experience', ok: false },
  ],
  priorities: [
    'Monotonic stack', 'Binary search on answer', 'Graphs', 'DP (LCS family)', 'Heap / top-K',
    'Machine coding in Java (parking lot → extend twice, timed)', 'The two telemetry system-design questions',
    'SQL (window functions, GROUP BY/HAVING, range queries, index reasoning)', 'Fundamentals',
  ],
  sources: [
    { name: 'Motorq interviews (Glassdoor, all roles)', url: 'https://www.glassdoor.sg/Interview/Motorq-Interview-Questions-E2477885.htm' },
    { name: 'Motorq Software Engineer (Glassdoor)', url: 'https://www.glassdoor.com/Interview/Motorq-Software-Engineer-Interview-Questions-EI_IE2477885.0,6_KO7,24.htm' },
    { name: 'MotorQ Interview Experience (GeeksforGeeks)', url: 'https://www.geeksforgeeks.org/interview-experiences/motorq-interview-experience-for-internship-on-campus/' },
    { name: 'Interview Experience with Motorq (Programming Pathshala)', url: 'https://programmingpathshala.medium.com/landing-my-dream-role-interview-experience-with-motorq-c27f212a8270' },
  ],
};

export const remoteIndiaGeneral = {
  summary: 'General pattern for this tier (Razorpay, Zomato, PhonePe, Postman, Hasura, Atlan, well-funded startups, etc.): LeetCode medium-heavy DSA (1–2 rounds), a machine-coding / LLD round (60–90 min build), a system design / HLD round, and a hiring-manager + culture round. LLD tends to carry more weight than HLD at the 2–3 yr level in India.',
  research: [
    { name: 'Glassdoor Interviews', url: 'https://www.glassdoor.co.in/Interview/index.htm' },
    { name: 'AmbitionBox Interviews', url: 'https://www.ambitionbox.com/interviews' },
    { name: 'LeetCode Discuss (company tag)', url: 'https://leetcode.com/discuss/interview-question' },
    { name: 'GeeksforGeeks Interview Experiences', url: 'https://www.geeksforgeeks.org/tag/interview-experiences/' },
  ],
};

// Live LinkedIn searches: f_WT=2 = Remote, f_TPR=r604800 = posted in past week, location India.
const li = (kw) => `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(kw)}&location=India&f_WT=2&f_TPR=r604800`;
export const linkedinSearches = [
  { name: 'Backend Engineer — Remote, India, past week', url: li('backend engineer') },
  { name: 'SDE 2 — Remote, India, past week', url: li('SDE 2') },
  { name: 'Software Engineer Kafka — Remote, India', url: li('software engineer kafka') },
  { name: 'Data / Streaming Engineer — Remote, India', url: li('streaming data engineer') },
  { name: 'Golang Engineer — Remote, India', url: li('golang engineer') },
  { name: 'Java Backend — Remote, India', url: li('java backend engineer') },
];

export const hiringSnapshotDate = '2026-10-27';

// Specific openings found via web research on the snapshot date. `fit`: 'match' = fits ~2.5 yrs, 'stretch' = asks for more.
export const openings = [
  { role: 'Backend Engineer (0→1 startup team)', company: 'Weekday partner network', exp: '1–3 yrs', pay: '₹15–30 LPA', model: 'Fully remote, India', fit: 'match', seen: 'Oct 2026', url: 'https://www.weekday.works/jobs/backend-developer-jobs-in-india-remote' },
  { role: 'SDE-2 Backend Engineer', company: 'Weekday partnered company', exp: '2+ yrs', pay: '₹35–40 LPA', model: 'Fully remote, India', fit: 'match', seen: 'Oct 2026', url: 'https://jobs.weekday.works/weekday-partnered-company-sde-2-backend-engineer-mg9kvd' },
  { role: 'Backend Engineer (startup)', company: 'Weekday partner network', exp: '1–5 yrs', pay: '₹20–40 LPA', model: 'Remote, India', fit: 'match', seen: 'Oct 2026', url: 'https://jobs.weekday.works/weekday-partner-network-backend-engineer-b4jkk6' },
  { role: 'Software Engineer (Remote)', company: 'Akamai', exp: '~1 yr + Linux dev', pay: '—', model: 'India (Remote), Bengaluru', fit: 'match', seen: '21 Oct 2026', url: 'https://jobcode.in/akamai-hiring-remote-software-engineer-in-india-2026-apply-now/' },
  { role: 'Backend Engineer', company: 'Drivetrain', exp: '—', pay: '—', model: 'Remote — Full Time, India', fit: 'match', seen: 'Oct 2026', url: 'https://jobs.lever.co/drivetrain?location=India' },
  { role: 'SDE-2 Backend', company: 'AI Squared', exp: 'SDE-2', pay: '—', model: 'Distributed team, India', fit: 'match', seen: 'Oct 2026', url: 'https://job-boards.greenhouse.io/aisquared/jobs/4422754006' },
  { role: 'Software Engineer II (Python/FastAPI)', company: 'SaaS ad platform (via Virtual Vocations)', exp: '2–5 yrs', pay: '—', model: 'Remote', fit: 'match', seen: 'Jul–Oct 2026', url: 'https://www.virtualvocations.com/job/software-engineer-3158826-i.html' },
  { role: 'SDE-2 Backend (Java/Python)', company: 'Hyrecraft (SaaS/fintech client)', exp: '3–5 yrs', pay: '—', model: 'Remote', fit: 'stretch', seen: 'Sep 2026', url: 'https://torre.ai/post/OwbloPgr-hyrecraft-sde-2-backend-engineer' },
  { role: 'Sr. Backend Engineer', company: 'Weekday partner network', exp: '4–7 yrs', pay: '₹30–55 LPA', model: 'Fully remote, India', fit: 'stretch', seen: 'Oct 2026', url: 'https://www.weekday.works/jobs/remote-backend-developer-jobs-4' },
  { role: 'Senior Java Backend (Spring Boot, GCP)', company: 'Xformics Inc', exp: '5–9 yrs', pay: '—', model: 'Remote, India', fit: 'stretch', seen: '15 Oct 2026', url: 'https://www.weekday.works/jobs/remote-backend-developer-jobs-14' },
  { role: 'Principal Backend Engineer (Go)', company: 'Mirantis', exp: 'Principal', pay: '—', model: 'Remote, India', fit: 'stretch', seen: 'Oct 2026', url: 'https://jobgether.com/remote-jobs/india/software-engineer' },
];

// Search ATS boards directly — roles appear here before LinkedIn.
const g = (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}&tbs=qdr:w`;
export const atsSearches = [
  { name: 'Greenhouse — Remote India backend (past week)', url: g('site:job-boards.greenhouse.io "India" remote backend engineer') },
  { name: 'Lever — Remote India backend (past week)', url: g('site:jobs.lever.co "India" remote backend engineer') },
  { name: 'Ashby — Remote India engineer (past week)', url: g('site:jobs.ashbyhq.com "India" remote software engineer') },
  { name: 'Weekday — 1,000+ remote backend roles India', url: 'https://www.weekday.works/jobs/backend-developer-jobs-in-india-remote' },
  { name: 'startup.jobs — Backend', url: 'https://startup.jobs/backend-jobs' },
];

// workModel: Remote = remote-first / remote India roles listed; Hybrid = mostly office-linked, sometimes remote roles.
export const hiringNow = [
  { name: 'Motorq', workModel: 'Hybrid / some remote', fit: 'Primary target — telemetry + Kafka', url: 'https://motorq.com/careers/' },
  { name: 'Confluent', workModel: 'Remote (India)', fit: 'Kafka company — your strongest story', url: 'https://careers.confluent.io/' },
  { name: 'Databricks', workModel: 'Hybrid (Bengaluru)', fit: 'Databricks experience maps directly', url: 'https://www.databricks.com/company/careers' },
  { name: 'Akamai', workModel: 'Remote (India) — SWE role posted Oct 2026', fit: 'Distributed systems, Linux', url: 'https://www.akamai.com/careers' },
  { name: 'GitLab', workModel: 'All-remote', fit: 'Go / Ruby backend', url: 'https://about.gitlab.com/jobs/' },
  { name: 'Canonical', workModel: 'Remote', fit: 'Go / Python, infra', url: 'https://canonical.com/careers' },
  { name: 'Grafana Labs', workModel: 'Remote', fit: 'Go, observability, time-series', url: 'https://grafana.com/about/careers/' },
  { name: 'Elastic', workModel: 'Distributed / remote', fit: 'Java, search, observability', url: 'https://www.elastic.co/careers' },
  { name: 'Atlassian', workModel: 'Team Anywhere (remote in India)', fit: 'Java backend, scale', url: 'https://www.atlassian.com/company/careers' },
  { name: 'Coinbase', workModel: 'Remote-first', fit: 'Go backend, high bar', url: 'https://www.coinbase.com/careers' },
  { name: 'Mirantis', workModel: 'Remote (India) — Go backend roles listed', fit: 'Go, Kubernetes', url: 'https://www.mirantis.com/company/careers/' },
  { name: 'Supabase', workModel: 'Fully remote', fit: 'Postgres, TypeScript, Go', url: 'https://supabase.com/careers' },
  { name: 'Hasura', workModel: 'Remote-friendly', fit: 'GraphQL, Go/Rust/Haskell', url: 'https://hasura.io/careers' },
  { name: 'Atlan', workModel: 'Remote-first', fit: 'Data platform — Databricks/Kafka story fits', url: 'https://atlan.com/careers/' },
  { name: 'Postman', workModel: 'Hybrid / some remote', fit: 'API platform, JS/Node', url: 'https://www.postman.com/company/careers/' },
  { name: 'Razorpay', workModel: 'Hybrid', fit: 'Fintech, Go/Java, strong LLD round', url: 'https://razorpay.com/jobs/' },
  { name: 'AI Squared', workModel: 'Distributed — SDE-2 Backend open to India', fit: 'Backend, AI platform', url: 'https://job-boards.greenhouse.io/aisquared' },
];

export const remoteJobBoards = [
  { name: 'Wellfound (AngelList) — India startups', url: 'https://wellfound.com/role/l/software-engineer/india' },
  { name: 'Arc.dev — Remote jobs India', url: 'https://arc.dev/en-in/remote-jobs' },
  { name: 'Remote Rocketship — India', url: 'https://www.remoterocketship.com/country/india/jobs/senior-software-engineer/' },
  { name: 'Jobgether — Remote India SWE', url: 'https://jobgether.com/remote-jobs/india/software-engineer' },
  { name: 'Weekday — curated startup roles', url: 'https://jobs.weekday.works/' },
  { name: 'Instahyre', url: 'https://www.instahyre.com/' },
  { name: 'Cutshort', url: 'https://cutshort.io/' },
  { name: 'Hirist', url: 'https://www.hirist.tech/' },
];
