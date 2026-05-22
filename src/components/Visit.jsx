import { motion, useInView } from 'framer-motion';
import { Clock, MapPin, Phone } from 'lucide-react';
import React, { useRef } from 'react';


const Visit = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-28 bg-neutral-50 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative h-125 overflow-hidden shadow-xl border border-neutral-100"
          >
            <img
              src="/images/vanilla-shop.png"
              alt="Our shop"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="font-serif text-3xl font-light mb-2">Visit Our Store</h3>
              <p className="text-lg">Experience vanilla in person</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-medium block mb-4">Our Location</span>
            <h2 className="text-3xl md:text-4xl font-serif font-normal tracking-tight text-neutral-950 mb-4">Come Visit Us</h2>
            <div className="w-12 h-px bg-neutral-900 mb-8" />

            <p className="text-neutral-500 font-light text-sm md:text-base mb-8 leading-relaxed tracking-wide">
              Experience the world of vanilla firsthand at our flagship store.
              Browse our full collection, meet our experts, and enjoy complimentary
              tastings of our premium vanilla products.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-neutral-100 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-neutral-700" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-neutral-500 font-medium mb-1">Location</h4>
                  <p className="text-neutral-600 font-light text-sm">No. 253, Koswatta, Kaduwela Road, Battaramulla</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-neutral-100 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-neutral-700" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-neutral-500 font-medium mb-1">Store Hours</h4>
                  <p className="text-neutral-600 font-light text-sm">
                    Monday - Sunday: 8:00 AM - 8:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-neutral-100 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-neutral-700" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-neutral-500 font-medium mb-1">Phone</h4>
                  <p className="text-neutral-600 font-light text-sm">+94 70 520 0900</p>
                </div>
              </div>
            </div>

            <a href='https://maps.app.goo.gl/6XkAw3uaN8CL2dzaA' target='_blank' rel="noreferrer">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block text-xs uppercase tracking-widest font-medium px-8 py-4 bg-neutral-950 text-white hover:bg-neutral-800 transition-colors duration-300"
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