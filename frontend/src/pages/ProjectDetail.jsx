import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaRuler, FaMoneyBillWave, FaChevronLeft, FaChevronRight, FaPhone, FaEnvelope } from 'react-icons/fa';
import { FiCheck } from 'react-icons/fi';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  // Hooks must be called unconditionally (before any returns)
  const [aboutRef, aboutVisible] = useScrollAnimation();
  const [featuresRef, featuresVisible] = useScrollAnimation();
  const [galleryRef, galleryVisible] = useScrollAnimation();
  const [sidebarRef, sidebarVisible] = useScrollAnimation();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`/projects/${slug}`);
        setProject(res.data);
      } catch (error) {
        console.error('Error fetching project:', error);
      }
      setLoading(false);
    };
    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Project Not Found</h1>
        <Link to="/projects" className="text-primary hover:text-secondary">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  // Combine hero image and gallery for image viewer
  const allImages = [
    project.hero?.image,
    project.cardImage,
    ...(project.gallery?.map(g => g.url) || [])
  ].filter(Boolean);

  const prevImage = () => setCurrentImage((prev) => (prev - 1 + allImages.length) % allImages.length);
  const nextImage = () => setCurrentImage((prev) => (prev + 1) % allImages.length);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[70vh] min-h-[500px]">
        {project.hero?.image ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${project.hero.image})` }}
          />
        ) : project.cardImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${project.cardImage})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 pb-16">
          <div className="container-custom">
            <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-medium tracking-wide uppercase mb-4 animate-fade-in-delay-1">
              {project.category === 'BeachTowns' ? 'Beach Towns' : project.category}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 animate-fade-in-delay-2">
              {project.hero?.title || project.name}
            </h1>
            {project.hero?.subtitle && (
              <p className="text-xl text-white/80 max-w-2xl animate-fade-in-delay-3">{project.hero.subtitle}</p>
            )}
            <p className="text-white/70 flex items-center gap-2 mt-4 animate-fade-in-delay-4">
              <FaMapMarkerAlt />
              {project.location?.city}, {project.location?.province}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Info Bar */}
      <div className="bg-gray-900 text-white py-6">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wide mb-1">Developer</p>
              <p className="font-semibold">{project.contractor?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wide mb-1">Property Type</p>
              <p className="font-semibold">{project.propertyType}</p>
            </div>
            {project.lotSizeRange?.min && (
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wide mb-1">Lot Size</p>
                <p className="font-semibold">
                  {project.lotSizeRange.min} - {project.lotSizeRange.max} {project.lotSizeRange.unit}
                </p>
              </div>
            )}
            {project.totalArea?.value && (
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wide mb-1">Total Area</p>
                <p className="font-semibold">
                  {project.totalArea.value} {project.totalArea.unit}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-16">
              {/* About */}
              {project.shortDescription && (
                <section ref={aboutRef} className={`scroll-fade-up ${aboutVisible ? 'visible' : ''}`}>
                  <span className="text-primary text-sm tracking-[0.3em] uppercase font-medium">About</span>
                  <h2 className="text-3xl font-display font-bold text-gray-900 mt-2 mb-6">
                    Discover {project.name}
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {project.shortDescription}
                  </p>
                </section>
              )}

              {/* Dynamic Sections */}
              {project.sections?.map((section, index) => (
                <section 
                  key={index}
                  style={{ 
                    backgroundColor: section.backgroundColor,
                    color: section.textColor 
                  }}
                  className={section.backgroundColor !== '#ffffff' ? 'p-8 -mx-8 rounded-lg' : ''}
                >
                  {section.label && (
                    <span className="text-primary text-sm tracking-[0.3em] uppercase font-medium">
                      {section.label}
                    </span>
                  )}
                  {section.title && (
                    <h2 className="text-3xl font-display font-bold mt-2 mb-6">
                      {section.title}
                    </h2>
                  )}
                  {section.description && (
                    <p className="leading-relaxed text-lg opacity-80">
                      {section.description}
                    </p>
                  )}
                  {section.features?.length > 0 && (
                    <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {section.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.images?.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      {section.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt=""
                          className="w-full aspect-video object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </section>
              ))}

              {/* Features & Amenities */}
              {project.features?.length > 0 && (
                <section ref={featuresRef} className={`scroll-fade-up ${featuresVisible ? 'visible' : ''}`}>
                  <span className="text-primary text-sm tracking-[0.3em] uppercase font-medium">Amenities</span>
                  <h2 className="text-3xl font-display font-bold text-gray-900 mt-2 mb-8">
                    Features & Amenities
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.features.map((feature, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FiCheck className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Gallery */}
              {allImages.length > 0 && (
                <section ref={galleryRef} className={`scroll-fade-up ${galleryVisible ? 'visible' : ''}`}>
                  <span className="text-primary text-sm tracking-[0.3em] uppercase font-medium">Gallery</span>
                  <h2 className="text-3xl font-display font-bold text-gray-900 mt-2 mb-8">
                    Project Gallery
                  </h2>
                  <div className="relative">
                    <div className="aspect-video overflow-hidden rounded-lg">
                      <img
                        src={allImages[currentImage]}
                        alt={`${project.name} - Image ${currentImage + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {allImages.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow"
                        >
                          <FaChevronLeft />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow"
                        >
                          <FaChevronRight />
                        </button>
                        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                          {allImages.map((img, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImage(index)}
                              className={`flex-shrink-0 w-20 h-14 rounded overflow-hidden border-2 transition-colors ${
                                index === currentImage ? 'border-primary' : 'border-transparent'
                              }`}
                            >
                              <img
                                src={img}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div ref={sidebarRef} className={`lg:col-span-1 scroll-fade-up ${sidebarVisible ? 'visible' : ''}`}>
              <div className="sticky top-24 space-y-6">
                {/* Inquiry Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Interested in this project?
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Get in touch with our team for more information, site visits, or investment opportunities.
                  </p>
                  <div className="space-y-3">
                    <a
                      href="tel:+639123456789"
                      className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors"
                    >
                      <FaPhone className="text-primary" />
                      +63 912 345 6789
                    </a>
                    <a
                      href="mailto:dwllaneta@gmail.com"
                      className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors"
                    >
                      <FaEnvelope className="text-primary" />
                      dwllaneta@gmail.com

                    </a>
                  </div>
                  <Link
                    to="/contact"
                    className="block w-full text-center bg-primary text-white font-semibold py-3 rounded mt-6 hover:bg-secondary transition-colors"
                  >
                    Schedule a Visit
                  </Link>
                </div>

                {/* Price Range */}
                {project.priceRange?.min && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-500 text-sm uppercase tracking-wide mb-2">Starting From</p>
                    <p className="text-2xl font-bold text-primary">
                      ₱{(project.priceRange.min / 1000000).toFixed(1)}M
                    </p>
                    {project.priceRange.max && (
                      <p className="text-gray-500 text-sm mt-1">
                        up to ₱{(project.priceRange.max / 1000000).toFixed(1)}M
                      </p>
                    )}
                  </div>
                )}

                {/* Location */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Location</h3>
                  <p className="text-gray-600 text-sm">
                    {project.location?.street && `${project.location.street}, `}
                    {project.location?.barangay && `${project.location.barangay}, `}
                    {project.location?.city}, {project.location?.province}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Projects */}
      <div className="border-t border-gray-200 py-8">
        <div className="container-custom">
          <Link
            to="/projects"
            className="text-primary hover:text-secondary inline-flex items-center gap-2"
          >
            <FaChevronLeft className="text-sm" />
            Back to All Projects
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
