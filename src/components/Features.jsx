import { motion, useInView } from 'framer-motion';
import { CupSoda, Handshake, Thermometer, Verified } from 'lucide-react';
import React, { useRef } from 'react';

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Verified,
      title: "Authenticity & Purity",
      description: "Only hand-cured, natural vanilla. Absolute purity with zero synthetic vanillin—ever.",
    },
    {
      icon: Thermometer,
      title: "Craft & Care",
      description: "Small-batch seasonal production ensures unrivaled consistency and deep flavor complexities.",
    },
    {
      icon: CupSoda,
      title: "Experience & Taste",
      description: "Exclusive café creations and custom blends curated selectively within our boutique space.",
    },
    {
      icon: Handshake,
      title: "Sustainability",
      description: "Direct-trade micro-lots sourced ethically from local farmers who hand-pollinate each orchid.",
    }
  ];

  return (
    <section ref={ref} className="py-32 bg-neutral-50 text-black border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-24"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-normal tracking-tight mb-4 text-neutral-900">
            Why Choose Us?
          </h2>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto font-light tracking-wide">
            We are dedicated strictly to the preservation and execution of the ultimate vanilla experience.
          </p>
        </motion.div>

        {/* Features Minimal Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200 border border-neutral-200">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white p-10 flex flex-col group transition-colors duration-500 hover:bg-neutral-50"
            >
              {/* Minimalist Icon Housing */}
              <div className="w-12 h-12 rounded-sm border border-neutral-200 flex items-center justify-center mb-8 bg-white transition-all duration-500 group-hover:bg-neutral-950 group-hover:border-neutral-950">
                <feature.icon className="w-5 h-5 text-neutral-800 transition-colors duration-500 group-hover:text-white" />
              </div>

              {/* Title and Description */}
              <h3 className="font-serif text-xl font-normal text-neutral-950 mb-3 tracking-wide">
                {feature.title}
              </h3>
              <p className="text-sm text-neutral-500 font-light leading-relaxed tracking-wide">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;