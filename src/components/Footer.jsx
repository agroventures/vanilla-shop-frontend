import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-vanilla-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-1 md:col-span-1">
          <a href="#" className="font-serif text-xl font-bold tracking-wider text-gold-500">THE VANILLA SHOP</a>
          <p className="text-sm mt-4 opacity-70">Where Every Bean Tells a Story. Experience vanilla in its purest, most authentic form.</p>
        </div>
        <div>
          <h5 className="font-bold mb-4">Quick Links</h5>
          <ul className="space-y-2 text-sm opacity-80">
            <li><a href="#home" className="hover:text-gold-500">Home</a></li>
            <li><a href="#about" className="hover:text-gold-500">About Us</a></li>
            <li><a href="#products" className="hover:text-gold-500">Our Products</a></li>
            <li><a href="#visit" className="hover:text-gold-500">Visit Store</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-4">Customer Care</h5>
          <ul className="space-y-2 text-sm opacity-80">
            <li><a href="#" className="hover:text-gold-500">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-gold-500">Terms of Service</a></li>
            <li><a href="#" className="hover:text-gold-500">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-gold-500">Wholesale</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-4">Newsletter</h5>
          <p className="text-xs mb-2 opacity-70">Receive vanilla-inspired recipes and offers.</p>
          <div className="flex">
            <input type="email" placeholder="Email Address" className="w-full px-3 py-2 text-gray-900 rounded-l-md focus:outline-none" />
            <button className="bg-gold-500 px-4 py-2 rounded-r-md hover:bg-yellow-600 text-white font-bold">Go</button>
          </div>
          <div className="flex space-x-4 mt-6">
            <a href="#" className="hover:text-gold-500"><i className="fa-brands fa-facebook"></i></a>
            <a href="#" className="hover:text-gold-500"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" className="hover:text-gold-500"><i className="fa-brands fa-tiktok"></i></a>
            <a href="#" className="hover:text-gold-500"><i className="fa-brands fa-youtube"></i></a>
          </div>
        </div>
      </div>
      <div className="border-t border-vanilla-800 pt-8 text-center text-xs opacity-50">
        <p>&copy; 2025 The Vanilla Shop (Pvt) Ltd. – All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;