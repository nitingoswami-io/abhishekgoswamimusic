import type { Metadata } from 'next';
import { Suspense } from 'react';
import ResetPasswordForm from '@/components/forms/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Set New Password',
};

export default function ResetPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="label-mono mb-3">Account</p>
          <h1 className="text-2xl font-bold text-text">New password</h1>
          <p className="text-sm text-text-muted mt-1">Enter your new password below</p>
        </div>
        <div className="border border-border rounded-lg p-6">
          <Suspense>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
