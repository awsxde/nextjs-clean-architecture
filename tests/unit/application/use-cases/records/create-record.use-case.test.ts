import { expect, it } from 'vitest';

import { getInjection } from '@/di/container';

const signInUseCase = getInjection('ISignInUseCase');
const createRecordUseCase = getInjection('ICreateRecordUseCase');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('creates record', async () => {
  const { session } = await signInUseCase({
    username: 'one',
    password: 'password-one',
  });

  expect(
    createRecordUseCase(
      {
        description: 'Write unit tests',
        amount: 1000,
        type: 'income',
        date: '2026-02-08T17:47:31.306Z',
        category: 'salary',
      },
      session.userId
    )
  ).resolves.toMatchObject({
    description: 'Write unit tests',
    amount: 1000,
    type: 'income',
    date: '2026-02-08T17:47:31.306Z',
    category: 'salary',
    userId: '1',
  });
});
