import { z } from 'zod';

import { IUpdateRecordUseCase } from '@/src/application/use-cases/records/update-record.use-case';
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
    { name: 'updateRecord Presenter', op: 'serialize' },
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
  id: z.number().min(1),
  description: z.string().min(1),
  amount: z.number().positive(),
  type: z.string().min(1),
  date: z.string().min(1),
  category: z.string().min(1),
});

export type IUpdateRecordController = ReturnType<typeof updateRecordController>;

export const updateRecordController =
  (
    instrumentationService: IInstrumentationService,
    authenticationService: IAuthenticationService,
    transactionManagerService: ITransactionManagerService,
    updateRecordUseCase: IUpdateRecordUseCase
  ) =>
  async (
    input: Partial<z.infer<typeof inputSchema>>,
    sessionId: string | undefined
  ): Promise<ReturnType<typeof presenter>> => {
    return await instrumentationService.startSpan(
      {
        name: 'updateRecord Controller',
      },
      async () => {
        if (!sessionId) {
          throw new UnauthenticatedError(
            'Must be logged in to update a record'
          );
        }
        const { user } = await authenticationService.validateSession(sessionId);

        const { data, error: inputParseError } = inputSchema.safeParse(input);

        if (inputParseError) {
          throw new InputParseError('Invalid data', { cause: inputParseError });
        }

        const record = await instrumentationService.startSpan(
          { name: 'Update Record Transaction' },
          async () =>
            transactionManagerService.startTransaction(async (tx) => {
              try {
                return await updateRecordUseCase(
                  {
                    id: data.id,
                    description: data.description,
                    amount: data.amount,
                    type: data.type,
                    date: data.date,
                    category: data.category,
                  },
                  user.id,
                  tx
                );
              } catch (err) {
                console.error('Rolling back!');
                tx.rollback();
              }
            })
        );
        return presenter(record ?? null, instrumentationService);
      }
    );
  };
