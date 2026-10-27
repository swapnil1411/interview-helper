// Learn Scroll content. Every YouTube video/playlist ID below was verified via YouTube oEmbed on 2026-10-27.
// v = video { id, t (title), by }, pl = playlist { list, t, by }. Blogs found via web search on the same date.

const v = (id, t, by = 'NeetCode') => ({ id, t, by });
const pl = (list, t, by) => ({ list, t, by });

export const redditSearch = (q, sub = 'leetcode') =>
  `https://www.reddit.com/r/${sub}/search/?q=${encodeURIComponent(q)}`;

// Shared playlists
const AV = (list, t) => pl(list, t, 'Aditya Verma');
const TUF = (list, t) => pl(list, t, 'Striver · takeUforward');
const NC = (list, t) => pl(list, t, 'NeetCode');

export const learn = {
  'arrays-hashing': {
    idea: 'Trade memory for time: remember what you have seen in a hashmap so each question ("have I seen target − x?") is O(1).',
    visuals: ['twoSum'],
    videos: [v('KLlXCFG5TnA', 'Two Sum — the hashmap trick'), v('YPTqKIgVk-k', 'Top K Frequent Elements — counting + buckets')],
    playlists: [],
    blogs: [
      { name: '15 LeetCode patterns (AlgoMaster)', url: 'https://blog.algomaster.io/p/15-leetcode-patterns', note: 'Short explanation + template per pattern' },
      { name: '14 Patterns to Ace Any Coding Interview (HackerNoon)', url: 'https://hackernoon.com/14-patterns-to-ace-any-coding-interview-question-c5bb3357f6ed', note: 'The classic Grokking-style pattern list' },
    ],
  },
  'two-pointers': {
    idea: 'On sorted data, one pointer at each end. The sum is too big? Only moving the right pointer can make it smaller, so every step discards one candidate forever.',
    visuals: ['twoPointers'],
    videos: [v('jzZsG8n2R9A', '3Sum — sort + two pointers'), v('xo7XrRVxH8Y', '8 patterns to solve 80% of LeetCode problems', 'Sahil & Sarra')],
    playlists: [],
    blogs: [
      { name: 'The "Two Pointers" cheat sheet — 25+ problems (LeetCode Discuss)', url: 'https://leetcode.com/discuss/post/7350824/', note: 'Opposite-direction vs same-direction variants with templates' },
      { name: 'After 1000 mediums: sliding window & 2-pointer patterns (Medium)', url: 'https://iorilan.medium.com/after-solved-1000-medium-leetcode-found-these-patterns-sliding-window-2-pointer-string-18332ca4861' },
    ],
  },
  'prefix-sum': {
    idea: 'sum(i..j) = prefix[j] − prefix[i−1]. Store how often each prefix value has appeared; "subarrays summing to k" becomes "how many earlier prefixes equal running − k".',
    visuals: ['prefixSum'],
    videos: [v('fFVZt-6sgyo', 'Subarray Sum Equals K — prefix sum + hashmap')],
    playlists: [],
    blogs: [
      { name: 'Prefix sum for beginners — intuition to patterns (DEV)', url: 'https://dev.to/alex_hunter_44f4c9ed6671e/prefix-sum-technique-on-leetcode-for-beginners-from-intuition-to-patterns-98c', note: 'Covers the {0:1} seed and off-by-one pitfalls' },
      { name: '20 DSA patterns (AlgoMaster)', url: 'https://blog.algomaster.io/p/20-dsa-patterns', note: 'Prefix-sum template + when to use it' },
    ],
  },
  'sliding-window': {
    idea: 'Grow the window with the right pointer. When it breaks the rule, shrink from the left until it is valid again. Each element enters and leaves at most once, so it is O(n).',
    visuals: ['slidingWindow'],
    videos: [v('wiGpQwVHdE0', 'Longest Substring Without Repeating Characters')],
    playlists: [NC('PLot-Xpze53leOBgcVsJBEGrHPd_7x_koV', 'Sliding Window'), AV('PL_z_8CaSLPWeM8BDJmIYDaoQ5zuwyxnfj', 'Sliding Window (fixed + variable, Hindi)')],
    blogs: [
      { name: 'Sliding window framework (labuladong)', url: 'https://labuladong.gitbook.io/algo-en/algorithmic-thinking/sliding-window', note: 'One template for every substring problem' },
      { name: 'Sliding window template notes (GitHub)', url: 'https://github.com/redpanda321/coding-interview-guide/blob/master/Templates/sliding_window.md', note: 'Links the famous "10-line template" LeetCode post' },
      { name: 'Sliding window & 2-pointer patterns after 1000 problems (Medium)', url: 'https://iorilan.medium.com/after-solved-1000-medium-leetcode-found-these-patterns-sliding-window-2-pointer-string-18332ca4861' },
    ],
  },
  'binary-search': {
    idea: 'Binary search works on any monotonic yes/no question, not just arrays. "Can Koko finish at speed s?" is false…false,true…true, so binary search for the first true.',
    visuals: ['koko'],
    videos: [v('U2SozAs9RzA', 'Koko Eating Bananas — binary search on answer'), v('GU7DpgHINWQ', 'Binary search tutorial — the invariant view', 'Errichto')],
    playlists: [AV('PL_z_8CaSLPWeYfhtuKHj-9MpYb6XQJ_f2', 'Binary Search (Hindi)'), TUF('PLgUwDviBIf0pMFMWuuvDNMAkoQFi-h0ZF', 'Binary Search series'), NC('PLot-Xpze53leNZQd0iINpD-MAhMOMzWvO', 'Binary Search')],
    blogs: [
      { name: 'Powerful Ultimate Binary Search Template (LeetCode Discuss)', url: 'https://leetcode.com/discuss/study-guide/786126/python-powerful-ultimate-binary-search-template', note: 'One template, many Hards: the "minimal k such that condition(k)" framing' },
      { name: 'Ultimate Binary Search — study guide (LeetCode Discuss)', url: 'https://leetcode.com/discuss/study-guide/2088575/ultimate-binary-search-gone' },
    ],
  },
  stack: {
    idea: 'Keep a stack whose values only decrease from bottom to top. A new bigger element pops everything smaller, and each pop answers "next greater element" for the popped index.',
    visuals: ['dailyTemps'],
    videos: [v('cTBiBSnjO3c', 'Daily Temperatures — monotonic stack'), v('zx5Sw9130L0', 'Largest Rectangle in Histogram')],
    playlists: [AV('PL_z_8CaSLPWdeOezg68SKkeLN4-T_jNHd', 'Stack (NGE / NSL / histogram, Hindi)'), TUF('PLgUwDviBIf0pOd5zvVVSzgpo6BaCpHT9c', 'Stack & Queue'), NC('PLot-Xpze53lfxD6l5pAGvCD4nPvWKU8Qo', 'Stack')],
    blogs: [
      { name: 'A comprehensive guide to monotonic stack (LeetCode Discuss)', url: 'https://leetcode.com/discuss/study-guide/2347639/', note: 'Next greater/smaller, previous greater/smaller, with problems' },
      { name: 'Templates for monotonic stacks & queues (LeetCode Discuss)', url: 'https://leetcode.com/discuss/study-guide/5085517/' },
      { name: 'Monotonic stack study summary (LeetCode Discuss)', url: 'https://leetcode.com/discuss/study-guide/2703748/' },
    ],
  },
  'linked-list': {
    idea: 'Draw the boxes. Reversal is three pointers: save next, flip curr.next to prev, then step both forward. A dummy head removes the head edge cases, and fast/slow pointers find the middle or a cycle.',
    visuals: ['reverseList'],
    videos: [v('G0_I-ZF0S38', 'Reverse Linked List — iterative + recursive')],
    playlists: [TUF('PLgUwDviBIf0rAuz8tVcM0AymmhTRsfaLU', 'Linked List series'), NC('PLot-Xpze53leU0Ec0VkBhnf4npMRFiNcB', 'Linked List')],
    blogs: [
      { name: 'Linked list patterns — reverse, merge, cycle, fast/slow, dummy node', url: 'https://www.techinterview.org/post/3233474169/coding-interview-linked-list-patterns-reverse-merge-cycle-detection-fast-slow-pointer-dummy-node-techniques/' },
      { name: 'Hacking the top linked list problems (Dev Genius)', url: 'https://blog.devgenius.io/linked-lists-tips-and-tricks-be168213d3d5' },
    ],
  },
  trees: {
    idea: 'Each node asks its children for an answer, combines them, and returns one value up (post-order). Use BFS with a queue when the question says "level".',
    visuals: ['maxDepth'],
    videos: [v('hTM3phVI6YQ', 'Maximum Depth of Binary Tree — 3 ways'), v('6ZnyEApgFYg', 'Level Order Traversal — BFS'), v('fAAZixBzIAI', 'Binary tree algorithms (full course)', 'freeCodeCamp')],
    playlists: [pl('PLkjdNRgDmcc0Pom5erUBU4ZayeU9AyRRu', 'Tree series (Striver)', 'takeUforward'), NC('PLot-Xpze53ldg4pN6PfzoJY7KsKcxF1jg', 'Trees')],
    blogs: [
      { name: 'Tree question patterns — study guide (LeetCode Discuss)', url: 'https://leetcode.com/discuss/study-guide/2879240/tree-question-pattern-2023-tree-study-guide', note: 'Problems grouped: root-to-leaf, ancestors, views, serialization' },
      { name: 'Tree data structure patterns with questions (LeetCode Discuss)', url: 'https://leetcode.com/discuss/study-guide/3743769/Crack-Easily-Any-Interview-or-Tree-Data-Structure-Patterns-With-Questions/' },
    ],
  },
  heap: {
    idea: 'For top-K, keep a MIN-heap of size k. Anything smaller than the heap top cannot be in the top k, so pop it. At the end the heap top is the k-th largest. Each step costs O(log k).',
    visuals: ['kthLargest'],
    videos: [v('itmhHWaHupI', 'Find Median from Data Stream — two heaps'), v('YPTqKIgVk-k', 'Top K Frequent Elements')],
    playlists: [AV('PL_z_8CaSLPWdtY9W22VjnPxG30CXNZpI9', 'Heap — identification + top-K family (Hindi)')],
    blogs: [
      { name: 'Master Heap — 23 questions in 4 patterns (LeetCode Discuss)', url: 'https://leetcode.com/discuss/general-discussion/1127238/master-heap-by-solving-23-questions-in-4-patterns-category', note: 'Top-K · Merge-K-sorted · Two heaps · Min-number' },
    ],
  },
  intervals: {
    idea: 'Sort by start. Walk left to right: if the next interval starts before the current one ends, extend the end; otherwise close the current interval and start a new one.',
    visuals: ['mergeIntervals'],
    videos: [v('44H3cEC2fFM', 'Merge Intervals')],
    playlists: [],
    blogs: [
      { name: 'Interval algorithm patterns for interviews', url: 'https://www.techinterview.org/post/3233467664/interval-merge-patterns/', note: 'Merge, insert, intersection, meeting rooms, sweep line' },
      { name: 'Interval coding pattern (Medium)', url: 'https://dilipkumar.medium.com/interval-coding-pattern-068c36197cf5' },
      { name: 'Overlapping intervals (AlgoMaster)', url: 'https://blog.algomaster.io/p/812e72f7-eced-4256-a4c1-00606ae50679' },
    ],
  },
  graphs: {
    idea: 'Choose the traversal by what you need. Flood fill (DFS/BFS) counts components, BFS gives the shortest path when edges are unweighted, Dijkstra (min-heap) handles weighted edges, and topological sort handles dependencies.',
    visuals: ['islands', 'dijkstra'],
    videos: [v('pV2kpPD66nE', 'Number of Islands — flood fill'), v('EgI5nU9etnU', 'Course Schedule — cycle detection / topo sort'), v('EaphyqKU4PQ', 'Network Delay Time — Dijkstra'), v('XB4MIexjvY0', 'Dijkstra algorithm explained', 'Abdul Bari'), v('tWVWeAqZ0WU', 'Graph algorithms for interviews (full course)', 'freeCodeCamp')],
    playlists: [TUF('PLgUwDviBIf0oE3gA41TKO2H5bHpPd7fzn', 'Graph series'), pl('PLDV1Zeh2NRsDGO4--qE8yH72HFL1Km93P', 'Graph Theory (animated)', 'William Fiset'), NC('PLot-Xpze53ldBT_7QA8NVot219jFNr_GI', 'Graphs')],
    blogs: [
      { name: 'Graph For Beginners — problems, pattern, sample solutions (LeetCode Discuss)', url: 'https://leetcode.com/discuss/general-discussion/655708/Graph-For-Beginners-Problems-or-Pattern-or-Sample-Solutions', note: 'One of the most-upvoted posts of 2020' },
      { name: '5 graph patterns that solve 90% of LeetCode graph problems', url: 'https://leetcode.com/discuss/post/8396904/5-graph-patterns-that-solve-90-of-leetco-cnkw/' },
    ],
  },
  dp: {
    idea: 'Define dp[state] in one sentence, write the transition from smaller states, pick the base case, and fill the table in dependency order. For LCS: match means diagonal + 1, otherwise take the max of up and left.',
    visuals: ['lcs'],
    videos: [v('Ua0GhsJSlWM', 'Longest Common Subsequence — 2D DP'), v('H9bfqozjoqs', 'Coin Change — 1D DP'), v('oBt53YbR9Kk', 'Dynamic Programming — memoization → tabulation (full course)', 'freeCodeCamp')],
    playlists: [AV('PL_z_8CaSLPWekqhdCPmFohncHwz8TY2Go', 'Dynamic Programming — knapsack, LCS, MCM (Hindi)'), TUF('PLgUwDviBIf0qUlt5H_kiKYaNSqJ81PMMY', 'DP series'), NC('PLot-Xpze53lcvx_tjrr_m2lgD2NsRHlNO', 'Dynamic Programming')],
    blogs: [
      { name: 'Dynamic Programming Patterns (LeetCode Discuss, aatalyk)', url: 'https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns', note: 'Min/max path · distinct ways · merging intervals · DP on strings · decision making' },
      { name: '20 patterns to master dynamic programming (AlgoMaster)', url: 'https://blog.algomaster.io/p/20-patterns-to-master-dynamic-programming' },
    ],
  },
  backtracking: {
    idea: 'Choose, explore, un-choose. Every call makes one decision (take or skip), recurses, then undoes it. Draw the decision tree first and the code follows from it.',
    visuals: ['subsets'],
    videos: [v('REOH22Xwdkk', 'Subsets — the decision tree'), v('IJDJ0kBx2LM', 'Recursion for beginners (full course)', 'freeCodeCamp')],
    playlists: [TUF('PLgUwDviBIf0rGlzIn_7rsaR2FQ5e6ZOL9', 'Recursion & Backtracking'), AV('PL_z_8CaSLPWeT1ffjiImo0sYTcnLzo-wY', 'Recursion — IP/OP method (Hindi)'), NC('PLot-Xpze53lf5C3HSjCnyFghlW0G1HHXo', 'Backtracking')],
    blogs: [
      { name: 'Backtracking cheat sheet in Java (LeetCode Discuss)', url: 'https://leetcode.com/discuss/study-guide/6164330/Backtracking-Cheat-Sheet-in-Java-(From-Basics-to-Advanced)/' },
      { name: 'Backtracking patterns — permutations, combinations, subsets, N-Queens', url: 'https://www.techinterview.org/post/3233474167/coding-interview-backtracking-recursion-patterns-permutations-combinations-subsets-n-queens-sudoku-constraint-satisfaction/', note: 'start-index vs used[] — when to use which' },
    ],
  },
  greedy: {
    idea: 'Make the locally best move and never look back, but only after you can explain why it is safe. Jump Game keeps just one number, the farthest index reachable so far.',
    visuals: ['jumpGame'],
    videos: [v('Yan0cv2cLy8', 'Jump Game — greedy reach'), v('5WZl3MMT0Eg', 'Maximum Subarray — Kadane')],
    playlists: [TUF('PLgUwDviBIf0rF1w2Koyh78zafB0cz7tea', 'Greedy series')],
    blogs: [
      { name: 'Mastering greedy algorithms with LeetCode problems (Discuss)', url: 'https://leetcode.com/discuss/study-guide/5330283/Mastering-Greedy-Algorithms-with-LeetCode-Problems/', note: 'Easy → Hard ladder' },
      { name: 'ABCs of Greedy (LeetCode Discuss)', url: 'https://leetcode.com/discuss/general-discussion/1061059/ABCs-of-Greedy' },
      { name: 'When to use greedy vs DP (DEV)', url: 'https://dev.to/alex_hunter_44f4c9ed6671e/when-to-use-greedy-vs-dynamic-programming-for-leetcode-problems-3blj' },
    ],
  },
  tries: {
    idea: 'A tree where each edge is one character. Words that share a prefix share a path, so a prefix query costs O(length of the prefix) no matter how many words are stored.',
    visuals: ['trie'],
    videos: [v('oobqoCJlHA0', 'Implement Trie (Prefix Tree)')],
    playlists: [TUF('PLgUwDviBIf0pcIDCZnxhv0LkHf5KzG9zp', 'Trie series')],
    blogs: [
      { name: 'Beginner-friendly guide to Trie + practice problems (LeetCode Discuss)', url: 'https://leetcode.com/discuss/study-guide/931977/beginner-friendly-guide-to-trie-tutorial-practice-problems' },
      { name: 'Introduction to Trie (LeetCode Discuss)', url: 'https://leetcode.com/discuss/general-discussion/1066206/introduction-to-trie' },
    ],
  },
  bits: {
    idea: 'x ^ x = 0 and x ^ 0 = x, so XOR-ing every number cancels the pairs and leaves the single one. Other tricks to know: n & (n−1) drops the lowest set bit, and (n >> i) & 1 reads bit i.',
    visuals: ['xor'],
    videos: [v('RyBM56RIWrM', 'Counting Bits — DP on bits'), v('UcoN6UjAI64', 'Reverse Bits')],
    playlists: [TUF('PLgUwDviBIf0rnqh8QsJaHyIX7KUiaPUv7', 'Bit Manipulation')],
    blogs: [
      { name: 'A summary: how to use bit manipulation (LeetCode Discuss)', url: 'https://leetcode.com/discuss/general-discussion/136585/a-summary-how-to-use-bit-manipulation-to-solve-things-clearly-and-efficiently/' },
      { name: 'Start Bit Manipulation Here (LeetCode Discuss)', url: 'https://leetcode.com/discuss/study-guide/1150415/Start-Bit-Manipulation-Here' },
    ],
  },
};

