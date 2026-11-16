// Vercel serverless function: /api/leetcode?u=<username>. Same proxy the dev server and Cloudflare worker use.
import { lookupLeetCode } from '../server/leetcode-proxy.js';

export async function GET(request) {
  return lookupLeetCode(new URL(request.url).searchParams.get('u'));
}
