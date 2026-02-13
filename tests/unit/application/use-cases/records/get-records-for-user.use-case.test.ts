import { expect, it } from 'vitest';

import { getInjection } from '@/di/container';

const signInUseCase = getInjection('ISignInUseCase');
const createRecordUseCase = getInjection('ICreateRecordUseCase');
const getRecordsForUserUseCase = getInjection('IGetRecordsForUserUseCase');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('returns records', async () => {
  const { session } = await signInUseCase({
    username: 'one',
    password: 'password-one',
  });
  await expect(getRecordsForUserUseCase(session.userId)).resolves.toHaveLength(
    0
  );

  await createRecordUseCase(
    {
      description: 'record-one',
      amount: 1000,
      type: 'income',
      date: '2026-02-08T17:47:31.306Z',
      category: 'salary',
    },
    session.userId
  );
  await createRecordUseCase(
    {
      description: 'record-two',
      amount: 2000,
      type: 'income',
      date: '2026-02-08T17:47:31.306Z',
      category: 'salary',
    },
    session.userId
  );
  await createRecordUseCase(
    {
      description: 'record-three',
      amount: 3000,
      type: 'income',
      date: '2026-02-08T17:47:31.306Z',
      category: 'salary',
    },
    session.userId
  );

  await expect(getRecordsForUserUseCase(session.userId)).resolves.toMatchObject(
    [
      {
        description: 'record-one',
        amount: 1000,
        type: 'income',
        date: '2026-02-08T17:47:31.306Z',
        category: 'salary',
        userId: '1',
      },
      {
        description: 'record-two',
        amount: 2000,
        type: 'income',
        date: '2026-02-08T17:47:31.306Z',
        category: 'salary',
        userId: '1',
      },
      {
        description: 'record-three',
        amount: 3000,
        type: 'income',
        date: '2026-02-08T17:47:31.306Z',
        category: 'salary',
        userId: '1',
      },
    ]
  );
});