// What the community recommends. Reddit itself blocks automated fetching, so these come from
// Blind / GitHub roundups found via search. Use the Reddit search links to read the threads yourself.
export const community = {
  points: [
    '"Just do NeetCode 150" is the default answer on coding-interview forums. Use it for visual explanations.',
    'Aditya Verma is widely called the best for Dynamic Programming (identification-first teaching, in Hindi).',
    'Learn topic by topic from whichever creator is best at that topic, instead of one creator\'s full course.',
    'Graphs: William Fiset\'s animations for the theory, Striver\'s series for interview problems.',
  ],
  sources: [
    { name: 'Best YouTube channel for learning LC patterns (Blind)', url: 'https://www.teamblind.com/post/best-youtube-channel-for-learning-lc-patterns-kogqpcfv' },
    { name: 'Good LeetCode YouTube channels (Blind)', url: 'https://www.teamblind.com/post/good-leetcode-youtube-channels-5kbmrzde' },
    { name: 'DSA resource gist (GitHub)', url: 'https://gist.github.com/avidLearnerInProgress/23092a923292ad7b0e5080e689fce776' },
    { name: 'awesome-leetcode-resources (GitHub)', url: 'https://github.com/ashishps1/awesome-leetcode-resources' },
  ],
  reddit: [
    { name: 'r/leetcode — "pattern" threads', url: redditSearch('patterns') },
    { name: 'r/leetcode — best YouTube for DSA', url: redditSearch('best youtube channel') },
    { name: 'r/developersIndia — remote interview prep', url: redditSearch('remote interview preparation', 'developersIndia') },
    { name: 'r/cscareerquestions — interview prep', url: redditSearch('interview prep patterns', 'cscareerquestions') },
  ],
  starter: v('xo7XrRVxH8Y', '8 patterns to solve 80% of LeetCode problems — start here', 'Sahil & Sarra'),
};

