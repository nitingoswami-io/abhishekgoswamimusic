'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const isEdit = !!course;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const priceRupees = parseFloat(formData.get('price') as string);

    const data = {
      title,
      slug: (formData.get('slug') as string) || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: formData.get('description') as string,
      price: Math.round(priceRupees * 100), // Convert to paise
      thumbnail_url: formData.get('thumbnail_url') as string || null,
      is_published: formData.get('is_published') === 'on',
    };

    try {
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
      <Input
        id="thumbnail_url"
        name="thumbnail_url"
        label="Thumbnail URL (optional)"
        placeholder="https://example.com/image.jpg"
        defaultValue={course?.thumbnail_url ?? ''}
      />
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
