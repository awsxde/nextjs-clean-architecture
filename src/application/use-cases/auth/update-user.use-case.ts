import { NotFoundError } from '@/src/entities/errors/common';
import { UnauthorizedError } from '@/src/entities/errors/auth';
import type { User } from '@/src/entities/models/user';
import type { ITransaction } from '@/src/entities/models/transaction.interface';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IUsersRepository } from '@/src/application/repositories/users.repository.interface';

export type IUpdateUserUseCase = ReturnType<typeof updateUserUseCase>;

export const updateUserUseCase =
  (
    instrumentationService: IInstrumentationService,
    usersRepository: IUsersRepository
  ) =>
  (
    input: {
      id: string;
      username?: string;
      email?: string;
    },
    userId: string,
    tx?: ITransaction
  ): Promise<User> => {
    return instrumentationService.startSpan(
      { name: 'updateUser Use Case', op: 'function' },
      async () => {
        const user = await usersRepository.getUser(input.id);

        if (!user) {
          throw new NotFoundError('User does not exist');
        }

        if (user.id !== userId) {
          throw new UnauthorizedError('Cannot edit user. Reason: unauthorized');
        }

        const updatedUser = await usersRepository.updateUser(
          input.id,
          {
            ...input,
            id: userId,
          },
          tx
        );

        return updatedUser;
      }
    );
  };
