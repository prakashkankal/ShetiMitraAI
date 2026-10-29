import { z } from 'zod'

export const createDetectionSchema = z.object({
  cropType: z.string().min(1).max(50),
  selectedLanguage: z.enum(['mr', 'hi', 'en']).optional(),
})
