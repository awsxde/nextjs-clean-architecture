import type { Record } from '@/src/entities/models/record';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IRecordsRepository } from '@/src/application/repositories/records.repository.interface';

export type IGetRecordsForUserUseCase = ReturnType<
  typeof getRecordsForUserUseCase
>;

export const getRecordsForUserUseCase =
  (
    instrumentationService: IInstrumentationService,
    recordsRepository: IRecordsRepository
  ) =>
  (userId: string): Promise<Record[]> => {
    return instrumentationService.startSpan(
      { name: 'getRecordsForUser UseCase', op: 'function' },
      async () => {
        return await recordsRepository.getRecordsForUser(userId);
      }
    );
  };
