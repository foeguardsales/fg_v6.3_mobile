import React from 'react';

export const StepIndicator = ({ currentStep, onBack, onOpenCart, cartCount = 0, boxSize }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
    <button 
      className="btn-secondary" 
      onClick={onBack}
      style={{ width: 'auto', padding: '12px 24px', visibility: currentStep > 1 ? 'visible' : 'hidden' }}
      data-testid="back-button"
    >
      ← Back
    </button>
    
    <div className="step-indicator">
      <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
      <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
      <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3</div>
    </div>
    
    <button 
      className="btn-secondary" 
      onClick={onOpenCart}
      style={{ 
        width: 'auto', 
        padding: '12px 24px', 
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
      data-testid="cart-button"
    >
      🛒 {boxSize ? `${cartCount}/${boxSize}lb` : 'Cart'}
      {cartCount > 0 && boxSize && cartCount === boxSize && (
        <span style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          background: '#556B2F',
          color: 'white',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: '700'
        }}>
          ✓
        </span>
      )}
    </button>
  </div>
);

export const BoxSizeSelector = ({ onSelectSize, selectedSize }) => {
  // Discount logic: 12lb = 0%, 18lb = 5%, 24lb = 10%, 30lb = 15%
  const boxes = [
    { size: 12, basePrice: 48.60, savings: 0 },
    { size: 18, basePrice: 69.26, savings: 5 },  // 5% discount applied
    { size: 24, basePrice: 87.48, savings: 10 }, // 10% discount applied
    { size: 30, basePrice: 103.28, savings: 15 } // 15% discount applied
  ];

  return (
    <div>
      <h2 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '10px' }}>Choose Your Box Size</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>Larger boxes = bigger savings</p>
      <div className="box-size-grid">
        {boxes.map(box => (
          <div 
            key={box.size}
            className={`box-size-card ${selectedSize === box.size ? 'selected' : ''}`}
            onClick={() => onSelectSize(box.size)}
            data-testid={`box-size-${box.size}lb`}
          >
            <h3 style={{ fontWeight: '400' }}>{box.size} lbs</h3>
            <p style={{ fontSize: '20px', fontWeight: '600', color: '#2C2C2C', marginTop: '12px' }}>
              From ${box.basePrice.toFixed(2)}
            </p>
            {box.savings > 0 && (
              <span className="savings-badge">Save {box.savings}%</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};