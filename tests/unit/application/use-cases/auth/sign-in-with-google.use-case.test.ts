import { expect, it } from 'vitest';
import { getInjection } from '@/di/container';

const signInWithGoogleUseCase = getInjection('ISignInWithGoogleUseCase');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('creates a new user when neither googleId nor email exist', async () => {
  const result = await signInWithGoogleUseCase({
    googleId: 'brand-new-id',
    email: 'newuser@example.com',
    username: 'newuser',
  });

  expect(result).toHaveProperty('session');
  expect(result).toHaveProperty('cookie');
});
