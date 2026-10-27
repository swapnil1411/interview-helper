// Edit freely. Each question: [title, slug, note?]. `core: true` marks the must-do set.
// Links are generated as https://leetcode.com/problems/<slug>/

export const retainRules = [
  'Attempt every problem for 15–20 min before reading the solution — a failed attempt is the hook the solution attaches to.',
  "After reading, close the tab and rebuild from a blank editor. If you can't, you watched it, you didn't learn it.",
  'Re-solve the same problem 24h later and 1 week later. Two re-solves beat five new problems.',
  'Keep a "trigger log": one line per problem mapping problem-phrasing → pattern. That\'s what you revise the night before.',
  'After finishing a pattern, do 2–3 random problems from earlier patterns without looking at the tag, to practice choosing the pattern.',
  'Explain the solution out loud before coding it.',
  'Keep a "failed to re-solve" list — that is your real study material.',
  'Target 250–300 problems solved well, not 600 skimmed.',
  'Skip for this timeline: KMP/Z-algorithm, segment trees, bitmask/digit DP, Tarjan bridges/SCC, Floyd-Warshall, advanced math.',
];

export const masteryLadder = [
  'Core 7: solve all, re-solve each after 24h and 1 week.',
  'Extended set: solve without looking at hints — this is where the pattern becomes reflex.',
  'Can you write the template from memory in < 3 min? Can you state the trigger without notes?',
  'Mixed practice: 3 untagged problems from this pattern + others. Pattern mastered when you pick it correctly 3/3.',
];

