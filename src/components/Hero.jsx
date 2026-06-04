import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-white text-black">
      {/* Animated Background */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 z-0"
      >
        <video
          src="https://pub-8476bede5a4146e8b7731cfe515f1c3b.r2.dev/the-vanilla-shop/videos/hero_video.mov"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-70 contrast-125"
        />
        
        {/* Premium Vignette/Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-neutral-900/50 to-neutral-900" />

        {/* Floating Monochrome Elements */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-black/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.1, 0.6, 0.1],
              scale: [1, 2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} // Custom premium cubic-bezier ease
        >
          {/* Tag */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center space-x-2 bg-neutral-900 text-white text-xs tracking-widest uppercase px-5 py-2.5 rounded-full mb-8 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
            <span className="font-medium">Premium Vanilla Since 2025</span>
          </motion.div>

          {/* Typography */}
          <h1 className="font-serif text-6xl md:text-8xl font-normal tracking-tight mb-8">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="block text-neutral-200 font-light italic"
            >
              From Bean
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="block text-neutral-500 font-semibold tracking-wide text-5xl md:text-7xl mt-2"
            >
              to Bliss
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-lg md:text-xl text-neutral-200 font-light mb-12 max-w-2xl mx-auto leading-relaxed tracking-wide"
          >
            Experience vanilla in its purest form. A sensory journey of warmth and fine craftsmanship - sourced straight from Sri Lanka's finest orchids.
          </motion.p>

          {/* Minimalist Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/shop">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-neutral-950 text-white font-medium text-sm tracking-wider uppercase transition-colors duration-300 hover:bg-neutral-800 flex items-center space-x-2 min-w-45 justify-center"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>

            <Link to="/about">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-transparent border border-white text-white font-medium text-sm tracking-wider uppercase hover:border-white hover:bg-neutral-50 hover:text-neutral-950 min-w-45 transition-all duration-300"
              >
                Our Story
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Premium Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-0.5 h-12 bg-neutral-200 relative overflow-hidden"
        >
          <motion.div 
            animate={{ top: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-0 w-full h-1/2 bg-neutral-950"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;