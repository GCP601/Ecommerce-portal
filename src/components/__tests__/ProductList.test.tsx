import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductList from '../ProductList';
import { productService } from '../../services/api';
import Product from '../../types';

jest.mock('../../services/api');

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Product 1',
    description: 'Description 1',
    price: 100,
    category: 'Category 1',
    pictureUrl: 'https://test.com/1.jpg'
  },
  {
    id: '2',
    name: 'Product 2',
    description: 'Description 2',
    price: 200,
    category: 'Category 2',
    pictureUrl: 'https://test.com/2.jpg'
  }
];

describe('ProductList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (productService.getAllProducts as jest.Mock).mockResolvedValue(mockProducts);
  });

  test('loads and displays products', async () => {
    render(<ProductList />);
    
    expect(screen.getByText('Carregando produtos...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });
  });

  test('displays error message when products fail to load', async () => {
    (productService.getAllProducts as jest.Mock).mockRejectedValue(new Error('Network error'));
    
    render(<ProductList />);
    
    await waitFor(() => {
      expect(screen.getByText('Erro: Erro ao carregar produtos')).toBeInTheDocument();
    });
  });

  test('searches for products by ID', async () => {
    (productService.getProductById as jest.Mock).mockResolvedValue(mockProducts[0]);
    
    render(<ProductList />);
    
    await waitFor(() => screen.getByText('Product 1'));
    
    const searchInput = screen.getByPlaceholderText('Digite o ID do produto');
    fireEvent.change(searchInput, { target: { value: '1' } });
    fireEvent.click(screen.getByText('Buscar'));
    
    await waitFor(() => {
      expect(productService.getProductById).toHaveBeenCalledWith('1');
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.queryByText('Product 2')).not.toBeInTheDocument();
    });
  });

  test('displays no products message when search returns no results', async () => {
    (productService.getProductById as jest.Mock).mockResolvedValue(null);
    
    render(<ProductList />);
    
    await waitFor(() => screen.getByText('Product 1'));
    
    const searchInput = screen.getByPlaceholderText('Digite o ID do produto');
    fireEvent.change(searchInput, { target: { value: '999' } });
    fireEvent.click(screen.getByText('Buscar'));
    
    await waitFor(() => {
      expect(screen.getByText('Nenhum produto encontrado com o ID especificado')).toBeInTheDocument();
    });
  });
});