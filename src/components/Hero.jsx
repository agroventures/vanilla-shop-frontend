import React from 'react';

const Hero = () => {
  return (
    // <section id="home" className="relative h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}>
    <section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center"
      >
        <source src="https://res.cloudinary.com/dyvixdh7n/video/upload/v1767938712/vanilla_shop_lzb8pc.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Content */}
      <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
        <span className="block text-gold-500 font-serif italic text-xl mb-4 tracking-widest">
          Est. 2025 • Colombo
        </span>

        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
          From Bean to Bliss
        </h1>

        <p className="text-lg md:text-2xl font-light mb-10 opacity-90">
          Experience vanilla in its purest form. A sensory journey of sweetness,
          warmth, and craftsmanship.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/shop"
            className="bg-gold-500 text-white px-8 py-3 rounded-md font-semibold hover:bg-yellow-600 transition shadow-lg"
          >
            Shop Collection
          </a>

          <a
            href="/about"
            className="border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-vanilla-900 transition"
          >
            Visit Café
          </a>
        </div>
      </div>
    </section>

  );
};

export default Hero;