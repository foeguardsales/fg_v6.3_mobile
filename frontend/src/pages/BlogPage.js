import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const BlogListPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const { data } = await axios.get(`${API}/blogs`);
      setBlogs(data);
    } catch (error) {
      console.error('Failed to load blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '60px', textAlign: 'center' }}>Loading blogs...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="content-page" style={{ background: '#F8F6F4', minHeight: '80vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h1 style={{ 
              fontSize: '48px', 
              fontFamily: "'CS Gordon', serif",
              color: '#2B2B2B',
              marginBottom: '16px',
              textTransform: 'none'
            }}>
              FoeGuard Blog
            </h1>
            <p style={{ fontSize: '18px', color: '#666', maxWidth: '600px', margin: '0 auto', fontFamily: "'Rubik', sans-serif" }}>
              Expert tips, nutrition guides, and stories about raw pet food
            </p>
          </div>

          {/* Blog Grid */}
          {blogs.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <p style={{ fontSize: '18px', color: '#999' }}>No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '32px'
            }}>
              {blogs.map(blog => (
                <div
                  key={blog.blog_id}
                  onClick={() => navigate(`/blog/${blog.blog_id}`)}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                  }}
                >
                  {/* Blog Image */}
                  {blog.image_url && (
                    <div style={{
                      width: '100%',
                      height: '220px',
                      overflow: 'hidden',
                      background: '#E8DDD0'
                    }}>
                      <img
                        src={blog.image_url}
                        alt={blog.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  )}

                  {/* Blog Content */}
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{
                      fontSize: '24px',
                      fontFamily: "'Rubik', sans-serif",
                      fontWeight: '600',
                      color: '#2B2B2B',
                      marginBottom: '12px',
                      lineHeight: '1.3'
                    }}>
                      {blog.title}
                    </h2>

                    <p style={{
                      fontSize: '15px',
                      fontFamily: "'Rubik', sans-serif",
                      color: '#666',
                      lineHeight: '1.6',
                      marginBottom: '16px',
                      flex: 1
                    }}>
                      {blog.excerpt || blog.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
                    </p>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '13px',
                      fontFamily: "'Rubik', sans-serif",
                      color: '#999',
                      paddingTop: '16px',
                      borderTop: '1px solid #E8DDD0'
                    }}>
                      <span>{blog.author}</span>
                      <span>{new Date(blog.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export const BlogDetailPage = () => {
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Get blog ID from URL
  const blogId = window.location.pathname.split('/blog/')[1];

  useEffect(() => {
    loadBlog();
  }, [blogId]);

  const loadBlog = async () => {
    try {
      const { data } = await axios.get(`${API}/blogs/${blogId}`);
      setBlog(data);
      
      // Update meta tags for SEO
      if (data.meta_title) document.title = data.meta_title;
      if (data.meta_description) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.name = 'description';
          document.head.appendChild(metaDesc);
        }
        metaDesc.content = data.meta_description;
      }
    } catch (error) {
      console.error('Failed to load blog:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '60px', textAlign: 'center' }}>Loading...</div>
        <Footer />
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '60px', textAlign: 'center' }}>
          <h1>Blog post not found</h1>
          <button 
            onClick={() => navigate('/blog')}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              background: '#8B4513',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Back to Blog
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="content-page" style={{ background: '#F8F6F4' }}>
        {/* Hero Image */}
        {blog.image_url && (
          <div style={{
            width: '100%',
            height: '400px',
            overflow: 'hidden',
            background: '#E8DDD0',
            position: 'relative'
          }}>
            <img
              src={blog.image_url}
              alt={blog.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 50%)'
            }} />
          </div>
        )}

        {/* Blog Content */}
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
          {/* Back Button */}
          <button
            onClick={() => navigate('/blog')}
            style={{
              padding: '8px 16px',
              background: 'white',
              border: '2px solid #D9C8B3',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              marginBottom: '32px',
              color: '#2C2C2C',
              fontWeight: '500'
            }}
          >
            ← Back to Blog
          </button>

          {/* Title & Meta */}
          <h1 style={{
            fontSize: '48px',
            fontFamily: "'CS Gordon', serif",
            color: '#2B2B2B',
            marginBottom: '16px',
            lineHeight: '1.2',
            textTransform: 'none'
          }}>
            {blog.title}
          </h1>

          <div style={{
            display: 'flex',
            gap: '20px',
            fontSize: '14px',
            fontFamily: "'Rubik', sans-serif",
            color: '#999',
            paddingBottom: '24px',
            marginBottom: '32px',
            borderBottom: '2px solid #E8DDD0'
          }}>
            <span>By {blog.author}</span>
            <span>•</span>
            <span>{new Date(blog.created_at).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}</span>
          </div>

          {/* Blog Body */}
          <div
            style={{
              fontSize: '17px',
              fontFamily: "'Rubik', sans-serif",
              lineHeight: '1.8',
              color: '#2C2C2C',
              background: 'white',
              padding: '40px',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Share Section */}
          <div style={{
            marginTop: '60px',
            padding: '32px',
            background: 'white',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '16px', fontSize: '20px' }}>Enjoyed this article?</h3>
            <button
              onClick={() => navigate('/blog')}
              style={{
                padding: '12px 24px',
                background: '#8B4513',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Read More Articles
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
