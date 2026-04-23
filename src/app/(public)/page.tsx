import { createClient } from '@/lib/supabase/server';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import FeaturedCourses from '@/components/home/FeaturedCourses';

export default async function HomePage() {
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturedCourses courses={courses ?? []} />
    </>
  );
}
