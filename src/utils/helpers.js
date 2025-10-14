/**
 * Витягує дані з Spring Boot Page об'єкта
 * Якщо це вже масив - повертає як є
 */
export const extractPageContent = (data) => {
  if (!data) {
    console.warn('⚠️ extractPageContent: data is null/undefined');
    return [];
  }
  
  // Якщо це Page об'єкт з Spring Boot
  if (data.content && Array.isArray(data.content)) {
    console.log('Extracted from Page object:', data.content.length, 'items');
    return data.content;
  }
  
  // Якщо це вже масив
  if (Array.isArray(data)) {
    console.log('Data is already an array:', data.length, 'items');
    return data;
  }
  
  // Якщо це один об'єкт - обгортаємо в масив
  if (typeof data === 'object') {
    console.warn('⚠️ extractPageContent: wrapping single object in array');
    return [data];
  }
  
  // Інакше повертаємо порожній масив
  console.error('❌ extractPageContent: unexpected data format', data);
  return [];
};

/**
 * Витягує pagination інформацію з Page об'єкта
 */
export const extractPaginationInfo = (data) => {
  if (data && data.content) {
    return {
      totalPages: data.totalPages || 1,
      totalElements: data.totalElements || 0,
      currentPage: data.number || 0,
      pageSize: data.size || 10,
      hasNext: !data.last,
      hasPrevious: !data.first,
    };
  }
  
  // Якщо це простий масив
  if (Array.isArray(data)) {
    return {
      totalPages: 1,
      totalElements: data.length,
      currentPage: 0,
      pageSize: data.length,
      hasNext: false,
      hasPrevious: false,
    };
  }
  
  // Дефолтні значення
  return {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10,
    hasNext: false,
    hasPrevious: false,
  };
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
  }).format(price);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const getOrderStatusColor = (status) => {
  const colors = {
    NEW: 'bg-blue-100 text-blue-800',
    CREATED: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELED: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};