import { expect, it } from 'vitest';

import { getInjection } from '@/di/container';
import { UnauthenticatedError } from '@/src/entities/errors/auth';

const signInUseCase = getInjection('ISignInUseCase');
const createRecordUseCase = getInjection('ICreateRecordUseCase');
const getRecordsForUserController = getInjection(
  'IGetRecordsForUserController'
);

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('returns users records', async () => {
  const { session } = await signInUseCase({
    username: 'one',
    password: 'password-one',
  });

  await expect(getRecordsForUserController(session.id)).resolves.toMatchObject(
    []
  );

  await createRecordUseCase(
    {
      description: 'record-one',
      amount: 1000,
      type: 'income',
      date: '2026-02-08',
      category: 'salary',
    },
    session.userId
  );
  await createRecordUseCase(
    {
      description: 'record-two',
      amount: 2000,
      type: 'income',
      date: '2026-02-08',
      category: 'salary',
    },
    session.userId
  );
  await createRecordUseCase(
    {
      description: 'record-three',
      amount: 3000,
      type: 'income',
      date: '2026-02-08',
      category: 'salary',
    },
    session.userId
  );

  await expect(getRecordsForUserController(session.id)).resolves.toMatchObject([
    {
      description: 'record-one',
      amount: 1000,
      type: 'income',
      date: '2026-02-08',
      category: 'salary',
      userId: '1',
    },
    {
      description: 'record-two',
      amount: 2000,
      type: 'income',
      date: '2026-02-08',
      category: 'salary',
      userId: '1',
    },
    {
      description: 'record-three',
      amount: 3000,
      type: 'income',
      date: '2026-02-08',
      category: 'salary',
      userId: '1',
    },
  ]);
});

it('throws when unauthenticated', async () => {
  await expect(getRecordsForUserController('')).rejects.toBeInstanceOf(
    UnauthenticatedError
  );
  await expect(getRecordsForUserController(undefined)).rejects.toBeInstanceOf(
    UnauthenticatedError
  );
});
