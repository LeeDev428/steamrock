import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Streamrock Realty Corporation</h3>
            <p className="text-sm mb-4">
              Your trusted partner in real estate investments across the Philippines.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/streamrockrealty" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="https://instagram.com/streamrock_realty" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="https://wa.me/639088856169" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/properties" className="hover:text-accent transition-colors">All Properties</Link></li>
              <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link to="/investors" className="hover:text-accent transition-colors">For Investors</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Property Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Properties</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/properties?category=nuvali" className="hover:text-accent transition-colors">Nuvali Properties</Link></li>
              <li><Link to="/properties?category=vermosa" className="hover:text-accent transition-colors">Vermosa Properties</Link></li>
              <li><Link to="/properties?category=southmont" className="hover:text-accent transition-colors">Southmont Properties</Link></li>
              <li><Link to="/properties?category=batangas" className="hover:text-accent transition-colors">Batangas Beach</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
                <span>Blk 8 Lot 3 Iris St., Camella Homes I, Brgy. Putatan, Muntinlupa City 1770</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaPhone />
                <a href="tel:+639088856169" className="hover:text-accent transition-colors">+63 908 885 6169</a>
              </li>
              <li className="flex items-center space-x-2">
                <FaEnvelope />
                <a href="mailto:dwllaneta@gmail.com" className="hover:text-accent transition-colors">dwllaneta@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; {currentYear} Streamrock Realty Corporation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
