export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const ROUTES = {
  HOME: '/',
  CATALOG: '/catalog',
  PRODUCT: '/product/:id',
  CART: '/cart',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  LOGIN: '/login',
  ABOUT_US: '/about',
  SUPPORT: '/support',
};

export const USER_ROLES = {
  CLIENT: 'CLIENT',
  MANAGER: 'MANAGER',
  ADMIN: 'ADMIN',
};

export const ORDER_STATUSES = {
  NEW: 'NEW',
  CREATED: 'CREATED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED',
};

export const POWER_TYPES = {
  AC220: 'AC220',
  AC110: 'AC110',
  ACCUMULATOR: 'ACCUMULATOR',
};