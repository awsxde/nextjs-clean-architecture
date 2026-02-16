import type { Record, RecordInsert } from '@/src/entities/models/record';
import type { ITransaction } from '@/src/entities/models/transaction.interface';

export interface IRecordsRepository {
  createRecord(record: RecordInsert, tx?: ITransaction): Promise<Record>;
  getRecord(id: number): Promise<Record | undefined>;
  getRecordsForUser(userId: string): Promise<Record[]>;
  updateRecord(
    id: number,
    input: Partial<RecordInsert>,
    tx?: ITransaction
  ): Promise<Record>;
  deleteRecord(id: number, tx?: ITransaction): Promise<void>;
}
