// DELIVERY_MARKER_99999
import TopBanner from "@/components/TopBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Truck, CreditCard, Gift, MapPin, Clock, Shield, Sparkles, Package, ArrowRight, Star, Check, Zap } from "lucide-react";

export default function Delivery() {
  return (
    <div className="min-h-screen bg-white font-circe">
      <TopBanner />
      <Header />

      <main className="pt-20 pb-16">
        {/* Breadcrumbs */}
        <div className="w-full max-w-none mx-auto px-4 md:px-6 mb-6">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-heimish-black transition-colors">Главная</Link>
            <span>→</span>
            <span className="text-heimish-black">Доставка и оплата</span>
          </nav>
        </div>

        {/* Premium Hero Banner */}
        <section className="w-full max-w-none mx-auto px-4 md:px-6 mb-10">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] p-8 md:p-12">
            {/* Animated gradient orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-heimish-pink/30 via-purple-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
            <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }} />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                {/* Premium icon */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-heimish-pink via-pink-400 to-purple-500 flex items-center justify-center shadow-lg shadow-heimish-pink/30">
                    <Gift className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-white fill-white" />
                  </div>
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs text-white/80 mb-3">
                    <Sparkles className="w-3 h-3 text-heimish-pink" />
                    PREMIUM DELIVERY
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Бесплатная доставка
                  </h1>
                  <p className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 font-bold drop-shadow-sm">
                    от 5 000 ₽
                  </p>
                </div>
              </div>

              <Link
                to="/all"
                className="group relative overflow-hidden px-8 py-4 bg-white text-heimish-black font-semibold rounded-2xl hover:shadow-xl hover:shadow-white/20 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  За покупками
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-heimish-pink to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity" />
              </Link>
            </div>

            {/* Bottom note */}
            <div className="relative mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Москва и СПб — бесплатно</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Регионы — ПВЗ бесплатно</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Подарки в каждом заказе</span>
              </div>
            </div>
          </div>
        </section>

        {/* Delivery Methods - Premium Cards */}
        <section className="w-full max-w-none mx-auto px-4 md:px-6 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-heimish-pink to-purple-500 rounded-full" />
            <h2 className="text-2xl font-semibold">Способы доставки</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* CDEK Courier */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Truck className="w-7 h-7 text-white" />
                  </div>
                  <div className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                    ПОПУЛЯРНО
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-1">Курьер СДЭК</h3>
                <p className="text-sm text-gray-500 mb-4">До двери в удобное время</p>

                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold">от 350 ₽</div>
                    <div className="text-xs text-gray-400">2-5 рабочих дней</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>Быстро</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pickup Point */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 hover:border-green-200 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <div className="px-3 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full">
                    ВЫГОДНО
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-1">Пункт выдачи</h3>
                <p className="text-sm text-gray-500 mb-4">5 000+ точек по России</p>

                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-600">Бесплатно</div>
                    <div className="text-xs text-gray-400">2-7 рабочих дней</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Package className="w-3 h-3" />
                    <span>Удобно</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Methods - Glassmorphism */}
        <section className="w-full max-w-none mx-auto px-4 md:px-6 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
            <h2 className="text-2xl font-semibold">Оплата заказа</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Card Payment */}
            <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-blue-50 to-white border border-blue-100 hover:shadow-lg hover:shadow-blue-500/10 transition-all">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-3 shadow-lg shadow-blue-500/30">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Банковская карта</h3>
              <p className="text-xs text-gray-500">Visa, MasterCard, МИР</p>
            </div>

            {/* SBP */}
            <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-violet-50 to-white border border-violet-100 hover:shadow-lg hover:shadow-violet-500/10 transition-all">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-3 shadow-lg shadow-violet-500/30">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="font-semibold text-sm mb-1">СБП</h3>
              <p className="text-xs text-gray-500">QR-код через банк</p>
            </div>

            {/* Cash */}
            <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 hover:shadow-lg hover:shadow-emerald-500/10 transition-all">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/30">
                <span className="text-white font-bold">₽</span>
              </div>
              <h3 className="font-semibold text-sm mb-1">Наличные</h3>
              <p className="text-xs text-gray-500">При получении</p>
            </div>
          </div>
        </section>

        {/* Benefits Strip - Premium Style */}
        <section className="w-full max-w-none mx-auto px-4 md:px-6 mb-10">
          <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
            <div className="group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-pink-50 to-white border border-pink-100 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-3 shadow-lg shadow-pink-500/40 transform group-hover:scale-110 transition-transform duration-300">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Подарки</h3>
                <p className="text-xs text-gray-500">В каждом заказе</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-blue-50 to-white border border-blue-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-3 shadow-lg shadow-blue-500/40 transform group-hover:scale-110 transition-transform duration-300">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Вся Россия</h3>
                <p className="text-xs text-gray-500">Любой город</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ - Minimal */}
        <section className="w-full max-w-none mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 md:p-8 border border-gray-100">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-heimish-pink" />
              <h2 className="text-xl font-semibold">Частые вопросы</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              <div className="p-5 bg-white rounded-xl border border-gray-100 hover:border-heimish-pink/30 hover:shadow-md transition-all">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-heimish-pink/10 flex items-center justify-center text-xs text-heimish-pink">?</span>
                  Как рассчитать доставку?
                </h3>
                <p className="text-sm text-gray-500 pl-8">
                  Автоматически при оформлении по весу и адресу.
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-gray-100 hover:border-heimish-pink/30 hover:shadow-md transition-all">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-heimish-pink/10 flex items-center justify-center text-xs text-heimish-pink">?</span>
                  Как отследить заказ?
                </h3>
                <p className="text-sm text-gray-500 pl-8">
                  Номер отслеживания придёт на email.
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-gray-100 hover:border-heimish-pink/30 hover:shadow-md transition-all">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-heimish-pink/10 flex items-center justify-center text-xs text-heimish-pink">?</span>
                  Можно вернуть товар?
                </h3>
                <p className="text-sm text-gray-500 pl-8">
                  Да, в течение 14 дней в оригинальной упаковке.
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-gray-100 hover:border-heimish-pink/30 hover:shadow-md transition-all">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-heimish-pink/10 flex items-center justify-center text-xs text-heimish-pink">?</span>
                  Доставка за границу?
                </h3>
                <p className="text-sm text-gray-500 pl-8">
                  Пока только по России. Скоро международная.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
