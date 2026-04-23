import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import CourseCard from '@/components/courses/CourseCard';
import type { PurchaseWithCourse } from '@/types/database';

export const metadata: Metadata = {
  title: 'My Courses',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: purchases } = await supabaseAdmin
    .from('purchases')
    .select('*, courses(*)')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('created_at', { ascending: false });

  const purchasedCourses = (purchases as PurchaseWithCourse[] | null) ?? [];

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
      <p className="label-mono mb-4">Dashboard</p>
      <h1 className="text-3xl sm:text-4xl font-bold text-text mb-3">My Courses</h1>
      <p className="text-sm text-text-muted mb-12">
        Your purchased courses — learn at your own pace.
      </p>

      {purchasedCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchasedCourses.map((purchase) => (
            <CourseCard key={purchase.id} course={purchase.courses} purchased />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-border rounded-lg">
          <p className="text-sm text-text-dim mb-4">No courses purchased yet.</p>
          <Link
            href="/courses"
            className="text-sm text-primary hover:text-primary-hover transition-colors"
          >
            Browse courses ↗
          </Link>
        </div>
      )}
    </div>
  );
}
