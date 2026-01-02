import { ShoppingBagIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation()

  const isHomePage = location.pathname === '/'

  // 1. Scroll Effect Logic
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Cart Count Logic (Your snippet integrated)
  useEffect(() => {
    const updateCartCount = () => {
      // Get cart from local storage
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');

      // Sum up quantities
      const count = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

      setCartCount(count);
    };

    updateCartCount();

    // Listen for custom event (triggered when user clicks 'Add to Cart')
    window.addEventListener('cartUpdated', updateCartCount);
    // Listen for storage changes (if user has multiple tabs open)
    window.addEventListener('storage', updateCartCount);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const getNavbarStyle = () => {
    if (!isHomePage) {
      return isScrolled
        ? 'bg-white/95 backdrop-blur-sm shadow-md py-3'
        : 'bg-vanilla-900 py-3 shadow-lg'
    }
    // Home page: transparent initially, white when scrolled
    return isScrolled
      ? 'bg-white/95 backdrop-blur-sm shadow-md py-3'
      : 'bg-transparent py-6'
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${getNavbarStyle()}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Link to="/" className="font-serif text-2xl font-bold tracking-wider">
              <img
                src='/logo.png'
                alt="Logo"
                className={`w-18 h-18 ${isScrolled ? 'brightness-100 invert-0' : 'brightness-0 invert'}`}
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`${isScrolled ? "text-vanilla-900" : "text-white"
                  } hover:text-gold-500 transition font-semibold`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* DESKTOP CART ICON WITH BADGE */}
          <div className="hidden md:flex">
            <Link
              to="/cart"
              className={`relative px-2 py-2 border ${isScrolled
                ? 'text-vanilla-900 border-vanilla-900 hover:bg-vanilla-900 hover:text-white'
                : 'text-white border-white hover:bg-white hover:text-vanilla-900'
                } rounded-full transition group`}
            >
              <ShoppingBagIcon size={20} />

              {/* The Count Badge */}
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Toggle & Cart */}
          <div className="md:hidden flex items-center gap-4">
            {/* Mobile Cart Icon */}
            <Link to="/cart" className={`relative ${isScrolled ? "text-vanilla-900" : "text-white"}`}>
              <ShoppingBagIcon size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${isScrolled ? "text-vanilla-900" : "text-white"} hover:text-gold-500 focus:outline-none`}
            >
              <i className={`fa-solid ${isOpen ? "fa-xmark" : "fa-bars"} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-vanilla-100 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setIsOpen(false)}
              className="block py-4 px-6 text-vanilla-900 font-medium hover:bg-vanilla-50 transition-colors border-b border-vanilla-50"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;