export const patterns = [
  {
    id: 'arrays-hashing', name: 'Arrays & Hashing', tier: 1,
    trigger: '"need O(1) lookup / counting / seen-before" → hashmap or set.',
    template: 'Single pass; for each x ask "have I seen what I need?" (map.get(target - x)), then record x. Frequency maps for anagrams/grouping.',
    pitfalls: 'Key choice for grouping (sorted string vs count tuple). Mutating while iterating.',
    questions: [
      ['Two Sum', 'two-sum'], ['Contains Duplicate', 'contains-duplicate'], ['Valid Anagram', 'valid-anagram'],
      ['Group Anagrams', 'group-anagrams'], ['Subarray Sum Equals K', 'subarray-sum-equals-k'],
      ['Product of Array Except Self', 'product-of-array-except-self'],
      ['Find All Numbers Disappeared in an Array', 'find-all-numbers-disappeared-in-an-array'],
    ],
    extra: [
      ['Majority Element', 'majority-element'], ['Valid Sudoku', 'valid-sudoku'],
      ['Longest Consecutive Sequence', 'longest-consecutive-sequence'], ['Top K Frequent Elements', 'top-k-frequent-elements'],
      ['Isomorphic Strings', 'isomorphic-strings'], ['First Missing Positive', 'first-missing-positive'],
    ],
  },
  {
    id: 'two-pointers', name: 'Two Pointers', tier: 1,
    trigger: 'Sorted array, or converging/diverging scan from both ends.',
    template: 'l=0, r=n-1; while l<r: compare, move the pointer whose move can improve the answer. Same-direction variant: slow writer / fast reader.',
    pitfalls: 'Skipping duplicates in 3Sum. Proving why moving the smaller side is safe (Container).',
    questions: [
      ['Valid Palindrome', 'valid-palindrome'], ['Two Sum II - Input Array Is Sorted', 'two-sum-ii-input-array-is-sorted'],
      ['3Sum', '3sum'], ['Container With Most Water', 'container-with-most-water'], ['Sort Colors', 'sort-colors'],
      ['Remove Duplicates from Sorted Array II', 'remove-duplicates-from-sorted-array-ii'], ['Trapping Rain Water', 'trapping-rain-water'],
    ],
    extra: [
      ['Move Zeroes', 'move-zeroes'], ['Squares of a Sorted Array', 'squares-of-a-sorted-array'],
      ['Boats to Save People', 'boats-to-save-people'], ['3Sum Closest', '3sum-closest'], ['4Sum', '4sum'],
    ],
  },
  {
    id: 'prefix-sum', name: 'Prefix Sum', tier: 1,
    trigger: '"sum/count of a subarray equals / divisible by K", range queries → prefix[i] - prefix[j] + hashmap of seen prefixes.',
    template: 'map = {0: 1}; running += x; ans += map[running - k]; map[running]++. For divisibility key on running % k.',
    pitfalls: 'Forgetting the {0:1} seed. Negative mods in Java (((x % k) + k) % k).',
    questions: [
      ['Range Sum Query - Immutable', 'range-sum-query-immutable'], ['Find Pivot Index', 'find-pivot-index'],
      ['Contiguous Array', 'contiguous-array'], ['Continuous Subarray Sum', 'continuous-subarray-sum'],
      ['Subarray Sums Divisible by K', 'subarray-sums-divisible-by-k'], ['Range Sum Query 2D - Immutable', 'range-sum-query-2d-immutable'],
      ['Path Sum III', 'path-sum-iii'],
    ],
    extra: [['Count Number of Nice Subarrays', 'count-number-of-nice-subarrays'], ['Corporate Flight Bookings', 'corporate-flight-bookings']],
  },
  {
    id: 'sliding-window', name: 'Sliding Window', tier: 1,
    trigger: '"longest/shortest/contains subarray or substring with condition" → expand right, shrink left.',
    template: 'for r in range(n): add s[r]; while window invalid: remove s[l], l++; update answer. Fixed-size: add r, remove r-k.',
    pitfalls: '"Exactly K" = atMost(K) - atMost(K-1). Window validity must be checkable in O(1).',
    questions: [
      ['Best Time to Buy and Sell Stock', 'best-time-to-buy-and-sell-stock'],
      ['Longest Substring Without Repeating Characters', 'longest-substring-without-repeating-characters'],
      ['Longest Repeating Character Replacement', 'longest-repeating-character-replacement'],
      ['Permutation in String', 'permutation-in-string'], ['Fruit Into Baskets', 'fruit-into-baskets'],
      ['Sliding Window Maximum', 'sliding-window-maximum'], ['Minimum Window Substring', 'minimum-window-substring'],
    ],
    extra: [
      ['Maximum Average Subarray I', 'maximum-average-subarray-i'], ['Minimum Size Subarray Sum', 'minimum-size-subarray-sum'],
      ['Max Consecutive Ones III', 'max-consecutive-ones-iii'], ['Find All Anagrams in a String', 'find-all-anagrams-in-a-string'],
      ['Subarrays with K Different Integers', 'subarrays-with-k-different-integers'],
    ],
  },
  {
    id: 'binary-search', name: 'Binary Search (incl. Binary Search on Answer)', tier: 1, motorq: true,
    trigger: 'Sorted input, OR "minimize the maximum / smallest X such that feasible" → binary search the answer, write a canDo(x) predicate.',
    template: 'lo=min possible, hi=max possible; while lo<hi: mid=lo+(hi-lo)/2; if canDo(mid) hi=mid else lo=mid+1; return lo.',
    pitfalls: 'Off-by-one: pick ONE template (lo<hi, hi=mid) and always use it. Overflow in mid and in canDo sums (use long).',
    questions: [
      ['Binary Search', 'binary-search'], ['Search Insert Position', 'search-insert-position'],
      ['Search in Rotated Sorted Array', 'search-in-rotated-sorted-array'],
      ['Koko Eating Bananas', 'koko-eating-bananas', 'Asked at Motorq'],
      ['Capacity To Ship Packages Within D Days', 'capacity-to-ship-packages-within-d-days'],
      ['Split Array Largest Sum', 'split-array-largest-sum'], ['Median of Two Sorted Arrays', 'median-of-two-sorted-arrays'],
    ],
    extra: [
      ['Find Minimum in Rotated Sorted Array', 'find-minimum-in-rotated-sorted-array'],
      ['Find First and Last Position of Element in Sorted Array', 'find-first-and-last-position-of-element-in-sorted-array'],
      ['Search a 2D Matrix', 'search-a-2d-matrix'], ['Find Peak Element', 'find-peak-element'],
      ['Time Based Key-Value Store', 'time-based-key-value-store', 'Timestamp lookups — telemetry-flavoured'],
      ['Minimum Number of Days to Make m Bouquets', 'minimum-number-of-days-to-make-m-bouquets'],
      ['Magnetic Force Between Two Balls', 'magnetic-force-between-two-balls'],
      ['Find the Smallest Divisor Given a Threshold', 'find-the-smallest-divisor-given-a-threshold'],
    ],
  },
  {
    id: 'stack', name: 'Stack & Monotonic Stack', tier: '1 → 2', motorq: true,
    trigger: '"next greater/smaller element", histogram, parsing. Popping is where the answer is computed; maintain an increasing or decreasing stack.',
    template: 'for i: while stack and a[stack.top] < a[i]: j = pop(); ans[j] = i - j (or a[i]); push(i). Store INDICES, not values.',
    pitfalls: 'Circular arrays → iterate 2n with i % n. Equal elements: decide strict vs non-strict to avoid double counting (Sum of Subarray Minimums).',
    questions: [
      ['Valid Parentheses', 'valid-parentheses'], ['Min Stack', 'min-stack'],
      ['Evaluate Reverse Polish Notation', 'evaluate-reverse-polish-notation'], ['Daily Temperatures', 'daily-temperatures'],
      ['Next Greater Element II', 'next-greater-element-ii'], ['Remove K Digits', 'remove-k-digits'],
      ['Largest Rectangle in Histogram', 'largest-rectangle-in-histogram'],
    ],
    extra: [
      ['Next Greater Element I', 'next-greater-element-i'], ['Online Stock Span', 'online-stock-span'],
      ['Asteroid Collision', 'asteroid-collision'], ['Car Fleet', 'car-fleet'], ['Decode String', 'decode-string'],
      ['Sum of Subarray Minimums', 'sum-of-subarray-minimums'], ['132 Pattern', '132-pattern'],
      ['Remove Duplicate Letters', 'remove-duplicate-letters'], ['Maximal Rectangle', 'maximal-rectangle'],
      ['Basic Calculator', 'basic-calculator'],
    ],
  },
  {
    id: 'linked-list', name: 'Linked List', tier: 1,
    trigger: 'In-place pointer manipulation, cycle detection via fast/slow.',
    template: 'Dummy head node for anything that may change the head. Reverse: prev=null; while cur: nxt=cur.next; cur.next=prev; prev=cur; cur=nxt.',
    pitfalls: 'Losing the next pointer. Draw 3 nodes on paper before coding.',
    questions: [
      ['Reverse Linked List', 'reverse-linked-list'], ['Linked List Cycle', 'linked-list-cycle'],
      ['Middle of the Linked List', 'middle-of-the-linked-list'], ['Merge Two Sorted Lists', 'merge-two-sorted-lists'],
      ['Remove Nth Node From End of List', 'remove-nth-node-from-end-of-list'], ['Reorder List', 'reorder-list'],
      ['LRU Cache', 'lru-cache'],
    ],
    extra: [
      ['Palindrome Linked List', 'palindrome-linked-list'], ['Intersection of Two Linked Lists', 'intersection-of-two-linked-lists'],
      ['Linked List Cycle II', 'linked-list-cycle-ii'], ['Add Two Numbers', 'add-two-numbers'],
      ['Copy List with Random Pointer', 'copy-list-with-random-pointer'], ['Reverse Nodes in k-Group', 'reverse-nodes-in-k-group'],
      ['LFU Cache', 'lfu-cache'],
    ],
  },
  {
    id: 'trees', name: 'Trees', tier: '1 → 2',
    trigger: 'Recursive structure; think about what each node returns to its parent (bottom-up DFS) vs top-down.',
    template: 'dfs(node) returns info for the parent; a global/outer variable tracks the answer that "bends" through the node (diameter, max path sum). BFS with queue + level size for level problems.',
    pitfalls: 'Validate BST needs (lo, hi) bounds, not just parent comparison. Null handling at the top of dfs.',
    questions: [
      ['Invert Binary Tree', 'invert-binary-tree'], ['Maximum Depth of Binary Tree', 'maximum-depth-of-binary-tree'],
      ['Binary Tree Level Order Traversal', 'binary-tree-level-order-traversal'], ['Validate Binary Search Tree', 'validate-binary-search-tree'],
      ['Lowest Common Ancestor of a Binary Tree', 'lowest-common-ancestor-of-a-binary-tree'],
      ['Kth Smallest Element in a BST', 'kth-smallest-element-in-a-bst'], ['Binary Tree Maximum Path Sum', 'binary-tree-maximum-path-sum'],
    ],
    extra: [
      ['Same Tree', 'same-tree'], ['Subtree of Another Tree', 'subtree-of-another-tree'],
      ['Diameter of Binary Tree', 'diameter-of-binary-tree'], ['Balanced Binary Tree', 'balanced-binary-tree'],
      ['Binary Tree Right Side View', 'binary-tree-right-side-view'], ['Count Good Nodes in Binary Tree', 'count-good-nodes-in-binary-tree'],
      ['Construct Binary Tree from Preorder and Inorder Traversal', 'construct-binary-tree-from-preorder-and-inorder-traversal'],
      ['All Nodes Distance K in Binary Tree', 'all-nodes-distance-k-in-binary-tree'],
      ['Serialize and Deserialize Binary Tree', 'serialize-and-deserialize-binary-tree'],
    ],
  },
  {
    id: 'heap', name: 'Heap / Priority Queue', tier: 2, motorq: true,
    trigger: '"top K", "k-th largest/smallest", merge sorted streams, running median.',
    template: 'Top-K largest → MIN-heap of size K (pop when size > K). K-way merge → heap of (value, listIdx, elemIdx). Two heaps for median.',
    pitfalls: 'Java comparator overflow (use Integer.compare). For "k smallest pairs" push (i, 0) for each i, then expand only j+1.',
    questions: [
      ['Kth Largest Element in an Array', 'kth-largest-element-in-an-array'], ['Top K Frequent Elements', 'top-k-frequent-elements'],
      ['K Closest Points to Origin', 'k-closest-points-to-origin'],
      ['Find K Pairs with Smallest Sums', 'find-k-pairs-with-smallest-sums', 'Mirror of a Motorq OA question'],
      ['Task Scheduler', 'task-scheduler'], ['Merge k Sorted Lists', 'merge-k-sorted-lists'],
      ['Find Median from Data Stream', 'find-median-from-data-stream'],
    ],
    extra: [
      ['Last Stone Weight', 'last-stone-weight'], ['Kth Largest Element in a Stream', 'kth-largest-element-in-a-stream'],
      ['Reorganize String', 'reorganize-string'], ['Design Twitter', 'design-twitter'],
      ['Kth Smallest Element in a Sorted Matrix', 'kth-smallest-element-in-a-sorted-matrix'],
      ['Smallest Range Covering Elements from K Lists', 'smallest-range-covering-elements-from-k-lists'], ['IPO', 'ipo'],
    ],
  },
  {
    id: 'intervals', name: 'Intervals & Sweep Line', tier: 2,
    trigger: "Overlapping ranges, scheduling, timestamp/event windows (relevant to Motorq's telemetry domain).",
    template: 'Sort by start; merge if cur.start <= last.end. Sweep: +1 at start, -1 at end, sort events, running sum = concurrency. Min-heap of end times for rooms.',
    pitfalls: 'Tie-break when end == start (process end first if touching intervals don\'t overlap). Sort by END for greedy max non-overlapping.',
    questions: [
      ['Merge Intervals', 'merge-intervals'], ['Insert Interval', 'insert-interval'], ['Non-overlapping Intervals', 'non-overlapping-intervals'],
      ['Minimum Number of Arrows to Burst Balloons', 'minimum-number-of-arrows-to-burst-balloons'],
      ['Meeting Rooms II', 'meeting-rooms-ii'], ['Car Pooling', 'car-pooling'], ['Employee Free Time', 'employee-free-time'],
    ],
    extra: [
      ['Meeting Rooms', 'meeting-rooms'], ['Interval List Intersections', 'interval-list-intersections'],
      ['My Calendar I', 'my-calendar-i'], ['Minimum Interval to Include Each Query', 'minimum-interval-to-include-each-query'],
      ['The Skyline Problem', 'the-skyline-problem'],
    ],
  },
  {
    id: 'graphs', name: 'Graphs', tier: 2, motorq: true,
    trigger: 'Nodes + edges, grids, dependencies, shortest path, connectivity.',
    template: 'Grid: DFS/BFS with visited + 4 directions. Unweighted shortest path → BFS. Weighted → Dijkstra (min-heap of (dist,node), skip stale). Dependencies → Kahn topo sort. Connectivity → Union-Find (path compression + rank).',
    pitfalls: 'Mark visited when ENQUEUING, not dequeuing. Multi-source BFS (Rotting Oranges): push all sources first. Bellman-Ford style for "at most K edges".',
    questions: [
      ['Number of Islands', 'number-of-islands'], ['Rotting Oranges', 'rotting-oranges'], ['Course Schedule', 'course-schedule'],
      ['Course Schedule II', 'course-schedule-ii'],
      ['Number of Connected Components in an Undirected Graph', 'number-of-connected-components-in-an-undirected-graph'],
      ['Network Delay Time (Dijkstra)', 'network-delay-time'], ['Cheapest Flights Within K Stops', 'cheapest-flights-within-k-stops'],
    ],
    extra: [
      ['Flood Fill', 'flood-fill'], ['Max Area of Island', 'max-area-of-island'], ['Clone Graph', 'clone-graph'],
      ['Number of Provinces', 'number-of-provinces'], ['Pacific Atlantic Water Flow', 'pacific-atlantic-water-flow'],
      ['Surrounded Regions', 'surrounded-regions'], ['01 Matrix', '01-matrix'], ['Is Graph Bipartite?', 'is-graph-bipartite'],
      ['Shortest Path in Binary Matrix', 'shortest-path-in-binary-matrix'], ['Redundant Connection', 'redundant-connection'],
      ['Accounts Merge', 'accounts-merge'], ['Path With Minimum Effort', 'path-with-minimum-effort', 'Dijkstra on grid — matrix min-cost style'],
      ['Min Cost to Connect All Points', 'min-cost-to-connect-all-points'], ['Word Ladder', 'word-ladder'],
      ['Swim in Rising Water', 'swim-in-rising-water'], ['Alien Dictionary', 'alien-dictionary'],
    ],
  },
  {
    id: 'dp', name: 'Dynamic Programming', tier: 2, motorq: true,
    trigger: 'Overlapping subproblems + optimal substructure; "count ways / min-max / longest". Two-sequence DP (LCS family) is the most likely at Motorq.',
    template: '1) Define state in words ("dp[i][j] = LCS of a[0..i) and b[0..j)"). 2) Recurrence. 3) Base cases. 4) Iteration order. 5) Space-optimise. Start with memoised recursion, then convert to tabulation.',
    pitfalls: '0/1 knapsack iterates capacity BACKWARDS in 1-D; unbounded iterates forwards. Off-by-one with the empty-prefix row.',
    questions: [
      ['Climbing Stairs', 'climbing-stairs'], ['House Robber', 'house-robber'], ['Coin Change', 'coin-change'],
      ['Longest Increasing Subsequence', 'longest-increasing-subsequence'], ['Longest Common Subsequence', 'longest-common-subsequence'],
      ['Edit Distance', 'edit-distance'], ['Partition Equal Subset Sum', 'partition-equal-subset-sum'],
    ],
    extra: [
      ['Min Cost Climbing Stairs', 'min-cost-climbing-stairs'], ['House Robber II', 'house-robber-ii'], ['Decode Ways', 'decode-ways'],
      ['Unique Paths', 'unique-paths'], ['Minimum Path Sum', 'minimum-path-sum', 'Matrix min-cost'], ['Word Break', 'word-break'],
      ['Coin Change II', 'coin-change-ii'], ['Target Sum', 'target-sum'], ['Longest Palindromic Substring', 'longest-palindromic-substring'],
      ['Delete Operation for Two Strings', 'delete-operation-for-two-strings', 'LCS family'],
      ['Uncrossed Lines', 'uncrossed-lines', 'LCS family'],
      ['Maximum Length of Repeated Subarray', 'maximum-length-of-repeated-subarray', 'LCS family (substring variant)'],
      ['Longest Palindromic Subsequence', 'longest-palindromic-subsequence', 'LCS with reverse'],
      ['Distinct Subsequences', 'distinct-subsequences'], ['Maximal Square', 'maximal-square'],
      ['Best Time to Buy and Sell Stock with Cooldown', 'best-time-to-buy-and-sell-stock-with-cooldown'],
      ['Burst Balloons', 'burst-balloons'],
    ],
  },
  {
    id: 'backtracking', name: 'Backtracking', tier: 2,
    trigger: 'Generate all subsets/permutations/combinations; explore then undo.',
    template: 'bt(start, path): record/check; for i in start..n: (skip dup if i>start && a[i]==a[i-1]); path.add(a[i]); bt(i+1 or i, path); path.removeLast().',
    pitfalls: 'Copy path when recording (new ArrayList<>(path)). Sort first for dedup.',
    questions: [
      ['Subsets', 'subsets'], ['Combination Sum', 'combination-sum'], ['Permutations', 'permutations'], ['Word Search', 'word-search'],
      ['Palindrome Partitioning', 'palindrome-partitioning'], ['Letter Combinations of a Phone Number', 'letter-combinations-of-a-phone-number'],
      ['N-Queens', 'n-queens'],
    ],
    extra: [
      ['Subsets II', 'subsets-ii'], ['Combination Sum II', 'combination-sum-ii'], ['Permutations II', 'permutations-ii'],
      ['Combinations', 'combinations'], ['Generate Parentheses', 'generate-parentheses'],
      ['Restore IP Addresses', 'restore-ip-addresses'], ['Sudoku Solver', 'sudoku-solver'],
    ],
  },
  {
    id: 'greedy', name: 'Greedy', tier: 2,
    trigger: 'Local optimal choice leads to global optimum; prove with an exchange argument.',
    template: 'Sort by the key that makes the local choice safe, then single pass. If you cannot argue "swapping to my choice never hurts", it is DP.',
    pitfalls: 'Greedy that passes examples but fails edge cases — always try to break it with a small counterexample first.',
    questions: [
      ['Maximum Subarray', 'maximum-subarray'], ['Jump Game', 'jump-game'], ['Jump Game II', 'jump-game-ii'], ['Gas Station', 'gas-station'],
      ['Hand of Straights', 'hand-of-straights'], ['Partition Labels', 'partition-labels'], ['Candy', 'candy'],
    ],
    extra: [
      ['Assign Cookies', 'assign-cookies'], ['Lemonade Change', 'lemonade-change'],
      ['Best Time to Buy and Sell Stock II', 'best-time-to-buy-and-sell-stock-ii'], ['Two City Scheduling', 'two-city-scheduling'],
      ['Valid Parenthesis String', 'valid-parenthesis-string'], ['Merge Triplets to Form Target Triplet', 'merge-triplets-to-form-target-triplet'],
      ['Queue Reconstruction by Height', 'queue-reconstruction-by-height'],
    ],
  },
  {
    id: 'tries', name: 'Tries', tier: 3,
    trigger: 'Prefix search, autocomplete, word dictionaries.',
    template: 'class Node { Node[] next = new Node[26]; boolean end; } insert/search walk char by char. Word Search II: build trie of words, DFS grid walking the trie.',
    pitfalls: 'Pruning found words from the trie in Word Search II to avoid TLE.',
    questions: [
      ['Implement Trie (Prefix Tree)', 'implement-trie-prefix-tree'],
      ['Design Add and Search Words Data Structure', 'design-add-and-search-words-data-structure'], ['Word Search II', 'word-search-ii'],
      ['Replace Words', 'replace-words'], ['Maximum XOR of Two Numbers in an Array', 'maximum-xor-of-two-numbers-in-an-array'],
      ['Longest Word in Dictionary', 'longest-word-in-dictionary'], ['Search Suggestions System', 'search-suggestions-system'],
    ],
    extra: [['Map Sum Pairs', 'map-sum-pairs'], ['Stream of Characters', 'stream-of-characters']],
  },
  {
    id: 'bits', name: 'Bit Manipulation', tier: 3,
    trigger: 'XOR tricks, masks, counting bits.',
    template: 'x ^ x = 0; x & (x-1) clears lowest set bit; x & -x isolates it; (mask >> i) & 1 tests bit i.',
    pitfalls: 'Java >> vs >>> for negatives. Integer width in Reverse Bits.',
    questions: [
      ['Single Number', 'single-number'], ['Number of 1 Bits', 'number-of-1-bits'], ['Counting Bits', 'counting-bits'],
      ['Missing Number', 'missing-number'], ['Reverse Bits', 'reverse-bits'], ['Sum of Two Integers', 'sum-of-two-integers'],
      ['Subsets (via bitmask)', 'subsets'],
    ],
    extra: [['Power of Two', 'power-of-two'], ['Hamming Distance', 'hamming-distance'], ['Single Number II', 'single-number-ii'],
      ['Bitwise AND of Numbers Range', 'bitwise-and-of-numbers-range']],
  },
];

export const dsaLinks = [
  { name: 'NeetCode 150', url: 'https://neetcode.io/practice' },
  { name: 'Striver A2Z DSA Sheet', url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/' },
  { name: 'LeetCode Patterns (Sean Prashad)', url: 'https://seanprashad.com/leetcode-patterns/' },
  { name: 'Grind 75', url: 'https://www.techinterviewhandbook.org/grind75' },
  { name: 'Big-O Cheat Sheet', url: 'https://www.bigocheatsheet.com/' },
];

export const lcUrl = (slug) => `https://leetcode.com/problems/${slug}/`;
export const questionId = (patternId, slug) => `dsa:${patternId}:${slug}`;
export const allQuestions = (p) => [
  ...p.questions.map((q) => ({ q, core: true })),
  ...p.extra.map((q) => ({ q, core: false })),
];
