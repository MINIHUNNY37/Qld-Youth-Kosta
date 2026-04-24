import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email().max(200),
  name: z.string().trim().min(1).max(80),
  password: z.string().min(8).max(200),
});

export const loginSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1).max(200),
});

export const prayerNoteSchema = z.object({
  title: z.string().trim().min(1).max(120),
  content: z.string().trim().min(1).max(4000),
  authorName: z.string().trim().max(40).optional(),
  isAnonymous: z.boolean().optional().default(false),
});

export const commentSchema = z.object({
  content: z.string().trim().min(1).max(2000),
});

export const resourceMetaSchema = z.object({
  title: z.string().trim().min(1).max(150),
  description: z.string().trim().max(1000).optional(),
});

export const lyricsResourceSchema = z.object({
  title: z.string().trim().min(1).max(150),
  description: z.string().trim().max(1000).optional(),
  lyrics: z.string().trim().min(1).max(20000),
});

export const ALLOWED_MIME = {
  "application/pdf": "PDF",
  "image/png": "IMAGE",
  "image/jpeg": "IMAGE",
  "image/gif": "IMAGE",
  "image/webp": "IMAGE",
} as const;

export type AllowedMime = keyof typeof ALLOWED_MIME;
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8 MB
