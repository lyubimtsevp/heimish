import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Truck, MapPin, CheckCircle, Loader2 } from "lucide-react";
import TopBanner from "@/components/TopBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const STRAPI_URL = "https://heimish.ru/strapi-api";

export default function Checkout() {
    const navigate = useNavigate();
    const { items, totalPrice, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);

    const [deliveryMethod, setDeliveryMethod] = useState<"courier" | "pickup">("courier");
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        comment: "",
    });

    const shipping = deliveryMethod === "pickup" ? 0 : (totalPrice >= 5000 ? 0 : 350);
    const total = totalPrice + shipping;

    const formatPrice = (price: number) => {
        return `${price.toLocaleString()} ₽`;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.phone || (deliveryMethod === "courier" && !formData.address)) {
            toast.error("Заполните обязательные поля");
            return;
        }

        setIsSubmitting(true);

        try {
            const orderData = {
                data: {
                    items: items.map((item) => ({
                        id: item.id,
                        documentId: item.documentId,
                        name: item.name,
                        image: item.image,
                        price: item.price,
                        quantity: item.quantity,
                    })),
                    total,
                    status: "pending",
                    customerName: formData.name,
                    customerPhone: formData.phone,
                    customerEmail: formData.email || null,
                    address: deliveryMethod === "pickup" ? "Самовывоз" : formData.address,
                    comment: formData.comment || null,
                    deliveryMethod,
                },
            };

            const response = await fetch(`${STRAPI_URL}/api/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error("Ошибка создания заказа");
            }

            const result = await response.json();
            setOrderId(result.data.id);
            setOrderSuccess(true);
            clearCart();

            toast.success("Заказ успешно оформлен!");
        } catch (error) {
            console.error("Order error:", error);
            toast.error("Ошибка оформления заказа. Попробуйте позже.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Успешное оформление заказа
    if (orderSuccess) {
        return (
            <div className="min-h-screen bg-white font-circe">
                <TopBanner />
                <Header />
                <main className="max-w-2xl mx-auto px-4 py-16 text-center">
                    <div className="mb-8">
                        <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-4" />
                        <h1 className="text-3xl font-medium text-heimish-black mb-2">
                            Спасибо за заказ!
                        </h1>
                        <p className="text-heimish-gray-light">
                            Номер вашего заказа: <span className="font-semibold text-heimish-black">#{orderId}</span>
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                        <h2 className="font-medium text-heimish-black mb-4">Что дальше?</h2>
                        <ul className="space-y-3 text-sm text-heimish-gray-dark">
                            <li className="flex gap-3">
                                <span className="text-emerald-500">1.</span>
                                Мы свяжемся с вами для подтверждения заказа
                            </li>
                            <li className="flex gap-3">
                                <span className="text-emerald-500">2.</span>
                                После подтверждения заказ будет передан в доставку
                            </li>
                            <li className="flex gap-3">
                                <span className="text-emerald-500">3.</span>
                                Вы получите SMS с трек-номером для отслеживания
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild variant="outline">
                            <Link to="/">На главную</Link>
                        </Button>
                        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                            <Link to="/all">Продолжить покупки</Link>
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Пустая корзина
    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-white font-circe">
                <TopBanner />
                <Header />
                <main className="max-w-2xl mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-medium text-heimish-black mb-4">
                        Корзина пуста
                    </h1>
                    <p className="text-heimish-gray-light mb-8">
                        Добавьте товары для оформления заказа
                    </p>
                    <Button asChild>
                        <Link to="/all">Перейти в каталог</Link>
                    </Button>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-circe">
            <TopBanner />
            <Header />

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Back to cart */}
                <Link
                    to="/cart"
                    className="inline-flex items-center text-sm text-heimish-gray-dark hover:text-heimish-black mb-6"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Вернуться в корзину
                </Link>

                <h1 className="text-2xl sm:text-3xl font-medium text-heimish-black mb-8">
                    Оформление заказа
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                        {/* Left Column - Form */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Contact Info */}
                            <section className="bg-gray-50 rounded-xl p-6">
                                <h2 className="text-lg font-medium text-heimish-black mb-4">
                                    Контактные данные
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-heimish-gray-dark mb-1">
                                            Имя <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Ваше имя"
                                            required
                                            className="bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-heimish-gray-dark mb-1">
                                            Телефон <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+7 (999) 123-45-67"
                                            required
                                            className="bg-white"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm text-heimish-gray-dark mb-1">
                                            Email
                                        </label>
                                        <Input
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="email@example.com"
                                            className="bg-white"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Delivery Method */}
                            <section className="bg-gray-50 rounded-xl p-6">
                                <h2 className="text-lg font-medium text-heimish-black mb-4">
                                    Способ доставки
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setDeliveryMethod("courier")}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${deliveryMethod === "courier"
                                                ? "border-emerald-500 bg-emerald-50"
                                                : "border-gray-200 hover:border-gray-300"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <Truck className={`w-5 h-5 ${deliveryMethod === "courier" ? "text-emerald-600" : "text-gray-400"}`} />
                                            <span className="font-medium">Курьер</span>
                                        </div>
                                        <p className="text-sm text-heimish-gray-light">
                                            {totalPrice >= 5000 ? "Бесплатно" : "350 ₽"}
                                        </p>
                                        <p className="text-xs text-heimish-gray-light mt-1">
                                            1-3 рабочих дня
                                        </p>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setDeliveryMethod("pickup")}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${deliveryMethod === "pickup"
                                                ? "border-emerald-500 bg-emerald-50"
                                                : "border-gray-200 hover:border-gray-300"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <MapPin className={`w-5 h-5 ${deliveryMethod === "pickup" ? "text-emerald-600" : "text-gray-400"}`} />
                                            <span className="font-medium">Самовывоз</span>
                                        </div>
                                        <p className="text-sm text-emerald-600 font-medium">
                                            Бесплатно
                                        </p>
                                        <p className="text-xs text-heimish-gray-light mt-1">
                                            Пункт выдачи
                                        </p>
                                    </button>
                                </div>

                                {deliveryMethod === "courier" && (
                                    <div className="mt-4">
                                        <label className="block text-sm text-heimish-gray-dark mb-1">
                                            Адрес доставки <span className="text-red-500">*</span>
                                        </label>
                                        <Textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="Город, улица, дом, квартира"
                                            required
                                            className="bg-white"
                                        />
                                    </div>
                                )}
                            </section>

                            {/* Comment */}
                            <section className="bg-gray-50 rounded-xl p-6">
                                <h2 className="text-lg font-medium text-heimish-black mb-4">
                                    Комментарий к заказу
                                </h2>
                                <Textarea
                                    name="comment"
                                    value={formData.comment}
                                    onChange={handleInputChange}
                                    placeholder="Дополнительные пожелания..."
                                    className="bg-white"
                                />
                            </section>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="mt-8 lg:mt-0">
                            <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
                                <h2 className="text-lg font-medium text-heimish-black mb-4">
                                    Ваш заказ
                                </h2>

                                {/* Items */}
                                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-3">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-14 h-14 object-cover rounded-lg bg-white"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-heimish-black line-clamp-1">
                                                    {item.name}
                                                </p>
                                                <p className="text-xs text-heimish-gray-light">
                                                    {item.quantity} × {formatPrice(item.price)}
                                                </p>
                                            </div>
                                            <span className="text-sm font-medium">
                                                {formatPrice(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <Separator className="my-4" />

                                {/* Summary */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-heimish-gray-dark">Товары</span>
                                        <span>{formatPrice(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-heimish-gray-dark">Доставка</span>
                                        <span className={shipping === 0 ? "text-emerald-600" : ""}>
                                            {shipping === 0 ? "Бесплатно" : formatPrice(shipping)}
                                        </span>
                                    </div>
                                </div>

                                <Separator className="my-4" />

                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-lg font-medium">Итого</span>
                                    <span className="text-xl font-semibold">{formatPrice(total)}</span>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                    size="lg"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Оформление...
                                        </>
                                    ) : (
                                        "Оформить заказ"
                                    )}
                                </Button>

                                <p className="text-xs text-heimish-gray-light text-center mt-4">
                                    Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </main>

            <Footer />
        </div>
    );
}

