import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import logoBasket from '../../assets/Logo/basket.png';
import logoFoot from '../../assets/Logo/foot.png';
import logohand from '../../assets/Logo/hand.png';
import logoTennis from '../../assets/Logo/tennis.png';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  ShoppingCart, 
  Settings,
  UserCog,
  CalendarRange,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const LayoutUser = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuOpenMobile, setIsMenuOpenMobile] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const location = useLocation();
  const menuRef = useRef(null);

  // Parse user data from localStorage with fallback
  const user = JSON.parse(localStorage.getItem('user')) || {
    name: 'Utilisateur',
    profilePhoto: null,
  };

  const isAdmin = user?.role === 'admin';

  // Navigation items for sidebar (admin) and navbar (non-admin)
  const navigationItems = [
    { id: 1, name: 'Accueil', to: '/home', icon: LayoutDashboard },
    ...(isAdmin ? [{ id: 2, name: 'Stades', to: '/stades', icon: Store }] : []),
    { id: 3, name: 'Magasin', to: '/magasin', icon: Store },
    { id: 4, name: 'Commande', to: '/commande', icon: ShoppingCart },
    ...(isAdmin ? [
      { id: 5, name: 'Gestion des rôles', to: '/gestion_des_role', icon: UserCog },
      { id: 6, name: 'Gestion des réservations', to: '/gestion_des_reservation', icon: CalendarRange },
      { id: 8, name: 'Gestion des commandes', to: '/gestion_des_commendes', icon: ShoppingCart }
    ] : []),
    ...(user?.role === 'propriétaire' ? [
      { id: 7, name: 'Gestion des réservations', to: '/gestion_des_reservation', icon: CalendarRange }
    ] : []),
    ...(user?.role === 'vendeur' ? [
      { id: 9, name: 'Gestion des commandes', to: '/gestion_des_commendes', icon: ShoppingCart }
    ] : [])
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/logout', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (!response.ok) throw new Error('Logout failed');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : 'U');

  // Render sidebar for admin users
  if (isAdmin) {
    return (
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <aside 
          className={`
            fixed top-0 left-0 z-30 h-full 
            bg-gray-900 text-white transition-all duration-300 ease-in-out
            ${sidebarExpanded ? 'w-64' : 'w-16'}
            lg:relative lg:z-0
          `}
        >
          <div className="flex h-16 items-center justify-between px-4">
            {sidebarExpanded && (
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                ArenaLink
              </span>
            )}
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              {sidebarExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>

          <nav className="mt-4 px-2">
            <ul className="space-y-1">
              {navigationItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.to}
                    className={`
                      flex items-center py-3 px-4 rounded-lg transition-all duration-200
                      ${location.pathname === item.to 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }
                      ${!sidebarExpanded ? 'justify-center' : ''}
                    `}
                  >
                    <item.icon size={20} />
                    {sidebarExpanded && (
                      <span className="ml-3 whitespace-nowrap font-medium">{item.name}</span>
                    )}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={handleLogout}
                  className={`
                    flex items-center py-3 px-4 rounded-lg transition-all duration-200
                    text-red-400 hover:bg-red-500/20 hover:text-red-300 w-full
                    ${!sidebarExpanded ? 'justify-center' : ''}
                  `}
                >
                  <LogOut size={20} />
                  {sidebarExpanded && (
                    <span className="ml-3 whitespace-nowrap font-medium">Se déconnecter</span>
                  )}
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <main className="container mx-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  // Regular navbar for non-admin users
  return (
    <div>
      <nav className="bg-gray-50 text-white fixed top-0 left-0 right-0 z-50 shadow-2xl">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-900">ArenaLink</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex sm:space-x-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.to}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                    item.to === location.pathname
                      ? 'bg-gray-200 text-gray-900 shadow-md'
                      : 'text-black hover:bg-gray-50 hover:shadow-md'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Profile Menu */}
            <div className="flex items-center" ref={menuRef}>
              <button
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-900 flex items-center justify-center text-sm font-bold">
                  {getInitial(user.name)}
                </div>
                <span className="hidden sm:inline text-sm font-medium text-gray-900">{user.name}</span>
              </button>

              {isMenuOpen && (
                <div className="absolute right-4 top-16 w-56 bg-white rounded-lg shadow-lg">
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mon Profil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Se déconnecter
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden">
              <button
                className="p-2 rounded-md text-gray-900 hover:bg-gray-200"
                onClick={() => setIsMenuOpenMobile(!isMenuOpenMobile)}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpenMobile && (
          <div className="sm:hidden bg-white border-t">
            <div className="py-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.to}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpenMobile(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpenMobile(false)}
              >
                Mon Profil
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="container mx-auto pt-20 pb-10 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutUser;