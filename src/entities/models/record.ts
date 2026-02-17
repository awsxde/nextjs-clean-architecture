import { z } from 'zod';

export const selectRecordSchema = z.object({
  id: z.number(),
  description: z.string(),
  amount: z.number(),
  type: z.string(),
  date: z.string(),
  category: z.string(),
  userId: z.string(),
});
export type Record = z.infer<typeof selectRecordSchema>;

export const insertRecordSchema = selectRecordSchema.pick({
  description: true,
  amount: true,
  type: true,
  date: true,
  category: true,
  userId: true,
});

export type RecordInsert = z.infer<typeof insertRecordSchema>;
