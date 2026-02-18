import { expect, it } from 'vitest';
import { getInjection } from '@/di/container';
import { InputParseError } from '@/src/entities/errors/common';
import { SESSION_COOKIE } from '@/config';

const signInWithGithubController = getInjection('ISignInWithGithubController');

it('returns a cookie when signing in with an existing GitHub user', async () => {
  const cookie = await signInWithGithubController({
    githubId: '12345',
    email: 'githubuser@example.com',
    username: 'githubuser',
  });

  expect(cookie).toMatchObject({
    name: SESSION_COOKIE,
    value: expect.any(String),
    attributes: {},
  });
});

it('creates a new user when GitHub ID is not found and returns a cookie', async () => {
  const cookie = await signInWithGithubController({
    githubId: 'brand-new-id',
    email: 'newuser@example.com',
    username: 'newuser',
  });

  expect(cookie).toMatchObject({
    name: SESSION_COOKIE,
    value: expect.any(String),
    attributes: {},
  });
});

it('throws InputParseError when githubId is missing', async () => {
  await expect(
    signInWithGithubController({
      email: 'test@example.com',
      username: 'test',
    })
  ).rejects.toBeInstanceOf(InputParseError);
});

it('throws InputParseError when email is missing', async () => {
  await expect(
    signInWithGithubController({
      githubId: '123',
      username: 'test',
    })
  ).rejects.toBeInstanceOf(InputParseError);
});

it('throws InputParseError when username is missing', async () => {
  await expect(
    signInWithGithubController({
      githubId: '123',
      email: 'test@example.com',
    })
  ).rejects.toBeInstanceOf(InputParseError);
});

it('throws InputParseError for invalid email format', async () => {
  await expect(
    signInWithGithubController({
      githubId: '123',
      email: 'not-an-email',
      username: 'test',
    })
  ).rejects.toBeInstanceOf(InputParseError);
});

it('throws InputParseError for empty strings', async () => {
  await expect(
    signInWithGithubController({
      githubId: '',
      email: 'test@example.com',
      username: 'test',
    })
  ).rejects.toBeInstanceOf(InputParseError);

  await expect(
    signInWithGithubController({
      githubId: '123',
      email: '',
      username: 'test',
    })
  ).rejects.toBeInstanceOf(InputParseError);

  await expect(
    signInWithGithubController({
      githubId: '123',
      email: 'test@example.com',
      username: '',
    })
  ).rejects.toBeInstanceOf(InputParseError);
});
