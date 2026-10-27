import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    kicker: z.string(),
    dek: z.string(),
    period: z.string(),
    category: z.enum(['Hardware', 'Software', 'Systems', 'Agent tooling', 'Framework']),
    stack: z.array(z.string()).default([]),
    status: z.enum(['Shipped', 'Ongoing', 'Prototype', 'In progress']),
    featured: z.boolean().default(false),
    order: z.number(),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    dek: z.string(),
    date: z.coerce.date(),
    category: z.enum(['Philosophy', 'Systems', 'Notes']),
    readingTime: z.string(),
    pullQuote: z.string(),
    source: z.string().optional(),
    original: z.string().optional(),
  }),
});

export const collections = { work, writing };
