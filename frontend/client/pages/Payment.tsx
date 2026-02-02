import { Link } from "react-router-dom";
import { CreditCard, Smartphone, Banknote } from "lucide-react";

export default function Payment() {
  return (
    <main className="min-h-screen bg-heimish-bg py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumbs */}
        <nav className="mb-8">
          <ul className="flex items-center gap-2 text-sm text-gray-500">
            <li><Link to="/" className="hover:text-heimish-dark">Главная</Link></li>
            <li>/</li>
            <li className="text-heimish-dark font-medium">Оплата</li>
          </ul>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-heimish-pink/20 mb-6">
            <CreditCard className="w-8 h-8 text-heimish-pink" />
          </div>
          <h1 className="text-3xl md:text-4xl font-circe font-bold text-heimish-dark mb-4">
            Способы оплаты
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Выберите удобный способ оплаты — все платежи защищены и безопасны
          </p>
        </div>

        {/* Payment methods */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 mb-4">
              <CreditCard className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-lg font-circe font-bold text-heimish-dark mb-2">
              Банковская карта
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Visa, MasterCard, МИР
            </p>
            <div className="flex justify-center gap-2">
              <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded"></div>
              <div className="w-10 h-6 bg-gradient-to-r from-red-500 to-yellow-500 rounded"></div>
              <div className="w-10 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded"></div>
            </div>
          </div>

          {/* SBP */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 mb-4">
              <Smartphone className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-lg font-circe font-bold text-heimish-dark mb-2">
              СБП
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Система быстрых платежей
            </p>
            <div className="text-xs text-gray-500">
              Моментальное зачисление
            </div>
          </div>

          {/* Cash */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 mb-4">
              <Banknote className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-lg font-circe font-bold text-heimish-dark mb-2">
              Наличными
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              При получении
            </p>
            <div className="text-xs text-gray-500">
              В пунктах выдачи
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Вопросы по оплате?</p>
          <a
            href="tel:+79773950777"
            className="inline-flex items-center gap-2 px-6 py-3 bg-heimish-dark text-white rounded-lg hover:bg-black transition-colors"
          >
            +7 (977) 395-07-77
          </a>
        </div>
      </div>
    </main>
  );
}
