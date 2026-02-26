import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const STATIC_PAGES = [
  { name: 'home', label: 'Home Page' },
  { name: 'about', label: 'About Us' },
  { name: 'menu', label: 'Menu / Box Builder' },
  { name: 'calculator', label: 'Feeding Calculator' },
  { name: 'contact', label: 'Contact' },
  { name: 'new-to-raw', label: 'New to Raw' },
  { name: 'policies', label: 'Policies' },
  { name: 'terms', label: 'Terms' },
  { name: 'blog', label: 'Blog' }
];

export const SEOManager = () => {
  const [seoSettings, setSeoSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [treats, setTreats] = useState([]);
  const [selectedPage, setSelectedPage] = useState('home');
  const [pageType, setPageType] = useState('static'); // 'static', 'product', 'treat'
  const [formData, setFormData] = useState({
    page_title: '',
    meta_description: '',
    meta_keywords: '',
    og_image: ''
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadSEOSettings();
    loadProducts();
    loadTreats();
  }, []);

  useEffect(() => {
    if (seoSettings[selectedPage]) {
      setFormData(seoSettings[selectedPage]);
    } else {
      setFormData({
        page_title: 'FoeGuard - Premium Raw Pet Food',
        meta_description: 'High-quality raw pet food delivered to your door',
        meta_keywords: '',
        og_image: ''
      });
    }
  }, [selectedPage, seoSettings]);

  const loadSEOSettings = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const { data } = await axios.get(`${API}/seo`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const settings = {};
      data.forEach(item => {
        settings[item.page_name] = item;
      });
      setSeoSettings(settings);
    } catch (error) {
      console.error('Failed to load SEO settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const { data: dogProducts } = await axios.get(`${API}/products?pet_type=dog`);
      const { data: catProducts } = await axios.get(`${API}/products?pet_type=cat`);
      setProducts([...dogProducts, ...catProducts]);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const loadTreats = async () => {
    try {
      const { data } = await axios.get(`${API}/treats`);
      setTreats(data);
    } catch (error) {
      console.error('Failed to load treats:', error);
    }
  };

  const handlePageSelect = (type, pageName) => {
    setPageType(type);
    setSelectedPage(pageName);
  };

  const getCurrentPageLabel = () => {
    if (pageType === 'static') {
      return STATIC_PAGES.find(p => p.name === selectedPage)?.label;
    } else if (pageType === 'product') {
      const product = products.find(p => p.product_id === selectedPage);
      return product ? `Product: ${product.name}` : 'Product';
    } else if (pageType === 'treat') {
      const treat = treats.find(t => t.treat_id === selectedPage);
      return treat ? `Treat: ${treat.name}` : 'Treat';
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const token = localStorage.getItem('authToken');
        const { data } = await axios.post(`${API}/admin/upload-image`, {
          content: reader.result,
          filename: file.name
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setFormData({ ...formData, og_image: data.url });
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert('Image upload failed: ' + (error.response?.data?.detail || error.message));
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`${API}/admin/seo/${selectedPage}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('SEO settings updated successfully');
      loadSEOSettings();
    } catch (error) {
      alert('Failed to update SEO: ' + (error.response?.data?.detail || error.message));
    }
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading SEO settings...</div>;

  return (
    <div>
      <h2 style={{ fontSize: '24px', color: '#2B2B2B', marginBottom: '24px' }}>SEO Management</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px' }}>
        {/* Page List */}
        <div>
          <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#666' }}>Select Page</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {PAGES.map(page => (
              <button
                key={page.name}
                onClick={() => setSelectedPage(page.name)}
                style={{
                  padding: '12px 16px',
                  background: selectedPage === page.name ? '#8B4513' : 'white',
                  color: selectedPage === page.name ? 'white' : '#2C2C2C',
                  border: '2px solid ' + (selectedPage === page.name ? '#8B4513' : '#E8DDD0'),
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontWeight: selectedPage === page.name ? '600' : '400',
                  transition: 'all 0.2s'
                }}
              >
                {page.label}
              </button>
            ))}
          </div>
        </div>

        {/* SEO Form */}
        <div style={{
          background: '#F8F6F4',
          padding: '24px',
          borderRadius: '12px'
        }}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>
            SEO Settings - {PAGES.find(p => p.name === selectedPage)?.label}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                Page Title *
              </label>
              <input
                type="text"
                required
                value={formData.page_title}
                onChange={(e) => setFormData({...formData, page_title: e.target.value})}
                placeholder="FoeGuard - Premium Raw Pet Food"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #D9C8B3',
                  borderRadius: '8px',
                  fontSize: '15px'
                }}
              />
              <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                Appears in browser tab and search results
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                Meta Description *
              </label>
              <textarea
                required
                value={formData.meta_description}
                onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                rows={3}
                placeholder="Brief description of this page for search engines"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #D9C8B3',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
              <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                Recommended: 150-160 characters
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                Meta Keywords
              </label>
              <input
                type="text"
                value={formData.meta_keywords}
                onChange={(e) => setFormData({...formData, meta_keywords: e.target.value})}
                placeholder="raw pet food, dog food, cat food, healthy pets"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #D9C8B3',
                  borderRadius: '8px',
                  fontSize: '15px'
                }}
              />
              <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                Comma-separated keywords
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                OG Image (Social Media)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                style={{ marginBottom: '8px' }}
              />
              {uploading && <p style={{ color: '#666', fontSize: '14px' }}>Uploading...</p>}
              {formData.og_image && (
                <img
                  src={formData.og_image}
                  alt="OG Preview"
                  style={{ maxWidth: '300px', borderRadius: '8px', marginTop: '8px' }}
                />
              )}
              <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                Used when sharing on Facebook, Twitter, etc. Recommended: 1200x630px
              </p>
            </div>

            <button
              type="submit"
              style={{
                padding: '12px 24px',
                background: '#8B4513',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '15px'
              }}
            >
              Save SEO Settings
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};