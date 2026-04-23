import { createClient } from '@/lib/supabase/server';
import CourseCard from '@/components/courses/CourseCard';

export default async function HomePage() {
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
      <p className="label-mono mb-4">Jazz & Fingerstyle Guitar</p>
      <h1 className="text-3xl sm:text-4xl font-bold text-text mb-3">Courses</h1>
      <p className="text-sm text-text-muted mb-12 max-w-lg">
        In-depth, structured courses to master jazz fingerstyle guitar.
      </p>

      {courses && courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-sm text-text-dim">No courses available yet. Check back soon.</p>
        </div>
      )}
    </div>
  );
}
