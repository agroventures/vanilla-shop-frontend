import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">

      {/* Background Video */}
      <video
        autoPlay muted loop playsInline webkit-playsinline="true" preload="auto" aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center"
      >
        <source src="https://pub-8476bede5a4146e8b7731cfe515f1c3b.r2.dev/the-vanilla-shop/videos/hero_video.mov" type="video/mp4" />
      </video>

      {/* Single clean overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Main Content */}
      <div className="relative z-20 text-center text-white px-6 max-w-2xl mx-auto">

        {/* Eyebrow */}
        <p className="text-[11px] uppercase tracking-[0.5em] text-white/50 mb-8">
          Colombo, Sri Lanka
        </p>

        {/* Heading */}
        <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-6">
          From Bean<br />
          <span className="text-gold-500">to Bliss</span>
        </h1>

        {/* Thin rule */}
        <div className="w-12 h-px bg-gold-500 mx-auto mb-6" />

        {/* Subheading */}
        <p className="text-sm md:text-base font-light leading-7 text-white/60 mb-10">
          Pure vanilla from Sri Lanka's finest orchids — crafted with care, delivered with love.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/shop"
            className="px-8 py-3 text-xs uppercase tracking-[0.3em] font-semibold bg-gold-500 text-white hover:bg-gold-500/80 transition-colors duration-300"
          >
            Shop Collection
          </Link>
          <Link
            to="/about"
            className="px-8 py-3 text-xs uppercase tracking-[0.3em] font-semibold border border-white/30 text-white hover:border-white/60 hover:bg-white/5 transition-colors duration-300"
          >
            Visit Café
          </Link>
        </div>
      </div>

      {/* Bottom scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/20 p-1.5">
          <div className="h-2 w-0.5 rounded-full bg-gold-500 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;