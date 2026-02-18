import { expect, it } from 'vitest';

import { getInjection } from '@/di/container';
import { AuthenticationError } from '@/src/entities/errors/auth';

const signInWithGithubUseCase = getInjection('ISignInWithGithubUseCase');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('creates a new user when neither githubId nor email exist', async () => {
  const result = await signInWithGithubUseCase({
    githubId: 'brand-new-id',
    email: 'newuser@example.com',
    username: 'newuser',
  });

  expect(result).toHaveProperty('session');
  expect(result).toHaveProperty('cookie');
});
