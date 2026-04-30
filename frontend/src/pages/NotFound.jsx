import { Link } from 'react-router-dom';
import { FiHome, FiSearch } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8">
        <span className="text-[9rem] font-black text-gray-100 leading-none select-none">404</span>
        <div className="absolute inset-0 flex items-center justify-center">
          <FiSearch className="w-16 h-16 text-primary opacity-60" />
        </div>
      </div>
      <h1 className="text-3xl font-display font-bold text-gray-800 mb-3">
        Page Not Found
      </h1>
      <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
        The page you're looking for doesn't exist or may have been moved.
        Let's get you back on track.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-secondary transition-colors"
        >
          <FiHome className="w-4 h-4" />
          Back to Home
        </Link>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          View Projects
        </Link>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
