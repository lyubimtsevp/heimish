import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const STATIC_FAQ: FAQItem[] = [
  { id: 1, question: "Как оформить заказ?", answer: "Выберите понравившиеся товары, добавьте их в корзину и перейдите к оформлению." },
  { id: 2, question: "Сколько стоит доставка?", answer: "Доставка бесплатна при заказе от 5 000 ₽." },
  { id: 3, question: "Как долго идёт доставка?", answer: "Доставка по Москве — 1-2 дня, по России — 3-7 дней." },
  { id: 4, question: "Как оплатить заказ?", answer: "Банковские карты, СБП, наличные при получении." },
  { id: 5, question: "Товары оригинальные?", answer: "Да, мы официальный дистрибьютор Heimish в России." },
  { id: 6, question: "Есть ли программа лояльности?", answer: "Да! 5% бонусов от суммы заказа." },
  { id: 7, question: "Как связаться с поддержкой?", answer: "+7 (977) 395-07-77, info@heimish.ru, @heimish_ru" }
];

export default function FAQ() {
  const [faqItems, setFaqItems] = useState<FAQItem[]>(STATIC_FAQ);
  const [loading, setLoading] = useState(true);
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch("https://heimish.ru/api/faqs?sort=order:asc")
      .then(res => res.json())
      .then(data => {
        if (data.data?.length > 0) {
          setFaqItems(data.data.map((item: { id: number; question: string; answer: string }) => ({
            id: item.id,
            question: item.question,
            answer: item.answer
          })));
        }
      })
      .catch(err => console.error("FAQ error:", err))
      .finally(() => setLoading(false));
  }, []);

  const toggleItem = (id: number) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heimish-pink"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-heimish-bg pt-20 md:pt-24 pb-12 md:pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <nav className="mb-8">
            <ul className="flex items-center gap-2 text-sm text-gray-500">
              <li><Link to="/" className="hover:text-heimish-dark">Главная</Link></li>
              <li>/</li>
              <li className="text-heimish-dark font-medium">Частые вопросы</li>
            </ul>
          </nav>
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-heimish-pink/20 mb-6">
              <HelpCircle className="w-8 h-8 text-heimish-pink" />
            </div>
            <h1 className="text-3xl md:text-4xl font-circe font-bold text-heimish-dark mb-4">Частые вопросы</h1>
            <p className="text-gray-600 max-w-lg mx-auto">Ответы на самые популярные вопросы</p>
          </div>
          <div className="space-y-4">
            {faqItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                <button onClick={() => toggleItem(item.id)} className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
                  <span className="font-medium text-heimish-dark pr-4">{item.question}</span>
                  {openItems.has(item.id) ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                {openItems.has(item.id) && (
                  <div className="px-5 pb-5 pt-0"><div className="text-gray-600 leading-relaxed border-t border-gray-100 pt-4">{item.answer}</div></div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-12 bg-white rounded-xl p-8 text-center border border-gray-100 shadow-sm">
            <h2 className="text-xl font-circe font-bold text-heimish-dark mb-3">Не нашли ответ?</h2>
            <p className="text-gray-600 mb-6">Свяжитесь с нами</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+79773950777" className="px-6 py-3 bg-heimish-dark text-white rounded-lg hover:bg-black transition-colors">Позвонить</a>
              <a href="https://t.me/+79773950777" target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-heimish-dark text-heimish-dark rounded-lg hover:bg-heimish-dark hover:text-white transition-colors">Telegram</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
