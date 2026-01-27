import { useState, useEffect } from 'react';
import axios from 'axios';
import PropertyCard from './PropertyCard';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const FeaturedProperties = () => {
  const [titleRef, titleVisible] = useScrollAnimation();
  const [filterRef, filterVisible] = useScrollAnimation();
  const [gridRef, gridVisible] = useScrollAnimation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    'All',
    'Nuvali Properties',
    'Vermosa Properties',
    'Southmont Properties',
    'Batangas Beach Properties',
    'Pre-selling Properties',
    'Bank Foreclosed Properties'
  ];

  useEffect(() => {
    fetchProperties();
  }, [activeCategory]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const query = activeCategory !== 'All' ? `?category=${activeCategory}` : '';
      const response = await axios.get(`/api/properties${query}`);
      setProperties(response.data.slice(0, 6)); // Show only 6 properties
    } catch (error) {
      console.error('Error fetching properties:', error);
      // Use sample data if API fails
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
        description: 'Modern house and lot in a peaceful community',
        images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800'],
        propertyType: 'House and Lot',
        bedrooms: 3,
        bathrooms: 2,
        lotArea: 120
      },
      {
        _id: '2',
        name: 'Avida Veranda Vermosa',
        category: 'Vermosa Properties',
        location: 'Imus, Cavite',
        price: 3800000,
        description: 'Affordable house and lot with modern amenities',
        images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800'],
        propertyType: 'House and Lot',
        bedrooms: 2,
        bathrooms: 2,
        lotArea: 100
      },
      {
        _id: '3',
        name: 'Hillside Ridge Southmont',
        category: 'Southmont Properties',
        location: 'Daang Hari, Cavite',
        price: 5200000,
        description: 'Spacious property with mountain views',
        images: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800'],
        propertyType: 'House and Lot',
        bedrooms: 4,
        bathrooms: 3,
        lotArea: 150
      },
      {
        _id: '4',
        name: 'Paya Larga Seaside',
        category: 'Batangas Beach Properties',
        location: 'Laiya, Batangas',
        price: 8500000,
        description: 'Beachfront property with stunning ocean views',
        images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800'],
        propertyType: 'House and Lot',
        bedrooms: 4,
        bathrooms: 4,
        lotArea: 200
      },
      {
        _id: '5',
        name: 'The Spinnaker at Club Laiya',
        category: 'Batangas Beach Properties',
        location: 'San Juan, Batangas',
        price: 6200000,
        description: 'Resort-style living near the beach',
        images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800'],
        propertyType: 'House and Lot',
        bedrooms: 3,
        bathrooms: 3,
        lotArea: 130
      },
      {
        _id: '6',
        name: 'Pre-selling Condo Unit',
        category: 'Pre-selling Properties',
        location: 'Makati City',
        price: 7500000,
        description: 'Modern condominium in prime business district',
        images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800'],
        propertyType: 'Condo',
        bedrooms: 2,
        bathrooms: 2,
        floorArea: 65
      }
    ];
    
    if (activeCategory === 'All') {
      setProperties(sampleData);
    } else {
      setProperties(sampleData.filter(p => p.category === activeCategory));
    }
  };

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div ref={titleRef} className={`text-center mb-12 scroll-fade-up ${titleVisible ? 'visible' : ''}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Featured Properties</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our carefully selected properties across premium locations
          </p>
        </div>

        {/* Category Filter */}
        <div ref={filterRef} className={`flex flex-wrap justify-center gap-3 mb-12 scroll-fade-up ${filterVisible ? 'visible' : ''}`}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div ref={gridRef} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 stagger-children ${gridVisible ? 'visible' : ''}`}>
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>

            {properties.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No properties found in this category</p>
              </div>
            )}

            {properties.length > 0 && (
              <div className="text-center">
                <a href="/properties" className="btn-primary inline-block">
                  View All Properties
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
