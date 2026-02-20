import { google } from '@/lib/oauth';
import { cookies } from 'next/headers';
import { OAuth2RequestError } from 'arctic';
import { getInjection } from '@/di/container';

const signInWithGoogleController = getInjection('ISignInWithGoogleController');

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const cookieStore = await cookies();
  const storedState = cookieStore.get('google_oauth_state')?.value;
  const storedCodeVerifier = cookieStore.get('google_code_verifier')?.value;

  if (
    !code ||
    !state ||
    !storedState ||
    !storedCodeVerifier ||
    state !== storedState
  ) {
    return new Response(null, { status: 400 });
  }

  try {
    const tokens = await google.validateAuthorizationCode(
      code,
      storedCodeVerifier
    );

    const userInfoResponse = await fetch(
      'https://openidconnect.googleapis.com/v1/userinfo',
      {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      }
    );
    const googleUser = await userInfoResponse.json();

    const cookie = await signInWithGoogleController({
      googleId: googleUser.sub,
      email: googleUser.email,
      username: googleUser.name,
    });

    cookieStore.set(cookie.name, cookie.value, cookie.attributes);
    cookieStore.delete('google_oauth_state');
    cookieStore.delete('google_code_verifier');

    return new Response(null, {
      status: 302,
      headers: { Location: '/dashboard' },
    });
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      return new Response(null, { status: 400 });
    }
    console.error(e);
    return new Response(null, { status: 500 });
  }
}
