import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Loading from './components/common/Loading';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ClientDashboard from './pages/ClientDashboard';
import AdminPanel from './pages/AdminPanel';
import { ROUTES, USER_ROLES } from './utils/constants';
import { useAuth } from './hooks/useAuth'; 
import AuthModal from './components/auth/AuthModal';

// Protected Route Component
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  // перевірка покаже спіннер, поки йде перевірка юзера.
  if (loading) return <Loading />;
  
  if (!user) return <Navigate to={ROUTES.HOME} />;
  
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={ROUTES.HOME} />;
  }

  return children;
};

function App() {
  const { isAuthModalOpen, closeAuthModal } = useAuth();


  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>

          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.CATALOG} element={<CatalogPage />} />
          <Route path={ROUTES.PRODUCT} element={<ProductDetailPage />} />
          
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute roles={[USER_ROLES.CLIENT]}>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path={ROUTES.ADMIN}
            element={
              <ProtectedRoute roles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER]}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </div>
  );
}

export default App;