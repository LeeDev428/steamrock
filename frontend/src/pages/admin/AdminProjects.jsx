import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { useToast } from '../../components/Toast';
import ConfirmModal from '../../components/admin/ConfirmModal';
import {
  FiCheckCircle,
  FiClock,
  FiEdit2,
  FiEye,
  FiFilter,
  FiImage,
  FiPackage,
  FiPlus,
  FiTrash2,
  FiTrendingUp
} from 'react-icons/fi';

const AdminProjects = () => {
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState('Draft');
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
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
    setFilter({
      category: searchParams.get('category') || '',
      status: searchParams.get('status') || ''
    });
  }, [searchParams]);

  useEffect(() => {
    fetchProjects();
  }, [filter]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.category) params.append('category', filter.category);
      if (filter.status) params.append('status', filter.status);

      const res = await axios.get(`/projects?${params.toString()}`);
      const projectsData = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setProjects(projectsData);
      setSelectedIds([]);

      setStats({
        total: projectsData.length,
        published: projectsData.filter((project) => project.status === 'Published').length,
        draft: projectsData.filter((project) => project.status === 'Draft').length,
        archived: projectsData.filter((project) => project.status === 'Archived').length
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects');
      setProjects([]);
    }
    setLoading(false);
  };

  const openConfirm = (title, message, onConfirm) => {
    setConfirmModal({ isOpen: true, title, message, onConfirm });
  };

  const closeConfirm = () => {
    setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
  };

  const handleDelete = (id) => {
    openConfirm(
      'Delete Project',
      'Are you sure you want to delete this project? This action cannot be undone.',
      async () => {
        try {
          await axios.delete(`/projects/${id}`);
          setProjects(projects.filter((project) => project._id !== id));
          setSelectedIds((current) => current.filter((selectedId) => selectedId !== id));
          toast.success('Project deleted');
        } catch (error) {
          console.error('Error deleting project:', error);
          toast.error('Failed to delete project');
        }
      }
    );
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`/projects/${id}/status`, { status: newStatus });
      setProjects(projects.map((project) =>
        project._id === id ? { ...project, status: newStatus } : project
      ));
      toast.success('Project status updated');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleToggleProject = (projectId) => {
    setSelectedIds((current) => (
      current.includes(projectId)
        ? current.filter((id) => id !== projectId)
        : [...current, projectId]
    ));
  };

  const handleToggleAll = () => {
    if (selectedIds.length === projects.length) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(projects.map((project) => project._id));
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    openConfirm(
      'Delete Selected Projects',
      `Are you sure you want to delete ${selectedIds.length} selected project(s)? This action cannot be undone.`,
      async () => {
        try {
          await axios.delete('/projects/bulk', { data: { ids: selectedIds } });
          toast.success('Selected projects deleted');
          await fetchProjects();
        } catch (error) {
          console.error('Error deleting selected projects:', error);
          toast.error(error.response?.data?.message || 'Failed to delete selected projects');
        }
      }
    );
  };

  const handleBulkStatusUpdate = async () => {
    if (selectedIds.length === 0) return;

    try {
      await axios.put('/projects/bulk-status', {
        ids: selectedIds,
        status: bulkStatus
      });
      toast.success('Selected project statuses updated');
      await fetchProjects();
    } catch (error) {
      console.error('Error updating selected project statuses:', error);
      toast.error(error.response?.data?.message || 'Failed to update selected projects');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Published': return 'bg-green-100 text-green-800 border-green-200';
      case 'Draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="mt-1 text-sm text-gray-500">Manage your property projects</p>
          </div>
          <Link
            to="/admin/projects/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-white shadow-sm transition-all hover:bg-secondary hover:shadow-md"
          >
            <FiPlus className="h-5 w-5" />
            Add New Project
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm font-medium text-gray-500">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                <FiPackage className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm font-medium text-gray-500">Published</p>
                <p className="text-2xl font-bold text-green-600">{stats.published}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50">
                <FiCheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm font-medium text-gray-500">Draft</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-50">
                <FiClock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm font-medium text-gray-500">Archived</p>
                <p className="text-2xl font-bold text-gray-600">{stats.archived}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-50">
                <FiTrendingUp className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 font-medium text-gray-700">
              <FiFilter className="h-5 w-5" />
              <span>Filters:</span>
            </div>
            <select
              value={filter.category}
              onChange={(event) => setFilter({ ...filter, category: event.target.value })}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-primary"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category === 'BeachTowns' ? 'Beach Towns' : category}</option>
              ))}
            </select>
            <select
              value={filter.status}
              onChange={(event) => setFilter({ ...filter, status: event.target.value })}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-primary"
            >
              <option value="">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            {(filter.category || filter.status) && (
              <button
                onClick={() => setFilter({ category: '', status: '' })}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-medium text-gray-700">{selectedIds.length} project(s) selected</p>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={bulkStatus}
                onChange={(event) => setBulkStatus(event.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <button
                onClick={handleBulkStatusUpdate}
                className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Apply Status
              </button>
              <button
                onClick={handleBulkDelete}
                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-blue-100 bg-blue-50/70 px-6 py-3 text-sm text-blue-900">
            To set Condo details (CRUD): click the Edit icon for a project, then go to "Featured Property Details" and choose "Condo".
          </div>
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                <FiImage className="h-10 w-10 text-gray-400" />
              </div>
              <p className="mb-6 text-lg text-gray-500">No projects found</p>
              <Link
                to="/admin/projects/new"
                className="inline-flex items-center gap-2 font-medium text-primary hover:text-secondary"
              >
                <FiPlus className="h-5 w-5" />
                Create your first project
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedIds.length > 0 && selectedIds.length === projects.length}
                        onChange={handleToggleAll}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Project</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Developer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Featured</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Featured Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Created</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {projects.map((project) => (
                    <tr key={project._id} className="transition-colors hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(project._id)}
                          onChange={() => handleToggleProject(project._id)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                            {project.cardImage ? (
                              <img src={project.cardImage} alt={project.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-gray-400">
                                <FiImage className="h-7 w-7" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{project.name}</p>
                            <p className="mt-0.5 line-clamp-1 text-sm text-gray-500">{project.shortDescription || 'No description'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getCategoryColor(project.category)}`}>
                          {project.category === 'BeachTowns' ? 'Beach Towns' : project.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-700">{project.contractor?.name || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4">
                        {project.featured ? (
                          <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                            Featured
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {project.featuredProperty?.propertyType || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={project.status}
                          onChange={(event) => handleStatusChange(project._id, event.target.value)}
                          className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary ${getStatusColor(project.status)}`}
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>{status}</option>
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
                            className="rounded-lg p-2 text-gray-400 transition-all hover:bg-blue-50 hover:text-blue-600"
                            title="View Project"
                          >
                            <FiEye className="h-4 w-4" />
                          </Link>
                          <Link
                            to={`/admin/projects/${project._id}`}
                            className="rounded-lg p-2 text-gray-400 transition-all hover:bg-blue-50 hover:text-primary"
                            title="Edit"
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(project._id)}
                            className="rounded-lg p-2 text-gray-400 transition-all hover:bg-red-50 hover:text-red-600"
                            title="Delete"
                          >
                            <FiTrash2 className="h-4 w-4" />
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
    <ConfirmModal
      isOpen={confirmModal.isOpen}
      title={confirmModal.title}
      message={confirmModal.message}
      onConfirm={() => { closeConfirm(); confirmModal.onConfirm?.(); }}
      onCancel={closeConfirm}
    />
  );
};

export default AdminProjects;