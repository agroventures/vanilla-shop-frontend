import React from 'react';

const Hero = () => {
  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        webkit-playsinline="true"
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center scale-105"
      >
        <source src="/videos/hero_video.mov" type="video/mp4" />
      </video>

      {/* Layered Overlays for depth */}
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/35 to-black/70 z-10" />
      <div className="absolute inset-0 bg-linear-to-r from-black/30 via-transparent to-black/30 z-10" />

      {/* Ambient gold glow - bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-150 rounded-full bg-gold-500/10 blur-3xl z-10" />

      {/* Top shimmer line */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gold-400/60 to-transparent z-20" />

      {/* Floating side accents */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-3">
        <div className="h-20 w-px bg-linear-to-b from-transparent via-gold-400/50 to-transparent" />
        <div className="flex flex-col gap-3">
          {[
            { icon: 'fa-facebook', href: 'https://www.facebook.com/thevanillashopsl' },
            { icon: 'fa-instagram', href: 'https://www.instagram.com/the_vanillashop' },
            { icon: 'fa-tiktok', href: 'https://www.tiktok.com/@the_vanillashop' },
          ].map((s) => (
            <a
              key={s.icon}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 backdrop-blur-sm transition-all duration-300 hover:border-gold-400/40 hover:text-gold-400 hover:bg-gold-500/10"
            >
              <i className={`fa-brands ${s.icon} text-xs`} />
            </a>
          ))}
        </div>
        <div className="h-20 w-px bg-linear-to-b from-transparent via-gold-400/50 to-transparent" />
      </div>

      {/* Right side scroll indicator */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-3">
        <div className="h-20 w-px bg-linear-to-b from-transparent via-white/20 to-transparent" />
        <div
          className="text-[9px] uppercase tracking-[0.4em] text-white/40"
          style={{ writingMode: 'vertical-rl' }}
        >
          Scroll to explore
        </div>
        <div className="h-20 w-px bg-linear-to-b from-transparent via-white/20 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 text-center text-white px-4 max-w-5xl mx-auto">

        {/* Top badge */}
        <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/8 px-6 py-2.5 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
          <div className="h-1.5 w-1.5 rounded-full bg-gold-400 shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
          <span className="text-[11px] uppercase tracking-[0.4em] text-white/80 font-medium">
            Est. 2025 &nbsp;·&nbsp; Colombo, Sri Lanka
          </span>
          <div className="h-1.5 w-1.5 rounded-full bg-gold-400 shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
        </div>

        {/* Main heading */}
        <h1 className="font-serif font-bold leading-[1.08] mb-6">
          <span className="block text-5xl md:text-7xl lg:text-8xl bg-linear-to-b from-white via-white to-white/70 bg-clip-text text-transparent">
            From Bean
          </span>
          <span className="block text-5xl md:text-7xl lg:text-8xl bg-linear-to-r from-gold-300 via-gold-400 to-amber-300 bg-clip-text text-transparent mt-1">
            to Bliss
          </span>
        </h1>

        {/* Divider */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="h-px w-16 bg-linear-to-r from-transparent to-gold-400/70" />
          <i className="fa-solid fa-spa text-gold-400 text-sm" />
          <div className="h-px w-16 bg-linear-to-l from-transparent to-gold-400/70" />
        </div>

        {/* Subheading */}
        <p className="text-base md:text-xl font-light leading-8 text-white/75 max-w-2xl mx-auto mb-12">
          Experience vanilla in its purest form. A sensory journey of sweetness,
          warmth, and craftsmanship — straight from Sri Lanka's finest orchids.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">

          {/* Primary CTA */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-linear-to-r from-gold-400/40 to-amber-400/40 blur-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <a
              href="/shop"
              className="relative flex items-center gap-3 rounded-full bg-linear-to-r from-gold-500 to-amber-600 px-9 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-white shadow-[0_10px_40px_rgba(212,175,55,0.35)] transition-all duration-400 hover:shadow-[0_15px_50px_rgba(212,175,55,0.5)] hover:from-gold-400 hover:to-amber-500"
            >
              <i className="fa-solid fa-bag-shopping text-xs" />
              Shop Collection
              <i className="fa-solid fa-arrow-right text-xs transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>

          {/* Secondary CTA */}
          <div className="relative group">
            <a
              href="/about"
              className="relative flex items-center gap-3 rounded-full border border-white/25 bg-white/8 px-9 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-white backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.15)] transition-all duration-400 hover:border-white/50 hover:bg-white/15 hover:shadow-[0_15px_50px_rgba(0,0,0,0.25)]"
            >
              <i className="fa-solid fa-mug-hot text-xs" />
              Visit Café
            </a>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {[
            { value: '100%', label: 'Natural Vanilla' },
            { value: 'Sri Lanka', label: 'Origin' },
            { value: 'Hand', label: 'Pollinated' },
          ].map((stat, i) => (
            <React.Fragment key={stat.label}>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-serif font-bold text-gold-400">
                  {stat.value}
                </div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-white/50 mt-1">
                  {stat.label}
                </div>
              </div>
              {i < 2 && (
                <div className="h-8 w-px bg-white/15 hidden sm:block" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Bottom scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <div className="text-[9px] uppercase tracking-[0.4em] text-white/40">
          Discover
        </div>
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/20 p-1.5">
          <div className="h-2 w-0.5 rounded-full bg-gold-400 animate-bounce" />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black/40 to-transparent z-10" />
    </section>
  );
};

export default Hero;