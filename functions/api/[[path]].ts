/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
  ADMIN_PASSWORD?: string;
  SESSION_SECRET?: string;
  IP_SALT?: string;
}

type GuestbookRow = {
  id: number;
  name: string;
  website: string | null;
  message: string;
  created_at: string;
  status: string;
};

type MessageRow = {
  id: number;
  name: string;
  email: string | null;
  subject: string | null;
  message: string;
  created_at: string;
  is_read: number;
};

type PageRow = {
  path: string;
  count: number;
  updated_at: string;
};

class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const SESSION_COOKIE = 'bv_admin';
const SESSION_TTL = 60 * 60 * 12;

const encoder = new TextEncoder();

const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...headers,
    },
  });

const base64url = (bytes: Uint8Array) => {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const hmac = async (value: string, secret: string) => {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return base64url(new Uint8Array(signature));
};

const sha256 = async (value: string) => {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return base64url(new Uint8Array(digest));
};

const timingSafeEqual = (a: string, b: string) => {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let index = 0; index < a.length; index += 1) {
    result |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return result === 0;
};

const getCookie = (request: Request, name: string) => {
  const header = request.headers.get('Cookie');
  if (!header) return null;
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return rest.join('=');
  }
  return null;
};

const createSession = async (secret: string) => {
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL;
  const signature = await hmac(String(expires), secret);
  return `${expires}.${signature}`;
};

const verifySession = async (request: Request, secret: string) => {
  const token = getCookie(request, SESSION_COOKIE);
  if (!token) return false;
  const [expiresRaw, signature] = token.split('.');
  const expires = Number(expiresRaw);
  if (!expiresRaw || !signature || !Number.isFinite(expires)) return false;
  if (expires < Math.floor(Date.now() / 1000)) return false;
  const expected = await hmac(expiresRaw, secret);
  return timingSafeEqual(signature, expected);
};

const sessionCookie = (token: string, request: Request) => {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL}${secure}`;
};

const clearSessionCookie = (request: Request) => {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${SESSION_COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure}`;
};

const getClientIp = (request: Request) =>
  request.headers.get('CF-Connecting-IP') ||
  request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
  'unknown';

const hashIp = async (request: Request, salt: string) => sha256(`${salt}:${getClientIp(request)}`);

const sameOrigin = (request: Request) => {
  const origin = request.headers.get('Origin');
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
};

const readJson = async (request: Request) => {
  const length = Number(request.headers.get('Content-Length') || 0);
  if (length > 20_000) throw new HttpError(413, 'Payload too large.');
  const text = await request.text();
  if (text.length > 20_000) throw new HttpError(413, 'Payload too large.');
  try {
    const value = JSON.parse(text);
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new HttpError(400, 'Invalid JSON body.');
    }
    return value as Record<string, unknown>;
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(400, 'Invalid JSON body.');
  }
};

const cleanText = (value: unknown, max: number, field: string) => {
  if (typeof value !== 'string') throw new HttpError(400, `${field} is required.`);
  const normalized = value
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim();
  if (!normalized) throw new HttpError(400, `${field} is required.`);
  if (normalized.length > max) throw new HttpError(400, `${field} is too long.`);
  return normalized;
};

const optionalText = (value: unknown, max: number) => {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string') return null;
  const normalized = value.replace(/\s+/g, ' ').trim();
  return normalized ? normalized.slice(0, max) : null;
};

const safeWebsite = (value: unknown) => {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string' || value.length > 200) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
};

const safeEmail = (value: unknown) => {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string' || value.length > 120) return null;
  const email = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
};

