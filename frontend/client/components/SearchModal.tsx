import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
import { Search, X, Loader2 } from "lucide-react";
import { fetchAllProducts } from "@/lib/api";
import type { Product } from "@/types/product";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Маппинг раскладок QWERTY ↔ ЙЦУКЕН
const enToRuLayout: Record<string, string> = {
  q: "й", w: "ц", e: "у", r: "к", t: "е", y: "н", u: "г", i: "ш", o: "щ", p: "з",
  "[": "х", "]": "ъ", a: "ф", s: "ы", d: "в", f: "а", g: "п", h: "р", j: "о",
  k: "л", l: "д", ";": "ж", "'": "э", z: "я", x: "ч", c: "с", v: "м", b: "и",
  n: "т", m: "ь", ",": "б", ".": "ю", "`": "ё"
};

const ruToEnLayout: Record<string, string> = {
  й: "q", ц: "w", у: "e", к: "r", е: "t", н: "y", г: "u", ш: "i", щ: "o", з: "p",
  х: "[", ъ: "]", ф: "a", ы: "s", в: "d", а: "f", п: "g", р: "h", о: "j",
  л: "k", д: "l", ж: ";", э: "'", я: "z", ч: "x", с: "c", м: "v", и: "b",
  т: "n", ь: "m", б: ",", ю: ".", ё: "`"
};

// Транслитерация RU → EN (для поиска)
const ruToEnTranslit: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya"
};

// Транслитерация EN → RU (для поиска)
const enToRuTranslit: Record<string, string> = {
  a: "а", b: "б", c: "к", d: "д", e: "е", f: "ф", g: "г", h: "х", i: "и",
  j: "дж", k: "к", l: "л", m: "м", n: "н", o: "о", p: "п", q: "к", r: "р",
  s: "с", t: "т", u: "у", v: "в", w: "в", x: "кс", y: "й", z: "з"
};

// Синонимы для популярных слов
const synonyms: Record<string, string[]> = {
  "balm": ["бальзам"],
  "cream": ["крем"],
  "serum": ["сыворотка", "серум"],
  "toner": ["тонер", "тоник"],
  "cleanser": ["очищение", "клинзер"],
  "mask": ["маска"],
  "shampoo": ["шампунь"],
  "moisturizer": ["увлажняющий", "крем"],
  "sunscreen": ["солнцезащитный", "spf"],
  "mascara": ["тушь"],
  "powder": ["пудра"],
  "cushion": ["кушон"],
  "патчи": ["patch", "patches", "eye patch"],
  "бальзам": ["balm", "cleansing balm"],
  "крем": ["cream", "moisturizer"],
  "сыворотка": ["serum"],
  "шампунь": ["shampoo"],
  "тушь": ["mascara"],
  "heimish": ["хеймиш", "хаймиш"],
  "matcha": ["матча", "маття"],
  "biome": ["биом"],
  "ceramide": ["церамид", "керамид"],
  "moringa": ["моринга"],
};

// Конвертация раскладки EN → RU (ifvgeym → шампунь)
function convertLayoutEnToRu(text: string): string {
  return text.toLowerCase().split("").map(char => enToRuLayout[char] || char).join("");
}

// Конвертация раскладки RU → EN  
function convertLayoutRuToEn(text: string): string {
  return text.toLowerCase().split("").map(char => ruToEnLayout[char] || char).join("");
}

// Транслитерация RU → EN
function translitRuToEn(text: string): string {
  return text.toLowerCase().split("").map(char => ruToEnTranslit[char] || char).join("");
}

// Транслитерация EN → RU
function translitEnToRu(text: string): string {
  let result = text.toLowerCase();
  const combos: Record<string, string> = { sh: "ш", ch: "ч", zh: "ж", th: "т", ph: "ф" };
  Object.entries(combos).forEach(([en, ru]) => {
    result = result.replace(new RegExp(en, "g"), ru);
  });
  return result.split("").map(char => enToRuTranslit[char] || char).join("");
}

// Определить, похоже ли на неправильную раскладку
function looksLikeWrongLayout(text: string): "en" | "ru" | null {
  const t = text.toLowerCase();
  const ruChars = t.match(/[а-яё]/g)?.length || 0;
  const enChars = t.match(/[a-z]/g)?.length || 0;
  
  if (enChars > 0 && ruChars === 0) {
    const converted = convertLayoutEnToRu(t);
    const hasRussianWords = /[а-яё]{3,}/.test(converted);
    if (hasRussianWords) return "en";
  }
  
  if (ruChars > 0 && enChars === 0) {
    const converted = convertLayoutRuToEn(t);
    const commonEnPatterns = /(cream|serum|balm|mask|toner|shampoo|mascara|biome|matcha)/i;
    if (commonEnPatterns.test(converted)) return "ru";
  }
  
  return null;
}

// Получить все варианты написания запроса
function getSearchVariants(query: string): string[] {
  const q = query.toLowerCase().trim();
  const variants = new Set<string>();
  
  variants.add(q);
  
  // Конвертация раскладки (главное для ifvgeym → шампунь)
  const layoutConverted = convertLayoutEnToRu(q);
  variants.add(layoutConverted);
  variants.add(convertLayoutRuToEn(q));
  
  // Транслитерация
  variants.add(translitRuToEn(q));
  variants.add(translitEnToRu(q));
  variants.add(translitRuToEn(layoutConverted));
  
  // Синонимы
  Object.entries(synonyms).forEach(([key, values]) => {
    const keyLower = key.toLowerCase();
    if (q.includes(keyLower)) {
      values.forEach(v => variants.add(q.replace(keyLower, v.toLowerCase())));
    }
    if (layoutConverted.includes(keyLower)) {
      values.forEach(v => variants.add(layoutConverted.replace(keyLower, v.toLowerCase())));
    }
    values.forEach(v => {
      if (q.includes(v.toLowerCase())) {
        variants.add(q.replace(v.toLowerCase(), keyLower));
      }
    });
  });
  
  return Array.from(variants).filter(v => v.length >= 2);
}

