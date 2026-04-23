import React from 'react';

const Features = () => {
  const features = [
    {
      icon: 'fa-certificate',
      title: 'Authenticity & Purity',
      text: 'Only hand-cured, natural vanilla. No synthetic vanillin — ever.',
      label: 'Quality',
      stat: '100% Natural',
    },
    {
      icon: 'fa-mortar-pestle',
      title: 'Craft & Care',
      text: 'Small-batch production ensures unrivalled consistency and depth of flavor.',
      label: 'Process',
      stat: 'Small Batch',
    },
    {
      icon: 'fa-mug-hot',
      title: 'Experience & Taste',
      text: "Exclusive café creations and blends you won't find anywhere else in Sri Lanka.",
      label: 'Exclusive',
      stat: 'One of a Kind',
    },
    {
      icon: 'fa-hand-holding-heart',
      title: 'Sustainability',
      text: 'Ethically sourced from local farmers who hand-pollinate every orchid with care.',
      label: 'Ethical',
      stat: 'Farm to Cup',
    },
  ];

  return (
    <section className="relative overflow-hidden py-28 px-4 md:px-12 bg-linear-to-b from-vanilla-50 via-vanilla-100/80 to-vanilla-50">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(212,175,55,0.09),transparent_45%),radial-gradient(ellipse_at_bottom_right,rgba(255,248,235,0.7),transparent_40%)]" />
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gold-400/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gold-400/30 to-transparent" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-gold-200/20 blur-3xl" />
      <div className="absolute -bottom-40 right-0 h-72 w-72 rounded-full bg-vanilla-300/30 blur-3xl" />

      <div className="relative max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-flex items-center rounded-full border border-gold-400/40 bg-gold-50 px-5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.4em] text-gold-600 shadow-sm">
            Our Promise
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-serif font-bold bg-linear-to-r from-vanilla-900 via-amber-800 to-gold-600 bg-clip-text text-transparent leading-tight">
            Why Choose The Vanilla Shop
          </h2>

          <div className="mt-5 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-linear-to-r from-transparent to-gold-400/70" />
            <i className="fa-solid fa-spa text-gold-400 text-xs" />
            <div className="h-px w-16 bg-linear-to-l from-transparent to-gold-400/70" />
          </div>

          <p className="mt-5 text-gray-500 max-w-md mx-auto leading-7">
            Every detail, every ingredient, every moment — designed around the world's
            finest vanilla experience.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 perspective:distant">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative transform-3d transition-all duration-500 hover:transform:[translateY(-12px)]"
            >
              {/* Hover glow */}
              <div className="absolute -inset-1 rounded-4xl bg-linear-to-br from-gold-300/25 via-transparent to-gold-100/20 blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Back depth layer */}
              <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-4xl bg-linear-to-br from-vanilla-200/80 to-gold-100/40" />

              {/* Main card */}
              <div className="relative flex flex-col rounded-4xl border border-vanilla-200/90 bg-white overflow-hidden shadow-[0_15px_50px_rgba(76,52,24,0.08)] transition-all duration-500 group-hover:border-gold-300/50 group-hover:shadow-[0_25px_70px_rgba(76,52,24,0.14),inset_0_1px_0_rgba(212,175,55,0.12)] p-7">

                {/* Top shimmer */}
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white to-transparent" />

                {/* Label + stat row */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[9px] uppercase tracking-[0.35em] text-gold-600 font-semibold">
                    {feature.label}
                  </span>
                  <span className="rounded-full border border-gold-200 bg-gold-50 px-3 py-1 text-[9px] font-semibold tracking-[0.2em] text-gold-700 uppercase">
                    {feature.stat}
                  </span>
                </div>

                {/* Icon */}
                <div className="relative mb-6 inline-flex self-start">
                  <div className="absolute inset-0 rounded-xl bg-gold-400/20 blur-md" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-gold-200/60 bg-linear-to-br from-gold-50 to-vanilla-100 shadow-[inset_0_1px_0_rgba(212,175,55,0.3),0_8px_20px_rgba(76,52,24,0.10)]">
                    <i className={`fa-solid ${feature.icon} text-xl text-gold-500`} />
                  </div>
                </div>

                {/* Title */}
                <h4 className="font-serif text-lg font-bold text-vanilla-900 mb-1 group-hover:text-amber-800 transition-colors duration-300">
                  {feature.title}
                </h4>

                {/* Animated underline */}
                <div className="mb-4 h-px w-8 bg-linear-to-r from-gold-400 to-transparent transition-all duration-500 group-hover:w-16" />

                {/* Description */}
                <p className="text-sm leading-7 text-gray-500 group-hover:text-gray-600 transition-colors duration-300 flex-1">
                  {feature.text}
                </p>

                {/* Bottom CTA link */}
                {/* <div className="mt-6 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-500 opacity-0 transition-all duration-400 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0">
                  <span>Learn more</span>
                  <i className="fa-solid fa-arrow-right text-[9px] transition-transform duration-300 group-hover:translate-x-1" />
                </div> */}

                {/* Bottom shimmer */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold-300/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Corner accent dot */}
                {/* <div className="absolute bottom-5 right-5 h-6 w-6 rounded-full border border-gold-300/20 bg-gold-50/50 opacity-0 transition-all duration-500 group-hover:opacity-100" /> */}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom trust row */}
        <div className="mt-20 flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {[
            { icon: 'fa-leaf', text: 'Naturally Grown' },
            { icon: 'fa-flask', text: 'Lab Verified' },
            { icon: 'fa-award', text: 'Award Winning' },
            { icon: 'fa-truck', text: 'Island-Wide Delivery' },
            { icon: 'fa-recycle', text: 'Eco Packaged' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 rounded-full border border-vanilla-200 bg-white/80 px-5 py-2.5 text-xs font-semibold text-vanilla-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-gold-300 hover:shadow-md hover:text-gold-700"
            >
              <i className={`fa-solid ${item.icon} text-gold-400 text-xs`} />
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;