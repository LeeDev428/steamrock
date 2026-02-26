import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaFilter, FaTimes } from 'react-icons/fa';

const Projects = () => {
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    category: searchParams.get('category') || ''
  });

  const categories = [
    { value: '', label: 'All Projects' },
    { value: 'Parks', label: 'Parks' },
    { value: 'BeachTowns', label: 'Beach Towns' },
    { value: 'Shores', label: 'Shores' },
    { value: 'Peaks', label: 'Peaks' }
  ];

  useEffect(() => {
    setFilter({ category: searchParams.get('category') || '' });
  }, [searchParams]);

  useEffect(() => {
    fetchProjects();
  }, [filter]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('status', 'Published');
      if (filter.category) params.append('category', filter.category);
      
      const res = await axios.get(`/projects?${params.toString()}`);
      setProjects(res.data.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
    setLoading(false);
  };

  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <div className="bg-gray-50 py-16">
        <div className="container-custom">
          <span className="text-primary text-sm tracking-[0.3em] uppercase font-medium">
            Our Portfolio
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mt-4">
            {filter.category 
              ? (filter.category === 'BeachTowns' ? 'Beach Towns' : filter.category)
              : 'All Projects'}
          </h1>
          {filter.category && (
            <p className="text-gray-600 mt-4 max-w-2xl">
              {filter.category === 'Parks' && 'Discover our nature-inspired communities perfect for families and nature lovers.'}
              {filter.category === 'BeachTowns' && 'Experience coastal living at its finest with our beachfront developments.'}
              {filter.category === 'Shores' && 'Find your lakeside retreat with stunning waterfront properties.'}
              {filter.category === 'Peaks' && 'Escape to the highlands with our mountain hideaway properties.'}
            </p>
          )}
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-12 pb-8 border-b border-gray-200">
          <span className="text-gray-500 flex items-center gap-2">
            <FaFilter className="text-sm" /> Filter by:
          </span>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilter({ category: cat.value })}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter.category === cat.value
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          {filter.category && (
            <button
              onClick={() => setFilter({ category: '' })}
              className="ml-auto text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <FaTimes /> Clear filter
            </button>
          )}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">No projects found</p>
            {filter.category && (
              <button
                onClick={() => setFilter({ category: '' })}
                className="text-primary hover:text-secondary"
              >
                View all projects
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link
                key={project._id}
                to={`/projects/${project.slug}`}
                className="group"
              >
                <div className="relative aspect-[4/3] overflow-hidden mb-4">
                  <img
                    src={project.cardImage || 'https://placehold.co/600x400?text=No+Image'}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 text-xs font-medium text-gray-700 rounded">
                      {project.category === 'BeachTowns' ? 'Beach Towns' : project.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                    <FaMapMarkerAlt className="text-xs text-primary" />
                    {project.location?.city}, {project.location?.province}
                  </p>
                  {project.shortDescription && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {project.shortDescription}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                      {project.contractor?.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {project.propertyType}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
