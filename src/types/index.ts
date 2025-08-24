export default interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  pictureUrl: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  pictureUrl: string;
}