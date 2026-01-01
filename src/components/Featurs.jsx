import React from 'react';

const Features = () => {
  const features = [
    { icon: 'fa-certificate', title: 'Authenticity & Purity', text: 'Only hand-cured, natural vanilla. No synthetic vanillin.' },
    { icon: 'fa-mortar-pestle', title: 'Craft & Care', text: 'Small-batch production ensures consistency and depth.' },
    { icon: 'fa-mug-hot', title: 'Experience & Taste', text: 'Exclusive café creations you won’t find anywhere else.' },
    { icon: 'fa-hand-holding-heart', title: 'Sustainability', text: 'Ethically sourced, supporting local farmers.' },
  ];

  return (
    <section className="py-16 bg-vanilla-100">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-serif font-bold text-center mb-12">Why Choose The Vanilla Shop</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
              <i className={`fa-solid ${feature.icon} text-gold-500 text-3xl mb-4`}></i>
              <h4 className="font-bold mb-2">{feature.title}</h4>
              <p className="text-sm text-gray-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;