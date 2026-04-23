'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { NAV_LINKS, SITE_NAME } from '@/lib/constants';
import ThemeToggle from '@/components/layout/ThemeToggle';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/types/database';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.push('/');
    router.refresh();
  };

  if (pathname.startsWith('/admin')) return null;

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo — minimal text */}
          <Link href="/" className="text-sm font-semibold tracking-tight text-text">
            {SITE_NAME}
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-xs tracking-wide transition-colors ${
                  pathname === link.href
                    ? 'text-primary'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <ThemeToggle />

            {/* Separator */}
            <span className="w-px h-4 bg-border mx-2" />

            {user ? (
              <>
                {profile?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="px-3 py-1.5 text-xs text-text-muted hover:text-text transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 inline mr-1" />
                    Admin
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="px-3 py-1.5 text-xs text-text-muted hover:text-text transition-colors"
                >
                  My Courses
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-text-dim hover:text-text transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs text-text-muted hover:text-text transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 text-xs border border-border hover:border-primary text-text transition-colors rounded"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 text-text-muted hover:text-text"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-6 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block py-2 text-sm transition-colors ${
                  pathname === link.href
                    ? 'text-primary'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border pt-3 mt-3">
              {user ? (
                <>
                  {profile?.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="block py-2 text-sm text-text-muted hover:text-text"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 text-sm text-text-muted hover:text-text"
                  >
                    My Courses
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="block py-2 text-sm text-danger"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3 pt-1">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-text-muted hover:text-text"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-primary"
                  >
                    Sign Up
                  </Link>
                  <span className="ml-auto"><ThemeToggle /></span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
