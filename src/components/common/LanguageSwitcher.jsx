import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition">
        <Globe size={20} />
        <span className="text-sm font-medium">{i18n.language.toUpperCase()}</span>
      </button>
      
      <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block z-50">
        <button
          onClick={() => changeLanguage('ua')}
          className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
            i18n.language === 'ua' ? 'bg-blue-50 text-blue-600 font-medium' : ''
          }`}
        >
          🇺🇦 Українська
        </button>
        <button
          onClick={() => changeLanguage('en')}
          className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
            i18n.language === 'en' ? 'bg-blue-50 text-blue-600 font-medium' : ''
          }`}
        >
          🇬🇧 English
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;