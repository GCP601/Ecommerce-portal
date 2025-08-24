import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../SearchBar';

const mockOnSearch = jest.fn();
const mockOnClear = jest.fn();

describe('SearchBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders search input and buttons', () => {
    render(<SearchBar onSearch={mockOnSearch} onClear={mockOnClear} />);
    
    expect(screen.getByLabelText(/id/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/digite o id do produto/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /buscar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /limpar/i })).toBeInTheDocument();
  });

  test('calls onSearch with input value when form is submitted', () => {
    render(<SearchBar onSearch={mockOnSearch} onClear={mockOnClear} />);
    
    const input = screen.getByPlaceholderText(/digite o id do produto/i);
    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /buscar/i }));
    
    expect(mockOnSearch).toHaveBeenCalledWith('123');
  });

  test('calls onClear when clear button is clicked', () => {
    render(<SearchBar onSearch={mockOnSearch} onClear={mockOnClear} />);
    
    const input = screen.getByPlaceholderText(/digite o id do produto/i);
    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /limpar/i }));
    
    expect(mockOnClear).toHaveBeenCalled();
    expect(input).toHaveValue('');
  });
});