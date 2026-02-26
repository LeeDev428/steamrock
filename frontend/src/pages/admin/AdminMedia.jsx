import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { FiUpload, FiTrash2, FiX, FiFolder, FiImage, FiCopy, FiCheck } from 'react-icons/fi';

const AdminMedia = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [selectedType, setSelectedType] = useState('projects');
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/upload');
      setFiles(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
    setLoading(false);
  };

  const fileTypes = [
    { value: 'projects', label: 'Projects', icon: FiFolder },
    { value: 'contractors', label: 'Contractors', icon: FiImage },
    { value: 'hero', label: 'Hero Images', icon: FiImage }
  ];

  const handleFileUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    setUploading(true);
    const uploadPromises = selectedFiles.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await axios.post(`/upload?type=${selectedType}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
      } catch (error) {
        console.error('Upload error:', error);
        return null;
      }
    });

    await Promise.all(uploadPromises);
    await fetchFiles();
    setUploading(false);
    setUploadModal(false);
  };

  const handleDelete = async (url) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    
    try {
      await axios.delete('/upload', { data: { url } });
      setFiles(files.filter(f => f.url !== url));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete file');
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-800">Media Library</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your uploaded images and files</p>
          </div>
          <button
            onClick={() => setUploadModal(true)}
            className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FiUpload className="w-5 h-5" />
            Upload Files
          </button>
        </div>

        {/* Files Grid */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-12">
              <FiImage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No files uploaded yet</p>
              <button
                onClick={() => setUploadModal(true)}
                className="inline-flex items-center gap-2 text-primary hover:text-secondary"
              >
                <FiUpload className="w-5 h-5" />
                Upload your first file
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {files.map((file, index) => (
                <div key={index} className="relative group border border-gray-200 rounded-lg overflow-hidden hover:border-primary transition-colors">
                  <div className="aspect-square bg-gray-50 flex items-center justify-center">
                    <img
                      src={file.url}
                      alt={file.filename}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center gap-2">
                    <button
                      onClick={() => copyToClipboard(file.url)}
                      className="opacity-0 group-hover:opacity-100 p-2 bg-white rounded-lg hover:bg-gray-100 transition-all"
                      title="Copy URL"
                    >
                      {copiedUrl === file.url ? (
                        <FiCheck className="w-5 h-5 text-green-600" />
                      ) : (
                        <FiCopy className="w-5 h-5 text-gray-700" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(file.url)}
                      className="opacity-0 group-hover:opacity-100 p-2 bg-white rounded-lg hover:bg-red-50 transition-all"
                      title="Delete"
                    >
                      <FiTrash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                  <div className="p-2 bg-white">
                    <p className="text-xs text-gray-500 truncate">{file.filename}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {uploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Upload Files</h2>
              <button
                onClick={() => setUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">File Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {fileTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setSelectedType(type.value)}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        selectedType === type.value
                          ? 'border-primary bg-primary bg-opacity-10 text-primary'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <type.icon className="w-6 h-6 mx-auto mb-1" />
                      <span className="text-xs">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Files</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              {uploading && (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-3 text-gray-600">Uploading...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminMedia;
