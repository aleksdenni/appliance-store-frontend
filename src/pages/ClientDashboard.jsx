import { useState, useEffect } from 'react';
import { User, Package, Settings, LogOut, CreditCard, MapPin } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { formatPrice, formatDate, getOrderStatusColor } from '../utils/helpers';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import Loading from '../components/common/Loading';
import { useTranslation } from 'react-i18next';

const ClientDashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('orders');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cart, loading: cartLoading, fetchCart, updateCartItem, removeFromCart, getTotalPrice, getTotalItems, clearCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'orders') {
      loadOrders();
    } else if (activeTab === 'cart') {
      fetchCart();
    }
  }, [activeTab]);

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const data = await orderService.getMyOrders();
      setOrders(data.content || data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      const orderData = {
        items: cart.map(item => ({
          applianceId: item.productId,
          quantity: item.quantity
        }))
      };
      
      await orderService.createOrder(orderData);
      clearCart();
      setActiveTab('orders');
      alert('Замовлення успішно створено!');
    } catch (error) {
      alert('Помилка при створенні замовлення');
      console.error(error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Особистий кабінет</h1>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6 pb-6 border-b">
            <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User size={40} className="text-blue-600" />
            </div>
            <h2 className="font-bold text-xl">{user.name}</h2>
            <p className="text-gray-600 text-sm">{user.email}</p>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${
                activeTab === 'orders'
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'hover:bg-gray-50'
              }`}
            >
              <Package size={20} />
              Мої замовлення
            </button>

            <button
              onClick={() => setActiveTab('cart')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${
                activeTab === 'cart'
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'hover:bg-gray-50'
              }`}
            >
              <Package size={20} />
              Кошик
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${
                activeTab === 'profile'
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'hover:bg-gray-50'
              }`}
            >
              <Settings size={20} />
              Налаштування
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
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Мої замовлення</h2>

              {ordersLoading ? (
                <Loading />
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600 text-lg">У вас ще немає замовлень</p>
                  <button
                    onClick={() => navigate('/catalog')}
                    className="btn-primary mt-4"
                  >
                    Почати покупки
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-6 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">Замовлення #{order.id}</h3>
                          <p className="text-sm text-gray-600">
                            Створено: {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-600">Всього товарів: {order.items?.length || 0}</p>
                          </div>
                          <p className="text-xl font-bold text-blue-600">
                            {formatPrice(order.totalPrice)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Cart Tab */}
          {activeTab === 'cart' && (
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold mb-6">Кошик покупок</h2>

                {cartLoading ? (
                  <Loading />
                ) : cart.length === 0 ? (
                  <div className="text-center py-12">
                    <Package size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600 text-lg">Ваш кошик порожній</p>
                    <button
                      onClick={() => navigate('/catalog')}
                      className="btn-primary mt-4"
                    >
                      Почати покупки
                    </button>
                  </div>
                ) : (
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                      {cart.map((item) => (
                        <CartItem
                          key={item.productId}
                          item={item}
                          onUpdateQuantity={updateCartItem}
                          onRemove={removeFromCart}
                        />
                      ))}
                    </div>
                    <div>
                      <CartSummary
                        totalPrice={getTotalPrice()}
                        itemCount={getTotalItems()}
                        onCheckout={handleCheckout}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Налаштування профілю</h2>

              <form className="space-y-6 max-w-2xl">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ім'я</label>
                    <input
                      type="text"
                      defaultValue={user.name}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="input-field"
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <MapPin size={18} />
                    Адреса доставки
                  </label>
                  <textarea
                    defaultValue={user.deliveryAddress}
                    className="input-field"
                    rows="3"
                    placeholder="Введіть адресу доставки"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <CreditCard size={18} />
                    Платіжна картка
                  </label>
                  <input
                    type="text"
                    placeholder="**** **** **** 1234"
                    className="input-field"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Ваші платіжні дані захищені та зашифровані
                  </p>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Зміна паролю</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Поточний пароль</label>
                      <input type="password" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Новий пароль</label>
                      <input type="password" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Підтвердіть новий пароль</label>
                      <input type="password" className="input-field" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button type="submit" className="btn-primary">
                    Зберегти зміни
                  </button>
                  <button type="button" className="btn-secondary">
                    Скасувати
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;