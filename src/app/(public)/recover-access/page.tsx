import type { Metadata } from 'next';
import { Suspense } from 'react';
import RecoverAccessForm from '@/components/forms/RecoverAccessForm';

export const metadata: Metadata = {
  title: 'Recover Access',
};

export default function RecoverAccessPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="label-mono mb-3">Access</p>
          <h1 className="text-2xl font-bold text-text">Recover access</h1>
          <p className="text-sm text-text-muted mt-1">
            Enter the email you used when purchasing
          </p>
        </div>
        <div className="border border-border rounded-lg p-6">
          <Suspense>
            <RecoverAccessForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
