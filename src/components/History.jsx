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
    <section className="relative overflow-hidden py-28 px-6 md:px-12 bg-vanilla-900">
      {/* Single restrained glow, top only */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-[40rem] rounded-full bg-gold-500/5 blur-[100px]" />
      <div className="absolute top-0 left-0 w-full h-px bg-gold-500/20" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-24">
          <p className="text-[11px] uppercase tracking-[0.5em] text-gold-500/70 mb-6">
            The Story of Vanilla
          </p>

          <h2 className="font-serif text-4xl md:text-5xl leading-[1.15] text-vanilla-50">
            A Legacy Centuries<br />
            <span className="italic font-light text-gold-400">in the Making</span>
          </h2>

          <div className="w-12 h-px bg-gold-500 mx-auto mt-7 mb-7" />

          <p className="max-w-xl mx-auto text-vanilla-200/60 leading-8 text-[15px]">
            From ancient civilizations to modern artisans, the journey of vanilla is as
            rich and complex as its flavor.
          </p>
        </div>

        {/* Timeline rail */}
        <div className="relative">
          {/* Connecting line — desktop only */}
          <div className="hidden md:block absolute top-[13px] left-[16.66%] right-[16.66%] h-px bg-gold-500/25" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-8">
            {cards.map((card, index) => (
              <div key={index} className="group relative">

                {/* Node marker sitting on the rail */}
                <div className="hidden md:flex justify-center mb-8">
                  <div className="relative h-[27px] w-[27px] rounded-full border border-gold-500/50 bg-vanilla-900 flex items-center justify-center transition-colors duration-500 group-hover:border-gold-500 group-hover:bg-gold-500/10">
                    <div className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                  </div>
                </div>

                <div className="text-center md:text-left">
                  {/* Year */}
                  <p className="text-[10px] uppercase tracking-[0.35em] text-vanilla-200/40 mb-3">
                    {card.year}
                  </p>

                  {/* Icon, quiet outline instead of glowing box */}
                  <div className="mx-auto md:mx-0 mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-gold-500/25 transition-colors duration-500 group-hover:border-gold-500/60">
                    <i className={`${card.icon} text-base text-gold-500`} />
                  </div>

                  {/* Label */}
                  <p className="text-[10px] uppercase tracking-[0.35em] text-gold-500/80 font-medium mb-3">
                    {card.label}
                  </p>

                  {/* Title */}
                  <h3 className="font-serif text-2xl text-vanilla-50 mb-4 leading-snug">
                    {card.title}
                  </h3>

                  {/* Divider — one hover motion, not five */}
                  <div className="mx-auto md:mx-0 mb-5 h-px w-10 bg-gold-500/50 transition-all duration-500 group-hover:w-16" />

                  {/* Description */}
                  <p className="text-sm leading-7 text-vanilla-200/55">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default History;