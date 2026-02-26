import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Hero from '../components/Hero';
import { FaTree, FaWater, FaSun, FaMountain, FaMapMarkerAlt, FaArrowRight, FaBuilding, FaCheckCircle } from 'react-icons/fa';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('/projects?status=Published');
        const projectsData = Array.isArray(res.data) ? res.data : (res.data.data || []);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

  const categories = [
    { 
      name: 'Parks', 
      icon: FaTree, 
      color: 'from-green-500 to-green-600', 
      bgSolid: 'bg-green-50',
      textColor: 'text-green-700',
      description: 'Nature-inspired communities' 
    },
    { 
      name: 'BeachTowns', 
      icon: FaSun, 
      color: 'from-amber-400 to-orange-500', 
      bgSolid: 'bg-orange-50',
      textColor: 'text-orange-700',
      description: 'Coastal living destinations' 
    },
    { 
      name: 'Shores', 
      icon: FaWater, 
      color: 'from-cyan-400 to-blue-500', 
      bgSolid: 'bg-blue-50',
      textColor: 'text-blue-700',
      description: 'Lakeside sanctuaries' 
    },
    { 
      name: 'Peaks', 
      icon: FaMountain, 
      color: 'from-purple-500 to-indigo-600', 
      bgSolid: 'bg-purple-50',
      textColor: 'text-purple-700',
      description: 'Mountain getaways' 
    }
  ];

  const getProjectsByCategory = (category) => {
    return projects.filter(p => p.category === category);
  };

  return (
    <div className="bg-white">
      <Hero />
      
      {/* Feature Icons Row - Enhanced Landco.ph Style */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Discover Your Ideal Lifestyle
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our curated collection of premium properties across diverse locations
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link 
                key={cat.name}
                to={`/projects?category=${cat.name}`}
                className="group relative overflow-hidden bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary/20"
              >
                <div className="relative z-10">
                  <div className={`w-20 h-20 bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <cat.icon className="text-white text-3xl" />
                  </div>
                  <h3 className="font-semibold text-xl text-gray-900 mb-2 text-center">
                    {cat.name === 'BeachTowns' ? 'Beach Towns' : cat.name}
                  </h3>
                  <p className="text-sm text-gray-600 text-center leading-relaxed">{cat.description}</p>
                </div>
                <div className={`absolute inset-0 ${cat.bgSolid} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase rounded-full mb-6">
                About Streamrock
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                Building Dreams,<br/>
                Creating Communities
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                Streamrock Realty Corporation partners with the Philippines' most trusted developers 
                to bring you premium properties in prime locations.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-primary mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Prime locations across the Philippines</p>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-primary mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Trusted partnership with top developers</p>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-primary mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Personalized service and support</p>
                </div>
              </div>
              <Link 
                to="/about"
                className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white px-8 py-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                Learn More <FaArrowRight className="text-sm" />
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800" 
                  alt="Luxury Property" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl hidden md:block">
                <div className="flex items-center gap-4">
                  <FaBuilding className="text-primary text-3xl" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">50+</p>
                    <p className="text-sm text-gray-600">Projects</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid by Category */}
      {categories.map((cat) => {
        const categoryProjects = getProjectsByCategory(cat.name);
        if (categoryProjects.length === 0) return null;

        return (
          <section key={cat.name} className="py-24 bg-gradient-to-b from-gray-50 to-white">
            <div className="container-custom">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <span className={`inline-block px-4 py-1.5 ${cat.bgSolid} ${cat.textColor} text-xs font-semibold tracking-wider uppercase rounded-full mb-4`}>
                    {cat.name === 'BeachTowns' ? 'Beach Towns' : cat.name}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
                    {cat.description}
                  </h2>
                </div>
                <Link
                  to={`/projects?category=${cat.name}`}
                  className="hidden md:inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all group"
                >
                  View All <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryProjects.slice(0, 3).map((project) => (
                  <Link
                    key={project._id}
                    to={`/projects/${project.slug}`}
                    className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <img
                        src={project.cardImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="inline-block px-3 py-1 bg-white/90 text-primary text-xs font-semibold rounded-full">
                          {project.contractor?.name || 'Premium'}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center gap-2 mb-3">
                        <FaMapMarkerAlt className="text-primary" />
                        <span>{project.location?.city}, {project.location?.province}</span>
                      </p>
                      {project.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link
                  to={`/projects?category=${cat.name}`}
                  className="inline-flex items-center gap-2 bg-white border-2 border-primary text-primary px-8 py-4 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-lg group"
                >
                  View All {cat.name === 'BeachTowns' ? 'Beach Towns' : cat.name} <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
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
      <section className="py-24 bg-gradient-to-br from-primary via-secondary to-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
              Ready to Find Your Perfect Property?
            </h2>
            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              Our team of experts is ready to help you discover your ideal home or investment opportunity.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/projects"
                className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-primary font-bold rounded-lg hover:bg-gray-50 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 duration-300"
              >
                Browse Projects <FaArrowRight />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-10 py-5 border-3 border-white text-white font-bold rounded-lg hover:bg-white hover:text-primary transition-all shadow-lg hover:shadow-2xl hover:scale-105 duration-300"
              >
                Contact Us <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
