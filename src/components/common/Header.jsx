import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import AuthModal from '../auth/AuthModal';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { ROUTES, USER_ROLES } from '../../utils/constants';

const Header = () => {
  const { t } = useTranslation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${searchQuery}`);
    }
  };

  const handleUserClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else if (user.role === USER_ROLES.CLIENT) {
      navigate(ROUTES.DASHBOARD);
    } else {
      navigate(ROUTES.ADMIN);
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={ROUTES.HOME} className="flex items-center gap-2 font-bold text-xl">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
                A
              </div>
              <span className="hidden sm:inline">ApplianceStore</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6">
              <Link to={ROUTES.HOME} className="hover:text-blue-600 transition">
                {t('header.home')}
              </Link>
              <Link to={ROUTES.CATALOG} className="hover:text-blue-600 transition">
                {t('header.catalog')}
              </Link>
              <Link to={ROUTES.ABOUT_US} className="hover:text-blue-600 transition">
                {t('header.about')}
              </Link>
              <Link to={ROUTES.SUPPORT} className="hover:text-blue-600 transition">
                {t('header.support')}
              </Link>
            </nav>

            {/* Search, Cart, User */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="hidden md:flex items-center bg-gray-100 rounded-lg px-4 py-2">
                <Search size={20} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Пошук товарів..."
                  className="bg-transparent outline-none w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              {/* Language Switcher*/}
              <LanguageSwitcher />

              {/* Cart */}
              {user && user.role === USER_ROLES.CLIENT && (
                <button onClick={() => navigate(ROUTES.CART)} className="relative">
                  <ShoppingCart size={24} />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
              )}

              {/* User Button */}
              {user ? (
                <div className="relative group">
                  <button
                    onClick={handleUserClick}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <User size={20} />
                    <span className="hidden sm:inline">{user.name || user.role}</span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                    <button
                      onClick={handleUserClick}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      {user.role === USER_ROLES.CLIENT ? 'Мій кабінет' : 'Адмін панель'}
                    </button>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      {signIn}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <User size={20} />
                  <span className="hidden sm:inline">{t('header.signIn')}</span>
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col gap-4">
                <Link
                  to={ROUTES.HOME}
                  className="hover:text-blue-600 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('header.home')}
                </Link>
                <Link
                  to={ROUTES.CATALOG}
                  className="hover:text-blue-600 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('header.catalog')}
                </Link>
                <Link
                  to="#"
                  className="hover:text-blue-600 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('header.about')}
                </Link>
                <Link
                  to="#"
                  className="hover:text-blue-600 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('header.support')}
                </Link>
              </nav>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mt-4">
                <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
                  <Search size={20} className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder={t('header.search')}
                    className="bg-transparent outline-none w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Header;