import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Coffee, ShoppingCart, Menu as MenuIcon, X } from 'lucide-react';
import { RootState } from '../store';

const Navbar = () => {
  const location = useLocation();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState<string>('home');

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
      setActiveItem(sectionId);
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveItem('home');
    }
  };

  const navLinkClasses = (isActive: boolean) => `
    px-3 py-2 text-sm font-medium transition-all relative
    ${isActive ? 'text-primary-600' : 'text-secondary-600 hover:text-primary-600'}
    after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5
    after:bg-primary-600 after:transition-transform after:duration-300
    ${isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'}
    after:origin-left
  `;

  return (
    <nav 
      className={`bg-white fixed w-full z-50 transition-shadow ${
        isScrolled || isMenuOpen ? 'shadow-md' : ''
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center" aria-label="Go to homepage">
              <Coffee className="h-8 w-8 text-primary-600" aria-hidden="true" />
              <span className="ml-2 text-xl font-serif font-bold text-secondary-800">
                Oōmi Lezato
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              onClick={handleHomeClick}
              className={navLinkClasses(activeItem === 'home')}
            >
              Home
            </Link>

            {location.pathname === '/' && (
              <>
                <button
                  onClick={() => scrollToSection('about')}
                  className={navLinkClasses(activeItem === 'about')}
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection('reviews')}
                  className={navLinkClasses(activeItem === 'reviews')}
                >
                  Reviews
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className={navLinkClasses(activeItem === 'contact')}
                >
                  Contact
                </button>
              </>
            )}

            <Link
              to="/menu"
              className={navLinkClasses(location.pathname === '/menu')}
              onClick={() => setActiveItem('menu')}
            >
              Menu
            </Link>

            <div className="flex items-center space-x-2 ml-4">
              <Link
                to="/cart"
                className="relative p-2 rounded-full hover:bg-primary-50 transition-colors"
                aria-label={`Shopping cart with ${cartItems.length} items`}
              >
                <ShoppingCart className="h-6 w-6 text-secondary-600" aria-hidden="true" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* <Link
                to="/profile"
                className="p-2 rounded-full hover:bg-primary-50 transition-colors"
                aria-label="User profile"
              >
                <User className="h-6 w-6 text-secondary-600" aria-hidden="true" />
              </Link> */}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <Link
              to="/cart"
              className="relative p-2 rounded-full hover:bg-primary-50 transition-colors mr-2"
              aria-label={`Shopping cart with ${cartItems.length} items`}
            >
              <ShoppingCart className="h-6 w-6 text-secondary-600" aria-hidden="true" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            <button
              type="button"
              className="p-2 rounded-md text-secondary-600 hover:bg-primary-50 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <MenuIcon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? 'max-h-96 opacity-100'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className="px-4 pt-2 pb-4 space-y-2 bg-white shadow-lg">
          <Link
            to="/"
            onClick={(e) => {
              handleHomeClick(e);
              setActiveItem('home');
            }}
            className={`block ${navLinkClasses(activeItem === 'home')}`}
          >
            Home
          </Link>

          {location.pathname === '/' && (
            <>
              <button
                onClick={() => scrollToSection('about')}
                className={`w-full text-left ${navLinkClasses(activeItem === 'about')}`}
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('reviews')}
                className={`w-full text-left ${navLinkClasses(activeItem === 'reviews')}`}
              >
                Reviews
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className={`w-full text-left ${navLinkClasses(activeItem === 'contact')}`}
              >
                Contact
              </button>
            </>
          )}

          <Link
            to="/menu"
            onClick={() => setActiveItem('menu')}
            className={`block ${navLinkClasses(activeItem === 'menu')}`}
          >
            Menu
          </Link>

          {/* <Link
            to="/profile"
            className="flex items-center px-3 py-2 text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors"
          >
            <User className="h-5 w-5 mr-2" aria-hidden="true" />
            Profile
          </Link> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;