import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    image_url: '',
    author: 'FoeGuard',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    published: true
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const { data } = await axios.get(`${API}/blogs?published_only=false`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBlogs(data);
    } catch (error) {
      console.error('Failed to load blogs:', error);
    } finally {
      setLoading(false);
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
        
        setFormData({ ...formData, image_url: data.url });
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
      
      if (editingBlog) {
        await axios.put(`${API}/admin/blogs/${editingBlog.blog_id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Blog updated successfully');
      } else {
        await axios.post(`${API}/admin/blogs`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Blog created successfully');
      }
      
      resetForm();
      loadBlogs();
    } catch (error) {
      alert('Failed to save blog: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API}/admin/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Blog deleted successfully');
      loadBlogs();
    } catch (error) {
      alert('Failed to delete blog: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt || '',
      image_url: blog.image_url || '',
      author: blog.author || 'FoeGuard',
      meta_title: blog.meta_title || '',
      meta_description: blog.meta_description || '',
      meta_keywords: blog.meta_keywords || '',
      published: blog.published
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      image_url: '',
      author: 'FoeGuard',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      published: true
    });
    setEditingBlog(null);
    setShowForm(false);
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ]
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'link'
  ];

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading blogs...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', color: '#2B2B2B', margin: 0 }}>Blog Manager</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '10px 20px',
            background: '#8B4513',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          {showForm ? 'Cancel' : '+ New Blog Post'}
        </button>
      </div>

      {showForm && (
        <div style={{
          background: '#F8F6F4',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '24px'
        }}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>
            {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h3>
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #D9C8B3',
                  borderRadius: '8px',
                  fontSize: '15px'
                }}
              />
            </div>

            {/* Excerpt */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                Excerpt (short summary for list view)
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                rows={2}
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
            </div>

            {/* Content */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                Content *
              </label>
              <div style={{ background: 'white', borderRadius: '8px', minHeight: '350px' }}>
                {showForm && (
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={(content) => setFormData({...formData, content})}
                    modules={quillModules}
                    formats={quillFormats}
                    style={{ height: '300px' }}
                  />
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                Featured Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                style={{ marginBottom: '8px' }}
              />
              {uploading && <p style={{ color: '#666', fontSize: '14px' }}>Uploading...</p>}
              {formData.image_url && (
                <img
                  src={formData.image_url}
                  alt="Preview"
                  style={{ maxWidth: '200px', borderRadius: '8px', marginTop: '8px' }}
                />
              )}
            </div>

            {/* SEO Fields */}
            <div style={{
              background: 'white',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <h4 style={{ marginBottom: '12px', fontSize: '16px' }}>SEO Settings</h4>
              
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                  Meta Title
                </label>
                <input
                  type="text"
                  value={formData.meta_title}
                  onChange={(e) => setFormData({...formData, meta_title: e.target.value})}
                  placeholder={formData.title}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #D9C8B3',
                    borderRadius: '8px',
                    fontSize: '15px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                  Meta Description
                </label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                  placeholder={formData.excerpt}
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #D9C8B3',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
                  Meta Keywords (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.meta_keywords}
                  onChange={(e) => setFormData({...formData, meta_keywords: e.target.value})}
                  placeholder="raw dog food, pet nutrition, healthy pets"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #D9C8B3',
                    borderRadius: '8px',
                    fontSize: '15px'
                  }}
                />
              </div>
            </div>

            {/* Published Toggle */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({...formData, published: e.target.checked})}
                  style={{ width: '18px', height: '18px' }}
                />
                <span style={{ fontWeight: '600' }}>Publish immediately</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                style={{
                  padding: '10px 24px',
                  background: '#8B4513',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                {editingBlog ? 'Update Blog' : 'Create Blog'}
              </button>
              {editingBlog && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: '10px 24px',
                    background: '#999',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Blog List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {blogs.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
            No blog posts yet
          </div>
        ) : (
          blogs.map(blog => (
            <div key={blog.blog_id} style={{
              padding: '20px',
              border: '1px solid #E8DDD0',
              borderRadius: '12px',
              display: 'flex',
              gap: '20px',
              alignItems: 'start'
            }}>
              {blog.image_url && (
                <img
                  src={blog.image_url}
                  alt={blog.title}
                  style={{
                    width: '120px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{blog.title}</h3>
                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                      {blog.excerpt || 'No excerpt'}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#999' }}>
                      <span>By {blog.author}</span>
                      <span>•</span>
                      <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span style={{
                        color: blog.published ? '#2E7D32' : '#F57C00',
                        fontWeight: '600'
                      }}>
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleEdit(blog)}
                      style={{
                        padding: '6px 12px',
                        background: '#556B2F',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog.blog_id)}
                      style={{
                        padding: '6px 12px',
                        background: '#C33',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
