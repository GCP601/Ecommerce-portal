import Product from '../types';

const API_BASE_URL = 'http://localhost:3000';

// Dados mock para fallback
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Smartphone Samsung Galaxy S23',
    description: 'Smartphone Android com 256GB, 8GB RAM, Câmera Tripla 50MP',
    price: 2999.99,
    category: 'Eletrônicos',
    pictureUrl: 'https://picsum.photos/300/300?tech=1'
  }
];

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      return await handleResponse(response);
    } catch (error) {
      console.warn('Backend offline, usando dados mock');
      return mockProducts;
    }
  },

  getProductById: async (id: string): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    return handleResponse(response);
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
      return await handleResponse(response);
    } catch (error) {
      throw new Error('Busca backend falhou');
    }
  },

  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData)
    });
    return handleResponse(response);
  },

  deleteProduct: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE'
    });
    await handleResponse(response);
  },

  createProduct: async (productData: Omit<Product, 'id'>): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData)
    });
    return handleResponse(response);
  }
};