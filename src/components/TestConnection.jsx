// =============================================
// Test Connection Component for MediCureOn
// Use this to verify backend integration
// =============================================

import React, { useState } from 'react';
import profileApiService from '../services/profileApiService';

const TestConnection = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Test health endpoint
  const testHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await profileApiService.testConnection();
      setTestResults(prev => ({ ...prev, health: result }));
      alert('Health check successful! Check console for details.');
    } catch (err) {
      setError(`Health test failed: ${err.message}`);
    }
    setLoading(false);
  };

  // Test profile get for different regions
  const testProfileGet = async (country) => {
    setLoading(true);
    setError(null);
    try {
      const userId = 'test123';
      const result = await profileApiService.getProfile(userId, country);
      setTestResults(prev => ({ ...prev, [`profileGet_${country}`]: result }));
      alert(`Profile GET for ${country} successful! Check console.`);
    } catch (err) {
      setError(`Profile get failed for ${country}: ${err.message}`);
    }
    setLoading(false);
  };

  // Test profile save
  const testProfileSave = async (country) => {
    setLoading(true);
    setError(null);
    try {
      const testData = {
        generalInfo: {
          firstName: 'Test',
          lastName: 'User',
          country: country,
          email: 'test@medicureon.com',
          phone: '+1234567890',
          dateOfBirth: '1990-01-01'
        },
        healthMedical: {
          bloodType: 'O+',
          height: '170',
          weight: '70',
          allergies: ['None'],
          medications: []
        }
      };
      
      const userId = 'test123';
      const result = await profileApiService.saveProfile(userId, testData);
      setTestResults(prev => ({ ...prev, [`profileSave_${country}`]: result }));
      alert(`Profile SAVE for ${country} successful! Check console.`);
    } catch (err) {
      setError(`Profile save failed for ${country}: ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      margin: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ color: '#3f2381' }}>🔧 Backend Connection Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>1. Test Health Endpoint</h3>
        <button 
          onClick={testHealth} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          Test Health Check
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>2. Test Profile GET (Different Regions)</h3>
        <button 
          onClick={() => testProfileGet('United States')} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          Test US Region
        </button>
        
        <button 
          onClick={() => testProfileGet('Germany')} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          Test EU Region
        </button>
        
        <button 
          onClick={() => testProfileGet('Pakistan')} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Test APAC Region
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>3. Test Profile SAVE (Different Regions)</h3>
        <button 
          onClick={() => testProfileSave('United States')} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          Save to US
        </button>
        
        <button 
          onClick={() => testProfileSave('Germany')} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          Save to EU
        </button>
        
        <button 
          onClick={() => testProfileSave('Pakistan')} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Save to APAC
        </button>
      </div>

      {loading && <p>Loading... Check browser console for details.</p>}
      
      {error && (
        <div style={{ 
          backgroundColor: '#f44336', 
          color: 'white', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '10px'
        }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <p><strong>Note:</strong> Open browser DevTools (F12) to see detailed logs.</p>
      </div>
    </div>
  );
};

export default TestConnection;