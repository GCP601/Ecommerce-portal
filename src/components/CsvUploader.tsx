import React, { useState, useRef, ChangeEvent } from 'react';
import Product from '../types';
import { productService } from '../services/api';

interface CsvProduct extends Product {
  selected: boolean;
  status?: 'pending' | 'success' | 'error';
  error?: string;
}

const CsvUploader: React.FC = () => {
  const [csvProducts, setCsvProducts] = useState<CsvProduct[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verifica extensão
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Extensão de arquivo inválida');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvText = event.target?.result as string;
        const products = parseCsv(csvText);
        setCsvProducts(products);
      } catch (error) {
        alert('Erro ao ler arquivo CSV');
        console.error('CSV Error:', error);
      }
    };
    reader.readAsText(file);
  };

  const parseCsv = (csvText: string): CsvProduct[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    const products: CsvProduct[] = [];

    // Pula o header (assumindo que a primeira linha é cabeçalho)
    for (let i = 1; i < lines.length; i++) {
      const columns = lines[i].split(',').map(col => col.trim());
      
      if (columns.length >= 5) {
        products.push({
          id: Math.random().toString(36).substr(2, 9), // ID temporário
          name: columns[0] || 'Sem nome',
          description: columns[1] || 'Sem descrição',
          price: parseFloat(columns[2]) || 0,
          category: columns[3] || 'Sem categoria',
          pictureUrl: columns[4] || 'https://picsum.photos/300/300?product',
          selected: false
        });
      }
    }

    return products;
  };

  const toggleProductSelection = (id: string) => {
    setCsvProducts(prev => prev.map(p =>
      p.id === id ? { ...p, selected: !p.selected } : p
    ));
  };

  const handleUpload = async () => {
    setUploading(true);
    const selectedProducts = csvProducts.filter(p => p.selected);

    for (const product of selectedProducts) {
      try {
        // Atualiza status para pending
        setCsvProducts(prev => prev.map(p =>
          p.id === product.id ? { ...p, status: 'pending' } : p
        ));

        const createdProduct = await productService.createProduct({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          pictureUrl: product.pictureUrl
        });

        // Atualiza status para success
        setCsvProducts(prev => prev.map(p =>
          p.id === product.id ? { ...p, status: 'success' } : p
        ));
      } catch (error: any) {
        // Atualiza status para error
        setCsvProducts(prev => prev.map(p =>
          p.id === product.id ? { 
            ...p, 
            status: 'error', 
            error: error.message 
          } : p
        ));
      }
    }

    setUploading(false);
  };

  const clearSelection = () => {
    setCsvProducts([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="csv-uploader">
      <h3>Carga de Produtos via CSV</h3>
      
      <div className="csv-controls">
        <div className="file-input-group">
          <label htmlFor="csv-file" className="file-label">
            Arquivo CSV:
          </label>
          <input
            ref={fileInputRef}
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="file-input"
          />
        </div>
        
        <button
          onClick={handleUpload}
          disabled={uploading || !csvProducts.some(p => p.selected)}
          className="upload-button"
        >
          {uploading ? 'Enviando...' : '📤 Enviar'}
        </button>

        {csvProducts.length > 0 && (
          <button onClick={clearSelection} className="clear-button">
            🗑️ Limpar
          </button>
        )}
      </div>

      {csvProducts.length > 0 && (
        <div className="csv-products">
          <h4>Produtos do Arquivo ({csvProducts.length})</h4>
          <div className="products-grid">
            {csvProducts.map(product => (
              <div key={product.id} className={`product-card csv-product ${product.status}`}>
                <img src={product.pictureUrl} alt={product.name} className="product-image" />
                
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p><strong>Categoria:</strong> {product.category}</p>
                  <p><strong>Preço:</strong> R$ {product.price.toFixed(2)}</p>
                  <p><strong>Descrição:</strong> {product.description}</p>
                </div>

                <div className="csv-product-controls">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={product.selected}
                      onChange={() => toggleProductSelection(product.id)}
                      disabled={uploading || product.status !== undefined}
                    />
                    Selecionar
                  </label>

                  {product.status === 'success' && (
                    <div className="status success">✅ Sucesso</div>
                  )}
                  
                  {product.status === 'error' && (
                    <div className="status error">❌ Erro: {product.error}</div>
                  )}
                  
                  {product.status === 'pending' && (
                    <div className="status pending">⏳ Processando...</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CsvUploader;