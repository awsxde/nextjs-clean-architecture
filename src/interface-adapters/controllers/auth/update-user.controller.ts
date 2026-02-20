import { z } from 'zod';

import { InputParseError } from '@/src/entities/errors/common';
import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { ITransactionManagerService } from '@/src/application/services/transaction-manager.service.interface';
import { IUpdateUserUseCase } from '@/src/application/use-cases/auth/update-user.use-case';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { User } from '@/src/entities/models/user';

function presenter(
  user: User | null,
  instrumentationService: IInstrumentationService
) {
  return instrumentationService.startSpan(
    { name: 'updateUser Presenter', op: 'serialize' },
    () => {
      if (!user) return null;
      return {
        id: user.id,
        username: user.username,
        email: user.email,
      };
    }
  );
}

const inputSchema = z.object({
  id: z.string().min(1),
  username: z.string().min(3).max(31),
  email: z.string().email(),
});

export type IUpdateUserController = ReturnType<typeof updateUserController>;

export const updateUserController =
  (
    instrumentationService: IInstrumentationService,
    authenticationService: IAuthenticationService,
    transactionManagerService: ITransactionManagerService,
    updateUserUseCase: IUpdateUserUseCase
  ) =>
  async (
    input: Partial<z.infer<typeof inputSchema>>,
    sessionId: string | undefined
  ): Promise<ReturnType<typeof presenter>> => {
    return await instrumentationService.startSpan(
      { name: 'updateUser Controller' },
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

        const updatedUser = await instrumentationService.startSpan(
          { name: 'Update Record Transaction' },
          async () =>
            transactionManagerService.startTransaction(async (tx) => {
              try {
                return await updateUserUseCase(
                  {
                    id: data.id,
                    username: data.username,
                    email: data.email,
                  },
                  user.id,
                  tx
                );
              } catch (err) {
                console.error('Rolling back!');
                tx.rollback();
                throw err;
              }
            })
        );
        return presenter(updatedUser ?? null, instrumentationService);
      }
    );
  };
