import { createClient } from '@/lib/supabase/server';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import FreeVideoPreview from '@/components/home/FreeVideoPreview';
import FeaturedCourses from '@/components/home/FeaturedCourses';

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: freeVideos }, { data: courses }] = await Promise.all([
    supabase
      .from('free_videos')
      .select('*')
      .eq('is_published', true)
      .order('sort_order')
      .limit(3),
    supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(3),
  ]);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <FreeVideoPreview videos={freeVideos ?? []} />
      <FeaturedCourses courses={courses ?? []} />
    </>
  );
}
