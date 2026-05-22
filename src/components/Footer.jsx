import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
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
      { name: 'Non Alcoholic Vanilla Extract', path: '/products/non-alcoholic-vanilla-extract' },
      { name: 'Alcoholic Vanilla Extract', path: '/products/alcoholic-vanilla-extract' },
      { name: 'Vanilla Powder', path: '/products/vanilla-tea-powder' },
      { name: 'Vanilla Paste', path: '/products/natural-vanilla-paste' },
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
      icon: "fa-facebook-f"    },
    {
      href: 'https://www.instagram.com/the_vanillashop',
      label: 'Instagram',
      icon: "fa-instagram"
    },
    {
      href: 'https://www.tiktok.com/@the_vanillashop',
      label: 'TikTok',
      icon: "fa-tiktok"
    },
  ];

  return (
    <footer className="bg-black">
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
            <h4 className="font-serif text-white text-lg font-bold mb-4">Shop</h4>
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
            <h4 className="font-serif text-white text-lg font-bold mb-4">Company</h4>
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
            <h4 className="font-serif text-white text-lg font-bold mb-4">Legal</h4>
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
                  className="w-10 h-10 bg-white/10 text-white hover:bg-vanilla-600 rounded-full flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <i className={`fa-brands ${social.icon}`}></i>
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