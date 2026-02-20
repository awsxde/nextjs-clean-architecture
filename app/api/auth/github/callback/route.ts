import { github } from '@/lib/oauth';
import { cookies } from 'next/headers';
import { OAuth2RequestError } from 'arctic';
import { getInjection } from '@/di/container';

const signInWithGithubController = getInjection('ISignInWithGithubController');

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const cookieStore = await cookies();
  const storedState = cookieStore.get('github_oauth_state')?.value;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, { status: 400 });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);

    const githubUserResponse = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    });
    const githubUser = await githubUserResponse.json();

    const emailsResponse = await fetch('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    });
    const emails = await emailsResponse.json();
    const primaryEmail = emails.find((e: any) => e.primary)?.email;
    if (!primaryEmail) {
      return new Response('No primary email found', { status: 400 });
    }

    const cookie = await signInWithGithubController({
      githubId: githubUser.id.toString(),
      email: primaryEmail,
      username: githubUser.login,
    });

    cookieStore.set(cookie.name, cookie.value, cookie.attributes);
    cookieStore.delete('github_oauth_state');

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
