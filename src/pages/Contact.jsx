import React from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Wholesale from '../components/Wholesale'
import Socials from '../components/Socials'
import Visit from '../components/Visit'
import ContactForm from '../components/ContactForm'
import useSEO from '../hooks/useSEO'

const cubicBezierEasing = [0.16, 1, 0.3, 1];

function Contact() {
    const url = window.location.href;

    useSEO({
        title: "Contact Us - The Vanilla Shop",
        url,
        image_alt: "Contact Us",
        twitter_card: "summary_large_image",
    });

    return (
        <div className='bg-white text-neutral-900 font-sans antialiased leading-relaxed scroll-smooth overflow-hidden'>
            <Navbar />

            {/* Hero Section */}
            <div
                className="relative h-[65vh] flex items-center justify-center bg-cover bg-center border-b border-neutral-100"
                style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://pub-8476bede5a4146e8b7731cfe515f1c3b.r2.dev/the-vanilla-shop/contact/hero.jpg')" }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: cubicBezierEasing }}
                    className="text-center text-white px-4 max-w-4xl mx-auto space-y-4"
                >
                    <span className="text-xs uppercase tracking-widest text-neutral-300 font-light block">Reach Out</span>
                    <h1 className="text-4xl md:text-6xl font-serif font-light tracking-tight text-white">Contact Us</h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.8 }}
                        transition={{ delay: 0.4, duration: 1 }}
                        className="text-base md:text-lg font-light tracking-wide max-w-xl mx-auto text-neutral-200"
                    >
                        We'd love to hear from you - whether it's a question, a custom request, or a wholesale inquiry.
                    </motion.p>
                </motion.div>
            </div>

            <div id="contact-form"><ContactForm /></div>
            <Visit />
            <Wholesale />
            <Socials />
            <Footer />
        </div>
    )
}

export default Contact
