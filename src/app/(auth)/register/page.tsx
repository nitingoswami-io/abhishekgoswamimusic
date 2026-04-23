import type { Metadata } from 'next';
import { Suspense } from 'react';
import RegisterForm from '@/components/forms/RegisterForm';

export const metadata: Metadata = {
  title: 'Sign Up',
};

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="label-mono mb-3">Account</p>
          <h1 className="text-2xl font-bold text-text">Create account</h1>
          <p className="text-sm text-text-muted mt-1">Start your guitar learning journey</p>
        </div>
        <div className="border border-border rounded-lg p-6">
          <Suspense>
            <RegisterForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
