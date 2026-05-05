import React, { useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useSEO from '../hooks/useSEO';
import { motion, useInView } from 'framer-motion';

const About = () => {
  // Separate refs for each section to trigger animations independently
  const heroRef = useRef(null);
  const introRef = useRef(null);
  const cardsRef = useRef(null);
  const craftRef = useRef(null);
  const ethicalRef = useRef(null);

  const introInView = useInView(introRef, { once: true, margin: "-100px" });
  const cardsInView = useInView(cardsRef, { once: true, margin: "-100px" });
  const craftInView = useInView(craftRef, { once: true, margin: "-100px" });
  const ethicalInView = useInView(ethicalRef, { once: true, margin: "-100px" });

  const url = window.location.href;

  useSEO({
    title: "About - The Vanilla Shop",
    url,
    image_alt: "About",
    twitter_card: "summary_large_image",
  });

  // Reusable Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const cardItem = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="bg-vanilla-50 overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "linear-gradient(rgba(62, 39, 35, 0.7), rgba(62, 39, 35, 0.7)), url('/images/about/hero.jpg')" }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-center text-white px-4 max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 text-white">Our Story</h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-xl md:text-2xl font-light font-serif italic text-gold-500"
          >
            "Vanilla is not just a flavor - it’s an experience."
          </motion.p>
        </motion.div>
      </div>

      {/* The Beginning Section */}
      <section ref={introRef} className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            animate={introInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <span className="uppercase tracking-widest text-gold-500 text-sm font-bold mb-2 block">Est. Feb 21, 2025</span>
            <h2 className="section-title">A Dream Rooted in Colombo</h2>
            <div className="w-20 h-1 bg-vanilla-600 mb-6" />

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                Founded at <strong>No. 253, Koswatta, Kaduwela Road, Battaramulla</strong>, our journey began with a simple dream: to celebrate the essence of vanilla in its purest form.
              </p>
              <p className="text-gray-600">
                As Sri Lanka’s first premium vanilla boutique café, we have transformed a simple ingredient into an immersive experience that engages all senses. Every detail reflects our devotion to authenticity and excellence.
              </p>
              <p className="text-gray-600">
                Our founders collaborated with Sri Lankan vanilla growers, food technologists, and culinary artisans to bring this vision to life.
              </p>
              <p className="text-gray-600">
                We warmly welcome guests to experience our creations in-store, where we accept both <span className='font-semibold'>cash and card payments</span>.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={introInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 border-2 border-gold-500 rounded-lg transform translate-x-4 translate-y-4 hidden md:block"></div>
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop"
              alt="Artisanal Cafe Interior"
              className="relative rounded-lg shadow-2xl w-full h-auto object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section ref={cardsRef} className="bg-vanilla-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={cardsInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Mission Card */}
            <motion.div variants={cardItem} className="bg-white p-10 rounded-xl shadow-sm border-t-4 border-gold-500 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-vanilla-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-lightbulb text-vanilla-900 text-2xl"></i>
              </div>
              <h3 className="text-3xl font-serif font-bold text-vanilla-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To introduce, educate, and delight - turning the mystique of vanilla into everyday joy while nurturing a deep appreciation for its natural beauty.
              </p>
            </motion.div>

            {/* Vision Card */}
            <motion.div variants={cardItem} className="bg-white p-10 rounded-xl shadow-sm border-t-4 border-vanilla-900 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-vanilla-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-globe text-vanilla-900 text-2xl"></i>
              </div>
              <h3 className="text-3xl font-serif font-bold text-vanilla-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To put Sri Lankan vanilla on the global gastronomic map - celebrating its flavor, sustainability, and community-driven cultivation.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section ref={craftRef} className="py-24 max-w-5xl mx-auto px-4 text-center">
        <motion.div
          initial="hidden"
          animate={craftInView ? "visible" : "hidden"}
          variants={fadeInUp}
        >
          <motion.div
            animate={craftInView ? { rotate: [0, 10, -10, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
            className="inline-block"
          >
             <i className="fa-solid fa-flask text-gold-500 text-4xl mb-6"></i>
          </motion.div>
          <h2 className="section-title">Science Meets Artistry</h2>
          <p className="mb-6 text-lg text-gray-700">
            Behind every extract, syrup, or dessert lies a story of dedication. Our team is made up of flavor artisans, pastry chefs, chemists, and herbal specialists who work in harmony to craft products that preserve the soul of vanilla.
          </p>
          <p className="text-gray-600">
            We experiment with new infusion methods, vanilla cultivars, and flavor pairings, continually refining our craft to create something uniquely Sri Lankan yet globally admired.
          </p>
        </motion.div>
      </section>

      {/* Ethical Sourcing Grid */}
      <section ref={ethicalRef} className="bg-vanilla-900 py-20 text-vanilla-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ethicalInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <h2 className="section-title !text-vanilla-50">Ethical Sourcing & Sustainability</h2>
            <p className="opacity-80 max-w-2xl mx-auto">We believe true quality begins at the source. Through our transparent supply chain, we honor both the land and the people behind every pod.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={ethicalInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { icon: "fa-handshake", title: "Farmer Partnerships", desc: "We work directly with smallholder farmers across Sri Lanka’s central and wet-zone regions." },
              { icon: "fa-leaf", title: "Organic Practices", desc: "Our sourcing emphasizes low-chemical, biodiversity-friendly cultivation methods." },
              { icon: "fa-scale-balanced", title: "Fair Trade", desc: "We ensure farmers receive fair compensation and long-term support to sustain their livelihoods." },
              { icon: "fa-location-dot", title: "Traceability", desc: "Every bean and extract can be traced to its origin - from plantation to packaging." }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                variants={cardItem}
                whileHover={{ y: -10 }}
                className="bg-vanilla-800 p-6 rounded-lg border border-vanilla-800 hover:border-gold-500 transition-all duration-300"
              >
                <i className={`fa-solid ${item.icon} text-gold-500 text-3xl mb-4`}></i>
                <h4 className="font-bold text-xl mb-3 font-serif">{item.title}</h4>
                <p className="text-sm opacity-80 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Philosophy / Footer Note */}
      <section className="py-24 px-4 bg-white text-center">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <i className="fa-solid fa-quote-left text-vanilla-200 text-5xl mb-6"></i>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-vanilla-900 mb-6 italic">
            "Vanilla is more than a spice; it’s a storyteller of nature’s patience and human artistry."
          </h2>
          <p className="text-gray-600 text-lg">
            At The Vanilla Shop, we treat vanilla with reverence - preserving its integrity while creating new ways for you to experience its magic.
          </p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default About;