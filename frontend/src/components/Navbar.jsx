import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaPhone, FaChevronDown } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = [
    { name: 'Parks', path: '/projects?category=Parks', description: 'Nature-inspired communities' },
    { name: 'Beach Towns', path: '/projects?category=BeachTowns', description: 'Coastal living destinations' },
    { name: 'Shores', path: '/projects?category=Shores', description: 'Lakeside retreats' },
    { name: 'Peaks', path: '/projects?category=Peaks', description: 'Mountain hideaways' }
  ];

  const navLinks = [
    { name: 'Home', path: '/' },
    { 
      name: 'Projects', 
      path: '/projects',
      hasDropdown: true,
      items: categories
    },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-white'
    }`}>
      {/* Top bar */}
      <div className="border-b border-gray-100">
        <div className="container-custom">
          <div className="flex justify-between items-center h-10 text-xs">
            <span className="text-gray-500">Premium Real Estate Development</span>
            <a href="tel:+639123456789" className="flex items-center gap-1 text-primary hover:text-secondary">
              <FaPhone className="text-[10px]" />
              <span>+63 912 345 6789</span>
            </a>
          </div>
        </div>
      </div>

      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/src.png" 
              alt="Streamrock Realty Logo" 
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8" ref={dropdownRef}>
            {navLinks.map((link) => (
              <div key={link.name} className="relative">
                {link.hasDropdown ? (
                  <>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                      className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-primary transition-colors py-2"
                    >
                      {link.name}
                      <FaChevronDown className={`text-xs transition-transform ${
                        activeDropdown === link.name ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    {/* Dropdown */}
                    {activeDropdown === link.name && (
                      <div className="absolute top-full left-0 mt-1 w-64 bg-white shadow-lg rounded-lg border border-gray-100 py-2">
                        <Link
                          to={link.path}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                          onClick={() => setActiveDropdown(null)}
                        >
                          All Projects
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        {link.items.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            className="block px-4 py-2 hover:bg-gray-50 group"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <span className="text-sm text-gray-700 group-hover:text-primary font-medium">
                              {item.name}
                            </span>
                            <span className="block text-xs text-gray-400 mt-0.5">
                              {item.description}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.path}
                    className="text-sm font-medium text-gray-700 hover:text-primary transition-colors py-2"
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
            
            <Link 
              to="/contact" 
              className="ml-4 px-5 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-secondary transition-colors"
            >
              Inquire Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-xl text-gray-700"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg">
          <div className="container-custom py-4">
            {navLinks.map((link) => (
              <div key={link.name}>
                {link.hasDropdown ? (
                  <>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                      className="flex items-center justify-between w-full py-3 text-gray-700"
                    >
                      <span className="font-medium">{link.name}</span>
                      <FaChevronDown className={`text-xs transition-transform ${
                        activeDropdown === link.name ? 'rotate-180' : ''
                      }`} />
                    </button>
                    {activeDropdown === link.name && (
                      <div className="pl-4 pb-2">
                        <Link
                          to={link.path}
                          className="block py-2 text-sm text-gray-600 hover:text-primary"
                          onClick={() => setIsOpen(false)}
                        >
                          All Projects
                        </Link>
                        {link.items.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            className="block py-2 text-sm text-gray-600 hover:text-primary"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.path}
                    className="block py-3 text-gray-700 font-medium hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
            <Link 
              to="/contact" 
              className="block mt-4 px-5 py-3 bg-primary text-white text-center font-medium rounded hover:bg-secondary"
              onClick={() => setIsOpen(false)}
            >
              Inquire Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
