import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiImage, FiFilter, FiTrendingUp, FiPackage, FiCheckCircle, FiClock } from 'react-icons/fi';

const AdminProjects = () => {
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    archived: 0
  });
  const [filter, setFilter] = useState({
    category: searchParams.get('category') || '',
    status: searchParams.get('status') || ''
  });

  const categories = ['Parks', 'BeachTowns', 'Shores', 'Peaks'];
  const statuses = ['Draft', 'Published', 'Archived'];

  useEffect(() => {
    fetchProjects();
  }, [filter]);

  const fetchProjects = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.category) params.append('category', filter.category);
      if (filter.status) params.append('status', filter.status);
      
      const res = await axios.get(`/projects?${params.toString()}`);
      const projectsData = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setProjects(projectsData);
      
      // Calculate stats
      setStats({
        total: projectsData.length,
        published: projectsData.filter(p => p.status === 'Published').length,
        draft: projectsData.filter(p => p.status === 'Draft').length,
        archived: projectsData.filter(p => p.status === 'Archived').length
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await axios.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`/projects/${id}/status`, { status: newStatus });
      setProjects(projects.map(p => 
        p._id === id ? { ...p, status: newStatus } : p
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Published': return 'bg-green-100 text-green-800 border-green-200';
      case 'Draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Parks': return 'bg-green-50 text-green-700 border-green-200';
      case 'BeachTowns': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Shores': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'Peaks': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your property projects</p>
          </div>
          <Link
            to="/admin/projects/new"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md font-medium"
          >
            <FiPlus className="w-5 h-5" />
            Add New Project
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <FiPackage className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Published</p>
                <p className="text-2xl font-bold text-green-600">{stats.published}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Draft</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <FiClock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Archived</p>
                <p className="text-2xl font-bold text-gray-600">{stats.archived}</p>
              </div>
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                <FiTrendingUp className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <FiFilter className="w-5 h-5" />
              <span>Filters:</span>
            </div>
            <select
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-sm"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'BeachTowns' ? 'Beach Towns' : cat}</option>
              ))}
            </select>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-sm"
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            {(filter.category || filter.status) && (
              <button
                onClick={() => setFilter({ category: '', status: '' })}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiImage className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-6 text-lg">No projects found</p>
              <Link
                to="/admin/projects/new"
                className="inline-flex items-center gap-2 text-primary hover:text-secondary font-medium"
              >
                <FiPlus className="w-5 h-5" />
                Create your first project
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Developer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {projects.map((project) => (
                    <tr key={project._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {project.cardImage ? (
                              <img
                                src={project.cardImage}
                                alt={project.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <FiImage className="w-7 h-7" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{project.name}</p>
                            <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{project.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(project.category)}`}>
                          {project.category === 'BeachTowns' ? 'Beach Towns' : project.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-700">{project.contractor?.name || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={project.status}
                          onChange={(e) => handleStatusChange(project._id, e.target.value)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary ${getStatusColor(project.status)}`}
                        >
                          {statuses.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {new Date(project.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/projects/${project.slug}`}
                            target="_blank"
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="View Project"
                          >
                            <FiEye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/projects/${project._id}`}
                            className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(project._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
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
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProjects;

                            <FiEye className="w-5 h-5" />
                          </Link>
                          <Link
                            to={`/admin/projects/${project._id}`}
                            className="p-2 text-gray-400 hover:text-primary transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(project._id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
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
    </AdminLayout>
  );
};

export default AdminProjects;
