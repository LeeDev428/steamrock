import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { useToast } from '../../components/Toast';
import { FiCalendar, FiClock, FiUser, FiMail, FiPhone, FiCheck, FiX, FiEye, FiTrash2, FiMapPin, FiMessageCircle, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const AdminBookings = () => {
  const toast = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0
  });
  const [filter, setFilter] = useState({
    status: '',
    isRead: ''
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [responseData, setResponseData] = useState({
    status: '',
    adminNotes: ''
  });

  const statuses = ['Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled'];

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      if (filter.isRead) params.append('isRead', filter.isRead);
      
      const res = await axios.get(`/bookings?${params.toString()}`);
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('/bookings/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const openBookingModal = async (booking) => {
    try {
      const res = await axios.get(`/bookings/${booking._id}`);
      setSelectedBooking(res.data);
      setResponseData({
        status: res.data.status,
        adminNotes: res.data.adminNotes || ''
      });
      setShowModal(true);
      // Refresh bookings to update read status
      fetchBookings();
      fetchStats();
    } catch (error) {
      console.error('Error fetching booking:', error);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedBooking) return;

    try {
      await axios.put(`/bookings/${selectedBooking._id}/status`, responseData);
      setShowModal(false);
      fetchBookings();
      fetchStats();
      toast.success('Booking status updated and notification sent to customer.');
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    
    try {
      await axios.delete(`/bookings/${id}`);
      setBookings(bookings.filter(b => b._id !== id));
      fetchStats();
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to delete booking');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'Completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage property viewing requests</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl">
                <FiCalendar className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <FiClock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Unread</p>
                <p className="text-2xl font-bold text-red-600">{stats.unread}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <FiAlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Filter by:</span>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select
              value={filter.isRead}
              onChange={(e) => setFilter({ ...filter, isRead: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">All Messages</option>
              <option value="false">Unread</option>
              <option value="true">Read</option>
            </select>
            {(filter.status || filter.isRead) && (
              <button
                onClick={() => setFilter({ status: '', isRead: '' })}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <FiCalendar className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-500">Booking requests will appear here</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Property</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Schedule</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((booking) => (
                    <tr 
                      key={booking._id} 
                      className={`hover:bg-gray-50 transition-colors ${!booking.isRead ? 'bg-blue-50/30' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {!booking.isRead && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{booking.name}</p>
                            <p className="text-sm text-gray-500">{booking.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{booking.projectName || 'General Inquiry'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{formatDate(booking.preferredDate)}</p>
                        <p className="text-sm text-gray-500">{booking.preferredTime}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDateTime(booking.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openBookingModal(booking)}
                            className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(booking._id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Booking Detail Modal */}
        {showModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <div className="flex items-center gap-3">
                    <FiUser className="text-gray-400" />
                    <span>{selectedBooking.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiMail className="text-gray-400" />
                    <a href={`mailto:${selectedBooking.email}`} className="text-primary hover:underline">
                      {selectedBooking.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiPhone className="text-gray-400" />
                    <a href={`tel:${selectedBooking.phone}`} className="text-primary hover:underline">
                      {selectedBooking.phone}
                    </a>
                  </div>
                </div>

                {/* Booking Info */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-3">Booking Details</h3>
                  <div className="flex items-center gap-3">
                    <FiMapPin className="text-gray-400" />
                    <span>{selectedBooking.projectName || 'General Inquiry'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiCalendar className="text-gray-400" />
                    <span>{formatDate(selectedBooking.preferredDate)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiClock className="text-gray-400" />
                    <span>{selectedBooking.preferredTime}</span>
                  </div>
                  {selectedBooking.message && (
                    <div className="flex items-start gap-3">
                      <FiMessageCircle className="text-gray-400 mt-1" />
                      <span className="text-gray-600">{selectedBooking.message}</span>
                    </div>
                  )}
                </div>

                {/* Response Form */}
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Update Status</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={responseData.status}
                        onChange={(e) => setResponseData({ ...responseData, status: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        {statuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notes for Customer (optional)</label>
                      <textarea
                        value={responseData.adminNotes}
                        onChange={(e) => setResponseData({ ...responseData, adminNotes: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        rows={3}
                        placeholder="Add any notes or instructions for the customer..."
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStatusUpdate}
                    className="px-6 py-3 bg-primary hover:bg-secondary text-white rounded-xl transition-colors font-medium flex items-center gap-2"
                  >
                    <FiCheck className="w-4 h-4" />
                    Update & Notify
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
