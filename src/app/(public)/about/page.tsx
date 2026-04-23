import type { Metadata } from 'next';
import ContactForm from '@/components/forms/ContactForm';

export const metadata: Metadata = {
  title: 'About',
  description: 'About Abhishek Goswami — Jazz & Fingerstyle Guitarist.',
};

const highlights = [
  {
    label: 'Approach',
    title: 'Structured Learning',
    description:
      'Step-by-step curriculum designed for progressive growth. No guesswork — just the right things in the right order.',
  },
  {
    label: 'Style',
    title: 'Jazz Meets Fingerstyle',
    description:
      'Where chord melody, walking bass lines, and solo arrangements come together on a single guitar.',
  },
  {
    label: 'Access',
    title: 'Learn at Your Pace',
    description:
      'Lifetime access to all purchased content. Rewatch, revisit, and refine whenever you want.',
  },
];

const socials = [
  { name: 'YouTube', href: 'https://www.youtube.com/@AbhishekGoswamiMusic' },
  { name: 'Instagram', href: 'https://www.instagram.com/thisisabhishekgoswami/' },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
      {/* Bio */}
      <section className="mb-16">
        <p className="label-mono mb-4">About</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-text mb-6">
          Abhishek Goswami
        </h1>
        <p className="text-sm text-text-muted leading-relaxed max-w-xl mb-12">
          Exploring the art of solo guitar — where jazz harmony meets fingerstyle technique.
          Through structured courses, Abhishek helps guitarists build a strong foundation
          in chord melody, walking bass lines, and solo arrangements.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-lg overflow-hidden">
          {highlights.map((item) => (
            <div key={item.title} className="bg-background p-6 sm:p-8">
              <p className="text-[0.65rem] font-mono uppercase tracking-[0.18em] text-primary mb-3">
                {item.label}
              </p>
              <h3 className="text-base font-semibold text-text mb-2">{item.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social */}
      <section className="border-t border-border pt-16 mb-16">
        <p className="label-mono mb-6">Connect</p>
        <div className="flex items-center gap-4">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm border border-border rounded hover:border-primary hover:text-primary text-text-muted transition-colors"
            >
              {s.name} ↗
            </a>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-border pt-16">
        <p className="label-mono mb-4">Reach Out</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-text mb-3">Contact</h2>
        <p className="text-sm text-text-muted mb-10">
          Have a question, booking inquiry, or feedback? Drop a message.
        </p>

        <div className="max-w-lg border border-border rounded-lg p-6 sm:p-8">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
