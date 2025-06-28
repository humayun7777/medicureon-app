// =============================================
// Profile API Service for MediCureOn
// Handles all profile-related backend calls
// =============================================

import { apiConfig, getRegionFromCountry } from '../config/apiConfig';

class ProfileApiService {
  // Test backend connection
  async testConnection() {
    try {
      const url = `${apiConfig.backendUrl}${apiConfig.endpoints.health}?code=${apiConfig.functionKeys.health}`;
      console.log('Testing connection to:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Health check response:', data);
      return data;
    } catch (error) {
      console.error('Connection test failed:', error);
      throw error;
    }
  }

  // Get user profile from backend
  async getProfile(userId, country) {
    try {
      const url = `${apiConfig.backendUrl}${apiConfig.endpoints.profiles.get(userId)}?country=${encodeURIComponent(country)}&code=${apiConfig.functionKeys.profileGet}`;
      
      console.log('Fetching profile from:', url);
      console.log('User country:', country, '-> Region:', getRegionFromCountry(country));
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch profile: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Profile fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  // Save user profile to backend
  async saveProfile(userId, profileData) {
    try {
      // Extract country from profile data
      const country = profileData.generalInfo?.country || 'United States';
      const region = getRegionFromCountry(country);
      
      const url = `${apiConfig.backendUrl}${apiConfig.endpoints.profiles.update(userId)}?code=${apiConfig.functionKeys.profileUpdate}`;
      
      // Add country to the profile data for regional routing
      const dataToSend = {
        ...profileData,
        country: country,
        region: region
      };
      
      console.log('Saving profile to:', url);
      console.log('Profile data being sent:', dataToSend);
      console.log('Data will be saved to region:', region);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save profile: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Profile saved successfully:', data);
      return data;
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  }

  // Upload profile picture
  async uploadProfilePicture(userId, file, country) {
    try {
      const url = `${apiConfig.backendUrl}${apiConfig.endpoints.profiles.picture(userId)}?country=${encodeURIComponent(country)}&code=${apiConfig.functionKeys.profilePicture}`;
      
      const formData = new FormData();
      formData.append('picture', file);
      
      console.log('Uploading picture to:', url);
      console.log('File:', file.name, 'Size:', file.size);
      
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload picture: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Picture uploaded successfully:', data);
      return data;
    } catch (error) {
      console.error('Error uploading picture:', error);
      throw error;
    }
  }

  // Get profile picture URL
  getProfilePictureUrl(userId, country) {
    return `${apiConfig.backendUrl}${apiConfig.endpoints.profiles.picture(userId)}?country=${encodeURIComponent(country)}&code=${apiConfig.functionKeys.profilePicture}`;
  }

  // Save profile locally (backup method)
  saveProfileLocally(profileData) {
    try {
      localStorage.setItem('medicureon_profile', JSON.stringify(profileData));
      console.log('Profile saved locally as backup');
    } catch (error) {
      console.error('Error saving profile locally:', error);
    }
  }

  // Load profile from local storage (backup method)
  loadProfileLocally() {
    try {
      const data = localStorage.getItem('medicureon_profile');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading local profile:', error);
      return null;
    }
  }
}

// Export singleton instance
const profileApiService = new ProfileApiService();
export default profileApiService;