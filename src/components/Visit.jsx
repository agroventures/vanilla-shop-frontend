import { motion, useInView } from 'framer-motion';
import { Clock, MapPin, Phone } from 'lucide-react';
import React, { useRef } from 'react';


const Visit = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-linear-to-br from-vanilla-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative h-125 rounded-3xl overflow-hidden shadow-2xl"
          >
            <img
              src="/images/vanilla-shop.png"
              alt="Our shop"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="font-serif text-3xl font-bold mb-2">Visit Our Store</h3>
              <p className="text-lg">Experience vanilla in person</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="section-title">Come Visit Us</h2>
            <div className="w-20 h-1 bg-vanilla-600 mb-6" />

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Experience the world of vanilla firsthand at our flagship store.
              Browse our full collection, meet our experts, and enjoy complimentary
              tastings of our premium vanilla products.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-vanilla-100 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-vanilla-600" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Location</h4>
                  <p className="text-gray-600">No. 253, Koswatta, Kaduwela Road, Battaramulla</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-vanilla-100 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-vanilla-600" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Store Hours</h4>
                  <p className="text-gray-600">
                    Monday - Sunday: 8:00 AM - 8:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-vanilla-100 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-vanilla-600" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Phone</h4>
                  <p className="text-gray-600">+94 70 520 0900</p>
                </div>
              </div>
            </div>

            <a href='https://maps.app.goo.gl/6XkAw3uaN8CL2dzaA' target='_blank' rel="noreferrer">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
              >
                Get Directions
              </motion.button>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Visit;