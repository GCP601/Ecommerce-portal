import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header>
      <nav>
        <div className="nav-wrapper">
          <Link to="/" className="brand-logo">
            Ecommerce Portal
          </Link>
          <ul className="right">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/products">Produtos</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;