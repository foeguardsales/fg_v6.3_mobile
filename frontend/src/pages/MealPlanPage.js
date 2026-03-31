import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import { TreatsSection } from '../components/CartAndCheckout';
import { ChevronLeft, ChevronRight, Check, Plus, Minus } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const API = `${BACKEND_URL}/api`;

// Discount rates by box size
const DISCOUNT_RATES = {
  12: 0,
  18: 0.05,
  24: 0.10,
  30: 0.15,
  36: 0.15
};

// Dog breeds list
const DOG_BREEDS = [
  "Mixed / Unknown",
  "Labrador Retriever", "German Shepherd", "Golden Retriever", "French Bulldog", 
  "Bulldog", "Poodle", "Beagle", "Rottweiler", "German Shorthaired Pointer",
  "Dachshund", "Pembroke Welsh Corgi", "Australian Shepherd", "Yorkshire Terrier",
  "Boxer", "Cavalier King Charles Spaniel", "Doberman Pinscher", "Great Dane",
  "Miniature Schnauzer", "Siberian Husky", "Shih Tzu", "Boston Terrier",
  "Bernese Mountain Dog", "Pomeranian", "Havanese", "Shetland Sheepdog",
  "Brittany", "English Springer Spaniel", "Cocker Spaniel", "Miniature American Shepherd",
  "Border Collie", "Vizsla", "Basset Hound", "Mastiff", "Belgian Malinois",
  "Chihuahua", "Collie", "Maltese", "Weimaraner", "Rhodesian Ridgeback",
  "Newfoundland", "West Highland White Terrier", "Bichon Frise", "Bloodhound",
  "Akita", "Portuguese Water Dog", "Chesapeake Bay Retriever", "Dalmatian",
  "St. Bernard", "Papillon", "Australian Cattle Dog", "Bullmastiff", "Samoyed",
  "Scottish Terrier", "Soft Coated Wheaten Terrier", "Airedale Terrier", "Whippet",
  "Bull Terrier", "Alaskan Malamute", "Irish Setter", "Miniature Pinscher",
  "Chinese Shar-Pei", "Giant Schnauzer", "Old English Sheepdog", "Other"
].sort();

// Protein options
const PROTEINS = [
  { id: 'chicken', name: 'Chicken', productId: 'cd-chicken', traits: ['light', 'digestible', 'common'], pricePerLb: 4.50 },
  { id: 'beef', name: 'Beef', productId: 'cd-beef', traits: ['rich', 'flavorful', 'energy'], pricePerLb: 6.66 },
  { id: 'turkey', name: 'Turkey', productId: 'cd-turkey', traits: ['light', 'digestible', 'lean'], pricePerLb: 6.66 },
  { id: 'duck', name: 'Duck', productId: 'cd-duck', traits: ['omega', 'skin-coat', 'novel'], pricePerLb: 6.66 },
  { id: 'lamb', name: 'Lamb', productId: 'cd-lamb', traits: ['rich', 'flavorful', 'novel'], pricePerLb: 9.99 },
  { id: 'fish', name: 'Salmon', productId: 'cd-fish', traits: ['omega', 'skin-coat', 'joint'], pricePerLb: 7.49 },
  { id: 'goat', name: 'Goat', productId: 'cd-goat', traits: ['lean', 'hypoallergenic', 'novel'], pricePerLb: 9.99 },
  { id: 'rabbit', name: 'Rabbit', productId: 'cd-rabbit', traits: ['lean', 'hypoallergenic', 'novel'], pricePerLb: 14.38 }
];

// Health concerns
const HEALTH_CONCERNS = [
  { id: 'allergies', label: 'Allergies or sensitivities' },
  { id: 'digestive', label: 'Digestive issues' },
  { id: 'skin-coat', label: 'Skin or coat problems' },
  { id: 'joint', label: 'Joint or mobility issues' },
  { id: 'weight', label: 'Weight management' },
  { id: 'picky', label: 'Picky eater' },
  { id: 'none', label: 'None of the above' }
];

