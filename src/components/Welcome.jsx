import React from 'react';

const Welcome = () => {
  return (
    <section className="py-20 px-4 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <img src="/images/vanilla-shop.png" alt="Vanilla Shop Interior" className="rounded-lg shadow-xl w-full h-96 object-cover" />
        </div>
        <div>
          <h2 className="text-4xl font-serif font-bold text-vanilla-900 mb-6">Welcome to The Vanilla Shop</h2>
          <p className="mb-4 text-lg">Nestled in the heart of Colombo, The Vanilla Shop is more than a café — it’s Sri Lanka’s first dedicated vanilla boutique. Here, we celebrate the world’s most beloved flavor in its truest, most natural form.</p>
          <p className="mb-6 text-gray-600">Every creation reflects our passion for quality and authenticity. Whether you’re sipping a vanilla-infused beverage or selecting a gift from our retail collection, each moment is infused with the pure essence of vanilla.</p>
          
          <div className="bg-vanilla-100 p-6 rounded-lg border-l-4 border-gold-500">
            <h3 className="font-serif text-xl font-bold mb-2">A Legacy Rooted in Heritage</h3>
            <p className="text-sm">We partner with Sri Lankan farmers who hand-pollinate every orchid. Our vanilla is known for soft smokiness and deep aroma—cherished by connoisseurs worldwide.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;