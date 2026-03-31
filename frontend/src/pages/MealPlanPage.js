import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import { ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001/api';

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
  { id: 'chicken', name: 'Chicken', traits: ['light', 'digestible', 'common'] },
  { id: 'beef', name: 'Beef', traits: ['rich', 'flavorful', 'energy'] },
  { id: 'turkey', name: 'Turkey', traits: ['light', 'digestible', 'lean'] },
  { id: 'duck', name: 'Duck', traits: ['omega', 'skin-coat', 'novel'] },
  { id: 'lamb', name: 'Lamb', traits: ['rich', 'flavorful', 'novel'] },
  { id: 'fish', name: 'Fish/Salmon', traits: ['omega', 'skin-coat', 'joint'] },
  { id: 'goat', name: 'Goat', traits: ['lean', 'hypoallergenic', 'novel'] },
  { id: 'rabbit', name: 'Rabbit', traits: ['lean', 'hypoallergenic', 'novel'] }
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
  const [step, setStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [treats, setTreats] = useState([]);
  const [selectedTreats, setSelectedTreats] = useState([]);
  
  // Form data
  const [formData, setFormData] = useState({
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
  });

  // Calculated results
  const [results, setResults] = useState(null);

  // Load treats for the results page
  useEffect(() => {
    const loadTreats = async () => {
      try {
        const { data } = await axios.get(`${API}/treats`);
        setTreats(data.filter(t => t.pet_type === 'dog'));
      } catch (error) {
        console.error('Failed to load treats:', error);
      }
    };
    loadTreats();
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
    let basePercent = 0.025; // 2.5% default for adult
    if (lifeStage === 'puppy') basePercent = 0.075; // 7.5% for puppies
    else if (lifeStage === 'senior') basePercent = 0.022; // 2.2% for seniors

    // Adjust for body condition
    if (bodyCondition === 'underweight') basePercent += 0.005;
    else if (bodyCondition === 'slightly-overweight') basePercent -= 0.003;
    else if (bodyCondition === 'overweight') basePercent -= 0.005;

    // Adjust for activity
    if (activityLevel === 'low') basePercent -= 0.003;
    else if (activityLevel === 'high') basePercent += 0.005;

    // Calculate daily portion in grams
    const dailyGrams = Math.round(weightKg * 1000 * basePercent);
    const dailyLbs = (dailyGrams / 453.592).toFixed(2);
    const monthlyLbs = Math.ceil((dailyGrams * 30) / 453.592);

    // Protein recommendation logic
    let availableProteins = PROTEINS.filter(p => !allergies.includes(p.id));
    let recommendedProtein = null;
    let recommendationReason = '';

    // Priority order based on health concerns
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

    // Check favorites
    if (favorites.length > 0) {
      const favProtein = availableProteins.find(p => favorites.includes(p.id));
      if (favProtein && !recommendedProtein) {
        recommendedProtein = favProtein;
        recommendationReason = `One of ${name}'s favorite proteins`;
      }
    }

    // Default to chicken if no specific recommendation
    if (!recommendedProtein) {
      recommendedProtein = availableProteins.find(p => p.id === 'chicken') || availableProteins[0];
      recommendationReason = 'A great all-around protein to start with';
    }

    // Alternative proteins
    const alternativeProteins = availableProteins
      .filter(p => p.id !== recommendedProtein.id)
      .slice(0, 3);

    // Estimated monthly cost (using Comfort Dinner pricing)
    const pricePerLb = 4.50; // Base chicken price
    const monthlyCost = (monthlyLbs * pricePerLb).toFixed(2);

    // Transition guidance
    let transitionGuide = '';
    if (formData.currentDiet === 'raw-other' || formData.currentDiet === 'homemade') {
      transitionGuide = 'Since ' + name + ' is already eating raw, you can transition immediately or over 2-3 days.';
    } else if (formData.currentDiet === 'fresh') {
      transitionGuide = 'Transition over 5-7 days, gradually increasing raw while decreasing current food.';
    } else {
      transitionGuide = 'Transition slowly over 7-10 days. Start with 25% raw and increase gradually.';
    }

    setResults({
      name,
      lifeStage,
      ageYears,
      ageMonths: ageMonths % 12,
      weightLbs: Math.round(weightLbs),
      dailyGrams,
      dailyLbs,
      monthlyLbs,
      recommendedProtein,
      recommendationReason,
      alternativeProteins,
      monthlyCost,
      transitionGuide
    });
    
    setShowResults(true);
  };

  const handleTreatToggle = (treat) => {
    setSelectedTreats(prev => {
      const existing = prev.find(t => t.treat_id === treat.treat_id);
      if (existing) {
        return prev.filter(t => t.treat_id !== treat.treat_id);
      }
      return [...prev, { ...treat, quantity: 1 }];
    });
  };

  const startPlan = () => {
    // Save meal plan to session storage for checkout
    const mealPlan = {
      ...results,
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
    } else {
      calculateResults();
    }
  };

  const prevStep = () => {
    if (showResults) {
      setShowResults(false);
    } else if (step > 1) {
      setStep(step - 1);
    }
  };

  // Results Screen
  if (showResults && results) {
    return (
      <>
        <Navbar />
        <div className="meal-plan-page" style={{ minHeight: '100vh', background: '#F5F3EF', padding: '40px 20px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Back Button */}
            <button 
              onClick={prevStep}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                color: '#666',
                fontSize: '15px',
                cursor: 'pointer',
                marginBottom: '24px'
              }}
            >
              <ChevronLeft size={20} /> Adjust My Plan
            </button>

            {/* Results Header */}
            <div style={{
              background: 'linear-gradient(135deg, #5F7C5A 0%, #4A6347 100%)',
              borderRadius: '20px',
              padding: '40px',
              color: 'white',
              marginBottom: '32px'
            }}>
              <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '12px', fontFamily: "'Rubik', sans-serif" }}>
                {results.name}'s meal plan is ready!
              </h1>
              <p style={{ fontSize: '16px', opacity: 0.9 }}>
                Built around {results.name}'s breed, age, weight, activity level, and dietary needs.
              </p>
            </div>

            {/* Recommended Protein */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '24px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#2B2B2B' }}>
                Recommended Protein
              </h2>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                padding: '20px',
                background: '#F5F3EF',
                borderRadius: '12px',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: '#5F7C5A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Check size={28} color="white" />
                </div>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#2B2B2B', marginBottom: '4px' }}>
                    Comfort {results.recommendedProtein.name}
                  </h3>
                  <p style={{ color: '#666', fontSize: '15px' }}>{results.recommendationReason}</p>
                </div>
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Alternative options:</p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {results.alternativeProteins.map(p => (
                    <span key={p.id} style={{
                      padding: '8px 16px',
                      background: '#E8E4DC',
                      borderRadius: '20px',
                      fontSize: '14px',
                      color: '#555'
                    }}>
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Portions & Cost */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
              }}>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Daily Portion</p>
                <p style={{ fontSize: '28px', fontWeight: '700', color: '#2B2B2B' }}>{results.dailyGrams}g</p>
                <p style={{ fontSize: '13px', color: '#999' }}>({results.dailyLbs} lbs)</p>
              </div>
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
              }}>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Monthly Requirement</p>
                <p style={{ fontSize: '28px', fontWeight: '700', color: '#2B2B2B' }}>{results.monthlyLbs} lbs</p>
              </div>
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
              }}>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Estimated Monthly Cost</p>
                <p style={{ fontSize: '28px', fontWeight: '700', color: '#5F7C5A' }}>${results.monthlyCost}</p>
              </div>
            </div>

            {/* Transition Guide */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px'
            }}>
              <AlertCircle size={24} color="#8B4513" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#2B2B2B' }}>
                  Transition Guidance
                </h3>
                <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6' }}>
                  {results.transitionGuide}
                </p>
              </div>
            </div>

            {/* Add Treats Section */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '32px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#2B2B2B' }}>
                Add Treats to Your Plan
              </h2>
              <p style={{ color: '#666', fontSize: '15px', marginBottom: '24px' }}>
                Raw treats for dental health, mental stimulation, and natural chewing.
              </p>
              
              <div style={{ display: 'grid', gap: '12px' }}>
                {treats.slice(0, 6).map(treat => {
                  const isSelected = selectedTreats.some(t => t.treat_id === treat.treat_id);
                  return (
                    <div 
                      key={treat.treat_id}
                      onClick={() => handleTreatToggle(treat)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        background: isSelected ? '#F5F3EF' : '#FAFAFA',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #5F7C5A' : '2px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{treat.name}</h4>
                        <p style={{ fontSize: '13px', color: '#666' }}>{treat.quantity_description}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontWeight: '700', color: '#8B4513' }}>${treat.price.toFixed(2)}</span>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: isSelected ? '#5F7C5A' : '#E0E0E0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {isSelected && <Check size={14} color="white" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button
                onClick={startPlan}
                style={{
                  background: '#8B4513',
                  color: 'white',
                  border: 'none',
                  padding: '16px 40px',
                  borderRadius: '8px',
                  fontSize: '17px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Start My Plan
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
      <div className="meal-plan-page" style={{ minHeight: '100vh', background: '#F5F3EF', padding: '40px 20px' }}>
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
                      outline: 'none'
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
                      outline: 'none'
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
                      background: 'white'
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

                {formData.healthConcerns.includes('allergies') && (
                  <div style={{ marginBottom: '28px' }}>
                    <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: '#2B2B2B' }}>
                      Is {formData.name} allergic or sensitive to any proteins?
                    </label>
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
                    </div>
                  </div>
                )}

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
