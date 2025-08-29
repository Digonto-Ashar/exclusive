// The 'export' keyword makes this interface visible to other files in the application.
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  thumbnail: string;
  rating: {
    rate: number;
    count: number;
  };
  oldPrice?: number;
  discountPercent?: number;
}
