import Link from 'next/link';
import { formatPrice, type Course } from '@/types/database';
import Badge from '@/components/ui/Badge';

interface Props {
  course: Course;
  purchased?: boolean;
}

export default function CourseCard({ course, purchased }: Props) {
  const href = purchased ? `/courses/${course.slug}/watch` : `/courses/${course.slug}`;

  return (
    <Link href={href} className="group block">
      {/* Thumbnail */}
      <div className="aspect-video bg-surface rounded-lg overflow-hidden border border-border group-hover:border-border-hover transition-all relative">
        {course.thumbnail_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-dim">
            <span className="text-3xl">♪</span>
          </div>
        )}
        {purchased && (
          <div className="absolute top-2 right-2">
            <Badge variant="success">Owned</Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-3">
        <h3 className="text-sm font-medium text-text group-hover:text-primary transition-colors line-clamp-1">
          {course.title}
        </h3>
        {course.description && (
          <p className="text-xs text-text-muted mt-1 line-clamp-1">{course.description}</p>
        )}
        <p className="text-sm font-semibold text-primary mt-2">
          {course.price === 0 ? 'Free' : formatPrice(course.price)}
        </p>
      </div>
    </Link>
  );
}
