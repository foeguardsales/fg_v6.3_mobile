import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Check, Trash2 } from 'lucide-react';
import { useAuth } from '../lib/useAuth';

const DEFAULT_PET = () => ({
  id: Date.now() + Math.random(),
  name: '',
  species: 'dog',
  age_months: '',
  weight: '',
  activity: 'moderate'
});

export const FeedingCalculator = ({ onComplete, embedded = false }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [pets, setPets] = useState([DEFAULT_PET()]);
  const [savedPets, setSavedPets] = useState([]);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Load saved pets — localStorage when logged in (persistent),
  // sessionStorage when logged out (temporary, this session only)
  useEffect(() => {
    const key = 'foeguard_saved_pets';
    const store = isAuthenticated ? localStorage : sessionStorage;
    const saved = store.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedPets(parsed);
          setPets(parsed);
        }
      } catch (e) { /* ignore */ }
    }
  }, [isAuthenticated]);

  const addPet = () => {
    setPets([...pets, DEFAULT_PET()]);
  };

  const updatePet = (id, field, value) => {
    setPets(pets.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removePet = (id) => {
    if (pets.length > 1) {
      setPets(pets.filter(p => p.id !== id));
    }
  };

  const calculateFeeding = (pet) => {
    const weight = parseFloat(pet.weight);
    const ageMonths = parseInt(pet.age_months);
    if (!weight || !ageMonths) return null;

    let basePercentage = 2.5;
    if (pet.species === 'dog') {
      if (ageMonths < 4) basePercentage = 11.5;
      else if (ageMonths < 8) basePercentage = 8;
      else if (ageMonths < 12) basePercentage = 4.5;
      else basePercentage = 2.75;
    } else {
      if (ageMonths < 4) basePercentage = 7.5;
      else if (ageMonths < 8) basePercentage = 6.5;
      else if (ageMonths < 12) basePercentage = 4;
      else basePercentage = 3.25;
    }
    if (pet.activity === 'low') basePercentage *= 0.9;
    if (pet.activity === 'high') basePercentage *= 1.1;

    const dailyOz = (weight * basePercentage / 100) * 16;
    return Math.round(dailyOz);
  };

  const getTotalRecommendation = () => {
    const totalDailyOz = pets.reduce((sum, pet) => sum + (calculateFeeding(pet) || 0), 0);
    const dailyLbs = totalDailyOz / 16;
    const weeklyLbs = dailyLbs * 7;
    const biweeklyLbs = weeklyLbs * 2;
    const monthlyLbs = dailyLbs * 30;

    let recommendedSize = 12;
    if (biweeklyLbs > 12 && biweeklyLbs <= 18) recommendedSize = 18;
    else if (biweeklyLbs > 18 && biweeklyLbs <= 24) recommendedSize = 24;
    else if (biweeklyLbs > 24) recommendedSize = 30;

    return {
      totalDailyOz,
      dailyLbs: dailyLbs.toFixed(2),
      weeklyLbs: weeklyLbs.toFixed(2),
      biweeklyLbs: biweeklyLbs.toFixed(2),
      monthlyLbs: monthlyLbs.toFixed(2),
      recommendedSize
    };
  };

  const recommendation = getTotalRecommendation();
  const isComplete = pets.every(p => p.name && p.age_months && p.weight);
  const hasSavedPets = savedPets.length > 0;

  // Save: localStorage (persistent) if logged in, sessionStorage (temp) if logged out
  const handleSave = () => {
    const petsToSave = pets.filter(p => p.name && p.age_months && p.weight);
    if (petsToSave.length === 0) return;

    const key = 'foeguard_saved_pets';
    const store = isAuthenticated ? localStorage : sessionStorage;
    store.setItem(key, JSON.stringify(petsToSave));

    // Always mirror to session for sticky checkout/cart drawer
    sessionStorage.setItem('foeguard_calculator_pets', JSON.stringify(petsToSave));
    sessionStorage.setItem('foeguard_calculator_recommendation', JSON.stringify(recommendation));

    setSavedPets(petsToSave);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 1500);

    // Return to the menu after a short delay so the user sees confirmation
    setTimeout(() => {
      if (onComplete) onComplete(recommendation.recommendedSize, petsToSave);
    }, 600);
  };

  const clearSavedPets = () => {
    localStorage.removeItem('foeguard_saved_pets');
    sessionStorage.removeItem('foeguard_saved_pets');
    sessionStorage.removeItem('foeguard_calculator_pets');
    sessionStorage.removeItem('foeguard_calculator_recommendation');
    setSavedPets([]);
    setPets([DEFAULT_PET()]);
  };

  return (
    <div
      className="feeding-calc"
      style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: embedded ? '20px 18px 32px' : '60px 20px 40px',
        position: 'relative'
      }}
    >
      {!embedded && (
        <button
          onClick={() => navigate(-1)}
          data-testid="calc-close-btn"
          aria-label="Back"
          className="pd-uber-back"
        >
          <ArrowLeft size={18} strokeWidth={2.2} /> Back
        </button>
      )}

      <h2 style={{ fontSize: '32px', textAlign: 'center', marginBottom: '12px', fontFamily: "'Barlow', sans-serif", fontWeight: 700 }}>
        Feeding Calculator
      </h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '28px', fontFamily: "'Barlow', sans-serif" }}>
        Tell us about your pet(s) to get personalized feeding recommendations.
        {isAuthenticated
          ? ' Saved to your account.'
          : ' Saved for this browser session.'}
      </p>

      {pets.map((pet, index) => (
        <div
          key={pet.id}
          className="calc-pet-card"
          style={{
            background: 'white',
            border: '1px solid #D8CFB8',
            borderRadius: '12px',
            padding: '22px',
            marginBottom: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '18px', color: '#c8102e', margin: 0, fontFamily: "'Barlow', sans-serif" }}>
              {pets.length > 1 ? `Pet ${index + 1}` : 'Pet'}
            </h3>
            {pets.length > 1 && (
              <button
                onClick={() => removePet(pet.id)}
                aria-label="Remove pet"
                style={{ background: 'transparent', border: 'none', color: '#C33', cursor: 'pointer', fontSize: '22px', lineHeight: 1 }}
              >
                ×
              </button>
            )}
          </div>

          {/* Vertical, straight stack of inputs */}
          <div className="form-group">
            <label>Pet Name</label>
            <input
              type="text"
              value={pet.name}
              onChange={(e) => updatePet(pet.id, 'name', e.target.value)}
              placeholder="e.g., Max"
              data-testid={`calc-name-${index}`}
            />
          </div>

          <div className="form-group">
            <label>Pet type</label>
            <select
              value={pet.species}
              onChange={(e) => updatePet(pet.id, 'species', e.target.value)}
              data-testid={`calc-species-${index}`}
              style={{ width: '100%', padding: '14px 16px', border: '2px solid #E5E7E6', borderRadius: '10px', fontSize: '16px' }}
            >
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="puppy">Puppy</option>
              <option value="kitten">Kitten</option>
            </select>
          </div>

          <div className="form-group">
            <label>Age ({(pet.species === 'dog' || pet.species === 'cat') ? 'years' : 'months'})</label>
            <input
              type="number"
              onChange={(e) => {
                let value = e.target.value;
                if (pet.species === 'dog' || pet.species === 'cat') {
                  value = value ? parseInt(value) * 12 : '';
                }
                updatePet(pet.id, 'age_months', value);
              }}
              placeholder={(pet.species === 'dog' || pet.species === 'cat') ? 'e.g., 2' : 'e.g., 8'}
              min="1"
              value={(pet.species === 'dog' || pet.species === 'cat') && pet.age_months ? Math.floor(pet.age_months / 12) : pet.age_months}
              data-testid={`calc-age-${index}`}
            />
          </div>

          <div className="form-group">
            <label>Weight (lbs)</label>
            <input
              type="number"
              value={pet.weight}
              onChange={(e) => updatePet(pet.id, 'weight', e.target.value)}
              placeholder="e.g., 50"
              min="1"
              step="0.1"
              data-testid={`calc-weight-${index}`}
            />
          </div>

          <div className="form-group">
            <label>Activity Level</label>
            <select
              value={pet.activity}
              onChange={(e) => updatePet(pet.id, 'activity', e.target.value)}
              data-testid={`calc-activity-${index}`}
              style={{ width: '100%', padding: '14px 16px', border: '2px solid #E5E7E6', borderRadius: '10px', fontSize: '16px' }}
            >
              <option value="low">Low (mostly resting)</option>
              <option value="moderate">Moderate (regular walks)</option>
              <option value="high">High (very active)</option>
            </select>
          </div>

          {pet.name && pet.age_months && pet.weight && (
            <div style={{
              padding: '14px',
              background: '#FFF9F5',
              borderRadius: '8px',
              border: '1px solid #D2B48C'
            }}>
              <strong style={{ color: '#c8102e' }}>{pet.name}&apos;s Recommendation:</strong>
              <p style={{ margin: '6px 0 0 0', color: '#555' }}>
                Feed approximately <strong>{calculateFeeding(pet)} oz</strong> per day
                ({(calculateFeeding(pet) / 16).toFixed(2)} lbs/day) — <strong>{((calculateFeeding(pet) / 16) * 30).toFixed(1)} lbs/month</strong>
              </p>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={addPet}
        data-testid="calc-add-pet"
        style={{
          width: '100%',
          padding: '14px',
          background: 'white',
          border: '2px dashed #c8102e',
          borderRadius: '12px',
          color: '#c8102e',
          fontSize: '16px',
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        + Add Another Pet
      </button>

      {isComplete && (
        <div style={{
          background: 'linear-gradient(135deg, #c8102e 0%, #6D3510 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '14px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{ fontSize: '22px', marginBottom: '10px', color: 'white' }}>Total Household Recommendation</h3>
          <div style={{ fontSize: '38px', fontWeight: 900, marginBottom: '10px' }}>
            {recommendation.dailyLbs} lbs/day
          </div>
          <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '14px' }}>
            Weekly: {recommendation.weeklyLbs} lbs · Biweekly: {recommendation.biweeklyLbs} lbs · Monthly: {recommendation.monthlyLbs} lbs
          </p>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '10px' }}>
            <p style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>
              We recommend a <strong>{recommendation.recommendedSize}lb box</strong> every 2 weeks
            </p>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '8px' }}>
        <button
          onClick={handleSave}
          disabled={!isComplete}
          data-testid="calc-save-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 36px',
            background: showSaveSuccess ? '#4CAF50' : (isComplete ? '#c8102e' : '#E8DDD0'),
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontSize: '16px',
            fontWeight: 700,
            cursor: isComplete ? 'pointer' : 'not-allowed',
            transition: 'background 0.15s'
          }}
        >
          {showSaveSuccess ? <Check size={20} /> : <Save size={20} />}
          {showSaveSuccess ? 'Saved!' : 'Save'}
        </button>

        {hasSavedPets && (
          <button
            onClick={clearSavedPets}
            data-testid="calc-clear-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 22px',
              background: 'white',
              border: '2px solid #E8DDD0',
              borderRadius: '10px',
              color: '#666',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Trash2 size={18} /> Clear Saved
          </button>
        )}
      </div>
    </div>
  );
};
