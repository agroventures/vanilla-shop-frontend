import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-vanilla-900 text-white">
      {/* One quiet glow, matches other sections instead of three */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-gold-500/5 blur-[100px]" />
      <div className="absolute top-0 left-0 w-full h-px bg-gold-500/20" />

      {/* Main Footer Content */}
      <div className="relative max-w-6xl mx-auto px-6 md:px-12 pt-24 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

          {/* Brand Column */}
          <div className="md:col-span-4">
            <Link to="/">
              <img
                src="/logo.png"
                alt="The Vanilla Shop"
                className="w-16 brightness-0 invert mb-5 transition-opacity duration-300 hover:opacity-80"
              />
            </Link>

            <p className="text-sm leading-7 text-vanilla-200/60 max-w-xs">
              Where Every Bean Tells a Story. Experience vanilla in its purest,
              most authentic form — from Sri Lanka's heart to your home.
            </p>

            {/* Divider */}
            <div className="my-6 h-px w-12 bg-gold-500" />

            {/* Social Icons — quiet outline circles, matches Features/History */}
            <div className="flex items-center gap-3">
              {[
                { icon: 'fa-facebook', href: 'https://www.facebook.com/thevanillashopsl', label: 'Facebook' },
                { icon: 'fa-instagram', href: 'https://www.instagram.com/the_vanillashop', label: 'Instagram' },
                { icon: 'fa-tiktok', href: 'https://www.tiktok.com/@the_vanillashop', label: 'TikTok' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-vanilla-300 transition-colors duration-300 hover:border-gold-500/60 hover:text-gold-400"
                >
                  <i className={`fa-brands ${social.icon} text-sm`} />
                </a>
              ))}
            </div>

            {/* Trust line — plain text, not a badge pill */}
            <p className="mt-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gold-500/70">
              <i className="fa-solid fa-shield-halved text-[10px]" />
              Trusted Sri Lankan Brand
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h5 className="font-serif text-sm uppercase tracking-[0.3em] text-vanilla-100 mb-6">
              Quick Links
            </h5>
            <ul className="space-y-3">
              {[
                { label: 'Home', to: '/' },
                { label: 'About Us', to: '/about' },
                { label: 'Our Products', to: '/shop' },
                { label: 'Visit Store', to: '/#visit' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-2 text-sm text-vanilla-200/60 transition-all duration-300 hover:text-gold-400"
                  >
                    <span className="h-px w-0 bg-gold-500 transition-all duration-300 group-hover:w-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="md:col-span-2">
            <h5 className="font-serif text-sm uppercase tracking-[0.3em] text-vanilla-100 mb-6">
              Customer Care
            </h5>
            <ul className="space-y-3">
              {[
                { label: 'Shipping & Refund Policy', to: '/refund' },
                { label: 'Terms of Service', to: '/terms' },
                { label: 'Privacy Policy', to: '/privacy' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-2 text-sm text-vanilla-200/60 transition-all duration-300 hover:text-gold-400"
                  >
                    <span className="h-px w-0 bg-gold-500 transition-all duration-300 group-hover:w-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4">
            <h5 className="font-serif text-sm uppercase tracking-[0.3em] text-vanilla-100 mb-2">
              Newsletter
            </h5>
            <p className="text-xs leading-6 text-vanilla-200/50 mb-6">
              Receive vanilla-inspired recipes, exclusive offers, and artisan stories
              delivered to your inbox.
            </p>

            {/* Input — flat underline field, not a glass gradient card */}
            <div className="flex items-end gap-3 border-b border-white/15 pb-2 transition-colors duration-300 focus-within:border-gold-500/60">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-transparent py-1.5 text-sm text-white placeholder-vanilla-300/40 outline-none"
              />
              <button className="text-[10px] uppercase tracking-[0.3em] text-gold-400 whitespace-nowrap pb-1.5 transition-colors duration-300 hover:text-gold-300">
                Subscribe →
              </button>
            </div>

            <p className="mt-3 text-[10px] text-vanilla-300/40">
              No spam. Unsubscribe anytime.
            </p>

            {/* Contact info */}
            <div className="mt-6 space-y-2">
              {[
                { icon: 'fa-location-dot', text: 'Colombo, Sri Lanka' },
                { icon: 'fa-envelope', text: 'hello@thevanillashop.lk' },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 text-xs text-vanilla-300/50"
                >
                  <i className={`fa-solid ${item.icon} text-gold-500/60 text-[10px] w-3`} />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-vanilla-700/40" />

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-vanilla-300/40 tracking-wide">
            &copy; {new Date().getFullYear()} The Vanilla Shop. All Rights Reserved.
          </p>

          <div className="flex items-center gap-2 text-[11px] text-vanilla-300/40">
            <span>Powered by</span>
            <a
              href="https://ventrax.lk"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-vanilla-300/60 transition-colors duration-300 hover:text-gold-400"
            >
              Ventrax.lk
            </a>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-vanilla-300/30">
            <i className="fa-solid fa-heart text-gold-500/50 text-[9px]" />
            <span>Crafted with passion in Sri Lanka</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;