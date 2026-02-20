import { expect, it } from 'vitest';

import { getInjection } from '@/di/container';
import { InputParseError } from '@/src/entities/errors/common';
import { UnauthenticatedError } from '@/src/entities/errors/auth';

const signUpUseCase = getInjection('ISignUpUseCase');
const updateUserController = getInjection('IUpdateUserController');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('updates user', async () => {
  const { session, user } = await signUpUseCase({
    email: 'random@gmail.com',
    username: 'random user',
    password: 'password-new',
  });

  await expect(
    updateUserController(
      {
        id: user.id,
        username: 'edited random username',
        email: 'newRandomEmail@gmail.com',
      },
      session.id
    )
  ).resolves.toMatchObject({
    id: user.id,
    username: 'edited random username',
    email: 'newRandomEmail@gmail.com',
  });
});

it('throws for invalid input', async () => {
  const { session, user } = await signUpUseCase({
    email: 'new@random.com',
    username: 'username',
    password: 'password-new',
  });

  await expect(updateUserController({}, session.id)).rejects.toBeInstanceOf(
    InputParseError
  );

  await expect(
    updateUserController(
      {
        ...user,
        username: '',
      },
      session.id
    )
  ).rejects.toBeInstanceOf(InputParseError);

  await expect(
    updateUserController(
      {
        ...user,
        email: '',
      },
      session.id
    )
  ).rejects.toBeInstanceOf(InputParseError);
});

it('throws for unauthenticated', async () => {
  await expect(
    updateUserController(
      {
        email: 'new@gmail.com',
        username: "Doesn't matter",
      },
      undefined
    )
  ).rejects.toBeInstanceOf(UnauthenticatedError);
});
