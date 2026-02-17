import type { Record } from '@/src/entities/models/record';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IRecordsRepository } from '@/src/application/repositories/records.repository.interface';

export type IGetRecordUseCase = ReturnType<typeof getRecordUseCase>;

export const getRecordUseCase =
  (
    instrumentationService: IInstrumentationService,
    recordsRepository: IRecordsRepository
  ) =>
  (id: number): Promise<Record | undefined> => {
    return instrumentationService.startSpan(
      { name: 'getRecord UseCase', op: 'function' },
      async () => {
        return await recordsRepository.getRecord(id);
      }
    );
  };
