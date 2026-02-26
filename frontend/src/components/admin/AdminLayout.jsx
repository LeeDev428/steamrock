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
  FiImage,
  FiBell,
  FiSearch,
  FiExternalLink
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
            className="w-full flex items-center justify-between px-4 py-3.5 text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-white/10 group-hover:bg-primary/20 transition-colors">
                <item.icon className="w-4 h-4" />
              </div>
              <span className="font-medium">{item.label}</span>
            </div>
            <FiChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${projectsOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {projectsOpen && (
            <div className="ml-12 mt-1 space-y-1 border-l-2 border-gray-700 pl-4">
              {item.submenu.map((subitem) => (
                <NavLink
                  key={subitem.path}
                  to={subitem.path}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
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
          `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
            isActive
              ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
              : 'text-gray-300 hover:bg-white/5 hover:text-white'
          }`
        }
      >
        <div className={`p-1.5 rounded-lg transition-colors ${
          item.path === window.location.pathname 
            ? 'bg-white/20' 
            : 'bg-white/10 group-hover:bg-primary/20'
        }`}>
          <item.icon className="w-4 h-4" />
        </div>
        <span className="font-medium">{item.label}</span>
      </NavLink>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 w-72 h-full bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 transform transition-transform duration-300 lg:translate-x-0 flex flex-col shadow-2xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo with gradient background */}
        <div className="relative flex items-center justify-between h-20 px-6 border-b border-white/10 flex-shrink-0 bg-gradient-to-r from-primary/20 to-secondary/20">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <img src="/src.png" alt="Logo" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <h1 className="text-white font-display font-bold text-lg leading-tight">Streamrock</h1>
              <p className="text-gray-400 text-xs">Admin Portal</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Admin Profile Card */}
        <div className="px-6 py-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {admin?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">
                {admin?.name || 'Administrator'}
              </p>
              <p className="text-gray-400 text-xs truncate">
                {admin?.email || 'admin@streamrock.com'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation - scrollable */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Main Menu
          </p>
          {navItems.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </nav>

        {/* Logout - fixed at bottom */}
        <div className="flex-shrink-0 p-4 border-t border-white/10 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-gray-300 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all duration-200 group border border-transparent hover:border-red-500/30"
          >
            <div className="p-1.5 rounded-lg bg-white/10 group-hover:bg-red-500/20 transition-colors">
              <FiLogOut className="w-4 h-4" />
            </div>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-72">
        {/* Top header with gradient */}
        <header className="sticky top-0 z-30 h-20 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/50 flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
            >
              <FiMenu className="w-6 h-6" />
            </button>

            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-xl w-80 focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white transition-all">
              <FiSearch className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects, contractors..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
              />
              <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-500 bg-white border border-gray-200 rounded">
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Site Button */}
            <Link
              to="/"
              target="_blank"
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
            >
              <FiExternalLink className="w-4 h-4" />
              <span>View Site</span>
            </Link>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
              <FiBell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Avatar (mobile) */}
            <div className="flex lg:hidden items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                {admin?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Page content with padding */}
        <main className="p-6 lg:p-8 min-h-[calc(100vh-5rem)]">
          {children}
        </main>

        {/* Footer */}
        <footer className="px-6 lg:px-8 py-4 border-t border-gray-200 bg-white text-center text-sm text-gray-500">
          © 2026 Streamrock Realty. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800 flex-shrink-0">
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

        {/* Navigation - scrollable */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </nav>

        {/* Logout - fixed at bottom */}
        <div className="flex-shrink-0 p-4 border-t border-gray-800">
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
