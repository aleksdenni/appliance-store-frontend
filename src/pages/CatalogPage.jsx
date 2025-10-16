import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List, SlidersHorizontal } from 'lucide-react';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import { productService } from '../services/productService';
import { useTranslation } from 'react-i18next';
import { extractPageContent, extractPaginationInfo } from '../utils/helpers';

const CatalogPage = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('priceLowToHigh');
  const [showFilters, setShowFilters] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const [pagination, setPagination] = useState({
    page: 0,
    size: 12,
    totalPages: 0,
    totalElements: 0,
  });

  const [filters, setFilters] = useState({
    categoryId: '',
    minPrice: '',
    maxPrice: '',
    manufacturerIds: [],
    inStock: false,
  });

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setFilters(prev => ({
        ...prev,
        categoryId: categoryFromUrl
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [filters, sortBy, pagination.page, searchParams]);

  const loadCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories(extractPageContent(data));
    } catch (error) {
      console.error('Failed to load categories:', error);
      setCategories([]);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);

      const params = {
        page: pagination.page,
        size: pagination.size,
        sort: getSortParam(sortBy),
      };

      // пошук якщо є
      const searchQuery = searchParams.get('search');
      if (searchQuery) {
        params.search = searchQuery;
      }

      // Перевіряємо categoryId з фільтрів або з URL
      // з юрл краще не перевіряти :)
      if (filters.categoryId) {
        params.categoryId = parseInt(filters.categoryId);
      }

      // ціновий діапазон
      if (filters.minPrice) {
        params.minPrice = parseInt(filters.minPrice);
      }
      if (filters.maxPrice) {
        params.maxPrice = parseInt(filters.maxPrice);
      }

      // виробників
      if (filters.manufacturerIds && filters.manufacturerIds.length > 0) {
        params.manufacturerIds = filters.manufacturerIds;
      }

      // фільтр наявності
      if (filters.inStock === true) {
        params.inStock = true;
      }

      console.log('=== ДІАГНОСТИКА ФІЛЬТРІВ ===');
      console.log('filters.categoryId:', filters.categoryId);
      console.log('type of categoryId:', typeof filters.categoryId);
      console.log('searchParams category:', searchParams.get('category'));

      console.log('API Request params:', params); // Для діагностики
      console.log('📤 Sending API Request:');
      console.log('  URL:', '/api/v1/appliances');
      console.log('  Params:', JSON.stringify(params, null, 2));
      console.log('  manufacturerIds type:', typeof params.manufacturerIds);
      console.log('  manufacturerIds value:', params.manufacturerIds);

      const data = await productService.getAll(params);

      console.log('📥 Received API Response:');
      console.log('  Total elements:', data.totalElements);
      console.log('  Total pages:', data.totalPages);
      console.log('  Products count:', data.content?.length);

      setProducts(extractPageContent(data));
      const paginationInfo = extractPaginationInfo(data);
      setPagination({
        page: paginationInfo.currentPage,
        size: paginationInfo.pageSize,
        totalPages: paginationInfo.totalPages,
        totalElements: paginationInfo.totalElements,
      });
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getSortParam = (sortValue) => {
    const sortMap = {
      priceLowToHigh: 'price,asc',
      priceHighToLow: 'price,desc',
      newest: 'id,desc',
    };
    return sortMap[sortValue] || 'price,asc';
  };

const handleFilterChange = (newFilters) => {
  setFilters(newFilters);
  setPagination(prev => ({ ...prev, page: 0 }));

  // Оновлюємо URL, щоб він відповідав фільтрам
  const newSearchParams = new URLSearchParams(searchParams);
  if (newFilters.categoryId) {
    newSearchParams.set('category', newFilters.categoryId);
  } else {
    newSearchParams.delete('category'); // Видаляємо параметр, якщо категорію скинуто
  }
  // { replace: true } запобігає створенню зайвих записів в історії браузера
  setSearchParams(newSearchParams, { replace: true });
};

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {t('catalog.title')}
        </h1>
        <p className="text-gray-600">
          Знайдено {pagination.totalElements} товарів
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 md:hidden"
        >
          <SlidersHorizontal size={20} />
          {showFilters ? 'Сховати фільтри' : 'Показати фільтри'}
        </button>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field flex-1 md:flex-initial"
          >
            <option value="priceLowToHigh">Ціна: від низької до високої</option>
            <option value="priceHighToLow">Ціна: від високої до низької</option>
            <option value="newest">Спочатку нові</option>
          </select>

          {/* View Mode */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition ${viewMode === 'grid'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              title="Сітка"
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition ${viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              title="Список"
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <aside className="lg:w-64 flex-shrink-0">
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={categories}
            />
          </aside>
        )}

        {/* Products Grid */}
        <main className="flex-1">
          <ProductGrid products={products} loading={loading} />

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 0}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Попередня
              </button>

              <div className="flex gap-2 flex-wrap">
                {[...Array(Math.min(pagination.totalPages, 10))].map((_, idx) => {
                  // Показуємо тільки 10 сторінок навколо поточної
                  let pageNum = idx;
                  if (pagination.totalPages > 10) {
                    if (pagination.page < 5) {
                      pageNum = idx;
                    } else if (pagination.page > pagination.totalPages - 6) {
                      pageNum = pagination.totalPages - 10 + idx;
                    } else {
                      pageNum = pagination.page - 5 + idx;
                    }
                  }

                  if (pageNum >= pagination.totalPages || pageNum < 0) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg transition ${pagination.page === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages - 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Наступна
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CatalogPage;