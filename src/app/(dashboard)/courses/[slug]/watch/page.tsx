import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import CoursePlayer from '@/components/player/CoursePlayer';
import type { CourseVideo } from '@/types/database';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const { data: course } = await getSupabaseAdmin()
    .from('courses')
    .select('title')
    .eq('slug', slug)
    .single();
  return { title: course?.title ?? 'Watch Course' };
}

export default async function WatchCoursePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  // Verify user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=/courses/${slug}/watch`);

  // Fetch course
  const { data: course } = await getSupabaseAdmin()
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!course) notFound();

  // Verify purchase
  const { data: purchase } = await getSupabaseAdmin()
    .from('purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .eq('status', 'completed')
    .single();

  if (!purchase) redirect(`/courses/${slug}`);

  // Fetch all videos (with URLs — user has paid)
  const { data: videos } = await getSupabaseAdmin()
    .from('course_videos')
    .select('*')
    .eq('course_id', course.id)
    .order('sort_order');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-text mb-6">{course.title}</h1>
      <CoursePlayer videos={(videos as CourseVideo[]) ?? []} courseTitle={course.title} />
    </div>
  );
}
