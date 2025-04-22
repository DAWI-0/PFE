import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import logoBasket from '../../assets/Logo/basket.png';
import logoFoot from '../../assets/Logo/foot.png';
import logohand from '../../assets/Logo/hand.png';
import logoTennis from '../../assets/Logo/tennis.png';
import fr from "../../assets/flag/fr.png";
import ar from "../../assets/flag/ar.png";
import ang from "../../assets/flag/ang.png";
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
import { MdOutlineTranslate } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

const LayoutUser = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuOpenMobile, setIsMenuOpenMobile] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [showNavbar, setShowNavbar] = useState(true);
  const location = useLocation();
  const menuRef = useRef(null);
  const sidebarLangMenuRef = useRef(null);
  const navbarLangMenuRef = useRef(null);
  const navigate = useNavigate();
  const lang = localStorage.getItem("lang");
  const {t}=useTranslation();
  const defaultLanguage = localStorage.getItem('lang') || 'Fr';
  const defaultDirection = localStorage.getItem('dir') || (defaultLanguage === 'Ar' ? 'rtl' : 'ltr');
  // Parse user data from localStorage with fallback
  const user = JSON.parse(localStorage.getItem('user')) || {
    name: 'Utilisateur',
    profilePhoto: null,
  };
  const [isopen, setIsOpen] = useState(false);
  const [isSidebarLangOpen, setIsSidebarLangOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(lang);

  useEffect(() => {
    if (lang) {
      setSelectedLanguage(lang);
    }
  },[lang]);


  const languages = [
    { flag: fr, code: "Fr" , name: "Français" },
    { flag: ang, code: "En" , name: "English" },
    { flag: ar, code: "Ar" , name: "العربية" },
  ];

  const handleLanguageChange = (code) => {
    setSelectedLanguage(code);
    setIsOpen(false);
    setIsSidebarLangOpen(false);
    localStorage.setItem("lang", code);
    const direction = code === 'Ar' ? 'rtl' : 'ltr';
    localStorage.setItem('dir', direction);
    document.documentElement.dir = direction;
    i18next.changeLanguage(code);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarExpanded(false);
      } else {
        setSidebarExpanded(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isAdmin = user?.role === 'admin';

  // Navigation items for sidebar (admin) and navbar (non-admin)
  const navigationItems = [
    { id: 1, name: t("Accueil"), to: '/home', icon: LayoutDashboard },
    ...(isAdmin ? [{ id: 2, name: t('Stades'), to: '/stades', icon: Store }] : []),
    { id: 3, name: t('Magasin'), to: '/magasin', icon: Store },
    { id: 4, name: t('Commande'), to: '/commande', icon: ShoppingCart },
    ...(isAdmin ? [
      { id: 5, name: t('Gestion des rôles'), to: '/gestion_des_role', icon: UserCog },
      { id: 6, name: t('Gestion des réservations'), to: '/gestion_des_reservation', icon: CalendarRange },
      { id: 8, name: t('Gestion des commandes'), to: '/gestion_des_commendes', icon: ShoppingCart }
    ] : []),
    ...(user?.role === 'propriétaire' ? [
      { id: 7, name: t('Gestion des réservations'), to: '/gestion_des_reservation', icon: CalendarRange }
    ] : []),
    ...(user?.role === 'vendeur' ? [
      { id: 9, name: t('Gestion des commandes'), to: '/gestion_des_commendes', icon: ShoppingCart }
    ] : [])
  ];

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (sidebarLangMenuRef.current && !sidebarLangMenuRef.current.contains(event.target)) {
        setIsSidebarLangOpen(false);
      }
      if (navbarLangMenuRef.current && !navbarLangMenuRef.current.contains(event.target)) {
        setIsOpen(false);
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

  // Get the current selected language flag
  const getCurrentLanguageFlag = () => {
    const currentLang = languages.find(item => item.code === selectedLanguage);
    return currentLang ? currentLang.flag : fr;
  };

  // Render sidebar for admin users
  if (isAdmin) {
    return (
      <div className="flex h-screen bg-gray-100" dir={defaultDirection}>
          <aside 
            className={`
              fixed top-0 ${defaultDirection === 'rtl' ? 'right-0' : 'left-0'} z-30 h-full 
              bg-gray-900 text-white transition-all duration-300 ease-in-out
              ${sidebarExpanded ? 'w-64' : 'w-16'}
              relative z-0
            `}
          >
            <div className="flex h-16 items-center justify-between px-4">
              {sidebarExpanded && (
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  {t("ArenaLink")}
                </span>
              )}
              <button
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                {sidebarExpanded ? 
                  (defaultDirection === 'rtl' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />) : 
                  (defaultDirection === 'rtl' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />)
                }
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
                        <span className={`${defaultDirection === 'rtl' ? 'mr-3' : 'ml-3'} whitespace-nowrap font-medium`}>{item.name}</span>
                      )}
                    </Link>
                  </li>
                ))}
                <li>
                </li>
              </ul>
            </nav>

            {/* Language Selector in Sidebar */}
            <div className={`mt-6 px-4 ${sidebarExpanded ? '' : 'flex justify-center'}`} ref={sidebarLangMenuRef}>
              <div className="relative">
                <button 
                  className={`flex items-center p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors ${sidebarExpanded ? 'w-full justify-between' : 'justify-center'}`}
                  onClick={() => setIsSidebarLangOpen(!isSidebarLangOpen)}
                >
                  <div className="flex items-center">
                    <img 
                      src={getCurrentLanguageFlag()} 
                      alt="Selected language" 
                      className="w-5 h-5 object-cover rounded"
                    />
                    {sidebarExpanded && (
                      <span className={`${defaultDirection === 'rtl' ? 'mr-2' : 'ml-2'}`}>{selectedLanguage}</span>
                    )}
                  </div>
                  {sidebarExpanded && <MdOutlineTranslate size={20} />}
                </button>

                {isSidebarLangOpen && (
                  <ul className={`absolute ${defaultDirection === 'rtl' ? 'right-0' : 'left-0'} mt-1 w-36 border border-gray-700 rounded-md bg-gray-800 shadow-lg overflow-hidden z-10`}>
                    {languages.map((lang) => (
                      <li
                        key={lang.code}
                        className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-700 ${selectedLanguage === lang.code ? 'bg-gray-700' : ''}`}
                        onClick={() => handleLanguageChange(lang.code)}
                      >
                        <img 
                          src={lang.flag} 
                          alt={`Flag ${lang.name}`} 
                          className={`w-5 h-5 object-cover rounded ${defaultDirection === 'rtl' ? 'ml-2' : 'mr-2'}`}
                        />
                        <span className="text-sm">{lang.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className='absolute bottom-0 w-full bg-slate-500'>
              <div className={`items-center justify-between ${!sidebarExpanded ? 'block' : 'flex'} border-t-2 border-gray-600 p-2`}>
                <div className='flex items-center cursor-pointer' onClick={()=>navigate("/profile")}>
                  {user.profile_image ? (
                    <img
                      src={"http://localhost:8000/storage/"+user.profile_image}
                      alt={`${user.name}'s profile`}
                      className={`w-10 h-10 rounded-full object-cover ${defaultDirection === 'rtl' ? 'ml-2' : 'mr-2'}`}
                      onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                    />
                  ) : (
                    <div className={`w-10 h-10 rounded-full ${defaultDirection === 'rtl' ? 'ml-2' : 'mr-2'} bg-green-600 shadow-sm shadow-green-600 flex items-center justify-center text-white text-lg`}>
                      {getInitial(user.name)}
                    </div>
                  )}
                  <span className={`text-white font-semibold ${!sidebarExpanded ? 'hidden' : ''}`}>{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className={`text-red-500 ${defaultDirection === 'rtl' ? 'ml-2' : 'mr-2'} font-semibold hover:scale-110 hover:text-red-600 hover:shadow-2xl hover:shadow-red-600 ${!sidebarExpanded ? 'hidden' : ''}`}
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className={`text-red-500 m-5 font-semibold hover:scale-110 hover:text-red-600 hover:shadow-2xl hover:shadow-red-600 ${!sidebarExpanded ? '' : 'hidden'}`}
            >
              <LogOut size={20} />
            </button>
          </aside>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <main className={`mx-auto ${sidebarExpanded ? '' : defaultDirection === 'rtl' ? 'pl-16' : 'pr-16'} md:p-0`}>
              <Outlet />
            </main>
          </div>
      </div>
    );
  }

  // Regular navbar for non-admin users
  return (
    <div dir={defaultDirection}>
      <nav className="bg-gray-50 text-white fixed top-0 left-0 right-0 z-50 shadow-2xl">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-900">{t("ArenaLink")}</span>
            </div>

            {/* Desktop Navigation */}
            <div className={`hidden sm:flex ${defaultDirection === 'rtl' ? 'sm:space-x-reverse sm:space-x-4' : 'sm:space-x-4'}`}>
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

            <div className='flex items-center'>
              {/* Profile Menu */}
            <div className="flex items-center gap-2" ref={navbarLangMenuRef}>
              <button
                className="text-black"
                onClick={() => setIsOpen(!isopen)}
                aria-label="Toggle lang menu"
              >
                <MdOutlineTranslate size={20} />
              </button>
              {isopen && (
                <ul className={`absolute top-full ${defaultDirection === 'rtl' ? 'left-0' : 'right-0'} mt-1 w-32 border border-gray-300 rounded-md bg-white shadow-lg overflow-hidden z-10 text-black`}>
                  {languages.map((lang) => (
                    <li
                      key={lang.code}
                      className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 ${selectedLanguage === lang.code ? 'bg-gray-100' : ''}`}
                      onClick={() => handleLanguageChange(lang.code)}
                    >
                      <img 
                        src={lang.flag} 
                        alt={`Drapeau ${lang.name}`} 
                        className={`w-6 h-6 object-cover rounded ${defaultDirection === 'rtl' ? 'ml-2' : 'mr-2'}`} 
                      />
                      <span className="text-sm">{lang.name}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div ref={menuRef}>
                <button
                  className="md:flex items-center focus:outline-none hidden"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Toggle profile menu"
                >
                  {user.profile_image ? (
                    <img
                      src={"http://localhost:8000/storage/"+user.profile_image}
                      alt={`${user.name}'s profile`}
                      className={`w-6 h-6 rounded-full object-cover ${defaultDirection === 'rtl' ? 'ml-2' : 'mr-2'}`}
                      onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                    />
                  ) : (
                    <div className={`w-8 h-8 rounded-full ${defaultDirection === 'rtl' ? 'ml-2' : 'mr-2'} bg-green-600 shadow-sm shadow-green-600 flex items-center justify-center text-white text-lg`}>
                      {getInitial(user.name)}
                    </div>
                  )}
                  <span className='text-black font-semibold'>{user.name}</span>
                </button>

                {isMenuOpen && (
                  <div className={`absolute ${defaultDirection === 'rtl' ? 'left-4' : 'right-4'} top-16 w-56 bg-white rounded-lg shadow-lg`}>
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t("Mon Profil")}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        {t("Se déconnecter")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
                {t("Mon Profil")}
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
              >
                {t("Se déconnecter")}
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className={`pt-16 pb-10 min-h-screen`}>
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutUser;