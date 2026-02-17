import { expect, it } from 'vitest';

import { getInjection } from '@/di/container';
import { UnauthenticatedError } from '@/src/entities/errors/auth';

const signInUseCase = getInjection('ISignInUseCase');
const createRecordUseCase = getInjection('ICreateRecordUseCase');
const getRecordController = getInjection('IGetRecordController');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('returns users records', async () => {
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

  await expect(
    getRecordController({ recordId: record.id }, session.id)
  ).resolves.toMatchObject(record);
});

it('throws when unauthenticated', async () => {
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

  await expect(
    getRecordController({ recordId: record.id }, '')
  ).rejects.toBeInstanceOf(UnauthenticatedError);
  await expect(
    getRecordController({ recordId: record.id }, undefined)
  ).rejects.toBeInstanceOf(UnauthenticatedError);
});
