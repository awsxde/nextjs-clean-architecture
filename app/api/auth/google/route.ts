import { google } from '@/lib/oauth';
import { generateState, generateCodeVerifier } from 'oslo/oauth2';
import { cookies } from 'next/headers';

export async function GET() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = await google.createAuthorizationURL(state, codeVerifier, [
    'openid',
    'profile',
    'email',
  ]);

  const cookieStore = await cookies();
  cookieStore.set('google_oauth_state', state, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 10,
    sameSite: 'lax',
  });
  cookieStore.set('google_code_verifier', codeVerifier, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 10,
    sameSite: 'lax',
  });

  return Response.redirect(url);
}
