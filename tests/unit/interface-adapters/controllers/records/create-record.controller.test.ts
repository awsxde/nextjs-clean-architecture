import { expect, it, vi } from 'vitest';

import { getInjection } from '@/di/container';
import { InputParseError } from '@/src/entities/errors/common';
import { UnauthenticatedError } from '@/src/entities/errors/auth';

const signInUseCase = getInjection('ISignInUseCase');
const createRecordController = getInjection('ICreateRecordController');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('creates record', async () => {
  const { session } = await signInUseCase({
    username: 'one',
    password: 'password-one',
  });

  await expect(
    createRecordController(
      {
        description: 'Test application',
        amount: 1000,
        type: 'income',
        date: '2026-02-08',
        category: 'salary',
      },
      session.id
    )
  ).resolves.toMatchObject({
    description: 'Test application',
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

  await expect(createRecordController({}, session.id)).rejects.toBeInstanceOf(
    InputParseError
  );

  await expect(
    createRecordController(
      {
        description: '',
        amount: 1000,
        type: 'income',
        date: '2026-02-08',
        category: 'salary',
      },
      session.id
    )
  ).rejects.toBeInstanceOf(InputParseError);

  await expect(
    createRecordController(
      {
        description: 'Test application',
        amount: -10,
        type: '',
        date: '2026-02-08',
        category: 'salary',
      },
      session.id
    )
  ).rejects.toBeInstanceOf(InputParseError);

  await expect(
    createRecordController(
      {
        description: 'Test application',
        amount: 0,
        type: '',
        date: '2026-02-08',
        category: 'salary',
      },
      session.id
    )
  ).rejects.toBeInstanceOf(InputParseError);

  await expect(
    createRecordController(
      {
        description: 'Test application',
        amount: 1000,
        type: '',
        date: '2026-02-08',
        category: 'salary',
      },
      session.id
    )
  ).rejects.toBeInstanceOf(InputParseError);

  await expect(
    createRecordController(
      {
        description: 'Test application',
        amount: 1000,
        type: 'income',
        date: '',
        category: 'salary',
      },
      session.id
    )
  ).rejects.toBeInstanceOf(InputParseError);

  await expect(
    createRecordController(
      {
        description: 'Test application',
        amount: 1000,
        type: 'income',
        date: '2026-02-08',
        category: '',
      },
      session.id
    )
  ).rejects.toBeInstanceOf(InputParseError);
});

it('throws for unauthenticated', async () => {
  await expect(
    createRecordController(
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
