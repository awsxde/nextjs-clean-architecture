import { createModule } from '@evyweb/ioctopus';

import { AuthenticationService } from '@/src/infrastructure/services/authentication.service';
import { MockAuthenticationService } from '@/src/infrastructure/services/authentication.service.mock';

import { signInUseCase } from '@/src/application/use-cases/auth/sign-in.use-case';
import { signInWithGithubUseCase } from '@/src/application/use-cases/auth/sign-in-with-github.use-case';
import { signInWithGoogleUseCase } from '@/src/application/use-cases/auth/sign-in-with-google.use-case';
import { signUpUseCase } from '@/src/application/use-cases/auth/sign-up.use-case';
import { signOutUseCase } from '@/src/application/use-cases/auth/sign-out.use-case';
import { updateUserUseCase } from '@/src/application/use-cases/auth/update-user.use-case';

import { signInController } from '@/src/interface-adapters/controllers/auth/sign-in.controller';
import { signInWithGithubController } from '@/src/interface-adapters/controllers/auth/sign-in-with-github.controller';
import { signInWithGoogleController } from '@/src/interface-adapters/controllers/auth/sign-in-with-google.controller';
import { signOutController } from '@/src/interface-adapters/controllers/auth/sign-out.controller';
import { signUpController } from '@/src/interface-adapters/controllers/auth/sign-up.controller';
import { updateUserController } from '@/src/interface-adapters/controllers/auth/update-user.controller';

import { DI_SYMBOLS } from '@/di/types';

export function createAuthenticationModule() {
  const authenticationModule = createModule();

  if (process.env.NODE_ENV === 'test') {
    authenticationModule
      .bind(DI_SYMBOLS.IAuthenticationService)
      .toClass(MockAuthenticationService, [DI_SYMBOLS.IUsersRepository]);
  } else {
    authenticationModule
      .bind(DI_SYMBOLS.IAuthenticationService)
      .toClass(AuthenticationService, [
        DI_SYMBOLS.IUsersRepository,
        DI_SYMBOLS.IInstrumentationService,
      ]);
  }

  authenticationModule
    .bind(DI_SYMBOLS.ISignInUseCase)
    .toHigherOrderFunction(signInUseCase, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IUsersRepository,
      DI_SYMBOLS.IAuthenticationService,
    ]);

  authenticationModule
    .bind(DI_SYMBOLS.ISignInWithGithubUseCase)
    .toHigherOrderFunction(signInWithGithubUseCase, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IUsersRepository,
      DI_SYMBOLS.IAuthenticationService,
    ]);

  authenticationModule
    .bind(DI_SYMBOLS.ISignInWithGoogleUseCase)
    .toHigherOrderFunction(signInWithGoogleUseCase, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IUsersRepository,
      DI_SYMBOLS.IAuthenticationService,
    ]);

  authenticationModule
    .bind(DI_SYMBOLS.ISignOutUseCase)
    .toHigherOrderFunction(signOutUseCase, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IAuthenticationService,
    ]);

  authenticationModule
    .bind(DI_SYMBOLS.ISignUpUseCase)
    .toHigherOrderFunction(signUpUseCase, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.IUsersRepository,
    ]);

  authenticationModule
    .bind(DI_SYMBOLS.IUpdateUserUseCase)
    .toHigherOrderFunction(updateUserUseCase, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IUsersRepository,
    ]);

  authenticationModule
    .bind(DI_SYMBOLS.ISignInController)
    .toHigherOrderFunction(signInController, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.ISignInUseCase,
    ]);

  authenticationModule
    .bind(DI_SYMBOLS.ISignInWithGithubController)
    .toHigherOrderFunction(signInWithGithubController, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.ISignInWithGithubUseCase,
    ]);

  authenticationModule
    .bind(DI_SYMBOLS.ISignInWithGoogleController)
    .toHigherOrderFunction(signInWithGoogleController, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.ISignInWithGoogleUseCase,
    ]);

  authenticationModule
    .bind(DI_SYMBOLS.ISignOutController)
    .toHigherOrderFunction(signOutController, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.ISignOutUseCase,
    ]);

  authenticationModule
    .bind(DI_SYMBOLS.ISignUpController)
    .toHigherOrderFunction(signUpController, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.ISignUpUseCase,
    ]);

  authenticationModule
    .bind(DI_SYMBOLS.IUpdateUserController)
    .toHigherOrderFunction(updateUserController, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.ITransactionManagerService,
      DI_SYMBOLS.IUpdateUserUseCase,
    ]);

  return authenticationModule;
}
