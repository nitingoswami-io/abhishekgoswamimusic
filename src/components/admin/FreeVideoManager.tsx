'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Plus, Trash2, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import YouTubePreview from '@/components/admin/YouTubePreview';
import { getYouTubeId, type FreeVideo } from '@/types/database';

interface Props {
  initialVideos: FreeVideo[];
}

export default function FreeVideoManager({ initialVideos }: Props) {
  const [videos, setVideos] = useState(initialVideos);
  const [showForm, setShowForm] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      youtube_url: formData.get('youtube_url') as string,
      description: (formData.get('description') as string) || null,
      sort_order: videos.length,
      is_published: true,
    };

    try {
      const res = await fetch('/api/admin/free-videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to add');
      const newVideo = await res.json();
      setVideos([...videos, newVideo]);
      setShowForm(false);
      setNewUrl('');
      toast.success('Video added!');
      router.refresh();
    } catch {
      toast.error('Failed to add video');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (video: FreeVideo) => {
    try {
      const res = await fetch('/api/admin/free-videos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: video.id, is_published: !video.is_published }),
      });

      if (!res.ok) throw new Error('Failed to update');
      setVideos(
        videos.map((v) =>
          v.id === video.id ? { ...v, is_published: !v.is_published } : v
        )
      );
      toast.success(video.is_published ? 'Unpublished' : 'Published');
      router.refresh();
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this video?')) return;

    try {
      const res = await fetch('/api/admin/free-videos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error('Failed to delete');
      setVideos(videos.filter((v) => v.id !== id));
      if (expandedId === id) setExpandedId(null);
      toast.success('Deleted');
      router.refresh();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-4">
      {/* Video list with inline previews */}
      {videos.length > 0 ? (
        <div className="space-y-2">
          {videos.map((video) => {
            const isExpanded = expandedId === video.id;
            const ytId = getYouTubeId(video.youtube_url);

            return (
              <div
                key={video.id}
                className="border border-border rounded-lg overflow-hidden"
              >
                {/* Header row */}
                <div className="flex items-center gap-3 px-4 py-3 bg-background">
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
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text truncate">{video.title}</p>
                    <p className="text-xs text-text-dim truncate">{video.youtube_url}</p>
                  </div>
                  <Badge variant={video.is_published ? 'success' : 'warning'}>
                    {video.is_published ? 'Live' : 'Draft'}
                  </Badge>
                  <button
                    onClick={() => handleTogglePublish(video)}
                    className="p-1.5 text-text-dim hover:text-text transition-colors"
                    title={video.is_published ? 'Unpublish' : 'Publish'}
                  >
                    {video.is_published ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
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
                      {video.description && (
                        <p className="text-xs text-text-muted mt-3">{video.description}</p>
                      )}
                      <p className="text-xs text-text-dim mt-2">
                        This is how it appears on the site. {video.is_published ? 'Currently visible to everyone.' : 'Currently hidden (draft).'}
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
          <p className="text-sm text-text-dim">No free videos yet.</p>
        </div>
      )}

      {/* Add video form with live preview */}
      {showForm ? (
        <form
          onSubmit={handleAdd}
          className="border border-border rounded-lg p-5 space-y-4"
        >
          <h3 className="label-mono">Add Free Video</h3>

          {/* Live preview */}
          <YouTubePreview url={newUrl} />

          <Input id="title" name="title" label="Title" placeholder="Video title" required />
          <Input
            id="youtube_url"
            name="youtube_url"
            label="YouTube URL"
            placeholder="https://www.youtube.com/watch?v=..."
            required
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
          <Textarea
            id="description"
            name="description"
            label="Description (optional)"
            placeholder="Brief description"
            rows={2}
          />
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
          Add Free Video
        </Button>
      )}
    </div>
  );
}
