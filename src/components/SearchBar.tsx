import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (id: string) => void;
  onClear: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onClear }) => {
  const [id, setId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id.trim()) {
      onSearch(id.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Permite qualquer caractere para ID (pode ser alfanumérico)
    const value = e.target.value;
    setId(value);
  };

  const handleClear = () => {
    setId('');
    onClear();
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group">
          <label htmlFor="product-id" className="search-label">
            ID:
          </label>
          <input
            id="product-id"
            type="text"
            placeholder="Digite o ID do produto"
            value={id}
            onChange={handleInputChange}
            className="search-input"
            maxLength={20}
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={!id.trim()}
          >
            Buscar
          </button>
          <button 
            type="button" 
            onClick={handleClear}
            className="clear-button"
          >
            Limpar
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;