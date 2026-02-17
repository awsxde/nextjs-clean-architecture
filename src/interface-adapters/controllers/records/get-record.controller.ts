import { z } from 'zod';

import { IGetRecordUseCase } from '@/src/application/use-cases/records/get-record.use-case';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { Record } from '@/src/entities/models/record';
import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { InputParseError } from '@/src/entities/errors/common';

function presenter(
  record: Record | null,
  instrumentationService: IInstrumentationService
) {
  return instrumentationService.startSpan(
    { name: 'getRecord Presenter', op: 'serialize' },
    () => {
      if (!record) return null;
      return {
        id: record.id,
        description: record.description,
        amount: record.amount,
        type: record.type,
        date: record.date,
        category: record.category,
        userId: record.userId,
      };
    }
  );
}

const inputSchema = z.object({
  recordId: z.number().min(1),
});

export type IGetRecordController = ReturnType<typeof getRecordController>;

export const getRecordController =
  (
    instrumentationService: IInstrumentationService,
    authenticationService: IAuthenticationService,
    getRecordUseCase: IGetRecordUseCase
  ) =>
  async (
    input: Partial<z.infer<typeof inputSchema>>,
    sessionId: string | undefined
  ): Promise<ReturnType<typeof presenter>> => {
    return await instrumentationService.startSpan(
      { name: 'getRecord Controller' },
      async () => {
        if (!sessionId) {
          throw new UnauthenticatedError(
            'Must be logged in to create a record'
          );
        }

        const { user } = await authenticationService.validateSession(sessionId);

        const { data, error: inputParseError } = inputSchema.safeParse(input);

        if (inputParseError) {
          throw new InputParseError('Invalid data', { cause: inputParseError });
        }

        const record = await getRecordUseCase(data.recordId);

        return presenter(record ?? null, instrumentationService);
      }
    );
  };
