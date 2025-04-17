import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import logoBasket from '../../assets/Logo/basket.png';
import logoFoot from '../../assets/Logo/foot.png';
import logohand from '../../assets/Logo/hand.png';
import logoTennis from '../../assets/Logo/tennis.png';

const LayoutUser = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
  const [isMenuOpenMobile, setIsMenuOpenMobile] = useState(false);

  // Navigation items
  const navItems = [
  ];
  
  // Parse user data from localStorage with fallback
  const user = JSON.parse(localStorage.getItem('user')) || {
    name: 'Utilisateur',
    profilePhoto: null,
  };
  
  navItems.push({ id: 1, name: 'Accueil', to: '/home' });
  user?.role === "admin" && navItems.push({ id: 2, name: 'Stades', to: '/stades' });
  navItems.push(
    { id: 3, name: 'Magasin', to: '/magasin' },
    { id: 4, name: 'Commande', to: '/commande' },
  )
  user?.role === "admin" && navItems.push({ id: 5, name: 'Gestion des roles', to: '/gestion_des_role' });
  user?.role === "admin" && navItems.push({ id: 6, name: 'Gestion des commendes', to: '/gestion_des_commendes' });
  user?.role === "vendeur" && navItems.push({ id: 7, name: 'Gestion des commendes', to: '/gestion_des_commendes' });
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/logout', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get first letter of user's name for fallback icon
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <div>
      <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="relative mb-12 w-48">
                <img
                  src={logoBasket}
                  alt="ArenaLink Basket"
                  className="absolute top-0 left-0 opacity-0 animate-changeLogo"
                  style={{ animationDelay: '0s' }}
                />
                <img
                  src={logoFoot}
                  alt="ArenaLink Foot"
                  className="absolute top-0 left-0 opacity-0 animate-changeLogo"
                  style={{ animationDelay: '2s' }}
                />
                <img
                  src={logohand}
                  alt="ArenaLink Hand"
                  className="absolute top-0 left-0 opacity-0 animate-changeLogo"
                  style={{ animationDelay: '4s' }}
                />
                <img
                  src={logoTennis}
                  alt="ArenaLink Tennis"
                  className="absolute top-0 left-0 opacity-0 animate-changeLogo"
                  style={{ animationDelay: '6s' }}
                />
              </div>
            </div>

            <div className="hidden sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.to}
                  onClick={() => console.log(`Navigating to ${item.to}`)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    item.to === location.pathname
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-blue-500'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center" ref={menuRef}>
              <div className="relative flex items-center text-sm font-medium text-gray-700 hover:text-blue-500">
                <button
                  className="flex items-center focus:outline-none"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Toggle profile menu"
                >
                  {user.profile_image ? (
                    <img
                      src={"http://localhost:8000/storage/"+user.profile_image}
                      alt={`${user.name}'s profile`}
                      className="w-6 h-6 rounded-full object-cover mr-2"
                      onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full mr-2 bg-blue-500 flex items-center justify-center text-white text-sm">
                      {getInitial(user.name)}
                    </div>
                  )}
                  <span>{user.name}</span>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 top-full">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Mon Profil
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                      >
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                onClick={() => setIsMenuOpenMobile(!isMenuOpenMobile)}
                aria-label="Toggle mobile menu"
              >
                <span className="sr-only">Ouvrir le menu</span>
                {!isMenuOpenMobile ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpenMobile && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.to}
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsMenuOpenMobile(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/profile"
                className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpenMobile(false)}
              >
                Mon Profil
              </Link>
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-base font-medium text-red-500 hover:bg-gray-100"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="container mx-auto pt-20 pb-10">
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutUser;