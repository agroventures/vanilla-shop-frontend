import { motion, useInView } from 'framer-motion';
import React, { useRef } from 'react';

const History = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const timeline = [
    {
      year: "Ancient Times",
      title: "Totonac Discovery",
      description: "The Totonac people of Mexico first cultivated vanilla, considering it a sacred gift from the gods."
    },
    {
      year: "1520s",
      title: "European Introduction",
      description: "Spanish explorers brought vanilla to Europe, where it rapidly evolved into an exclusive luxury ingredient."
    },
    {
      year: "1841",
      title: "Hand Pollination",
      description: "Edmond Albius discovered the critical hand-pollination technique, unlocking global cultivation possibilities."
    },
    {
      year: "Today",
      title: "Modern Cultivation",
      description: "We proudly introduce and represent Sri Lanka's premium emerging vanilla identity to the global landscape."
    }
  ];

  return (
    <section ref={ref} className="py-32 bg-neutral-50 text-black overflow-hidden border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-24"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-normal tracking-tight mb-4 text-neutral-900">
            The Story of Vanilla
          </h2>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto font-light tracking-wide">
            Journey through centuries of cultivation and discover why this precious orchid became the world's most coveted flavor profile.
          </p>
        </motion.div>

        {/* Timeline Core */}
        <div className="relative">
          {/* Razor Thin Minimalist Center Axis Line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-[1px] bg-neutral-200" />

          <div className="space-y-16">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className={`flex flex-col md:flex-row gap-8 md:gap-16 items-start ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Spacer balance column to push design to 50% split layout */}
                <div className="flex-1 hidden md:block" />

                {/* Minimalist Center Hub Ring */}
                <div className="relative shrink-0 hidden md:flex items-center justify-center self-start mt-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: index * 0.15 + 0.2, duration: 0.5 }}
                    className="w-3 h-3 bg-neutral-950 rounded-full z-10 ring-4 ring-neutral-50"
                  />
                </div>

                {/* Editorial Content Blocks */}
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex-1 bg-white p-10 rounded-sm border border-neutral-200/60 shadow-xs group"
                >
                  <div className="text-neutral-400 font-medium text-xs tracking-widest uppercase mb-3">
                    {item.year}
                  </div>
                  <h3 className="font-serif text-2xl font-normal text-neutral-950 mb-3 tracking-wide group-hover:text-neutral-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600 font-light leading-relaxed tracking-wide">
                    {item.description}
                  </p>
                </motion.div>
                
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default History;