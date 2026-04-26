'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import YouTubePreview from '@/components/admin/YouTubePreview';
import { getYouTubeId, type CourseVideo } from '@/types/database';

interface Props {
  courseId: string;
  initialVideos: CourseVideo[];
}

export default function VideoManager({ courseId, initialVideos }: Props) {
  const [videos, setVideos] = useState(initialVideos);
  const [showForm, setShowForm] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const youtubeUrl = formData.get('youtube_url') as string;

    if (!getYouTubeId(youtubeUrl)) {
      toast.error('Invalid YouTube URL. Please enter a valid YouTube link.');
      return;
    }

    setLoading(true);

    const data = {
      title: formData.get('title') as string,
      youtube_url: youtubeUrl,
      sort_order: Math.max(...videos.map((v) => v.sort_order), -1) + 1,
      is_preview: formData.get('is_preview') === 'on',
      duration_minutes: formData.get('duration')
        ? parseInt(formData.get('duration') as string)
        : null,
    };

    try {
      const res = await fetch(`/api/admin/courses/${courseId}/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to add video');

      const newVideo = await res.json();
      setVideos([...videos, newVideo]);
      setShowForm(false);
      setNewUrl('');
      (e.target as HTMLFormElement).reset();
      toast.success('Video added!');
      router.refresh();
    } catch {
      toast.error('Failed to add video');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (videoId: string) => {
    if (!confirm('Delete this video?')) return;

    try {
      const res = await fetch(`/api/admin/courses/${courseId}/videos`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId }),
      });

      if (!res.ok) throw new Error('Failed to delete');

      setVideos(videos.filter((v) => v.id !== videoId));
      if (expandedId === videoId) setExpandedId(null);
      toast.success('Video deleted');
      router.refresh();
    } catch {
      toast.error('Failed to delete video');
    }
  };

  return (
    <div className="space-y-4">
      {/* Video list with inline previews */}
      {videos.length > 0 ? (
        <div className="space-y-2">
          {videos.map((video, index) => {
            const isExpanded = expandedId === video.id;
            const ytId = getYouTubeId(video.youtube_url);

            return (
              <div
                key={video.id}
                className="border border-border rounded-lg overflow-hidden"
              >
                {/* Header row */}
                <div className="flex items-center gap-3 px-4 py-3 bg-background">
                  <span className="text-xs font-mono text-text-dim w-6">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : video.id)}
                    className="flex-1 min-w-0 text-left"
                  >
                    <p className="text-sm font-medium text-text truncate">{video.title}</p>
                    <p className="text-xs text-text-dim truncate">{video.youtube_url}</p>
                  </button>
                  {video.is_preview && <Badge variant="default">Preview</Badge>}
                  {video.duration_minutes && (
                    <span className="text-xs text-text-dim">{video.duration_minutes}m</span>
                  )}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : video.id)}
                    className="text-text-dim hover:text-text transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    aria-label={`Delete video: ${video.title}`}
                    className="p-1.5 text-text-dim hover:text-danger transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Expanded preview */}
                {isExpanded && (
                  <div className="border-t border-border p-4 bg-surface">
                    <div className="max-w-lg">
                      <div className="aspect-video rounded-lg overflow-hidden border border-border">
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${ytId}`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                      <p className="text-xs text-text-dim mt-3">
                        {video.is_preview
                          ? 'Marked as preview — title visible to all, video plays only for purchasers.'
                          : 'Locked — only visible to users who purchased this course.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-10 text-center border border-border rounded-lg">
          <p className="text-sm text-text-dim">No videos yet. Add your first lesson below.</p>
        </div>
      )}

      {/* Add video form with live preview */}
      {showForm ? (
        <form
          onSubmit={handleAdd}
          className="border border-border rounded-lg p-5 space-y-4"
        >
          <h3 className="label-mono">Add Lesson</h3>

          {/* Live preview */}
          <YouTubePreview url={newUrl} />

          <Input
            id="title"
            name="title"
            label="Video Title"
            placeholder="e.g., Lesson 1 — Introduction"
            required
          />
          <Input
            id="youtube_url"
            name="youtube_url"
            label="YouTube URL (unlisted)"
            placeholder="https://www.youtube.com/watch?v=..."
            required
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="duration"
              name="duration"
              type="number"
              label="Duration (minutes)"
              placeholder="e.g., 15"
              min="1"
            />
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
                <input
                  type="checkbox"
                  name="is_preview"
                  className="w-4 h-4 rounded border-border bg-surface text-primary"
                />
                Free preview
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <Button type="submit" variant="primary" size="sm" disabled={loading}>
              {loading ? 'Adding...' : 'Add Video'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setShowForm(false);
                setNewUrl('');
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button variant="outline" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Add Video
        </Button>
      )}
    </div>
  );
}
