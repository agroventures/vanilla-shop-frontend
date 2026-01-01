import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Welcome from '../components/Welcome'
import Products from '../components/Products'
import History from '../components/History'
import About from '../components/About'
import Visit from '../components/Visit'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import Features from '../components/Featurs'

function Home() {
  return (
    <div className="bg-vanilla-50 text-vanilla-800 font-sans antialiased leading-relaxed scroll-smooth">
      <Navbar />
      <Hero />
      <Welcome />
      <History />
      <Products />
      <Features />
      <About />
      <Visit />
      <Contact />
      <Footer />
    </div>
  )
}

export default Home