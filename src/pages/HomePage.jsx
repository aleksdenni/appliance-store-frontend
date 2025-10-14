import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingCart, Star, Users, ChevronRight } from 'lucide-react';
import ProductGrid from '../components/product/ProductGrid';
import { productService } from '../services/productService';
import { ROUTES } from '../utils/constants';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getAll({ page: 0, size: 8 }),
          productService.getCategories(),
        ]);
        setFeaturedProducts(extractPageContent(productsData));
        setCategories(extractPageContent(categoriesData));
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="bg-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
              Новинки 2025
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-4 leading-tight">
              {t('home.hero.title')}
            </h1>
            <p className="text-gray-600 mb-6 text-lg">
              Відкрийте для себе нашу добірку високоякісної техніки, розробленої для того, щоб зробити ваше життя простішим, а дім – розумнішим.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate(ROUTES.CATALOG)}
                className="btn-primary"
              >
                Почати покупки
              </button>
              <button
                onClick={() => navigate(ROUTES.CATALOG)}
                className="btn-secondary"
              >
                Переглянути каталог
              </button>
            </div>

            <div className="flex gap-8 mt-8">
              <div>
                <div className="text-3xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-gray-600">Товарів</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">50K+</div>
                <div className="text-sm text-gray-600">Задоволених клієнтів</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">4.8★</div>
                <div className="text-sm text-gray-600">Рейтинг</div>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <img
              src="/photo-home-appliances-set-of-household2.jpg"
              alt="Hero"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Купуйте за категоріями</h2>
            <p className="text-gray-600">Перегляньте наш повний вибір побутової техніки</p>
          </div>
          <button
            onClick={() => navigate(ROUTES.CATALOG)}
            className="hidden md:flex items-center gap-2 text-blue-600 hover:underline"
          >
            Всі категорії
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((category) => (
            <button
              key={category.id}
              onClick={() => navigate(`${ROUTES.CATALOG}?category=${category.id}`)}
              className="card p-6 text-center hover:shadow-xl transition-all group"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:bg-blue-200 transition">
                <Package className="text-blue-600" size={32} />
              </div>
              <h3 className="font-medium mb-1 group-hover:text-blue-600 transition">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500">{category.itemCount || 0} товарів</p>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Рекомендовані товари</h2>
            <p className="text-gray-600">Топ-товари, обрані нашими клієнтами</p>
          </div>
          <button
            onClick={() => navigate(ROUTES.CATALOG)}
            className="hidden md:flex items-center gap-2 text-blue-600 hover:underline"
          >
            Переглянути все
            <ChevronRight size={20} />
          </button>
        </div>

        <ProductGrid products={featuredProducts} loading={loading} />

        <div className="text-center mt-8">
          <button
            onClick={() => navigate(ROUTES.CATALOG)}
            className="btn-primary"
          >
            Показати більше товарів
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white rounded-2xl p-8 md:p-12">
        <h2 className="text-3xl font-bold text-center mb-12">Чому обирають нас</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Package size={40} className="text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Кращі ціни</h3>
            <p className="text-gray-600">Конкурентні ціни на всі товари</p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <ShoppingCart size={40} className="text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Безкоштовна доставка</h3>
            <p className="text-gray-600">На замовлення від 5000 грн</p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Star size={40} className="text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Гарантія</h3>
            <p className="text-gray-600">Розширена гарантія на всі товари</p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users size={40} className="text-red-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Підтримка 24/7</h3>
            <p className="text-gray-600">Завжди готові допомогти</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Готові оновити свій дім?
        </h2>
        <p className="text-lg mb-6 opacity-90">
          Приєднуйтесь до тисяч задоволених клієнтів та знайдіть ідеальну техніку для вашої оселі
        </p>
        <button
          onClick={() => navigate(ROUTES.CATALOG)}
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Почати покупки зараз
        </button>
      </section>
    </div>
  );
};

export default HomePage;