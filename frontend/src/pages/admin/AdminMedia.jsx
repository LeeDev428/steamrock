import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { useToast } from '../../components/Toast';
import ImageDropzone from '../../components/admin/ImageDropzone';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { cldUrl } from '../../utils/cloudinary';
import {
  FiFilter,
  FiImage,
  FiLayers,
  FiTrash2,
  FiUpload,
  FiX
} from 'react-icons/fi';

const projectCategories = ['Parks', 'BeachTowns', 'Shores', 'Peaks'];
const blogCategories = ['Real Estate Tips', 'Market Updates', 'Investment Guide', 'Property Showcase', 'Company News', 'Lifestyle'];

const AdminMedia = () => {
  const toast = useToast();
  const [files, setFiles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [assignmentModal, setAssignmentModal] = useState({ open: false, file: null });
  const [uploading, setUploading] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const [filters, setFilters] = useState({
    type: '',
    projectCategory: '',
    projectName: '',
    blogCategory: '',
    blogName: ''
  });
  const [assignment, setAssignment] = useState({
    targetType: 'project',
    projectCategory: 'Parks',
    projectId: '',
    projectField: 'cardImage',
    blogCategory: 'Real Estate Tips',
    blogId: ''
  });

  useEffect(() => {
    fetchFiles();
    fetchProjects();
    fetchBlogs();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/upload');
      setFiles(Array.isArray(res.data) ? res.data : []);
      setSelectedIds([]);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to fetch media files');
    }
    setLoading(false);
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/projects');
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await axios.get('/blogs');
      setBlogs(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const filteredProjects = projects.filter((project) => project.category === assignment.projectCategory);
  const filteredBlogs = blogs.filter((blog) => blog.category === assignment.blogCategory);

  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      if (filters.type && file.type !== filters.type) {
        return false;
      }

      if (filters.type === 'projects') {
        if (filters.projectCategory && file.category !== filters.projectCategory) {
          return false;
        }

        if (filters.projectName && !String(file.entity || '').toLowerCase().includes(filters.projectName.toLowerCase())) {
          return false;
        }
      }

      if (filters.type === 'blogs') {
        if (filters.blogCategory && file.category !== filters.blogCategory) {
          return false;
        }

        if (filters.blogName && !String(file.entity || '').toLowerCase().includes(filters.blogName.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [files, filters]);

  useEffect(() => {
    if (filteredProjects.length > 0) {
      setAssignment((current) => ({
        ...current,
        projectId: filteredProjects[0]._id
      }));
    }
  }, [assignment.projectCategory, projects.length]);

  useEffect(() => {
    if (filteredBlogs.length > 0) {
      setAssignment((current) => ({
        ...current,
        blogId: filteredBlogs[0]._id
      }));
    }
  }, [assignment.blogCategory, blogs.length]);

  const handleConfirmUpload = async () => {
    if (pendingFiles.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    setUploading(true);
    try {
      await Promise.all(pendingFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        await axios.post('/upload?type=general&field=media-library', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }));

      toast.success('Files uploaded successfully');
      await fetchFiles();
      setPendingFiles([]);
      setUploadModal(false);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload files');
    }
    setUploading(false);
  };

  const handleDelete = (file) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete File',
      message: 'Are you sure you want to permanently delete this file? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await axios.delete('/upload', { data: { publicId: file.publicId, url: file.url } });
          await fetchFiles();
          toast.success('File deleted successfully');
        } catch (error) {
          console.error('Delete error:', error);
          toast.error('Failed to delete file');
        }
      }
    });
  };

  const handleToggleFile = (fileId) => {
    setSelectedIds((current) => (
      current.includes(fileId)
        ? current.filter((id) => id !== fileId)
        : [...current, fileId]
    ));
  };

  const handleToggleAll = () => {
    const visibleIds = filteredFiles.map((file) => file._id).filter(Boolean);
    if (visibleIds.length === 0) return;

    const allSelected = visibleIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((current) => current.filter((id) => !visibleIds.includes(id)));
      return;
    }

    setSelectedIds((current) => Array.from(new Set([...current, ...visibleIds])));
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      toast.error('Please select files to delete');
      return;
    }
    setConfirmModal({
      isOpen: true,
      title: 'Delete Selected Files',
      message: `Are you sure you want to permanently delete ${selectedIds.length} selected file(s)? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await axios.delete('/upload/bulk', { data: { ids: selectedIds } });
          toast.success('Selected files deleted successfully');
          setSelectedIds([]);
          await fetchFiles();
        } catch (error) {
          console.error('Bulk delete error:', error);
          toast.error(error.response?.data?.message || 'Failed to delete selected files');
        }
      }
    });
  };

  const handleAssignImage = async () => {
    if (!assignmentModal.file) return;

    try {
      if (assignment.targetType === 'project') {
        if (!assignment.projectId) {
          toast.error('Please select a project');
          return;
        }

        await axios.post('/upload/assign', {
          url: assignmentModal.file.url,
          targetType: 'project',
          targetId: assignment.projectId,
          targetField: assignment.projectField
        });
      } else {
        if (!assignment.blogId) {
          toast.error('Please select a blog');
          return;
        }

        await axios.post('/upload/assign', {
          url: assignmentModal.file.url,
          targetType: 'blog',
          targetId: assignment.blogId,
          targetField: 'featuredImage'
        });
      }

      toast.success('Image assigned successfully');
      setAssignmentModal({ open: false, file: null });
    } catch (error) {
      console.error('Assignment error:', error);
      toast.error(error.response?.data?.message || 'Failed to assign image');
    }
  };

  return (
    <>
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-800">Media Library</h1>
            <p className="mt-1 text-sm text-gray-500">Cloudinary media manager for project and blog assets</p>
          </div>
          <button
            onClick={() => setUploadModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-secondary"
          >
            <FiUpload className="h-5 w-5" />
            Upload Files
          </button>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 text-sm text-gray-600">
              <FiFilter className="h-4 w-4" />
              Filters
            </div>
            <select
              value={filters.type}
              onChange={(event) => setFilters((current) => ({
                ...current,
                type: event.target.value,
                projectCategory: '',
                projectName: '',
                blogCategory: '',
                blogName: ''
              }))}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All Types</option>
              <option value="projects">Projects</option>
              <option value="blogs">Blogs</option>
              <option value="contractors">Contractors</option>
              <option value="general">General</option>
            </select>

            {filters.type === 'projects' && (
              <>
                <select
                  value={filters.projectCategory}
                  onChange={(event) => setFilters((current) => ({ ...current, projectCategory: event.target.value }))}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">All Project Categories</option>
                  {projectCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Project name"
                  value={filters.projectName}
                  onChange={(event) => setFilters((current) => ({ ...current, projectName: event.target.value }))}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </>
            )}

            {filters.type === 'blogs' && (
              <>
                <select
                  value={filters.blogCategory}
                  onChange={(event) => setFilters((current) => ({ ...current, blogCategory: event.target.value }))}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">All Blog Categories</option>
                  {blogCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Blog title"
                  value={filters.blogName}
                  onChange={(event) => setFilters((current) => ({ ...current, blogName: event.target.value }))}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </>
            )}

            <button
              onClick={() => setFilters({ type: '', projectCategory: '', projectName: '', blogCategory: '', blogName: '' })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Clear
            </button>
          </div>

          {filteredFiles.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={filteredFiles.length > 0 && filteredFiles.every((file) => selectedIds.includes(file._id))}
                  onChange={handleToggleAll}
                  className="h-4 w-4 rounded border-gray-300"
                />
                Select all shown
              </label>
              <button
                onClick={handleBulkDelete}
                disabled={selectedIds.length === 0}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiTrash2 className="h-4 w-4" />
                Delete Selected ({selectedIds.length})
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="py-12 text-center">
              <FiImage className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <p className="mb-4 text-gray-500">No files match your filter</p>
              <button
                onClick={() => setUploadModal(true)}
                className="inline-flex items-center gap-2 text-primary hover:text-secondary"
              >
                <FiUpload className="h-5 w-5" />
                Upload your first file
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {filteredFiles.map((file) => (
                <div key={file._id || file.publicId || file.url} className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-colors hover:border-primary">
                  <div className="aspect-square bg-gray-50">
                    <img src={cldUrl(file.url, { w: 400 })} alt={file.filename} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                  </div>
                  <div className="space-y-1 bg-white p-2">
                    <label className="inline-flex items-center gap-2 text-xs text-gray-500">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(file._id)}
                        onChange={() => handleToggleFile(file._id)}
                        className="h-3.5 w-3.5 rounded border-gray-300"
                      />
                      Select
                    </label>
                    <p className="truncate text-xs text-gray-500">{file.filename}</p>
                    <p className="truncate text-[11px] text-gray-400">{file.folder || 'StreamRock'}</p>
                    <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => setAssignmentModal({ open: true, file })}
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-gray-900 px-2 py-1.5 text-xs font-medium text-white hover:bg-black"
                    >
                        <FiLayers className="h-3.5 w-3.5" />
                        Assign
                    </button>
                    <button
                      onClick={() => handleDelete(file)}
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-red-50 px-2 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                    >
                        <FiTrash2 className="h-3.5 w-3.5" />
                        Delete
                    </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {uploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-semibold text-gray-800">Upload Files</h2>
              <button
                onClick={() => setUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 p-4">
              <ImageDropzone
                accept="image/*,video/*"
                multiple
                files={pendingFiles}
                onFilesSelected={(newFiles) => setPendingFiles((current) => [...current, ...newFiles])}
                onRemove={(indexToRemove) => setPendingFiles((current) => current.filter((_, index) => index !== indexToRemove))}
                buttonLabel="Select Files"
                helperText="Drag and drop images/videos here. Files upload only after you click Confirm Upload."
              />

              <div className="flex justify-end gap-2 border-t pt-3">
                <button
                  onClick={() => {
                    setUploadModal(false);
                    setPendingFiles([]);
                  }}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmUpload}
                  disabled={uploading || pendingFiles.length === 0}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Confirm Upload'}
                </button>
              </div>

              {uploading && (
                <div className="flex items-center justify-center py-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                  <span className="ml-3 text-gray-600">Uploading...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {assignmentModal.open && assignmentModal.file && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-semibold text-gray-800">Use Image</h2>
              <button
                onClick={() => setAssignmentModal({ open: false, file: null })}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 p-4">
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <img src={cldUrl(assignmentModal.file.url, { w: 800 })} alt={assignmentModal.file.filename} className="h-44 w-full object-cover" decoding="async" />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setAssignment({ ...assignment, targetType: 'project' })}
                  className={`rounded-lg px-3 py-2 text-sm font-medium ${
                    assignment.targetType === 'project' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Project
                </button>
                <button
                  onClick={() => setAssignment({ ...assignment, targetType: 'blog' })}
                  className={`rounded-lg px-3 py-2 text-sm font-medium ${
                    assignment.targetType === 'blog' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Blog
                </button>
              </div>

              {assignment.targetType === 'project' ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <select
                    value={assignment.projectCategory}
                    onChange={(event) => setAssignment({ ...assignment, projectCategory: event.target.value, projectId: '' })}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    {projectCategories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <select
                    value={assignment.projectId}
                    onChange={(event) => setAssignment({ ...assignment, projectId: event.target.value })}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    {filteredProjects.length === 0 && <option value="">No projects found</option>}
                    {filteredProjects.map((project) => (
                      <option key={project._id} value={project._id}>{project.name}</option>
                    ))}
                  </select>
                  <select
                    value={assignment.projectField}
                    onChange={(event) => setAssignment({ ...assignment, projectField: event.target.value })}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="cardImage">Card Image</option>
                    <option value="heroImage">Hero Image</option>
                    <option value="gallery">Gallery</option>
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <select
                    value={assignment.blogCategory}
                    onChange={(event) => setAssignment({ ...assignment, blogCategory: event.target.value, blogId: '' })}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    {blogCategories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <select
                    value={assignment.blogId}
                    onChange={(event) => setAssignment({ ...assignment, blogId: event.target.value })}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    {filteredBlogs.length === 0 && <option value="">No blogs found</option>}
                    {filteredBlogs.map((blog) => (
                      <option key={blog._id} value={blog._id}>{blog.title}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setAssignmentModal({ open: false, file: null })}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignImage}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary"
                >
                  Use This Image
                </button>
              </div>
            </div>
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

export default AdminMedia;