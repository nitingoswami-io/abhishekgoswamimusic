export default function AboutSection() {
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

  return (
    <section className="border-t border-border">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-20 sm:py-24">
        <p className="label-mono mb-10">Why Learn Here</p>

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
      </div>
    </section>
  );
}
