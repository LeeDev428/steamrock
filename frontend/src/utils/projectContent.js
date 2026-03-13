export const SECTION_TYPE_LABELS = {
  intro: 'Intro Section',
  about: 'About Section',
  explore: 'Explore Section',
  features: 'Features & Amenities',
  gallery: 'Gallery Section',
  custom: 'Custom Section'
};

export const COMPONENT_TYPE_OPTIONS = [
  { value: 'label', label: 'Section Label' },
  { value: 'title', label: 'Section Title' },
  { value: 'subtitle', label: 'Section Subtitle' },
  { value: 'longText', label: 'Long Text' },
  { value: 'bullets', label: 'Bullets' },
  { value: 'checkedFeatures', label: 'Checked Bullets' },
  { value: 'images', label: 'Images' }
];

const SECTION_DEFAULT_COMPONENTS = {
  intro: ['title', 'subtitle'],
  about: ['title', 'longText'],
  explore: ['title', 'subtitle', 'bullets'],
  features: ['title', 'subtitle', 'checkedFeatures'],
  gallery: ['title', 'images'],
  custom: ['label', 'title', 'subtitle', 'bullets', 'images']
};

const createId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;

const asString = (value) => (typeof value === 'string' ? value : '');

const normalizeImage = (image, index) => {
  if (typeof image === 'string') {
    return {
      id: createId('image'),
      url: image,
      caption: '',
      alt: '',
      order: index
    };
  }

  if (!image || typeof image !== 'object' || !image.url) {
    return null;
  }

  return {
    id: image.id || createId('image'),
    url: image.url,
    caption: image.caption || '',
    alt: image.alt || '',
    order: typeof image.order === 'number' ? image.order : index
  };
};

const normalizeListItems = (items) => {
  if (!Array.isArray(items)) {
    return [''];
  }

  const normalizedItems = items
    .map((item) => asString(typeof item === 'string' ? item : item?.title || item?.content || item?.value).trim())
    .filter(Boolean);

  return normalizedItems.length > 0 ? normalizedItems : [''];
};

export const componentHasContent = (component = {}) => {
  if (component.type === 'images') {
    return Array.isArray(component.images) && component.images.some((image) => image?.url);
  }

  if (component.type === 'bullets' || component.type === 'checkedFeatures') {
    return Array.isArray(component.items) && component.items.some((item) => asString(item).trim());
  }

  return Boolean(asString(component.content).trim());
};

export const createComponent = (type, overrides = {}) => {
  if (type === 'images') {
    return {
      id: overrides.id || createId('component'),
      type,
      content: '',
      items: [],
      images: (overrides.images || []).map(normalizeImage).filter(Boolean)
    };
  }

  if (type === 'bullets' || type === 'checkedFeatures') {
    return {
      id: overrides.id || createId('component'),
      type,
      content: '',
      items: normalizeListItems(overrides.items),
      images: []
    };
  }

  return {
    id: overrides.id || createId('component'),
    type,
    content: overrides.content || '',
    items: [],
    images: []
  };
};

const buildLegacyComponents = (section) => {
  const components = [];

  if (section.label) {
    components.push(createComponent('label', { content: section.label }));
  }

  if (section.title) {
    components.push(createComponent('title', { content: section.title }));
  }

  if (section.subtitle) {
    components.push(createComponent('subtitle', { content: section.subtitle }));
  }

  if (section.description) {
    components.push(createComponent('longText', { content: section.description }));
  }

  if (Array.isArray(section.features) && section.features.length > 0) {
    components.push(createComponent(section.type === 'features' ? 'checkedFeatures' : 'bullets', {
      items: section.features
    }));
  }

  if (Array.isArray(section.images) && section.images.length > 0) {
    components.push(createComponent('images', {
      images: section.images.map((image) => (typeof image === 'string' ? { url: image } : image))
    }));
  }

  return components.length > 0 ? components : [createComponent('title')];
};

