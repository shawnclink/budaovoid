import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, formatISO, sortByDateDesc } from '../lib/site';

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL(SITE.url);
  const essays = sortByDateDesc(await getCollection('writing'));

  const items = essays
    .map((entry) => {
      const url = new URL(`/writing/${entry.id}/`, base).toString();
      return `<item>
  <title>${escapeXml(entry.data.title)}</title>
  <link>${url}</link>
  <guid isPermaLink="true">${url}</guid>
  <pubDate>${entry.data.date.toUTCString()}</pubDate>
  <category>${escapeXml(entry.data.category)}</category>
  <description>${escapeXml(entry.data.dek)}</description>
</item>`;
    })
    .join('\n');

  const latest = essays[0]?.data.date ?? new Date('2026-10-28T00:00:00Z');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${SITE.name} — Writing</title>
  <link>${new URL('/writing/', base)}</link>
  <description>${escapeXml(SITE.description)}</description>
  <language>en</language>
  <lastBuildDate>${latest.toUTCString()}</lastBuildDate>
  <atom:link href="${new URL('/rss.xml', base)}" rel="self" type="application/rss+xml" />
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
