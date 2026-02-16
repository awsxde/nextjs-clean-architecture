import { expect, it } from 'vitest';

import { getInjection } from '@/di/container';
import { UnauthorizedError } from '@/src/entities/errors/auth';
import { NotFoundError } from '@/src/entities/errors/common';

const signInUseCase = getInjection('ISignInUseCase');
const createRecordUseCase = getInjection('ICreateRecordUseCase');
const updateRecordUseCase = getInjection('IUpdateRecordUseCase');
const signOutUseCase = getInjection('ISignOutUseCase');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('updates record', async () => {
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
    updateRecordUseCase(
      {
        ...record,
        description: 'edited description',
      },
      session.userId
    )
  ).resolves.toMatchObject({
    description: 'edited description',
    amount: 1000,
    type: 'income',
    date: '2026-02-08',
    category: 'salary',
    userId: '1',
  });
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
    updateRecordUseCase(
      {
        ...record,
        description: 'edited description',
      },
      sessionTwo.userId
    )
  ).rejects.toBeInstanceOf(UnauthorizedError);
});

it('throws for invalid input', async () => {
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
    updateRecordUseCase(
      {
        ...record,
        id: 1234567890,
        description: 'edited description',
      },
      session.userId
    )
  ).rejects.toBeInstanceOf(NotFoundError);
});
