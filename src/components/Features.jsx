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

  const trust = [
    { icon: 'fa-leaf', text: 'Naturally Grown' },
    { icon: 'fa-flask', text: 'Lab Verified' },
    { icon: 'fa-award', text: 'Award Winning' },
    { icon: 'fa-truck', text: 'Island-Wide Delivery' },
    { icon: 'fa-recycle', text: 'Eco Packaged' },
  ];

  return (
    <section className="relative overflow-hidden py-28 px-6 md:px-12 bg-vanilla-50">
      {/* One quiet top rule, matches every other section */}
      <div className="absolute top-0 left-0 w-full h-px bg-gold-500/20" />

      <div className="relative max-w-6xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-[11px] uppercase tracking-[0.5em] text-gold-600/80 mb-6">
            Our Promise
          </p>

          <h2 className="font-serif text-4xl md:text-5xl leading-[1.15] text-vanilla-950">
            Why Choose<br />
            <span className="italic font-light text-gold-600">The Vanilla Shop</span>
          </h2>

          <div className="w-12 h-px bg-gold-500 mx-auto mt-7 mb-7" />

          <p className="text-vanilla-800/60 max-w-md mx-auto leading-7 text-[15px]">
            Every detail, every ingredient, every moment — designed around the world's
            finest vanilla experience.
          </p>
        </div>

        {/* Feature Cards — flat, one hover motion each */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-vanilla-200/70">
          {features.map((feature, index) => (
            <div key={index} className="group relative bg-vanilla-50 p-8 transition-colors duration-500 hover:bg-white">

              {/* Label */}
              <p className="text-[9px] uppercase tracking-[0.35em] text-gold-600/80 font-medium mb-6">
                {feature.label}
              </p>

              {/* Icon — quiet outline circle, matches History section */}
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-gold-500/25 transition-colors duration-500 group-hover:border-gold-500/60">
                <i className={`fa-solid ${feature.icon} text-base text-gold-600`} />
              </div>

              {/* Title */}
              <h4 className="font-serif text-lg text-vanilla-950 mb-1.5">
                {feature.title}
              </h4>

              {/* Divider — one motion */}
              <div className="mb-4 h-px w-8 bg-gold-500/50 transition-all duration-500 group-hover:w-14" />

              {/* Description */}
              <p className="text-sm leading-7 text-vanilla-800/60 mb-5">
                {feature.text}
              </p>

              {/* Stat — plain text, not a badge pill */}
              <p className="text-[10px] uppercase tracking-[0.3em] text-vanilla-800/40">
                {feature.stat}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom trust row — flat divided strip, not pill cluster */}
        <div className="mt-20 flex flex-wrap items-center justify-center divide-x divide-gold-500/20">
          {trust.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 px-6 py-1 text-[11px] uppercase tracking-[0.2em] text-vanilla-800/60"
            >
              <i className={`fa-solid ${item.icon} text-gold-500 text-xs`} />
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;