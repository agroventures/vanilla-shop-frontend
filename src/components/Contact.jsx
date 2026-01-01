import React from 'react';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will contact you soon.');
  };

  return (
    <section id="contact" className="py-20 bg-vanilla-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-vanilla-900">Get In Touch</h2>
          <p className="text-gray-600 mt-2">Have a question, custom request, or wholesale inquiry? We’d love to hear from you.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2">Name</label>
              <input type="text" className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:border-gold-500" placeholder="Your Name" required />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Email</label>
              <input type="email" className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:border-gold-500" placeholder="your@email.com" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Subject</label>
            <input type="text" className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:border-gold-500" placeholder="Wholesale / General Inquiry" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Message</label>
            <textarea className="w-full border border-gray-300 p-3 rounded-md h-32 focus:outline-none focus:border-gold-500" placeholder="How can we help?"></textarea>
          </div>
          <button type="submit" className="w-full bg-vanilla-900 text-white font-bold py-3 rounded-md hover:bg-gold-500 transition">Send Message</button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 text-center">
          <div>
            <h4 className="font-bold text-vanilla-900">Contact Info</h4>
            <p className="text-gray-600">info@thevanillashop.lk</p>
            <p className="text-gray-600">+94 XXX XXX XXX</p>
          </div>
          <div>
            <h4 className="font-bold text-vanilla-900">Wholesale & Bulk</h4>
            <p className="text-sm text-gray-600">Interested in white-label or bulk supply?</p>
            <a href="#" className="text-gold-500 hover:underline">Contact Business Team</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;