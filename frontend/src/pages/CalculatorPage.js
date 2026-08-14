import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import { FeedingCalculator } from '../components/FeedingCalculator';
import { useShopifyPage } from '../hooks/useShopifyPage';
import { getMetafieldMetaobjects } from '../services/shopify/pageMeta';
import { SeoHead } from '../components/SeoHead';

export const CalculatorPage = () => {
  const navigate = useNavigate();
  const { page } = useShopifyPage('raw-pet-food-feeding-calculator');

  // Hero (page_hero_banner) header + subheader come from Shopify; design + the
  // calculator function stay exactly as-is.
  const hero = (getMetafieldMetaobjects(page, 'page_builder') || [])
    .find((s) => /hero/.test(s.__type || ''));
  const title = hero
    ? (hero.page_hero_header || hero.header || hero.title || null)
    : null;
  const subheader = hero
    ? (hero.page_hero_subheading || hero.subheading || hero.subheader || null)
    : null;

  const handleComplete = () => {
    navigate('/menu');
  };

  return (
    <>
      <SeoHead endpoint="/api/shopify/page/raw-pet-food-feeding-calculator" fallback={{ title: 'Feeding Calculator | FoeGuard' }} />
      <Navbar />
      <FeedingCalculator onComplete={handleComplete} title={title} subheader={subheader} />
      <Footer />
    </>
  );
};

export default CalculatorPage;
