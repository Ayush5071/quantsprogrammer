import { z } from 'zod';

export const GithubRepoSchema = z.object({
  repo: z.string().optional(),
  commitCount: z.number().nullable().optional(),
  stars: z.number().nullable().optional(),
  size: z.number().nullable().optional(),
  html_url: z.string().optional(),
});

export const GithubResponseSchema = z.object({
  username: z.string(),
  user: z.any().optional(),
  repos: z.array(z.any()).optional(),
  events: z.array(z.any()).optional(),
  topLanguages: z.array(z.object({ language: z.string(), bytes: z.number().optional(), count: z.number().optional() })).optional(),
  repoCommitCounts: z.array(GithubRepoSchema).optional(),
});

export const LeetCodeSchema = z.object({
  username: z.string(),
  ranking: z.number().optional(),
  totalSolved: z.number().optional(),
  calendarArr: z.array(z.object({ day: z.string(), value: z.number() })).optional(),
});

export const CodeforcesSchema = z.object({ username: z.string(), rating: z.number().optional(), problemsSolved: z.number().optional(), submissions: z.array(z.any()).optional() });

export default { GithubRepoSchema, GithubResponseSchema, LeetCodeSchema, CodeforcesSchema };