// Расширяем данные товаров для поиска
function enrichProductForSearch(product: Product) {
  const title = product.title.toLowerCase();
  const category = (product.category || "").toLowerCase();
  const line = (product.line || "").toLowerCase();
  const description = (product.description || "").toLowerCase();
  
  return {
    ...product,
    searchTitle: title,
    searchTitleEn: translitRuToEn(title),
    searchTitleRu: translitEnToRu(title),
    searchCategory: category + " " + translitRuToEn(category),
    searchLine: line + " " + translitRuToEn(line),
    searchDesc: description,
  };
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const enrichedProducts = useMemo(() => {
    return products.map(enrichProductForSearch);
  }, [products]);

  const fuse = useMemo(() => {
    return new Fuse(enrichedProducts, {
      keys: [
        { name: "searchTitle", weight: 0.35 },
        { name: "searchTitleEn", weight: 0.2 },
        { name: "searchTitleRu", weight: 0.2 },
        { name: "title", weight: 0.1 },
        { name: "searchCategory", weight: 0.08 },
        { name: "searchLine", weight: 0.05 },
        { name: "searchDesc", weight: 0.02 },
      ],
      threshold: 0.5,
      distance: 200,
      includeScore: true,
      ignoreLocation: true,
      findAllMatches: true,
      minMatchCharLength: 2,
      shouldSort: true,
    });
  }, [enrichedProducts]);

  // Подсказка о раскладке
  const layoutHint = useMemo(() => {
    if (query.length < 3) return null;
    const wrongLayout = looksLikeWrongLayout(query);
    if (wrongLayout === "en") {
      const converted = convertLayoutEnToRu(query);
      return `Возможно вы имели в виду: "${converted}"`;
    }
    return null;
  }, [query]);

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    
    const variants = getSearchVariants(query);
    const allResults = new Map<string, { item: Product; score: number }>();
    
    variants.forEach(variant => {
      const searchResults = fuse.search(variant);
      searchResults.forEach(result => {
        const existing = allResults.get(result.item.id);
        if (!existing || (result.score && result.score < existing.score)) {
          allResults.set(result.item.id, { 
            item: result.item as unknown as Product, 
            score: result.score || 1 
          });
        }
      });
    });
    
    return Array.from(allResults.values())
      .sort((a, b) => a.score - b.score)
      .slice(0, 8)
      .map(r => r.item);
  }, [query, fuse]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      navigate(`/product/${results[selectedIndex].handle || results[selectedIndex].id}`);
      onClose();
    }
  }, [results, selectedIndex, navigate, onClose]);

  useEffect(() => {
    if (resultsRef.current && results.length > 0) {
      const selected = resultsRef.current.children[selectedIndex] as HTMLElement;
      selected?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex, results.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-32">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Поиск товаров..."
            className="flex-1 text-lg outline-none placeholder:text-gray-400"
            autoComplete="off"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Подсказка о раскладке */}
        {layoutHint && (
          <div className="px-5 py-2 bg-amber-50 border-b border-amber-100 text-sm text-amber-700">
            ⌨️ {layoutHint}
          </div>
        )}

        <div ref={resultsRef} className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : query.length >= 2 && results.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <p className="text-lg mb-2">Ничего не найдено</p>
              <p className="text-sm">Попробуйте изменить запрос</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((product, index) => (
                <Link
                  key={product.id}
                  to={`/product/${product.handle || product.id}`}
                  onClick={onClose}
                  className={`flex items-center gap-4 px-5 py-3 transition-colors ${
                    index === selectedIndex 
                      ? "bg-heimish-bg" 
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={product.images?.[0] || "/placeholder.jpg"}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-heimish-dark truncate">
                      {product.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {product.category && (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                          {product.category}
                        </span>
                      )}
                      {product.line && (
                        <span className="text-xs text-gray-400">
                          {product.line}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    {product.isOnSale && product.oldPrice ? (
                      <>
                        <p className="font-bold text-red-600">
                          {product.price.toLocaleString("ru-RU")} ₽
                        </p>
                        <p className="text-sm text-gray-400 line-through">
                          {product.oldPrice.toLocaleString("ru-RU")} ₽
                        </p>
                      </>
                    ) : (
                      <p className="font-bold text-heimish-dark">
                        {product.price.toLocaleString("ru-RU")} ₽
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-8 px-5">
              <p className="text-sm text-gray-500 mb-4">Популярные запросы:</p>
              <div className="flex flex-wrap gap-2">
                {["All Clean", "Патчи", "Тушь", "Шампунь", "Крем", "RX", "Matcha"].map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-4">
                💡 Работает даже с неправильной раскладкой: ifvgeym → шампунь
              </p>
            </div>
          )}
        </div>

        {results.length > 0 && (
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex items-center gap-4">
            <span><kbd className="px-1.5 py-0.5 bg-white border rounded text-gray-600">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white border rounded text-gray-600">↓</kbd> навигация</span>
            <span><kbd className="px-1.5 py-0.5 bg-white border rounded text-gray-600">Enter</kbd> открыть</span>
            <span><kbd className="px-1.5 py-0.5 bg-white border rounded text-gray-600">Esc</kbd> закрыть</span>
          </div>
        )}
      </div>
    </div>
  );
}
