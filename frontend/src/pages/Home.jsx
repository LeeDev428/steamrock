import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Hero from '../components/Hero';
import BookingForm from '../components/BookingForm';
import { AnimatedSection } from '../hooks/useScrollAnimation';
import { FaTree, FaWater, FaSun, FaMountain, FaMapMarkerAlt, FaArrowRight, FaCheckCircle } from 'react-icons/fa';

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
    { name: 'Parks',      icon: FaTree,     description: 'Nature-inspired communities' },
    { name: 'BeachTowns', icon: FaSun,      description: 'Coastal living destinations' },
    { name: 'Shores',     icon: FaWater,    description: 'Lakeside sanctuaries' },
    { name: 'Peaks',      icon: FaMountain, description: 'Mountain getaways' }
  ];

  const getProjectsByCategory = (category) =>
    projects.filter((p) => p.category === category);

  return (
    <div className="bg-white">
      <Hero />

      {/* Lifestyle Categories */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="container-custom">
          <AnimatedSection animation="fade-in-up" className="text-center mb-14">
            <span className="text-primary text-xs tracking-[0.3em] uppercase font-semibold">
              Our Portfolio
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-serif font-bold text-gray-900">
              Discover Your Ideal Lifestyle
            </h2>
          </AnimatedSection>

          <AnimatedSection animation="fade-in-up" delay={200}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 border border-gray-200">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  to={`/projects?category=${cat.name}`}
                  className="group flex flex-col items-center text-center p-10 bg-white hover:bg-primary transition-colors duration-300"
                >
                  <div className="w-12 h-12 flex items-center justify-center mb-5">
                    <cat.icon className="text-2xl text-primary group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-semibold text-base text-gray-900 group-hover:text-white transition-colors duration-300 mb-1">
                    {cat.name === 'BeachTowns' ? 'Beach Towns' : cat.name}
                  </h3>
                  <p className="text-xs text-gray-500 group-hover:text-white/80 transition-colors duration-300 leading-relaxed">
                    {cat.description}
                  </p>
                </Link>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* About */}
      <section className="py-24 bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <AnimatedSection animation="slide-in-left">
              <span className="text-primary text-xs tracking-[0.3em] uppercase font-semibold">
                About Streamrock
              </span>
              <h2 className="mt-4 text-3xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
                Building Dreams,<br />Creating Communities
              </h2>
              <p className="mt-6 text-gray-600 leading-relaxed text-lg">
                Streamrock Realty Corporation partners with the Philippines' most trusted developers
                to bring you premium properties in prime locations.
              </p>
              <ul className="mt-6 space-y-3">
                {['Prime locations across the Philippines', 'Trusted partnership with top developers', 'Personalized service and support'].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-700">
                    <FaCheckCircle className="text-primary mt-0.5 flex-shrink-0 text-sm" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/about"
                className="mt-8 inline-flex items-center gap-2 text-primary font-semibold border-b-2 border-primary pb-0.5 hover:gap-3 transition-all group"
              >
                Learn More <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
              </Link>
            </AnimatedSection>

            <AnimatedSection animation="slide-in-right" delay={200} className="relative">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800"
                  alt="Luxury Property"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary p-6 hidden md:block">
                <p className="text-3xl font-bold text-white">50+</p>
                <p className="text-sm text-white/80 mt-1">Projects</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Projects by Category */}
      {!loading && categories.map((cat) => {
        const categoryProjects = getProjectsByCategory(cat.name);
        if (categoryProjects.length === 0) return null;

        return (
          <section key={cat.name} className="py-20 bg-white">
            <div className="container-custom">
              <div className="flex items-end justify-between mb-10 pb-6 border-b border-gray-200">
                <div>
                  <span className="text-primary text-xs tracking-[0.3em] uppercase font-semibold">
                    {cat.name === 'BeachTowns' ? 'Beach Towns' : cat.name}
                  </span>
                  <h2 className="mt-2 text-2xl md:text-3xl font-serif font-bold text-gray-900">
                    {cat.description}
                  </h2>
                </div>
                <Link
                  to={`/projects?category=${cat.name}`}
                  className="hidden md:inline-flex items-center gap-2 text-sm text-primary font-medium hover:gap-3 transition-all group"
                >
                  View All <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryProjects.slice(0, 3).map((project) => (
                  <Link
                    key={project._id}
                    to={`/projects/${project.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 mb-4">
                      <img
                        src={project.cardImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-gray-900 group-hover:text-primary transition-colors mb-1">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1.5">
                      <FaMapMarkerAlt className="text-xs text-primary" />
                      {project.location?.city}, {project.location?.province}
                    </p>
                    {project.shortDescription && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {project.shortDescription}
                      </p>
                    )}
                  </Link>
                ))}
              </div>

              <div className="mt-10 text-center md:hidden">
                <Link
                  to={`/projects?category=${cat.name}`}
                  className="inline-flex items-center gap-2 text-sm text-primary font-medium border-b border-primary pb-0.5"
                >
                  View All {cat.name === 'BeachTowns' ? 'Beach Towns' : cat.name} <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </div>
          </section>
        );
      })}

      {/* Fallback: no category projects */}
      {!loading && projects.length > 0 && categories.every((c) => getProjectsByCategory(c.name).length === 0) && (
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="text-primary text-xs tracking-[0.3em] uppercase font-semibold">Featured</span>
              <h2 className="mt-3 text-3xl font-serif font-bold text-gray-900">Our Projects</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.slice(0, 6).map((project) => (
                <Link key={project._id} to={`/projects/${project.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden mb-4">
                    <img
                      src={project.cardImage || 'https://placehold.co/600x400?text=No+Image'}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{project.shortDescription}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 bg-primary">
        <div className="container-custom">
          <AnimatedSection animation="fade-in-up" className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
              Ready to Find Your Perfect Property?
            </h2>
            <p className="mt-6 text-lg text-white/80 leading-relaxed">
              Our team of experts is ready to help you discover your ideal home or investment opportunity.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/projects"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse Projects <FaArrowRight className="text-sm" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white text-white font-semibold hover:bg-white hover:text-primary transition-colors"
              >
                Contact Us <FaArrowRight className="text-sm" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Schedule a Viewing */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <AnimatedSection animation="fade-in-up" className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-primary text-sm tracking-[0.3em] uppercase font-medium">Book Now</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mt-2">
                Schedule a Property Viewing
              </h2>
              <p className="mt-4 text-gray-600">
                Fill out the form below and our team will get back to you to confirm your appointment.
              </p>
            </div>
            <BookingForm />
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Home;
