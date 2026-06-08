import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ProductSelector = ({ products, boxSize, selectedProteins, onUpdateProtein }) => {
  const navigate = useNavigate();
  
  const getPrice = (product) => {
    const tier = product.pricing.find(p => p.size_lb === 6) || product.pricing[0];
    return tier.price;
  };

  const getTotalSelected = () => {
    return Object.values(selectedProteins).reduce((sum, data) => sum + data.qty, 0);
  };

  const canAdd = (productId) => {
    const currentQty = selectedProteins[productId]?.qty || 0;
    const totalSelected = getTotalSelected();
    return totalSelected + 6 <= boxSize && currentQty + 6 <= boxSize;
  };

  const comfortDinnerProducts = products.filter(p => p.product_line === 'comfort_dinner');
  const primalFeastProducts = products.filter(p => p.product_line === 'primal_feast');

  const ProductCard = ({ product }) => {
    const data = selectedProteins[product.product_id] || { qty: 0, name: product.name };
    const price = getPrice(product);
    
    return (
      <div className="product-card" data-testid={`product-${product.product_id}`}>
        <h4 style={{ fontSize: '20px', margin: '8px 0', textTransform: 'capitalize' }}>{product.protein_type}</h4>
        <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.4', marginBottom: '16px' }}>{product.description.split('.')[0]}</p>
        <div style={{ fontSize: '18px', fontWeight: '700', color: '#c8102e', marginBottom: '12px' }}>
          ${price.toFixed(2)} / 6lb
        </div>
        <div className="quantity-controls">
          <button 
            className="qty-btn"
            onClick={() => onUpdateProtein(product.product_id, product.name, Math.max(0, data.qty - 6))}
            disabled={data.qty === 0}
            data-testid={`decrease-${product.product_id}`}
          >
            −
          </button>
          <div className="qty-display" data-testid={`qty-${product.product_id}`}>{data.qty}lb</div>
          <button 
            className="qty-btn"
            onClick={() => onUpdateProtein(product.product_id, product.name, data.qty + 6)}
            disabled={!canAdd(product.product_id)}
            data-testid={`increase-${product.product_id}`}
          >
            +
          </button>
        </div>
        <button 
          className="btn-learn-more"
          onClick={() => navigate(`/product/${product.product_id}`)}
          data-testid={`learn-more-${product.product_id}`}
        >
          Learn More
        </button>
      </div>
    );
  };

  return (
    <div>
      <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>Select Your Proteins</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>Choose proteins in 6lb increments (Total: {getTotalSelected()}lb / {boxSize}lb)</p>
      
      <div style={{ marginBottom: '50px' }}>
        <div className="collection-header">
          <div className="collection-icon">🍽️</div>
          <div className="collection-info">
            <h3 className="collection-title">Comfort Dinner</h3>
            <p className="collection-description">Gently prepared meals perfect for sensitive stomachs and dogs transitioning to raw. Complete, balanced nutrition with digestive support.</p>
          </div>
        </div>
        <div className="product-grid">
          {comfortDinnerProducts.map(product => <ProductCard key={product.product_id} product={product} />)}
        </div>
      </div>

      <div>
        <div className="collection-header">
          <div className="collection-icon">🥩</div>
          <div className="collection-info">
            <h3 className="collection-title">Primal Feast</h3>
            <p className="collection-description">Raw, biologically appropriate meals that mirror what carnivores eat in nature. Maximum nutrient retention through minimal processing.</p>
          </div>
        </div>
        <div className="product-grid">
          {primalFeastProducts.map(product => <ProductCard key={product.product_id} product={product} />)}
        </div>
      </div>
    </div>
  );
};