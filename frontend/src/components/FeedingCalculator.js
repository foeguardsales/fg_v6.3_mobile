import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Check, Trash2, Edit2 } from 'lucide-react';

export const FeedingCalculator = ({ onComplete }) => {
  const navigate = useNavigate();
  const [pets, setPets] = useState([{
    id: 1,
    name: '',
    species: 'dog',
    age_months: '',
    weight: '',
    activity: 'moderate'
  }]);
  const [savedPets, setSavedPets] = useState([]);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Load saved pets from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('foeguard_saved_pets');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSavedPets(parsed);
      // If we have saved pets, load the first one
      if (parsed.length > 0) {
        setPets(parsed);
      }
    }
  }, []);

  const addPet = () => {
    setPets([...pets, {
      id: pets.length + 1,
      name: '',
      species: 'dog',
      age_months: '',
      weight: '',
      activity: 'moderate'
    }]);
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
      if (ageMonths < 4) {
        basePercentage = 11.5; // Average of 10-13%
      } else if (ageMonths < 8) {
        basePercentage = 8; // Average of 6-10%
      } else if (ageMonths < 12) {
        basePercentage = 4.5; // Average of 3-6%
      } else {
        basePercentage = 2.75; // Average of 2-3.5%
      }
    } else {
      if (ageMonths < 4) {
        basePercentage = 7.5; // Average of 6-9%
      } else if (ageMonths < 8) {
        basePercentage = 6.5; // Average of 5-8%
      } else if (ageMonths < 12) {
        basePercentage = 4; // Average of 2-6%
      } else {
        basePercentage = 3.25; // Average of 3-3.5%
      }
    }

    // Adjust for activity level
    if (pet.activity === 'low') basePercentage *= 0.9;
    if (pet.activity === 'high') basePercentage *= 1.1;

    const dailyOz = (weight * basePercentage / 100) * 16; // Convert lbs to oz
    return Math.round(dailyOz);
  };

  const getTotalRecommendation = () => {
    const totalDailyOz = pets.reduce((sum, pet) => {
      const oz = calculateFeeding(pet);
      return sum + (oz || 0);
    }, 0);

    const dailyLbs = totalDailyOz / 16;
    const weeklyLbs = dailyLbs * 7;
    const biweeklyLbs = weeklyLbs * 2;
    const monthlyLbs = dailyLbs * 30;

    // Recommend box size
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

  const handleComplete = (recommendedSize, petsData) => {
    // Also save to sessionStorage for sticky checkout
    sessionStorage.setItem('foeguard_calculator_pets', JSON.stringify(petsData || pets));
    sessionStorage.setItem('foeguard_calculator_recommendation', JSON.stringify(recommendation));
    onComplete(recommendedSize, petsData || pets);
  };

  const savePets = () => {
    const petsToSave = pets.filter(p => p.name && p.age_months && p.weight);
    if (petsToSave.length > 0) {
      localStorage.setItem('foeguard_saved_pets', JSON.stringify(petsToSave));
      setSavedPets(petsToSave);
      // Also save to sessionStorage for sticky checkout
      sessionStorage.setItem('foeguard_calculator_pets', JSON.stringify(petsToSave));
      sessionStorage.setItem('foeguard_calculator_recommendation', JSON.stringify(recommendation));
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 2000);
    }
  };

  const clearSavedPets = () => {
    localStorage.removeItem('foeguard_saved_pets');
    sessionStorage.removeItem('foeguard_calculator_pets');
    sessionStorage.removeItem('foeguard_calculator_recommendation');
    setSavedPets([]);
    setPets([{
      id: 1,
      name: '',
      species: 'dog',
      age_months: '',
      weight: '',
      activity: 'moderate'
    }]);
  };

  const recommendation = getTotalRecommendation();
  const isComplete = pets.every(p => p.name && p.age_months && p.weight);
  const hasSavedPets = savedPets.length > 0;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          background: 'white',
          border: '2px solid #E8DDD0',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '15px',
          fontWeight: '600',
          color: '#8B4513',
          marginBottom: '32px',
          transition: 'all 0.2s',
          fontFamily: "'Rubik', sans-serif"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#F8F6F4';
          e.currentTarget.style.borderColor = '#8B4513';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.borderColor = '#E8DDD0';
        }}
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <h2 style={{ fontSize: '36px', textAlign: 'center', marginBottom: '16px', fontFamily: "'Rubik', sans-serif", fontWeight: '700' }}>Feeding Calculator</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px', fontFamily: "'Rubik', sans-serif" }}>
        Tell us about your pet(s) to get personalized feeding recommendations
      </p>

      {pets.map((pet, index) => (
        <div key={pet.id} style={{ 
          background: 'white', 
          border: '2px solid #E5E7E6', 
          borderRadius: '16px', 
          padding: '28px', 
          marginBottom: '20px' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '22px', color: '#8B4513' }}>Pet {index + 1}</h3>
            {pets.length > 1 && (
              <button 
                onClick={() => removePet(pet.id)}
                style={{ background: 'transparent', border: 'none', color: '#C33', cursor: 'pointer', fontSize: '24px' }}
              >
                ×
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Pet Name</label>
              <input 
                type="text"
                value={pet.name}
                onChange={(e) => updatePet(pet.id, 'name', e.target.value)}
                placeholder="e.g., Max"
              />
            </div>

            <div className="form-group">
              <label>Life Stage</label>
              <select 
                value={pet.species}
                onChange={(e) => updatePet(pet.id, 'species', e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '14px 16px', 
                  border: '2px solid #E5E7E6', 
                  borderRadius: '10px', 
                  fontSize: '16px' 
                }}
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
                value={pet.age_months}
                onChange={(e) => {
                  let value = e.target.value;
                  // Convert to months for storage if dog/cat (years input)
                  if (pet.species === 'dog' || pet.species === 'cat') {
                    value = value ? parseInt(value) * 12 : '';
                  }
                  updatePet(pet.id, 'age_months', value);
                }}
                placeholder={(pet.species === 'dog' || pet.species === 'cat') ? 'e.g., 2' : 'e.g., 8'}
                min="1"
                value={(pet.species === 'dog' || pet.species === 'cat') && pet.age_months ? Math.floor(pet.age_months / 12) : pet.age_months}
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
              />
            </div>

            <div className="form-group">
              <label>Activity Level</label>
              <select 
                value={pet.activity}
                onChange={(e) => updatePet(pet.id, 'activity', e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '14px 16px', 
                  border: '2px solid #E5E7E6', 
                  borderRadius: '10px', 
                  fontSize: '16px' 
                }}
              >
                <option value="low">Low (mostly resting)</option>
                <option value="moderate">Moderate (regular walks)</option>
                <option value="high">High (very active)</option>
              </select>
            </div>
          </div>

          {pet.name && pet.age_months && pet.weight && (
            <div style={{ 
              marginTop: '20px', 
              padding: '16px', 
              background: '#FFF9F5', 
              borderRadius: '8px',
              border: '2px solid #D2B48C'
            }}>
              <strong style={{ color: '#8B4513' }}>{pet.name}'s Recommendation:</strong>
              <p style={{ margin: '8px 0 0 0', color: '#555' }}>
                Feed approximately <strong>{calculateFeeding(pet)} oz</strong> per day 
                ({(calculateFeeding(pet) / 16).toFixed(2)} lbs/day) | <strong>{((calculateFeeding(pet) / 16) * 30).toFixed(1)} lbs/month</strong>
              </p>
            </div>
          )}
        </div>
      ))}

      <button 
        onClick={addPet}
        style={{
          width: '100%',
          padding: '14px',
          background: 'white',
          border: '2px dashed #8B4513',
          borderRadius: '12px',
          color: '#8B4513',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: '30px'
        }}
      >
        + Add Another Pet
      </button>

      {isComplete && (
        <div style={{
          background: 'linear-gradient(135deg, #8B4513 0%, #6D3510 100%)',
          color: 'white',
          padding: '32px',
          borderRadius: '16px',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h3 style={{ fontSize: '28px', marginBottom: '16px', color: 'white' }}>Total Household Recommendation</h3>
          <div style={{ fontSize: '48px', fontWeight: '900', marginBottom: '16px' }}>
            {recommendation.dailyLbs} lbs/day
          </div>
          <p style={{ fontSize: '16px', opacity: 0.9, marginBottom: '20px' }}>
            Weekly: {recommendation.weeklyLbs} lbs | Biweekly: {recommendation.biweeklyLbs} lbs | Monthly: {recommendation.monthlyLbs} lbs
          </p>
          <div style={{ 
            background: 'rgba(255,255,255,0.2)', 
            padding: '16px', 
            borderRadius: '12px',
            marginTop: '20px'
          }}>
            <p style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
              We recommend a <strong>{recommendation.recommendedSize}lb box</strong> every 2 weeks
            </p>
          </div>
        </div>
      )}

      {/* Save Button */}
      {isComplete && (
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          justifyContent: 'center', 
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={savePets}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              background: showSaveSuccess ? '#4CAF50' : 'white',
              border: '2px solid',
              borderColor: showSaveSuccess ? '#4CAF50' : '#8B4513',
              borderRadius: '8px',
              color: showSaveSuccess ? 'white' : '#8B4513',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {showSaveSuccess ? <Check size={20} /> : <Save size={20} />}
            {showSaveSuccess ? 'Saved!' : 'Save Pet Info'}
          </button>
          
          {hasSavedPets && (
            <button 
              onClick={clearSavedPets}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 28px',
                background: 'white',
                border: '2px solid #E8DDD0',
                borderRadius: '8px',
                color: '#666',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <Trash2 size={18} /> Clear Saved
            </button>
          )}
        </div>
      )}

      {/* Saved Pets Indicator */}
      {hasSavedPets && !showSaveSuccess && (
        <div style={{
          background: '#E8F5E9',
          border: '2px solid #4CAF50',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Check size={20} color="#4CAF50" />
            <span style={{ color: '#2E7D32', fontWeight: '500' }}>
              Pet info saved! Your data will be remembered for future orders.
            </span>
          </div>
        </div>
      )}

      <button 
        className="btn-primary"
        onClick={() => handleComplete(recommendation.recommendedSize, pets)}
        disabled={!isComplete}
        style={{ maxWidth: '400px', margin: '0 auto', display: 'block' }}
      >
        Continue to Box Builder
      </button>
    </div>
  );
};
