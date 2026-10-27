// Section 4 — sites that help in the interview process.
export const siteGroups = [
  { title: 'Coding practice', items: [
    { name: 'LeetCode', url: 'https://leetcode.com/', note: 'Company-tagged problems (Premium), contests' },
    { name: 'NeetCode', url: 'https://neetcode.io/', note: 'Pattern-ordered roadmap + video solutions' },
    { name: 'takeUforward (Striver)', url: 'https://takeuforward.org/', note: 'A2Z sheet, SDE sheet, India-focused' },
    { name: 'Codeforces', url: 'https://codeforces.com/', note: 'For CP-flavoured OAs like Motorq\'s' },
    { name: 'AlgoMonster', url: 'https://algo.monster/', note: 'Pattern templates' },
    { name: 'VisuAlgo', url: 'https://visualgo.net/', note: 'Visualize algorithms' },
  ]},
  { title: 'Mock interviews', items: [
    { name: 'Pramp (Exponent Practice)', url: 'https://www.tryexponent.com/practice', note: 'Free peer mocks — practice OUT LOUD' },
    { name: 'interviewing.io', url: 'https://interviewing.io/', note: 'Anonymous mocks with senior engineers' },
    { name: 'Hello Interview Mock', url: 'https://www.hellointerview.com/mock', note: 'System design mocks with FAANG interviewers' },
    { name: 'Exponent', url: 'https://www.tryexponent.com/', note: 'Courses + mock library' },
    { name: 'Topmate', url: 'https://topmate.io/', note: 'Book Indian SDEs for mocks / referrals' },
  ]},
  { title: 'Machine coding / LLD', items: [
    { name: 'Refactoring Guru', url: 'https://refactoring.guru/design-patterns' },
    { name: 'awesome-low-level-design', url: 'https://github.com/ashishps1/awesome-low-level-design' },
    { name: 'WorkAt.Tech machine coding', url: 'https://workat.tech/machine-coding/practice' },
  ]},
  { title: 'SQL & CS fundamentals', items: [
    { name: 'LeetCode SQL 50', url: 'https://leetcode.com/studyplan/top-sql-50/' },
    { name: 'SQLBolt', url: 'https://sqlbolt.com/' },
    { name: 'Use The Index, Luke', url: 'https://use-the-index-luke.com/', note: 'Index reasoning for "why is this query slow"' },
    { name: 'DataLemur (SQL interview Qs)', url: 'https://datalemur.com/' },
    { name: 'GfG — OS / DBMS / CN notes', url: 'https://www.geeksforgeeks.org/operating-systems/' },
  ]},
  { title: 'Behavioral & process', items: [
    { name: 'Tech Interview Handbook', url: 'https://www.techinterviewhandbook.org/', note: 'Behavioral, negotiation, resume' },
    { name: 'STAR method guide', url: 'https://www.techinterviewhandbook.org/behavioral-interview/' },
  ]},
  { title: 'Resume', items: [
    { name: "Jake's Resume (Overleaf)", url: 'https://www.overleaf.com/latex/templates/jakes-resume/syzfjbzwjncs' },
    { name: 'Resume Worded', url: 'https://resumeworded.com/' },
    { name: 'r/EngineeringResumes wiki', url: 'https://www.reddit.com/r/EngineeringResumes/wiki/index/' },
  ]},
  { title: 'Salary & company research', items: [
    { name: 'Levels.fyi (India)', url: 'https://www.levels.fyi/' },
    { name: 'AmbitionBox', url: 'https://www.ambitionbox.com/' },
    { name: 'Glassdoor India', url: 'https://www.glassdoor.co.in/' },
    { name: 'Blind', url: 'https://www.teamblind.com/' },
    { name: '6figr', url: 'https://6figr.com/' },
  ]},
  { title: 'Referrals & job hunting', items: [
    { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs/' },
    { name: 'Wellfound', url: 'https://wellfound.com/' },
    { name: 'r/developersIndia', url: 'https://www.reddit.com/r/developersIndia/' },
  ]},
];

export const interviewDayChecklist = [
  { id: 'env', label: 'Test camera, mic, internet, screen share 30 min before' },
  { id: 'ide', label: 'IDE / CoderPad familiarity — know how to run code without autocomplete' },
  { id: 'story', label: '2-minute "tell me about yourself" anchored on Kafka + Databricks' },
  { id: 'star', label: '5 STAR stories ready: conflict, failure, ownership, ambiguity, impact' },
  { id: 'qs', label: '3 questions to ask the interviewer' },
  { id: 'water', label: 'Water, paper + pen for diagrams' },
];
