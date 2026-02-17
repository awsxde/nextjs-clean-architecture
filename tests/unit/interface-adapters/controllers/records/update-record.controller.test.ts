import { expect, it } from 'vitest';

import { getInjection } from '@/di/container';
import { InputParseError } from '@/src/entities/errors/common';
import { UnauthenticatedError } from '@/src/entities/errors/auth';

const signInUseCase = getInjection('ISignInUseCase');
const createRecordUseCase = getInjection('ICreateRecordUseCase');
const updateRecordController = getInjection('IUpdateRecordController');

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
    updateRecordController(
      {
        ...record,
        description: 'edited description',
      },
      session.id
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

  await expect(updateRecordController({}, session.id)).rejects.toBeInstanceOf(
    InputParseError
  );

  await expect(
    updateRecordController(
      {
        ...record,
        description: '',
      },
      session.id
    )
  ).rejects.toBeInstanceOf(InputParseError);

  await expect(
    updateRecordController(
      {
        ...record,
        amount: -10,
      },
      session.id
    )
  ).rejects.toBeInstanceOf(InputParseError);

  await expect(
    updateRecordController(
      {
        ...record,
        amount: 0,
      },
      session.id
    )
  ).rejects.toBeInstanceOf(InputParseError);

  await expect(
    updateRecordController(
      {
        ...record,
        type: '',
      },
      session.id
    )
  ).rejects.toBeInstanceOf(InputParseError);

  await expect(
    updateRecordController(
      {
        ...record,
        date: '',
      },
      session.id
    )
  ).rejects.toBeInstanceOf(InputParseError);

  await expect(
    updateRecordController(
      {
        ...record,
        category: '',
      },
      session.id
    )
  ).rejects.toBeInstanceOf(InputParseError);
});

it('throws for unauthenticated', async () => {
  await expect(
    updateRecordController(
      {
        description: "Doesn't matter",
        amount: 1000,
        type: 'income',
        date: '2026-02-08',
        category: 'salary',
      },
      undefined
    )
  ).rejects.toBeInstanceOf(UnauthenticatedError);
});
