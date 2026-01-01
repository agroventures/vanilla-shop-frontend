import React from 'react';

const History = () => {
  return (
    <section className="py-20 bg-vanilla-900 text-vanilla-50">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 text-center md:text-left">
          <i className="fa-solid fa-earth-americas text-gold-500 text-5xl mb-4"></i>
          <h3 className="text-2xl font-serif font-bold mb-4">Ancient Origins</h3>
          <p className="opacity-80">From the Totonac people of Mexico to the Aztecs' sacred 'xocolatl', vanilla has been treasured for centuries. Once the "Queen of Spices" in royal European courts, it now thrives in Sri Lanka's rich soils.</p>
        </div>
        <div className="md:col-span-1 text-center md:text-left border-l-0 md:border-l border-vanilla-800 md:pl-8">
          <i className="fa-solid fa-seedling text-gold-500 text-5xl mb-4"></i>
          <h3 className="text-2xl font-serif font-bold mb-4">Cultivating Purity</h3>
          <p className="opacity-80">Vanilla is intricate. Each orchid blooms once a year and must be hand-pollinated within hours. The beans undergo a months-long curing process—killing, sweating, drying, and conditioning.</p>
        </div>
        <div className="md:col-span-1 text-center md:text-left border-l-0 md:border-l border-vanilla-800 md:pl-8">
          <i className="fa-solid fa-hands-holding-circle text-gold-500 text-5xl mb-4"></i>
          <h3 className="text-2xl font-serif font-bold mb-4">Global Value, Local Pride</h3>
          <p className="opacity-80">As global demand for natural flavors rises, Sri Lankan vanilla is earning admiration. We take pride in representing Sri Lanka’s emerging vanilla identity to the world.</p>
        </div>
      </div>
    </section>
  );
};

export default History;