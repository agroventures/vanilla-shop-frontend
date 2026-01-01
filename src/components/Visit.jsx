import React from 'react';

const Visit = () => {
  return (
    <section id="visit" className="py-20 bg-vanilla-900 text-white">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-4xl font-serif font-bold mb-6">Visit Our Store</h2>
          <p className="mb-6 opacity-90">Step into a cozy, aromatic retreat in the heart of Colombo. Every corner of The Vanilla Shop has been designed to immerse you in the world of vanilla.</p>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-start"><i className="fa-solid fa-mug-saucer text-gold-500 mt-1 mr-3"></i> Specialty drinks: vanilla lattes & milkshakes</li>
            <li className="flex items-start"><i className="fa-solid fa-bread-slice text-gold-500 mt-1 mr-3"></i> Freshly baked pastries and desserts</li>
            <li className="flex items-start"><i className="fa-solid fa-flask text-gold-500 mt-1 mr-3"></i> In-store tastings and "Vanilla Flights"</li>
          </ul>

          <div className="bg-vanilla-800 p-6 rounded-lg">
            <h3 className="font-bold text-gold-500 mb-2">Location & Hours</h3>
            <p className="mb-1">253, Koswatta, Kaduwela Road, Battaramulla, Sri Lanka</p>
            <p>Open Daily: 8:00 AM – 8:00 PM</p>
          </div>
        </div>
        <div className="h-96 w-full rounded-lg overflow-hidden shadow-2xl">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63371.80385598126!2d79.9197669!3d6.9270786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2593d4a678885%3A0x673072044234568f!2sBattaramulla%2C%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk" 
            width="100%" height="100%" style={{ border:0 }} allowFullScreen="" loading="lazy">
          </iframe>
        </div>
      </div>
    </section>
  );
};

export default Visit;