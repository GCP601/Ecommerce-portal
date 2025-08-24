import { productService } from '../api';
import Product from '../../types';

// Mock global fetch
global.fetch = jest.fn() as jest.Mock;

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 100,
  category: 'Test Category',
  pictureUrl: 'https://test.com/image.jpg'
};

describe('Product Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  test('getAllProducts returns products', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [mockProduct]
    });
    
    const products = await productService.getAllProducts();
    
    expect(products).toEqual([mockProduct]);
    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/products');
  });

  test('getProductById returns product', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProduct
    });
    
    const product = await productService.getProductById('1');
    
    expect(product).toEqual(mockProduct);
    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/products/1');
  });

  test('handles errors correctly', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: 'Not found' })
    });
    
    await expect(productService.getProductById('999')).rejects.toThrow();
  });
});