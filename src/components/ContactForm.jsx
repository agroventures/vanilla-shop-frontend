import axios from 'axios';
import React, { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle' | 'success' | 'error'
  const [touched, setTouched] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!validateEmail(value)) return 'Please enter a valid email address';
        return '';
      case 'message':
        if (!value.trim()) return 'Message is required';
        if (value.trim().length < 10) return 'Message must be at least 10 characters';
        return '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }

    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true,
    });

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + '/contact',
        formData
      );

      if (res.data?.status === true) {
        setSubmitStatus('success');
        // Only reset form on success
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTouched({});
        setErrors({});
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-vanilla-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-vanilla-900">Get In Touch</h2>
          <p className="text-gray-600 mt-2">Have a question, custom request, or wholesale inquiry? We'd love to hear from you.</p>
        </div>

        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <p className="font-bold">Message sent successfully!</p>
            <p className="text-sm">Thank you for reaching out. We'll get back to you soon.</p>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="font-bold">Failed to send message</p>
            <p className="text-sm">Please try again or contact us directly at info@thevanillashop.lk</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl p-8 space-y-6" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full border p-3 rounded-md focus:outline-none focus:border-gold-500 ${touched.name && errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                placeholder="Your Name"
                disabled={isSubmitting}
              />
              {touched.name && errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full border p-3 rounded-md focus:outline-none focus:border-gold-500 ${touched.email && errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                placeholder="your@email.com"
                disabled={isSubmitting}
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:border-gold-500"
              placeholder="Wholesale / General Inquiry"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border p-3 rounded-md h-32 focus:outline-none focus:border-gold-500 ${touched.message && errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              placeholder="How can we help?"
              disabled={isSubmitting}
            ></textarea>
            {touched.message && errors.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full font-bold py-3 rounded-md transition ${isSubmitting
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-vanilla-900 text-white hover:bg-gold-500'
              }`}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 text-center">
          <div>
            <h4 className="font-bold text-vanilla-900">Contact Info</h4>
            <p className="text-gray-600">info@thevanillashop.lk</p>
            <p className="text-gray-600">+94 70 520 0900</p>
          </div>
          <div>
            <h4 className="font-bold text-vanilla-900">Wholesale & Bulk</h4>
            <p className="text-sm text-gray-600">Interested in white-label or bulk supply?</p>
            <a href="mailto:info@thevanillashop.lk" className="text-gold-500 hover:underline">Contact Our Team</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;