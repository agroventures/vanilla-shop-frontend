import React from 'react';

const History = () => {
  const cards = [
    {
      icon: 'fa-solid fa-earth-americas',
      label: 'Origins',
      title: 'Ancient Origins',
      description:
        "From the Totonac people of Mexico to the Aztecs' sacred 'xocolatl', vanilla has been treasured for centuries. Once the \"Queen of Spices\" in royal European courts, it now thrives in Sri Lanka's rich soils.",
      year: 'c. 1400 BC',
    },
    {
      icon: 'fa-solid fa-seedling',
      label: 'Cultivation',
      title: 'Cultivating Purity',
      description:
        'Vanilla is intricate. Each orchid blooms once a year and must be hand-pollinated within hours. The beans undergo a months-long curing process — killing, sweating, drying, and conditioning.',
      year: '365 Days',
    },
    {
      icon: 'fa-solid fa-hands-holding-circle',
      label: 'Heritage',
      title: 'Global Value, Local Pride',
      description:
        "As global demand for natural flavors rises, Sri Lankan vanilla is earning admiration. We take pride in representing Sri Lanka's emerging vanilla identity to the world.",
      year: 'Since 2020',
    },
  ];

  return (
    <section className="relative overflow-hidden py-28 px-4 md:px-12 bg-vanilla-900">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(212,175,55,0.10),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(255,248,235,0.05),transparent_50%)]" />
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gold-500/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gold-500/30 to-transparent" />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-gold-500/5 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-gold-500/5 blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-flex items-center rounded-full border border-gold-500/30 bg-gold-500/10 px-5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.4em] text-white backdrop-blur-sm">
            The Story of Vanilla
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-serif font-bold bg-linear-to-r from-vanilla-50 via-gold-300 to-vanilla-200 bg-clip-text text-transparent leading-tight">
            A Legacy Centuries in the Making
          </h2>

          <div className="mt-5 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-linear-to-r from-transparent to-gold-500/70" />
            <i className="fa-solid fa-spa text-gold-500 text-xs" />
            <div className="h-px w-16 bg-linear-to-l from-transparent to-gold-500/70" />
          </div>

          <p className="mt-6 max-w-xl mx-auto text-vanilla-200/70 leading-8">
            From ancient civilizations to modern artisans, the journey of vanilla is as
            rich and complex as its flavor.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 perspective:distant">
          {cards.map((card, index) => (
            <div
              key={index}
              className="group relative transform-3d] transition-all duration-700 hover:transform:[translateY(-10px)]"
            >
              {/* Back glow layer */}
              <div className="absolute -inset-1 rounded-4xl bg-linear-to-br from-gold-500/20 via-transparent to-gold-300/10 blur-xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

              {/* Back depth layer */}
              <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-4xl bg-linear-to-br from-vanilla-800/80 to-vanilla-950/80" />

              {/* Main card */}
              <div className="relative rounded-4xl border border-white/5 bg-linear-to-br from-vanilla-800/90 via-vanilla-900/95 to-vanilla-950 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.4)] backdrop-blur-sm overflow-hidden transition-all duration-500 group-hover:border-gold-500/20 group-hover:shadow-[0_40px_100px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(212,175,55,0.1)]">

                {/* Inner top light shimmer */}
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

                {/* Top right year badge */}
                <div className="absolute top-5 right-5 rounded-full border border-gold-500/20 bg-gold-500/10 px-3 py-1 text-[10px] tracking-[0.25em] text-white/50 uppercase">
                  {card.year}
                </div>

                {/* Icon container */}
                <div className="relative mb-6 inline-flex">
                  <div className="absolute inset-0 rounded-full bg-gold-500/20 blur-lg" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-gold-500/20 bg-linear-to-br from-gold-500/20 to-gold-700/10 shadow-[inset_0_1px_0_rgba(212,175,55,0.2),0_10px_30px_rgba(0,0,0,0.3)]">
                    <i className={`${card.icon} text-2xl text-gold-400`} />
                  </div>
                </div>

                {/* Label */}
                <span className="inline-flex items-center text-[10px] uppercase tracking-[0.35em] text-gold-500/80 font-semibold ml-2 mb-3">
                  {card.label}
                </span>

                {/* Title */}
                <h3 className="font-serif text-2xl font-bold text-vanilla-50 mb-4 leading-snug group-hover:text-gold-100 transition-colors duration-300">
                  {card.title}
                </h3>

                {/* Divider */}
                <div className="mb-5 h-px w-12 bg-linear-to-r from-gold-500/60 to-transparent transition-all duration-500 group-hover:w-24" />

                {/* Description */}
                <p className="text-sm leading-7 text-vanilla-200/60 group-hover:text-vanilla-200/80 transition-colors duration-300">
                  {card.description}
                </p>

                {/* Bottom shimmer on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold-500/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Corner accent */}
                <div className="absolute bottom-6 right-6 h-8 w-8 rounded-full border border-gold-500/10 bg-gold-500/5 opacity-0 transition-all duration-500 group-hover:opacity-100" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom timeline dots */}
        <div className="mt-16 flex items-center justify-center gap-3">
          {cards.map((_, i) => (
            <div
              key={i}
              className={`rounded-full bg-gold-500 transition-all duration-300 ${
                i === 1 ? 'h-2 w-8' : 'h-2 w-2 opacity-40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default History;