import React from 'react';

const Welcome = () => {
  return (
    <section className="relative overflow-hidden py-28 px-6 md:px-12 bg-[#FBF6EC]">
      {/* Single soft glow, not three competing ones */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-gold-300/10 blur-[100px]" />

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-16 md:gap-20 items-center">

        {/* Image Side — single frame, no floating glass stack */}
        <div className="relative">
          {/* Thin offset frame, references the gold rule motif from the hero */}
          <div className="absolute -top-4 -left-4 w-full h-full border border-gold-500/40 rounded-sm" />

          <div className="relative overflow-hidden rounded-sm shadow-[0_30px_60px_rgba(60,35,10,0.14)]">
            <img
              src="/images/vanilla-shop.png"
              alt="Vanilla Shop Interior"
              className="w-full h-[440px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#241A14]/50 via-transparent to-transparent" />

            {/* Single caption, bottom-left, no blur/badge stack */}
            <div className="absolute bottom-0 left-0 right-0 px-6 py-5">
              <p className="text-[10px] uppercase tracking-[0.35em] text-vanilla-50/70 mb-1">
                Signature Space
              </p>
              <p className="font-serif italic text-lg text-white">
                Sri Lanka's first vanilla boutique
              </p>
            </div>
          </div>
        </div>

        {/* Content Side */}
        <div>
          {/* Eyebrow, matches hero exactly */}
          <p className="text-[11px] uppercase tracking-[0.5em] text-gold-700/70 mb-5">
            Colombo · Sri Lanka
          </p>

          <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] text-vanilla-950">
            Welcome to<br />
            <span className="italic font-light text-gold-600">The Vanilla Shop</span>
          </h2>

          <div className="w-12 h-px bg-gold-500 my-7" />

          <p className="text-base md:text-lg leading-8 text-vanilla-900/80">
            Nestled in the heart of Colombo, The Vanilla Shop is more than a café —
            it's Sri Lanka's first dedicated vanilla boutique, celebrating the
            world's most beloved flavor in its truest, most natural form.
          </p>

          <p className="mt-4 text-sm md:text-base leading-7 text-vanilla-800/60">
            Every creation reflects our passion for quality and authenticity.
            Each moment, from a vanilla-infused beverage to a gift from our
            retail collection, carries the pure essence of vanilla.
          </p>

          {/* Specialty & Craft — quiet list, not shadowed cards */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="border-l border-gold-500/40 pl-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold-700/70 mb-1.5">
                Specialty
              </p>
              <p className="font-serif text-vanilla-950 text-[15px] leading-snug">
                Sri Lanka's first dedicated vanilla boutique
              </p>
            </div>

            <div className="border-l border-gold-500/40 pl-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold-700/70 mb-1.5">
                Craft
              </p>
              <p className="font-serif text-vanilla-950 text-[15px] leading-snug">
                Hand-pollinated orchids, refined vanilla notes
              </p>
            </div>
          </div>

          {/* Heritage — quote-style block instead of floating badge card */}
          <div className="relative mt-10 pl-6 border-l-2 border-gold-500">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold-700/70 mb-2">
              Heritage
            </p>
            <h3 className="font-serif text-xl text-vanilla-950 mb-2">
              A Legacy Rooted in Heritage
            </h3>
            <p className="text-sm leading-7 text-vanilla-800/60">
              We partner with Sri Lankan farmers who hand-pollinate every orchid.
              Our vanilla is known for its soft smokiness and deep aroma —
              cherished by connoisseurs worldwide.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;