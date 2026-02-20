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

    // Fetch GitHub user profile
    const githubUserResponse = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    });
    if (!githubUserResponse.ok) {
      const errorText = await githubUserResponse.text();
      console.error(
        'GitHub user fetch failed:',
        githubUserResponse.status,
        errorText
      );
      return new Response('Failed to fetch GitHub user', { status: 500 });
    }
    const githubUser = await githubUserResponse.json();

    // Fetch user emails (required to get primary email)
    const emailsResponse = await fetch('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    });
    if (!emailsResponse.ok) {
      const errorText = await emailsResponse.text();
      console.error(
        'GitHub emails fetch failed:',
        emailsResponse.status,
        errorText
      );
      return new Response('Failed to fetch GitHub emails', { status: 500 });
    }
    const emails = await emailsResponse.json();
    const primaryEmail = emails.find((e: any) => e.primary)?.email;
    if (!primaryEmail) {
      console.error('No primary email found in GitHub response', emails);
      return new Response('No primary email found', { status: 400 });
    }

    // Ensure required user fields exist
    if (!githubUser.id || !githubUser.login) {
      console.error('Missing required GitHub user fields', githubUser);
      return new Response('Incomplete user data from GitHub', { status: 500 });
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
    console.error('GitHub OAuth callback error:', e);
    if (e instanceof OAuth2RequestError) {
      return new Response(null, { status: 400 });
    }
    return new Response(null, { status: 500 });
  }
}
