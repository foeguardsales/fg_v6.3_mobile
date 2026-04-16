import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import { ChevronLeft, ChevronRight, Check, Plus, Trash2, Dog } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const API = `${BACKEND_URL}/api`;

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

// Canadian Provinces
const PROVINCES = [
  "Alberta", "British Columbia", "Manitoba", "New Brunswick", 
  "Newfoundland and Labrador", "Nova Scotia", "Ontario", 
  "Prince Edward Island", "Quebec", "Saskatchewan",
  "Northwest Territories", "Nunavut", "Yukon"
];

// Health issues checklist
const HEALTH_ISSUES = [
  { id: 'allergies', label: 'Allergies' },
  { id: 'diabetes', label: 'Diabetes' },
  { id: 'constipation', label: 'Constipation' },
  { id: 'diarrhea', label: 'Diarrhea' },
  { id: 'itchy_skin', label: 'Itchy Skin' },
  { id: 'dry_coat', label: 'Dry Coat' },
  { id: 'obesity', label: 'Obesity' },
  { id: 'hyperactive', label: 'Hyperactive' },
  { id: 'joint_issues', label: 'Joint Issues' },
  { id: 'digestive_issues', label: 'Digestive Issues' },
  { id: 'kidney_disease', label: 'Kidney Disease' },
  { id: 'liver_disease', label: 'Liver Disease' },
  { id: 'pancreatitis', label: 'Pancreatitis' },
  { id: 'cancer', label: 'Cancer' },
  { id: 'seizures', label: 'Seizures' },
  { id: 'heart_disease', label: 'Heart Disease' },
  { id: 'picky_eater', label: 'Picky Eater' },
  { id: 'none', label: 'None' }
];

// Issues that require personal consultation
const CONSULTATION_ISSUES = ['allergies', 'diabetes', 'constipation', 'diarrhea', 'kidney_disease', 
                             'liver_disease', 'pancreatitis', 'cancer', 'seizures', 'heart_disease'];

// Empty dog template
const createEmptyDog = (index) => ({
  dog_id: `dog-${Date.now()}-${index}`,
  name: '',
  location: '',
  gender: '',
  is_neutered: null,
  breed: '',
  birthday: '',
  body_condition: '',
  weight_lbs: '',
  lifestyle: '',
  health_issues: []
});

