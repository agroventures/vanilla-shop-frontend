import { motion, useInView } from 'framer-motion';
import React, { useRef } from 'react';

const Socials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const feedImages = [
    "https://pub-8476bede5a4146e8b7731cfe515f1c3b.r2.dev/the-vanilla-shop/contact/instagram-1.png",
    "https://pub-8476bede5a4146e8b7731cfe515f1c3b.r2.dev/the-vanilla-shop/contact/instagram-2.png",
    "https://pub-8476bede5a4146e8b7731cfe515f1c3b.r2.dev/the-vanilla-shop/contact/instagram-3.png",
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Time between each child's animation
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section ref={ref} className="py-28 bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        
        {/* Header Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold block">Social</span>
          <h2 className="text-3xl md:text-4xl font-serif font-normal tracking-tight text-white">Follow Us</h2>
          <div className="w-12 h-px bg-neutral-700 mx-auto" />
          <p className="text-neutral-400 font-light text-sm max-w-xl mx-auto tracking-wide">
            Stay connected and inspired. Tag us to be featured!
          </p>
        </motion.div>

        {/* Social Icons with Stagger */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex justify-center gap-6 mb-12"
        >
          {[
            { href: "https://www.facebook.com/thevanillashopsl", icon: "fa-facebook-f", hover: "hover:bg-[#1877F2]" },
            { href: "https://www.instagram.com/the_vanillashop", icon: "fa-instagram", hover: "hover:bg-[#E4405F]" },
            { href: "https://www.tiktok.com/@the_vanillashop", icon: "fa-tiktok", hover: "hover:bg-[#000000]" }
          ].map((social, i) => (
            <motion.a
              key={i}
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href={social.href}
              target="_blank"
              className={`w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-white hover:text-white ${social.hover} transition-colors duration-300 text-xl`}
            >
              <i className={`fa-brands ${social.icon}`}></i>
            </motion.a>
          ))}
        </motion.div>

        {/* Feed Grid with Stagger */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {feedImages.map((img, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="group relative overflow-hidden cursor-pointer h-64"
            >
              <img 
                src={img} 
                alt="Social Feed" 
                className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500" 
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                <a href="https://www.instagram.com/the_vanillashop" target="_blank">
                  <i className="fa-brands fa-instagram text-white text-3xl"></i>
                </a>
              </div>
            </motion.div>
          ))}

          {/* Video Placeholder */}
          <motion.div 
            variants={itemVariants}
            className='group relative overflow-hidden cursor-pointer h-64'
          >
            <video 
              src="https://pub-8476bede5a4146e8b7731cfe515f1c3b.r2.dev/the-vanilla-shop/videos/instagram_video.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover"
            ></video>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default Socials;