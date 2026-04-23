'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="your@email.com"
          required
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Your password"
          required
          minLength={6}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full px-5 py-2.5 bg-primary text-background text-sm font-medium rounded hover:bg-primary-hover transition-colors disabled:opacity-40"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-3 text-text-dim">or</span>
        </div>
      </div>

      <button
        onClick={handleGoogleLogin}
        className="w-full px-5 py-2.5 border border-border text-text text-sm rounded hover:border-primary transition-colors"
      >
        Continue with Google
      </button>

      <p className="text-center text-xs text-text-dim">
        No account?{' '}
        <Link
          href={`/register${redirect !== '/dashboard' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
          className="text-primary hover:text-primary-hover"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
