import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { useToast } from '../../components/Toast';
import ImageDropzone from '../../components/admin/ImageDropzone';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiImage, FiFilter, FiFileText, FiCheckCircle, FiClock, FiX, FiYoutube } from 'react-icons/fi';

const AdminBlogs = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0
  });
  const [pendingFeaturedImages, setPendingFeaturedImages] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const [filter, setFilter] = useState({
    category: '',
    status: ''
  });
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    youtubeUrl: '',
    category: 'Real Estate Tips',
    tags: '',
    status: 'Draft',
    metaTitle: '',
    metaDescription: ''
  });

  const categories = ['Real Estate Tips', 'Market Updates', 'Investment Guide', 'Property Showcase', 'Company News', 'Lifestyle'];
  const statuses = ['Draft', 'Published'];

  useEffect(() => {
    fetchBlogs();
  }, [filter]);

  const fetchBlogs = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.category) params.append('category', filter.category);
      if (filter.status) params.append('status', filter.status);
      
      const res = await axios.get(`/blogs?${params.toString()}`);
      const blogsData = Array.isArray(res.data) ? res.data : [];
      setBlogs(blogsData);
      setSelectedIds([]);
      
      // Calculate stats from all blogs (not filtered)
      const allRes = await axios.get('/blogs');
      const allBlogs = Array.isArray(allRes.data) ? allRes.data : [];
      setStats({
        total: allBlogs.length,
        published: allBlogs.filter(b => b.status === 'Published').length,
        draft: allBlogs.filter(b => b.status === 'Draft').length
      });
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
    }
    setLoading(false);
  };

  const openModal = (blog = null) => {
    if (blog) {
      setEditing(blog._id);
      setFormData({
        title: blog.title || '',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        featuredImage: blog.featuredImage || '',
        youtubeUrl: blog.youtubeUrl || '',
        category: blog.category || 'Real Estate Tips',
        tags: blog.tags?.join(', ') || '',
        status: blog.status || 'Draft',
        metaTitle: blog.metaTitle || '',
        metaDescription: blog.metaDescription || ''
      });
    } else {
      setEditing(null);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        featuredImage: '',
        youtubeUrl: '',
        category: 'Real Estate Tips',
        tags: '',
        status: 'Draft',
        metaTitle: '',
        metaDescription: ''
      });
    }
    setShowModal(true);
    setPendingFeaturedImages([]);
  };

  const uploadFeaturedImage = async (file) => {
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    const query = new URLSearchParams({
      type: 'blogs',
      category: formData.category || '',
      entity: formData.title || 'untitled-blog',
      field: 'featured-image'
    });

    const res = await axios.post(`/upload?${query.toString()}`, uploadFormData);
    return res.data.url;
  };

  const openConfirm = (title, message, onConfirm) => {
    setConfirmModal({ isOpen: true, title, message, onConfirm });
  };

  const closeConfirm = () => {
    setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
      if (pendingFeaturedImages[0]) {
        payload.featuredImage = await uploadFeaturedImage(pendingFeaturedImages[0]);
      }

      if (editing) {
        const res = await axios.put(`/blogs/${editing}`, payload);
        setBlogs(blogs.map(b => b._id === editing ? res.data : b));
        toast.success('Blog post updated');
      } else {
        const res = await axios.post('/blogs', payload);
        setBlogs([res.data, ...blogs]);
        toast.success('Blog post created');
      }
      setShowModal(false);
      setPendingFeaturedImages([]);
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error(error.response?.data?.message || 'Failed to save blog');
    }
  };

  const handleDelete = (id) => {
    openConfirm(
      'Delete Blog Post',
      'Are you sure you want to delete this blog post? This action cannot be undone.',
      async () => {
        try {
          await axios.delete(`/blogs/${id}`);
          setBlogs(blogs.filter(b => b._id !== id));
          toast.success('Blog post deleted');
          fetchBlogs();
        } catch (error) {
          console.error('Error deleting blog:', error);
          toast.error('Failed to delete blog');
        }
      }
    );
  };

  const handleToggleBlog = (blogId) => {
    setSelectedIds((current) => (
      current.includes(blogId)
        ? current.filter((id) => id !== blogId)
        : [...current, blogId]
    ));
  };

  const handleToggleAll = () => {
    if (selectedIds.length === blogs.length) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(blogs.map((blog) => blog._id));
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    openConfirm(
      'Delete Selected Posts',
      `Are you sure you want to delete ${selectedIds.length} selected blog post(s)? This action cannot be undone.`,
      async () => {
        try {
          await axios.delete('/blogs/bulk', { data: { ids: selectedIds } });
          toast.success('Selected blog posts deleted');
          fetchBlogs();
        } catch (error) {
          console.error('Error deleting selected blogs:', error);
          toast.error(error.response?.data?.message || 'Failed to delete selected blogs');
        }
      }
    );
  };

  const getYoutubeId = (url) => {
    const match = url?.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match?.[1] || null;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Published': return 'bg-green-100 text-green-800 border-green-200';
      case 'Draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Real Estate Tips': 'bg-blue-50 text-blue-700',
      'Market Updates': 'bg-green-50 text-green-700',
      'Investment Guide': 'bg-purple-50 text-purple-700',
      'Property Showcase': 'bg-orange-50 text-orange-700',
      'Company News': 'bg-cyan-50 text-cyan-700',
      'Lifestyle': 'bg-pink-50 text-pink-700'
    };
    return colors[category] || 'bg-gray-50 text-gray-700';
  };

  return (
    <>
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
            <p className="text-sm text-gray-500 mt-1">Create and manage blog content for SEO</p>
          </div>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md font-medium"
          >
            <FiPlus className="w-5 h-5" />
            Create Blog Post
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl">
                <FiFileText className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Published</p>
                <p className="text-2xl font-bold text-green-600">{stats.published}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Drafts</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <FiClock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-gray-500">
              <FiFilter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            <select
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
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
            {(filter.category || filter.status) && (
              <button
                onClick={() => setFilter({ category: '', status: '' })}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-gray-700">{selectedIds.length} blog post(s) selected</p>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
            >
              Delete Selected
            </button>
          </div>
        )}

        {/* Blog List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <FiFileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No blog posts yet</h3>
            <p className="text-gray-500 mb-6">Start creating content to boost your SEO</p>
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg transition-colors"
            >
              <FiPlus className="w-5 h-5" />
              Create First Post
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedIds.length > 0 && selectedIds.length === blogs.length}
                        onChange={handleToggleAll}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Post</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Views</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {blogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(blog._id)}
                          onChange={() => handleToggleBlog(blog._id)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                            {blog.featuredImage ? (
                              <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover" />
                            ) : blog.youtubeUrl && getYoutubeId(blog.youtubeUrl) ? (
                              <>
                                <img src={`https://img.youtube.com/vi/${getYoutubeId(blog.youtubeUrl)}/hqdefault.jpg`} alt={blog.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                  <FiYoutube className="w-5 h-5 text-red-500" />
                                </div>
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <FiImage className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate max-w-xs">{blog.title}</h3>
                            <p className="text-sm text-gray-500 truncate max-w-xs">{blog.excerpt}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(blog.category)}`}>
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(blog.status)}`}>
                          {blog.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{blog.views || 0}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <a
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          >
                            <FiEye className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => openModal(blog)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(blog._id)}
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

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editing ? 'Edit Blog Post' : 'Create Blog Post'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt *</label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      rows={2}
                      maxLength={300}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.excerpt.length}/300 characters</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm"
                      rows={10}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Supports basic HTML formatting</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
                    <div className="space-y-3">
                      {formData.featuredImage && (
                        <img src={formData.featuredImage} alt="Preview" className="w-full h-40 object-cover rounded-xl" />
                      )}
                      <ImageDropzone
                        files={pendingFeaturedImages}
                        onFilesSelected={(files) => setPendingFeaturedImages(files.slice(0, 1))}
                        onRemove={() => setPendingFeaturedImages([])}
                        buttonLabel="Select Featured Image"
                        helperText="Drag and drop image here. Upload happens when you save the blog post."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="real estate, investment, tips (comma separated)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      YouTube URL <span className="text-gray-400 font-normal">(optional - for video posts)</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <FiYoutube className="text-red-500 w-5 h-5 flex-shrink-0" />
                      <input
                        type="url"
                        value={formData.youtubeUrl}
                        onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Paste a YouTube link to embed a video player in this post. Leave blank for a regular blog post.</p>
                  </div>

                  <div className="md:col-span-2 border-t border-gray-100 pt-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">SEO Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                        <input
                          type="text"
                          value={formData.metaTitle}
                          onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          placeholder="Override with custom SEO title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                        <textarea
                          value={formData.metaDescription}
                          onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          rows={2}
                          placeholder="Custom description for search engines"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary hover:bg-secondary text-white rounded-xl transition-colors font-medium"
                  >
                    {editing ? 'Update Post' : 'Publish Post'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
    <ConfirmModal
      isOpen={confirmModal.isOpen}
      title={confirmModal.title}
      message={confirmModal.message}
      onConfirm={() => { closeConfirm(); confirmModal.onConfirm?.(); }}
      onCancel={closeConfirm}
    />
  </>
  );
};

export default AdminBlogs;
