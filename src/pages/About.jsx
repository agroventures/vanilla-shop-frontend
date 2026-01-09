import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useSEO from '../hooks/useSEO';

const About = () => {
  const url = window.location.href;

    useSEO({
        title: "About - The Vanilla Shop",
        description: "The Vanilla Shop is more than a café — it’s Sri Lanka’s first dedicated vanilla boutique.",
        url,
        image_alt: "About",
        twitter_card: "summary_large_image",
    });

  return (
    <div className="bg-vanilla-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center bg-cover bg-center" 
           style={{ backgroundImage: "linear-gradient(rgba(62, 39, 35, 0.7), rgba(62, 39, 35, 0.7)), url('/images/about/hero.jpg')" }}>
        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4">Our Story</h1>
          <p className="text-xl md:text-2xl font-light opacity-90 font-serif italic text-gold-500">
            "Vanilla is not just a flavor — it’s an experience."
          </p>
        </div>
      </div>

      {/* The Beginning Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="uppercase tracking-widest text-gold-500 text-sm font-bold mb-2 block">Est. Feb 21, 2025</span>
            <h2 className="text-4xl font-serif font-bold text-vanilla-900 mb-6">A Dream Rooted in Colombo</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Founded at <strong>No. 253, Koswatta, Kaduwela Road, Battaramulla</strong>, our journey began with a simple dream: to celebrate the essence of vanilla in its purest form.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              As Sri Lanka’s first premium vanilla boutique café, we have transformed a simple ingredient into an immersive experience that engages all senses. Every detail — from our aromatic brews and desserts to our artisanal retail range — reflects our devotion to authenticity and excellence.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our founders collaborated with Sri Lankan vanilla growers, food technologists, and culinary artisans to bring this vision to life. Together, we created a space where the artistry of flavor meets the purity of nature.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 border-2 border-gold-500 rounded-lg transform translate-x-4 translate-y-4 hidden md:block"></div>
            <img 
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop" 
              alt="Artisanal Cafe Interior" 
              className="relative rounded-lg shadow-2xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-vanilla-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="bg-white p-10 rounded-xl shadow-sm border-t-4 border-gold-500 text-center hover:shadow-md transition">
              <div className="w-16 h-16 bg-vanilla-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-lightbulb text-vanilla-900 text-2xl"></i>
              </div>
              <h3 className="text-3xl font-serif font-bold text-vanilla-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To introduce, educate, and delight — turning the mystique of vanilla into everyday joy while nurturing a deep appreciation for its natural beauty.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-white p-10 rounded-xl shadow-sm border-t-4 border-vanilla-900 text-center hover:shadow-md transition">
              <div className="w-16 h-16 bg-vanilla-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-globe text-vanilla-900 text-2xl"></i>
              </div>
              <h3 className="text-3xl font-serif font-bold text-vanilla-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To put Sri Lankan vanilla on the global gastronomic map — celebrating its flavor, sustainability, and community-driven cultivation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-20 max-w-5xl mx-auto px-4 text-center">
        <i className="fa-solid fa-flask text-gold-500 text-4xl mb-6"></i>
        <h2 className="text-4xl font-serif font-bold text-vanilla-900 mb-8">Science Meets Artistry</h2>
        <div className="prose prose-lg mx-auto text-gray-600">
          <p className="mb-6">
            Behind every extract, syrup, or dessert lies a story of dedication. Our team is made up of flavor artisans, pastry chefs, chemists, and herbal specialists who work in harmony to craft products that preserve the soul of vanilla.
          </p>
          <p>
            We experiment with new infusion methods, vanilla cultivars, and flavor pairings, continually refining our craft to create something uniquely Sri Lankan yet globally admired.
          </p>
        </div>
      </section>

      {/* Ethical Sourcing Grid */}
      <section className="bg-vanilla-900 py-20 text-vanilla-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">Ethical Sourcing & Sustainability</h2>
            <p className="opacity-80 max-w-2xl mx-auto">We believe true quality begins at the source. Through our transparent supply chain, we honor both the land and the people behind every pod.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-vanilla-800 p-6 rounded-lg border border-vanilla-800 hover:border-gold-500 transition duration-300">
              <i className="fa-solid fa-handshake text-gold-500 text-3xl mb-4"></i>
              <h4 className="font-bold text-xl mb-3 font-serif">Farmer Partnerships</h4>
              <p className="text-sm opacity-80 leading-relaxed">
                We work directly with smallholder farmers and cooperatives across Sri Lanka’s central and wet-zone regions.
              </p>
            </div>

            <div className="bg-vanilla-800 p-6 rounded-lg border border-vanilla-800 hover:border-gold-500 transition duration-300">
              <i className="fa-solid fa-leaf text-gold-500 text-3xl mb-4"></i>
              <h4 className="font-bold text-xl mb-3 font-serif">Organic Practices</h4>
              <p className="text-sm opacity-80 leading-relaxed">
                Our sourcing emphasizes low-chemical, biodiversity-friendly cultivation methods that protect the soil.
              </p>
            </div>

            <div className="bg-vanilla-800 p-6 rounded-lg border border-vanilla-800 hover:border-gold-500 transition duration-300">
              <i className="fa-solid fa-scale-balanced text-gold-500 text-3xl mb-4"></i>
              <h4 className="font-bold text-xl mb-3 font-serif">Fair Trade</h4>
              <p className="text-sm opacity-80 leading-relaxed">
                We ensure farmers receive fair compensation and long-term support to sustain their livelihoods.
              </p>
            </div>

            <div className="bg-vanilla-800 p-6 rounded-lg border border-vanilla-800 hover:border-gold-500 transition duration-300">
              <i className="fa-solid fa-location-dot text-gold-500 text-3xl mb-4"></i>
              <h4 className="font-bold text-xl mb-3 font-serif">Traceability</h4>
              <p className="text-sm opacity-80 leading-relaxed">
                Every bean and extract can be traced to its origin — from plantation to packaging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy / Footer Note */}
      <section className="py-24 px-4 bg-white text-center">
        <div className="max-w-3xl mx-auto">
          <i className="fa-solid fa-quote-left text-vanilla-200 text-5xl mb-6"></i>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-vanilla-900 mb-6 italic">
            "Vanilla is more than a spice; it’s a storyteller of nature’s patience and human artistry."
          </h2>
          <p className="text-gray-600 text-lg">
            At The Vanilla Shop, we treat vanilla with reverence — preserving its integrity while creating new ways for you to experience its magic.
          </p>
        </div>
      </section>

      <Footer />

    </div>
  );
};

export default About;