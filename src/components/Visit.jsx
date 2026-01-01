import React from 'react';

const Visit = () => {
  return (
    <section id="visit" className="py-20 bg-vanilla-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold mb-4">Visit Our Store</h2>
          <p className="text-vanilla-200 text-lg max-w-2xl mx-auto">
            Step into a cozy, aromatic retreat in the heart of Colombo. Every corner of The Vanilla Shop has been designed to immerse you in the world of vanilla.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: What to Expect */}
          <div>
            <h3 className="text-2xl font-serif font-bold text-gold-500 mb-6 border-b border-vanilla-800 pb-2">
              What to Expect
            </h3>
            <ul className="space-y-6">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-vanilla-800 flex items-center justify-center mr-4">
                  <i className="fa-solid fa-cloud-moon text-gold-500"></i>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Aromatic Atmosphere</h4>
                  <p className="text-sm opacity-80">A warm, vanilla-scented café environment designed for relaxation.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-vanilla-800 flex items-center justify-center mr-4">
                  <i className="fa-solid fa-mug-hot text-gold-500"></i>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Specialty Drinks</h4>
                  <p className="text-sm opacity-80">Signature vanilla lattes, milkshakes, and iced coffees.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-vanilla-800 flex items-center justify-center mr-4">
                  <i className="fa-solid fa-cookie-bite text-gold-500"></i>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Fresh Pastries</h4>
                  <p className="text-sm opacity-80">Freshly baked pastries and desserts from our kitchen.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-vanilla-800 flex items-center justify-center mr-4">
                  <i className="fa-solid fa-flask text-gold-500"></i>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Tastings & Flights</h4>
                  <p className="text-sm opacity-80">Experience "Vanilla Flights" — mini samples of our extracts, powders, and syrups.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-vanilla-800 flex items-center justify-center mr-4">
                  <i className="fa-solid fa-calendar-check text-gold-500"></i>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Events & Workshops</h4>
                  <p className="text-sm opacity-80">Pop-up events and pairing sessions to learn about the spice.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Right Column: Map & Directions */}
          <div className="flex flex-col h-full">
            {/* Map */}
            <div className="h-64 lg:h-80 w-full rounded-lg overflow-hidden shadow-2xl mb-8 border-2 border-vanilla-800">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63371.80385598126!2d79.9197669!3d6.9270786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2593d4a678885%3A0x673072044234568f!2sBattaramulla%2C%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk" 
                width="100%" height="100%" style={{ border:0 }} allowFullScreen="" loading="lazy">
              </iframe>
            </div>

            {/* Location Details */}
            <div className="bg-vanilla-800 p-6 rounded-lg flex-grow">
              <h3 className="font-serif font-bold text-gold-500 text-xl mb-4">How to Get Here</h3>
              
              <div className="space-y-4 text-sm">
                <p className="flex items-center">
                  <i className="fa-solid fa-location-dot w-6 text-gold-500"></i>
                  <span>253, Koswatta, Kaduwela Road, Battaramulla</span>
                </p>
                <p className="flex items-center">
                  <i className="fa-solid fa-clock w-6 text-gold-500"></i>
                  <span>Open Daily: 8:00 AM – 8:00 PM</span>
                </p>
                <div className="border-t border-vanilla-900 my-2 pt-2"></div>
                <p className="flex items-start">
                  <i className="fa-solid fa-car w-6 text-gold-500 mt-1"></i>
                  <span><strong>By Car:</strong> 10 mins from Battaramulla Junction via Parliament Rd or Kaduwela Rd.</span>
                </p>
                <p className="flex items-start">
                  <i className="fa-solid fa-bus w-6 text-gold-500 mt-1"></i>
                  <span><strong>Public Transport:</strong> Nearest bus routes via Koswatta.</span>
                </p>
                <p className="flex items-start">
                  <i className="fa-solid fa-square-parking w-6 text-gold-500 mt-1"></i>
                  <span><strong>Parking:</strong> On-site and nearby parking available.</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Visit;