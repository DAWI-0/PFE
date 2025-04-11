import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const LayoutUser = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Navigation items
  const navItems = [
    { id: 1, name: 'Acceuil', to: '/home' },
    { id: 2, name: 'Magasin', to: '/store' },
    { id: 3, name: 'Commande', to: '/commande' },
  ];

  // User data (replace with actual user data)
  const [user, setUser] = useState({
    name: 'Utilisateur',
    email: 'user@example.com',
    profilePhoto: 'https://via.placeholder.com/30x30?text=U', // Placeholder image URL
  });

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600 tracking-wider">VotreLogo</span>
            </div>

            {/* Navigation links */}
            <div className="hidden sm:flex sm:space-x-8">
              {navItems.map(item => (
                <Link
                  key={item.id}
                  to={item.to}
                  onClick={() => console.log(`Navigating to ${item.to}`)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    item.to === location.pathname ? 'text-blue-600' : 'text-gray-700 hover:text-blue-500'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Profile section */}
            <div className="flex items-center">
              <div className="relative flex items-center text-sm font-medium text-gray-700 hover:text-blue-500">
                <button
                  className="flex items-center focus:outline-none"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {/* Profile Photo */}
                  <img
                    src={user.profilePhoto} // Display the profile photo
                    alt="Profile Photo"
                    className="w-6 h-6 rounded-full mr-2"
                  />

                  {/* User Name */}
                  <span>{user.name}</span>
                </button>

                {/* Profile dropdown menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      {/* Mon Profile Link */}
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Mon Profile
                      </Link>

                      {/* Logout Link */}
                      <Link
                        to="/login"
                        onClick={() => {
                          localStorage.removeItem('authToken'); // Clear token
                          window.location.href = '/login'; // Redirect to login
                        }}
                        className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                      >
                        Se déconnecter
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Ouvrir le menu</span>
                {!isMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map(item => (
                <Link
                  key={item.id}
                  to={item.to}
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="container mx-auto pt-20 pb-10">
        <Outlet /> {/* Render child routes */}
      </main>
    </div>
  );
};

export default LayoutUser;