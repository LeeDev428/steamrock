import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { FiSave, FiPlus, FiTrash2, FiUpload, FiImage, FiVideo } from 'react-icons/fi';

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get('/settings');
      setSettings(res.data.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put('/settings', settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
    setSaving(false);
  };

  const handleHeroImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'hero');

    try {
      const res = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const newItems = [...settings.hero.items];
      newItems[index] = { ...newItems[index], url: res.data.url };
      setSettings({ ...settings, hero: { ...settings.hero, items: newItems } });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    }
  };

  const addHeroItem = () => {
    setSettings({
      ...settings,
      hero: {
        ...settings.hero,
        items: [...settings.hero.items, { type: 'image', url: '', title: '', subtitle: '' }]
      }
    });
  };

  const removeHeroItem = (index) => {
    setSettings({
      ...settings,
      hero: {
        ...settings.hero,
        items: settings.hero.items.filter((_, i) => i !== index)
      }
    });
  };

  const updateHeroItem = (index, field, value) => {
    const newItems = [...settings.hero.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setSettings({ ...settings, hero: { ...settings.hero, items: newItems } });
  };

  const addFeatureIcon = () => {
    setSettings({
      ...settings,
      featureIcons: [...settings.featureIcons, { icon: '', title: '', description: '' }]
    });
  };

  const updateFeatureIcon = (index, field, value) => {
    const newIcons = [...settings.featureIcons];
    newIcons[index] = { ...newIcons[index], [field]: value };
    setSettings({ ...settings, featureIcons: newIcons });
  };

  const removeFeatureIcon = (index) => {
    setSettings({
      ...settings,
      featureIcons: settings.featureIcons.filter((_, i) => i !== index)
    });
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold text-gray-800">Site Settings</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <FiSave className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b">
            <nav className="flex gap-4 px-6">
              {['hero', 'features', 'contact', 'social'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Hero Tab */}
            {activeTab === 'hero' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Type</label>
                  <select
                    value={settings.hero.type}
                    onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, type: e.target.value } })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="image">Single Image</option>
                    <option value="video">Background Video</option>
                    <option value="carousel">Carousel</option>
                  </select>
                </div>

                {settings.hero.type === 'carousel' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">Carousel Slides</label>
                      <button
                        onClick={addHeroItem}
                        className="inline-flex items-center gap-1 text-primary hover:text-secondary text-sm"
                      >
                        <FiPlus className="w-4 h-4" /> Add Slide
                      </button>
                    </div>
                    <div className="space-y-4">
                      {settings.hero.items.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-600">Slide {index + 1}</span>
                            <button
                              onClick={() => removeHeroItem(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Type</label>
                              <select
                                value={item.type}
                                onChange={(e) => updateHeroItem(index, 'type', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              >
                                <option value="image">Image</option>
                                <option value="video">Video</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">
                                {item.type === 'video' ? 'Video URL' : 'Image'}
                              </label>
                              {item.type === 'video' ? (
                                <input
                                  type="url"
                                  value={item.url}
                                  onChange={(e) => updateHeroItem(index, 'url', e.target.value)}
                                  placeholder="https://..."
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                              ) : (
                                <div className="flex items-center gap-2">
                                  {item.url ? (
                                    <img src={item.url} alt="" className="w-16 h-10 object-cover rounded" />
                                  ) : (
                                    <div className="w-16 h-10 bg-gray-100 rounded flex items-center justify-center">
                                      <FiImage className="w-5 h-5 text-gray-400" />
                                    </div>
                                  )}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleHeroImageUpload(e, index)}
                                    className="hidden"
                                    id={`heroImage-${index}`}
                                  />
                                  <label
                                    htmlFor={`heroImage-${index}`}
                                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 text-sm"
                                  >
                                    <FiUpload className="w-4 h-4" />
                                  </label>
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Title</label>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateHeroItem(index, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Subtitle</label>
                              <input
                                type="text"
                                value={item.subtitle}
                                onChange={(e) => updateHeroItem(index, 'subtitle', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {settings.hero.type === 'video' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
                    <input
                      type="url"
                      value={settings.hero.items[0]?.url || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        hero: {
                          ...settings.hero,
                          items: [{ ...settings.hero.items[0], type: 'video', url: e.target.value }]
                        }
                      })}
                      placeholder="https://youtube.com/... or video file URL"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Features Tab */}
            {activeTab === 'features' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Feature Icons (Homepage)</label>
                  <button
                    onClick={addFeatureIcon}
                    className="inline-flex items-center gap-1 text-primary hover:text-secondary text-sm"
                  >
                    <FiPlus className="w-4 h-4" /> Add Feature
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {settings.featureIcons.map((feature, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600">Feature {index + 1}</span>
                        <button
                          onClick={() => removeFeatureIcon(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Icon (emoji or icon name)</label>
                          <input
                            type="text"
                            value={feature.icon}
                            onChange={(e) => updateFeatureIcon(index, 'icon', e.target.value)}
                            placeholder="🏠 or home"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Title</label>
                          <input
                            type="text"
                            value={feature.title}
                            onChange={(e) => updateFeatureIcon(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Description</label>
                          <input
                            type="text"
                            value={feature.description}
                            onChange={(e) => updateFeatureIcon(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={settings.contact.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      contact: { ...settings.contact, email: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={settings.contact.phone}
                    onChange={(e) => setSettings({
                      ...settings,
                      contact: { ...settings.contact, phone: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={settings.contact.address}
                    onChange={(e) => setSettings({
                      ...settings,
                      contact: { ...settings.contact, address: e.target.value }
                    })}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Social Tab */}
            {activeTab === 'social' && (
              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                  <input
                    type="url"
                    value={settings.social.facebook}
                    onChange={(e) => setSettings({
                      ...settings,
                      social: { ...settings.social, facebook: e.target.value }
                    })}
                    placeholder="https://facebook.com/..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                  <input
                    type="url"
                    value={settings.social.instagram}
                    onChange={(e) => setSettings({
                      ...settings,
                      social: { ...settings.social, instagram: e.target.value }
                    })}
                    placeholder="https://instagram.com/..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  <input
                    type="url"
                    value={settings.social.linkedin}
                    onChange={(e) => setSettings({
                      ...settings,
                      social: { ...settings.social, linkedin: e.target.value }
                    })}
                    placeholder="https://linkedin.com/..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">YouTube</label>
                  <input
                    type="url"
                    value={settings.social.youtube}
                    onChange={(e) => setSettings({
                      ...settings,
                      social: { ...settings.social, youtube: e.target.value }
                    })}
                    placeholder="https://youtube.com/..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
