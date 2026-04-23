import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-guard';
import { supabaseAdmin } from '@/lib/supabase/admin';

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: Context) {
  try {
    await requireAdmin();
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from('course_videos')
      .select('*')
      .eq('course_id', id)
      .order('sort_order');

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error';
    const status = message === 'Unauthorized' ? 401 : message === 'Forbidden' ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: Request, { params }: Context) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from('course_videos')
      .insert({ ...body, course_id: id })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error';
    const status = message === 'Unauthorized' ? 401 : message === 'Forbidden' ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const { videoId, ...body } = await request.json();

    const { data, error } = await supabaseAdmin
      .from('course_videos')
      .update(body)
      .eq('id', videoId)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error';
    const status = message === 'Unauthorized' ? 401 : message === 'Forbidden' ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const { videoId } = await request.json();

    const { error } = await supabaseAdmin.from('course_videos').delete().eq('id', videoId);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error';
    const status = message === 'Unauthorized' ? 401 : message === 'Forbidden' ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
