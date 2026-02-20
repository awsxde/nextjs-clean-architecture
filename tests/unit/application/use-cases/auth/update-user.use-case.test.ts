import { expect, it } from 'vitest';

import { getInjection } from '@/di/container';
import { UnauthorizedError } from '@/src/entities/errors/auth';
import { NotFoundError } from '@/src/entities/errors/common';

const signInUseCase = getInjection('ISignInUseCase');
const signUpUseCase = getInjection('ISignUpUseCase');
const updateUserUseCase = getInjection('IUpdateUserUseCase');
const signOutUseCase = getInjection('ISignOutUseCase');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('updates user', async () => {
  const { session, user } = await signUpUseCase({
    email: 'new@gmail.com',
    username: 'new',
    password: 'password-new',
  });

  await expect(
    updateUserUseCase(
      {
        id: user.id,
        username: 'edited username',
        email: 'newEmail@gmail.com',
      },
      session.userId
    )
  ).resolves.toMatchObject({
    id: user.id,
    username: 'edited username',
    email: 'newEmail@gmail.com',
  });
});

it('throws when unauthorized', async () => {
  const { session: sessionOne, user } = await signUpUseCase({
    email: 'new@gmail.com',
    username: 'new',
    password: 'password-new',
  });

  await signOutUseCase(sessionOne.id);

  const { session: sessionTwo } = await signInUseCase({
    username: 'two',
    password: 'password-two',
  });

  await expect(
    updateUserUseCase(
      {
        id: user.id,
        username: 'edited username',
        email: 'newEmail@gmail.com',
      },
      sessionTwo.userId
    )
  ).rejects.toBeInstanceOf(UnauthorizedError);
});

it('throws for invalid input', async () => {
  const { session } = await signUpUseCase({
    email: 'email@random.com',
    username: 'new username',
    password: 'password-new',
  });

  await expect(
    updateUserUseCase(
      {
        id: '1234567890',
        username: 'new username',
        email: 'emailEdited@random.com',
      },
      session.userId
    )
  ).rejects.toBeInstanceOf(NotFoundError);
});
