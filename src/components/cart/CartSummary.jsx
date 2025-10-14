import { formatPrice } from '../../utils/helpers';

const CartSummary = ({ totalPrice, itemCount, onCheckout }) => {
  const deliveryFee = totalPrice > 5000 ? 0 : 200;
  const finalPrice = totalPrice + deliveryFee;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
      <h3 className="text-xl font-bold mb-4">Підсумок замовлення</h3>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Товарів ({itemCount}):</span>
          <span className="font-medium">{formatPrice(totalPrice)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Доставка:</span>
          <span className="font-medium">
            {deliveryFee === 0 ? 'Безкоштовно' : formatPrice(deliveryFee)}
          </span>
        </div>

        {totalPrice > 0 && totalPrice < 5000 && (
          <p className="text-sm text-blue-600">
            Додайте товарів на {formatPrice(5000 - totalPrice)} для безкоштовної доставки!
          </p>
        )}

        <div className="border-t pt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Всього:</span>
            <span className="text-2xl font-bold text-blue-600">
              {formatPrice(finalPrice)}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={itemCount === 0}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Оформити замовлення
      </button>

      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <p>✓ Безпечна оплата</p>
        <p>✓ Гарантія якості</p>
        <p>✓ Можливість повернення</p>
      </div>
    </div>
  );
};

export default CartSummary;