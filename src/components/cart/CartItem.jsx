import { Trash2, Plus, Minus } from 'lucide-react';
import { formatPrice } from '../../utils/helpers';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    onUpdateQuantity(item.productId, newQuantity);
  };

  return (
    <div className="flex gap-4 p-4 border rounded-lg">
      {/* Image */}
      <img
        src={item.imageUrl || '/api/placeholder/100/100'}
        alt={item.name}
        className="w-24 h-24 object-cover rounded"
      />

      {/* Details */}
      <div className="flex-1">
        <h3 className="font-semibold mb-1">{item.name}</h3>
        <p className="text-sm text-gray-600 mb-2">Модель: {item.model}</p>
        <p className="text-lg font-bold text-blue-600">
          {formatPrice(item.price)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => onRemove(item.productId)}
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 size={20} />
        </button>

        <div className="flex items-center border rounded-lg">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="px-3 py-1 hover:bg-gray-100"
          >
            <Minus size={16} />
          </button>
          <span className="px-4 py-1 border-x min-w-[3rem] text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="px-3 py-1 hover:bg-gray-100"
          >
            <Plus size={16} />
          </button>
        </div>

        <p className="font-semibold">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>
    </div>
  );
};

export default CartItem;