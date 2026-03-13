import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaChevronLeft, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { FiCheck } from 'react-icons/fi';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { componentHasContent, normalizeProjectForDisplay } from '../utils/projectContent';

const renderComponent = (component, sectionType, textColor) => {
  if (component.type === 'label') {
    return (
      <span className="text-primary text-sm tracking-[0.3em] uppercase font-medium">
        {component.content}
      </span>
    );
  }

  if (component.type === 'title') {
    return (
      <h2 className="text-3xl font-display font-bold" style={{ color: textColor }}>
        {component.content}
      </h2>
    );
  }

  if (component.type === 'subtitle') {
    return (
      <p className="text-lg leading-relaxed whitespace-pre-line" style={{ color: textColor, opacity: 0.82 }}>
        {component.content}
      </p>
    );
  }

  if (component.type === 'longText') {
    return (
      <div className="text-lg leading-relaxed whitespace-pre-line" style={{ color: textColor, opacity: 0.82 }}>
        {component.content}
      </div>
    );
  }

  if (component.type === 'bullets') {
    return (
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {component.items.filter(Boolean).map((item, index) => (
          <li key={`${item}-${index}`} className="flex items-start gap-3" style={{ color: textColor }}>
            <span className="mt-2 h-2 w-2 rounded-full bg-primary"></span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (component.type === 'checkedFeatures') {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {component.items.filter(Boolean).map((item, index) => (
          <div key={`${item}-${index}`} className="flex gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FiCheck className="h-5 w-5" />
            </div>
            <p className="font-medium" style={{ color: textColor }}>{item}</p>
          </div>
        ))}
      </div>
    );
  }

  if (component.type === 'images') {
    return (
      <div className={`grid gap-4 ${sectionType === 'gallery' ? 'sm:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-2'}`}>
        {component.images.filter((image) => image?.url).map((image) => (
          <div key={image.id || image.url} className="overflow-hidden rounded-xl bg-gray-100 shadow-sm">
            <img src={image.url} alt={image.alt || ''} className="h-64 w-full object-cover" />
          </div>
        ))}
      </div>
    );
  }

  return null;
};

const getSectionClasses = (sectionType) => {
  if (sectionType === 'gallery') {
    return 'space-y-8';
  }

  if (sectionType === 'features') {
    return 'space-y-6';
  }

  return 'space-y-5';
};

const getYoutubeEmbedUrl = (url = '') => {
  const normalizedUrl = url.trim();
  if (!normalizedUrl) return '';

  const patterns = [
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/
  ];

  for (const pattern of patterns) {
    const match = normalizedUrl.match(pattern);
    if (match?.[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }

  return '';
};

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const [contentRef, contentVisible] = useScrollAnimation();
  const [sidebarRef, sidebarVisible] = useScrollAnimation();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`/projects/${slug}`);
        setProject(normalizeProjectForDisplay(res.data));
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
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

  const visibleSections = project.sections.filter((section) =>
    Array.isArray(section.components) && section.components.some(componentHasContent)
  );
  const projectVideoEmbedUrl = getYoutubeEmbedUrl(project.youtubeUrl || '');

  return (
    <div>
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
              <p className="max-w-2xl whitespace-pre-line text-xl text-white/80 animate-fade-in-delay-3">
                {project.hero.subtitle}
              </p>
            )}
            <p className="mt-4 flex items-center gap-2 text-white/70 animate-fade-in-delay-4">
              <FaMapMarkerAlt />
              {project.location?.city}, {project.location?.province}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 py-6 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div>
              <p className="mb-1 text-sm uppercase tracking-wide text-gray-400">Developer</p>
              <p className="font-semibold">{project.contractor?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="mb-1 text-sm uppercase tracking-wide text-gray-400">Property Type</p>
              <p className="font-semibold">{project.propertyType}</p>
            </div>
            {project.lotSizeRange?.min && (
              <div>
                <p className="mb-1 text-sm uppercase tracking-wide text-gray-400">Lot Size</p>
                <p className="font-semibold">
                  {project.lotSizeRange.min} - {project.lotSizeRange.max} {project.lotSizeRange.unit}
                </p>
              </div>
            )}
            {project.totalArea?.value && (
              <div>
                <p className="mb-1 text-sm uppercase tracking-wide text-gray-400">Total Area</p>
                <p className="font-semibold">
                  {project.totalArea.value} {project.totalArea.unit}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div ref={contentRef} className={`space-y-16 lg:col-span-2 scroll-fade-up ${contentVisible ? 'visible' : ''}`}>
              {visibleSections.map((section) => {
                const paddedSection = section.backgroundColor && section.backgroundColor !== '#ffffff';

                return (
                  <section
                    key={section.id || `${section.sectionType}-${section.order}`}
                    className={`${getSectionClasses(section.sectionType)} ${paddedSection ? 'rounded-2xl px-6 py-8 md:px-8' : ''}`}
                    style={{
                      backgroundColor: section.backgroundColor || '#ffffff'
                    }}
                  >
                    {section.components.filter(componentHasContent).map((component) => (
                      <div key={component.id || `${component.type}-${component.content || component.items?.join('-')}`}>
                        {renderComponent(component, section.sectionType, section.textColor || '#1a202c')}
                      </div>
                    ))}
                  </section>
                );
              })}
            </div>

            <div ref={sidebarRef} className={`lg:col-span-1 scroll-fade-up ${sidebarVisible ? 'visible' : ''}`}>
              <div className="sticky top-24 space-y-6">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">Interested in this project?</h3>
                  <p className="mb-6 text-sm text-gray-600">
                    Get in touch with our team for more information, site visits, or investment opportunities.
                  </p>
                  <div className="space-y-3">
                    <a
                      href="tel:+639123456789"
                      className="flex items-center gap-3 text-gray-600 transition-colors hover:text-primary"
                    >
                      <FaPhone className="text-primary" />
                      +63 912 345 6789
                    </a>
                    <a
                      href="mailto:dwllaneta@gmail.com"
                      className="flex items-center gap-3 text-gray-600 transition-colors hover:text-primary"
                    >
                      <FaEnvelope className="text-primary" />
                      dwllaneta@gmail.com
                    </a>
                  </div>
                  <Link
                    to="/contact"
                    className="mt-6 block w-full rounded bg-primary py-3 text-center font-semibold text-white transition-colors hover:bg-secondary"
                  >
                    Schedule a Visit
                  </Link>
                </div>

                {projectVideoEmbedUrl && (
                  <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="px-6 py-4">
                      <h3 className="text-lg font-semibold text-gray-900">Project Video</h3>
                    </div>
                    <iframe
                      src={projectVideoEmbedUrl}
                      title={`${project.name} video`}
                      className="h-64 w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                {project.priceRange?.min && (
                  <div className="rounded-lg bg-gray-50 p-6">
                    <p className="mb-2 text-sm uppercase tracking-wide text-gray-500">Starting From</p>
                    <p className="text-2xl font-bold text-primary">
                      ₱{(project.priceRange.min / 1000000).toFixed(1)}M
                    </p>
                    {project.priceRange.max && (
                      <p className="mt-1 text-sm text-gray-500">
                        up to ₱{(project.priceRange.max / 1000000).toFixed(1)}M
                      </p>
                    )}
                  </div>
                )}

                <div className="rounded-lg bg-gray-50 p-6">
                  <h3 className="mb-3 font-semibold text-gray-900">Location</h3>
                  <p className="text-sm text-gray-600">
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

      <div className="border-t border-gray-200 py-8">
        <div className="container-custom">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-primary hover:text-secondary"
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