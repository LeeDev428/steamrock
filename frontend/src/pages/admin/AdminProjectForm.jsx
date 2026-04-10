import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  FiArrowDown,
  FiArrowUp,
  FiImage,
  FiPlus,
  FiSave,
  FiTrash2,
  FiX
} from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import { useToast } from '../../components/Toast';
import ImageDropzone from '../../components/admin/ImageDropzone';
import {
  COMPONENT_TYPE_OPTIONS,
  SECTION_TYPE_LABELS,
  createComponent,
  createDefaultProjectFormData,
  createSection,
  getComponentTypeLabel,
  normalizeProjectForForm
} from '../../utils/projectContent';

const categories = ['Parks', 'BeachTowns', 'Shores', 'Peaks'];
const propertyTypes = ['Residential', 'Commercial', 'Mixed-Use', 'Resort', 'Farm Lot'];
const defaultSectionTypeOptions = ['intro', 'about', 'explore', 'features', 'gallery'];

const moveItem = (items, fromIndex, toIndex) => {
  if (toIndex < 0 || toIndex >= items.length) {
    return items;
  }

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);

  return nextItems;
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

const AdminProjectForm = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [contractors, setContractors] = useState([]);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState(() => createDefaultProjectFormData());
  const [componentDrafts, setComponentDrafts] = useState({});
  const [pendingCardImages, setPendingCardImages] = useState([]);
  const [pendingHeroImages, setPendingHeroImages] = useState([]);
  const [pendingComponentImages, setPendingComponentImages] = useState({});
  const [sectionAddMode, setSectionAddMode] = useState('default');
  const [defaultSectionType, setDefaultSectionType] = useState('intro');

  useEffect(() => {
    fetchOptions();

    if (isEditing) {
      fetchProject();
      return;
    }

    setLoading(false);
  }, [id]);

  const fetchOptions = async () => {
    try {
      const [contractorsRes, locationsRes] = await Promise.all([
        axios.get('/contractors'),
        axios.get('/locations')
      ]);

      setContractors(Array.isArray(contractorsRes.data) ? contractorsRes.data : []);
      setLocations(Array.isArray(locationsRes.data) ? locationsRes.data : []);
    } catch (error) {
      console.error('Error fetching options:', error);
      toast.error('Failed to load project options');
    }
  };

  const fetchProject = async () => {
    try {
      const res = await axios.get(`/projects/${id}`);
      setFormData(normalizeProjectForForm(res.data));
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Failed to load project');
      navigate('/admin/projects');
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (updater) => {
    setFormData((current) => (typeof updater === 'function' ? updater(current) : updater));
  };

  const handleInputChange = (event) => {
    const { checked, name, type, value } = event.target;

    updateForm((current) => {
      if (name === 'name') {
        const shouldSyncHeroTitle = !current.hero.title || current.hero.title === current.name;

        return {
          ...current,
          name: value,
          hero: {
            ...current.hero,
            title: shouldSyncHeroTitle ? value : current.hero.title
          }
        };
      }

      return {
        ...current,
        [name]: type === 'checkbox' ? checked : value
      };
    });
  };

  const handleNestedChange = (parent, field, value) => {
    updateForm((current) => ({
      ...current,
      [parent]: {
        ...current[parent],
        [field]: value
      }
    }));
  };

  const uploadSingleImage = async (file) => {
    const uploadData = new FormData();
    uploadData.append('file', file);

    const query = new URLSearchParams({
      type: 'projects',
      category: formData.category || '',
      entity: formData.name || 'untitled-project',
      field: 'project-image'
    });

    const response = await axios.post(`/upload?${query.toString()}`, uploadData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data.url;
  };

  const uploadMultipleImages = async (files) => {
    const uploadData = new FormData();

    files.forEach((file) => {
      uploadData.append('files', file);
    });

    const query = new URLSearchParams({
      type: 'projects',
      category: formData.category || '',
      entity: formData.name || 'untitled-project',
      field: 'section-gallery'
    });

    const response = await axios.post(`/upload/multiple?${query.toString()}`, uploadData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return Array.isArray(response.data.files) ? response.data.files.map((file) => file.url) : [];
  };

  const handleComponentImageUpload = (sectionId, componentId, files) => {
    if (!Array.isArray(files) || files.length === 0) {
      return;
    }

    const mapKey = `${sectionId}-${componentId}`;
    setPendingComponentImages((current) => ({
      ...current,
      [mapKey]: [...(current[mapKey] || []), ...files]
    }));
  };

  const addSection = () => {
    const sectionType = sectionAddMode === 'custom' ? 'custom' : defaultSectionType;
    updateForm((current) => ({
      ...current,
      sections: [...current.sections, createSection(sectionType, { order: current.sections.length })]
    }));
  };

  const removeSection = (sectionId) => {
    updateForm((current) => ({
      ...current,
      sections: current.sections.filter((section) => section.id !== sectionId)
    }));
  };

  const moveSection = (sectionIndex, direction) => {
    updateForm((current) => ({
      ...current,
      sections: moveItem(current.sections, sectionIndex, sectionIndex + direction)
    }));
  };

  const updateSectionComponent = (sectionId, componentId, updater) => {
    updateForm((current) => ({
      ...current,
      sections: current.sections.map((section) => {
        if (section.id !== sectionId) {
          return section;
        }

        return {
          ...section,
          components: section.components.map((component) => {
            if (component.id !== componentId) {
              return component;
            }

            return typeof updater === 'function' ? updater(component) : updater;
          })
        };
      })
    }));
  };

  const addComponent = (sectionId) => {
    const componentType = componentDrafts[sectionId] || 'title';

    updateForm((current) => ({
      ...current,
      sections: current.sections.map((section) => (
        section.id === sectionId
          ? { ...section, components: [...section.components, createComponent(componentType)] }
          : section
      ))
    }));
  };

  const removeComponent = (sectionId, componentId) => {
    updateForm((current) => ({
      ...current,
      sections: current.sections.map((section) => {
        if (section.id !== sectionId || section.components.length === 1) {
          return section;
        }

        return {
          ...section,
          components: section.components.filter((component) => component.id !== componentId)
        };
      })
    }));
  };

  const moveComponent = (sectionId, componentIndex, direction) => {
    updateForm((current) => ({
      ...current,
      sections: current.sections.map((section) => {
        if (section.id !== sectionId) {
          return section;
        }

        return {
          ...section,
          components: moveItem(section.components, componentIndex, componentIndex + direction)
        };
      })
    }));
  };

  const updateComponentItem = (sectionId, componentId, itemIndex, value) => {
    updateSectionComponent(sectionId, componentId, (component) => ({
      ...component,
      items: component.items.map((item, index) => index === itemIndex ? value : item)
    }));
  };

  const addComponentItem = (sectionId, componentId) => {
    updateSectionComponent(sectionId, componentId, (component) => ({
      ...component,
      items: [...component.items, '']
    }));
  };

  const removeComponentItem = (sectionId, componentId, itemIndex) => {
    updateSectionComponent(sectionId, componentId, (component) => ({
      ...component,
      items: component.items.length === 1
        ? component.items
        : component.items.filter((_, index) => index !== itemIndex)
    }));
  };

  const removeComponentImage = (sectionId, componentId, imageId) => {
    updateSectionComponent(sectionId, componentId, (component) => ({
      ...component,
      images: component.images.filter((image) => image.id !== imageId)
    }));
  };

  const removePendingComponentImage = (sectionId, componentId, indexToRemove) => {
    const mapKey = `${sectionId}-${componentId}`;
    setPendingComponentImages((current) => ({
      ...current,
      [mapKey]: (current[mapKey] || []).filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      let payload = {
        ...formData,
        hero: { ...formData.hero },
        sections: formData.sections.map((section) => ({
          ...section,
          components: section.components.map((component) => ({
            ...component,
            images: Array.isArray(component.images) ? [...component.images] : []
          }))
        }))
      };

      if (pendingCardImages[0]) {
        payload.cardImage = await uploadSingleImage(pendingCardImages[0]);
      }

      if (pendingHeroImages[0]) {
        payload.hero.image = await uploadSingleImage(pendingHeroImages[0]);
      }

      if (!payload.cardImage && payload.hero.image) {
        payload.cardImage = payload.hero.image;
      }

      for (const section of payload.sections) {
        for (const component of section.components) {
          if (component.type !== 'images') {
            continue;
          }

          const mapKey = `${section.id}-${component.id}`;
          const pendingFilesForComponent = pendingComponentImages[mapKey] || [];

          if (pendingFilesForComponent.length === 0) {
            continue;
          }

          const uploadedUrls = await uploadMultipleImages(pendingFilesForComponent);
          const existingImages = Array.isArray(component.images) ? component.images : [];

          component.images = [
            ...existingImages,
            ...uploadedUrls.map((url, index) => ({
              id: `image-${section.id}-${component.id}-${Date.now()}-${index}`,
              url,
              caption: '',
              alt: '',
              order: existingImages.length + index
            }))
          ];
        }
      }

      if (isEditing) {
        await axios.put(`/projects/${id}`, payload);
      } else {
        await axios.post('/projects', payload);
      }

      setPendingCardImages([]);
      setPendingHeroImages([]);
      setPendingComponentImages({});
      toast.success(`Project ${isEditing ? 'updated' : 'created'} successfully`);
      navigate('/admin/projects');
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error(error.response?.data?.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const renderTextComponent = (sectionId, component, label, multiline = false) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {multiline ? (
        <textarea
          value={component.content}
          onChange={(event) => updateSectionComponent(sectionId, component.id, {
            ...component,
            content: event.target.value
          })}
          rows={5}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary"
        />
      ) : (
        <input
          type="text"
          value={component.content}
          onChange={(event) => updateSectionComponent(sectionId, component.id, {
            ...component,
            content: event.target.value
          })}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
        />
      )}
    </div>
  );

  const renderListComponent = (sectionId, component, title) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">{title}</label>
        <button
          type="button"
          onClick={() => addComponentItem(sectionId, component.id)}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-secondary"
        >
          <FiPlus className="h-4 w-4" />
          Add Item
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {component.items.map((item, itemIndex) => (
          <div key={`${component.id}-${itemIndex}`} className="flex items-start gap-2">
            <input
              type="text"
              value={item}
              onChange={(event) => updateComponentItem(sectionId, component.id, itemIndex, event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => removeComponentItem(sectionId, component.id, itemIndex)}
              disabled={component.items.length === 1}
              className="rounded-lg p-2 text-red-500 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiTrash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderImagesComponent = (section, component) => {
    const mapKey = `${section.id}-${component.id}`;
    const pendingImagesForComponent = pendingComponentImages[mapKey] || [];
    const existingImageUrls = (component.images || []).map((image) => image.url).filter(Boolean);

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">Images</label>
          <div className="text-xs text-gray-500">Files upload only after Save Project</div>
        </div>
        <ImageDropzone
          multiple
          files={pendingImagesForComponent}
          onFilesSelected={(files) => handleComponentImageUpload(section.id, component.id, files)}
          onRemove={(index) => removePendingComponentImage(section.id, component.id, index)}
          buttonLabel="Add Images"
          helperText="Drag and drop images here. They will be uploaded when the project is saved."
        />

        {pendingImagesForComponent.length > 0 && (
          <p className="text-xs text-gray-500">{pendingImagesForComponent.length} pending image(s) ready to upload on save.</p>
        )}

        {existingImageUrls.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500">Existing uploaded images</p>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {component.images.map((image) => (
                <div key={image.id} className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                  <img src={image.url} alt="Section" className="h-40 w-full object-cover" />
                  <div className="flex items-center justify-between px-3 py-2">
                    <p className="truncate text-xs text-gray-500">{image.url}</p>
                    <button
                      type="button"
                      onClick={() => removeComponentImage(section.id, component.id, image.id)}
                      className="rounded-lg p-1 text-red-500 hover:bg-red-50 hover:text-red-700"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {existingImageUrls.length === 0 && pendingImagesForComponent.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500">
            No images uploaded yet.
          </div>
        )}
      </div>
    );
  };

  const renderComponentEditor = (section, component, componentIndex) => {
    let body = null;

    if (component.type === 'label') {
      body = renderTextComponent(section.id, component, 'Section Label');
    }

    if (component.type === 'title') {
      body = renderTextComponent(section.id, component, 'Section Title');
    }

    if (component.type === 'subtitle') {
      body = renderTextComponent(section.id, component, 'Section Subtitle', true);
    }

    if (component.type === 'longText') {
      body = renderTextComponent(section.id, component, 'Long Text', true);
    }

    if (component.type === 'bullets') {
      body = renderListComponent(section.id, component, 'Bullets');
    }

    if (component.type === 'checkedFeatures') {
      body = renderListComponent(section.id, component, 'Checked Bullet Items');
    }

    if (component.type === 'images') {
      body = renderImagesComponent(section, component);
    }

    return (
      <div key={component.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">{getComponentTypeLabel(component.type)}</p>
            <p className="text-xs text-gray-500">Arrange, remove, or edit this section component.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => moveComponent(section.id, componentIndex, -1)}
              disabled={componentIndex === 0}
              className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiArrowUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => moveComponent(section.id, componentIndex, 1)}
              disabled={componentIndex === section.components.length - 1}
              className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiArrowDown className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => removeComponent(section.id, component.id)}
              disabled={section.components.length === 1}
              className="rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiTrash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        {body}
      </div>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-800">
              {isEditing ? 'Edit Project' : 'New Project'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">Manage the project page content, sections, and media in one place.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/projects')}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              <FiX className="mr-2 inline h-5 w-5" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-secondary disabled:opacity-50"
            >
              <FiSave className="mr-2 inline h-5 w-5" />
              {saving ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Project Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Short Description</label>
                  <textarea
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Media</h2>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Card Image</label>
                  <div className="overflow-hidden rounded-lg bg-gray-100">
                    {formData.cardImage ? (
                      <img src={formData.cardImage} alt="Card" className="h-48 w-full object-cover" />
                    ) : (
                      <div className="flex h-48 items-center justify-center text-gray-400">
                        <FiImage className="h-10 w-10" />
                      </div>
                    )}
                  </div>
                  <ImageDropzone
                    files={pendingCardImages}
                    onFilesSelected={(files) => setPendingCardImages(files.slice(0, 1))}
                    onRemove={() => setPendingCardImages([])}
                    buttonLabel="Select Card Image"
                    helperText="Drag and drop an image. Upload happens when the project is saved."
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Hero Image</label>
                  <div className="overflow-hidden rounded-lg bg-gray-100">
                    {formData.hero.image ? (
                      <img src={formData.hero.image} alt="Hero" className="h-48 w-full object-cover" />
                    ) : (
                      <div className="flex h-48 items-center justify-center text-gray-400">
                        <FiImage className="h-10 w-10" />
                      </div>
                    )}
                  </div>
                  <ImageDropzone
                    files={pendingHeroImages}
                    onFilesSelected={(files) => setPendingHeroImages(files.slice(0, 1))}
                    onRemove={() => setPendingHeroImages([])}
                    buttonLabel="Select Hero Image"
                    helperText="Drag and drop an image. Upload happens when the project is saved."
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Hero Section</h2>
                  <p className="text-sm text-gray-500">This section stays pinned at the top and cannot be reordered or removed.</p>
                </div>
              </div>
              <div className="grid gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Hero Title</label>
                  <input
                    type="text"
                    value={formData.hero.title}
                    onChange={(event) => handleNestedChange('hero', 'title', event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Hero Subtitle</label>
                  <textarea
                    value={formData.hero.subtitle}
                    onChange={(event) => handleNestedChange('hero', 'subtitle', event.target.value)}
                    rows={5}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Page Sections</h2>
                  <p className="text-sm text-gray-500">Default sections are ready for new projects. Any non-hero section can be removed, reordered, or extended with more components.</p>
                </div>
                <button
                  type="button"
                  onClick={addSection}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-secondary"
                >
                  <FiPlus className="h-5 w-5" />
                  Add Section
                </button>
              </div>

              <div className="mb-4 grid gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:grid-cols-3">
                <select
                  value={sectionAddMode}
                  onChange={(event) => setSectionAddMode(event.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="default">Add Default Section</option>
                  <option value="custom">Add Custom Section</option>
                </select>
                <select
                  value={defaultSectionType}
                  onChange={(event) => setDefaultSectionType(event.target.value)}
                  disabled={sectionAddMode !== 'default'}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  {defaultSectionTypeOptions.map((type) => (
                    <option key={type} value={type}>{SECTION_TYPE_LABELS[type]}</option>
                  ))}
                </select>
                <p className="flex items-center text-xs text-gray-500">
                  Default uses pre-built component structure. Custom starts empty-style with flexible components.
                </p>
              </div>

              <div className="space-y-6">
                {formData.sections.map((section, sectionIndex) => (
                  <div key={section.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                          {SECTION_TYPE_LABELS[section.sectionType] || SECTION_TYPE_LABELS.custom}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">Arrange this section and manage its components below.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => moveSection(sectionIndex, -1)}
                          disabled={sectionIndex === 0}
                          className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <FiArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSection(sectionIndex, 1)}
                          disabled={sectionIndex === formData.sections.length - 1}
                          className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <FiArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSection(section.id)}
                          className="rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50 hover:text-red-700"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {section.components.map((component, componentIndex) => renderComponentEditor(section, component, componentIndex))}
                    </div>

                    <div className="mt-5 flex flex-col gap-3 rounded-lg border border-dashed border-gray-300 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Add another component</p>
                        <p className="text-xs text-gray-500">Each section must keep at least one component.</p>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <select
                          value={componentDrafts[section.id] || 'title'}
                          onChange={(event) => setComponentDrafts((current) => ({
                            ...current,
                            [section.id]: event.target.value
                          }))}
                          className="rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                        >
                          {COMPONENT_TYPE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => addComponent(section.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
                        >
                          <FiPlus className="h-5 w-5" />
                          Add Component
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Publish</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">Featured Project</span>
                </label>
                {formData.featured && formData.status !== 'Published' && (
                  <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                    Featured projects appear on the homepage only when status is Published.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Featured Property Details</h2>
              <p className="mb-4 text-xs text-gray-500">
                These details are shown in the homepage section under "Building Dreams, Creating Communities".
              </p>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Featured Property Type</label>
                  <select
                    value={formData.featuredProperty.propertyType}
                    onChange={(event) => handleNestedChange('featuredProperty', 'propertyType', event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                  >
                    <option value="Lot">Lot</option>
                    <option value="House and Lot">House and Lot</option>
                    <option value="Condo">Condo</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={formData.featuredProperty.title}
                    onChange={(event) => handleNestedChange('featuredProperty', 'title', event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                    placeholder="Nature-inspired communities"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    rows={3}
                    value={formData.featuredProperty.description}
                    onChange={(event) => handleNestedChange('featuredProperty', 'description', event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                    placeholder="Concise detail for homepage card"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    value={formData.featuredProperty.location}
                    onChange={(event) => handleNestedChange('featuredProperty', 'location', event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                    placeholder="City, Province"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    value={formData.featuredProperty.price}
                    onChange={(event) => handleNestedChange('featuredProperty', 'price', event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                    placeholder="e.g. 2500000"
                  />
                </div>

                {formData.featuredProperty.propertyType === 'Condo' ? (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Unit Size Area (sqm)</label>
                      <input
                        type="number"
                        value={formData.featuredProperty.unitSizeArea}
                        onChange={(event) => handleNestedChange('featuredProperty', 'unitSizeArea', event.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                        placeholder="e.g. 32"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Unit Size Range</label>
                      <input
                        type="text"
                        value={formData.featuredProperty.unitSizeRange}
                        onChange={(event) => handleNestedChange('featuredProperty', 'unitSizeRange', event.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                        placeholder="e.g. 22 sqm - 45 sqm"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Lot Area (sqm)</label>
                      <input
                        type="number"
                        value={formData.featuredProperty.lotArea}
                        onChange={(event) => handleNestedChange('featuredProperty', 'lotArea', event.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                        placeholder="e.g. 80"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Floor Area (sqm)</label>
                      <input
                        type="number"
                        value={formData.featuredProperty.floorArea}
                        onChange={(event) => handleNestedChange('featuredProperty', 'floorArea', event.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                        placeholder="e.g. 45"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Classification</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === 'BeachTowns' ? 'Beach Towns' : category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Property Type</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                  >
                    {propertyTypes.map((propertyType) => (
                      <option key={propertyType} value={propertyType}>{propertyType}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Contractor</label>
                  <select
                    name="contractor"
                    value={formData.contractor}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Select Contractor</option>
                    {contractors.map((contractor) => (
                      <option key={contractor._id} value={contractor._id}>{contractor.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Location</label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Select Location</option>
                    {locations.map((location) => (
                      <option key={location._id} value={location._id}>{location.city}, {location.province}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Pricing & Size</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Lot Size Range</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={formData.lotSizeRange.min}
                      onChange={(event) => handleNestedChange('lotSizeRange', 'min', event.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={formData.lotSizeRange.max}
                      onChange={(event) => handleNestedChange('lotSizeRange', 'max', event.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Unit"
                      value={formData.lotSizeRange.unit}
                      onChange={(event) => handleNestedChange('lotSizeRange', 'unit', event.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Total Area</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Value"
                      value={formData.totalArea.value}
                      onChange={(event) => handleNestedChange('totalArea', 'value', event.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Unit"
                      value={formData.totalArea.unit}
                      onChange={(event) => handleNestedChange('totalArea', 'unit', event.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Price Range</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={formData.priceRange.min}
                      onChange={(event) => handleNestedChange('priceRange', 'min', event.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={formData.priceRange.max}
                      onChange={(event) => handleNestedChange('priceRange', 'max', event.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Currency"
                      value={formData.priceRange.currency}
                      onChange={(event) => handleNestedChange('priceRange', 'currency', event.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Project Video</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">YouTube URL</label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={formData.youtubeUrl || ''}
                    onChange={(event) => updateForm((current) => ({
                      ...current,
                      youtubeUrl: event.target.value
                    }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                  />
                </div>
                {getYoutubeEmbedUrl(formData.youtubeUrl || '') && (
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <iframe
                      src={getYoutubeEmbedUrl(formData.youtubeUrl || '')}
                      title="Project video preview"
                      className="h-52 w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminProjectForm;