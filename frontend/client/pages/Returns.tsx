import { Link } from "react-router-dom";
import { AlertCircle, Mail, Phone, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Returns() {
  return (
    <div className="min-h-screen bg-white font-circe">
      <Header />
      <main className="min-h-screen bg-heimish-bg py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumbs */}
        <nav className="mb-8">
          <ul className="flex items-center gap-2 text-sm text-gray-500">
            <li><Link to="/" className="hover:text-heimish-dark">Главная</Link></li>
            <li>/</li>
            <li className="text-heimish-dark font-medium">Возврат и обмен</li>
          </ul>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-heimish-pink/20 mb-6">
            <Shield className="w-8 h-8 text-heimish-pink" />
          </div>
          <h1 className="text-3xl md:text-4xl font-circe font-bold text-heimish-dark mb-4">
            Возврат и обмен
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Информация о правилах возврата и обмена парфюмерно-косметических товаров
          </p>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-xl p-6 md:p-8 border border-gray-100 shadow-sm mb-8">
          {/* Alert box */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-circe font-bold text-heimish-dark mb-2">
                Важная информация
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Согласно законодательству РФ, парфюмерно-косметические товары надлежащего качества 
                <strong className="text-heimish-dark"> не подлежат обмену или возврату</strong>.
              </p>
            </div>
          </div>

          {/* Legal definition */}
          <div className="mb-8">
            <h3 className="text-xl font-circe font-bold text-heimish-dark mb-4">
              Что такое парфюмерно-косметическое изделие?
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Парфюмерно-косметическое изделие — это препарат или средство, предназначенное для нанесения 
              (с помощью вспомогательных средств или без их использования) на различные части человеческого тела 
              (кожу, волосяной покров, ногти, зубы, губы, слизистую оболочку полости рта) с единственной 
              или главной целью их очищения, придания им приятного запаха, изменения их внешнего вида, 
              защиты и сохранения в хорошем состоянии.
            </p>
          </div>

          {/* Legal framework */}
          <div className="mb-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="text-lg font-circe font-bold text-heimish-dark mb-4">
              Законодательная база
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p className="leading-relaxed">
                При продаже парфюмерно-косметических товаров продавец должен соблюдать требования:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-heimish-pink mt-1">•</span>
                  <span>
                    <strong className="text-heimish-dark">Закон РФ «О защите прав потребителей»</strong> 
                    {" "}от 07.02.1992 г. № 2300-1
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-heimish-pink mt-1">•</span>
                  <span>
                    <strong className="text-heimish-dark">Постановление Правительства РФ от 31.12.2020 N 2463</strong>
                    {" "}«Об утверждении Правил продажи товаров по договору розничной купли-продажи, 
                    перечня товаров длительного пользования, на которые не распространяется требование 
                    потребителя о безвозмездном предоставлении ему товара, обладающего этими же основными 
                    потребительскими свойствами, на период ремонта или замены такого товара, и перечня 
                    непродовольственных товаров надлежащего качества, не подлежащих обмену, а также 
                    о внесении изменений в некоторые акты Правительства Российской Федерации»
                  </span>
                </li>
              </ul>
              <p className="leading-relaxed pt-3 font-medium text-heimish-dark">
                Согласно названного Постановления Правительства РФ № 2463, парфюмерно-косметические 
                товары надлежащего качества не подлежат обмену или возврату.
              </p>
            </div>
          </div>

          {/* Quality concerns */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-xl font-circe font-bold text-heimish-dark mb-4">
              Вопросы по качеству продукции?
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Если у вас возникли вопросы по заказу или имеются вопросы по качеству приобретенной продукции, 
              мы обязательно вам поможем.
            </p>

            {/* Contact cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <a
                href="mailto:info@heimish.ru"
                className="flex items-center gap-4 p-5 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-xl hover:shadow-md transition-all group"
              >
                <div className="p-3 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Напишите нам</p>
                  <p className="font-medium text-heimish-dark">info@heimish.ru</p>
                </div>
              </a>

              <a
                href="tel:+79773950777"
                className="flex items-center gap-4 p-5 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 rounded-xl hover:shadow-md transition-all group"
              >
                <div className="p-3 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                  <Phone className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Позвоните нам</p>
                  <p className="font-medium text-heimish-dark">+7 (977) 395-07-77</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Additional info */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-heimish-pink/10 rounded-lg">
              <Shield className="w-6 h-6 text-heimish-pink" />
            </div>
            <div>
              <h3 className="text-lg font-circe font-bold text-heimish-dark mb-2">
                Мы гарантируем качество
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Вся наша продукция — оригинальная корейская косметика премиум-класса. 
                Мы работаем напрямую с производителями и гарантируем подлинность каждого товара.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
    </div>
  );
}
