import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getYouTubeId } from '@/types/database';

export const metadata: Metadata = {
  title: 'Free Lessons',
  description: 'Watch free jazz & fingerstyle guitar lessons.',
};

export default async function FreeVideosPage() {
  const supabase = await createClient();

  const { data: videos } = await supabase
    .from('free_videos')
    .select('*')
    .eq('is_published', true)
    .order('sort_order');

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
      <p className="label-mono mb-4">Watch & Learn</p>
      <h1 className="text-3xl sm:text-4xl font-bold text-text mb-3">Free Lessons</h1>
      <p className="text-sm text-text-muted mb-12 max-w-lg">
        Start learning right away — no sign-up required. Upgrade to premium for full courses.
      </p>

      {videos && videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => {
            const ytId = getYouTubeId(video.youtube_url);
            return (
              <div key={video.id} className="group">
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
                    <p className="text-xs text-text-muted mt-1">{video.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-sm text-text-dim">Free lessons coming soon.</p>
        </div>
      )}
    </div>
  );
}
