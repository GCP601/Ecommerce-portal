import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';

jest.mock('../../components/ProductList', () => {
  return function MockProductList() {
    return <div data-testid="mock-product-list">Product List</div>;
  };
});

describe('Home', () => {
  test('renders home page with product list', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Catálogo de Produtos')).toBeInTheDocument();
    expect(screen.getByTestId('mock-product-list')).toBeInTheDocument();
  });
});