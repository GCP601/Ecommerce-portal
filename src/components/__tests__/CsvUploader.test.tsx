import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CsvUploader from '../CsvUploader';
import { productService } from '../../services/api';

jest.mock('../../services/api');

describe('CsvUploader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders CSV upload section', () => {
    render(<CsvUploader />);
    
    expect(screen.getByText('Carga de Produtos via CSV')).toBeInTheDocument();
    expect(screen.getByLabelText('Arquivo CSV:')).toBeInTheDocument();
    expect(screen.getByText('📤 Enviar')).toBeInTheDocument();
  });

  test('validates file extension', () => {
    render(<CsvUploader />);
    
    const fileInput = screen.getByLabelText('Arquivo CSV:');
    const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    
    window.alert = jest.fn();
    
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });
    
    expect(window.alert).toHaveBeenCalledWith('Extensão de arquivo inválida');
  });

  test('processes valid CSV file', async () => {
    render(<CsvUploader />);
    
    const csvContent = `name,description,price,category,pictureUrl
Product 1,Description 1,100,Category 1,https://test.com/1.jpg
Product 2,Description 2,200,Category 2,https://test.com/2.jpg`;
    
    const file = new File([csvContent], 'products.csv', { type: 'text/csv' });
    const fileInput = screen.getByLabelText('Arquivo CSV:');
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });
  });

  test('sends selected products for creation', async () => {
    (productService.createProduct as jest.Mock).mockResolvedValue({});
    
    render(<CsvUploader />);
    
    const csvContent = `name,description,price,category,pictureUrl
Test Product,Test Description,100,Test Category,https://test.com/image.jpg`;
    
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
    const fileInput = screen.getByLabelText('Arquivo CSV:');
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    await waitFor(() => screen.getByText('Test Product'));
    
    const checkbox = screen.getByLabelText('Selecionar');
    fireEvent.click(checkbox);
    
    const uploadButton = screen.getByText('📤 Enviar');
    fireEvent.click(uploadButton);
    
    await waitFor(() => {
      expect(productService.createProduct).toHaveBeenCalled();
    });
  });
});