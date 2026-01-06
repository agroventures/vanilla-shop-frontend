import React from 'react';

const Socials = () => {
  // Placeholder images for the social feed
  const feedImages = [
    "/images/contact/instagram-1.png",
    "/images/contact/instagram-2.png",
    "/images/contact/instagram-3.png",
  ];

  return (
    <section className="py-20 bg-vanilla-50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        
        <h2 className="text-3xl font-serif font-bold text-vanilla-900 mb-2">Follow Us</h2>
        <p className="text-gray-600 mb-8">Stay connected and inspired. Tag us to be featured!</p>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mb-12">
          <a href="https://www.facebook.com/thevanillashopsl" target="_blank" className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-vanilla-900 hover:text-white hover:bg-[#1877F2] transition text-xl">
            <i className="fa-brands fa-facebook-f"></i>
          </a>
          <a href="https://www.instagram.com/the_vanillashop" target="_blank" className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-vanilla-900 hover:text-white hover:bg-[#E4405F] transition text-xl">
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a href="https:://www.tiktok.com/@the_vanillashop" target="_blank" className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-vanilla-900 hover:text-white hover:bg-[#000000] transition text-xl">
            <i className="fa-brands fa-tiktok"></i>
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
          <div className='group relative overflow-hidden rounded-lg cursor-pointer h-64'>
            <video src="/videos/instagram_video.mp4" autoPlay loop playsinline controls className="w-full h-full object-cover"></video>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default Socials;