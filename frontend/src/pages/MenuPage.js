import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import { ChevronRight, ChevronLeft, ChevronDown, Plus, Minus, X, Check, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import { useCart, SlideCart } from '../contexts/CartContext';

export { useCart, SlideCart };

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const API = `${BACKEND_URL}/api`;

// Product images mapping
const PRODUCT_IMAGES = {
  'cd-chicken': 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&h=400&fit=crop',
  'cd-beef': 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&h=400&fit=crop',
  'cd-duck': 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=400&h=400&fit=crop',
  'cd-turkey': 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=400&h=400&fit=crop',
  'cd-fish': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=400&fit=crop',
  'cd-goat': 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=400&fit=crop',
  'cd-lamb': 'https://images.unsplash.com/photo-1603048676207-a5c2883f0f79?w=400&h=400&fit=crop',
  'cd-rabbit': 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=400&fit=crop',
  'pf-chicken': 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&h=400&fit=crop',
  'pf-beef': 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&h=400&fit=crop',
  'pf-duck': 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=400&h=400&fit=crop',
  'pf-turkey': 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=400&h=400&fit=crop',
  'pf-fish': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=400&fit=crop',
  'pf-goat': 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=400&fit=crop',
  'pf-lamb': 'https://images.unsplash.com/photo-1603048676207-a5c2883f0f79?w=400&h=400&fit=crop',
  'pf-rabbit': 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=400&fit=crop',
  'default': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop'
};

// Sticky Footer
const StickyFooter = () => {
  const { totalLbs, total, setIsCartOpen, cartItems } = useCart();
  
  if (cartItems.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, background: '#F5F3EF',
      borderTop: '1px solid #E8E4DC', padding: '12px 20px', zIndex: 100
    }}>
      <button onClick={() => setIsCartOpen(true)} style={{
        width: '100%', maxWidth: '600px', margin: '0 auto', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px',
        background: '#c8102e', color: 'white', border: 'none', borderRadius: '8px',
        fontSize: '16px', fontWeight: '600', cursor: 'pointer'
      }}>
        <span>View Order ({totalLbs} lbs)</span>
        <span>${total.toFixed(2)}</span>
      </button>
    </div>
  );
};

// Menu Page - Clean Tim Hortons Style
export const MenuPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [treats, setTreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cartItems } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, treatsRes] = await Promise.all([
          axios.get(`${API}/products`),
          axios.get(`${API}/treats`)
        ]);
        setProducts(productsRes.data);
        setTreats(treatsRes.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getLowestPrice = (productLine) => {
    const lineProducts = products.filter(p => p.product_line === productLine);
    if (lineProducts.length === 0) return null;
    let lowestPrice = Infinity;
    lineProducts.forEach(p => {
      if (p.pricing?.length) {
        const lowest = Math.min(...p.pricing.map(pr => pr.price_per_lb));
        if (lowest < lowestPrice) lowestPrice = lowest;
      }
    });
    return lowestPrice === Infinity ? null : lowestPrice;
  };

  const comfortPrice = getLowestPrice('comfort_dinner');
  const primalPrice = getLowestPrice('primal_feast');

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'white', paddingBottom: cartItems.length > 0 ? '80px' : '0' }}>
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>Menu</h1>
          <p style={{ fontSize: '14px', color: '#666', margin: '8px 0 0' }}>
            Save 5% at 12 lbs • Save 10% at 24 lbs
          </p>
        </div>

        {loading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#999' }}>Loading...</div>
        ) : (
          <div>
            {/* Meals Section */}
            <div style={{ padding: '20px 20px 10px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Meals</h2>
            </div>
            
            {/* Comfort Dinner */}
            <button onClick={() => navigate('/menu/comfort-dinner')} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '16px',
              padding: '16px 20px', background: 'white', border: 'none', borderBottom: '1px solid #f0f0f0',
              cursor: 'pointer', textAlign: 'left'
            }}>
              <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop" alt="" style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', fontSize: '17px', color: '#2B2B2B' }}>Comfort Dinner</div>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '2px' }}>
                  {comfortPrice ? `$${comfortPrice.toFixed(2)}/lb` : ''} • Complete & balanced
                </div>
              </div>
              <ChevronRight size={24} color="#ccc" />
            </button>

            {/* Primal Feast */}
            <button onClick={() => navigate('/menu/primal-feast')} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '16px',
              padding: '16px 20px', background: 'white', border: 'none', borderBottom: '1px solid #f0f0f0',
              cursor: 'pointer', textAlign: 'left'
            }}>
              <img src="https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=200&h=200&fit=crop" alt="" style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', fontSize: '17px', color: '#2B2B2B' }}>Primal Feast</div>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '2px' }}>
                  {primalPrice ? `$${primalPrice.toFixed(2)}/lb` : ''} • 80/10/10 raw
                </div>
              </div>
              <ChevronRight size={24} color="#ccc" />
            </button>

            {/* Treats Section */}
            <div style={{ padding: '24px 20px 10px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Treats & Bones</h2>
            </div>
            
            <button onClick={() => navigate('/menu/treats')} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '16px',
              padding: '16px 20px', background: 'white', border: 'none', borderBottom: '1px solid #f0f0f0',
              cursor: 'pointer', textAlign: 'left'
            }}>
              <img src="https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=200&h=200&fit=crop" alt="" style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', fontSize: '17px', color: '#2B2B2B' }}>Raw Treats & Bones</div>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '2px' }}>
                  {treats.length} options available
                </div>
              </div>
              <ChevronRight size={24} color="#ccc" />
            </button>

            {/* Tools Section */}
            <div style={{ padding: '24px 20px 10px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Tools</h2>
            </div>
            
            <button onClick={() => navigate('/calculator')} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '16px',
              padding: '16px 20px', background: 'white', border: 'none', borderBottom: '1px solid #f0f0f0',
              cursor: 'pointer', textAlign: 'left'
            }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '8px', background: '#F5F3EF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>🧮</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', fontSize: '17px', color: '#2B2B2B' }}>Feeding Calculator</div>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '2px' }}>Find the right portions</div>
              </div>
              <ChevronRight size={24} color="#ccc" />
            </button>

            <button onClick={() => navigate('/meal-plan')} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '16px',
              padding: '16px 20px', background: 'white', border: 'none', borderBottom: '1px solid #f0f0f0',
              cursor: 'pointer', textAlign: 'left'
            }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '8px', background: '#F5F3EF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>📋</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', fontSize: '17px', color: '#2B2B2B' }}>Meal Plan Creator</div>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '2px' }}>Create your dog's profile</div>
              </div>
              <ChevronRight size={24} color="#ccc" />
            </button>
          </div>
        )}
      </div>
      
      <StickyFooter />
      <SlideCart />
      <Footer />
    </>
  );
};

