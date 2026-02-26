import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { FiSave, FiX, FiUpload, FiPlus, FiTrash2 } from 'react-icons/fi';

const AdminProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [contractors, setContractors] = useState([]);
  const [locations, setLocations] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Parks',
    contractor: '',
    location: '',
    propertyType: 'Residential',
    lotSizeRange: { min: '', max: '', unit: 'sqm' },
    totalArea: { value: '', unit: 'Hectares' },
    priceRange: { min: '', max: '', currency: 'PHP' },
    hero: { image: '', video: '', title: '', subtitle: '' },
    cardImage: '',
    shortDescription: '',
    sections: [],
    gallery: [],
    features: [],
    status: 'Draft',
    featured: false
  });

  const categories = ['Parks', 'BeachTowns', 'Shores', 'Peaks'];
  const propertyTypes = ['Residential', 'Commercial', 'Mixed-Use', 'Resort', 'Farm Lot'];

  useEffect(() => {
    fetchOptions();
    if (isEditing) {
      fetchProject();
    }
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
    }
  };

  const fetchProject = async () => {
    try {
      const res = await axios.get(`/projects/${id}`);
      const project = res.data;
      setFormData({
        ...project,
        contractor: project.contractor?._id || project.contractor,
        location: project.location?._id || project.location
      });
    } catch (error) {
      console.error('Error fetching project:', error);
      alert('Failed to load project');
      navigate('/admin/projects');
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('type', 'projects');

    try {
      const res = await axios.post('/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        handleNestedChange(parent, child, res.data.url);
      } else {
        setFormData(prev => ({ ...prev, [field]: res.data.url }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    }
  };

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, {
        order: prev.sections.length,
        type: 'intro',
        label: '',
        title: '',
        description: '',
        images: [],
        features: [],
        backgroundColor: '#ffffff',
        textColor: '#1a202c'
      }]
    }));
  };

  const updateSection = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((s, i) => 
        i === index ? { ...s, [field]: value } : s
      )
    }));
  };

  const removeSection = (index) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, { icon: '', title: '', description: '' }]
    }));
  };

  const updateFeature = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) =>
        i === index ? { ...f, [field]: value } : f
      )
    }));
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isEditing) {
        await axios.put(`/projects/${id}`, formData);
      } else {
        await axios.post('/projects', formData);
      }
      navigate('/admin/projects');
    } catch (error) {
      console.error('Error saving project:', error);
      alert(error.response?.data?.message || 'Failed to save project');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold text-gray-800">
            {isEditing ? 'Edit Project' : 'New Project'}
          </h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/projects')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiX className="w-5 h-5 inline mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
            >
              <FiSave className="w-5 h-5 inline mr-2" />
              {saving ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                  <textarea
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    rows="3"
                    maxLength="200"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.shortDescription.length}/200 characters</p>
                </div>
              </div>
            </div>

            {/* Card Image */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Card Image</h2>
              <div className="flex items-center gap-4">
                <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden">
                  {formData.cardImage ? (
                    <img src={formData.cardImage} alt="Card" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FiUpload className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'cardImage')}
                    className="hidden"
                    id="cardImage"
                  />
                  <label
                    htmlFor="cardImage"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200"
                  >
                    <FiUpload className="w-5 h-5" />
                    Upload Image
                  </label>
                </div>
              </div>
            </div>

            {/* Hero Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Hero Section</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
                  <input
                    type="text"
                    value={formData.hero.title}
                    onChange={(e) => handleNestedChange('hero', 'title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Subtitle</label>
                  <input
                    type="text"
                    value={formData.hero.subtitle}
                    onChange={(e) => handleNestedChange('hero', 'subtitle', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'hero.image')}
                    className="hidden"
                    id="heroImage"
                  />
                  <label
                    htmlFor="heroImage"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200"
                  >
                    <FiUpload className="w-5 h-5" />
                    Upload Hero Image
                  </label>
                  {formData.hero.image && (
                    <img src={formData.hero.image} alt="Hero" className="mt-2 max-h-40 rounded-lg" />
                  )}
                </div>
              </div>
            </div>

            {/* Page Sections */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Page Sections</h2>
                <button
                  type="button"
                  onClick={addSection}
                  className="inline-flex items-center gap-1 text-primary hover:text-secondary"
                >
                  <FiPlus className="w-5 h-5" /> Add Section
                </button>
              </div>
              
              {formData.sections.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No sections added yet</p>
              ) : (
                <div className="space-y-4">
                  {formData.sections.map((section, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600">Section {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeSection(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <select
                          value={section.type}
                          onChange={(e) => updateSection(index, 'type', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="intro">Intro</option>
                          <option value="features">Features</option>
                          <option value="gallery">Gallery</option>
                          <option value="info-box">Info Box</option>
                          <option value="map">Map</option>
                          <option value="custom">Custom</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Label (e.g., DISCOVER)"
                          value={section.label}
                          onChange={(e) => updateSection(index, 'label', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="Title"
                          value={section.title}
                          onChange={(e) => updateSection(index, 'title', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg md:col-span-2"
                        />
                        <textarea
                          placeholder="Description"
                          value={section.description}
                          onChange={(e) => updateSection(index, 'description', e.target.value)}
                          rows="2"
                          className="px-3 py-2 border border-gray-300 rounded-lg md:col-span-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Features & Amenities</h2>
                <button
                  type="button"
                  onClick={addFeature}
                  className="inline-flex items-center gap-1 text-primary hover:text-secondary"
                >
                  <FiPlus className="w-5 h-5" /> Add Feature
                </button>
              </div>
              
              {formData.features.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No features added yet</p>
              ) : (
                <div className="space-y-3">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <input
                        type="text"
                        placeholder="Icon"
                        value={feature.icon}
                        onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Title"
                        value={feature.title}
                        onChange={(e) => updateFeature(index, 'title', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={feature.description}
                        onChange={(e) => updateFeature(index, 'description', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Publish</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">Featured Project</span>
                </label>
              </div>
            </div>

            {/* Category & Type */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Classification</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'BeachTowns' ? 'Beach Towns' : cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Contractor & Location */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contractor</label>
                  <select
                    name="contractor"
                    value={formData.contractor}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Select Contractor</option>
                    {contractors.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Select Location</option>
                    {locations.map(l => (
                      <option key={l._id} value={l._id}>{l.city}, {l.province}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Price & Size */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Pricing & Size</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lot Size Range (sqm)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={formData.lotSizeRange.min}
                      onChange={(e) => handleNestedChange('lotSizeRange', 'min', e.target.value)}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={formData.lotSizeRange.max}
                      onChange={(e) => handleNestedChange('lotSizeRange', 'max', e.target.value)}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Area</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Value"
                      value={formData.totalArea.value}
                      onChange={(e) => handleNestedChange('totalArea', 'value', e.target.value)}
                      className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <select
                      value={formData.totalArea.unit}
                      onChange={(e) => handleNestedChange('totalArea', 'unit', e.target.value)}
                      className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Hectares">Hectares</option>
                      <option value="sqm">sqm</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (PHP)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={formData.priceRange.min}
                      onChange={(e) => handleNestedChange('priceRange', 'min', e.target.value)}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={formData.priceRange.max}
                      onChange={(e) => handleNestedChange('priceRange', 'max', e.target.value)}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminProjectForm;
