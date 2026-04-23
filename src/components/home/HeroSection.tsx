import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Smoky ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,_rgba(212,168,67,0.06)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,_rgba(212,168,67,0.04)_0%,_transparent_50%)]" />

      <div className="relative max-w-5xl mx-auto px-6 sm:px-8 py-32 sm:py-40 lg:py-48">
        <div className="max-w-2xl">
          <p className="label-mono mb-6">Jazz & Fingerstyle Guitar</p>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-text leading-[1.05] tracking-tight mb-8">
            Abhishek
            <br />
            <span className="text-primary">Goswami</span>
          </h1>

          <p className="text-base sm:text-lg text-text-muted leading-relaxed max-w-lg mb-12">
            Exploring the art of solo guitar — where jazz harmony meets fingerstyle technique.
            Learn through structured courses.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/courses"
              className="px-6 py-2.5 bg-primary text-background text-sm font-medium rounded hover:bg-primary-hover transition-colors"
            >
              Explore Courses
            </Link>
           
          </div>
        </div>
      </div>

      {/* Bottom border fade */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
