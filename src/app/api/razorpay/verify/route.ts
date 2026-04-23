import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } =
      await request.json();

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      // Update purchase as failed
      await getSupabaseAdmin()
        .from('purchases')
        .update({
          status: 'failed',
          razorpay_payment_id,
          razorpay_signature,
        })
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('razorpay_order_id', razorpay_order_id);

      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Update purchase as completed
    const { error } = await getSupabaseAdmin()
      .from('purchases')
      .update({
        status: 'completed',
        razorpay_payment_id,
        razorpay_signature,
      })
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .eq('razorpay_order_id', razorpay_order_id);

    if (error) {
      console.error('Update purchase error:', error);
      return NextResponse.json({ error: 'Failed to update purchase' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
