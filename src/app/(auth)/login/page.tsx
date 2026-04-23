import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoginForm from '@/components/forms/LoginForm';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="label-mono mb-3">Account</p>
          <h1 className="text-2xl font-bold text-text">Welcome back</h1>
          <p className="text-sm text-text-muted mt-1">Sign in to access your courses</p>
        </div>
        <div className="border border-border rounded-lg p-6">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
