'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { Cookie } from '@/src/entities/models/cookie';
import { SESSION_COOKIE } from '@/config';
import { InputParseError } from '@/src/entities/errors/common';
import {
  AuthenticationError,
  UnauthenticatedError,
} from '@/src/entities/errors/auth';
import { getInjection } from '@/di/container';

export async function signUp(formData: FormData) {
  const instrumentationService = getInjection('IInstrumentationService');
  return await instrumentationService.instrumentServerAction(
    'signUp',
    { recordResponse: true },
    async () => {
      const cookieStore = await cookies();
      const username = formData.get('username')?.toString();
      const email = formData.get('email')?.toString(); // added email
      const password = formData.get('password')?.toString();
      const confirmPassword = formData.get('confirm_password')?.toString();

      let sessionCookie: Cookie;
      try {
        const signUpController = getInjection('ISignUpController');
        const { cookie } = await signUpController({
          username,
          email,
          password,
          confirm_password: confirmPassword,
        });
        sessionCookie = cookie;
      } catch (err) {
        if (err instanceof InputParseError) {
          return {
            error:
              'Invalid data. Make sure all fields are filled correctly and passwords match.',
          };
        }
        if (err instanceof AuthenticationError) {
          return {
            error: err.message,
          };
        }
        const crashReporterService = getInjection('ICrashReporterService');
        crashReporterService.report(err);

        return {
          error:
            'An error happened. The developers have been notified. Please try again later. Message: ' +
            (err as Error).message,
        };
      }

      cookieStore.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      redirect('/dashboard/record');
    }
  );
}

export async function signIn(formData: FormData) {
  const instrumentationService = getInjection('IInstrumentationService');
  return await instrumentationService.instrumentServerAction(
    'signIn',
    { recordResponse: true },
    async () => {
      const cookieStore = await cookies();
      const username = formData.get('username')?.toString();
      const password = formData.get('password')?.toString();

      let sessionCookie: Cookie;
      try {
        const signInController = getInjection('ISignInController');
        sessionCookie = await signInController({ username, password });
      } catch (err) {
        if (
          err instanceof InputParseError ||
          err instanceof AuthenticationError
        ) {
          return {
            error: 'Incorrect username or password',
          };
        }
        const crashReporterService = getInjection('ICrashReporterService');
        crashReporterService.report(err);
        return {
          error:
            'An error happened. The developers have been notified. Please try again later.',
        };
      }

      cookieStore.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      redirect('/dashboard/record');
    }
  );
}

export async function signOut() {
  const instrumentationService = getInjection('IInstrumentationService');
  return await instrumentationService.instrumentServerAction(
    'signOut',
    { recordResponse: true },
    async () => {
      const cookieStore = await cookies();
      const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

      let blankCookie: Cookie;
      try {
        const signOutController = getInjection('ISignOutController');
        blankCookie = await signOutController(sessionId);
      } catch (err) {
        if (
          err instanceof UnauthenticatedError ||
          err instanceof InputParseError
        ) {
          redirect('/sign-in');
        }
        const crashReporterService = getInjection('ICrashReporterService');
        crashReporterService.report(err);
        throw err;
      }

      cookieStore.set(
        blankCookie.name,
        blankCookie.value,
        blankCookie.attributes
      );

      redirect('/sign-in');
    }
  );
}
