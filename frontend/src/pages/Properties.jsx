import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import { FaFilter } from 'react-icons/fa';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Properties = () => {
  const [gridRef, gridVisible] = useScrollAnimation();
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    propertyType: searchParams.get('type') || '',
    location: searchParams.get('location') || '',
    minPrice: '',
    maxPrice: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.propertyType) queryParams.append('propertyType', filters.propertyType);

      const response = await axios.get(`/api/properties?${queryParams}`);
      let data = response.data;

      // Client-side filtering for price range
      if (filters.minPrice) {
        data = data.filter(p => p.price >= parseInt(filters.minPrice));
      }
      if (filters.maxPrice) {
        data = data.filter(p => p.price <= parseInt(filters.maxPrice));
      }

      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setSampleProperties();
    } finally {
      setLoading(false);
    }
  };

  const setSampleProperties = () => {
    const sampleData = [
      {
        _id: '1',
        name: 'Avida Southfield Settings Nuvali',
        category: 'Nuvali Properties',
        location: 'Sta. Rosa, Laguna',
        price: 4500000,
        description: 'Modern house and lot in a peaceful community with excellent amenities',
        images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800'],
        propertyType: 'House and Lot',
        bedrooms: 3,
        bathrooms: 2,
        lotArea: 120,
        featured: true
      },
      {
        _id: '2',
        name: 'Ridgeview Estates Nuvali',
        category: 'Nuvali Properties',
        location: 'Sta. Rosa, Laguna',
        price: 6200000,
        description: 'Exclusive subdivision with premium amenities and 24/7 security',
        images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800'],
        propertyType: 'House and Lot',
        bedrooms: 4,
        bathrooms: 3,
        lotArea: 180,
        featured: true
      },
      {
        _id: '3',
        name: 'Southdale Settings Nuvali',
        category: 'Nuvali Properties',
        location: 'Calamba, Laguna',
        price: 3800000,
        description: 'Affordable house and lot near commercial centers',
        images: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800'],
        propertyType: 'House and Lot',
        bedrooms: 2,
        bathrooms: 2,
        lotArea: 90
      },
      {
        _id: '4',
        name: 'Avida Veranda Vermosa',
        category: 'Vermosa Properties',
        location: 'Imus, Cavite',
        price: 3500000,
        description: 'Well-planned community with modern lifestyle amenities',
        images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800'],
        propertyType: 'House and Lot',
        bedrooms: 2,
        bathrooms: 2,
        lotArea: 100
      },
      {
        _id: '5',
        name: 'Caleia Vermosa',
        category: 'Vermosa Properties',
        location: 'Imus, Cavite',
        price: 5800000,
        description: 'Premium residential lots in a master-planned community',
        images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800'],
        propertyType: 'House and Lot',
        bedrooms: 3,
        bathrooms: 3,
        lotArea: 140
      },
      {
        _id: '6',
        name: 'Hillside Ridge Southmont',
        category: 'Southmont Properties',
        location: 'Daang Hari, Cavite',
        price: 5200000,
        description: 'Mountain-view properties with peaceful surroundings',
        images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800'],
        propertyType: 'House and Lot',
        bedrooms: 4,
        bathrooms: 3,
        lotArea: 150
      },
      {
        _id: '7',
        name: 'Verdala Southmont',
        category: 'Southmont Properties',
        location: 'Las Piñas City',
        price: 4800000,
        description: 'Contemporary homes in a vibrant community',
        images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800'],
        propertyType: 'House and Lot',
        bedrooms: 3,
        bathrooms: 2,
        lotArea: 110
      },
      {
        _id: '8',
        name: 'Paya Larga Seaside',
        category: 'Batangas Beach Properties',
        location: 'Laiya, Batangas',
        price: 8500000,
        description: 'Luxury beachfront property with stunning ocean views',
        images: ['https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&fit=crop&w=800'],
        propertyType: 'House and Lot',
        bedrooms: 4,
        bathrooms: 4,
        lotArea: 200,
        featured: true
      },
      {
        _id: '9',
        name: 'The Spinnaker at Club Laiya',
        category: 'Batangas Beach Properties',
        location: 'San Juan, Batangas',
        price: 6200000,
        description: 'Resort-style living with beach access',
        images: ['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800'],
        propertyType: 'House and Lot',
        bedrooms: 3,
        bathrooms: 3,
        lotArea: 130
      },
      {
        _id: '10',
        name: 'Calatagan South Beach',
        category: 'Batangas Beach Properties',
        location: 'Calatagan, Batangas',
        price: 7200000,
        description: 'Beachfront lots perfect for vacation homes',
        images: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800'],
        propertyType: 'Lot',
        lotArea: 300
      },
      {
        _id: '11',
        name: 'Pre-selling Condo - BGC',
        category: 'Pre-selling Properties',
        location: 'Bonifacio Global City',
        price: 9500000,
        description: 'High-end condominium in the heart of BGC',
        images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800'],
        propertyType: 'Condo',
        bedrooms: 2,
        bathrooms: 2,
        floorArea: 75
      },
      {
        _id: '12',
        name: 'Bank Foreclosed - Alabang',
        category: 'Bank Foreclosed Properties',
        location: 'Alabang, Muntinlupa',
        price: 4200000,
        description: 'Great investment opportunity in prime location',
        images: ['https://images.unsplash.com/photo-1600047509358-9dc75507daeb?auto=format&fit=crop&w=800'],
        propertyType: 'House and Lot',
        bedrooms: 3,
        bathrooms: 2,
        lotArea: 120
      }
    ];

    let filtered = sampleData;
    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= parseInt(filters.maxPrice));
    }
    setProperties(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      propertyType: '',
      location: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  return (
    <div className="pt-20 min-h-screen bg-light">
      {/* Page Header */}
      <div className="bg-primary text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Properties</h1>
          <p className="text-xl text-gray-200">Discover your dream property from our exclusive listings</p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-primary flex items-center">
                  <FaFilter className="mr-2" />
                  Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-accent hover:text-primary transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Property Category
                  </label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Categories</option>
                    <option value="Nuvali Properties">Nuvali Properties</option>
                    <option value="Vermosa Properties">Vermosa Properties</option>
                    <option value="Southmont Properties">Southmont Properties</option>
                    <option value="Batangas Beach Properties">Batangas Beach Properties</option>
                    <option value="Pre-selling Properties">Pre-selling Properties</option>
                    <option value="Bank Foreclosed Properties">Bank Foreclosed Properties</option>
                  </select>
                </div>

                {/* Property Type Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    name="propertyType"
                    value={filters.propertyType}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Types</option>
                    <option value="House and Lot">House and Lot</option>
                    <option value="Condo">Condominium</option>
                    <option value="Lot">Lot Only</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      placeholder="Min Price"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder="Max Price"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{properties.length}</span> properties
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
              </div>
            ) : properties.length > 0 ? (
              <div ref={gridRef} className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 stagger-children ${gridVisible ? 'visible' : ''}`}>
                {properties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No properties found matching your criteria</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;
