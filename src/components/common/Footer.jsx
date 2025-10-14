import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { ROUTES } from '../../utils/constants';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 font-bold text-xl mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black">
                A
              </div>
              ApplianceStore
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Ваш надійний партнер для побутової техніки з 2025 року.
            </p>
            <div className="flex gap-4">
              <a href={ROUTES.HOME} className="hover:text-blue-400 transition">
                <Facebook size={20} />
              </a>
              <a href={ROUTES.HOME} className="hover:text-blue-400 transition">
                <Twitter size={20} />
              </a>
              <a href={ROUTES.HOME} className="hover:text-blue-400 transition">
                <Instagram size={20} />
              </a>
              <a href={ROUTES.HOME} className="hover:text-blue-400 transition">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">Компанія</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link to="#" className="hover:text-white transition">
                  Про нас
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition">
                  Контакти
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition">
                  Кар'єра
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition">
                  Новини
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold mb-4">Підтримка</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link to="#" className="hover:text-white transition">
                  Доставка
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition">
                  Повернення
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition">
                  Гарантія
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Розсилка</h4>
            <p className="text-gray-400 text-sm mb-4">
              Підпишіться на спеціальні пропозиції та новини
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Email адреса"
                className="flex-1 px-4 py-2 rounded-l-lg text-black focus:outline-none"
              />
              <button className="bg-blue-600 px-4 py-2 rounded-r-lg hover:bg-blue-700 transition">
                →
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 ApplianceStore. Всі права захищені.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link to="#" className="hover:text-white transition">
                Політика конфіденційності
              </Link>
              <Link to="#" className="hover:text-white transition">
                Умови використання
              </Link>
              <Link to="#" className="hover:text-white transition">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;