import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <span className="uppercase tracking-widest text-gold-500 text-sm font-bold">About Us</span>
        <h2 className="text-4xl font-serif font-bold text-vanilla-900 mt-2 mb-8">Where Every Bean Tells a Story</h2>
        
        <p className="text-lg text-gray-700 mb-6">Founded on 21 February 2025, at No. 253, Koswatta, Kaduwela Road, Battaramulla, our journey began with a dream to celebrate the essence of vanilla in its purest form.</p>
        
        <p className="text-gray-600 mb-8">As Sri Lanka’s first premium vanilla boutique café, we have transformed a simple ingredient into an immersive experience. Our founders collaborated with Sri Lankan vanilla growers, food technologists, and culinary artisans to create a space where the artistry of flavor meets the purity of nature.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mt-12 bg-white p-8 rounded-xl shadow-lg border border-vanilla-200">
          <div>
            <h3 className="font-serif text-xl font-bold text-vanilla-900">Our Mission</h3>
            <p className="text-gray-600 mt-2">To introduce, educate, and delight — turning the mystique of vanilla into everyday joy while nurturing a deep appreciation for its natural beauty.</p>
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-vanilla-900">Our Vision</h3>
            <p className="text-gray-600 mt-2">To put Sri Lankan vanilla on the global gastronomic map — celebrating its flavor, sustainability, and community-driven cultivation.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;