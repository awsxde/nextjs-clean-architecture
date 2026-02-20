import { Cookie } from '@/src/entities/models/cookie';
import { Session } from '@/src/entities/models/session';
import { CreateOAuthUser } from '@/src/entities/models/user';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { generateIdFromEntropySize } from 'lucia';

export type ISignInWithGoogleUseCase = ReturnType<
  typeof signInWithGoogleUseCase
>;

export const signInWithGoogleUseCase =
  (
    instrumentationService: IInstrumentationService,
    usersRepository: IUsersRepository,
    authenticationService: IAuthenticationService
  ) =>
  async (input: {
    googleId: string;
    email: string;
    username: string;
  }): Promise<{ session: Session; cookie: Cookie }> => {
    return instrumentationService.startSpan(
      { name: 'signInWithGoogle Use Case', op: 'function' },
      async () => {
        let user = await usersRepository.getUserByGoogleId(input.googleId);

        if (!user) {
          user = await usersRepository.getUserByEmail(input.email);
        }

        if (!user) {
          const userId = generateIdFromEntropySize(10);
          const newUser: CreateOAuthUser = {
            id: userId,
            username: input.username,
            email: input.email,
            password_hash: null,
            github_id: null,
            google_id: input.googleId,
          };
          user = await usersRepository.createOAuthUser(newUser);
        } else if (!user.google_id) {
          // Link Google account to existing user
          user = await usersRepository.updateUser(user.id, {
            google_id: input.googleId,
          });
        }

        return await authenticationService.createSession(user);
      }
    );
  };
