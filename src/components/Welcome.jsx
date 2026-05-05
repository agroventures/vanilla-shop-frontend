import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom';

const Welcome = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title">
              Welcome to The Vanilla Shop
            </h2>
            <div className="w-20 h-1 bg-vanilla-600 mb-6" />
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Nestled in the heart of Colombo, The Vanilla Shop is more than a café - it’s Sri Lanka’s first dedicated vanilla boutique. Here, we celebrate the world’s most beloved flavor in its truest, most natural form.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Every creation reflects our passion for quality and authenticity. Whether you’re sipping a vanilla-infused beverage or selecting a gift from our retail collection, each moment is infused with the pure essence of vanilla.
            </p>
            <Link to="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
              >
                Learn More About Us
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-125 rounded-2xl overflow-hidden">
              <img
                src="/images/vanilla-shop.png"
                alt="Vanilla beans"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />

              {/* Floating Stats */}
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute top-8 right-8 bg-white p-6 rounded-2xl shadow-2xl"
              >
                <div className="text-center">
                  <div className="text-4xl font-bold text-vanilla-600 mb-2">2+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: 0.7, type: "spring" }}
                className="absolute bottom-8 left-8 bg-white p-6 rounded-2xl shadow-2xl"
              >
                <div className="text-center">
                  <div className="text-4xl font-bold text-vanilla-600 mb-2">10K+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
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