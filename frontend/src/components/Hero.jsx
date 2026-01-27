import { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaHome } from 'react-icons/fa';

const Hero = () => {
  const [formData, setFormData] = useState({
    propertyType: '',
    location: '',
    priceRange: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to properties with filters
    window.location.href = `/properties?type=${formData.propertyType}&location=${formData.location}&price=${formData.priceRange}`;
  };

  return (
    <div className="relative h-screen">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center text-white">
            <p className="text-accent text-sm md:text-base font-semibold tracking-wider uppercase mb-4">
              YOUR TRUSTED REAL ESTATE PARTNER
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Find Your Dream Property
            </h1>
            <p className="text-lg md:text-xl mb-12 text-gray-200 max-w-2xl mx-auto">
              Discover premium properties across Nuvali, Vermosa, Southmont, and Batangas Beach
            </p>

            {/* Search Form */}
            <div className="bg-white rounded-lg shadow-2xl p-6 md:p-8">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <FaHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
                  >
                    <option value="">Property Type</option>
                    <option value="house-and-lot">House and Lot</option>
                    <option value="condo">Condominium</option>
                    <option value="lot">Lot Only</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
                  >
                    <option value="">Location</option>
                    <option value="nuvali">Nuvali</option>
                    <option value="vermosa">Vermosa</option>
                    <option value="southmont">Southmont</option>
                    <option value="batangas">Batangas Beach</option>
                  </select>
                </div>

                <div className="relative">
                  <select
                    value={formData.priceRange}
                    onChange={(e) => setFormData({...formData, priceRange: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
                  >
                    <option value="">Price Range</option>
                    <option value="0-3000000">Under ₱3M</option>
                    <option value="3000000-5000000">₱3M - ₱5M</option>
                    <option value="5000000-10000000">₱5M - ₱10M</option>
                    <option value="10000000-999999999">Above ₱10M</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn-primary flex items-center justify-center space-x-2"
                >
                  <FaSearch />
                  <span>Search</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
