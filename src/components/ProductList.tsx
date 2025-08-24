import React, { useState, useEffect } from 'react';
import Product from '../types';
import { productService } from '../services/api';
import ProductCard from './ProductCard';
import SearchBar from './SearchBar';
import CsvUploader from './CsvUploader';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
      setDisplayedProducts(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar produtos');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (id: string) => {
    if (!id) return;
    
    try {
      setLoading(true);
      setSearchMode(true);
      setError(null);
      
      const product = await productService.getProductById(id);
      
      if (product) {
        setDisplayedProducts([product]);
        setError(null);
      } else {
        setDisplayedProducts([]);
        setError(`Nenhum produto encontrado com ID: ${id}`);
      }
    } catch (err) {
      setError('Erro ao buscar produto');
      
      // Fallback: busca local
      const foundProduct = products.find(p => p.id === id);
      if (foundProduct) {
        setDisplayedProducts([foundProduct]);
        setError(null);
      } else {
        setDisplayedProducts([]);
        setError(`Nenhum produto encontrado com ID: ${id}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchMode(false);
    setDisplayedProducts(products);
    setError(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await productService.deleteProduct(id);
      const updatedProducts = products.filter(product => product.id !== id);
      setProducts(updatedProducts);
      setDisplayedProducts(updatedProducts);
      setError(null);
    } catch (err) {
      setError('Erro ao excluir produto');
      console.error('Erro:', err);
    }
  };

  const handleUpdate = (updatedProduct: Product) => {
    const updatedProducts = products.map(p =>
      p.id === updatedProduct.id ? updatedProduct : p
    );
    setProducts(updatedProducts);
    setDisplayedProducts(updatedProducts);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <div className="loading">Carregando produtos...</div>;

  return (
    <div className="product-list-container">
      <h2>Listagem de Produtos</h2>
      
      <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
      
      <CsvUploader />
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {displayedProducts.length === 0 && !loading ? (
        <div className="no-products">
          {searchMode ? (
            'Nenhum produto encontrado com o ID especificado'
          ) : (
            'Não existem produtos cadastrados'
          )}
        </div>
      ) : (
        <div className="products-grid">
          {displayedProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;