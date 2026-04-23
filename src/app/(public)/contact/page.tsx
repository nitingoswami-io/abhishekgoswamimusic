import type { Metadata } from 'next';
import ContactForm from '@/components/forms/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch.',
};

export default function ContactPage() {
  return (
    <div className="max-w-lg mx-auto px-6 sm:px-8 py-16 sm:py-20">
      <p className="label-mono mb-4">Reach Out</p>
      <h1 className="text-3xl sm:text-4xl font-bold text-text mb-3">Contact</h1>
      <p className="text-sm text-text-muted mb-10">
        Have a question, booking inquiry, or feedback? Drop a message.
      </p>

      <div className="border border-border rounded-lg p-6 sm:p-8">
        <ContactForm />
      </div>
    </div>
  );
}