const looksLikeSpam = (message: string) => {
  const links = message.match(/https?:\/\//gi)?.length ?? 0;
  if (links > 2) return true;
  return /<\s*(script|iframe|object|embed)/i.test(message);
};

const rateLimit = async (
  db: D1Database,
  key: string,
  windowSeconds: number,
  max: number
) => {
  const now = Date.now();
  const cutoff = new Date(now - windowSeconds * 1000).toISOString();
  const row = await db
    .prepare('SELECT COUNT(*) AS total FROM rate_limits WHERE key = ? AND created_at > ?')
    .bind(key, cutoff)
    .first<{ total: number }>();

  if ((row?.total ?? 0) >= max) return false;

  await db
    .prepare('INSERT INTO rate_limits (key, created_at) VALUES (?, ?)')
    .bind(key, new Date(now).toISOString())
    .run();

  if (Math.random() < 0.03) {
    await db
      .prepare('DELETE FROM rate_limits WHERE created_at < ?')
      .bind(new Date(now - 86_400_000).toISOString())
      .run();
  }

  return true;
};

const requireAdmin = async (request: Request, env: Env) => {
  if (!env.SESSION_SECRET) throw new HttpError(500, 'Admin session is not configured.');
  const valid = await verifySession(request, env.SESSION_SECRET);
  if (!valid) throw new HttpError(401, 'Sign in required.');
};

const adminMutationGuard = (request: Request) => {
  if (!sameOrigin(request)) throw new HttpError(403, 'Cross-origin request blocked.');
};

const normalizePath = (value: unknown) => {
  if (typeof value !== 'string') return null;
  const path = value.split('?')[0].split('#')[0].slice(0, 200);
  if (!path.startsWith('/') || path.startsWith('//')) return null;
  if (path.startsWith('/admin') || path.startsWith('/api')) return null;
  return path;
};

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const segments = url.pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean);
  const method = request.method.toUpperCase();

  try {
    if (segments[0] === 'health' && method === 'GET') {
      return json({ ok: true, service: 'budaovoid-api' });
    }

    if (segments[0] === 'views' && method === 'GET') {
      const path = normalizePath(url.searchParams.get('path'));
      if (!path) throw new HttpError(400, 'A valid path is required.');
      const row = await env.DB.prepare('SELECT count FROM page_views WHERE path = ?')
        .bind(path)
        .first<{ count: number }>();
      return json({ count: row?.count ?? 0 });
    }

    if (segments[0] === 'views' && method === 'POST') {
      if (!sameOrigin(request)) throw new HttpError(403, 'Cross-origin request blocked.');
      const body = await readJson(request);
      const path = normalizePath(body.path);
      if (!path) throw new HttpError(400, 'A valid path is required.');
      const now = new Date().toISOString();
      const row = await env.DB.prepare(
        `INSERT INTO page_views (path, count, updated_at) VALUES (?, 1, ?)
         ON CONFLICT(path) DO UPDATE SET count = count + 1, updated_at = excluded.updated_at
         RETURNING count`
      )
        .bind(path, now)
        .first<{ count: number }>();
      return json({ count: row?.count ?? 1 });
    }

    if (segments[0] === 'guestbook' && method === 'GET') {
      const requested = Number.parseInt(url.searchParams.get('limit') || '40', 10);
      const limit = Number.isFinite(requested) ? Math.min(100, Math.max(1, requested)) : 40;
      const result = await env.DB.prepare(
        `SELECT id, name, website, message, created_at
         FROM guestbook
         WHERE status = 'published'
         ORDER BY created_at DESC
         LIMIT ?`
      )
        .bind(limit)
        .all<Omit<GuestbookRow, 'status'>>();
      return json({ entries: result.results ?? [] });
    }

    if (segments[0] === 'guestbook' && method === 'POST') {
      if (!sameOrigin(request)) throw new HttpError(403, 'Cross-origin request blocked.');
      const body = await readJson(request);
      if (typeof body.company === 'string' && body.company.trim()) {
        return json({ ok: true });
      }

      const name = cleanText(body.name, 60, 'Name');
      const message = cleanText(body.message, 1000, 'Message');
      const website = safeWebsite(body.website);
      const ipHash = await hashIp(request, env.IP_SALT || 'local-dev-salt');
      const allowed = await rateLimit(env.DB, `guestbook:${ipHash}`, 600, 3);
      if (!allowed) throw new HttpError(429, 'Too many notes. Try again in a few minutes.');

      const status = looksLikeSpam(message) ? 'pending' : 'published';
      const createdAt = new Date().toISOString();
      const entry = await env.DB.prepare(
        `INSERT INTO guestbook (name, website, message, created_at, ip_hash, user_agent, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         RETURNING id, name, website, message, created_at`
      )
        .bind(
          name,
          website,
          message,
          createdAt,
          ipHash,
          (request.headers.get('User-Agent') || '').slice(0, 300),
          status
        )
        .first<Omit<GuestbookRow, 'status'>>();

      return json({ ok: true, pending: status === 'pending', entry });
    }

    if (segments[0] === 'contact' && method === 'POST') {
      if (!sameOrigin(request)) throw new HttpError(403, 'Cross-origin request blocked.');
      const body = await readJson(request);
      if (typeof body.company === 'string' && body.company.trim()) {
        return json({ ok: true });
      }

      const name = cleanText(body.name, 60, 'Name');
      const message = cleanText(body.message, 4000, 'Message');
      const email = safeEmail(body.email);
      const ipHash = await hashIp(request, env.IP_SALT || 'local-dev-salt');
      const allowed = await rateLimit(env.DB, `contact:${ipHash}`, 3600, 3);
      if (!allowed) throw new HttpError(429, 'Too many messages. Try again later.');

      await env.DB.prepare(
        `INSERT INTO messages (name, email, message, created_at, ip_hash)
         VALUES (?, ?, ?, ?, ?)`
      )
        .bind(name, email, message, new Date().toISOString(), ipHash)
        .run();

      return json({ ok: true });
    }

    if (segments[0] === 'admin' && segments[1] === 'session' && method === 'GET') {
      const authenticated = env.SESSION_SECRET
        ? await verifySession(request, env.SESSION_SECRET)
        : false;
      return json({ authenticated });
    }

    if (segments[0] === 'admin' && segments[1] === 'login' && method === 'POST') {
      adminMutationGuard(request);
      if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET) {
        throw new HttpError(500, 'Admin access is not configured.');
      }
      const ipHash = await hashIp(request, env.IP_SALT || 'local-dev-salt');
      const allowed = await rateLimit(env.DB, `login:${ipHash}`, 900, 8);
      if (!allowed) throw new HttpError(429, 'Too many attempts. Try again later.');

      const body = await readJson(request);
      const password = typeof body.password === 'string' ? body.password : '';
      if (!password || !timingSafeEqual(password, env.ADMIN_PASSWORD)) {
        throw new HttpError(401, 'Incorrect password.');
      }

      const token = await createSession(env.SESSION_SECRET);
      return json({ ok: true }, 200, {
        'Set-Cookie': sessionCookie(token, request),
      });
    }

    if (segments[0] === 'admin' && segments[1] === 'logout' && method === 'POST') {
      return json({ ok: true }, 200, {
        'Set-Cookie': clearSessionCookie(request),
      });
    }

    if (segments[0] === 'admin' && segments[1] === 'overview' && method === 'GET') {
      await requireAdmin(request, env);
      const [views, entries, unread, pages, messages] = await Promise.all([
        env.DB.prepare('SELECT COALESCE(SUM(count), 0) AS total FROM page_views').first<{ total: number }>(),
        env.DB.prepare('SELECT COUNT(*) AS total FROM guestbook').first<{ total: number }>(),
        env.DB.prepare('SELECT COUNT(*) AS total FROM messages WHERE is_read = 0').first<{ total: number }>(),
        env.DB.prepare(
          'SELECT path, count, updated_at FROM page_views ORDER BY count DESC LIMIT 50'
        ).all<PageRow>(),
        env.DB.prepare(
          `SELECT id, name, email, subject, message, created_at, is_read
           FROM messages ORDER BY created_at DESC LIMIT 50`
        ).all<MessageRow>(),
      ]);

      const guestbook = await env.DB.prepare(
        `SELECT id, name, website, message, created_at, status
         FROM guestbook ORDER BY created_at DESC LIMIT 50`
      ).all<GuestbookRow>();

      return json({
        stats: {
          total_views: views?.total ?? 0,
          guestbook_total: entries?.total ?? 0,
          unread_messages: unread?.total ?? 0,
        },
        guestbook: guestbook.results ?? [],
        messages: messages.results ?? [],
        pages: pages.results ?? [],
      });
    }

    if (segments[0] === 'admin' && segments[1] === 'guestbook' && segments[2] && method === 'POST') {
      await requireAdmin(request, env);
      adminMutationGuard(request);
      const id = Number(segments[2]);
      if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'Invalid entry.');
      const body = await readJson(request);
      const status = body.status;
      if (status !== 'published' && status !== 'hidden' && status !== 'pending') {
        throw new HttpError(400, 'Invalid status.');
      }
      await env.DB.prepare('UPDATE guestbook SET status = ? WHERE id = ?').bind(status, id).run();
      return json({ ok: true });
    }

    if (segments[0] === 'admin' && segments[1] === 'guestbook' && segments[2] && method === 'DELETE') {
      await requireAdmin(request, env);
      adminMutationGuard(request);
      const id = Number(segments[2]);
      if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'Invalid entry.');
      await env.DB.prepare('DELETE FROM guestbook WHERE id = ?').bind(id).run();
      return json({ ok: true });
    }

    if (
      segments[0] === 'admin' &&
      segments[1] === 'messages' &&
      segments[2] &&
      segments[3] === 'read' &&
      method === 'POST'
    ) {
      await requireAdmin(request, env);
      adminMutationGuard(request);
      const id = Number(segments[2]);
      if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'Invalid message.');
      await env.DB.prepare('UPDATE messages SET is_read = 1 WHERE id = ?').bind(id).run();
      return json({ ok: true });
    }

    if (segments[0] === 'admin' && segments[1] === 'messages' && segments[2] && method === 'DELETE') {
      await requireAdmin(request, env);
      adminMutationGuard(request);
      const id = Number(segments[2]);
      if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'Invalid message.');
      await env.DB.prepare('DELETE FROM messages WHERE id = ?').bind(id).run();
      return json({ ok: true });
    }

    return json({ error: 'Not found.' }, 404);
  } catch (error) {
    if (error instanceof HttpError) {
      return json({ error: error.message }, error.status);
    }
    console.error('API error', error);
    return json({ error: 'Server error.' }, 500);
  }
};
