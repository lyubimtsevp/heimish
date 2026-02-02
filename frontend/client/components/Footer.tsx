import { useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    alert("Спасибо за подписку!");
    setEmail("");
  };

  return (
    <footer className="w-full bg-[#1a1a1a] text-white">
      {/* Main Footer Content */}
      <div className="w-full max-w-none mx-auto px-6 lg:px-16 pt-16 pb-12">
        {/* Logo */}
        <div className="mb-12">
          <Link to="/" className="inline-block">
            <span className="text-3xl font-circe font-bold tracking-wider text-white">
              HEIMISH
            </span>
          </Link>
          <p className="mt-3 text-gray-400 text-sm font-circe max-w-md">
            Корейская косметика премиум-класса для естественной красоты вашей кожи
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Shop */}
          <div>
            <h3 className="text-sm font-circe font-bold uppercase tracking-wider mb-6 text-white">
              Магазин
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/all"
                  className="text-gray-400 hover:text-white transition-colors text-sm font-circe"
                >
                  Все товары
                </Link>
              </li>
              <li>
                <Link
                  to="/best"
                  className="text-gray-400 hover:text-white transition-colors text-sm font-circe"
                >
                  Лучшее
                </Link>
              </li>
              <li>
                <Link
                  to="/all?category=Очищение"
                  className="text-gray-400 hover:text-white transition-colors text-sm font-circe"
                >
                  Очищение
                </Link>
              </li>
              <li>
                <Link
                  to="/all?category=Кремы"
                  className="text-gray-400 hover:text-white transition-colors text-sm font-circe"
                >
                  Уход за кожей
                </Link>
              </li>
              <li>
                <Link
                  to="/all?category=Макияж"
                  className="text-gray-400 hover:text-white transition-colors text-sm font-circe"
                >
                  Макияж
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Help */}
          <div>
            <h3 className="text-sm font-circe font-bold uppercase tracking-wider mb-6 text-white">
              Помощь
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/faq"
                  className="text-gray-400 hover:text-white transition-colors text-sm font-circe"
                >
                  Частые вопросы
                </Link>
              </li>
              <li>
                <Link
                  to="/delivery"
                  className="text-gray-400 hover:text-white transition-colors text-sm font-circe"
                >
                  Доставка
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-gray-400 hover:text-white transition-colors text-sm font-circe"
                >
                  Возврат и обмен
                </Link>
              </li>
              <li>
                <Link
                  to="/payment"
                  className="text-gray-400 hover:text-white transition-colors text-sm font-circe"
                >
                  Оплата
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contacts */}
          <div>
            <h3 className="text-sm font-circe font-bold uppercase tracking-wider mb-6 text-white">
              Контакты
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+79773950777" className="text-gray-400 hover:text-white transition-colors text-sm font-circe">
                  +7 (977) 395-07-77
                </a>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@heimish.ru" className="text-gray-400 hover:text-white transition-colors text-sm font-circe">
                  info@heimish.ru
                </a>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-400 text-sm font-circe">
                  Пн-Пт: 10:00 - 18:00
                  <br />
                  <span className="text-xs text-gray-500">Сб-Вс: выходной</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Social */}
          <div>
            <h3 className="text-sm font-circe font-bold uppercase tracking-wider mb-6 text-white">
              Будьте в курсе
            </h3>
            <p className="text-gray-400 text-sm font-circe mb-4">
              Подпишитесь на скидки и новинки
            </p>
            <form onSubmit={handleSubscribe} className="mb-6">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ваш email"
                  className="flex-1 px-4 py-2.5 bg-[#2a2a2a] border border-gray-700 text-white text-sm font-circe placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-white text-[#1a1a1a] text-sm font-circe font-medium hover:bg-gray-200 transition-colors"
                >
                  →
                </button>
              </div>
            </form>

            {/* Social Links */}
            <div className="flex gap-4">
              {/* Telegram */}
              <a
                href="https://t.me/+79773950777"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-[#2a2a2a] hover:bg-[#0088cc] transition-colors rounded-full"
                aria-label="Telegram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
              {/* WhatsApp */}
              <a
                href="https://wa.me/79773950777"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-[#2a2a2a] hover:bg-[#25d366] transition-colors rounded-full"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="w-full max-w-none mx-auto px-6 lg:px-16 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs font-circe">
              © 2026 Heimish Russia. Все права защищены.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link to="/faq" className="text-gray-500 hover:text-white transition-colors text-xs font-circe">
                Частые вопросы
              </Link>
              <Link to="/delivery" className="text-gray-500 hover:text-white transition-colors text-xs font-circe">
                Доставка
              </Link>
              <Link to="/returns" className="text-gray-500 hover:text-white transition-colors text-xs font-circe">
                Возврат
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Made by */}
      <div className="text-right py-3 pr-6 lg:pr-16">
        <p className="text-gray-600 text-[10px] font-circe">
          Сделано с ❤️{" "}
          <a href="https://lyubimtsev.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            Павлом Любимцевым
          </a>
        </p>
      </div>
    </footer>
  );
}
