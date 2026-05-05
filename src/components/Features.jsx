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
      description: "Only hand-cured, natural vanilla. No synthetic vanillin - ever.",
      color: "text-yellow-600"
    },
    {
      icon: Thermometer,
      title: "Craft & Care",
      description: "Small-batch production ensures unrivalled consistency and depth of flavor.",
      color: "text-green-600"
    },
    {
      icon: CupSoda,
      title: "Experience & Taste",
      description: "Exclusive café creations and blends you won't find anywhere else in Sri Lanka.",
      color: "text-blue-600"
    },
    {
      icon: Handshake,
      title: "Sustainability",
      description: "Ethically sourced from local farmers who hand-pollinate every orchid with care.",
      color: "text-purple-600"
    }
  ];

  return (
    <section ref={ref} className="py-24 bg-linear-to-br from-gray-50 to-vanilla-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="section-title">Why Choose Us?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're committed to bringing you the finest vanilla experience
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-lg card-3d"
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className={`w-16 h-16 ${feature.color} bg-opacity-10 rounded-2xl flex items-center justify-center mb-6`}
              >
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </motion.div>

              <h3 className="font-serif text-2xl font-bold mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
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