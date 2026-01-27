import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaPhone } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'Why Streamrock', path: '/about' },
    { name: 'Investors', path: '/investors' },
    { name: 'Resources', path: '/resources' },
    { name: 'Contact Us', path: '/contact' }
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
      <div className="container-custom">
        <div className="flex justify-between items-center h-20">
        {/* Logo */}
                  <Link to="/" className="flex items-center space-x-3 group">
                    <img 
                      src="/src.png" 
                      alt="Streamrock Realty Logo" 
                      className="w-16 h-16 transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="hidden sm:block">
                      <span className={`text-2xl font-display font-semibold tracking-tight transition-colors duration-300 ${
                        scrolled ? 'text-primary' : 'text-white'
                      }`}>
                        Streamrock
                      </span>
                      <span className={`text-2xl font-light tracking-wide transition-colors duration-300 ${
                        scrolled ? 'text-gray-600' : 'text-gray-100'
                      }`}>
                        {' '}Realty
                      </span>
                    </div>
                  </Link>

                          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  scrolled 
                    ? 'text-gray-700 hover:text-primary' 
                    : 'text-white hover:text-accent'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <a 
              href="tel:+639123456789" 
              className={`flex items-center space-x-2 ${
                scrolled ? 'text-primary' : 'text-white'
              }`}
            >
              <FaPhone className="text-sm" />
              <span className="text-sm font-medium">+63 912 345 6789</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden text-2xl ${scrolled ? 'text-primary' : 'text-white'}`}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="container-custom py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block py-3 text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <a 
              href="tel:+639123456789" 
              className="flex items-center space-x-2 py-3 text-primary"
            >
              <FaPhone />
              <span>+63 912 345 6789</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
