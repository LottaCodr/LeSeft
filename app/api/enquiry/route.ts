import { NextResponse, type NextRequest } from 'next/server';
import { createHmac } from 'node:crypto';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { z } from 'zod';

export const runtime = 'nodejs';
const input = z.object({
  name: z.string().trim().min(1).max(100),
  organisation: z.string().trim().max(120).optional().default(''),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional().default(''),
  category: z.enum(['General', 'Partnership', 'Commodity', 'Project & equipment']),
  subject: z.string().trim().max(150).optional().default(''),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(0).optional().default(''),
  turnstileToken: z.string().min(1).max(2048)
}).strict();
const reply = (data: object, status: number) => NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(req: NextRequest) {
  const { RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL, TURNSTILE_SECRET_KEY, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = process.env;
  if (!RESEND_API_KEY || !CONTACT_FROM_EMAIL || !CONTACT_TO_EMAIL || !TURNSTILE_SECRET_KEY || !UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN || !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || !process.env.NEXT_PUBLIC_SITE_URL) return reply({ error: 'Enquiry delivery is not configured.' }, 503);
  let expectedHostname: string;
  try { const url = new URL(process.env.NEXT_PUBLIC_SITE_URL); if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') throw new Error('HTTPS required'); expectedHostname = url.hostname; } catch { return reply({ error: 'Enquiry delivery is not configured.' }, 503); }
  const origin = req.headers.get('origin');
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
  if (origin) { try { if (new URL(origin).host !== host) return reply({ error: 'Invalid request origin.' }, 403); } catch { return reply({ error: 'Invalid request origin.' }, 403); } }
  if (!req.headers.get('content-type')?.toLowerCase().includes('application/json')) return reply({ error: 'Invalid content type.' }, 415);
  if (Number(req.headers.get('content-length') || 0) > 16_000) return reply({ error: 'Your message is too large.' }, 413);
  // Trust these headers only when the hosting provider strips/replaces client-supplied forwarded headers.
  const ip = (req.headers.get('cf-connecting-ip') || req.headers.get('x-vercel-forwarded-for') || req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim().slice(0, 100);
  const rateKey = createHmac('sha256', TURNSTILE_SECRET_KEY).update(ip).digest('hex');
  try {
    const limiter = new Ratelimit({ redis: new Redis({ url: UPSTASH_REDIS_REST_URL, token: UPSTASH_REDIS_REST_TOKEN }), limiter: Ratelimit.slidingWindow(5, '1 h'), prefix: 'leseft:enquiry', analytics: false });
    const result = await limiter.limit(rateKey);
    if (!result.success) return reply({ error: 'Too many enquiries. Please try again later.' }, 429);
  } catch { console.error('Enquiry rate-limit service failed'); return reply({ error: 'Your enquiry could not be sent. Please try again later.' }, 503); }
  let body: unknown;
  try {
    const reader = req.body?.getReader();
    if (!reader) return reply({ error: 'Invalid request.' }, 400);
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) { const { done, value } = await reader.read(); if (done) break; size += value.byteLength; if (size > 16_000) { await reader.cancel(); return reply({ error: 'Your message is too large.' }, 413); } chunks.push(value); }
    body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch { return reply({ error: 'Invalid request.' }, 400); }
  const parsed = input.safeParse(body);
  if (!parsed.success) return reply({ error: 'Please check the form fields and try again.' }, 400);
  try {
    const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ secret: TURNSTILE_SECRET_KEY, response: parsed.data.turnstileToken }), signal: AbortSignal.timeout(10_000), cache: 'no-store' });
    const verified = await verification.json() as { success?: boolean; hostname?: string };
    if (!verification.ok || !verified.success || verified.hostname !== expectedHostname) return reply({ error: 'The security check failed. Please try again.' }, 400);
    const { name, organisation, email, phone, category, subject, message } = parsed.data;
    const messageText = [`Enquiry category: ${category}`, `Name: ${name}`, `Organisation: ${organisation || 'Not provided'}`, `Email: ${email}`, `Phone: ${phone || 'Not provided'}`, `Subject: ${subject || 'Not provided'}`, '', 'Message:', message].join('\n');
    const send = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: CONTACT_FROM_EMAIL, to: [CONTACT_TO_EMAIL], reply_to: email, subject: `LeSeft website enquiry — ${category}`, text: messageText }), signal: AbortSignal.timeout(10_000), cache: 'no-store' });
    if (!send.ok) { console.error('Enquiry email provider failed', send.status); return reply({ error: 'Your enquiry could not be sent. Please try again later.' }, 502); }
    return reply({ ok: true }, 200);
  } catch { console.error('Enquiry security or delivery service failed'); return reply({ error: 'Your enquiry could not be sent. Please try again later.' }, 503); }
}