// Product Line Page - Clean Tim Hortons Style
export const ProductLinePage = ({ productLine }) => {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(6);
  const [showDropdown, setShowDropdown] = useState(false);

  const lineId = productLine === 'comfort-dinner' ? 'comfort_dinner' : 'primal_feast';
  const lineName = productLine === 'comfort-dinner' ? 'Comfort Dinner' : 'Primal Feast';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API}/products`);
        const lineProducts = response.data.filter(p => p.product_line === lineId);
        setProducts(lineProducts);
        if (lineProducts.length > 0) setSelectedProduct(lineProducts[0]);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [lineId]);

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    const pricing = selectedProduct.pricing.find(p => p.size_lb === selectedSize);
    if (!pricing) return;

    addToCart({
      productId: selectedProduct.product_id,
      name: selectedProduct.name,
      lbs: selectedSize,
      price: pricing.price,
      image: PRODUCT_IMAGES[selectedProduct.product_id] || PRODUCT_IMAGES.default
    });
  };

  const selectedPricing = selectedProduct?.pricing?.find(p => p.size_lb === selectedSize);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#999' }}>Loading...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'white', paddingBottom: '180px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #eee' }}>
          <button onClick={() => navigate('/menu')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: '#c8102e', fontWeight: '500' }}>
            <ChevronLeft size={20} /> Menu
          </button>
        </div>

        {/* Product Image */}
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <img 
            src={PRODUCT_IMAGES[selectedProduct?.product_id] || PRODUCT_IMAGES.default} 
            alt={selectedProduct?.name}
            style={{ width: '200px', height: '200px', borderRadius: '16px', objectFit: 'cover' }}
          />
        </div>

        {/* Product Info */}
        <div style={{ padding: '0 20px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px' }}>{selectedProduct?.name}</h1>
          <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>
            ${selectedPricing?.price_per_lb.toFixed(2)}/lb • {lineName}
          </p>
        </div>

        {/* Description */}
        <div style={{ padding: '16px 20px' }}>
          <p style={{ fontSize: '15px', color: '#444', lineHeight: '1.5', margin: 0 }}>
            {selectedProduct?.description}
          </p>
        </div>

        {/* Options */}
        <div style={{ padding: '0 20px' }}>
          {/* Protein Dropdown */}
          <div style={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px 0', background: 'none', border: 'none', cursor: 'pointer'
              }}
            >
              <span style={{ fontWeight: '600', fontSize: '16px' }}>Protein</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666' }}>
                {selectedProduct?.name} <ChevronDown size={20} />
              </span>
            </button>
            
            {showDropdown && (
              <div style={{ paddingBottom: '12px' }}>
                {products.map(product => (
                  <button
                    key={product.product_id}
                    onClick={() => { setSelectedProduct(product); setShowDropdown(false); }}
                    style={{
                      width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '12px 16px', background: selectedProduct?.product_id === product.product_id ? '#F5F3EF' : 'white',
                      border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px'
                    }}
                  >
                    <span style={{ fontWeight: selectedProduct?.product_id === product.product_id ? '600' : '400' }}>
                      {product.name}
                    </span>
                    <span style={{ fontSize: '14px', color: '#666' }}>
                      from ${Math.min(...product.pricing.map(p => p.price_per_lb)).toFixed(2)}/lb
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Size Selector */}
          <div style={{ borderBottom: '1px solid #eee', padding: '16px 0' }}>
            <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '12px' }}>Size</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[6, 12, 18, 24].map(size => {
                const pricing = selectedProduct?.pricing?.find(p => p.size_lb === size);
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      flex: 1, padding: '12px 8px', borderRadius: '8px',
                      border: selectedSize === size ? '2px solid #c8102e' : '1px solid #ddd',
                      background: selectedSize === size ? '#FDF8F3' : 'white',
                      cursor: 'pointer', textAlign: 'center'
                    }}
                  >
                    <div style={{ fontWeight: '600', fontSize: '15px' }}>{size} lbs</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>${pricing?.price_per_lb.toFixed(2)}/lb</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Product Details Accordion */}
        <div style={{ padding: '0 20px' }}>
          <details style={{ borderBottom: '1px solid #eee' }}>
            <summary style={{ padding: '16px 0', cursor: 'pointer', fontWeight: '600', fontSize: '16px', listStyle: 'none', display: 'flex', justifyContent: 'space-between' }}>
              Ingredients <ChevronDown size={18} />
            </summary>
            <p style={{ padding: '0 0 16px', fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
              {selectedProduct?.ingredients}
            </p>
          </details>
          
          <details style={{ borderBottom: '1px solid #eee' }}>
            <summary style={{ padding: '16px 0', cursor: 'pointer', fontWeight: '600', fontSize: '16px', listStyle: 'none', display: 'flex', justifyContent: 'space-between' }}>
              Nutrition Facts <ChevronDown size={18} />
            </summary>
            <div style={{ padding: '0 0 16px', fontSize: '14px', color: '#666' }}>
              {selectedProduct?.nutrition_facts && Object.entries(selectedProduct.nutrition_facts).map(([key, value]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span style={{ textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </details>
        </div>

        {/* Sticky Add Button */}
        <div style={{
          position: 'fixed', bottom: cartItems.length > 0 ? '70px' : '0', left: 0, right: 0,
          background: 'white', borderTop: '1px solid #eee', padding: '16px 20px'
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>
                <Minus size={16} />
              </button>
              <span style={{ fontSize: '18px', fontWeight: '600', minWidth: '24px', textAlign: 'center' }}>1</span>
              <button style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>
                <Plus size={16} />
              </button>
            </div>
            <button onClick={handleAddToCart} style={{
              flex: 1, padding: '14px 24px', background: '#c8102e', color: 'white',
              border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer'
            }}>
              Add – ${selectedPricing?.price.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
      
      <StickyFooter />
      <SlideCart />
    </>
  );
};

// Treats Page
export const TreatsPage = () => {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [treats, setTreats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTreats = async () => {
      try {
        const response = await axios.get(`${API}/treats`);
        setTreats(response.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTreats();
  }, []);

  const handleAddTreat = (treat) => {
    addToCart({
      productId: treat.treat_id,
      name: treat.name,
      lbs: treat.weight_lb || 1,
      price: treat.price,
      image: treat.images?.[0] || PRODUCT_IMAGES.default
    });
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'white', paddingBottom: cartItems.length > 0 ? '80px' : '0' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #eee' }}>
          <button onClick={() => navigate('/menu')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: '#c8102e', fontWeight: '500' }}>
            <ChevronLeft size={20} /> Menu
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px' }}>Treats & Bones</h1>
          <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Raw, natural treats for your pup</p>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>Loading...</div>
        ) : (
          <div>
            {treats.map(treat => (
              <div key={treat.treat_id} style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '16px 20px', borderBottom: '1px solid #f0f0f0'
              }}>
                <img 
                  src={treat.images?.[0] || PRODUCT_IMAGES.default} 
                  alt={treat.name}
                  style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '16px', color: '#2B2B2B' }}>{treat.name}</div>
                  <div style={{ fontSize: '14px', color: '#666', marginTop: '2px' }}>
                    ${treat.price?.toFixed(2)} • {treat.weight_lb || 1} lb
                  </div>
                </div>
                <button onClick={() => handleAddTreat(treat)} style={{
                  padding: '10px 16px', background: '#c8102e', color: 'white',
                  border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
                }}>
                  Add
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <StickyFooter />
      <SlideCart />
      <Footer />
    </>
  );
};

export default MenuPage;
