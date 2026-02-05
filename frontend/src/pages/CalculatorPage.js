import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import { FeedingCalculator } from '../components/FeedingCalculator';

export const CalculatorPage = () => {
  const navigate = useNavigate();
  
  const handleComplete = (recommendedSize) => {
    navigate('/build-box');
  };

  return (
    <>
      <Navbar />
      <FeedingCalculator onComplete={handleComplete} />
      <Footer />
    </>
  );
};