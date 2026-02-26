import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { FiGrid, FiUsers, FiMapPin, FiImage, FiPlus, FiArrowRight } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    projects: { total: 0, published: 0, draft: 0 },
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

        const projects = projectsRes.data.data || [];
        const contractors = contractorsRes.data.data || [];
        const locations = locationsRes.data.data || [];

        setStats({
          projects: {
            total: projects.length,
            published: projects.filter(p => p.status === 'Published').length,
            draft: projects.filter(p => p.status === 'Draft').length
          },
          contractors: contractors.length,
          locations: locations.length
        });

        setRecentProjects(projects.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color, link }) => (
    <Link
      to={link}
      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold text-gray-800">Dashboard</h1>
          <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FiPlus className="w-5 h-5" />
            Add Project
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={FiGrid}
            label="Total Projects"
            value={stats.projects.total}
            color="bg-blue-500"
            link="/admin/projects"
          />
          <StatCard
            icon={FiGrid}
            label="Published"
            value={stats.projects.published}
            color="bg-green-500"
            link="/admin/projects?status=Published"
          />
          <StatCard
            icon={FiUsers}
            label="Contractors"
            value={stats.contractors}
            color="bg-purple-500"
            link="/admin/contractors"
          />
          <StatCard
            icon={FiMapPin}
            label="Locations"
            value={stats.locations}
            color="bg-orange-500"
            link="/admin/locations"
          />
        </div>

        {/* Quick Actions & Recent Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/admin/projects/new"
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiGrid className="w-5 h-5 text-primary" />
                <span className="text-gray-700">Add New Project</span>
              </Link>
              <Link
                to="/admin/contractors"
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiUsers className="w-5 h-5 text-primary" />
                <span className="text-gray-700">Manage Contractors</span>
              </Link>
              <Link
                to="/admin/settings"
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiImage className="w-5 h-5 text-primary" />
                <span className="text-gray-700">Edit Homepage</span>
              </Link>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Recent Projects</h2>
              <Link
                to="/admin/projects"
                className="text-sm text-primary hover:text-secondary flex items-center gap-1"
              >
                View All <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {recentProjects.length === 0 ? (
              <div className="text-center py-8">
                <FiGrid className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No projects yet</p>
                <Link
                  to="/admin/projects/new"
                  className="text-primary hover:text-secondary mt-2 inline-block"
                >
                  Create your first project
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b">
                      <th className="pb-3 font-medium">Name</th>
                      <th className="pb-3 font-medium">Category</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProjects.map((project) => (
                      <tr key={project._id} className="border-b last:border-0">
                        <td className="py-3">
                          <Link
                            to={`/admin/projects/${project._id}`}
                            className="text-gray-800 hover:text-primary font-medium"
                          >
                            {project.name}
                          </Link>
                        </td>
                        <td className="py-3">
                          <span className="text-sm text-gray-600">{project.category}</span>
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              project.status === 'Published'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {project.status}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-gray-500">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Category Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Projects by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Parks', 'BeachTowns', 'Shores', 'Peaks'].map((category) => {
              const count = recentProjects.filter(p => p.category === category).length;
              return (
                <Link
                  key={category}
                  to={`/admin/projects?category=${category}`}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
                >
                  <p className="text-2xl font-bold text-primary">{count}</p>
                  <p className="text-sm text-gray-600">
                    {category === 'BeachTowns' ? 'Beach Towns' : category}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
