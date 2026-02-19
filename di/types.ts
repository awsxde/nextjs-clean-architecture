import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { ITransactionManagerService } from '@/src/application/services/transaction-manager.service.interface';
import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';

import { IRecordsRepository } from '@/src/application/repositories/records.repository.interface';
import { IUsersRepository } from '@/src/application/repositories/users.repository.interface';

import { ICreateRecordUseCase } from '@/src/application/use-cases/records/create-record.use-case';
import { IUpdateRecordUseCase } from '@/src/application/use-cases/records/update-record.use-case';
import { IDeleteRecordUseCase } from '@/src/application/use-cases/records/delete-record.use-case';
import { IGetRecordsForUserUseCase } from '@/src/application/use-cases/records/get-records-for-user.use-case';
import { IGetRecordUseCase } from '@/src/application/use-cases/records/get-record.use-case';
import { ISignInUseCase } from '@/src/application/use-cases/auth/sign-in.use-case';
import { ISignInWithGithubUseCase } from '@/src/application/use-cases/auth/sign-in-with-github.use-case';
import { ISignInWithGoogleUseCase } from '@/src/application/use-cases/auth/sign-in-with-google.use-case';
import { ISignUpUseCase } from '@/src/application/use-cases/auth/sign-up.use-case';
import { ISignOutUseCase } from '@/src/application/use-cases/auth/sign-out.use-case';

import { ISignInController } from '@/src/interface-adapters/controllers/auth/sign-in.controller';
import { ISignInWithGithubController } from '@/src/interface-adapters/controllers/auth/sign-in-with-github.controller';
import { ISignOutController } from '@/src/interface-adapters/controllers/auth/sign-out.controller';
import { ISignUpController } from '@/src/interface-adapters/controllers/auth/sign-up.controller';
import { ICreateRecordController } from '@/src/interface-adapters/controllers/records/create-record.controller';
import { IUpdateRecordController } from '@/src/interface-adapters/controllers/records/update-record.controller';
import { IDeleteRecordController } from '@/src/interface-adapters/controllers/records/delete-record.controller';
import { IGetRecordsForUserController } from '@/src/interface-adapters/controllers/records/get-records-for-user.controller';
import { IGetRecordController } from '@/src/interface-adapters/controllers/records/get-record.controller';

export const DI_SYMBOLS = {
  // Services
  IAuthenticationService: Symbol.for('IAuthenticationService'),
  ITransactionManagerService: Symbol.for('ITransactionManagerService'),
  IInstrumentationService: Symbol.for('IInstrumentationService'),
  ICrashReporterService: Symbol.for('ICrashReporterService'),

  // Repositories
  IRecordsRepository: Symbol.for('IRecordsRepository'),
  IUsersRepository: Symbol.for('IUsersRepository'),

  // Use Cases
  ICreateRecordUseCase: Symbol.for('ICreateRecordUseCase'),
  IUpdateRecordUseCase: Symbol.for('IUpdateRecordUseCase'),
  IDeleteRecordUseCase: Symbol.for('IDeleteRecordUseCase'),
  IGetRecordsForUserUseCase: Symbol.for('IGetRecordsForUserUseCase'),
  IGetRecordUseCase: Symbol.for('IGetRecordUseCase'),
  ISignInUseCase: Symbol.for('ISignInUseCase'),
  ISignInWithGithubUseCase: Symbol.for('ISignInWithGithubUseCase'),
  ISignInWithGoogleUseCase: Symbol.for('ISignInWithGoogleUseCase'),
  ISignOutUseCase: Symbol.for('ISignOutUseCase'),
  ISignUpUseCase: Symbol.for('ISignUpUseCase'),

  // Controllers
  ISignInController: Symbol.for('ISignInController'),
  ISignInWithGithubController: Symbol.for('ISignInWithGithubController'),
  ISignOutController: Symbol.for('ISignOutController'),
  ISignUpController: Symbol.for('ISignUpController'),
  ICreateRecordController: Symbol.for('ICreateRecordController'),
  IUpdateRecordController: Symbol.for('IUpdateRecordController'),
  IDeleteRecordController: Symbol.for('IDeleteRecordController'),
  IGetRecordsForUserController: Symbol.for('IGetRecordsForUserController'),
  IGetRecordController: Symbol.for('IGetRecordController'),
};

export interface DI_RETURN_TYPES {
  // Services
  IAuthenticationService: IAuthenticationService;
  ITransactionManagerService: ITransactionManagerService;
  IInstrumentationService: IInstrumentationService;
  ICrashReporterService: ICrashReporterService;

  // Repositories
  IRecordsRepository: IRecordsRepository;
  IUsersRepository: IUsersRepository;

  // Use Cases
  ICreateRecordUseCase: ICreateRecordUseCase;
  IUpdateRecordUseCase: IUpdateRecordUseCase;
  IDeleteRecordUseCase: IDeleteRecordUseCase;
  IGetRecordsForUserUseCase: IGetRecordsForUserUseCase;
  IGetRecordUseCase: IGetRecordUseCase;
  ISignInUseCase: ISignInUseCase;
  ISignInWithGithubUseCase: ISignInWithGithubUseCase;
  ISignInWithGoogleUseCase: ISignInWithGoogleUseCase;
  ISignOutUseCase: ISignOutUseCase;
  ISignUpUseCase: ISignUpUseCase;

  // Controllers
  ISignInController: ISignInController;
  ISignInWithGithubController: ISignInWithGithubController;
  ISignOutController: ISignOutController;
  ISignUpController: ISignUpController;
  ICreateRecordController: ICreateRecordController;
  IUpdateRecordController: IUpdateRecordController;
  IDeleteRecordController: IDeleteRecordController;
  IGetRecordsForUserController: IGetRecordsForUserController;
  IGetRecordController: IGetRecordController;
}
