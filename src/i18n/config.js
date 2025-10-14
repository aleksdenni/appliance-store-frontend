import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import uk from '../locales/uk.json';

const resources = {
  uk: { translation: uk },
  en: { translation: en },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'uk', // Дефолтна мова
    fallbackLng: 'uk',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;