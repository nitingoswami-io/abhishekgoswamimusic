import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-guard';
import { supabaseAdmin } from '@/lib/supabase/admin';

interface Context {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: Context) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from('courses')
      .update(body)
      .eq('id', id)
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

export async function DELETE(_request: Request, { params }: Context) {
  try {
    await requireAdmin();
    const { id } = await params;

    const { error } = await supabaseAdmin.from('courses').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error';
    const status = message === 'Unauthorized' ? 401 : message === 'Forbidden' ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
