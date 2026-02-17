import { z } from 'zod';

import { ICreateRecordUseCase } from '@/src/application/use-cases/records/create-record.use-case';
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
    { name: 'createRecord Presenter', op: 'serialize' },
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
  description: z.string().min(1),
  amount: z.coerce.number().positive(),
  type: z.string().min(1),
  date: z.string().min(1),
  category: z.string().min(1),
});

export type ICreateRecordController = ReturnType<typeof createRecordController>;

export const createRecordController =
  (
    instrumentationService: IInstrumentationService,
    authenticationService: IAuthenticationService,
    transactionManagerService: ITransactionManagerService,
    createRecordUseCase: ICreateRecordUseCase
  ) =>
  async (
    input: Partial<z.infer<typeof inputSchema>>,
    sessionId: string | undefined
  ): Promise<ReturnType<typeof presenter>> => {
    return await instrumentationService.startSpan(
      {
        name: 'createRecord Controller',
      },
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

        const record = await instrumentationService.startSpan(
          { name: 'Create Record Transaction' },
          async () =>
            transactionManagerService.startTransaction(async (tx) => {
              try {
                return await createRecordUseCase(
                  {
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
