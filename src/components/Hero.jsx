import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const Hero = () => {
  // Load display typeface (add to your index.html <head> instead if you prefer a static link)
  useEffect(() => {
    if (!document.getElementById('vanilla-hero-font')) {
      const link = document.createElement('link');
      link.id = 'vanilla-hero-font';
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,500&family=Jost:wght@300;400&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-[#241A14]">

      {/* Background Video with slow Ken Burns drift */}
      <video
        autoPlay muted loop playsInline webkit-playsinline="true" preload="auto" aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center animate-[kenburns_28s_ease-in-out_infinite_alternate]"
      >
        <source src="https://pub-8476bede5a4146e8b7731cfe515f1c3b.r2.dev/the-vanilla-shop/videos/hero_video.mov" type="video/mp4" />
      </video>

      {/* Warm vignette overlay, replaces flat black/50 */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,rgba(36,26,20,0.35)_0%,rgba(20,14,10,0.72)_100%)]" />
      {/* Fine grain for filmic texture */}
      <div
        className="absolute inset-0 z-10 opacity-[0.06] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Main Content */}
      <div className="relative z-20 text-center text-[#F3E9D8] px-6 max-w-2xl mx-auto">

        {/* Eyebrow */}
        <p
          className="text-[11px] uppercase tracking-[0.5em] text-[#F3E9D8]/50 mb-8 opacity-0 animate-[fadeUp_0.9s_ease_forwards]"
          style={{ fontFamily: "'Jost', sans-serif", animationDelay: '0.1s' }}
        >
          Colombo, Sri Lanka
        </p>

        {/* Orchid flourish + Heading */}
        <div className="flex items-center justify-center gap-4 mb-2 opacity-0 animate-[fadeUp_0.9s_ease_forwards]" style={{ animationDelay: '0.3s' }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-[#C6A668] shrink-0 hidden sm:block">
            <path d="M14 2C14 2 9 6 9 11C9 14.5 11.5 17 14 17C16.5 17 19 14.5 19 11C19 6 14 2 14 2Z" stroke="currentColor" strokeWidth="0.75" />
            <path d="M14 17V26" stroke="currentColor" strokeWidth="0.75" />
            <path d="M14 20C14 20 10 21 8 24" stroke="currentColor" strokeWidth="0.75" />
            <path d="M14 20C14 20 18 21 20 24" stroke="currentColor" strokeWidth="0.75" />
          </svg>

          <h1
            className="font-serif text-5xl md:text-7xl leading-[1.05]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            <span className="font-medium">From Bean</span><br />
            <span className="italic font-light text-[#C6A668]">to Bliss</span>
          </h1>

          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-[#C6A668] shrink-0 hidden sm:block rotate-180">
            <path d="M14 2C14 2 9 6 9 11C9 14.5 11.5 17 14 17C16.5 17 19 14.5 19 11C19 6 14 2 14 2Z" stroke="currentColor" strokeWidth="0.75" />
            <path d="M14 17V26" stroke="currentColor" strokeWidth="0.75" />
            <path d="M14 20C14 20 10 21 8 24" stroke="currentColor" strokeWidth="0.75" />
            <path d="M14 20C14 20 18 21 20 24" stroke="currentColor" strokeWidth="0.75" />
          </svg>
        </div>

        {/* Thin rule */}
        <div
          className="w-12 h-px bg-[#C6A668] mx-auto mb-6 mt-6 opacity-0 animate-[fadeUp_0.9s_ease_forwards]"
          style={{ animationDelay: '0.5s' }}
        />

        {/* Subheading */}
        <p
          className="text-sm md:text-base font-light leading-7 text-[#F3E9D8]/60 mb-10 opacity-0 animate-[fadeUp_0.9s_ease_forwards]"
          style={{ fontFamily: "'Jost', sans-serif", animationDelay: '0.65s' }}
        >
          Pure vanilla from Sri Lanka's finest orchids — crafted with care, delivered with love.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-3 justify-center opacity-0 animate-[fadeUp_0.9s_ease_forwards]"
          style={{ animationDelay: '0.85s' }}
        >
          <Link
            to="/shop"
            className="group relative px-8 py-3 text-xs uppercase tracking-[0.3em] font-medium text-[#241A14] bg-[#C6A668] overflow-hidden"
          >
            <span className="relative z-10">Shop Collection</span>
            <span className="absolute inset-0 bg-[#F3E9D8] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
          </Link>
          <Link
            to="/about"
            className="relative px-8 py-3 text-xs uppercase tracking-[0.3em] font-medium text-[#F3E9D8] border border-[#F3E9D8]/30 hover:border-[#C6A668]/70 hover:text-[#C6A668] transition-colors duration-500"
          >
            Visit Café
          </Link>
        </div>
      </div>

      {/* Bottom scroll cue — drawing line instead of bounce dot */}
      {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
        <span
          className="text-[9px] uppercase tracking-[0.4em] text-[#F3E9D8]/40 opacity-0 animate-[fadeUp_0.9s_ease_forwards]"
          style={{ fontFamily: "'Jost', sans-serif", animationDelay: '1.1s' }}
        >
          Scroll
        </span>
        <div className="relative h-10 w-px bg-[#F3E9D8]/15 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[#C6A668] animate-[scrollLine_2.2s_ease-in-out_infinite]" />
        </div>
      </div> */}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes kenburns {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
        @keyframes scrollLine {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(0%); }
          100% { transform: translateY(100%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="animation"] { animation: none !important; opacity: 1 !important; }
        }
      `}</style>
    </section>
  );
};

export default Hero;