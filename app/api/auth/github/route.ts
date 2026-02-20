import { github } from '@/lib/oauth';
import { generateState } from 'oslo/oauth2';
import { cookies } from 'next/headers';

export async function GET() {
  const state = generateState();
  const url = await github.createAuthorizationURL(state, []);

  const cookieStore = await cookies();
  cookieStore.set('github_oauth_state', state, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 10,
    sameSite: 'lax',
  });

  return Response.redirect(url);
}
