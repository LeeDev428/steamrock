import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUser, FiMail, FiPhone, FiCalendar, FiClock, FiMessageCircle, FiSend, FiCheck, FiVideo, FiMapPin } from 'react-icons/fi';

const BookingForm = ({ selectedProject }) => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    project: '',
    preferredDate: '',
    preferredTime: '',
    tourType: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const tourTypes = [
    { value: 'In Person', label: 'In Person', icon: FiMapPin, desc: 'Visit the property on-site' },
    { value: 'Video Chat', label: 'Video Chat', icon: FiVideo, desc: 'Virtual tour via video call' },
  ];

  const timeSlots = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM'
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      setFormData(prev => ({ ...prev, project: selectedProject }));
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/projects');
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!formData.tourType) {
      setLoading(false);
      setError('Please select a tour type (In Person or Video Chat).');
      return;
    }
    try {
      // Find the selected project name to send with booking
      const selectedProj = projects.find(p => p._id === formData.project);
      const payload = {
        ...formData,
        projectName: selectedProj ? selectedProj.name : ''
      };
      await axios.post('/bookings', payload);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        project: '',
        preferredDate: '',
        preferredTime: '',
        tourType: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting booking:', error);
      setError(error.response?.data?.message || 'Failed to submit booking. Please try again.');
    }
    setLoading(false);
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiCheck className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-green-800 mb-2">Booking Request Submitted!</h3>
        <p className="text-green-600">
          Thank you for your interest! We've received your booking request and will contact you shortly to confirm your viewing schedule.
        </p>
        <p className="text-sm text-green-500 mt-4">
          A confirmation email has been sent to your email address.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          <div className="relative">
            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Your full name"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <div className="relative">
            <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="+63 9XX XXX XXXX"
            />
          </div>
        </div>

        {/* Project */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Property Interest</label>
          <div className="relative">
            <select
              name="project"
              value={formData.project}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none bg-white"
            >
              <option value="">Select a property (optional)</option>
              {projects.map(project => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Preferred Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date *</label>
          <div className="relative">
            <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleChange}
              min={today}
              required
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Preferred Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time *</label>
          <div className="relative">
            <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleChange}
              required
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none bg-white"
            >
              <option value="">Select a time slot</option>
              {timeSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tour Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Tour Type *</label>
        <div className="grid grid-cols-2 gap-3">
          {tourTypes.map(({ value, label, icon: Icon, desc }) => (
            <button
              type="button"
              key={value}
              onClick={() => setFormData({ ...formData, tourType: value })}
              className={`flex items-center gap-3 p-4 border-2 rounded-xl transition-all text-left ${
                formData.tourType === value
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 hover:border-primary/40 text-gray-700'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Message</label>
        <div className="relative">
          <FiMessageCircle className="absolute left-4 top-4 text-gray-400" />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            placeholder="Tell us about your property preferences or any questions..."
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-secondary text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Submitting...
          </>
        ) : (
          <>
            <FiSend className="w-5 h-5" />
            Schedule Viewing
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        By submitting this form, you agree to be contacted by Streamrock Realty regarding your property inquiry.
      </p>
    </form>
  );
};

export default BookingForm;
