import React from 'react';

const Socials = () => {
  // Placeholder images for the social feed
  const feedImages = [
    "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1626202097279-b7b5c3e61895?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1559563362-c667ba5f5480?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1610632380989-680fe40816c6?auto=format&fit=crop&q=80&w=300"
  ];

  return (
    <section className="py-20 bg-vanilla-50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        
        <h2 className="text-3xl font-serif font-bold text-vanilla-900 mb-2">Follow Us</h2>
        <p className="text-gray-600 mb-8">Stay connected and inspired. Tag us to be featured!</p>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mb-12">
          <a href="#" className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-vanilla-900 hover:text-white hover:bg-[#1877F2] transition text-xl">
            <i className="fa-brands fa-facebook-f"></i>
          </a>
          <a href="#" className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-vanilla-900 hover:text-white hover:bg-[#E4405F] transition text-xl">
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a href="#" className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-vanilla-900 hover:text-white hover:bg-[#000000] transition text-xl">
            <i className="fa-brands fa-tiktok"></i>
          </a>
          <a href="#" className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-vanilla-900 hover:text-white hover:bg-[#FF0000] transition text-xl">
            <i className="fa-brands fa-youtube"></i>
          </a>
        </div>

        {/* Feed Grid (Visual Placeholder) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {feedImages.map((img, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg cursor-pointer h-64">
              <img src={img} alt="Social Feed" className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                <i className="fa-brands fa-instagram text-white text-3xl"></i>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default Socials;