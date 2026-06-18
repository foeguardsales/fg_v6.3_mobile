import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import { FeedingCalculator } from '../components/FeedingCalculator';
import { SelectionBreadcrumb } from './BoxBuilder';

export const CalculatorPage = () => {
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate('/menu');
  };

  return (
    <>
      <Navbar />
      <SelectionBreadcrumb
        label="Feeding Calculator"
        onEdit={() => {
          sessionStorage.removeItem('foeguard_selection');
          navigate('/menu');
        }}
      />
      <FeedingCalculator onComplete={handleComplete} />
      <Footer />
    </>
  );
};
