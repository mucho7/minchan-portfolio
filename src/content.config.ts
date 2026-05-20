import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    order: z.number(),
    period: z.string(),
    role: z.string(),
    skills: z.array(z.string()),
    metrics: z.array(z.string())
  })
});

export const collections = {
  'case-studies': caseStudies
};
