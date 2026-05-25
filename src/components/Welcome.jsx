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
            <div className="relative">
              <div className="relative z-10">
                <img
                  src="https://images.pexels.com/photos/3857347/pexels-photo-3857347.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
                  alt="Café interior"
                  className="w-full h-120 object-cover rounded-2xl"
                />
              </div>
              {/* Overlapping smaller image */}
              <div className="absolute -bottom-8 -right-8 w-52 h-52 z-20 rounded-2xl overflow-hidden border-4 border-white shadow-2xl hidden md:block">
                <img
                  src="https://images.pexels.com/photos/33371816/pexels-photo-33371816.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                  alt="Café detail"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative dot grid */}
              <div className="absolute -top-6 -left-6 w-32 h-32 opacity-20 hidden md:block"
                style={{
                  backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                  backgroundSize: '10px 10px',
                }}
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Welcome;