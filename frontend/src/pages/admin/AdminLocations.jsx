import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { useToast } from '../../components/Toast';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiMapPin } from 'react-icons/fi';

const AdminLocations = () => {
  const toast = useToast();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const [formData, setFormData] = useState({
    city: '',
    province: '',
    mapQuery: ''
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await axios.get('/locations');
      setLocations(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
    setLoading(false);
  };

  const openModal = (location = null) => {
    if (location) {
      setEditing(location._id);
      setFormData({
        city: location.city || '',
        province: location.province || '',
        mapQuery: location.mapQuery || ''
      });
    } else {
      setEditing(null);
      setFormData({ city: '', province: '', mapQuery: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const res = await axios.put(`/locations/${editing}`, formData);
        setLocations(locations.map(l => l._id === editing ? res.data : l));
        toast.success('Location updated');
      } else {
        const res = await axios.post('/locations', formData);
        setLocations([...locations, res.data]);
        toast.success('Location created');
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving location:', error);
      toast.error(error.response?.data?.message || 'Failed to save location');
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Location',
      message: 'Are you sure you want to delete this location? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await axios.delete(`/locations/${id}`);
          setLocations(locations.filter(l => l._id !== id));
          toast.success('Location deleted');
        } catch (error) {
          console.error('Error deleting location:', error);
          toast.error('Failed to delete location');
        }
      }
    });
  };

  return (
    <>
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold text-gray-800">Locations</h1>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FiPlus className="w-5 h-5" />
            Add Location
          </button>
        </div>

        {/* Locations Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : locations.length === 0 ? (
            <div className="text-center py-12">
              <FiMapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No locations yet</p>
              <button
                onClick={() => openModal()}
                className="inline-flex items-center gap-2 text-primary hover:text-secondary"
              >
                <FiPlus className="w-5 h-5" />
                Add your first location
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">City</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Province</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Google Maps Address</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {locations.map((location) => (
                    <tr key={location._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">{location.city}</td>
                      <td className="px-6 py-4 text-gray-600">{location.province}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm max-w-xs truncate" title={location.mapQuery}>
                        {location.mapQuery || <span className="italic text-gray-400">Not set</span>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openModal(location)}
                            className="p-2 text-gray-400 hover:text-primary"
                          >
                            <FiEdit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(location._id)}
                            className="p-2 text-gray-400 hover:text-red-500"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                {editing ? 'Edit Location' : 'New Location'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Lemery"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Province *</label>
                  <input
                    type="text"
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    placeholder="e.g. Batangas"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps Address</label>
                  <input
                    type="text"
                    value={formData.mapQuery}
                    onChange={(e) => setFormData({ ...formData, mapQuery: e.target.value })}
                    placeholder="Paste from Google Maps, e.g. XVHJ+7GQ, Diokno Hwy, Lemery, Batangas, Philippines"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">Copy the address from Google Maps (including Plus Codes) for a precise pin on the map.</p>
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
    <ConfirmModal
      isOpen={confirmModal.isOpen}
      title={confirmModal.title}
      message={confirmModal.message}
      onConfirm={() => { setConfirmModal(m => ({ ...m, isOpen: false })); confirmModal.onConfirm?.(); }}
      onCancel={() => setConfirmModal(m => ({ ...m, isOpen: false }))}
    />
  </>
  );
};

export default AdminLocations;
