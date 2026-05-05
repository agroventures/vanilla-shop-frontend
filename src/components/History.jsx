import { motion, useInView } from 'framer-motion';
import React, { useRef } from 'react';

const History = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const timeline = [
    {
      year: "Ancient Times",
      title: "Totonac Discovery",
      description: "The Totonac people of Mexico first cultivated vanilla, considering it a gift from the gods."
    },
    {
      year: "1520s",
      title: "European Introduction",
      description: "Spanish conquistadors brought vanilla to Europe, where it became a luxury ingredient."
    },
    {
      year: "1841",
      title: "Hand Pollination",
      description: "Edmond Albius discovered hand-pollination technique, enabling global cultivation."
    },
    {
      year: "Today",
      title: "Modern Cultivation",
      description: "We take pride in representing Sri Lanka's emerging vanilla identity to the world."
    }
  ];

  return (
    <section ref={ref} className="py-24 bg-linear-to-br from-vanilla-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="section-title">The Story of Vanilla</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Journey through centuries of vanilla cultivation and discover why
            this precious orchid became the world's favorite flavor
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-vanilla-300" />

          <div className="space-y-12">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.2 }}
                className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
              >
                <div className="flex-1" />

                {/* Timeline Dot */}
                <div className="relative shrink-0">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
                    className="w-16 h-16 bg-vanilla-600 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <span className="text-white font-bold">{index + 1}</span>
                  </motion.div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex-1 bg-white p-8 rounded-2xl shadow-xl card-3d"
                >
                  <div className="text-vanilla-600 font-bold text-lg mb-2">
                    {item.year}
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
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