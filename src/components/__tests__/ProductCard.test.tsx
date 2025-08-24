import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../ProductCard';
import Product from '../../types';

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 100,
  category: 'Test Category',
  pictureUrl: 'https://test.com/image.jpg'
};

const mockOnDelete = jest.fn();
const mockOnUpdate = jest.fn();

describe('ProductCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} onDelete={mockOnDelete} onUpdate={mockOnUpdate} />);
    
    expect(screen.getByText(/ID: 1/)).toBeInTheDocument();
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText(/Categoria: Test Category/)).toBeInTheDocument();
    expect(screen.getByText('R$ 100.00')).toBeInTheDocument();
    expect(screen.getByText(/Descrição: Test Description/)).toBeInTheDocument();
  });

  test('calls onDelete when delete button is clicked with confirmation', () => {
    window.confirm = jest.fn(() => true);
    
    render(<ProductCard product={mockProduct} onDelete={mockOnDelete} onUpdate={mockOnUpdate} />);
    
    fireEvent.click(screen.getByRole('button', { name: /excluir/i }));
    
    expect(window.confirm).toHaveBeenCalledWith('Você quer mesmo excluir o produto "Test Product"?');
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  test('enters edit mode when edit button is clicked', () => {
    render(<ProductCard product={mockProduct} onDelete={mockOnDelete} onUpdate={mockOnUpdate} />);
    
    fireEvent.click(screen.getByRole('button', { name: /editar/i }));
    
    expect(screen.getByDisplayValue('Test Product')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Category')).toBeInTheDocument();
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
  });
});