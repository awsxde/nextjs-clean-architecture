import type { Record, RecordInsert } from '@/src/entities/models/record';

export interface IRecordsRepository {
  createRecord(record: RecordInsert, tx?: any): Promise<Record>;
  getRecord(id: number): Promise<Record | undefined>;
  getRecordsForUser(userId: string): Promise<Record[]>;
  updateRecord(
    id: number,
    input: Partial<RecordInsert>,
    tx?: any
  ): Promise<Record>;
  deleteRecord(id: number, tx?: any): Promise<void>;
}
