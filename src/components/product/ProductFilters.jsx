import { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';

const ProductFilters = ({ onFilterChange, categories }) => {
  const [filters, setFilters] = useState({
    categoryId: '',
    minPrice: '',
    maxPrice: '',
    manufacturerIds: [], // ← Змінено на масив
    inStock: false,
  });

  const [manufacturers, setManufacturers] = useState([]);
  const [isOpen, setIsOpen] = useState(true);

  // Завантаження виробників
  useEffect(() => {
    loadManufacturers();
  }, []);

  const loadManufacturers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/manufacturers');
      const data = await response.json();
      setManufacturers(data);
    } catch (error) {
      console.error('Failed to load manufacturers:', error);

      setManufacturers([
        { id: 1, name: 'Samsung' },
        { id: 2, name: 'LG' },
        { id: 3, name: 'Bosch' },
        { id: 4, name: 'Philips' },
        { id: 5, name: 'Siemens' },
        { id: 6, name: 'Whirlpool' },
        { id: 7, name: 'Gorenje' },
        { id: 8, name: 'Panasonic' },
        { id: 9, name: 'Sony' },
        { id: 10, name: 'Dyson' },
      ]);
    }
  };

  useEffect(() => {
    onFilterChange(filters);
  }, [filters]);

  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleManufacturerToggle = (manufacturerId) => {
    setFilters((prev) => {
      const currentIds = prev.manufacturerIds;
      const newIds = currentIds.includes(manufacturerId)
        ? currentIds.filter(id => id !== manufacturerId)
        : [...currentIds, manufacturerId];
      
      return { ...prev, manufacturerIds: newIds };
    });
  };

  const handlePriceRangeClick = (min, max) => {
    setFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max }));
  };

  const resetFilters = () => {
    setFilters({
      categoryId: '',
      minPrice: '',
      maxPrice: '',
      manufacturerIds: [],
      inStock: false,
    });
  };

  const priceRanges = [
    { label: 'До 1000 грн', min: 0, max: 1000 },
    { label: '1000 - 3000 грн', min: 100, max: 3000 },
    { label: '3000 - 5000 грн', min: 3000, max: 5000 },
    { label: '5000 - 15000 грн', min: 5000, max: 15000 },
    { label: '15000 - 25000 грн', min: 15000, max: 25000 },
    { label: 'Більше 25000 грн', min: 25000, max: 35000 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sticky top-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Filter size={20} />
          Фільтри
        </h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-gray-600 hover:text-black"
        >
          {isOpen ? <X size={20} /> : <Filter size={20} />}
        </button>
      </div>

      {/* Filters Content */}
      <div className={`space-y-6 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Категорія</label>
          <select
            value={filters.categoryId}
            onChange={(e) => handleChange('categoryId', e.target.value)}
            className="input-field text-sm"
          >
            <option value="">Всі категорії</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium mb-2">Ціна</label>
          <div className="space-y-2 mb-3">
            {priceRanges.map((range, idx) => (
              <button
                key={idx}
                onClick={() => handlePriceRangeClick(range.min, range.max)}
                className={`w-full text-left text-sm py-2 px-3 rounded hover:bg-gray-100 transition ${
                  filters.minPrice == range.min && filters.maxPrice == range.max
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : ''
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Від"
              value={filters.minPrice}
              onChange={(e) => handleChange('minPrice', e.target.value)}
              className="input-field text-sm"
            />
            <input
              type="number"
              placeholder="До"
              value={filters.maxPrice}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
              className="input-field text-sm"
            />
          </div>
        </div>

        {/* Manufacturer Filter - CHECKBOXES */}
        <div>
          <label className="block text-sm font-medium mb-3">Виробник</label>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {manufacturers.map((manufacturer) => (
              <label 
                key={manufacturer.id} 
                className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition"
              >
                <input
                  type="checkbox"
                  checked={filters.manufacturerIds.includes(manufacturer.id)}
                  onChange={() => handleManufacturerToggle(manufacturer.id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm">{manufacturer.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* In Stock Filter */}
        <div>
          <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => handleChange('inStock', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium">Тільки в наявності</span>
          </label>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetFilters}
          className="w-full btn-secondary text-sm flex items-center justify-center gap-2"
        >
          <X size={16} />
          Скинути фільтри
        </button>

        {/* Active Filters Summary */}
        {(filters.categoryId || filters.manufacturerIds.length > 0 || filters.minPrice || filters.inStock) && (
          <div className="pt-4 border-t">
            <p className="text-xs font-medium text-gray-600 mb-2">Активні фільтри:</p>
            <div className="flex flex-wrap gap-1">
              {filters.categoryId && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  Категорія
                </span>
              )}
              {filters.manufacturerIds.length > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {filters.manufacturerIds.length} виробник(ів)
                </span>
              )}
              {filters.minPrice && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  Ціна
                </span>
              )}
              {filters.inStock && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  В наявності
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;