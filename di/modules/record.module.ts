import { createModule } from '@evyweb/ioctopus';

import { MockRecordsRepository } from '@/src/infrastructure/repositories/records.repository.mock';
import { RecordsRepository } from '@/src/infrastructure/repositories/records.repository';

import { createRecordUseCase } from '@/src/application/use-cases/records/create-record.use-case';
import { updateRecordUseCase } from '@/src/application/use-cases/records/update-record.use-case';
import { deleteRecordUseCase } from '@/src/application/use-cases/records/delete-record.use-case';
import { getRecordsForUserUseCase } from '@/src/application/use-cases/records/get-records-for-user.use-case';
import { getRecordUseCase } from '@/src/application/use-cases/records/get-record.use-case';

import { createRecordController } from '@/src/interface-adapters/controllers/records/create-record.controller';
import { updateRecordController } from '@/src/interface-adapters/controllers/records/update-record.controller';
import { deleteRecordController } from '@/src/interface-adapters/controllers/records/delete-record.controller';
import { getRecordsForUserController } from '@/src/interface-adapters/controllers/records/get-records-for-user.controller';

import { DI_SYMBOLS } from '@/di/types';

export function createRecordsModule() {
  const recordsModule = createModule();

  if (process.env.NODE_ENV === 'test') {
    recordsModule
      .bind(DI_SYMBOLS.IRecordsRepository)
      .toClass(MockRecordsRepository);
  } else {
    recordsModule
      .bind(DI_SYMBOLS.IRecordsRepository)
      .toClass(RecordsRepository, [
        DI_SYMBOLS.IInstrumentationService,
        DI_SYMBOLS.ICrashReporterService,
      ]);
  }

  recordsModule
    .bind(DI_SYMBOLS.ICreateRecordUseCase)
    .toHigherOrderFunction(createRecordUseCase, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IRecordsRepository,
    ]);

  recordsModule
    .bind(DI_SYMBOLS.IUpdateRecordUseCase)
    .toHigherOrderFunction(updateRecordUseCase, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IRecordsRepository,
    ]);

  recordsModule
    .bind(DI_SYMBOLS.IDeleteRecordUseCase)
    .toHigherOrderFunction(deleteRecordUseCase, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IRecordsRepository,
    ]);

  recordsModule
    .bind(DI_SYMBOLS.IGetRecordsForUserUseCase)
    .toHigherOrderFunction(getRecordsForUserUseCase, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IRecordsRepository,
    ]);

  recordsModule
    .bind(DI_SYMBOLS.IGetRecordUseCase)
    .toHigherOrderFunction(getRecordUseCase, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IRecordsRepository,
    ]);

  recordsModule
    .bind(DI_SYMBOLS.ICreateRecordController)
    .toHigherOrderFunction(createRecordController, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.ITransactionManagerService,
      DI_SYMBOLS.ICreateRecordUseCase,
    ]);

  recordsModule
    .bind(DI_SYMBOLS.IUpdateRecordController)
    .toHigherOrderFunction(updateRecordController, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.ITransactionManagerService,
      DI_SYMBOLS.IUpdateRecordUseCase,
    ]);

  recordsModule
    .bind(DI_SYMBOLS.IDeleteRecordController)
    .toHigherOrderFunction(deleteRecordController, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.ITransactionManagerService,
      DI_SYMBOLS.IDeleteRecordUseCase,
    ]);

  recordsModule
    .bind(DI_SYMBOLS.IGetRecordsForUserController)
    .toHigherOrderFunction(getRecordsForUserController, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.IGetRecordsForUserUseCase,
    ]);

  return recordsModule;
}
