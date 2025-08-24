import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductFormData } from '../types/Product';
import { productService } from '../services/api';
import ProductForm from '../components/ProductForm';

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const data = await productService.getProductById(id);
          setProduct(data);
        } catch (error) {
          console.error('Erro ao carregar produto:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (formData: ProductFormData) => {
    if (id) {
      try {
        await productService.updateProduct(id, formData);
        navigate('/');
      } catch (error) {
        console.error('Erro ao atualizar produto:', error);
      }
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h1>Editar Produto</h1>
      <ProductForm
        product={product}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default EditProduct;