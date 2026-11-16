// Free LeetCode lookup: forwards one fixed, public-profile GraphQL query to leetcode.com.
// The browser can't call leetcode.com directly (CORS), so the Vite dev server and the
// Cloudflare worker both run this. Only a username goes in; no password, cookie or token.
export const LC_QUERY = `query prephub($u: String!) {
  matchedUser(username: $u) {
    username
    profile { ranking realName userAvatar }
    submitStatsGlobal { acSubmissionNum { difficulty count } }
    tagProblemCounts {
      advanced { tagName tagSlug problemsSolved }
      intermediate { tagName tagSlug problemsSolved }
      fundamental { tagName tagSlug problemsSolved }
    }
  }
  userContestRanking(username: $u) { rating attendedContestsCount topPercentage }
  recentAcSubmissionList(username: $u, limit: 20) { title titleSlug timestamp }
  allQuestionsCount { difficulty count }
}`;

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': status === 200 ? 'public, max-age=600' : 'no-store' },
});

export async function lookupLeetCode(username) {
  const u = String(username || '').trim();
  if (!/^[A-Za-z0-9_-]{1,40}$/.test(u)) return json({ error: 'That doesn’t look like a LeetCode username.' }, 400);
  let res;
  try {
    res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Referer: 'https://leetcode.com', 'User-Agent': 'Mozilla/5.0 PrepHub' },
      body: JSON.stringify({ query: LC_QUERY, variables: { u } }),
    });
  } catch {
    return json({ error: 'Couldn’t reach LeetCode. Try again in a minute.' }, 502);
  }
  if (!res.ok) return json({ error: `LeetCode answered ${res.status}. Try again shortly.` }, 502);
  const body = await res.json();
  if (!body?.data?.matchedUser) return json({ error: `No public LeetCode profile called “${u}”.` }, 404);
  return json(body.data);
}
