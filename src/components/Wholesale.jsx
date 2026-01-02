import React from 'react';

const Wholesale = () => {
  return (
    <section className="py-16 bg-white border-y border-vanilla-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-vanilla-100 rounded-2xl p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="md:w-2/3">
            <span className="text-gold-500 font-bold tracking-widest text-sm uppercase">Business Partners</span>
            <h2 className="text-3xl font-serif font-bold text-vanilla-900 mt-2 mb-4">Wholesale & Bulk Orders</h2>
            <p className="text-gray-700 mb-6">
              If you’re a café, bakery, or retailer interested in bulk vanilla supplies or custom white-label products, our Business Development Team is ready to collaborate.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <i className="fa-solid fa-check-circle text-gold-500"></i>
                <span className="text-sm font-medium">Custom Extract Formulations</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fa-solid fa-check-circle text-gold-500"></i>
                <span className="text-sm font-medium">Bulk Bean Supply</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fa-solid fa-check-circle text-gold-500"></i>
                <span className="text-sm font-medium">Corporate Gifting Solutions</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fa-solid fa-check-circle text-gold-500"></i>
                <span className="text-sm font-medium">Private Label Options</span>
              </div>
            </div>
          </div>

          <div className="md:w-1/3 text-center">
            <a href="mailto:info@thevanillashop.lk" className="inline-block bg-vanilla-900 text-white px-8 py-4 rounded-md font-bold hover:bg-gold-500 transition shadow-lg w-full md:w-auto">
              Contact Our Team
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Wholesale;