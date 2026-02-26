import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaPhone, FaChevronDown } from 'react-icons/fa';
import axios from 'axios';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [projectsByCategory, setProjectsByCategory] = useState({});
  const dropdownRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const handleMobileLink = (path) => {
    setIsOpen(false);
    setActiveDropdown(null);
    navigate(path);
  };

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

  // Fetch projects for navbar dropdown
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('/projects?status=Published');
        const projects = Array.isArray(res.data) ? res.data : [];
        const grouped = {};
        projects.forEach(p => {
          if (!grouped[p.category]) grouped[p.category] = [];
          grouped[p.category].push({ name: p.name, slug: p.slug });
        });
        setProjectsByCategory(grouped);
      } catch (err) {
        console.error('Error fetching navbar projects:', err);
      }
    };
    fetchProjects();
  }, []);

  const handleDropdownEnter = (name) => {
    clearTimeout(hoverTimeoutRef.current);
    setActiveDropdown(name);
  };

  const handleDropdownLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 200);
  };

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
    { name: 'Blog', path: '/blog' },
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
            <a href="tel:+639088856169" className="flex items-center gap-1 text-primary hover:text-secondary">
              <FaPhone className="text-[10px]" />
              <span>+63 908 885 6169</span>
            </a>
          </div>
        </div>
      </div>

      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center relative z-10">
            <img
              src="/src.png"
              alt="Streamrock Realty Logo"
              className="h-12 w-auto"
            />
          </Link>

                {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8" ref={dropdownRef}>
            {navLinks.map((link) => (
              <div 
                key={link.name} 
                className="relative"
                onMouseEnter={() => link.hasDropdown && handleDropdownEnter(link.name)}
                onMouseLeave={() => link.hasDropdown && handleDropdownLeave()}
              >
                {link.hasDropdown ? (
                  <>
                    <Link
                      to={link.path}
                      className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-primary transition-colors py-2"
                    >
                      {link.name}
                      <FaChevronDown className={`text-xs transition-transform ${
                        activeDropdown === link.name ? 'rotate-180' : ''
                      }`} />
                    </Link>
                    
                    {/* Mega Dropdown */}
                    {activeDropdown === link.name && (
                      <div 
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[600px] bg-white shadow-xl rounded-lg border border-gray-100 py-4 px-6 animate-fade-in"
                        onMouseEnter={() => handleDropdownEnter(link.name)}
                        onMouseLeave={handleDropdownLeave}
                      >
                        <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
                          <span className="text-sm font-semibold text-gray-900">Our Projects</span>
                          <Link
                            to={link.path}
                            className="text-xs text-primary hover:text-secondary font-medium"
                            onClick={() => setActiveDropdown(null)}
                          >
                            View All &rarr;
                          </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {link.items.map((item) => (
                            <div key={item.name}>
                              <Link
                                to={item.path}
                                className="text-sm font-semibold text-gray-800 hover:text-primary transition-colors"
                                onClick={() => setActiveDropdown(null)}
                              >
                                {item.name}
                              </Link>
                              <p className="text-xs text-gray-400 mb-2">{item.description}</p>
                              {/* Project names under category */}
                              <div className="space-y-1">
                                {(projectsByCategory[item.name === 'Beach Towns' ? 'BeachTowns' : item.name] || []).map((proj) => (
                                  <Link
                                    key={proj.slug}
                                    to={`/projects/${proj.slug}`}
                                    className="block text-xs text-gray-500 hover:text-primary transition-colors pl-2 border-l-2 border-gray-100 hover:border-primary"
                                    onClick={() => setActiveDropdown(null)}
                                  >
                                    {proj.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
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
            
            {/* <Link 
              to="/contact" 
              className="ml-4 px-5 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-secondary transition-colors"
            >
              Inquire Now
            </Link> */}
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
                        <button
                          className="block w-full text-left py-2 text-sm text-gray-600 hover:text-primary"
                          onClick={() => handleMobileLink(link.path)}
                        >
                          All Projects
                        </button>
                        {link.items.map((item) => (
                          <button
                            key={item.name}
                            className="block w-full text-left py-2 text-sm text-gray-600 hover:text-primary"
                            onClick={() => handleMobileLink(item.path)}
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    className="block w-full text-left py-3 text-gray-700 font-medium hover:text-primary"
                    onClick={() => handleMobileLink(link.path)}
                  >
                    {link.name}
                  </button>
                )}
              </div>
            ))}
            {/* <Link 
              to="/contact" 
              className="block mt-4 px-5 py-3 bg-primary text-white text-center font-medium rounded hover:bg-secondary"
              onClick={() => setIsOpen(false)}
            >
              Inquire Now
            </Link> */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
