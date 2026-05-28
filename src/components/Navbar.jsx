import { ShoppingBagIcon, Menu, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ onShopClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  // 1. Scroll Effect Logic
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Cart Count Logic
  useEffect(() => {
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
      setCartCount(count);
    };

    updateCartCount();

    window.addEventListener('cartUpdated', updateCartCount);
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
        ? 'bg-white/95 backdrop-blur-md border-b border-neutral-100 py-8'
        : 'bg-neutral-950 py-8 border-b border-neutral-900 shadow-sm';
    }
    return isScrolled
      ? 'bg-white/95 backdrop-blur-md border-b border-neutral-100 py-8'
      : 'bg-transparent py-8';
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${getNavbarStyle()}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Left Nav Links - Changed space-x-6 to space-x-12 */}
          <div className="hidden md:flex items-center justify-end space-x-12 flex-1 pr-12">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => {
                  setIsOpen(false);
                  if (link.href === '/shop' && onShopClick) onShopClick();
                }}
                className={`text-xs font-medium tracking-widest uppercase transition-colors duration-300 ${
                  isScrolled
                    ? "text-neutral-600 hover:text-neutral-950"
                    : isHomePage ? "text-neutral-300 hover:text-white" : "text-neutral-400 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Center Logo */}
          <div className="flex-1 flex justify-start md:justify-center md:flex-none shrink-0">
            <Link to="/">
              <img
                src='/logo.png'
                alt="Logo"
                className={`w-24 transition-all duration-500 object-contain ${
                  isScrolled ? 'brightness-100 invert-0' : 'brightness-0 invert'
                }`}
              />
            </Link>
          </div>

          {/* Right Nav Links + Cart - Changed space-x-6 to space-x-12 */}
          <div className="hidden md:flex items-center space-x-12 flex-1 pl-12">
            {navLinks.slice(2).map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => {
                  setIsOpen(false);
                  if (link.href === '/shop' && onShopClick) onShopClick();
                }}
                className={`text-xs font-medium tracking-widest uppercase transition-colors duration-300 ${
                  isScrolled
                    ? "text-neutral-600 hover:text-neutral-950"
                    : isHomePage ? "text-neutral-300 hover:text-white" : "text-neutral-400 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/cart"
              className={`relative p-2.5 rounded-sm border transition-all duration-300 ${
                isScrolled
                  ? 'text-neutral-900 border-neutral-800 hover:bg-neutral-950 hover:border-neutral-950 hover:text-white'
                  : 'text-white border-neutral-300 hover:bg-white hover:text-neutral-950'
              }`}
            >
              <ShoppingBagIcon size={18} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className={`absolute -top-1.5 -right-1.5 text-[9px] font-semibold h-4 w-4 flex items-center justify-center rounded-xs transition-colors ${
                  isScrolled ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-950'
                }`}>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Actions Container */}
          <div className="md:hidden flex items-center gap-5">
            {/* Mobile Cart Link */}
            <Link 
              to="/cart" 
              className={`relative p-1 transition-colors ${
                isScrolled ? "text-neutral-900" : "text-white"
              }`}
            >
              <ShoppingBagIcon size={22} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className={`absolute -top-1 -right-1 text-[8px] font-bold h-3.5 w-3.5 flex items-center justify-center rounded-xs ${
                  isScrolled ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-950'
                }`}>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Native Lucide Menu Icon Replacement */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-1 transition-colors ${
                isScrolled ? "text-neutral-900 hover:text-neutral-600" : "text-white hover:text-neutral-300"
              } focus:outline-none`}
            >
              {isOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Luxury Overlay Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-neutral-100 absolute top-full left-0 right-0 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="py-2 bg-white">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => {
                  setIsOpen(false);
                  if (link.href === '/shop' && onShopClick) onShopClick();
                }}
                className="block py-5 px-8 text-xs font-medium tracking-widest uppercase text-neutral-900 hover:bg-neutral-50 border-b border-neutral-50 last:border-none transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;