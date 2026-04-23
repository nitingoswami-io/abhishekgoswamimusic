'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import type { Course } from '@/types/database';

interface Props {
  course?: Course;
}

export default function CourseForm({ course }: Props) {
  const [loading, setLoading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    course?.thumbnail_url || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const isEdit = !!course;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPEG, PNG, and WebP images are allowed.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2 MB.');
      return;
    }

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  }

  function removeThumbnail() {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function uploadThumbnail(file: File): Promise<string> {
    const body = new FormData();
    body.append('file', file);

    const res = await fetch('/api/admin/upload', { method: 'POST', body });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Upload failed');
    }
    const { url } = await res.json();
    return url;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      let thumbnailUrl: string | null = thumbnailPreview;

      // Upload new file if one was selected
      if (thumbnailFile) {
        thumbnailUrl = await uploadThumbnail(thumbnailFile);
      }

      const formData = new FormData(e.currentTarget);
      const title = formData.get('title') as string;
      const priceRupees = parseFloat(formData.get('price') as string);

      const data = {
        title,
        slug: (formData.get('slug') as string) || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: formData.get('description') as string,
        price: Math.round(priceRupees * 100),
        thumbnail_url: thumbnailUrl,
        is_published: formData.get('is_published') === 'on',
      };

      const url = isEdit ? `/api/admin/courses/${course.id}` : '/api/admin/courses';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }

      toast.success(isEdit ? 'Course updated!' : 'Course created!');
      router.push('/admin/courses');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        id="title"
        name="title"
        label="Course Title"
        placeholder="e.g., Guitar Basics for Beginners"
        defaultValue={course?.title}
        required
      />
      <Input
        id="slug"
        name="slug"
        label="URL Slug (auto-generated if empty)"
        placeholder="e.g., guitar-basics"
        defaultValue={course?.slug}
      />
      <Textarea
        id="description"
        name="description"
        label="Description"
        placeholder="Describe what students will learn..."
        rows={5}
        defaultValue={course?.description ?? ''}
      />
      <Input
        id="price"
        name="price"
        type="number"
        label="Price (in Rupees)"
        placeholder="e.g., 999"
        step="1"
        min="0"
        defaultValue={course ? (course.price / 100).toString() : ''}
        required
      />

      {/* Thumbnail upload */}
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">
          Thumbnail (optional)
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />

        {thumbnailPreview ? (
          <div className="relative inline-block">
            <Image
              src={thumbnailPreview}
              alt="Thumbnail preview"
              width={320}
              height={180}
              className="rounded-lg border border-border object-cover"
              unoptimized={thumbnailPreview.startsWith('blob:')}
            />
            <button
              type="button"
              onClick={removeThumbnail}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
            >
              &times;
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-xs h-40 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 text-text-muted hover:text-primary transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <span className="text-sm">Click to upload image</span>
            <span className="text-xs">JPEG, PNG, or WebP (max 2 MB)</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_published"
          name="is_published"
          defaultChecked={course?.is_published ?? false}
          className="w-4 h-4 rounded border-border bg-surface-light text-primary focus:ring-primary"
        />
        <label htmlFor="is_published" className="text-sm text-text">
          Published (visible to students)
        </label>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Update Course' : 'Create Course'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
