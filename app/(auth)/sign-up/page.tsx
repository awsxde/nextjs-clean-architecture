'use client';

import { useState } from 'react';
import { SignUpForm } from '@/components/sign-up-form';
import { signUp } from '../actions';

export default function SignUpPage() {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    const formData = new FormData(event.currentTarget);
    const password = formData.get('password')?.toString() || '';
    const confirmPassword = formData.get('confirm_password')?.toString() || '';

    if (password !== confirmPassword) {
      setError('Passwords must match');
      return;
    }

    setLoading(true);
    const res = await signUp(formData);
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
        <SignUpForm
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
