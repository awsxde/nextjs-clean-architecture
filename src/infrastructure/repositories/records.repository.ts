import { eq } from 'drizzle-orm';

import { db, Transaction } from '@/drizzle';
import { records } from '@/drizzle/schema';
import { IRecordsRepository } from '@/src/application/repositories/records.repository.interface';
import { DatabaseOperationError } from '@/src/entities/errors/common';
import { RecordInsert, Record } from '@/src/entities/models/record';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';

export class RecordsRepository implements IRecordsRepository {
  constructor(
    private readonly instrumentationService: IInstrumentationService,
    private readonly crashReporterService: ICrashReporterService
  ) {}

  async createRecord(record: RecordInsert, tx?: Transaction): Promise<Record> {
    const invoker = tx ?? db;

    return await this.instrumentationService.startSpan(
      { name: 'RecordsRepository > createRecord' },
      async () => {
        try {
          const query = invoker.insert(records).values(record).returning();

          const [created] = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );

          if (created) {
            return created;
          } else {
            throw new DatabaseOperationError('Cannot create record');
          }
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }

  async getRecord(id: number): Promise<Record | undefined> {
    return await this.instrumentationService.startSpan(
      { name: 'RecordsRepository > getRecord' },
      async () => {
        try {
          const query = db.query.records.findFirst({
            where: eq(records.id, id),
          });

          const record = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );

          return record;
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }

  async getRecordsForUser(userId: string): Promise<Record[]> {
    return await this.instrumentationService.startSpan(
      { name: 'RecordsRepository > getRecordsForUser' },
      async () => {
        try {
          const query = db.query.records.findMany({
            where: eq(records.userId, userId),
          });

          const usersRecords = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );
          return usersRecords;
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }

  async updateRecord(
    id: number,
    input: Partial<RecordInsert>,
    tx?: Transaction
  ): Promise<Record> {
    const invoker = tx ?? db;

    return await this.instrumentationService.startSpan(
      { name: 'RecordsRepository > updateRecord' },
      async () => {
        try {
          const query = invoker
            .update(records)
            .set(input)
            .where(eq(records.id, id))
            .returning();

          const [updated] = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );
          return updated;
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }

  async deleteRecord(id: number, tx?: Transaction): Promise<void> {
    const invoker = tx ?? db;

    await this.instrumentationService.startSpan(
      { name: 'RecordsRepository > deleteRecord' },
      async () => {
        try {
          const query = invoker
            .delete(records)
            .where(eq(records.id, id))
            .returning();

          await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }
}
