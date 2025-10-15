import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, ShoppingCart, Heart, Package, Shield, Truck } from 'lucide-react';
import { productService } from '../services/productService';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/helpers';
import { USER_ROLES } from '../utils/constants';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { useTranslation } from 'react-i18next';

const ProductDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getById(id);
      setProduct(data);
    } catch (err) {
      setError('Не вдалося завантажити товар');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user || user.role !== USER_ROLES.CLIENT) {
      alert('Будь ласка, увійдіть як клієнт для додавання в кошик');
      return;
    }

    try {
      await addToCart(product.id, quantity);
      alert(`${product.name} додано до кошика!`);
    } catch (error) {
      alert('Помилка при додаванні в кошик');
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="max-w-7xl mx-auto px-4 py-8"><ErrorMessage message={error} /></div>;
  if (!product) return <div className="max-w-7xl mx-auto px-4 py-8">Товар не знайдено</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
      >
        <ChevronLeft size={20} />
        Назад до каталогу
      </button>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div>
            <div className="relative">
              <img
                src={product.imageUrl || '/api/placeholder/600/600'}
                alt={product.name}
                className="w-full rounded-lg"
              />
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="absolute top-4 right-4 bg-white rounded-full p-3 hover:bg-gray-100 shadow-lg"
              >
                <Heart
                  size={24}
                  className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                />
              </button>
            </div>
          </div>

          {/* Details */}
          <div>
            {/* Category */}
            <p className="text-sm text-gray-500 mb-2">
              {product.category?.name}
            </p>

            {/* Title */}
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {product.rating} ({product.reviews || 0} відгуків)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {formatPrice(product.price)}
              </div>
              {product.stockQuantity > 0 ? (
                <p className="text-green-600 font-medium">✓ В наявності ({product.stockQuantity} од.)</p>
              ) : (
                <p className="text-red-600 font-medium">Немає в наявності</p>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Опис</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description || 'Високоякісна техніка, розроблена для сучасних домівок.'}
              </p>
            </div>

            {/* Specifications */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Характеристики</h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between border-b pb-2">
                  <span>Модель:</span>
                  <span className="font-medium">{product.model}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Виробник:</span>
                  <span className="font-medium">{product.manufacturer?.name}</span>
                </div>
                {product.power && (
                  <div className="flex justify-between border-b pb-2">
                    <span>Потужність:</span>
                    <span className="font-medium">{product.power} Вт</span>
                  </div>
                )}
                {product.powerType && (
                  <div className="flex justify-between border-b pb-2">
                    <span>Тип живлення:</span>
                    <span className="font-medium">{product.powerType}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            {user && user.role === USER_ROLES.CLIENT && product.stockQuantity > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium">Кількість:</span>
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-6 py-2 border-x min-w-[4rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      className="px-4 py-2 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Додати в кошик
                </button>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <Truck className="text-blue-600" size={24} />
                </div>
                <p className="text-sm text-gray-600">Безкоштовна доставка</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <Shield className="text-green-600" size={24} />
                </div>
                <p className="text-sm text-gray-600">Гарантія 2 роки</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <Package className="text-purple-600" size={24} />
                </div>
                <p className="text-sm text-gray-600">Легке повернення</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
