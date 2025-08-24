import React, { useState } from 'react';
import Product from '../types';
import { productService } from '../services/api';

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
  onUpdate: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Product>({ ...product });
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    setEditedProduct({ ...product });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedProduct({ ...product });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedProduct = await productService.updateProduct(product.id, editedProduct);
      onUpdate(updatedProduct);
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      alert('Erro ao atualizar produto');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProduct(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const handleDelete = () => {
    if (window.confirm(`Você quer mesmo excluir o produto "${product.name}"?`)) {
      onDelete(product.id);
    }
  };

  if (isEditing) {
    return (
      <div className="product-card editing">
        <div className="product-image-container">
          <img src={product.pictureUrl} alt={product.name} className="product-image" />
          <input
            type="url"
            name="pictureUrl"
            value={editedProduct.pictureUrl}
            onChange={handleInputChange}
            placeholder="URL da imagem"
            className="edit-input"
          />
        </div>
        
        <div className="product-info">
          <div className="product-id">
            <strong>ID:</strong> {product.id}
          </div>
          
          <input
            type="text"
            name="name"
            value={editedProduct.name}
            onChange={handleInputChange}
            placeholder="Nome do produto"
            className="edit-input"
          />
          
          <input
            type="text"
            name="category"
            value={editedProduct.category}
            onChange={handleInputChange}
            placeholder="Categoria"
            className="edit-input"
          />
          
          <input
            type="number"
            name="price"
            value={editedProduct.price}
            onChange={handleInputChange}
            placeholder="Preço"
            step="0.01"
            className="edit-input"
          />
          
          <textarea
            name="description"
            value={editedProduct.description}
            onChange={handleInputChange}
            placeholder="Descrição"
            className="edit-textarea"
            rows={3}
          />
        </div>

        <div className="product-actions">
          <button 
            onClick={handleSave} 
            className="btn btn-save"
            disabled={loading}
          >
            {loading ? 'Salvando...' : '💾 Salvar'}
          </button>
          <button 
            onClick={handleCancel} 
            className="btn btn-cancel"
            disabled={loading}
          >
            ❌ Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-card">
      <img src={product.pictureUrl} alt={product.name} className="product-image" />
      
      <div className="product-info">
        <div className="product-id">
          <strong>ID:</strong> {product.id}
        </div>
        
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-category">
          <strong>Categoria:</strong> {product.category}
        </div>
        
        <div className="product-price">
          <strong>Preço:</strong> R$ {product.price.toFixed(2)}
        </div>
        
        <div className="product-description">
          <strong>Descrição:</strong> {product.description}
        </div>
      </div>

      <div className="product-actions">
        <button onClick={handleEdit} className="btn btn-edit">
          ✏️ Editar
        </button>
        <button onClick={handleDelete} className="btn btn-delete">
          🗑️ Excluir
        </button>
      </div>
    </div>
  );
};

export default ProductCard;