export const MealPlanPage = () => {
  const navigate = useNavigate();
  const topRef = useRef(null);
  
  // Load saved state from sessionStorage
  const savedState = sessionStorage.getItem('mealPlanState');
  const initialState = savedState ? JSON.parse(savedState) : {
    step: 1,
    showResults: false,
    formData: {
      name: '',
      dateOfBirth: '',
      breed: '',
      weight: '',
      weightUnit: 'lbs',
      bodyCondition: '',
      activityLevel: '',
      currentDiet: '',
      healthConcerns: [],
      allergies: [],
      favorites: []
    },
    results: null,
    selectedProteins: {},
    selectedTreats: []
  };
  
  const [step, setStep] = useState(initialState.step);
  const [showResults, setShowResults] = useState(initialState.showResults);
  const [treats, setTreats] = useState([]);
  const [selectedTreats, setSelectedTreats] = useState(initialState.selectedTreats);
  const [products, setProducts] = useState([]);
  const [selectedProteins, setSelectedProteins] = useState(initialState.selectedProteins);
  
  // Form data
  const [formData, setFormData] = useState(initialState.formData);

  // Calculated results
  const [results, setResults] = useState(initialState.results);

  // Scroll to top when step changes
  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [step, showResults]);

  // Save state to sessionStorage whenever it changes (but not products/treats - those are fetched)
  useEffect(() => {
    const state = {
      step,
      showResults,
      formData,
      results,
      selectedProteins,
      selectedTreats
    };
    sessionStorage.setItem('mealPlanState', JSON.stringify(state));
  }, [step, showResults, formData, results, selectedProteins, selectedTreats]);

  // Load treats and products
  useEffect(() => {
    const loadData = async () => {
      try {
        const [treatsRes, productsRes] = await Promise.all([
          axios.get(`${API}/treats`),
          axios.get(`${API}/products`)
        ]);
        
        setTreats(treatsRes.data.filter(t => t.pet_type === 'dog'));
        setProducts(productsRes.data.filter(p => p.product_line === 'comfort_dinner'));
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    loadData();
  }, []);

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field, item) => {
    setFormData(prev => {
      const arr = prev[field];
      if (item === 'none' && field === 'healthConcerns') {
        return { ...prev, [field]: arr.includes('none') ? [] : ['none'] };
      }
      if (arr.includes('none')) {
        return { ...prev, [field]: [item] };
      }
      if (arr.includes(item)) {
        return { ...prev, [field]: arr.filter(i => i !== item) };
      }
      return { ...prev, [field]: [...arr, item] };
    });
  };

  const calculateResults = () => {
    const { name, dateOfBirth, weight, weightUnit, bodyCondition, activityLevel, healthConcerns, allergies, favorites } = formData;
    
    // Calculate age and life stage
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const ageMonths = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24 * 30));
    const ageYears = Math.floor(ageMonths / 12);
    
    let lifeStage = 'adult';
    if (ageMonths < 12) lifeStage = 'puppy';
    else if (ageYears >= 7) lifeStage = 'senior';

    // Convert weight to lbs if needed
    let weightLbs = parseFloat(weight);
    if (weightUnit === 'kg') weightLbs = weightLbs * 2.205;
    const weightKg = weightLbs / 2.205;

    // Base percentage of body weight
    let basePercent = 0.025;
    if (lifeStage === 'puppy') basePercent = 0.075;
    else if (lifeStage === 'senior') basePercent = 0.022;

    // Adjust for body condition
    if (bodyCondition === 'underweight') basePercent += 0.005;
    else if (bodyCondition === 'slightly-overweight') basePercent -= 0.003;
    else if (bodyCondition === 'overweight') basePercent -= 0.005;

    // Adjust for activity
    if (activityLevel === 'low') basePercent -= 0.003;
    else if (activityLevel === 'high') basePercent += 0.005;

    // Calculate daily portion
    const dailyGrams = Math.round(weightKg * 1000 * basePercent);
    const dailyLbs = (dailyGrams / 453.592).toFixed(2);
    const monthlyLbs = Math.ceil((dailyGrams * 30) / 453.592);

    // Determine recommended box size (biweekly)
    const biweeklyLbs = Math.ceil(parseFloat(dailyLbs) * 14);
    let recommendedBoxSize = 12;
    if (biweeklyLbs <= 12) recommendedBoxSize = 12;
    else if (biweeklyLbs <= 18) recommendedBoxSize = 18;
    else if (biweeklyLbs <= 24) recommendedBoxSize = 24;
    else if (biweeklyLbs <= 30) recommendedBoxSize = 30;
    else recommendedBoxSize = 36;

    // Protein recommendation logic
    let availableProteins = PROTEINS.filter(p => !allergies.includes(p.id));
    let recommendedProtein = null;
    let recommendationReason = '';

    if (healthConcerns.includes('digestive')) {
      recommendedProtein = availableProteins.find(p => p.traits.includes('digestible'));
      recommendationReason = 'Easy to digest and gentle on sensitive stomachs';
    } else if (healthConcerns.includes('skin-coat')) {
      recommendedProtein = availableProteins.find(p => p.traits.includes('omega'));
      recommendationReason = 'Rich in omega fatty acids for skin and coat health';
    } else if (healthConcerns.includes('joint')) {
      recommendedProtein = availableProteins.find(p => p.traits.includes('lean'));
      recommendationReason = 'Lean protein to support joint health and mobility';
    } else if (healthConcerns.includes('weight')) {
      recommendedProtein = availableProteins.find(p => p.traits.includes('lean'));
      recommendationReason = 'Low-fat protein ideal for weight management';
    } else if (healthConcerns.includes('picky')) {
      recommendedProtein = availableProteins.find(p => p.traits.includes('flavorful'));
      recommendationReason = 'Rich, appealing flavor that picky eaters love';
    }

    if (favorites.length > 0) {
      const favProtein = availableProteins.find(p => favorites.includes(p.id));
      if (favProtein && !recommendedProtein) {
        recommendedProtein = favProtein;
        recommendationReason = `One of ${name}'s favorite proteins`;
      }
    }

    if (!recommendedProtein) {
      recommendedProtein = availableProteins.find(p => p.id === 'chicken') || availableProteins[0];
      recommendationReason = 'A great all-around protein to start with';
    }

    // Get cheapest available protein for cost calculation
    const cheapestProtein = [...availableProteins].sort((a, b) => a.pricePerLb - b.pricePerLb)[0];
    const discount = DISCOUNT_RATES[recommendedBoxSize] || 0;
    const dailyCost = (parseFloat(dailyLbs) * cheapestProtein.pricePerLb * (1 - discount)).toFixed(2);

    // Alternative proteins (top 3, excluding recommended)
    const alternativeProteins = availableProteins
      .filter(p => p.id !== recommendedProtein.id)
      .slice(0, 3);

    setResults({
      name,
      lifeStage,
      ageYears,
      ageMonths: ageMonths % 12,
      weightLbs: Math.round(weightLbs),
      dailyGrams,
      dailyLbs,
      monthlyLbs,
      recommendedBoxSize,
      discount,
      recommendedProtein,
      recommendationReason,
      alternativeProteins,
      availableProteins,
      dailyCost,
      cheapestProtein,
      monthlyAmount: recommendedBoxSize
    });
    
    // Initialize with empty - let customer choose freely
    setSelectedProteins({});
    
    setShowResults(true);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProteinUpdate = (productId, name, qty) => {
    setSelectedProteins(prev => {
      if (qty === 0) {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      }
      return { ...prev, [productId]: { name, qty } };
    });
  };

  const handleTreatToggle = (treat) => {
    setSelectedTreats(prev => {
      if (prev[treat.treat_id]) {
        const updated = { ...prev };
        delete updated[treat.treat_id];
        return updated;
      }
      return { ...prev, [treat.treat_id]: { ...treat, quantity: 1 } };
    });
  };

  const getTotalProteinLbs = () => {
    return Object.values(selectedProteins).reduce((sum, p) => sum + p.qty, 0);
  };

  const getSubtotal = () => {
    let total = 0;
    const discount = results ? DISCOUNT_RATES[results.recommendedBoxSize] || 0 : 0;
    
    // Proteins
    Object.entries(selectedProteins).forEach(([productId, data]) => {
      const product = products.find(p => p.product_id === productId);
      if (product) {
        const basePrice = product.pricing.find(p => p.size_lb === 6)?.price || 26.99;
        const pricePerSixLb = basePrice * (1 - discount);
        total += pricePerSixLb * (data.qty / 6);
      }
    });
    
    // Treats
    selectedTreats.forEach(treat => {
      total += treat.price * (treat.quantity || 1);
    });
    
    return total;
  };

  const startPlan = () => {
    const mealPlan = {
      ...results,
      selectedProteins,
      selectedTreats,
      formData
    };
    sessionStorage.setItem('mealPlan', JSON.stringify(mealPlan));
    navigate('/build-box', { state: { mealPlan } });
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name && formData.dateOfBirth && formData.breed;
      case 2:
        return formData.weight && formData.bodyCondition && formData.activityLevel;
      case 3:
        return formData.currentDiet && formData.healthConcerns.length > 0;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
      // Use setTimeout to ensure scroll happens after render
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 0);
    } else {
      calculateResults();
    }
  };

  const prevStep = () => {
    if (showResults) {
      setShowResults(false);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 0);
    } else if (step > 1) {
      setStep(step - 1);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 0);
    }
  };

  // Filter available products - show all Comfort Dinner products
  const getAvailableProducts = () => {
    return products.filter(p => p.product_line === 'comfort_dinner');
  };

  // Results Screen - Mini Menu Style
  if (showResults && results) {
    const availableProducts = getAvailableProducts();
    const boxSize = results.recommendedBoxSize;
    const discount = results.discount;
    const totalSelected = getTotalProteinLbs();
    const canAddMore = totalSelected < boxSize;

    return (
      <>
        <Navbar />
        <div ref={topRef} className="meal-plan-results" style={{ minHeight: '100vh', background: '#F5F3EF' }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #5F7C5A 0%, #4A6347 100%)',
            padding: '40px 20px',
            color: 'white'
          }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
              <button 
                onClick={prevStep}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  fontSize: '14px',
                  cursor: 'pointer',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  marginBottom: '20px'
                }}
              >
                <ChevronLeft size={18} /> Adjust Plan
              </button>
              
              <h1 style={{ 
                fontSize: 'clamp(28px, 5vw, 36px)', 
                fontWeight: '700', 
                marginBottom: '8px', 
                fontFamily: "'Rubik', sans-serif",
                color: 'white'
              }}>
                {results.name}'s meal plan is ready!
              </h1>
              
              <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', marginTop: '24px' }}>
                <div>
                  <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '4px' }}>Daily Requirement</p>
                  <p style={{ fontSize: '28px', fontWeight: '700' }}>{results.dailyGrams}g <span style={{ fontSize: '16px', opacity: 0.8 }}>({results.dailyLbs} lbs)</span></p>
                </div>
                <div>
                  <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '4px' }}>Starting at</p>
                  <p style={{ fontSize: '28px', fontWeight: '700' }}>${results.dailyCost}<span style={{ fontSize: '16px', opacity: 0.8 }}>/day</span></p>
                </div>
                <div>
                  <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '4px' }}>Recommended Box</p>
                  <p style={{ fontSize: '28px', fontWeight: '700' }}>{boxSize}lb {discount > 0 && <span style={{ fontSize: '16px', background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '12px', marginLeft: '8px' }}>{discount * 100}% off</span>}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Box Progress Bar */}
          <div style={{ 
            background: 'white', 
            padding: '20px',
            borderBottom: '1px solid #E8E4DC',
            position: 'sticky',
            top: 0,
            zIndex: 100
          }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: '600', color: '#2B2B2B' }}>{boxSize}lb Box</span>
                <span style={{ color: '#666' }}>{totalSelected}lb / {boxSize}lb selected</span>
              </div>
              <div style={{ background: '#E8E4DC', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
                <div style={{ 
                  background: totalSelected === boxSize ? '#5F7C5A' : '#8B4513', 
                  height: '100%', 
                  width: `${Math.min((totalSelected / boxSize) * 100, 100)}%`,
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px', color: '#2B2B2B' }}>
              Choose Your Proteins
            </h2>
            <p style={{ color: '#666', marginBottom: '24px' }}>
              We recommend <strong>Comfort {results.recommendedProtein.name}</strong> — {results.recommendationReason.toLowerCase()}
            </p>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
              gap: '20px',
              marginBottom: '48px'
            }}>
              {availableProducts.map(product => {
                const selected = selectedProteins[product.product_id];
                const qty = selected?.qty || 0;
                const isRecommended = product.product_id === `cd-${results.recommendedProtein.id}`;
                const basePrice = product.pricing.find(p => p.size_lb === 6)?.price || 26.99;
                const discountedPrice = (basePrice * (1 - discount)).toFixed(2);

                return (
                  <div 
                    key={product.product_id}
                    style={{
                      background: 'white',
                      borderRadius: '16px',
                      padding: '20px',
                      border: qty > 0 ? '3px solid #A41E34' : '3px solid transparent',
                      boxShadow: qty > 0 ? '0 4px 20px rgba(164, 30, 52, 0.25)' : '0 2px 12px rgba(0,0,0,0.06)',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                  >
                    {isRecommended && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: '#5F7C5A',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        RECOMMENDED
                      </div>
                    )}
                    
                    <div style={{
                      width: '100%',
                      height: '180px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      marginBottom: '16px',
                      background: '#f5f5f5'
                    }}>
                      <img 
                        src="https://customer-assets.emergentagent.com/job_site-upload-4/artifacts/ktno4gsu_2024%20site%20pics.jpg"
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', textTransform: 'none' }}>{product.name}</h3>
                    <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px', lineHeight: '1.4' }}>
                      {product.mini_description || product.description?.split('.')[0]}
                    </p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div>
                        {discount > 0 && (
                          <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '14px', marginRight: '8px' }}>
                            ${basePrice.toFixed(2)}
                          </span>
                        )}
                        <span style={{ fontSize: '18px', fontWeight: '700', color: '#8B4513' }}>${discountedPrice}</span>
                        <span style={{ fontSize: '13px', color: '#666' }}> / 6lb</span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => handleProteinUpdate(product.product_id, product.name, Math.max(0, qty - 6))}
                          disabled={qty === 0}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: '2px solid #E8E4DC',
                            background: 'white',
                            cursor: qty === 0 ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: qty === 0 ? 0.5 : 1
                          }}
                        >
                          <Minus size={16} color="#666" />
                        </button>
                        <span style={{ minWidth: '40px', textAlign: 'center', fontWeight: '600' }}>{qty}lb</span>
                        <button
                          onClick={() => handleProteinUpdate(product.product_id, product.name, qty + 6)}
                          disabled={!canAddMore}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: '2px solid #5F7C5A',
                            background: canAddMore ? '#5F7C5A' : '#E8E4DC',
                            cursor: canAddMore ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Plus size={16} color="white" />
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        sessionStorage.setItem('menuScrollPosition', window.scrollY.toString());
                        navigate(`/product/${product.product_id}`);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: 'none',
                        border: '2px solid #5F7C5A',
                        borderRadius: '8px',
                        color: '#5F7C5A',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#5F7C5A';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none';
                        e.currentTarget.style.color = '#5F7C5A';
                      }}
                    >
                      See more
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Treats Section */}
            <TreatsSection 
              selectedTreats={selectedTreats.map(t => ({ ...t, quantity: t.quantity || 1 }))}
              onToggleTreat={(treat, newQuantity) => {
                if (newQuantity === 0) {
                  setSelectedTreats(prev => prev.filter(t => t.treat_id !== treat.treat_id));
                } else {
                  setSelectedTreats(prev => {
                    const existing = prev.find(t => t.treat_id === treat.treat_id);
                    if (existing) {
                      return prev.map(t => t.treat_id === treat.treat_id ? { ...t, quantity: newQuantity } : t);
                    } else {
                      return [...prev, { ...treat, quantity: newQuantity }];
                    }
                  });
                }
              }}
              petType="dog"
              navigate={navigate}
            />

            {/* Order Summary & CTA */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              marginTop: '60px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>Order Summary</h3>
                  <p style={{ color: '#666', fontSize: '14px' }}>{boxSize}lb Box • {Object.keys(selectedProteins).length} protein(s) • {selectedTreats.length} treat(s)</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '14px', color: '#666' }}>Subtotal</p>
                  <p style={{ fontSize: '28px', fontWeight: '700', color: '#8B4513' }}>${getSubtotal().toFixed(2)}</p>
                </div>
              </div>
              
              <button
                onClick={startPlan}
                disabled={totalSelected === 0}
                style={{
                  width: '100%',
                  background: totalSelected > 0 ? '#8B4513' : '#CCC',
                  color: 'white',
                  border: 'none',
                  padding: '18px',
                  borderRadius: '8px',
                  fontSize: '17px',
                  fontWeight: '600',
                  cursor: totalSelected > 0 ? 'pointer' : 'not-allowed'
                }}
              >
                Continue to Checkout
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Form Steps
  return (
    <>
      <Navbar />
      <div ref={topRef} className="meal-plan-page" style={{ minHeight: '100vh', background: '#F5F3EF', padding: '40px 20px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {/* Progress */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '40px' }}>
            {[1, 2, 3].map(s => (
              <div 
                key={s}
                style={{
                  width: '60px',
                  height: '4px',
                  borderRadius: '2px',
                  background: s <= step ? '#8B4513' : '#D9D9D9'
                }}
              />
            ))}
          </div>

          {/* Step 1: Welcome + Bio */}
          {step === 1 && (
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '12px', textAlign: 'center', fontFamily: "'Rubik', sans-serif", textTransform: 'none' }}>
                Let's build your dog's meal plan.
              </h1>
              <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px', fontSize: '16px' }}>
                Tell us a little about your dog and we'll recommend the right meals, portions, and proteins.
              </p>

              <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '8px', color: '#2B2B2B' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateForm('name', e.target.value)}
                    placeholder="Your dog's name"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: '8px',
                      border: '2px solid #E8E4DC',
                      fontSize: '16px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '8px', color: '#2B2B2B' }}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateForm('dateOfBirth', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: '8px',
                      border: '2px solid #E8E4DC',
                      fontSize: '16px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '8px', color: '#2B2B2B' }}>
                    Breed
                  </label>
                  <select
                    value={formData.breed}
                    onChange={(e) => updateForm('breed', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: '8px',
                      border: '2px solid #E8E4DC',
                      fontSize: '16px',
                      outline: 'none',
                      background: 'white',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select breed</option>
                    {DOG_BREEDS.map(breed => (
                      <option key={breed} value={breed}>{breed}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Size + Activity */}
          {step === 2 && (
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '40px', textAlign: 'center', fontFamily: "'Rubik', sans-serif", textTransform: 'none' }}>
                Tell us about {formData.name}
              </h1>

              <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: '#2B2B2B' }}>
                    How much does {formData.name} weigh?
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => updateForm('weight', e.target.value)}
                      placeholder="Weight"
                      style={{
                        flex: 1,
                        padding: '14px 16px',
                        borderRadius: '8px',
                        border: '2px solid #E8E4DC',
                        fontSize: '16px',
                        outline: 'none'
                      }}
                    />
                    <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', border: '2px solid #E8E4DC' }}>
                      {['lbs', 'kg'].map(unit => (
                        <button
                          key={unit}
                          onClick={() => updateForm('weightUnit', unit)}
                          style={{
                            padding: '14px 20px',
                            border: 'none',
                            background: formData.weightUnit === unit ? '#8B4513' : 'white',
                            color: formData.weightUnit === unit ? 'white' : '#666',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '500'
                          }}
                        >
                          {unit}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: '#2B2B2B' }}>
                    How would you describe {formData.name}'s body condition?
                  </label>
                  <div style={{ display: 'grid', gap: '10px' }}>
                    {[
                      { id: 'underweight', label: 'Underweight' },
                      { id: 'just-right', label: 'Just right' },
                      { id: 'slightly-overweight', label: 'Slightly overweight' },
                      { id: 'overweight', label: 'Overweight' }
                    ].map(option => (
                      <button
                        key={option.id}
                        onClick={() => updateForm('bodyCondition', option.id)}
                        style={{
                          padding: '14px 20px',
                          borderRadius: '8px',
                          border: formData.bodyCondition === option.id ? '2px solid #8B4513' : '2px solid #E8E4DC',
                          background: formData.bodyCondition === option.id ? '#FDF8F3' : 'white',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: '15px',
                          color: '#2B2B2B'
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: '#2B2B2B' }}>
                    How active is {formData.name}?
                  </label>
                  <div style={{ display: 'grid', gap: '10px' }}>
                    {[
                      { id: 'low', label: 'Low', desc: 'Mostly resting, short walks' },
                      { id: 'moderate', label: 'Moderate', desc: 'Daily walks, some play' },
                      { id: 'high', label: 'High', desc: 'Long runs, working dog, very active' }
                    ].map(option => (
                      <button
                        key={option.id}
                        onClick={() => updateForm('activityLevel', option.id)}
                        style={{
                          padding: '14px 20px',
                          borderRadius: '8px',
                          border: formData.activityLevel === option.id ? '2px solid #8B4513' : '2px solid #E8E4DC',
                          background: formData.activityLevel === option.id ? '#FDF8F3' : 'white',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: '15px',
                          color: '#2B2B2B'
                        }}
                      >
                        <div style={{ fontWeight: '500' }}>{option.label}</div>
                        <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Diet + Health */}
          {step === 3 && (
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '40px', textAlign: 'center', fontFamily: "'Rubik', sans-serif", textTransform: 'none' }}>
                {formData.name}'s diet & health
              </h1>

              <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: '#2B2B2B' }}>
                    What is {formData.name} currently eating?
                  </label>
                  <div style={{ display: 'grid', gap: '10px' }}>
                    {[
                      { id: 'kibble', label: 'Kibble' },
                      { id: 'fresh', label: 'Fresh or gently cooked' },
                      { id: 'raw-other', label: 'Raw (another brand)' },
                      { id: 'homemade', label: 'Homemade raw' },
                      { id: 'mixed', label: 'Mixed' }
                    ].map(option => (
                      <button
                        key={option.id}
                        onClick={() => updateForm('currentDiet', option.id)}
                        style={{
                          padding: '14px 20px',
                          borderRadius: '8px',
                          border: formData.currentDiet === option.id ? '2px solid #8B4513' : '2px solid #E8E4DC',
                          background: formData.currentDiet === option.id ? '#FDF8F3' : 'white',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: '15px',
                          color: '#2B2B2B'
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: '#2B2B2B' }}>
                    Does {formData.name} have any of the following?
                  </label>
                  <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>Select all that apply</p>
                  <div style={{ display: 'grid', gap: '10px' }}>
                    {HEALTH_CONCERNS.map(concern => (
                      <button
                        key={concern.id}
                        onClick={() => toggleArrayItem('healthConcerns', concern.id)}
                        style={{
                          padding: '14px 20px',
                          borderRadius: '8px',
                          border: formData.healthConcerns.includes(concern.id) ? '2px solid #8B4513' : '2px solid #E8E4DC',
                          background: formData.healthConcerns.includes(concern.id) ? '#FDF8F3' : 'white',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: '15px',
                          color: '#2B2B2B',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        {concern.label}
                        {formData.healthConcerns.includes(concern.id) && <Check size={18} color="#8B4513" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: '#2B2B2B' }}>
                    Any proteins to avoid?
                  </label>
                  <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>Select all that apply</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {PROTEINS.map(protein => (
                      <button
                        key={protein.id}
                        onClick={() => toggleArrayItem('allergies', protein.id)}
                        style={{
                          padding: '10px 18px',
                          borderRadius: '20px',
                          border: formData.allergies.includes(protein.id) ? '2px solid #D32F2F' : '2px solid #E8E4DC',
                          background: formData.allergies.includes(protein.id) ? '#FFEBEE' : 'white',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: formData.allergies.includes(protein.id) ? '#D32F2F' : '#2B2B2B'
                        }}
                      >
                        {protein.name}
                      </button>
                    ))}
                    <button
                      onClick={() => updateForm('allergies', [])}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '20px',
                        border: formData.allergies.length === 0 ? '2px solid #8B4513' : '2px solid #E8E4DC',
                        background: formData.allergies.length === 0 ? '#FDF8F3' : 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#2B2B2B'
                      }}
                    >
                      None
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: '#2B2B2B' }}>
                    Does {formData.name} have any favourite proteins?
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {PROTEINS.filter(p => !formData.allergies.includes(p.id)).map(protein => (
                      <button
                        key={protein.id}
                        onClick={() => toggleArrayItem('favorites', protein.id)}
                        style={{
                          padding: '10px 18px',
                          borderRadius: '20px',
                          border: formData.favorites.includes(protein.id) ? '2px solid #5F7C5A' : '2px solid #E8E4DC',
                          background: formData.favorites.includes(protein.id) ? '#E8F5E9' : 'white',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: formData.favorites.includes(protein.id) ? '#5F7C5A' : '#2B2B2B'
                        }}
                      >
                        {protein.name}
                      </button>
                    ))}
                    <button
                      onClick={() => updateForm('favorites', [])}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '20px',
                        border: formData.favorites.length === 0 ? '2px solid #8B4513' : '2px solid #E8E4DC',
                        background: formData.favorites.length === 0 ? '#FDF8F3' : 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#2B2B2B'
                      }}
                    >
                      Open to trying
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{ 
            display: 'flex', 
            justifyContent: step === 1 ? 'flex-end' : 'space-between',
            marginTop: '32px' 
          }}>
            {step > 1 && (
              <button
                onClick={prevStep}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'white',
                  border: '2px solid #E8E4DC',
                  padding: '14px 28px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                <ChevronLeft size={20} /> Back
              </button>
            )}
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: canProceed() ? '#8B4513' : '#CCC',
                color: 'white',
                border: 'none',
                padding: '14px 32px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: canProceed() ? 'pointer' : 'not-allowed'
              }}
            >
              {step === 3 ? 'See My Plan' : 'Continue'} <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
