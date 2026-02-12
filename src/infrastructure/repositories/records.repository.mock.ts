import { IRecordsRepository } from '@/src/application/repositories/records.repository.interface';
import { Record, RecordInsert } from '@/src/entities/models/record';

export class MockRecordsRepository implements IRecordsRepository {
  private _records: Record[];

  constructor() {
    this._records = [];
  }

  async createRecord(record: RecordInsert): Promise<Record> {
    const id = this._records.length;
    const created = { ...record, id };
    this._records.push(created);
    return created;
  }

  async getRecord(id: number): Promise<Record | undefined> {
    const record = this._records.find((t) => t.id === id);
    return record;
  }

  async getRecordsForUser(userId: string): Promise<Record[]> {
    const usersRecords = this._records.filter((t) => t.userId === userId);
    return usersRecords;
  }

  async updateRecord(
    id: number,
    input: Partial<RecordInsert>
  ): Promise<Record> {
    const existingIndex = this._records.findIndex((t) => t.id === id);
    const updated = {
      ...this._records[existingIndex],
      ...input,
    };
    this._records[existingIndex] = updated;
    return updated;
  }

  async deleteRecord(id: number): Promise<void> {
    const existingIndex = this._records.findIndex((t) => t.id === id);
    if (existingIndex > -1) {
      delete this._records[existingIndex];
      this._records = this._records.filter(Boolean);
    }
  }
}
