export interface ProductVideo {
    id?: string;
    title?: string;
    type: "local" | "rutube" | "youtube";
    url: string;
    thumbnail?: string;
}

export interface Product {
    id: string;
    handle?: string;
    code: string;
    title: string;
    price: number;
    oldPrice?: number | null;
    isOnSale?: boolean;
    category: string;
    line: string;
    images: string[];
    description: string;
    rating: number;
    reviews: number;
    inStock: boolean;
    videos?: ProductVideo[];
}

export type ProductCategory =
    | 'Все'
    | 'Очищение'
    | 'Сыворотки'
    | 'Кремы'
    | 'Тонеры'
    | 'Маски'
    | 'Солнцезащита'
    | 'Макияж'
    | 'Уход';

export type ProductLine =
    | 'Heimish'
    | 'All Clean'
    | 'Matcha Biome'
    | 'Marine Care'
    | 'Artless'
    | 'Dailism'
    | 'Moringa'
    | 'Aqua Soothing';

export type SortOption =
    | 'popularity'
    | 'newest'
    | 'price-low'
    | 'price-high'
    | 'rating'
    | 'reviews';

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'popularity', label: 'Популярности' },
    { value: 'newest', label: 'Новинкам' },
    { value: 'price-low', label: 'Цене (низкая)' },
    { value: 'price-high', label: 'Цене (высокая)' },
    { value: 'rating', label: 'Рейтингу' },
    { value: 'reviews', label: 'Отзывам' },
];

export const CATEGORIES: { id: string; label: string; path: string }[] = [
    { id: 'all', label: 'ВСЕ', path: '/all' },
    { id: 'cleansing', label: 'ОЧИЩЕНИЕ', path: '/all?category=Очищение' },
    { id: 'serums', label: 'СЫВОРОТКИ', path: '/all?category=Сыворотки' },
    { id: 'creams', label: 'КРЕМЫ', path: '/all?category=Кремы' },
    { id: 'makeup', label: 'МАКИЯЖ', path: '/all?category=Макияж' },
    { id: 'sun', label: 'СОЛНЦЕЗАЩИТА', path: '/all?category=Солнцезащита' },
];

export const LINES: { id: string; label: string }[] = [
    { id: 'all', label: 'Все линейки' },
    { id: 'all-clean', label: 'All Clean' },
    { id: 'matcha-biome', label: 'Matcha Biome' },
    { id: 'marine-care', label: 'Marine Care' },
    { id: 'artless', label: 'Artless' },
    { id: 'dailism', label: 'Dailism' },
    { id: 'moringa', label: 'Moringa' },
];

