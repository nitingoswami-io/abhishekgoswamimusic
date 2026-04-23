import Link from 'next/link';
import { type Course } from '@/types/database';
import CourseCard from '@/components/courses/CourseCard';

interface Props {
  courses: Course[];
}

export default function FeaturedCourses({ courses }: Props) {
  if (courses.length === 0) return null;

  return (
    <section className="border-t border-border smoky-gradient">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-20 sm:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="label-mono mb-3">Go Deeper</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-text">Premium Courses</h2>
          </div>
          <Link
            href="/courses"
            className="text-xs text-text-muted hover:text-text transition-colors hidden sm:block"
          >
            All courses ↗
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.slice(0, 3).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}
