// Isolated smoke tests with mocked Redis, Turnstile and Resend. No real messages are sent.
const esbuild = require('esbuild');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const temp = path.join(process.cwd(), '.tmp-enquiry-test.cjs');
(async () => {
  await esbuild.build({ entryPoints: ['app/api/enquiry/route.ts'], bundle: true, platform: 'node', format: 'cjs', outfile: temp,
    external: ['next/server', 'zod'], plugins: [{ name: 'mock-redis', setup(build) {
      build.onResolve({ filter: /^@upstash\/(ratelimit|redis)$/ }, args => ({ path: args.path, namespace: 'mock' }));
      build.onLoad({ filter: /.*/, namespace: 'mock' }, args => ({ loader: 'js', contents: args.path.endsWith('redis')
        ? 'export class Redis { constructor() {} }'
        : 'export class Ratelimit { constructor() {} static slidingWindow() { return {} } async limit() { if(globalThis.__redisThrows) throw Error("redis"); return { success: globalThis.__allowRate !== false } } }' }));
    }}]
  });
  const { POST } = require(temp);
  const { NextRequest } = require('next/server');
  const valid = { name: 'Test Name', organisation: 'Test Org', email: 'test@example.org', phone: '', category: 'Commodity', subject: 'Sample', message: 'A test enquiry message.', website: '', turnstileToken: 'test-token' };
  const env = { RESEND_API_KEY: 'test', CONTACT_FROM_EMAIL: 'sender@example.org', CONTACT_TO_EMAIL: 'team@example.org', TURNSTILE_SECRET_KEY: 'test-secret', NEXT_PUBLIC_TURNSTILE_SITE_KEY: 'test-site-key', UPSTASH_REDIS_REST_URL: 'https://example.org', UPSTASH_REDIS_REST_TOKEN: 'test', NEXT_PUBLIC_SITE_URL: 'https://www.example.com' };
  const set = () => Object.assign(process.env, env, { NODE_ENV: 'production' });
  let captcha = { success: true, hostname: 'www.example.com' }, providerStatus = 200, mailBody = null, emailCalls = 0;
  global.fetch = async (url, opts) => {
    if (String(url).includes('challenges.cloudflare.com')) return new Response(JSON.stringify(captcha), {status:200, headers:{'Content-Type':'application/json'}});
    if (String(url).includes('api.resend.com')) { emailCalls++; mailBody=JSON.parse(opts.body); return new Response('{}', {status:providerStatus,headers:{'Content-Type':'application/json'}}); }
    throw Error('Unexpected external request: '+url);
  };
  const request = (body, origin = 'https://www.example.com', extras = {}) => new NextRequest('https://www.example.com/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json', origin, host: 'www.example.com', ...extras }, body: typeof body === 'string' ? body : JSON.stringify(body) });
  const check = async (name, req, expected) => { const response = await POST(req); assert.equal(response.status, expected, name); console.log(`${name}: ${response.status}`); };
  set(); delete process.env.RESEND_API_KEY; await check('Missing configuration', request(valid), 503); set();
  await check('Cross-origin request', request(valid, 'https://other.example.org'), 403);
  await check('Oversized body', request('x'.repeat(17000)), 413);
  global.__allowRate=false; await check('Rate limit', request(valid), 429); global.__allowRate=true;
  global.__redisThrows=true; await check('Redis unavailable (fail closed)', request(valid), 503); global.__redisThrows=false;
  await check('Malformed JSON', request('{bad'), 400);
  await check('Invalid fields', request({...valid,email:'not-an-email'}), 400);
  await check('Honeypot', request({...valid,website:'spam'}), 400);
  captcha={success:false, hostname:'www.example.com'}; await check('Failed challenge', request(valid), 400);
  captcha={success:true, hostname:'other.example.com'}; await check('Wrong challenge hostname', request(valid), 400);
  captcha={success:true, hostname:'www.example.com'}; providerStatus=500; await check('Delivery service failure', request(valid), 502);
  providerStatus=200; await check('Valid mocked enquiry', request(valid), 200);
  assert.equal(mailBody.to[0], 'team@example.org'); assert.equal(mailBody.reply_to, 'test@example.org'); assert.ok(mailBody.text.includes('A test enquiry message.'));
  assert.equal(emailCalls, 2, 'email attempted only after valid challenge');
  console.log('All mocked enquiry tests passed. No real provider, email or CMS was contacted.');
})().catch(error=>{ console.error(error); process.exitCode=1; }).finally(()=>{ try { fs.unlinkSync(temp); } catch {} });
