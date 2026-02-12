import { IGetRecordsForUserUseCase } from '@/src/application/use-cases/records/get-records-for-user.use-case';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { Record } from '@/src/entities/models/record';
import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';

function presenter(
  records: Record[],
  instrumentationService: IInstrumentationService
) {
  return instrumentationService.startSpan(
    { name: 'getRecordsForUser Presenter', op: 'serialize' },
    () =>
      records.map((record) => ({
        id: record.id,
        description: record.description,
        amount: record.amount,
        type: record.type,
        date: record.date,
        category: record.category,
        userId: record.userId,
      }))
  );
}

export type IGetRecordsForUserController = ReturnType<
  typeof getRecordsForUserController
>;

export const getRecordsForUserController =
  (
    instrumentationService: IInstrumentationService,
    authenticationService: IAuthenticationService,
    getRecordsForUserUseCase: IGetRecordsForUserUseCase
  ) =>
  async (
    sessionId: string | undefined
  ): Promise<ReturnType<typeof presenter>> => {
    return await instrumentationService.startSpan(
      { name: 'getRecordsForUser Controller' },
      async () => {
        if (!sessionId) {
          throw new UnauthenticatedError(
            'Must be logged in to create a record'
          );
        }

        const { session } =
          await authenticationService.validateSession(sessionId);

        const records = await getRecordsForUserUseCase(session.userId);

        return presenter(records, instrumentationService);
      }
    );
  };
