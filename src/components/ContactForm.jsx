import axios from 'axios';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import React, { useRef, useState } from 'react';

const ContactForm = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const alertVariants = {
    initial: { opacity: 0, height: 0, marginBottom: 0 },
    animate: { opacity: 1, height: 'auto', marginBottom: 24, transition: { duration: 0.3 } },
    exit: { opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.2 } }
  };

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
      if (error) newErrors[key] = error;
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
    if (submitStatus !== 'idle') setSubmitStatus('idle');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + '/contact', formData);
      if (res.data?.status === true) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTouched({});
        setErrors({});
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={ref} className="py-20 bg-vanilla-50 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Animation */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="section-title">Get In Touch</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have a question, custom request, or wholesale inquiry? We'd love to hear from you.
          </p>
        </motion.div>

        {/* Status Messages with AnimatePresence */}
        <AnimatePresence mode="wait">
          {submitStatus === 'success' && (
            <motion.div 
              key="success"
              variants={alertVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg overflow-hidden"
            >
              <p className="font-bold">Message sent successfully!</p>
              <p className="text-sm">Thank you for reaching out. We'll get back to you soon.</p>
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div 
              key="error"
              variants={alertVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg overflow-hidden"
            >
              <p className="font-bold">Failed to send message</p>
              <p className="text-sm">Please try again or contact us directly at info@thevanillashop.lk</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Form Animation */}
        <motion.form
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-xl p-8 space-y-6"
          noValidate
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2">Name <span className="text-red-500">*</span></label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full border p-3 rounded-md focus:outline-none focus:border-gold-500 transition-all ${touched.name && errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                placeholder="Your Name"
                disabled={isSubmitting}
              />
              <AnimatePresence>
                {touched.name && errors.name && (
                  <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mt-1 text-sm text-red-600">{errors.name}</motion.p>
                )}
              </AnimatePresence>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Email <span className="text-red-500">*</span></label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full border p-3 rounded-md focus:outline-none focus:border-gold-500 transition-all ${touched.email && errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                placeholder="your@email.com"
                disabled={isSubmitting}
              />
              <AnimatePresence>
                {touched.email && errors.email && (
                  <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mt-1 text-sm text-red-600">{errors.email}</motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Subject</label>
            <motion.input
              whileFocus={{ scale: 1.005 }}
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:border-gold-500 transition-all"
              placeholder="Wholesale / General Inquiry"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Message <span className="text-red-500">*</span></label>
            <motion.textarea
              whileFocus={{ scale: 1.005 }}
              name="message"
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border p-3 rounded-md h-32 focus:outline-none focus:border-gold-500 transition-all ${touched.message && errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              placeholder="How can we help?"
              disabled={isSubmitting}
            ></motion.textarea>
            <AnimatePresence>
              {touched.message && errors.message && (
                <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mt-1 text-sm text-red-600">{errors.message}</motion.p>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            type="submit"
            disabled={isSubmitting}
            className={`w-full font-bold py-3 rounded-md transition ${isSubmitting ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-vanilla-900 text-white hover:bg-gold-500'}`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                Sending...
              </span>
            ) : 'Send Message'}
          </motion.button>
        </motion.form>

        {/* Footer Info Animation */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 text-center"
        >
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
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;