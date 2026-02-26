import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Hero from '../components/Hero';
import { FaTree, FaWater, FaSun, FaMountain, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('/projects?status=Published');
        setProjects(res.data.data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

  const categories = [
    { name: 'Parks', icon: FaTree, color: 'bg-green-600', description: 'Nature-inspired living' },
    { name: 'BeachTowns', icon: FaSun, color: 'bg-yellow-500', description: 'Coastal paradise' },
    { name: 'Shores', icon: FaWater, color: 'bg-blue-500', description: 'Lakeside retreats' },
    { name: 'Peaks', icon: FaMountain, color: 'bg-gray-700', description: 'Mountain escapes' }
  ];

  const getProjectsByCategory = (category) => {
    return projects.filter(p => p.category === category);
  };

  return (
    <div>
      <Hero />
      
      {/* Feature Icons Row - Like Landco.ph */}
      <section className="py-16 border-b border-gray-100">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {categories.map((cat) => (
              <Link 
                key={cat.name}
                to={`/projects?category=${cat.name}`}
                className="group text-center"
              >
                <div className={`w-16 h-16 ${cat.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <cat.icon className="text-white text-2xl" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  {cat.name === 'BeachTowns' ? 'Beach Towns' : cat.name}
                </h3>
                <p className="text-sm text-gray-500">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary text-sm tracking-[0.3em] uppercase font-medium">About Us</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mt-4 mb-6">
              Building Dreams, Creating Communities
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Streamrock Realty Corporation partners with the Philippines' most trusted developers 
              to bring you premium properties in prime locations. From serene parks to pristine beaches, 
              we help you find the perfect place to call home.
            </p>
            <Link 
              to="/about"
              className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
            >
              Learn More <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Projects Grid by Category */}
      {categories.map((cat) => {
        const categoryProjects = getProjectsByCategory(cat.name);
        if (categoryProjects.length === 0) return null;

        return (
          <section key={cat.name} className="py-20">
            <div className="container-custom">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <span className="text-primary text-sm tracking-[0.3em] uppercase font-medium">
                    {cat.name === 'BeachTowns' ? 'Beach Towns' : cat.name}
                  </span>
                  <h2 className="text-3xl font-display font-bold text-gray-900 mt-2">
                    {cat.description}
                  </h2>
                </div>
                <Link
                  to={`/projects?category=${cat.name}`}
                  className="hidden md:inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                >
                  View All <FaArrowRight />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryProjects.slice(0, 3).map((project) => (
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <FaMapMarkerAlt className="text-xs" />
                          {project.location?.city}, {project.location?.province}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 uppercase tracking-wide">
                        {project.contractor?.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <Link
                to={`/projects?category=${cat.name}`}
                className="md:hidden mt-8 inline-flex items-center gap-2 text-primary font-medium"
              >
                View All {cat.name === 'BeachTowns' ? 'Beach Towns' : cat.name} <FaArrowRight />
              </Link>
            </div>
          </section>
        );
      })}

      {/* Featured/All Projects Section (if no category projects) */}
      {projects.length > 0 && categories.every(cat => getProjectsByCategory(cat.name).length === 0) && (
        <section className="py-20">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="text-primary text-sm tracking-[0.3em] uppercase font-medium">Featured</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mt-4">
                Our Projects
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.slice(0, 6).map((project) => (
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
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-500">{project.shortDescription}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Ready to Find Your Perfect Property?
            </h2>
            <p className="text-white/80 mb-8">
              Our team of experts is ready to help you discover your ideal home or investment opportunity.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/projects"
                className="px-8 py-4 bg-white text-primary font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse Projects
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
