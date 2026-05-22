import React, { useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useSEO from '../hooks/useSEO';
import { motion, useInView } from 'framer-motion';

const About = () => {
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

  const cubicBezierEasing = [0.16, 1, 0.3, 1];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: cubicBezierEasing } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: cubicBezierEasing } }
  };

  return (
    <div className="bg-white text-neutral-900 font-sans antialiased leading-relaxed scroll-smooth overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <div 
        className="relative h-[65vh] flex items-center justify-center bg-cover bg-center border-b border-neutral-100"
        style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/about/hero.jpg')" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: cubicBezierEasing }}
          className="text-center text-white px-4 max-w-4xl mx-auto space-y-4"
        >
          <span className="text-xs uppercase tracking-widest text-neutral-300 font-light block">Our Legacy</span>
          <h1 className="text-4xl md:text-6xl font-serif font-light tracking-tight text-white">Our Story</h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-base md:text-lg font-light tracking-wide max-w-xl mx-auto text-neutral-200"
          >
            Vanilla is not simply an ingredient—it is an art of patience, environment, and human dedication.
          </motion.p>
        </motion.div>
      </div>

      {/* The Beginning Section */}
      <section ref={introRef} className="py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <motion.div
            initial="hidden"
            animate={introInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="lg:col-span-5 space-y-6"
          >
            <span className="uppercase tracking-widest text-neutral-400 text-xs font-medium block">Established Feb 21, 2025</span>
            <h2 className="text-3xl md:text-4xl font-serif font-normal tracking-tight text-neutral-950">
              A Dream Rooted in Colombo
            </h2>
            <div className="w-12 h-px bg-neutral-900 my-4" />

            <div className="space-y-5 text-neutral-500 font-light text-sm md:text-base leading-relaxed tracking-wide">
              <p className="text-neutral-900 font-normal">
                Founded at <strong className="font-semibold">No. 253, Koswatta, Kaduwela Road, Battaramulla</strong>, our journey began with a clear purpose: to honor the character of vanilla in its absolute truest presentation.
              </p>
              <p>
                As Sri Lanka’s premier vanilla boutique destination, we have elevated a raw orchid vine product into an experiential encounter that details craftsmanship from plantation to finish. 
              </p>
              <p>
                Our foundation is built upon real partnerships alongside native Sri Lankan growers, agricultural technicians, and culinary purists to present products globally admired yet locally bound.
              </p>
              <p className="text-xs text-neutral-400 pt-2 border-t border-neutral-100">
                We accept both cash and card payments within our boutique space.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={introInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: cubicBezierEasing }}
            className="lg:col-span-7 relative pl-0 md:pl-6"
          >
            <div className="absolute inset-0 border border-neutral-200 translate-x-4 translate-y-4 hidden md:block rounded-sm" />
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop"
              alt="Artisanal Cafe Interior Layout"
              className="relative shadow-xl w-full aspect-4/3 object-cover rounded-sm border border-neutral-100"
            />
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section ref={cardsRef} className="bg-neutral-50 py-24 border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={cardsInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-200 border border-neutral-200"
          >
            {/* Mission Card */}
            <motion.div variants={cardItem} className="bg-white p-12 md:p-16 flex flex-col items-start text-left">
              <div className="text-xs uppercase tracking-widest text-neutral-400 mb-6 font-semibold">// 01 . Direction</div>
              <h3 className="text-2xl font-serif font-normal text-neutral-950 mb-4 tracking-wide">Our Mission</h3>
              <p className="text-neutral-500 font-light text-sm leading-relaxed tracking-wide">
                To introduce, educate, and accurately represent the nature of pure vanilla—converting a misunderstood, raw botanical delicacy into standard sensory fulfillment while supporting regional agriculture.
              </p>
            </motion.div>

            {/* Vision Card */}
            <motion.div variants={cardItem} className="bg-white p-12 md:p-16 flex flex-col items-start text-left">
              <div className="text-xs uppercase tracking-widest text-neutral-400 mb-6 font-semibold">// 02 . Outlook</div>
              <h3 className="text-2xl font-serif font-normal text-neutral-950 mb-4 tracking-wide">Our Vision</h3>
              <p className="text-neutral-500 font-light text-sm leading-relaxed tracking-wide">
                To anchor Sri Lankan vanilla directly onto the elite culinary map—championing its singular tasting notes, strict eco-sustainability formats, and ethical micro-lot communities.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section ref={craftRef} className="py-28 max-w-4xl mx-auto px-4 text-center border-b border-neutral-100">
        <motion.div
          initial="hidden"
          animate={craftInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="space-y-6"
        >
          <div className="text-xs uppercase tracking-widest text-neutral-400 font-medium">Boutique Production</div>
          <h2 className="text-3xl md:text-4xl font-serif font-normal tracking-tight text-neutral-900">
            Science Meets Artistry
          </h2>
          <div className="w-12 h-px bg-neutral-900 mx-auto my-2" />
          <p className="text-neutral-600 font-light text-sm md:text-base max-w-2xl mx-auto leading-relaxed tracking-wide">
            Behind every signature small-batch extract, custom paste, or artisan infusion lies strict technical evaluation. Our lab contains extraction specialists, flavor technicians, and pastry chefs cooperating under precision values to lock in the true chemical profile of the pod.
          </p>
          <p className="text-neutral-400 font-light text-xs max-w-xl mx-auto leading-relaxed tracking-wide">
            By continually tracking moisture indexes, aging microclimates, and regional harvest variance, we push processing limitations to extract values that remain uniquely Sri Lankan yet premium on a world scale.
          </p>
        </motion.div>
      </section>

      {/* Ethical Sourcing Grid */}
      <section ref={ethicalRef} className="bg-neutral-950 py-28 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ethicalInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: cubicBezierEasing }}
            className="text-center mb-20 space-y-4"
          >
            <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold block">Transparency Guidelines</span>
            <h2 className="text-3xl md:text-4xl font-serif font-normal tracking-tight text-white">
              Ethical Sourcing & Sustainability
            </h2>
            <p className="text-neutral-400 font-light text-sm max-w-xl mx-auto tracking-wide">
              True quality originates at ground soil levels. Through structural micro-lot chains, we safeguard both crop lifecycle and farmers.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={ethicalInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-900 border border-neutral-900"
          >
            {[
              { id: "01", icon: "fa-handshake", title: "Direct Partnerships", desc: "Working directly with smallholder farmers across Central and Wet-Zone highland sectors." },
              { id: "02", icon: "fa-leaf", title: "Natural Execution", desc: "Sourcing prioritization emphasizes chemical-free, shade-grown biodiversity profiles." },
              { id: "03", icon: "fa-scale-balanced", title: "Fair Trade Value", desc: "Ensuring trade partners receive equitable, protected income models to secure continuity." },
              { id: "04", icon: "fa-location-dot", title: "Batch Traceability", desc: "Every unique profile and extract records tracing pathways straight back to single plantation source nodes." }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={cardItem}
                className="bg-neutral-950 p-8 flex flex-col justify-between aspect-square group transition-colors duration-500 hover:bg-neutral-900"
              >
                <div className="space-y-3 pt-8">
                  <i className={`fa-solid ${item.icon} text-white text-3xl mb-4`}></i>
                  <h4 className="text-lg font-serif font-normal text-white tracking-wide">{item.title}</h4>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed tracking-wide">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Philosophy Callout Quote */}
      <section className="py-32 px-4 bg-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: cubicBezierEasing }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto space-y-6"
        >
          <h2 className="text-2xl md:text-3xl font-serif font-light text-neutral-900 leading-relaxed italic">
            "Vanilla is a narrative detailing time, environment, and precise curation."
          </h2>
          <div className="w-6 h-px bg-neutral-300 mx-auto" />
          <p className="text-neutral-400 font-light text-xs tracking-widest uppercase">
            The Vanilla Shop Philosophy
          </p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default About;