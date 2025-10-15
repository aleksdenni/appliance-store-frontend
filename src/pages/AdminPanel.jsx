import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, ShoppingCart, Users, Grid, Settings, LogOut,
  Plus, Edit, Trash2, Search, Filter
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { formatPrice, formatDate, getOrderStatusColor } from '../utils/helpers';
import { USER_ROLES, ORDER_STATUSES } from '../utils/constants';
import Loading from '../components/common/Loading';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('products');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user || (user.role !== USER_ROLES.ADMIN && user.role !== USER_ROLES.MANAGER)) {
    navigate('/');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Панель адміністратора</h1>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6 pb-6 border-b">
            <div className="w-20 h-20 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Settings size={40} className="text-purple-600" />
            </div>
            <h2 className="font-bold text-xl">Адмін панель</h2>
            <p className="text-gray-600 text-sm">{user.role}</p>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${
                activeTab === 'products'
                  ? 'bg-purple-50 text-purple-600 font-medium'
                  : 'hover:bg-gray-50'
              }`}
            >
              <Package size={20} />
              Товари
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${
                activeTab === 'orders'
                  ? 'bg-purple-50 text-purple-600 font-medium'
                  : 'hover:bg-gray-50'
              }`}
            >
              <ShoppingCart size={20} />
              Замовлення
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${
                activeTab === 'users'
                  ? 'bg-purple-50 text-purple-600 font-medium'
                  : 'hover:bg-gray-50'
              }`}
            >
              <Users size={20} />
              Користувачі
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${
                activeTab === 'categories'
                  ? 'bg-purple-50 text-purple-600 font-medium'
                  : 'hover:bg-gray-50'
              }`}
            >
              <Grid size={20} />
              Категорії
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-3 transition"
            >
              <LogOut size={20} />
              Вийти
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="md:col-span-3">
          {activeTab === 'products' && <ProductsTab userRole={user.role} />}
          {activeTab === 'orders' && <OrdersTab userRole={user.role} />}
          {activeTab === 'users' && <UsersTab userRole={user.role} />}
          {activeTab === 'categories' && <CategoriesTab userRole={user.role} />}
        </main>
      </div>
    </div>
  );
};

// Products Tab Component
const ProductsTab = ({ userRole }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll({ size: 100 });
      setProducts(data.content || data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей товар?')) return;
    
    try {
      await productService.delete(id);
      loadProducts();
      alert('Товар успішно видалено');
    } catch (error) {
      alert('Помилка при видаленні товару');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Управління товарами</h2>
        {userRole === USER_ROLES.ADMIN && (
          <button className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Додати товар
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Пошук товарів..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Товар</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Ціна</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Склад</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Категорія</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Дії</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.imageUrl || '/api/placeholder/50/50'}
                        alt={product.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-600">{product.model}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.stockQuantity > 10 ? 'bg-green-100 text-green-800' :
                      product.stockQuantity > 0 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.stockQuantity} од.
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">
                      {product.category?.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition">
                        <Edit size={18} />
                      </button>
                      {userRole === USER_ROLES.ADMIN && (
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Orders Tab Component
const OrdersTab = ({ userRole }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? { status: statusFilter } : {};
      const data = await orderService.getMyOrders(params);
      setOrders(data.content || data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      loadOrders();
      alert('Статус замовлення оновлено');
    } catch (error) {
      alert('Помилка при оновленні статусу');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Управління замовленнями</h2>

      {/* Status Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Фільтр за статусом:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field max-w-xs"
        >
          <option value="">Всі замовлення</option>
          {Object.values(ORDER_STATUSES).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loading />
      ) : orders.length === 0 ? (
        <p className="text-gray-600 text-center py-12">Замовлення не знайдено</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Замовлення #{order.id}</h3>
                  <p className="text-sm text-gray-600">
                    Клієнт: {order.user?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Дата: {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600 mb-2">
                    {formatPrice(order.totalPrice)}
                  </p>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order.status)}`}
                  >
                    {Object.values(ORDER_STATUSES).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">
                  Товарів у замовленні: {order.items?.length || 0}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Users Tab Component
const UsersTab = ({ userRole }) => {
  const mockUsers = [
    { id: 1, name: 'Іван Менеджер', email: 'ivan@store.com', role: USER_ROLES.MANAGER },
    { id: 2, name: 'Марія Клієнт', email: 'maria@email.com', role: USER_ROLES.CLIENT },
    { id: 3, name: 'Петро Клієнт', email: 'petro@email.com', role: USER_ROLES.CLIENT },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Управління користувачами</h2>
        {userRole === USER_ROLES.ADMIN && (
          <button className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Додати менеджера
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Ім'я</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Роль</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Дії</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === USER_ROLES.ADMIN ? 'bg-purple-100 text-purple-800' :
                    user.role === USER_ROLES.MANAGER ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition">
                      <Edit size={18} />
                    </button>
                    {userRole === USER_ROLES.ADMIN && user.role !== USER_ROLES.ADMIN && (
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded transition">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Categories Tab Component
const CategoriesTab = ({ userRole }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await productService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Управління категоріями</h2>
        {userRole === USER_ROLES.ADMIN && (
          <button className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Додати категорію
          </button>
        )}
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="grid gap-4">
          {categories.map((category) => (
            <div key={category.id} className="border rounded-lg p-4 flex justify-between items-center hover:shadow-md transition">
              <div>
                <h3 className="font-semibold text-lg">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.itemCount || 0} товарів</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition">
                  <Edit size={18} />
                </button>
                {userRole === USER_ROLES.ADMIN && (
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded transition">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;