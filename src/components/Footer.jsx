import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
//   Facebook, 
//   Instagram, 
//   Twitter, 
  Mail, 
  Phone, 
  MapPin,
  Heart, 
  Globe
} from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    shop: [
      { name: 'All Products', path: '/shop' },
      { name: 'Vanilla Beans', path: '/shop?category=beans' },
      { name: 'Vanilla Extract', path: '/shop?category=extract' },
      { name: 'Vanilla Paste', path: '/shop?category=vanilla-paste' },
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'Our Story', path: '/about#story' },
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Shipping & Refund', path: '/refund' },
    ],
  };

  const socialLinks = [
    {
      href: 'https://www.facebook.com/thevanillashopsl',
      label: 'Facebook',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
    },
    {
      href: 'https://www.instagram.com/the_vanillashop',
      label: 'Instagram',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path fill="none" stroke="white" strokeWidth="2" d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line fill="none" stroke="white" strokeWidth="2" x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
    },
    {
      href: 'https://www.tiktok.com/@the_vanillashop',
      label: 'TikTok',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>,
    },
  ];

  return (
    <footer className="bg-linear-to-br from-gray-900 to-gray-800 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-serif text-3xl font-bold mb-2">
                Join Our Vanilla Community
              </h3>
              <p className="text-gray-400">
                Subscribe for exclusive offers and vanilla recipes
              </p>
            </motion.div>
            
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex gap-3"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:border-vanilla-400 transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="btn-primary whitespace-nowrap"
              >
                Subscribe
              </motion.button>
            </motion.form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3 mb-6"
              >
                <img src="/logo.png" alt="The Vanilla Shop" className="h-16 brightness-0 invert" />
              </motion.div>
            </Link>
            
            <p className="text-gray-400 mb-6 max-w-sm">
              Where Every Bean Tells a Story. Experience vanilla in its purest, most authentic form - from Sri Lanka's heart to your home.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-5 h-5 text-vanilla-400" />
                <span>No. 253, Koswatta, Kaduwela Road, Battaramulla</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-5 h-5 text-vanilla-400" />
                <span>+94 70 520 0900</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-5 h-5 text-vanilla-400" />
                <span>info@thevanillashop.lk</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-4">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>
                    <motion.span
                      whileHover={{ x: 5 }}
                      className="text-gray-400 hover:text-vanilla-400 transition-colors inline-block"
                    >
                      {link.name}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>
                    <motion.span
                      whileHover={{ x: 5 }}
                      className="text-gray-400 hover:text-vanilla-400 transition-colors inline-block"
                    >
                      {link.name}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>
                    <motion.span
                      whileHover={{ x: 5 }}
                      className="text-gray-400 hover:text-vanilla-400 transition-colors inline-block"
                    >
                      {link.name}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>© {new Date().getFullYear()} The Vanilla Shop. All rights reserved. Developed by <a href="https://ventrax.lk" target='_blank' className='font-semibold'>Ventrax.lk</a></span>
            </div>
            
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-white/10 hover:bg-vanilla-600 rounded-full flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;