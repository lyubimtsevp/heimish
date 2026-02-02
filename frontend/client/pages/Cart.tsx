import { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import TopBanner from "@/components/TopBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = totalPrice;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal >= 5000 ? 0 : 350;
  const total = subtotal - discount + shipping;

  const applyPromo = () => {
    if (promoCode.toLowerCase() === "heimish10") {
      setPromoApplied(true);
    }
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} ₽`;
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white font-circe">
        <TopBanner />
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h1 className="text-2xl font-medium text-heimish-black mb-2">
              Корзина пуста
            </h1>
            <p className="text-heimish-gray-light mb-8">
              Добавьте товары, чтобы оформить заказ
            </p>
            <Button asChild>
              <Link to="/all">
                Перейти в каталог
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-circe">
      <TopBanner />
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-heimish-gray-light mb-6">
          <Link to="/" className="hover:text-heimish-black">
            Главная
          </Link>
          <span className="mx-2">/</span>
          <span className="text-heimish-black">
            Корзина
          </span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-medium text-heimish-black mb-8">
          КОРЗИНА
          <span className="text-heimish-gray-light font-normal ml-2">
            ({items.reduce((sum, item) => sum + item.quantity, 0)})
          </span>
        </h1>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* Desktop Header */}
            <div className="hidden sm:grid sm:grid-cols-12 gap-4 pb-4 border-b border-gray-200 text-sm font-medium text-heimish-gray-light">
              <div className="col-span-6">
                Товар
              </div>
              <div className="col-span-2 text-center">
                Цена
              </div>
              <div className="col-span-2 text-center">
                Кол-во
              </div>
              <div className="col-span-2 text-right">
                Итого
              </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="py-6 sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center"
                >
                  {/* Product */}
                  <div className="flex gap-4 sm:col-span-6 mb-4 sm:mb-0">
                    <Link to={`/product/${item.documentId || item.id}`} className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg bg-gray-50"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.documentId || item.id}`}
                        className="text-sm font-medium text-heimish-black hover:underline line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      {item.variant && (
                        <p className="text-xs text-heimish-gray-light mt-1">
                          {item.variant}
                        </p>
                      )}
                      {/* Mobile Price */}
                      <p className="text-sm font-medium text-heimish-black mt-2 sm:hidden">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>

                  {/* Desktop Price */}
                  <div className="hidden sm:block sm:col-span-2 text-center text-sm">
                    {formatPrice(item.price)}
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center justify-between sm:justify-center sm:col-span-2 mb-4 sm:mb-0">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-heimish-gray-light hover:text-red-500 transition-colors sm:hidden"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Total + Delete */}
                  <div className="hidden sm:flex sm:col-span-2 items-center justify-end gap-4">
                    <span className="text-sm font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-heimish-gray-light hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mobile Total */}
                  <div className="flex justify-between items-center sm:hidden">
                    <span className="text-sm text-heimish-gray-light">
                      Итого:
                    </span>
                    <span className="text-sm font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link
                to="/all"
                className="text-sm text-heimish-gray-dark hover:text-heimish-black transition-colors inline-flex items-center gap-1"
              >
                ← Продолжить покупки
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
              <h2 className="text-lg font-medium text-heimish-black mb-6">
                Итого заказа
              </h2>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="text-sm text-heimish-gray-dark mb-2 block">
                  Промокод
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Введите код"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={promoApplied}
                    className="bg-white"
                  />
                  <Button
                    variant="outline"
                    onClick={applyPromo}
                    disabled={promoApplied || !promoCode}
                  >
                    {promoApplied ? "✓" : "ОК"}
                  </Button>
                </div>
                {promoApplied && (
                  <p className="text-xs text-green-600 mt-1">
                    Скидка 10% применена!
                  </p>
                )}
                <p className="text-xs text-heimish-gray-light mt-1">
                  Попробуйте: HEIMISH10
                </p>
              </div>

              <Separator className="my-4" />

              {/* Summary */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-heimish-gray-dark">
                    Подытог
                  </span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Скидка</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-heimish-gray-dark">
                    Доставка
                  </span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">
                        Бесплатно
                      </span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>

                {shipping > 0 && (
                  <p className="text-xs text-heimish-gray-light">
                    Бесплатная доставка от {formatPrice(5000)}
                  </p>
                )}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-medium">
                  Итого
                </span>
                <span className="text-xl font-semibold">{formatPrice(total)}</span>
              </div>

              <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" size="lg">
                <Link to="/checkout">
                  Оформить заказ
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-3 text-xs text-heimish-gray-light">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Безопасная оплата
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    100% оригинал
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Быстрая доставка
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Возврат 14 дней
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
