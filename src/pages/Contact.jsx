import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Wholesale from '../components/Wholesale'
import Socials from '../components/Socials'
import Visit from '../components/Visit'
import ContactForm from '../components/ContactForm'
import useSEO from '../hooks/useSEO'

function Contact() {
    const url = window.location.href;

    useSEO({
        title: "Contact Us - The Vanilla Shop",
        description: "The Vanilla Shop is more than a café — it’s Sri Lanka’s first dedicated vanilla boutique.",
        url,
        image_alt: "Contact Us",
        twitter_card: "summary_large_image",
    });

    return (
        <div className='pt-24 min-h-screen bg-vanilla-50'>
            <Navbar />
            <ContactForm />
            <Visit />
            <Wholesale />
            <Socials />
            <Footer />
        </div>
    )
}

export default Contact
