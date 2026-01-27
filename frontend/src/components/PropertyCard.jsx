import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt } from 'react-icons/fa';

const PropertyCard = ({ property }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      {/* Image */}
      <div className="relative h-64 overflow-hidden group">
        <img
          src={property.images?.[0] || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800'}
          alt={property.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
          {property.propertyType}
        </div>
        {property.featured && (
          <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-primary mb-2 line-clamp-2">{property.name}</h3>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <FaMapMarkerAlt className="mr-2 text-accent" />
          <span className="text-sm">{property.location}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.description}</p>

        {/* Features */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b">
          {property.bedrooms && (
            <div className="flex items-center space-x-1 text-gray-600">
              <FaBed className="text-accent" />
              <span className="text-sm">{property.bedrooms} Beds</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center space-x-1 text-gray-600">
              <FaBath className="text-accent" />
              <span className="text-sm">{property.bathrooms} Baths</span>
            </div>
          )}
          {(property.lotArea || property.floorArea) && (
            <div className="flex items-center space-x-1 text-gray-600">
              <FaRulerCombined className="text-accent" />
              <span className="text-sm">{property.lotArea || property.floorArea} sqm</span>
            </div>
          )}
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-primary">{formatPrice(property.price)}</p>
          </div>
          <button className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded text-sm font-semibold transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
