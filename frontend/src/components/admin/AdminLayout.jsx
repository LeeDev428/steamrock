import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome,
  FiGrid,
  FiMapPin,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronDown,
  FiImage
} from 'react-icons/fi';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(true);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
    {
      label: 'Projects',
      icon: FiGrid,
      submenu: [
        { path: '/admin/projects', label: 'All Projects' },
        { path: '/admin/projects/new', label: 'Add New' },
        { path: '/admin/projects?category=Parks', label: 'Parks' },
        { path: '/admin/projects?category=BeachTowns', label: 'Beach Towns' },
        { path: '/admin/projects?category=Shores', label: 'Shores' },
        { path: '/admin/projects?category=Peaks', label: 'Peaks' }
      ]
    },
    { path: '/admin/contractors', icon: FiUsers, label: 'Contractors' },
    { path: '/admin/locations', icon: FiMapPin, label: 'Locations' },
    { path: '/admin/media', icon: FiImage, label: 'Media' },
    { path: '/admin/settings', icon: FiSettings, label: 'Settings' }
  ];

  const NavItem = ({ item }) => {
    if (item.submenu) {
      return (
        <div>
          <button
            onClick={() => setProjectsOpen(!projectsOpen)}
            className="w-full flex items-center justify-between px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </div>
            <FiChevronDown
              className={`w-4 h-4 transition-transform ${projectsOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {projectsOpen && (
            <div className="ml-8 mt-1 space-y-1">
              {item.submenu.map((subitem) => (
                <NavLink
                  key={subitem.path}
                  to={subitem.path}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  {subitem.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive
              ? 'bg-primary text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`
        }
      >
        <item.icon className="w-5 h-5" />
        <span>{item.label}</span>
      </NavLink>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-full bg-gray-900 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
          <Link to="/admin/dashboard" className="text-white font-display font-bold text-lg">
            Streamrock Admin
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <FiMenu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <Link
              to="/"
              target="_blank"
              className="text-sm text-gray-600 hover:text-primary"
            >
              View Site →
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {admin?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {admin?.name || 'Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
