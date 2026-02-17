'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { SESSION_COOKIE } from '@/config';
import {
  AuthenticationError,
  UnauthenticatedError,
} from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';
import { getInjection } from '@/di/container';
import { extractFormData } from '@/lib/form-utils';

export async function createRecord(formData: FormData) {
  const instrumentationService = getInjection('IInstrumentationService');
  return await instrumentationService.instrumentServerAction(
    'createRecord',
    { recordResponse: true },
    async () => {
      try {
        const cookieStore = await cookies();
        const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

        const data = extractFormData(formData);

        const createRecordController = getInjection('ICreateRecordController');
        await createRecordController(data, sessionId);
      } catch (err) {
        if (err instanceof InputParseError) {
          return { error: err.message };
        }
        if (err instanceof UnauthenticatedError) {
          return { error: 'Must be logged in to create a record' };
        }
        const crashReporterService = getInjection('ICrashReporterService');
        crashReporterService.report(err);
        return {
          error:
            'An error happened while creating a record. The developers have been notified. Please try again later.',
        };
      }

      revalidatePath('/dashboard/record');
      return { success: true };
    }
  );
}

export async function updateRecord(formData: FormData) {
  const instrumentationService = getInjection('IInstrumentationService');
  return await instrumentationService.instrumentServerAction(
    'updateRecord',
    { recordResponse: true },
    async () => {
      try {
        const cookieStore = await cookies();
        const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

        const data = extractFormData(formData);

        const updateRecordController = getInjection('IUpdateRecordController');
        await updateRecordController(data, sessionId);
      } catch (err) {
        if (err instanceof InputParseError) {
          return { error: err.message };
        }
        if (err instanceof UnauthenticatedError) {
          return { error: 'Must be logged in to update a record' };
        }
        const crashReporterService = getInjection('ICrashReporterService');
        crashReporterService.report(err);
        return {
          error:
            'An error happened while updating a record. The developers have been notified. Please try again later.',
        };
      }

      revalidatePath('/dashboard/record');
      return { success: true };
    }
  );
}

export async function getRecords() {
  const instrumentationService = getInjection('IInstrumentationService');
  return await instrumentationService.startSpan(
    {
      name: 'getRecords',
      op: 'function.nextjs',
    },
    async () => {
      try {
        const cookieStore = await cookies();
        const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
        const getRecordsForUserController = getInjection(
          'IGetRecordsForUserController'
        );
        return await getRecordsForUserController(sessionId);
      } catch (err) {
        if (
          err instanceof UnauthenticatedError ||
          err instanceof AuthenticationError
        ) {
          redirect('/sign-in');
        }
        const crashReporterService = getInjection('ICrashReporterService');
        crashReporterService.report(err);
        throw err;
      }
    }
  );
}

export async function getRecord(recordId: number) {
  const instrumentationService = getInjection('IInstrumentationService');
  return await instrumentationService.startSpan(
    {
      name: 'getRecords',
      op: 'function.nextjs',
    },
    async () => {
      try {
        const cookieStore = await cookies();
        const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
        const getRecordController = getInjection('IGetRecordController');
        return await getRecordController({ recordId }, sessionId);
      } catch (err) {
        if (
          err instanceof UnauthenticatedError ||
          err instanceof AuthenticationError
        ) {
          redirect('/sign-in');
        }
        const crashReporterService = getInjection('ICrashReporterService');
        crashReporterService.report(err);
        throw err;
      }
    }
  );
}

export async function deleteRecord(recordId: number) {
  const instrumentationService = getInjection('IInstrumentationService');
  return await instrumentationService.startSpan(
    {
      name: 'deleteRecords',
      op: 'function.nextjs',
    },
    async () => {
      try {
        const cookieStore = await cookies();
        const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
        const deleteRecordController = getInjection('IDeleteRecordController');
        await deleteRecordController({ recordId }, sessionId);
      } catch (err) {
        if (err instanceof InputParseError) {
          return { error: err.message };
        }
        if (err instanceof UnauthenticatedError) {
          return { error: 'Must be logged in to delete a record' };
        }
        const crashReporterService = getInjection('ICrashReporterService');
        crashReporterService.report(err);
        return {
          error:
            'An error happened while deleting a record. The developers have been notified. Please try again later.',
        };
      }

      revalidatePath('/dashboard/record');
      return { success: true };
    }
  );
}
