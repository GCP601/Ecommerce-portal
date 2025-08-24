import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EditProduct from '../EditProduct';

jest.mock('../../services/api', () => ({
  productService: {
    getProductById: jest.fn().mockResolvedValue({
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      category: 'Test Category',
      pictureUrl: 'https://test.com/image.jpg'
    })
  }
}));

describe('EditProduct', () => {
  test('renders edit product page', async () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/edit/:id" element={<EditProduct />} />
        </Routes>
      </BrowserRouter>
    );
    
    expect(await screen.findByText('Editar Produto')).toBeInTheDocument();
    expect(await screen.findByDisplayValue('Test Product')).toBeInTheDocument();
  });
});