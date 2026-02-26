import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiUpload } from 'react-icons/fi';

const AdminContractors = () => {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    logo: ''
  });

  useEffect(() => {
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    try {
      const res = await axios.get('/contractors');
      setContractors(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (error) {
      console.error('Error fetching contractors:', error);
      setContractors([]);
    }
    setLoading(false);
  };

  const openModal = (contractor = null) => {
    if (contractor) {
      setEditing(contractor._id);
      setFormData({
        name: contractor.name,
        description: contractor.description || '',
        website: contractor.website || '',
        logo: contractor.logo || ''
      });
    } else {
      setEditing(null);
      setFormData({ name: '', description: '', website: '', logo: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const res = await axios.put(`/contractors/${editing}`, formData);
        const updatedContractor = res.data.data || res.data;
        setContractors(contractors.map(c => c._id === editing ? updatedContractor : c));
      } else {
        const res = await axios.post('/contractors', formData);
        const newContractor = res.data.data || res.data;
        setContractors([...contractors, newContractor]);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving contractor:', error);
      alert(error.response?.data?.message || 'Failed to save contractor');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contractor?')) return;
    try {
      await axios.delete(`/contractors/${id}`);
      setContractors(contractors.filter(c => c._id !== id));
    } catch (error) {
      console.error('Error deleting contractor:', error);
      alert('Failed to delete contractor');
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('type', 'contractors');

    try {
      const res = await axios.post('/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, logo: res.data.url });
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Failed to upload logo');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold text-gray-800">Contractors</h1>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FiPlus className="w-5 h-5" />
            Add Contractor
          </button>
        </div>

        {/* Contractors Grid */}
        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : contractors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No contractors yet</p>
              <button
                onClick={() => openModal()}
                className="inline-flex items-center gap-2 text-primary hover:text-secondary"
              >
                <FiPlus className="w-5 h-5" />
                Add your first contractor
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {contractors.filter(c => c && c._id).map((contractor) => (
                <div key={contractor._id} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {contractor?.logo ? (
                        <img src={contractor.logo} alt={contractor.name} className="w-12 h-12 object-contain rounded" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400 font-bold">
                          {contractor.name?.charAt(0) || '?'}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-800">{contractor.name}</h3>
                        <p className="text-sm text-gray-500">{contractor.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openModal(contractor)}
                        className="p-2 text-gray-400 hover:text-primary"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(contractor._id)}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {contractor.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{contractor.description}</p>
                  )}
                  {contractor.website && (
                    <a
                      href={contractor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline mt-2 inline-block"
                    >
                      Visit Website →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                {editing ? 'Edit Contractor' : 'New Contractor'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                <div className="flex items-center gap-3">
                  {formData.logo ? (
                    <img src={formData.logo} alt="Logo" className="w-16 h-16 object-contain border rounded" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 border rounded flex items-center justify-center text-gray-400">
                      <FiUpload className="w-6 h-6" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logoUpload"
                  />
                  <label
                    htmlFor="logoUpload"
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 text-sm"
                  >
                    Upload Logo
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary"
                >
                  <FiCheck className="w-5 h-5 inline mr-1" />
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminContractors;
