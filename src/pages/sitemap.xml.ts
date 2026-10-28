import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, formatISO, sortByDateDesc } from '../lib/site';

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL(SITE.url);
  const work = (await getCollection('work')).sort((a, b) => a.data.order - b.data.order);
  const essays = sortByDateDesc(await getCollection('writing'));
  const originals = await getCollection('originals');
  const stories = await getCollection('stories');

  const staticPaths = ['/', '/work/', '/writing/', '/about/', '/now/', '/guestbook/', '/contact/', '/colophon/'];
  const latest = essays[0]?.data.date ?? new Date('2026-10-28T00:00:00Z');

  const url = (path: string, lastmod?: string) =>
    `<url><loc>${new URL(path, base)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`;

  const urls = [
    ...staticPaths.map((path) => url(path, path === '/' ? formatISO(latest) : undefined)),
    ...work.map((entry) => url(`/work/${entry.id}/`)),
    ...essays.map((entry) => url(`/writing/${entry.id}/`, formatISO(entry.data.date))),
    ...originals.map((entry) => url(`/writing/${entry.data.essay}/original/`, formatISO(entry.data.date))),
    ...stories.map((entry) => url(`/writing/${entry.data.essay}/story/`, formatISO(entry.data.date))),
  ].join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
