import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  FiGrid, FiUsers, FiMapPin, FiImage, FiPlus, FiArrowRight, 
  FiTrendingUp, FiCheckCircle, FiClock, FiArchive, FiEye, FiEdit2
} from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    projects: { total: 0, published: 0, draft: 0, archived: 0 },
    contractors: 0,
    locations: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, contractorsRes, locationsRes] = await Promise.all([
          axios.get('/projects'),
          axios.get('/contractors'),
          axios.get('/locations')
        ]);

        const projects = projectsRes.data.data || projectsRes.data || [];
        const contractors = contractorsRes.data.data || contractorsRes.data || [];
        const locations = locationsRes.data.data || locationsRes.data || [];

        setStats({
          projects: {
            total: projects.length,
            published: projects.filter(p => p.status === 'Published').length,
            draft: projects.filter(p => p.status === 'Draft').length,
            archived: projects.filter(p => p.status === 'Archived').length
          },
          contractors: contractors.length,
          locations: locations.length
        });

        setRecentProjects(projects.slice(0, 6));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const StatCard = ({ icon: Icon, label, value, trend, color, bgColor, link }) => (
    <Link
      to={link}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-primary/30 relative overflow-hidden"
    >
      {/* Background Gradient */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${bgColor} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 ${bgColor} rounded-xl shadow-lg`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
              <FiTrendingUp className="w-4 h-4" />
              <span>+{trend}%</span>
            </div>
          )}
        </div>
        
        <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/30 border-t-primary"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-primary rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header with Gradient */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Dashboard Overview
            </h1>
            <p className="text-gray-500">Welcome back! Here's what's happening with your projects.</p>
          </div>
          <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <FiPlus className="w-5 h-5" />
            Add New Project
          </Link>
        </div>

        {/* Stats Grid with Modern Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={FiGrid}
            label="Total Projects"
            value={stats.projects.total}
            trend={12}
            color="text-blue-600"
            bgColor="bg-blue-100"
            link="/admin/projects"
          />
          <StatCard
            icon={FiCheckCircle}
            label="Published Projects"
            value={stats.projects.published}
            trend={8}
            color="text-green-600"
            bgColor="bg-green-100"
            link="/admin/projects?status=Published"
          />
          <StatCard
            icon={FiUsers}
            label="Total Contractors"
            value={stats.contractors}
            trend={5}
            color="text-purple-600"
            bgColor="bg-purple-100"
            link="/admin/contractors"
          />
          <StatCard
            icon={FiMapPin}
            label="Locations"
            value={stats.locations}
            trend={3}
            color="text-orange-600"
            bgColor="bg-orange-100"
            link="/admin/locations"
          />
        </div>

        {/* Project Status Overview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Project Status Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/projects?status=Published"
              className="group p-5 border-2 border-green-200 bg-green-50 rounded-xl hover:border-green-400 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <FiCheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-700">{stats.projects.published}</p>
                  <p className="text-sm text-green-600 font-medium">Published</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/projects?status=Draft"
              className="group p-5 border-2 border-yellow-200 bg-yellow-50 rounded-xl hover:border-yellow-400 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <FiClock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-yellow-700">{stats.projects.draft}</p>
                  <p className="text-sm text-yellow-600 font-medium">Drafts</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/projects?status=Archived"
              className="group p-5 border-2 border-gray-200 bg-gray-50 rounded-xl hover:border-gray-400 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <FiArchive className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-700">{stats.projects.archived}</p>
                  <p className="text-sm text-gray-600 font-medium">Archived</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Projects & Quick Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Projects - Takes 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Projects</h2>
              <Link
                to="/admin/projects"
                className="text-sm text-primary hover:text-secondary flex items-center gap-1 font-semibold group"
              >
                View All 
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {recentProjects.length === 0 ? (
              <div className="text-center py-16 px-6">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiGrid className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium mb-2">No projects yet</p>
                <Link
                  to="/admin/projects/new"
                  className="text-primary hover:text-secondary font-semibold inline-flex items-center gap-1"
                >
                  <FiPlus className="w-4 h-4" />
                  Create your first project
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <th className="px-6 py-4">Project</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentProjects.map((project) => (
                      <tr key={project._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {project.cardImage && (
                              <img 
                                src={project.cardImage} 
                                alt={project.name}
                                className="w-12 h-12 rounded-lg object-cover shadow-sm"
                              />
                            )}
                            <div>
                              <Link
                                to={`/admin/projects/${project._id}`}
                                className="text-gray-900 hover:text-primary font-semibold block"
                              >
                                {project.name}
                              </Link>
                              <p className="text-xs text-gray-500">{project.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            project.category === 'Parks' ? 'bg-green-100 text-green-700' :
                            project.category === 'BeachTowns' ? 'bg-orange-100 text-orange-700' :
                            project.category === 'Shores' ? 'bg-blue-100 text-blue-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {project.category === 'BeachTowns' ? 'Beach Towns' : project.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                              project.status === 'Published'
                                ? 'bg-green-100 text-green-700'
                                : project.status === 'Draft'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {project.status === 'Published' && <FiCheckCircle className="w-3 h-3" />}
                            {project.status === 'Draft' && <FiClock className="w-3 h-3" />}
                            {project.status === 'Archived' && <FiArchive className="w-3 h-3" />}
                            {project.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(project.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/projects/${project.slug}`}
                              target="_blank"
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="View"
                            >
                              <FiEye className="w-4 h-4" />
                            </Link>
                            <Link
                              to={`/admin/projects/${project._id}`}
                              className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                              title="Edit"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/admin/projects/new"
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all group border border-blue-200"
                >
                  <div className="p-2 bg-blue-500 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                    <FiGrid className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-800 font-semibold">New Project</span>
                </Link>
                <Link
                  to="/admin/contractors"
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl transition-all group border border-purple-200"
                >
                  <div className="p-2 bg-purple-500 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                    <FiUsers className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-800 font-semibold">Contractors</span>
                </Link>
                <Link
                  to="/admin/media"
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl transition-all group border border-green-200"
                >
                  <div className="p-2 bg-green-500 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                    <FiImage className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-800 font-semibold">Media Library</span>
                </Link>
                <Link
                  to="/admin/settings"
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-xl transition-all group border border-orange-200"
                >
                  <div className="p-2 bg-orange-500 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                    <FiImage className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-800 font-semibold">Site Settings</span>
                </Link>
              </div>
            </div>

            {/* Category Stats Card */}
            <div className="bg-gradient-to-br from-primary via-secondary to-primary rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Projects by Category</h3>
              <div className="space-y-3">
                {[
                  { name: 'Parks', color: 'bg-green-500' },
                  { name: 'BeachTowns', label: 'Beach Towns', color: 'bg-orange-500' },
                  { name: 'Shores', color: 'bg-blue-500' },
                  { name: 'Peaks', color: 'bg-purple-500' }
                ].map((cat) => {
                  const count = recentProjects.filter(p => p.category === cat.name).length;
                  const total = recentProjects.length || 1;
                  const percentage = Math.round((count / total) * 100);
                  
                  return (
                    <div key={cat.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{cat.label || cat.name}</span>
                        <span className="font-bold">{count}</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
