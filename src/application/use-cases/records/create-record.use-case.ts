import type { Record } from '@/src/entities/models/record';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IRecordsRepository } from '@/src/application/repositories/records.repository.interface';

export type ICreateRecordUseCase = ReturnType<typeof createRecordUseCase>;

export const createRecordUseCase =
  (
    instrumentationService: IInstrumentationService,
    recordsRepository: IRecordsRepository
  ) =>
  (
    input: {
      description: string;
      amount: number;
      type: string;
      date: string;
      category: string;
    },
    userId: string,
    tx?: any
  ): Promise<Record> => {
    return instrumentationService.startSpan(
      { name: 'createRecord Use Case', op: 'function' },
      async () => {
        const newRecord = await recordsRepository.createRecord(
          {
            description: input.description,
            amount: input.amount,
            type: input.type,
            date: input.date,
            category: input.category,
            userId,
          },
          tx
        );

        return newRecord;
      }
    );
  };
