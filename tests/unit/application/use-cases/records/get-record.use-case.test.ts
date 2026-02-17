import { expect, it } from 'vitest';

import { getInjection } from '@/di/container';

const signInUseCase = getInjection('ISignInUseCase');
const createRecordUseCase = getInjection('ICreateRecordUseCase');
const getRecordUseCase = getInjection('IGetRecordUseCase');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('returns records', async () => {
  const { session } = await signInUseCase({
    username: 'one',
    password: 'password-one',
  });

  const record = await createRecordUseCase(
    {
      description: 'Write unit tests',
      amount: 1000,
      type: 'income',
      date: '2026-02-08',
      category: 'salary',
    },
    session.userId
  );

  await expect(getRecordUseCase(record.id)).resolves.toMatchObject(record);
});
