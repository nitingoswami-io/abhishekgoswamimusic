import { supabaseAdmin } from '@/lib/supabase/admin';
import FreeVideoManager from '@/components/admin/FreeVideoManager';

export const metadata = { title: 'Manage Free Videos' };

export default async function AdminFreeVideosPage() {
  const { data: videos } = await supabaseAdmin
    .from('free_videos')
    .select('*')
    .order('sort_order');

  return (
    <div>
      <h1 className="text-2xl font-bold text-text mb-6">Free Videos</h1>
      <FreeVideoManager initialVideos={videos ?? []} />
    </div>
  );
}
