import { expect, it } from 'vitest';

import { getInjection } from '@/di/container';

import { UnauthorizedError } from '@/src/entities/errors/auth';
import { NotFoundError } from '@/src/entities/errors/common';

const signInUseCase = getInjection('ISignInUseCase');
const createRecordUseCase = getInjection('ICreateRecordUseCase');
const deleteRecordUseCase = getInjection('IDeleteRecordUseCase');
const getRecordsForUserUseCase = getInjection('IGetRecordsForUserUseCase');
const signOutUseCase = getInjection('ISignOutUseCase');
// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('deletes record', async () => {
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

  // Deletion returns the deleted object
  await expect(
    deleteRecordUseCase({ recordId: record.id }, session.userId)
  ).resolves.toMatchObject({
    description: 'Write unit tests',
    amount: 1000,
    type: 'income',
    date: '2026-02-08',
    category: 'salary',
    userId: '1',
  });

  // Records should be empty at this point
  await expect(getRecordsForUserUseCase(session.userId)).resolves.toMatchObject(
    []
  );
});

it('throws when unauthorized', async () => {
  const { session: sessionOne } = await signInUseCase({
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
    sessionOne.userId
  );

  await signOutUseCase(sessionOne.id);

  const { session: sessionTwo } = await signInUseCase({
    username: 'two',
    password: 'password-two',
  });

  await expect(
    deleteRecordUseCase({ recordId: record.id }, sessionTwo.userId)
  ).rejects.toBeInstanceOf(UnauthorizedError);
});

it('throws for invalid input', async () => {
  const { session } = await signInUseCase({
    username: 'one',
    password: 'password-one',
  });

  await expect(
    deleteRecordUseCase({ recordId: 1234567890 }, session.userId)
  ).rejects.toBeInstanceOf(NotFoundError);
});