// Company focus. `p` = pattern id, `why` = what was asked / why it matters,
// `reported` = a sourced interview report mentions it, `q` = reported or closest LeetCode problems.
export const focusCompanies = [
  {
    id: 'motorq', name: 'Motorq', tagline: 'Primary target: connected-vehicle telemetry. Every DSA pattern below has been reported in its loop.',
    loop: 'OA → DSA rounds → machine coding / take-home → system design → fundamentals + SQL → CTO round',
    patterns: [
      { p: 'stack', why: 'Monotonic stack reported as a "very hard" implementation round.', reported: true, q: [['Largest Rectangle in Histogram', 'largest-rectangle-in-histogram'], ['Sum of Subarray Minimums', 'sum-of-subarray-minimums']] },
      { p: 'binary-search', why: 'Koko Eating Bananas asked directly (binary search on answer).', reported: true, q: [['Koko Eating Bananas', 'koko-eating-bananas'], ['Capacity To Ship Packages Within D Days', 'capacity-to-ship-packages-within-d-days']] },
      { p: 'dp', why: '"Overlapping subsequences" asked: the LCS family.', reported: true, q: [['Longest Common Subsequence', 'longest-common-subsequence'], ['Edit Distance', 'edit-distance']] },
      { p: 'graphs', why: 'Graph questions reported in the DSA rounds.', reported: true, q: [['Number of Islands', 'number-of-islands'], ['Network Delay Time', 'network-delay-time']] },
      { p: 'heap', why: 'OA asked for the K max sums from two arrays, one element from each.', reported: true, q: [['Find K Pairs with Smallest Sums', 'find-k-pairs-with-smallest-sums']] },
      { p: 'sliding-window', why: 'Sliding window also reported in 2025 DSA rounds.', reported: true, q: [['Longest Substring Without Repeating Characters', 'longest-substring-without-repeating-characters']] },
      { p: 'greedy', why: 'OA asked for the minimum spend to buy all item types across N shops (greedy / matrix min-cost).', reported: true, q: [['Minimum Path Sum', 'minimum-path-sum']] },
      { p: 'arrays-hashing', why: 'A dedicated "arrays + stack" round was reported.', reported: true, q: [['Product of Array Except Self', 'product-of-array-except-self']] },
    ],
    beyond: [
      'Machine coding: a parking system built WITHOUT LLM help, then extended level by level. Practice it timed in Java.',
      'System design: speeding-alert pipeline for millions of vehicles; out-of-order readings with a 10-minute window.',
      'SQL: top-N per group, range queries, schema design. Fundamentals: consistency models, indexing, OS, DBMS.',
    ],
    links: [], // filled from motorq.sources in the component
  },
  {
    id: 'remote-india', name: 'Remote product cos (India, general)', tagline: 'The usual loop at Razorpay / PhonePe / Postman / Atlan-tier companies and funded startups. LLD carries extra weight at 2–3 yrs.',
    loop: '1–2 DSA rounds (LeetCode medium) → machine coding / LLD (60–90 min) → HLD → hiring manager + culture',
    patterns: [
      { p: 'arrays-hashing', why: 'Warm-up round staple. Expect a follow-up asking for O(n).' },
      { p: 'sliding-window', why: 'The most common string/array medium.' },
      { p: 'binary-search', why: 'Binary search on answer is a favourite medium-hard.' },
      { p: 'trees', why: 'DFS/BFS on trees appears in most loops.' },
      { p: 'graphs', why: 'BFS on grids and topological sort (dependency resolution).' },
      { p: 'heap', why: 'Top-K and scheduling questions that map to backend work.' },
      { p: 'dp', why: 'One medium DP per loop is typical (1D or LCS-style).' },
      { p: 'intervals', why: 'Meeting rooms / merge show up in calendar or booking-style problems.' },
    ],
    beyond: [
      'Machine coding: build a working, extensible app in 60–90 min (parking lot, splitwise, rate limiter, cache).',
      'HLD: URL shortener, notification service, rate limiter. Explain trade-offs clearly.',
    ],
    links: [
      { name: 'Interview preparation guide — DSA · LLD · SD · behavioral (LeetCode Discuss)', url: 'https://leetcode.com/discuss/study-guide/1757720/interview-preparation-guide-dsa-lld-system-design-behavioral-faang' },
      { name: 'DSA roadmap for Indian product companies (2026)', url: 'https://jobrise.io/en/blog/dsa-interview-preparation-india-2026/' },
      { name: 'workat.tech SDE roadmaps', url: 'https://workat.tech/general/' },
    ],
  },
  {
    id: 'atlassian', name: 'Atlassian', tagline: 'Remote in India ("Team Anywhere"). Every round eliminates. Code Design is the round that surprises people.',
    loop: 'Karat screen → Code Design (runnable code + tests) → DSA → System design → Values / behavioral',
    patterns: [
      { p: 'heap', why: 'Stock Price Fluctuation reported: heap + hashmap with lazy deletion.', reported: true, q: [['Stock Price Fluctuation', 'stock-price-fluctuation']] },
      { p: 'arrays-hashing', why: 'Code Design (e.g. Snake Game) is a hashmap/deque design under given signatures.', reported: true, q: [['Design Snake Game (Premium)', 'design-snake-game'], ['LRU Cache', 'lru-cache']] },
      { p: 'graphs', why: 'Grid/graph traversal is common in the DSA round.', q: [['Number of Islands', 'number-of-islands']] },
      { p: 'trees', why: 'Hierarchy problems (org charts, tag trees).', q: [['Lowest Common Ancestor of a Binary Tree', 'lowest-common-ancestor-of-a-binary-tree']] },
      { p: 'sliding-window', why: 'General medium staple.' },
    ],
    beyond: [
      'Code Design: executable code against given method signatures, plus your own tests. Optimise for clean extension.',
      'System design: tagging / social-feed system. DB tables, APIs, pagination, indexing.',
      'Values round: prepare STAR stories mapped to Atlassian values.',
    ],
    links: [
      { name: 'Atlassian interview experience (LeetCode Discuss)', url: 'https://leetcode.com/discuss/interview-experience/4965703/' },
      { name: 'Atlassian interview experience (LeetCode Discuss, 2021)', url: 'https://leetcode.com/discuss/interview-experience/1271435/' },
      { name: 'Atlassian interviews (Glassdoor India)', url: 'https://www.glassdoor.co.in/Interview/Atlassian-Interview-E115699-RVW95360831.htm' },
    ],
  },
  {
    id: 'razorpay', name: 'Razorpay', tagline: 'Fintech. Machine coding and LLD outweigh DSA. Reports show DSA as a lighter filter.',
    loop: 'Machine coding (~150 min, extensible) → LLD → HLD → hiring manager',
    patterns: [
      { p: 'arrays-hashing', why: 'In-memory stores and indexes inside machine coding are built on hashmaps.' },
      { p: 'heap', why: 'Scheduler with retries = priority queue keyed by next-run time.', reported: true, q: [['Task Scheduler', 'task-scheduler']] },
      { p: 'sliding-window', why: 'Rate-limiter style questions.' },
      { p: 'tries', why: 'In-memory search-engine LLD reported. Prefix index = trie.', reported: true, q: [['Implement Trie (Prefix Tree)', 'implement-trie-prefix-tree'], ['Search Suggestions System', 'search-suggestions-system']] },
      { p: 'graphs', why: 'General medium.' },
    ],
    beyond: [
      'Machine coding (~150 min): implement ALL functional requirements, keep it modular and extensible.',
      'LLD asked: ATM, rating system, notification service, in-memory search engine, DB-layer LLD in Java.',
      'HLD asked: job scheduler with retries, payments subscription system.',
    ],
    links: [
      { name: 'Razorpay interview question (LeetCode Discuss)', url: 'https://leetcode.com/discuss/interview-question/6179716/' },
      { name: 'Razorpay interview experience (LeetCode Discuss)', url: 'https://leetcode.com/discuss/interview-experience/5817444/' },
      { name: 'Razorpay SWE guide (Interview Query)', url: 'https://www.interviewquery.com/guides/razorpay-software-engineer' },
      { name: 'Razorpay 0–2 yrs experience (Naukri Code360)', url: 'https://www.naukri.com/code360/interview-experiences/razorpay/razorpay-interview-experience-mar-2021-exp-0-2-years' },
    ],
  },
  {
    id: 'databricks', name: 'Databricks', tagline: 'Your Databricks experience is a direct hook. LeetCode medium-hard, and they expect complexity analysis BEFORE you code.',
    loop: 'Recruiter → coding screen → onsite (2 coding, 1 system design, 1 behavioral)',
    patterns: [
      { p: 'graphs', why: 'Grid shortest path with BFS/DFS reported.', reported: true, q: [['Shortest Path in Binary Matrix', 'shortest-path-in-binary-matrix'], ['Rotting Oranges', 'rotting-oranges']] },
      { p: 'sliding-window', why: 'Find All Anagrams-style question reported.', reported: true, q: [['Find All Anagrams in a String', 'find-all-anagrams-in-a-string']] },
      { p: 'bits', why: 'First CIDR block covering an IP reported. Needs bit masks on IPv4.', reported: true, q: [['IP to CIDR (Premium)', 'ip-to-cidr']] },
      { p: 'arrays-hashing', why: 'N×N Tic-Tac-Toe with variable win length reported. Row/col/diagonal counters.', reported: true, q: [['Design Tic-Tac-Toe (Premium)', 'design-tic-tac-toe'], ['Valid Tic-Tac-Toe State', 'valid-tic-tac-toe-state']] },
      { p: 'binary-search', why: 'Medium-hard coding bar. Binary search on answer is common at this level.' },
      { p: 'heap', why: 'Top-K / merge-K over partitions maps to their domain.' },
    ],
    beyond: [
      'State time/space complexity out loud before writing code. It is graded.',
      'System design: data-platform flavour. Talk about your Databricks pipelines.',
    ],
    links: [
      { name: 'Databricks SWE interview guide (Interview Query)', url: 'https://interviewquery.com/interview-guides/databricks-software-engineer' },
      { name: 'Databricks interviews (Glassdoor)', url: 'https://www.glassdoor.co.nz/Interview/Databricks-Interview-E954734-RVW100968278.htm' },
    ],
  },
  {
    id: 'confluent', name: 'Confluent', tagline: 'The Kafka company, remote in India. Your Kafka experience is your strongest story here. ~5 rounds.',
    loop: 'Recruiter → coding → coding → system design (distributed KV) → values / behavioral',
    patterns: [
      { p: 'arrays-hashing', why: 'Sudoku validator reported.', reported: true, q: [['Valid Sudoku', 'valid-sudoku']] },
      { p: 'linked-list', why: '"Infinite queue" design reported. Linked/segmented buffers.', reported: true, q: [['Design Circular Queue', 'design-circular-queue'], ['LRU Cache', 'lru-cache']] },
      { p: 'stack', why: 'String parsing / matching questions reported.', reported: true, q: [['Decode String', 'decode-string'], ['Basic Calculator II', 'basic-calculator-ii']] },
      { p: 'heap', why: 'Merge-K / top-K over partitions is very Kafka-shaped.', q: [['Merge k Sorted Lists', 'merge-k-sorted-lists']] },
      { p: 'graphs', why: 'General medium-hard.' },
    ],
    beyond: [
      'System design: distributed key-value store. Cover consensus, partitioning, replication, fault tolerance.',
      'Go deep on Kafka internals (ISR, log compaction, exactly-once). They will.',
    ],
    links: [
      { name: 'Confluent SWE interview guide (Interview Query)', url: 'https://www.interviewquery.com/interview-guides/confluent-software-engineer' },
      { name: 'Confluent interview thread (1point3acres)', url: 'https://www.1point3acres.com/interview/thread/1173117' },
    ],
  },
  {
    id: 'gitlab', name: 'GitLab', tagline: 'All-remote. No algorithm puzzles. You are judged on a real PR and how you review code.',
    loop: 'Take-home PR (GitLab / Rails ecosystem) → 90-min technical review of your PR → behavioral → manager',
    patterns: [
      { p: 'arrays-hashing', why: 'Everyday data handling inside the take-home. Keep it clean, not clever.' },
      { p: 'stack', why: 'Parsing and validation logic shows up in real code-review exercises.' },
      { p: 'trees', why: 'Nested structures (comments, groups, file trees) in practical tasks.' },
    ],
    beyond: [
      'Take-home: write a production-quality PR with tests, a clear description and small commits.',
      'Technical review (90 min): defend your trade-offs and review someone else\'s code kindly and specifically.',
      'Read the GitLab handbook values (CREDIT). Behavioral questions map to them.',
    ],
    links: [
      { name: 'GitLab senior backend interview (Taro)', url: 'https://www.jointaro.com/interviews/companies/gitlab/work-experiences/senior-backend-engineer-july-9-2025-4-c154aa43/' },
      { name: 'GitLab backend engineer guide (Dataford)', url: 'https://dataford.io/interview-guides/gitlab/backend-engineer' },
    ],
  },
];
