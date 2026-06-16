import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/Layout';
import { ChevronLeft, ChevronRight, Check, Plus, Trash2 } from 'lucide-react';
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
  gender: '',
  is_neutered: null,
  breed: '',
  birthday: '',
  body_condition: '',
  weight_lbs: '',
  lifestyle: '',
  health_issues: []
});

// Capitalize first letter of name
const capitalizeName = (name) => {
  if (!name) return '';
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

// Format dog names for display in titles
const formatDogNames = (dogs) => {
  const names = dogs.map(d => capitalizeName(d.name)).filter(n => n);
  if (names.length === 0) return 'your dogs';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return names.slice(0, -1).join(', ') + ', and ' + names[names.length - 1];
};

export const MealPlanPage = () => {
  const navigate = useNavigate();
  const topRef = useRef(null);
  
  // 8 Steps Total:
  // 1 = How many dogs + Names
  // 2 = Where do they live (postal code)
  // 3 = Gender & Neutered for ALL dogs
  // 4 = Breed & Birthday for ALL dogs
  // 5 = Body Condition for ALL dogs
  // 6 = Weight & Lifestyle for ALL dogs
  // 7 = Health Issues for ALL dogs
  // 8 = Save Profile
  const [step, setStep] = useState(1);
  const [dogs, setDogs] = useState([createEmptyDog(0)]);
  const [postalCode, setPostalCode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const TOTAL_STEPS = 8;

  // Scroll to top when step changes
  useEffect(() => {
    const root = document.getElementById('root');
    if (root) root.scrollTop = 0;
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [step]);

  // Update a specific dog's field
  const updateDog = (index, field, value) => {
    setDogs(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Toggle health issue for a specific dog
  const toggleHealthIssue = (dogIndex, issueId) => {
    setDogs(prev => {
      const updated = [...prev];
      const dog = updated[dogIndex];
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
      
      updated[dogIndex] = { ...dog, health_issues: issues };
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
    }
  };

  // Check if current step can proceed
  const canProceed = () => {
    switch (step) {
      case 1: // Names
        return dogs.every(dog => dog.name && dog.name.trim() !== '');
      case 2: // Postal code
        return postalCode && postalCode.trim().length >= 3;
      case 3: // Gender & Neutered
        return dogs.every(dog => dog.gender && dog.is_neutered !== null);
      case 4: // Breed & Birthday
        return dogs.every(dog => dog.breed && dog.birthday);
      case 5: // Body Condition
        return dogs.every(dog => dog.body_condition);
      case 6: // Weight & Lifestyle
        return dogs.every(dog => dog.weight_lbs && dog.lifestyle);
      case 7: // Health Issues
        return dogs.every(dog => dog.health_issues.length > 0);
      case 8: // Save
        return true;
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
        postal_code: postalCode,
        dogs: dogs.map(dog => ({
          ...dog,
          name: capitalizeName(dog.name),
          weight_lbs: parseFloat(dog.weight_lbs) || 0
        }))
      });
      
      setProfileSaved(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Navigate steps
  const nextStep = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Calculate progress
  const getProgress = () => {
    return (step / TOTAL_STEPS) * 100;
  };

  // Render step content
  const renderStepContent = () => {
    // Step 1: How many dogs + Names
    if (step === 1) {
      return (
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '12px', textAlign: 'center', fontFamily: "'Barlow', sans-serif", textTransform: 'none' }}>
            How many dogs do you have?
          </h1>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px', fontSize: '16px' }}>
            Add each of your dogs and give them a name.
          </p>

          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {dogs.map((dog, index) => (
                <div 
                  key={dog.dog_id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px 20px',
                    background: '#F8F6F3',
                    borderRadius: '12px',
                    border: '2px solid #E8E4DC'
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#c8102e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '600',
                    flexShrink: 0
                  }}>
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    value={dog.name}
                    onChange={(e) => updateDog(index, 'name', e.target.value)}
                    placeholder="Dog's name"
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '2px solid #E8E4DC',
                      fontSize: '16px',
                      outline: 'none',
                      background: 'white',
                      textTransform: 'capitalize'
                    }}
                  />
                  {dogs.length > 1 && (
                    <button
                      onClick={() => removeDog(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#999',
                        cursor: 'pointer',
                        padding: '8px',
                        flexShrink: 0
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
                  e.currentTarget.style.borderColor = '#c8102e';
                  e.currentTarget.style.color = '#c8102e';
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

    // Step 2: Where do they live (Postal Code)
    if (step === 2) {
      return (
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '12px', textAlign: 'center', fontFamily: "'Barlow', sans-serif", textTransform: 'none' }}>
            Where {dogs.length === 1 ? `does ${capitalizeName(dogs[0].name)}` : `do ${formatDogNames(dogs)}`} live?
          </h1>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px', fontSize: '16px' }}>
            Enter your postal code so we can deliver to you.
          </p>

          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div>
              <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', marginBottom: '8px', color: '#2B2B2B' }}>
                Postal Code
              </label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
                placeholder="e.g., M5V 1A1"
                maxLength={7}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '8px',
                  border: '2px solid #E8E4DC',
                  fontSize: '18px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              />
              <p style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
                This helps us check if we deliver to your area and customize recommendations.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Step 3: Gender & Neutered for ALL dogs
    if (step === 3) {
      return (
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '12px', textAlign: 'center', fontFamily: "'Barlow', sans-serif", textTransform: 'none' }}>
            Tell us about {formatDogNames(dogs)}
          </h1>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px', fontSize: '16px' }}>
            Let's get to know {dogs.length === 1 ? 'your pup' : 'your pups'} a little better.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {dogs.map((dog, index) => {
              const name = capitalizeName(dog.name);
              return (
                <div key={dog.dog_id} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#c8102e' }}>
                    {name}
                  </h3>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#2B2B2B' }}>
                      Is {name} male or female?
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {['male', 'female'].map(gender => (
                        <button
                          key={gender}
                          onClick={() => updateDog(index, 'gender', gender)}
                          style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: dog.gender === gender ? '2px solid #c8102e' : '2px solid #E8E4DC',
                            background: dog.gender === gender ? '#FDF8F3' : 'white',
                            cursor: 'pointer',
                            fontSize: '15px',
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

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#2B2B2B' }}>
                      Is {name} neutered/spayed?
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {[{ value: true, label: 'Yes' }, { value: false, label: 'No' }].map(option => (
                        <button
                          key={String(option.value)}
                          onClick={() => updateDog(index, 'is_neutered', option.value)}
                          style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: dog.is_neutered === option.value ? '2px solid #c8102e' : '2px solid #E8E4DC',
                            background: dog.is_neutered === option.value ? '#FDF8F3' : 'white',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '500',
                            color: '#2B2B2B'
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Step 4: Breed & Birthday for ALL dogs
    if (step === 4) {
      return (
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '12px', textAlign: 'center', fontFamily: "'Barlow', sans-serif", textTransform: 'none' }}>
            What breed {dogs.length === 1 ? `is ${capitalizeName(dogs[0].name)}` : `are ${formatDogNames(dogs)}`}?
          </h1>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px', fontSize: '16px' }}>
            This helps us recommend the right portions.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {dogs.map((dog, index) => {
              const name = capitalizeName(dog.name);
              return (
                <div key={dog.dog_id} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#c8102e' }}>
                    {name}
                  </h3>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#2B2B2B' }}>
                      Breed
                    </label>
                    <select
                      value={dog.breed}
                      onChange={(e) => updateDog(index, 'breed', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '2px solid #E8E4DC',
                        fontSize: '15px',
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

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#2B2B2B' }}>
                      When is {name}'s birthday?
                    </label>
                    <input
                      type="date"
                      value={dog.birthday}
                      onChange={(e) => updateDog(index, 'birthday', e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '2px solid #E8E4DC',
                        fontSize: '15px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <p style={{ fontSize: '12px', color: '#666', marginTop: '6px' }}>
                      An estimate is fine if you don't know the exact date.
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Step 5: Body Condition for ALL dogs
    if (step === 5) {
      return (
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '12px', textAlign: 'center', fontFamily: "'Barlow', sans-serif", textTransform: 'none' }}>
            Describe {dogs.length === 1 ? `${capitalizeName(dogs[0].name)}'s` : 'their'} body condition
          </h1>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px', fontSize: '16px' }}>
            This helps us calculate the right calorie intake.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {dogs.map((dog, index) => {
              const name = capitalizeName(dog.name);
              return (
                <div key={dog.dog_id} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#c8102e' }}>
                    {name}
                  </h3>
                  
                  <div style={{ display: 'grid', gap: '10px' }}>
                    {[
                      { id: 'underweight', label: 'Underweight', desc: 'Ribs are visible' },
                      { id: 'fit', label: 'Fit', desc: 'Ribs can be felt but not seen' },
                      { id: 'overweight', label: 'Overweight', desc: 'Ribs can\'t be felt or seen' }
                    ].map(option => (
                      <button
                        key={option.id}
                        onClick={() => updateDog(index, 'body_condition', option.id)}
                        style={{
                          padding: '14px 16px',
                          borderRadius: '10px',
                          border: dog.body_condition === option.id ? '2px solid #c8102e' : '2px solid #E8E4DC',
                          background: dog.body_condition === option.id ? '#FDF8F3' : 'white',
                          cursor: 'pointer',
                          textAlign: 'left',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '15px', color: '#2B2B2B' }}>
                            {option.label}
                          </div>
                          <div style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                            {option.desc}
                          </div>
                        </div>
                        {dog.body_condition === option.id && <Check size={18} color="#c8102e" />}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Step 6: Weight & Lifestyle for ALL dogs
    if (step === 6) {
      return (
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '12px', textAlign: 'center', fontFamily: "'Barlow', sans-serif", textTransform: 'none' }}>
            Weight & lifestyle
          </h1>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px', fontSize: '16px' }}>
            Help us calculate the perfect portion sizes.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {dogs.map((dog, index) => {
              const name = capitalizeName(dog.name);
              return (
                <div key={dog.dog_id} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#c8102e' }}>
                    {name}
                  </h3>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#2B2B2B' }}>
                      How much does {name} weigh?
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="number"
                        value={dog.weight_lbs}
                        onChange={(e) => updateDog(index, 'weight_lbs', e.target.value)}
                        placeholder="0"
                        style={{
                          flex: 1,
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: '2px solid #E8E4DC',
                          fontSize: '15px',
                          outline: 'none'
                        }}
                      />
                      <span style={{ fontSize: '15px', fontWeight: '500', color: '#666' }}>lbs</span>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#2B2B2B' }}>
                      What is {name}'s lifestyle?
                    </label>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {[
                        { id: 'lower_energy', label: 'Lower Energy', desc: 'Mostly resting' },
                        { id: 'active', label: 'Active', desc: 'Daily walks' },
                        { id: 'high_energy', label: 'High Energy', desc: 'Very active' }
                      ].map(option => (
                        <button
                          key={option.id}
                          onClick={() => updateDog(index, 'lifestyle', option.id)}
                          style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: dog.lifestyle === option.id ? '2px solid #c8102e' : '2px solid #E8E4DC',
                            background: dog.lifestyle === option.id ? '#FDF8F3' : 'white',
                            cursor: 'pointer',
                            textAlign: 'left',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <span style={{ fontWeight: '500', fontSize: '14px', color: '#2B2B2B' }}>
                            {option.label} <span style={{ color: '#666', fontWeight: '400' }}>– {option.desc}</span>
                          </span>
                          {dog.lifestyle === option.id && <Check size={16} color="#c8102e" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Step 7: Health Issues for ALL dogs
    if (step === 7) {
      return (
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '12px', textAlign: 'center', fontFamily: "'Barlow', sans-serif", textTransform: 'none' }}>
            Any health issues or dietary needs?
          </h1>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px', fontSize: '16px' }}>
            Select all that apply for each dog.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {dogs.map((dog, dogIndex) => {
              const name = capitalizeName(dog.name);
              return (
                <div key={dog.dog_id} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#c8102e' }}>
                    {name}
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    {HEALTH_ISSUES.map(issue => {
                      const isSelected = dog.health_issues.includes(issue.id);
                      const isNone = issue.id === 'none';
                      
                      return (
                        <button
                          key={issue.id}
                          onClick={() => toggleHealthIssue(dogIndex, issue.id)}
                          style={{
                            padding: '10px 14px',
                            borderRadius: '8px',
                            border: isSelected ? `2px solid ${isNone ? '#2F4538' : '#c8102e'}` : '2px solid #E8E4DC',
                            background: isSelected ? (isNone ? '#E8F5E9' : '#FDF8F3') : 'white',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontSize: '13px',
                            fontWeight: '500',
                            color: '#2B2B2B',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gridColumn: isNone ? 'span 2' : 'auto'
                          }}
                        >
                          {issue.label}
                          {isSelected && <Check size={14} color={isNone ? '#2F4538' : '#c8102e'} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Step 8: Save Profile
    if (step === 8) {
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
              <h1 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '12px', fontFamily: "'Barlow', sans-serif", textTransform: 'none' }}>
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
                <p style={{ color: '#2C2C2C', lineHeight: '1.6' }}>
                  Based on the health conditions you've shared, one of our pet nutrition specialists will reach out to you within 24-48 hours to discuss {dogs.length === 1 ? `${capitalizeName(dogs[0].name)}'s` : "your dogs'"} specific needs and create a customized meal plan.
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
                  <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '8px' }}>{capitalizeName(dog.name)}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {dog.breed} • {dog.weight_lbs} lbs • {dog.lifestyle?.replace('_', ' ')}
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
                  background: '#c8102e',
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
                  color: '#c8102e',
                  border: '2px solid #c8102e',
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
          <h1 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '12px', textAlign: 'center', fontFamily: "'Barlow', sans-serif", textTransform: 'none' }}>
            Save Your Profile
          </h1>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px', fontSize: '16px' }}>
            Enter your email to save {dogs.length === 1 ? `${capitalizeName(dogs[0].name)}'s` : "your dogs'"} profile.
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
                background: email ? '#c8102e' : '#CCC',
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
              <p style={{ color: '#2C2C2C', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
                <strong>Note:</strong> Based on the health conditions selected, we'll contact you personally to discuss a customized meal plan.
              </p>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <Navbar />
      <div ref={topRef} className="meal-plan-page" style={{ minHeight: '100vh', background: '#F5F3EF', padding: '60px 20px 40px', position: 'relative' }}>
        {/* Back button — standard top-left */}
        <button
          onClick={() => navigate('/menu')}
          data-testid="meal-plan-close-btn"
          aria-label="Back"
          className="pd-uber-back"
        >
          <ChevronLeft size={18} strokeWidth={2.2} /> Back
        </button>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {/* Progress Bar */}
          {!profileSaved && (
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#666' }}>Step {step} of {TOTAL_STEPS}</span>
                <span style={{ fontSize: '13px', color: '#666' }}>{Math.round(getProgress())}%</span>
              </div>
              <div style={{ background: '#E8E4DC', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                <div style={{ 
                  background: '#c8102e', 
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
          {!profileSaved && step !== TOTAL_STEPS && (
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
                  background: canProceed() ? '#c8102e' : '#CCC',
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
