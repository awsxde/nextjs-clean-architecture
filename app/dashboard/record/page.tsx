import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { SESSION_COOKIE } from '@/config';
import {
  AuthenticationError,
  UnauthenticatedError,
} from '@/src/entities/errors/auth';
import { Record } from '@/src/entities/models/record';
import { getInjection } from '@/di/container';
import { columns } from '@/app/dashboard/record/components/columns';
import { DataTable } from '@/app/dashboard/record/components/data-table';

async function getRecords(sessionId: string | undefined) {
  const instrumentationService = getInjection('IInstrumentationService');
  return await instrumentationService.startSpan(
    {
      name: 'getRecords',
      op: 'function.nextjs',
    },
    async () => {
      try {
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

export default async function Page() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  let records: Record[];
  try {
    records = await getRecords(sessionId);
  } catch (err) {
    throw err;
  }

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <DataTable data={records} columns={columns} />
    </div>
  );
}