export const MealPlanPage = () => {
  const navigate = useNavigate();
  const topRef = useRef(null);
  
  // Steps: 1=How many dogs, 2=Dog details (name/location/gender), 3=Neutered/Breed, 
  // 4=Birthday, 5=Body Condition, 6=Weight/Lifestyle, 7=Health Issues, 8=Save Profile
  const [step, setStep] = useState(1);
  const [currentDogIndex, setCurrentDogIndex] = useState(0);
  const [dogs, setDogs] = useState([createEmptyDog(0)]);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [existingProfile, setExistingProfile] = useState(null);

  // Total steps for each dog: 6 steps per dog (name/location/gender, neutered/breed, birthday, condition, weight/lifestyle, health)
  // Plus step 1 (how many dogs) and final step (save profile)
  const STEPS_PER_DOG = 6;
  const getTotalSteps = () => 1 + (dogs.length * STEPS_PER_DOG) + 1;
  
  // Current dog being edited
  const currentDog = dogs[currentDogIndex] || dogs[0];

  // Scroll to top when step changes
  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [step]);

  // Update a dog's field
  const updateDog = (field, value) => {
    setDogs(prev => {
      const updated = [...prev];
      updated[currentDogIndex] = { ...updated[currentDogIndex], [field]: value };
      return updated;
    });
  };

  // Toggle health issue
  const toggleHealthIssue = (issueId) => {
    setDogs(prev => {
      const updated = [...prev];
      const dog = updated[currentDogIndex];
      let issues = [...(dog.health_issues || [])];
      
      if (issueId === 'none') {
        issues = issues.includes('none') ? [] : ['none'];
      } else {
        issues = issues.filter(i => i !== 'none');
        if (issues.includes(issueId)) {
          issues = issues.filter(i => i !== issueId);
        } else {
          issues.push(issueId);
        }
      }
      
      updated[currentDogIndex] = { ...dog, health_issues: issues };
      return updated;
    });
  };

  // Add another dog
  const addDog = () => {
    setDogs(prev => [...prev, createEmptyDog(prev.length)]);
  };

  // Remove a dog
  const removeDog = (index) => {
    if (dogs.length > 1) {
      setDogs(prev => prev.filter((_, i) => i !== index));
      if (currentDogIndex >= index && currentDogIndex > 0) {
        setCurrentDogIndex(prev => prev - 1);
      }
    }
  };

  // Check if current step can proceed
  const canProceed = () => {
    if (step === 1) {
      return dogs.length > 0;
    }
    
    // Calculate which dog and which sub-step we're on
    const dogStep = (step - 2) % STEPS_PER_DOG + 1;
    
    switch (dogStep) {
      case 1: // Name, Location, Gender
        return currentDog.name && currentDog.gender;
      case 2: // Neutered, Breed
        return currentDog.is_neutered !== null && currentDog.breed;
      case 3: // Birthday
        return currentDog.birthday;
      case 4: // Body Condition
        return currentDog.body_condition;
      case 5: // Weight, Lifestyle
        return currentDog.weight_lbs && currentDog.lifestyle;
      case 6: // Health Issues
        return currentDog.health_issues.length > 0;
      default:
        return true;
    }
  };

  // Check if needs consultation
  const needsConsultation = () => {
    return dogs.some(dog => 
      dog.health_issues.some(issue => CONSULTATION_ISSUES.includes(issue))
    );
  };

  // Save profile
  const saveProfile = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }
    
    setSaving(true);
    setError('');
    
    try {
      const response = await axios.post(`${API}/profiles`, {
        email,
        phone,
        dogs: dogs.map(dog => ({
          ...dog,
          weight_lbs: parseFloat(dog.weight_lbs) || 0
        }))
      });
      
      setExistingProfile(response.data);
      setProfileSaved(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Navigate steps
  const nextStep = () => {
    const totalSteps = getTotalSteps();
    
    if (step < totalSteps) {
      // If we're in dog details steps, track which dog we're editing
      if (step >= 2 && step < totalSteps - 1) {
        const dogStep = (step - 2) % STEPS_PER_DOG + 1;
        
        // If finishing a dog's last step, move to next dog or save step
        if (dogStep === STEPS_PER_DOG) {
          if (currentDogIndex < dogs.length - 1) {
            setCurrentDogIndex(prev => prev + 1);
          }
        }
      }
      
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      // If we're in dog details steps, track which dog we're editing
      if (step >= 3 && step <= getTotalSteps() - 1) {
        const dogStep = (step - 2) % STEPS_PER_DOG + 1;
        
        // If going back from a dog's first step, go to previous dog
        if (dogStep === 1 && currentDogIndex > 0) {
          setCurrentDogIndex(prev => prev - 1);
        }
      }
      
      setStep(step - 1);
    }
  };

  // Calculate progress
  const getProgress = () => {
    return (step / getTotalSteps()) * 100;
  };

  // Get current dog step (1-6) for display
  const getCurrentDogStep = () => {
    if (step === 1 || step === getTotalSteps()) return null;
    return (step - 2) % STEPS_PER_DOG + 1;
  };

  // Render step content
  const renderStepContent = () => {
    // Step 1: How many dogs
    if (step === 1) {
      return (
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '12px', textAlign: 'center', fontFamily: "'Rubik', sans-serif", textTransform: 'none' }}>
            How many dogs do you have?
          </h1>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px', fontSize: '16px' }}>
            We'll create a personalized profile for each of your dogs.
          </p>

          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {dogs.map((dog, index) => (
                <div 
                  key={dog.dog_id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    background: '#F8F6F3',
                    borderRadius: '12px',
                    border: '2px solid #E8E4DC'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#8B4513',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '600'
                    }}>
                      {index + 1}
                    </div>
                    <span style={{ fontSize: '16px', fontWeight: '500' }}>
                      {dog.name || `Dog ${index + 1}`}
                    </span>
                  </div>
                  {dogs.length > 1 && (
                    <button
                      onClick={() => removeDog(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#999',
                        cursor: 'pointer',
                        padding: '8px'
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                onClick={addDog}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '16px',
                  background: 'none',
                  border: '2px dashed #D9D9D9',
                  borderRadius: '12px',
                  color: '#666',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#8B4513';
                  e.currentTarget.style.color = '#8B4513';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#D9D9D9';
                  e.currentTarget.style.color = '#666';
                }}
              >
                <Plus size={20} /> Add another dog
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Final step: Save Profile
    if (step === getTotalSteps()) {
      if (profileSaved) {
        const showConsultationMessage = needsConsultation();
        
        return (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#E8F5E9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <Check size={40} color="#2E7D32" />
              </div>
              <h1 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '12px', fontFamily: "'Rubik', sans-serif", textTransform: 'none' }}>
                Profile Saved!
              </h1>
              <p style={{ color: '#666', fontSize: '16px' }}>
                Your profile has been saved successfully.
              </p>
            </div>

            {showConsultationMessage && (
              <div style={{
                background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                border: '2px solid #FFB74D'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#E65100' }}>
                  We'll Contact You Personally
                </h3>
                <p style={{ color: '#5D4037', lineHeight: '1.6' }}>
                  Based on the health conditions you've shared, one of our pet nutrition specialists will reach out to you within 24-48 hours to discuss {dogs.length === 1 ? `${dogs[0].name}'s` : "your dogs'"} specific needs and create a customized meal plan.
                </p>
              </div>
            )}

            <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Your Dogs</h3>
              {dogs.map((dog, index) => (
                <div key={dog.dog_id} style={{
                  padding: '16px',
                  background: '#F8F6F3',
                  borderRadius: '12px',
                  marginBottom: index < dogs.length - 1 ? '12px' : '0'
                }}>
                  <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '8px' }}>{dog.name}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {dog.breed} • {dog.weight_lbs} lbs • {dog.lifestyle.replace('_', ' ')}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
              <button
                onClick={() => navigate('/build-box')}
                style={{
                  flex: 1,
                  padding: '16px 24px',
                  background: '#8B4513',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Build Your Box
              </button>
              <button
                onClick={() => navigate('/account')}
                style={{
                  flex: 1,
                  padding: '16px 24px',
                  background: 'white',
                  color: '#8B4513',
                  border: '2px solid #8B4513',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Go to My Account
              </button>
            </div>
          </div>
        );
      }

      return (
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '12px', textAlign: 'center', fontFamily: "'Rubik', sans-serif", textTransform: 'none' }}>
            Save Your Profile
          </h1>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px', fontSize: '16px' }}>
            Enter your email to save {dogs.length === 1 ? `${dogs[0].name}'s` : "your dogs'"} profile. You can edit it anytime from your account.
          </p>

          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '8px', color: '#2B2B2B' }}>
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
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
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
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

            {error && (
              <div style={{
                background: '#FFEBEE',
                color: '#C62828',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <button
              onClick={saveProfile}
              disabled={saving || !email}
              style={{
                width: '100%',
                padding: '16px 24px',
                background: email ? '#8B4513' : '#CCC',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: email ? 'pointer' : 'not-allowed'
              }}
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>

          {needsConsultation() && (
            <div style={{
              background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
              borderRadius: '16px',
              padding: '20px',
              marginTop: '24px',
              border: '2px solid #FFB74D'
            }}>
              <p style={{ color: '#5D4037', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
                <strong>Note:</strong> Based on the health conditions selected, we'll contact you personally to discuss a customized meal plan.
              </p>
            </div>
          )}
        </div>
      );
    }

    // Dog detail steps
    const dogStep = getCurrentDogStep();
    const dogName = currentDog.name || `Dog ${currentDogIndex + 1}`;

    // Step: Name, Location, Gender
    if (dogStep === 1) {
      return (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <span style={{
              display: 'inline-block',
              background: '#8B4513',
              color: 'white',
              fontSize: '12px',
              fontWeight: '600',
              padding: '4px 12px',
              borderRadius: '20px'
            }}>
              Dog {currentDogIndex + 1} of {dogs.length}
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '40px', textAlign: 'center', fontFamily: "'Rubik', sans-serif", textTransform: 'none' }}>
            Let's start with the basics
          </h1>

          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '8px', color: '#2B2B2B' }}>
                What's your dog's name?
              </label>
              <input
                type="text"
                value={currentDog.name}
                onChange={(e) => updateDog('name', e.target.value)}
                placeholder="e.g., Max"
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
                Where does {currentDog.name || 'your dog'} live?
              </label>
              <select
                value={currentDog.location}
                onChange={(e) => updateDog('location', e.target.value)}
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
                <option value="">Select province</option>
                {PROVINCES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: '#2B2B2B' }}>
                Is {currentDog.name || 'your dog'} male or female?
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {['male', 'female'].map(gender => (
                  <button
                    key={gender}
                    onClick={() => updateDog('gender', gender)}
                    style={{
                      padding: '16px 20px',
                      borderRadius: '8px',
                      border: currentDog.gender === gender ? '2px solid #8B4513' : '2px solid #E8E4DC',
                      background: currentDog.gender === gender ? '#FDF8F3' : 'white',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#2B2B2B',
                      textTransform: 'capitalize'
                    }}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Step: Neutered, Breed
    if (dogStep === 2) {
      return (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <span style={{
              display: 'inline-block',
              background: '#8B4513',
              color: 'white',
              fontSize: '12px',
              fontWeight: '600',
              padding: '4px 12px',
              borderRadius: '20px'
            }}>
              Dog {currentDogIndex + 1} of {dogs.length}
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '40px', textAlign: 'center', fontFamily: "'Rubik', sans-serif", textTransform: 'none' }}>
            Tell us more about {dogName}
          </h1>

          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: '#2B2B2B' }}>
                Is {dogName} neutered/spayed?
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[{ value: true, label: 'Yes' }, { value: false, label: 'No' }].map(option => (
                  <button
                    key={String(option.value)}
                    onClick={() => updateDog('is_neutered', option.value)}
                    style={{
                      padding: '16px 20px',
                      borderRadius: '8px',
                      border: currentDog.is_neutered === option.value ? '2px solid #8B4513' : '2px solid #E8E4DC',
                      background: currentDog.is_neutered === option.value ? '#FDF8F3' : 'white',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#2B2B2B'
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '8px', color: '#2B2B2B' }}>
                What breed is {dogName}?
              </label>
              <select
                value={currentDog.breed}
                onChange={(e) => updateDog('breed', e.target.value)}
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
      );
    }

    // Step: Birthday
    if (dogStep === 3) {
      return (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <span style={{
              display: 'inline-block',
              background: '#8B4513',
              color: 'white',
              fontSize: '12px',
              fontWeight: '600',
              padding: '4px 12px',
              borderRadius: '20px'
            }}>
              Dog {currentDogIndex + 1} of {dogs.length}
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '40px', textAlign: 'center', fontFamily: "'Rubik', sans-serif", textTransform: 'none' }}>
            When is {dogName}'s birthday?
          </h1>

          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div>
              <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '8px', color: '#2B2B2B' }}>
                Date of Birth
              </label>
              <input
                type="date"
                value={currentDog.birthday}
                onChange={(e) => updateDog('birthday', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
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
              <p style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
                If you don't know the exact date, an estimate is fine!
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Step: Body Condition
    if (dogStep === 4) {
      return (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <span style={{
              display: 'inline-block',
              background: '#8B4513',
              color: 'white',
              fontSize: '12px',
              fontWeight: '600',
              padding: '4px 12px',
              borderRadius: '20px'
            }}>
              Dog {currentDogIndex + 1} of {dogs.length}
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '40px', textAlign: 'center', fontFamily: "'Rubik', sans-serif", textTransform: 'none' }}>
            Describe {dogName}'s condition
          </h1>

          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'grid', gap: '12px' }}>
              {[
                { id: 'underweight', label: 'Underweight', desc: 'Low muscle and fat, ribs are visible' },
                { id: 'fit', label: 'Fit', desc: 'Regular muscle and fat, ribs can be felt but not seen' },
                { id: 'overweight', label: 'Overweight', desc: 'Excessive fat, ribs can\'t be felt or seen' }
              ].map(option => (
                <button
                  key={option.id}
                  onClick={() => updateDog('body_condition', option.id)}
                  style={{
                    padding: '20px',
                    borderRadius: '12px',
                    border: currentDog.body_condition === option.id ? '2px solid #8B4513' : '2px solid #E8E4DC',
                    background: currentDog.body_condition === option.id ? '#FDF8F3' : 'white',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px', color: '#2B2B2B' }}>
                    {option.label}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {option.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Step: Weight, Lifestyle
    if (dogStep === 5) {
      return (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <span style={{
              display: 'inline-block',
              background: '#8B4513',
              color: 'white',
              fontSize: '12px',
              fontWeight: '600',
              padding: '4px 12px',
              borderRadius: '20px'
            }}>
              Dog {currentDogIndex + 1} of {dogs.length}
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '40px', textAlign: 'center', fontFamily: "'Rubik', sans-serif", textTransform: 'none' }}>
            {dogName}'s weight & lifestyle
          </h1>

          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '8px', color: '#2B2B2B' }}>
                How much does {dogName} weigh?
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  value={currentDog.weight_lbs}
                  onChange={(e) => updateDog('weight_lbs', e.target.value)}
                  placeholder="0"
                  style={{
                    flex: 1,
                    padding: '14px 16px',
                    borderRadius: '8px',
                    border: '2px solid #E8E4DC',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
                <span style={{ fontSize: '16px', fontWeight: '500', color: '#666' }}>lbs</span>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: '#2B2B2B' }}>
                What is {dogName}'s lifestyle?
              </label>
              <div style={{ display: 'grid', gap: '12px' }}>
                {[
                  { id: 'lower_energy', label: 'Lower Energy', desc: 'Mostly resting, short walks' },
                  { id: 'active', label: 'Active', desc: 'Daily walks, regular play' },
                  { id: 'high_energy', label: 'High Energy', desc: 'Long runs, working dog, very active' }
                ].map(option => (
                  <button
                    key={option.id}
                    onClick={() => updateDog('lifestyle', option.id)}
                    style={{
                      padding: '16px 20px',
                      borderRadius: '8px',
                      border: currentDog.lifestyle === option.id ? '2px solid #8B4513' : '2px solid #E8E4DC',
                      background: currentDog.lifestyle === option.id ? '#FDF8F3' : 'white',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ fontWeight: '600', fontSize: '15px', marginBottom: '2px', color: '#2B2B2B' }}>
                      {option.label}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      {option.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Step: Health Issues
    if (dogStep === 6) {
      return (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <span style={{
              display: 'inline-block',
              background: '#8B4513',
              color: 'white',
              fontSize: '12px',
              fontWeight: '600',
              padding: '4px 12px',
              borderRadius: '20px'
            }}>
              Dog {currentDogIndex + 1} of {dogs.length}
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '12px', textAlign: 'center', fontFamily: "'Rubik', sans-serif", textTransform: 'none' }}>
            Any health issues or dietary needs?
          </h1>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '32px', fontSize: '15px' }}>
            Select all that apply to {dogName}
          </p>

          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {HEALTH_ISSUES.map(issue => {
                const isSelected = currentDog.health_issues.includes(issue.id);
                const isNone = issue.id === 'none';
                
                return (
                  <button
                    key={issue.id}
                    onClick={() => toggleHealthIssue(issue.id)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '8px',
                      border: isSelected ? `2px solid ${isNone ? '#5F7C5A' : '#8B4513'}` : '2px solid #E8E4DC',
                      background: isSelected ? (isNone ? '#E8F5E9' : '#FDF8F3') : 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#2B2B2B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gridColumn: isNone ? 'span 2' : 'auto'
                    }}
                  >
                    {issue.label}
                    {isSelected && <Check size={16} color={isNone ? '#5F7C5A' : '#8B4513'} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <Navbar />
      <div ref={topRef} className="meal-plan-page" style={{ minHeight: '100vh', background: '#F5F3EF', padding: '40px 20px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {/* Progress Bar */}
          {!profileSaved && (
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#666' }}>Step {step} of {getTotalSteps()}</span>
                <span style={{ fontSize: '13px', color: '#666' }}>{Math.round(getProgress())}%</span>
              </div>
              <div style={{ background: '#E8E4DC', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                <div style={{ 
                  background: '#8B4513', 
                  height: '100%', 
                  width: `${getProgress()}%`,
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          )}

          {/* Step Content */}
          {renderStepContent()}

          {/* Navigation Buttons */}
          {!profileSaved && step !== getTotalSteps() && (
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
                Continue <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};