export const normalizeSection = (section, index = 0) => {
  const sectionType = section.sectionType || section.type || 'custom';
  const components = Array.isArray(section.components) && section.components.length > 0
    ? section.components.map((component) => {
        if (component.type === 'images') {
          return createComponent('images', {
            id: component.id,
            images: component.images
          });
        }

        if (component.type === 'bullets' || component.type === 'checkedFeatures') {
          return createComponent(component.type, {
            id: component.id,
            items: component.items
          });
        }

        return createComponent(component.type || 'title', {
          id: component.id,
          content: component.content || component.value || component.text || ''
        });
      })
    : buildLegacyComponents(section);

  return {
    id: section.id || createId('section'),
    type: section.type || sectionType,
    sectionType,
    order: typeof section.order === 'number' ? section.order : index,
    backgroundColor: section.backgroundColor || '#ffffff',
    textColor: section.textColor || '#1a202c',
    components
  };
};

export const createSection = (sectionType = 'custom', overrides = {}) => ({
  id: overrides.id || createId('section'),
  sectionType,
  order: typeof overrides.order === 'number' ? overrides.order : 0,
  components: overrides.components || SECTION_DEFAULT_COMPONENTS[sectionType].map((componentType) => createComponent(componentType))
});

const buildDerivedSections = (project) => {
  const sections = [];

  if (project.shortDescription) {
    sections.push(createSection('about', {
      components: [
        createComponent('title', { content: `About ${project.name || 'This Project'}` }),
        createComponent('longText', { content: project.shortDescription })
      ]
    }));
  }

  if (Array.isArray(project.features) && project.features.length > 0) {
    sections.push(createSection('features', {
      components: [
        createComponent('title', { content: 'Features & Amenities' }),
        createComponent('checkedFeatures', {
          items: project.features.map((feature) => typeof feature === 'string' ? feature : feature.title || feature.description || '')
        })
      ]
    }));
  }

  if (Array.isArray(project.gallery) && project.gallery.length > 0) {
    sections.push(createSection('gallery', {
      components: [
        createComponent('title', { content: 'Project Gallery' }),
        createComponent('images', {
          images: project.gallery.map((image) => typeof image === 'string' ? { url: image } : image)
        })
      ]
    }));
  }

  return sections;
};

export const createDefaultProjectFormData = () => ({
  name: '',
  category: 'Parks',
  contractor: '',
  location: '',
  propertyType: 'Residential',
  lotSizeRange: { min: '', max: '', unit: 'sqm' },
  totalArea: { value: '', unit: 'Hectares' },
  priceRange: { min: '', max: '', currency: 'PHP' },
  hero: { image: '', video: '', title: '', subtitle: '' },
  youtubeUrl: '',
  cardImage: '',
  shortDescription: '',
  sections: [
    createSection('intro'),
    createSection('about'),
    createSection('explore'),
    createSection('features'),
    createSection('gallery')
  ],
  status: 'Draft',
  featured: false
});

export const normalizeProjectForForm = (project = {}) => {
  const defaults = createDefaultProjectFormData();
  const normalizedSections = Array.isArray(project.sections) && project.sections.length > 0
    ? project.sections.map(normalizeSection).sort((left, right) => left.order - right.order)
    : buildDerivedSections(project);

  return {
    ...defaults,
    ...project,
    contractor: project.contractor?._id || project.contractor || '',
    location: project.location?._id || project.location || '',
    lotSizeRange: {
      ...defaults.lotSizeRange,
      ...project.lotSizeRange
    },
    totalArea: {
      ...defaults.totalArea,
      ...project.totalArea
    },
    priceRange: {
      ...defaults.priceRange,
      ...project.priceRange
    },
    hero: {
      ...defaults.hero,
      ...project.hero,
      title: project.hero?.title || project.name || ''
    },
    youtubeUrl: project.youtubeUrl || '',
    cardImage: project.cardImage || project.hero?.image || '',
    shortDescription: project.shortDescription || '',
    sections: normalizedSections.length > 0 ? normalizedSections : defaults.sections
  };
};

export const normalizeProjectForDisplay = (project = {}) => {
  const sections = Array.isArray(project.sections) && project.sections.length > 0
    ? project.sections.map(normalizeSection).sort((left, right) => left.order - right.order)
    : buildDerivedSections(project);

  return {
    ...project,
    hero: {
      image: project.hero?.image || project.cardImage || '',
      video: project.hero?.video || '',
      title: project.hero?.title || project.name || '',
      subtitle: project.hero?.subtitle || ''
    },
    youtubeUrl: project.youtubeUrl || '',
    sections
  };
};

export const getComponentTypeLabel = (type) => {
  const match = COMPONENT_TYPE_OPTIONS.find((option) => option.value === type);
  return match?.label || 'Component';
};