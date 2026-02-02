import { Product, ProductVideo } from "@/types/product";
import localProductsData from "@/data/products.json";

// Strapi API Configuration
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "https://heimish.ru/strapi-api";
const API_URL = `${STRAPI_URL}/api`;

// Local products for image fallback
const localProducts = localProductsData as Product[];

// Strapi response types
interface StrapiMedia {
  id: number;
  url: string;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

interface StrapiVideo {
  id: number;
  title?: string;
  type: "local" | "rutube" | "youtube";
  file?: StrapiMedia;
  externalUrl?: string;
  thumbnail?: StrapiMedia;
}

interface StrapiProduct {
  id: number;
  documentId: string;
  title: string;
  price: number;
  oldPrice?: number | null;
  isOnSale?: boolean;
  description?: string;
  category?: string;
  line?: string;
  rating?: number;
  reviews?: number;
  reviewsCount?: number;
  inStock?: boolean;
  images?: StrapiMedia[];
  imageUrl?: string;
  videos?: StrapiVideo[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

interface StrapiReview {
  id: number;
  documentId: string;
  author: string;
  rating: number;
  text: string;
  isVerified: boolean;
  createdAt: string;
  product?: { documentId: string };
}

interface StrapiQuestion {
  id: number;
  documentId: string;
  author: string;
  question: string;
  answer: string | null;
  createdAt: string;
  product?: { documentId: string };
}

interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Transform Strapi product to our Product type
function transformProduct(strapiProduct: StrapiProduct): Product {
  let images: string[] = [];

  if (strapiProduct.images && strapiProduct.images.length > 0) {
    images = strapiProduct.images.map((img) =>
      img.url.startsWith("http") ? img.url : `${STRAPI_URL}${img.url}`
    );
  } else {
    // Берём ВСЕ картинки из localProducts (products.json)
    const localProduct = localProducts.find(p => p.title === strapiProduct.title);
    if (localProduct && localProduct.images) {
      images = localProduct.images;
    } else if (strapiProduct.imageUrl) {
      // Fallback на imageUrl если нет в products.json
      const url = strapiProduct.imageUrl.startsWith("http") 
        ? strapiProduct.imageUrl 
        : `${STRAPI_URL}${strapiProduct.imageUrl}`;
      images = [url];
    }
  }

  return {
    id: strapiProduct.documentId,
    handle: strapiProduct.documentId,
    code: strapiProduct.documentId,
    title: strapiProduct.title,
    price: strapiProduct.price,
    oldPrice: strapiProduct.oldPrice || undefined,
    isOnSale: strapiProduct.isOnSale || false,
    category: strapiProduct.category || "",
    line: strapiProduct.line || "",
    images,
    description: strapiProduct.description || "",
    rating: strapiProduct.rating || 0,
    reviews: strapiProduct.reviewsCount || 0,
    inStock: strapiProduct.inStock !== false,
    videos: strapiProduct.videos?.map((video) => ({
      id: String(video.id),
      title: video.title,
      type: video.type,
      url: video.type === "local" && video.file
        ? (video.file.url.startsWith("http") ? video.file.url : `${STRAPI_URL}${video.file.url}`)
        : (video.externalUrl || ""),
      thumbnail: video.thumbnail
        ? (video.thumbnail.url.startsWith("http") ? video.thumbnail.url : `${STRAPI_URL}${video.thumbnail.url}`)
        : undefined,
    })) || [],
  };
}

// API Functions
export async function fetchProducts(params?: {
  page?: number;
  pageSize?: number;
  category?: string;
  line?: string;
  sort?: string;
}): Promise<{ products: Product[]; total: number; pageCount: number }> {
  try {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.set("pagination[page]", String(params.page));
    if (params?.pageSize) searchParams.set("pagination[pageSize]", String(params.pageSize));

    if (params?.category && params.category !== "all") {
      searchParams.set("filters[category][$eq]", params.category);
    }
    if (params?.line && params.line !== "all") {
      searchParams.set("filters[line][$eq]", params.line);
    }

    if (params?.sort) {
      switch (params.sort) {
        case "price-low":
          searchParams.set("sort", "price:asc");
          break;
        case "price-high":
          searchParams.set("sort", "price:desc");
          break;
        case "rating":
          searchParams.set("sort", "rating:desc");
          break;
        case "reviews":
          searchParams.set("sort", "reviews:desc");
          break;
        case "newest":
          searchParams.set("sort", "createdAt:desc");
          break;
        default:
          searchParams.set("sort", "reviews:desc");
      }
    }

    searchParams.set("populate", "*");

    const response = await fetch(`${API_URL}/products?${searchParams.toString()}`);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data: StrapiResponse<StrapiProduct[]> = await response.json();

    return {
      products: data.data.map(transformProduct),
      total: data.meta.pagination?.total || 0,
      pageCount: data.meta.pagination?.pageCount || 1,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    const localProducts = await import("@/data/products.json");
    return {
      products: localProducts.default as Product[],
      total: (localProducts.default as Product[]).length,
      pageCount: 1,
    };
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(
      `${API_URL}/products?filters[documentId][$eq]=${id}&populate=*`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data: StrapiResponse<StrapiProduct[]> = await response.json();

    if (data.data && data.data.length > 0) {
      return transformProduct(data.data[0]);
    }

    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
    const localProducts = await import("@/data/products.json");
    const product = (localProducts.default as Product[]).find(
      (p) => p.id === id || p.code === id
    );
    return product || null;
  }
}

export async function fetchAllProducts(): Promise<Product[]> {
  try {
    const response = await fetch(
      `${API_URL}/products?pagination[pageSize]=100&populate=*`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data: StrapiResponse<StrapiProduct[]> = await response.json();
    return data.data.map(transformProduct);
  } catch (error) {
    console.error("Error fetching all products:", error);
    const localProducts = await import("@/data/products.json");
    return localProducts.default as Product[];
  }
}

// Fetch reviews for a product
export async function fetchProductReviews(productId: string): Promise<{
  id: string;
  author: string;
  rating: number;
  text: string;
  isVerified: boolean;
  createdAt: string;
}[]> {
  try {
    const response = await fetch(
      `${API_URL}/reviews?filters[product][documentId][$eq]=${productId}&populate=*&sort=createdAt:desc`
    );

    if (!response.ok) {
      return [];
    }

    const data: StrapiResponse<StrapiReview[]> = await response.json();
    
    return data.data.map((review) => ({
      id: review.documentId,
      author: review.author,
      rating: review.rating,
      text: review.text,
      isVerified: review.isVerified || false,
      createdAt: review.createdAt,
    }));
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

// Fetch questions for a product
export async function fetchProductQuestions(productId: string): Promise<{
  id: string;
  author: string;
  question: string;
  answer: string | null;
  createdAt: string;
}[]> {
  try {
    const response = await fetch(
      `${API_URL}/questions?filters[product][documentId][$eq]=${productId}&populate=*&sort=createdAt:desc`
    );

    if (!response.ok) {
      return [];
    }

    const data: StrapiResponse<StrapiQuestion[]> = await response.json();
    
    return data.data.map((q) => ({
      id: q.documentId,
      author: q.author,
      question: q.question,
      answer: q.answer,
      createdAt: q.createdAt,
    }));
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
}

// Create order in Strapi
export async function createOrder(orderData: {
  items: Array<{
    productId: string;
    title: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  comment?: string;
  deliveryMethod: "courier" | "pickup";
  promoCode?: string;
  discount?: number;
}): Promise<{ success: boolean; orderId?: number; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          items: orderData.items,
          total: orderData.total,
          customerName: orderData.customerName,
          customerPhone: orderData.customerPhone,
          customerEmail: orderData.customerEmail || null,
          address: orderData.address,
          comment: orderData.comment || null,
          deliveryMethod: orderData.deliveryMethod,
          promoCode: orderData.promoCode || null,
          discount: orderData.discount || 0,
          status: "pending",
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, orderId: data.data.id };
  } catch (error) {
    console.error("Error creating order:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Ошибка при создании заказа" 
    };
  }
}

// Fetch FAQ data
export async function fetchFAQ(): Promise<{ question: string; answer: string }[]> {
  try {
    const response = await fetch(`${API_URL}/faq`);

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.data?.items || [];
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    return [];
  }
}

export function getStrapiUrl(): string {
  return STRAPI_URL;
}

// Create review
export async function createReview(data: {
  productId: string;
  author: string;
  rating: number;
  text: string;
}): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          product: data.productId,
          author: data.author,
          rating: data.rating,
          text: data.text,
          isVerified: false,
          publishedAt: new Date().toISOString(),
        },
      }),
    });
    return response.ok;
  } catch (error) {
    console.error("Error creating review:", error);
    return false;
  }
}

// Create question
export async function createQuestion(data: {
  productId: string;
  author: string;
  question: string;
}): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          product: data.productId,
          author: data.author,
          question: data.question,
          publishedAt: new Date().toISOString(),
        },
      }),
    });
    return response.ok;
  } catch (error) {
    console.error("Error creating question:", error);
    return false;
  }
}
// Fetch FAQ items from Strapi
export async function fetchFAQItems(): Promise<{ id: number; question: string; answer: string; category?: string; order?: number }[]> {
  try {
    const response = await fetch(`${API_URL}/faqs?sort=order:asc`);

    if (!response.ok) {
      console.error("FAQ API Error:", response.status);
      return [];
    }

    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      return data.data.map((item: any) => ({
        id: item.id,
        question: item.question,
        answer: item.answer,
        category: item.category,
        order: item.order
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    return [];
  }
}
