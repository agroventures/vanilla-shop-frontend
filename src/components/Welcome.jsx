import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

const Welcome = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 bg-white text-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-normal tracking-tight mb-4 text-neutral-900">
              Welcome to The Vanilla Shop
            </h2>
            
            {/* Minimalist divider line */}
            <div className="w-12 h-px bg-neutral-950 mb-8" />
            
            <p className="text-lg text-neutral-600 mb-6 font-light leading-relaxed tracking-wide">
              Nestled in the heart of Colombo, The Vanilla Shop is more than a café - it’s Sri Lanka’s first dedicated vanilla boutique. Here, we celebrate the world’s most beloved flavor in its truest, most natural form.
            </p>
            
            <p className="text-lg text-neutral-600 mb-10 font-light leading-relaxed tracking-wide">
              Every creation reflects our passion for quality and authenticity. Whether you’re sipping a vanilla-infused beverage or selecting a gift from our retail collection, each moment is infused with the pure essence of vanilla.
            </p>
            
            <Link to="/about">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-neutral-950 text-white font-medium text-sm tracking-wider uppercase transition-colors duration-300 hover:bg-neutral-800 shadow-sm"
              >
                Learn More About Us
              </motion.button>
            </Link>
          </motion.div>

          {/* Right: Premium Framed Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Image Wrapper with premium sharp/subtle rounded edges */}
            <div className="relative h-125 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-100">
              <img
                src="/images/vanilla-shop.png"
                alt="Premium Vanilla Beans"
                className="w-full h-full object-cover grayscale contrast-115 brightness-95 transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

              {/* Floating Stat Top Right */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-6 py-5 rounded-sm border border-neutral-200/50 min-w-35 shadow-sm"
              >
                <div className="text-center">
                  <div className="text-3xl font-serif font-light text-neutral-950 mb-1">2+</div>
                  <div className="text-[11px] font-medium tracking-widest uppercase text-neutral-500">Years Craft</div>
                </div>
              </motion.div>

              {/* Floating Stat Bottom Left */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-6 left-6 bg-neutral-950 text-white px-6 py-5 rounded-sm min-w-35 shadow-md"
              >
                <div className="text-center">
                  <div className="text-3xl font-serif font-light text-white mb-1">10K+</div>
                  <div className="text-[11px] font-medium tracking-widest uppercase text-neutral-400">Patrons</div>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Welcome;