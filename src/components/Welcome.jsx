import React from 'react';

const Welcome = () => {
  return (
    <section className="relative overflow-hidden py-24 px-4 md:px-12">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,248,235,0.9),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.16),transparent_30%)]" />
      <div className="absolute -top-20 left-10 h-72 w-72 rounded-full bg-gold-300/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-amber-200/20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        {/* Image Side */}
        <div className="relative group perspective:[1400px]">
          {/* Glow */}
          <div className="absolute -inset-6 rounded-4xl bg-linear-to-tr from-gold-400/20 via-white/20 to-vanilla-200/40 blur-2xl" />

          {/* Back layer */}
          <div className="absolute inset-0 translate-x-6 translate-y-6 rounded-4xl bg-linear-to-br from-vanilla-200 to-gold-200/60 shadow-2xl" />

          {/* Main image card */}
          <div className="relative overflow-hidden rounded-4xl border border-white/50 bg-white/30 shadow-[0_30px_80px_rgba(60,35,10,0.18)] backdrop-blur-sm transition duration-700 transform-3d] transform:[rotateY(-8deg)_rotateX(3deg)] group-hover:transform:[rotateY(-2deg)_rotateX(0deg)_translateY(-8px)]">
            <img
              src="/images/vanilla-shop.png"
              alt="Vanilla Shop Interior"
              className="w-full h-105 object-cover scale-[1.02] transition duration-700 group-hover:scale-105"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-white/10" />

            {/* Top badge */}
            <div className="absolute top-5 left-5 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-[10px] md:text-xs tracking-[0.28em] text-white uppercase backdrop-blur-md shadow-lg">
              Vanilla Boutique
            </div>

            {/* Floating info card */}
            <div className="absolute bottom-5 right-5 max-w-60 rounded-2xl border border-white/30 bg-white/15 p-4 text-white backdrop-blur-md shadow-xl">
              <p className="mb-1 text-[10px] uppercase tracking-[0.3em] text-white/80">
                Signature Space
              </p>
              <p className="text-sm leading-relaxed">
                Elegant interiors, handcrafted flavors, and the rich aroma of Sri Lankan vanilla.
              </p>
            </div>
          </div>
        </div>

        {/* Content Side */}
        <div className="relative">
          {/* Soft back glow */}
          <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-4xl bg-linear-to-br from-gold-200/30 to-vanilla-200/30 blur-xl" />

          {/* Main content card */}
          <div className="relative rounded-4xl border border-white/60 bg-white/75 p-8 md:p-10 shadow-[0_25px_70px_rgba(76,52,24,0.12)] backdrop-blur-xl">
            <span className="inline-flex items-center rounded-full border border-gold-300/60 bg-gold-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-gold-700 shadow-sm">
              Colombo · Sri Lanka
            </span>

            <h2 className="mt-5 text-4xl md:text-5xl font-serif font-bold leading-tight bg-linear-to-r from-vanilla-900 to-amber-800 bg-clip-text text-transparent">
              Welcome to The Vanilla Shop
            </h2>

            <div className="mt-5 h-px w-24 bg-linear-to-r from-gold-500 to-transparent" />

            <p className="mt-6 text-lg leading-8 text-vanilla-900">
              Nestled in the heart of Colombo, The Vanilla Shop is more than a café —
              it’s Sri Lanka’s first dedicated vanilla boutique. Here, we celebrate the
              world’s most beloved flavor in its truest, most natural form.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Every creation reflects our passion for quality and authenticity. Whether
              you’re sipping a vanilla-infused beverage or selecting a gift from our
              retail collection, each moment is infused with the pure essence of vanilla.
            </p>

            {/* Premium stat cards */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-vanilla-200 bg-linear-to-br from-white to-vanilla-50 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_10px_25px_rgba(0,0,0,0.05)]">
                <p className="text-xs uppercase tracking-[0.2em] text-gold-700 mb-1">
                  Specialty
                </p>
                <p className="font-semibold text-vanilla-900">
                  Sri Lanka’s first dedicated vanilla boutique
                </p>
              </div>

              <div className="rounded-2xl border border-vanilla-200 bg-linear-to-br from-white to-vanilla-50 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_10px_25px_rgba(0,0,0,0.05)]">
                <p className="text-xs uppercase tracking-[0.2em] text-gold-700 mb-1">
                  Craft
                </p>
                <p className="font-semibold text-vanilla-900">
                  Hand-pollinated orchids and refined vanilla notes
                </p>
              </div>
            </div>

            {/* Heritage Card */}
            <div className="relative mt-8 rounded-3xl border border-gold-200 bg-linear-to-br from-vanilla-50 via-white to-gold-50/70 p-6 shadow-[0_18px_40px_rgba(120,90,30,0.10)]">
              <div className="absolute -top-4 left-6 rounded-full bg-gold-500 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white shadow-lg">
                Heritage
              </div>

              <h3 className="font-serif text-2xl font-bold text-vanilla-900 mb-3 mt-2">
                A Legacy Rooted in Heritage
              </h3>

              <p className="text-sm leading-7 text-gray-700">
                We partner with Sri Lankan farmers who hand-pollinate every orchid. Our
                vanilla is known for its soft smokiness and deep aroma — cherished by
                connoisseurs worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;