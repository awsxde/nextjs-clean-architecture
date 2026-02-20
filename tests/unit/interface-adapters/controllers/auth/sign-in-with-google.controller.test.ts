import { expect, it } from 'vitest';
import { getInjection } from '@/di/container';
import { InputParseError } from '@/src/entities/errors/common';
import { SESSION_COOKIE } from '@/config';

const signInWithGoogleController = getInjection('ISignInWithGoogleController');

it('returns a cookie when signing in with an existing Google user', async () => {
  const cookie = await signInWithGoogleController({
    googleId: '12345',
    email: 'googleuser@example.com',
    username: 'googleuser',
  });

  expect(cookie).toMatchObject({
    name: SESSION_COOKIE,
    value: expect.any(String),
    attributes: {},
  });
});

it('creates a new user when Google ID is not found and returns a cookie', async () => {
  const cookie = await signInWithGoogleController({
    googleId: 'brand-new-id',
    email: 'newuser@example.com',
    username: 'newuser',
  });

  expect(cookie).toMatchObject({
    name: SESSION_COOKIE,
    value: expect.any(String),
    attributes: {},
  });
});

it('throws InputParseError when googleId is missing', async () => {
  await expect(
    signInWithGoogleController({
      email: 'test@example.com',
      username: 'test',
    })
  ).rejects.toBeInstanceOf(InputParseError);
});

it('throws InputParseError when email is missing', async () => {
  await expect(
    signInWithGoogleController({
      googleId: '123',
      username: 'test',
    })
  ).rejects.toBeInstanceOf(InputParseError);
});

it('throws InputParseError when username is missing', async () => {
  await expect(
    signInWithGoogleController({
      googleId: '123',
      email: 'test@example.com',
    })
  ).rejects.toBeInstanceOf(InputParseError);
});

it('throws InputParseError for invalid email format', async () => {
  await expect(
    signInWithGoogleController({
      googleId: '123',
      email: 'not-an-email',
      username: 'test',
    })
  ).rejects.toBeInstanceOf(InputParseError);
});

it('throws InputParseError for empty strings', async () => {
  await expect(
    signInWithGoogleController({
      googleId: '',
      email: 'test@example.com',
      username: 'test',
    })
  ).rejects.toBeInstanceOf(InputParseError);

  await expect(
    signInWithGoogleController({
      googleId: '123',
      email: '',
      username: 'test',
    })
  ).rejects.toBeInstanceOf(InputParseError);

  await expect(
    signInWithGoogleController({
      googleId: '123',
      email: 'test@example.com',
      username: '',
    })
  ).rejects.toBeInstanceOf(InputParseError);
});
