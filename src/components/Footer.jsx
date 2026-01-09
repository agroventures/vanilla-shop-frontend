import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-vanilla-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-1 md:col-span-1">
          <Link to='/'>
          <img src="/logo.png" alt="Logo" className='w-15 brightness-0 invert' />
          </Link>
          <p className="text-sm mt-4 opacity-70">Where Every Bean Tells a Story. Experience vanilla in its purest, most authentic form.</p>
        </div>
        <div>
          <h5 className="font-bold mb-4">Quick Links</h5>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/" className="hover:text-gold-500">Home</Link></li>
            <li><Link to="/about" className="hover:text-gold-500">About Us</Link></li>
            <li><Link to="/shop" className="hover:text-gold-500">Our Products</Link></li>
            <li><Link to="/#visit" className="hover:text-gold-500">Visit Store</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-4">Customer Care</h5>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/refund" className="hover:text-gold-500">Shipping & Refund Policy</Link></li>
            <li><Link to="/terms" className="hover:text-gold-500">Terms of Service</Link></li>
            <li><Link to="/privacy" className="hover:text-gold-500">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-4">Newsletter</h5>
          <p className="text-xs mb-2 opacity-70">Receive vanilla-inspired recipes and offers.</p>
          <div className="flex">
            <input type="email" placeholder="Email Address" className="w-full px-3 py-2 text-white rounded-l-md border border-white" />
            <button className="bg-gold-500 px-4 py-2 rounded-r-md hover:bg-yellow-600 text-white font-bold">Go</button>
          </div>
          <div className="flex space-x-4 mt-6">
            <a href="https://www.facebook.com/thevanillashopsl" target="_blank" className="hover:text-gold-500"><i className="fa-brands fa-facebook"></i></a>
            <a href="https://www.instagram.com/the_vanillashop" target="_blank" className="hover:text-gold-500"><i className="fa-brands fa-instagram"></i></a>
            <a href="https:://www.tiktok.com/@the_vanillashop" target="_blank" className="hover:text-gold-500"><i className="fa-brands fa-tiktok"></i></a>
          </div>
        </div>
      </div>
      <div className="border-t border-vanilla-800 pt-8 text-center text-xs opacity-50">
        <p>&copy; {new Date().getFullYear()} <a href="https://ventrax.lk">Ventrax.lk</a>. – All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;