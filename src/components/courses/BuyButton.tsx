'use client';

import { useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { formatPrice } from '@/types/database';

interface Props {
  courseId: string;
  courseTitle: string;
  price: number;
  slug: string;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function BuyButton({ courseId, courseTitle, price, slug }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBuy = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create order');
      }

      const { orderId, amount, currency } = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: 'Abhishek Goswami',
        description: courseTitle,
        order_id: orderId,
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId,
            }),
          });

          if (verifyRes.ok) {
            toast.success('Payment successful!');
            router.push(`/courses/${slug}/watch`);
            router.refresh();
          } else {
            toast.error('Payment verification failed. Contact support.');
          }
        },
        theme: {
          color: '#d4a843',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <button
        onClick={handleBuy}
        disabled={loading}
        className="w-full px-5 py-2.5 bg-primary text-background text-sm font-medium rounded hover:bg-primary-hover transition-colors disabled:opacity-40"
      >
        {loading ? 'Processing...' : `Buy Now — ${formatPrice(price)}`}
      </button>
    </>
  );
}
