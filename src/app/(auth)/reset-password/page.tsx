import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ResetPasswordForm from '@/components/forms/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Set New Password',
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const supabase = await createClient();

  // Exchange the code from the email link for a session (server-side)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      // Code invalid/expired — send user back to request a new link
      redirect('/forgot-password');
    }
    // Success — redirect to same page without code to prevent reuse
    redirect('/reset-password');
  }

  // No code — verify user has a valid session (set by the exchange above)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/forgot-password');
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="label-mono mb-3">Account</p>
          <h1 className="text-2xl font-bold text-text">New password</h1>
          <p className="text-sm text-text-muted mt-1">Enter your new password below</p>
        </div>
        <div className="border border-border rounded-lg p-6">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
