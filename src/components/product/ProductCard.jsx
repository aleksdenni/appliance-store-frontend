import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/helpers';
import { USER_ROLES } from '../../utils/constants';

const ProductCard = ({ product }) => {
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!user || user.role !== USER_ROLES.CLIENT) {
      alert('Будь ласка, увійдіть як клієнт для додавання в кошик');
      return;
    }

    try {
      await addToCart(product.id, 1);
      alert(`${product.name} додано до кошика!`);
    } catch (error) {
      alert('Помилка при додаванні в кошик');
    }
  };

  const handleCardClick = () => {
    if (!product || !product.id) {
      console.error('Product or product.id is undefined:', product);
      return;
    }
    navigate(`/product/${product.id}`);
  };

  if (!product) {
    return null;
  }

  return (
    <div
      onClick={handleCardClick}
      className="card overflow-hidden cursor-pointer group"
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={product.imageUrl || '/api/placeholder/400/300'}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition duration-300"
        />
        
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition"
        >
          <Heart
            size={20}
            className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}
          />
        </button>

        {/* Stock Badge */}
        {product.stockQuantity < 10 && product.stockQuantity > 0 && (
          <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
            Залишилось {product.stockQuantity}
          </span>
        )}

        {product.stockQuantity === 0 && (
          <span className="absolute top-4 left-4 bg-gray-500 text-white px-3 py-1 rounded-full text-sm">
            Немає в наявності
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-sm text-gray-500 mb-1">
          {product.subCategory?.name || 'Техніка'}
        </p>

        {/* Title */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center mb-2">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium">{product.rating}</span>
            {product.reviews && (
              <span className="ml-1 text-sm text-gray-500">({product.reviews})</span>
            )}
          </div>
        )}

        {/* Manufacturer */}
        {product.manufacturer && (
          <p className="text-sm text-gray-600 mb-3">
            Виробник: {product.manufacturer.name}
          </p>
        )}

        {/* Price and Cart */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-blue-600">
              {formatPrice(product.price)}
            </span>
          </div>
          
          {user && user.role === USER_ROLES.CLIENT && product.stockQuantity > 0 && (
            <button
              onClick={handleAddToCart}
              className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition"
              title="Додати в кошик"
            >
              <ShoppingCart size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;