import { z } from 'zod';

import { IDeleteRecordUseCase } from '@/src/application/use-cases/records/delete-record.use-case';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';
import { Record } from '@/src/entities/models/record';
import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { ITransactionManagerService } from '@/src/application/services/transaction-manager.service.interface';

function presenter(
  record: Record | null,
  instrumentationService: IInstrumentationService
) {
  return instrumentationService.startSpan(
    { name: 'deleteRecord Presenter', op: 'serialize' },
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

export type IDeleteRecordController = ReturnType<typeof deleteRecordController>;

export const deleteRecordController =
  (
    instrumentationService: IInstrumentationService,
    authenticationService: IAuthenticationService,
    transactionManagerService: ITransactionManagerService,
    deleteRecordUseCase: IDeleteRecordUseCase
  ) =>
  async (
    input: Partial<z.infer<typeof inputSchema>>,
    sessionId: string | undefined
  ): Promise<ReturnType<typeof presenter>> => {
    return await instrumentationService.startSpan(
      {
        name: 'deleteRecord Controller',
      },
      async () => {
        if (!sessionId) {
          throw new UnauthenticatedError(
            'Must be logged in to delete a record'
          );
        }
        const { user } = await authenticationService.validateSession(sessionId);

        const { data, error: inputParseError } = inputSchema.safeParse(input);

        if (inputParseError) {
          throw new InputParseError('Invalid data', { cause: inputParseError });
        }

        const deletedRecord = await instrumentationService.startSpan(
          { name: 'Delete Record Transaction' },
          async () =>
            transactionManagerService.startTransaction(async (tx) => {
              try {
                return await deleteRecordUseCase(
                  { recordId: data.recordId },
                  user.id,
                  tx
                );
              } catch (err) {
                console.error('Rolling back!');
                tx.rollback();
              }
            })
        );
        return presenter(deletedRecord ?? null, instrumentationService);
      }
    );
  };
