import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Welcome from '../components/Welcome'
import Products from '../components/Products'
import History from '../components/History'
import Footer from '../components/Footer'
import Features from '../components/Featurs'
import useSEO from '../hooks/useSEO'

function Home() {
  const url = window.location.href;
  
  useSEO({
    title: "Home - The Vanilla Shop",
    url,
    image_alt: "Home",
    twitter_card: "summary_large_image",
  });
  
  return (
    <div className="bg-vanilla-50 text-vanilla-800 font-sans antialiased leading-relaxed scroll-smooth">
      <Navbar />
      <Hero />
      <Welcome />
      <History />
      <Products />
      <Features />
      <Footer />
    </div>
  )
}

export default Home