'use client';

import { useState } from 'react';
import { SignInForm } from '@/components/sign-in-form';
import { signIn } from '../actions';

export default function SignInPage() {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    const formData = new FormData(event.currentTarget);

    setLoading(true);
    const res = await signIn(formData);
    if (res && res.error) {
      setError(res.error);
    }
    setLoading(false);
  };

  const handleGithubClick = () => {
    window.location.href = '/api/auth/github';
  };

  const handleGoogleClick = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <SignInForm
          onSubmit={handleSubmit}
          error={error}
          loading={loading}
          onGithubClick={handleGithubClick}
          onGoogleClick={handleGoogleClick}
        />
      </div>
    </div>
  );
}
