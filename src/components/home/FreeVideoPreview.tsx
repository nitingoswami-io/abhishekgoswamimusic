import Link from 'next/link';
import { getYouTubeId, type FreeVideo } from '@/types/database';

interface Props {
  videos: FreeVideo[];
}

export default function FreeVideoPreview({ videos }: Props) {
  if (videos.length === 0) return null;

  return (
    <section className="border-t border-border">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-20 sm:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="label-mono mb-3">Listen & Learn</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-text">Free Lessons</h2>
          </div>
          <Link
            href="/free-videos"
            className="text-xs text-text-muted hover:text-text transition-colors hidden sm:block"
          >
            View all ↗
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.slice(0, 3).map((video) => {
            const ytId = getYouTubeId(video.youtube_url);
            return (
              <div
                key={video.id}
                className="group"
              >
                <div className="aspect-video rounded-lg overflow-hidden border border-border group-hover:border-border-hover transition-colors">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${ytId}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-medium text-text">{video.title}</h3>
                  {video.description && (
                    <p className="text-xs text-text-muted mt-1 line-clamp-1">
                      {video.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 sm:hidden">
          <Link
            href="/free-videos"
            className="text-xs text-text-muted hover:text-text transition-colors"
          >
            View all free lessons ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
