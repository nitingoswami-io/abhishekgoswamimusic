import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { razorpay } from '@/lib/razorpay';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId } = await request.json();

    // Fetch course
    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('id, title, price')
      .eq('id', courseId)
      .eq('is_published', true)
      .single();

    if (courseError || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if already purchased
    const { data: existingPurchase } = await supabaseAdmin
      .from('purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .eq('status', 'completed')
      .single();

    if (existingPurchase) {
      return NextResponse.json({ error: 'Already purchased' }, { status: 400 });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: course.price, // already in paise
      currency: 'INR',
      notes: {
        courseId: course.id,
        userId: user.id,
      },
    });

    // Create pending purchase record
    await supabaseAdmin.from('purchases').upsert(
      {
        user_id: user.id,
        course_id: courseId,
        razorpay_order_id: order.id,
        amount: course.price,
        status: 'pending',
      },
      { onConflict: 'user_id,course_id' }
    );

    return NextResponse.json({
      orderId: order.id,
      amount: course.price,
      currency: 'INR',
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
