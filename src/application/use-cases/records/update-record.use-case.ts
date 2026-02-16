import { NotFoundError } from '@/src/entities/errors/common';
import { UnauthorizedError } from '@/src/entities/errors/auth';
import type { Record } from '@/src/entities/models/record';
import type { ITransaction } from '@/src/entities/models/transaction.interface';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IRecordsRepository } from '@/src/application/repositories/records.repository.interface';

export type IUpdateRecordUseCase = ReturnType<typeof updateRecordUseCase>;

export const updateRecordUseCase =
  (
    instrumentationService: IInstrumentationService,
    recordsRepository: IRecordsRepository
  ) =>
  (
    input: {
      id: number;
      description?: string;
      amount?: number;
      type?: string;
      date?: string;
      category?: string;
    },
    userId: string,
    tx?: ITransaction
  ): Promise<Record> => {
    return instrumentationService.startSpan(
      { name: 'updateRecord Use Case', op: 'function' },
      async () => {
        const record = await recordsRepository.getRecord(input.id);

        if (!record) {
          throw new NotFoundError('Record does not exist');
        }

        if (record.userId !== userId) {
          throw new UnauthorizedError(
            'Cannot delete record. Reason: unauthorized'
          );
        }

        const updatedRecord = await recordsRepository.updateRecord(
          input.id,
          {
            ...input,
            userId,
          },
          tx
        );

        return updatedRecord;
      }
    );
  };
