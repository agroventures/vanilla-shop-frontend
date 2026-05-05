import { motion, useInView } from 'framer-motion';
import { Building, CheckCircle, Mail } from 'lucide-react';
import React, { useRef } from 'react';

const Wholesale = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const benefits = [
    "Wholesale pricing for bulk orders",
    "Priority access to new products",
    "Dedicated account manager",
    "Flexible payment terms",
    "Custom packaging options",
    "Marketing support materials"
  ];

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title">Partner With Us</h2>
            <div className="w-20 h-1 bg-vanilla-600 mb-6" />

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Join our network of restaurants, bakeries, and retailers who trust
              us for their vanilla needs. We offer competitive wholesale pricing,
              exceptional service, and the finest quality products.
            </p>

            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="w-6 h-6 text-vanilla-600 shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-1/2 btn-primary"
            >
              Contact Our Team
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600",
              "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600",
              "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600",
              "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=600"
            ].map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`relative h-64 rounded-2xl overflow-hidden shadow-xl ${index === 1 || index === 2 ? 'mt-8' : ''
                  }`}
              >
                <img
                  src={img}
                  alt={`Partner ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Wholesale;