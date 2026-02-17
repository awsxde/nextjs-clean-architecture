import { UnauthorizedError } from '@/src/entities/errors/auth';
import { NotFoundError } from '@/src/entities/errors/common';
import type { Record } from '@/src/entities/models/record';
import type { ITransaction } from '@/src/entities/models/transaction.interface';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IRecordsRepository } from '@/src/application/repositories/records.repository.interface';

export type IDeleteRecordUseCase = ReturnType<typeof deleteRecordUseCase>;

export const deleteRecordUseCase =
  (
    instrumentationService: IInstrumentationService,
    recordsRepository: IRecordsRepository
  ) =>
  (
    input: {
      recordId: number;
    },
    userId: string,
    tx?: ITransaction
  ): Promise<Record> => {
    return instrumentationService.startSpan(
      { name: 'deleteRecord Use Case', op: 'function' },
      async () => {
        const record = await recordsRepository.getRecord(input.recordId);

        if (!record) {
          throw new NotFoundError('Record does not exist');
        }

        if (record.userId !== userId) {
          throw new UnauthorizedError(
            'Cannot delete record. Reason: unauthorized'
          );
        }

        await recordsRepository.deleteRecord(record.id, tx);

        return record;
      }
    );
  };
