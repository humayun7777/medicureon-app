import React, { useState, useEffect } from 'react';
import { 
  User, 
  Heart, 
  Pill, 
  Smartphone,
  Save,
  ArrowLeft,
  Upload,
  Plus,
  Minus,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Shield,
  Activity,
  Stethoscope,
  AlertTriangle,
  Clock,
  Scale,
  Droplets,
  Camera
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import profileApiService from '../../services/profileApiService';
import { apiConfig } from '../../config/apiConfig';
import appleHealthKitService from '../../services/appleHealthKitService';

const ProfileManager = ({ onNavigate }) => {
  const { user, userInfo } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Enhanced form data state with new fields
  const [formData, setFormData] = useState({
    // General Information - Enhanced
    personalDetails: {
      firstName: '',
      lastName: '',
      fullName: '',
      email: '',
      dateOfBirth: '',
      country: '',
      phoneNumber: '',
      state: '',
      province: '',
      gender: '',
      city: '',
      address: '',
      postalCode: ''
    },
    accountPreferences: {
      preferredLanguage: 'English',
      timeZone: 'America/New_York',
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true
    },
    emergencyContacts: [{
      name: '',
      relationship: '',
      contactNumber: '',
      email: ''
    }],
    insuranceInformation: {
      providerName: '',
      policyNumber: '',
      coverageDetails: '',
      groupNumber: '',
      memberID: ''
    },
    
    // Health & Medical Information - Enhanced
    medicalHistory: {
      knownConditions: [],
      familyMedicalHistory: '',
      previousSurgeries: [],
      chronicConditions: [],
      hospitalizations: []
    },
    allergies: {
      medicationAllergies: [],
      foodAllergies: [],
      environmentalAllergies: [],
      severity: {}
    },
    currentHealthMetrics: {
      height: { value: '', unit: 'cm', altValue: '', altUnit: 'ft' },
      weight: { value: '', unit: 'kg', altValue: '', altUnit: 'lbs' },
      bloodPressure: { systolic: '', diastolic: '', date: '' },
      restingHeartRate: '',
      bodyTemperature: { value: '', unit: 'celsius' }
    },
    vaccinationRecords: {
      covidVaccineStatus: '',
      vaccinations: {},
      routineImmunizations: []
    },
    doctorCareTeam: {
      primaryCarePhysician: '',
      specialists: [],
      upcomingAppointments: [],
      preferredHospital: '',
      emergencyContact: ''
    },
    
    // Medications & Lifestyle - Enhanced
    currentMedications: [],
    supplements: {
      vitaminsSupplements: [],
      herbalRemedies: []
    },
    alternativeHealthcare: {
      providers: {},
      interests: {},
      previousExperience: {}
    },
    lifestyleHabits: {
      smoking: { status: 'No', frequency: '', quitDate: '' },
      alcoholConsumption: { status: 'No', frequency: '', type: '' },
      exerciseRoutines: [], // Changed to array
      dietaryPreferences: [], // Changed to array
      sleepHabits: { hoursPerNight: '', quality: '', bedtime: '', wakeTime: '' }
    },
    mentalWellness: {
      moodTracking: '',
      stressLevels: '',
      meditationPractices: '',
      therapyHistory: ''
    },
    
    // IoMT Devices - Enhanced
    connectedDevices: [],
    healthDataSources: {
      apple: false,
      samsung: false,
      fitbit: false,
      garmin: false,
      withings: false,
      googleFit: false,
      oura: false,
      alivecor: false,
      omron: false,
      dexcom: false
    },
    devicePreferences: {
      autoSync: true,
      dataRetention: '1year',
      shareWithDoctor: true,
      syncFrequency: 'realtime'
    }
  });

  // Initialize form data with user info
  useEffect(() => {
    if (userInfo || user) {
      const fullName = userInfo?.name || user?.name || '';
      const nameParts = fullName.split(' ');
      
      setFormData(prev => ({
        ...prev,
        personalDetails: {
          ...prev.personalDetails,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          fullName: fullName,
          email: userInfo?.email || user?.username || user?.idTokenClaims?.email || ''
        }
      }));
    }
  }, [userInfo, user]);

  // useEffect for loading profile data in ProfileManager.jsx

  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoadingProfile(true);
      try {
        const userId = user?.idTokenClaims?.oid || user?.idTokenClaims?.sub || userInfo?.id;
        if (!userId) {
          console.log('No userId available yet');
          setIsLoadingProfile(false);
          return;
        }

        console.log('Loading profile data for user:', userId);

        // Try to get country from existing form data or default
        const country = formData.personalDetails.country || 'United States';
        
        // Load profile data from backend
        const response = await fetch(
          `${apiConfig.backendUrl}/api/profiles/${userId}?country=${encodeURIComponent(country)}&code=${apiConfig.functionKeys.profileGet}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            console.log('No profile found for user - this is normal for new users');
            return;
          }
          throw new Error(`Failed to load profile: ${response.status}`);
        }

        const result = await response.json();
        console.log('Loaded profile data:', result);

        if (result && result.success && result.data) {
          const profileData = result.data;
          
          // Map the loaded data back to form structure
          setFormData(prev => ({
            // Personal Details
            personalDetails: {
              ...prev.personalDetails,
              ...(profileData.generalInfo || {}),
              firstName: profileData.generalInfo?.firstName || prev.personalDetails.firstName,
              lastName: profileData.generalInfo?.lastName || prev.personalDetails.lastName,
              fullName: profileData.generalInfo?.fullName || prev.personalDetails.fullName,
              email: profileData.generalInfo?.email || prev.personalDetails.email,
              dateOfBirth: profileData.generalInfo?.dateOfBirth || prev.personalDetails.dateOfBirth,
              country: profileData.generalInfo?.country || prev.personalDetails.country,
              phoneNumber: profileData.generalInfo?.phoneNumber || prev.personalDetails.phoneNumber,
              state: profileData.generalInfo?.state || prev.personalDetails.state,
              province: profileData.generalInfo?.province || prev.personalDetails.province,
              gender: profileData.generalInfo?.gender || prev.personalDetails.gender,
              city: profileData.generalInfo?.city || prev.personalDetails.city,
              address: profileData.generalInfo?.address || prev.personalDetails.address,
              postalCode: profileData.generalInfo?.postalCode || prev.personalDetails.postalCode,
            },
            // Account Preferences
            accountPreferences: {
              ...prev.accountPreferences,
              preferredLanguage: profileData.generalInfo?.preferredLanguage || prev.accountPreferences.preferredLanguage,
              timeZone: profileData.generalInfo?.timeZone || prev.accountPreferences.timeZone,
              emailNotifications: profileData.generalInfo?.emailNotifications ?? prev.accountPreferences.emailNotifications,
              smsNotifications: profileData.generalInfo?.smsNotifications ?? prev.accountPreferences.smsNotifications,
              pushNotifications: profileData.generalInfo?.pushNotifications ?? prev.accountPreferences.pushNotifications,
            },
            // Emergency Contacts
            emergencyContacts: Array.isArray(profileData.generalInfo?.emergencyContacts) 
              ? profileData.generalInfo.emergencyContacts 
              : prev.emergencyContacts,
            // Insurance Information
            insuranceInformation: profileData.healthInfo?.insuranceInformation || prev.insuranceInformation,
            // Current Health Metrics
            currentHealthMetrics: {
              ...prev.currentHealthMetrics,
              height: profileData.generalInfo?.height || prev.currentHealthMetrics.height,
              weight: profileData.generalInfo?.weight || prev.currentHealthMetrics.weight,
              bloodPressure: profileData.generalInfo?.bloodPressure || prev.currentHealthMetrics.bloodPressure,
              restingHeartRate: profileData.generalInfo?.restingHeartRate || prev.currentHealthMetrics.restingHeartRate,
              bodyTemperature: profileData.generalInfo?.bodyTemperature || prev.currentHealthMetrics.bodyTemperature,
            },
            // Health & Medical Information
            medicalHistory: profileData.healthInfo?.medicalHistory || prev.medicalHistory,
            allergies: profileData.healthInfo?.allergies || prev.allergies,
            vaccinationRecords: profileData.healthInfo?.vaccinationRecords || prev.vaccinationRecords,
            doctorCareTeam: profileData.healthInfo?.doctorCareTeam || prev.doctorCareTeam,
            // Medications & Lifestyle
            currentMedications: Array.isArray(profileData.lifestyle?.currentMedications) 
            ? profileData.lifestyle.currentMedications 
            : prev.currentMedications,
            supplements: profileData.lifestyle?.supplements || prev.supplements,
            alternativeHealthcare: profileData.lifestyle?.alternativeHealthcare || prev.alternativeHealthcare,
            lifestyleHabits: profileData.lifestyle?.lifestyleHabits || prev.lifestyleHabits,
            mentalWellness: profileData.lifestyle?.mentalWellness || prev.mentalWellness,
            // IoMT Devices (Configuration only)
            connectedDevices: profileData.devices?.connectedDevices || prev.connectedDevices,
            healthDataSources: profileData.devices?.healthDataSources || prev.healthDataSources,
            devicePreferences: profileData.devices?.devicePreferences || prev.devicePreferences,
          }));
          
          setSaveStatus('Profile loaded successfully');
          setTimeout(() => setSaveStatus(''), 2000);
        }
        
        // Load profile picture
        try {
          const pictureResponse = await fetch(
            `${apiConfig.backendUrl}/api/profiles/${userId}/picture?country=${encodeURIComponent(country)}&code=${apiConfig.functionKeys.profilePicture}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );

          if (pictureResponse.ok) {
            const pictureData = await pictureResponse.json();
            if (pictureData.currentPicture) {
              setProfilePicture(pictureData.currentPicture);
              console.log('Profile picture loaded:', pictureData.currentPicture);
            }
          }
        } catch (error) {
          console.log('No profile picture found or error loading:', error);
        }
        
      } catch (error) {
        console.error('Error loading profile data:', error);
        setSaveStatus('Error loading profile. Using local data if available.');
        
        // Try to load from local storage as fallback
        const localData = profileApiService.loadProfileLocally();
        if (localData) {
          console.log('Loaded profile from local storage');
          // Map local data similarly...
        }
        
        setTimeout(() => setSaveStatus(''), 3000);
      }
    };

    // Only load if we have user info
    if (user || userInfo) {
      loadProfileData();
    }
  }, [user, userInfo, formData.personalDetails.country]);

  // Handle form input changes
  const handleInputChange = (section, field, value, subField = null) => {
    setFormData(prev => {
      // Special handling for emergency contacts
      if (section === 'emergencyContacts' && field === null) {
        return {
          ...prev,
          emergencyContacts: value
        };
      }
      
      // Normal handling for other fields
      return {
        ...prev,
        [section]: subField ? {
          ...prev[section],
          [field]: {
            ...prev[section][field],
            [subField]: value
          }
        } : {
          ...prev[section],
          [field]: value
        }
      };
    });
  };

  // Add array items (medications, allergies, etc.)
  const addArrayItem = (section, field, newItem) => {
    setFormData(prev => {
      // Special handling for emergency contacts
      if (section === 'emergencyContacts') {
        return {
          ...prev,
          emergencyContacts: [...prev.emergencyContacts, newItem]
        };
      }
      
      // Normal handling for other sections
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: [...(prev[section][field] || []), newItem]
        }
      };
    });
  };

  // Remove array items
  const removeArrayItem = (section, field, index) => {
    setFormData(prev => {
      // Special handling for emergency contacts
      if (section === 'emergencyContacts') {
        return {
          ...prev,
          emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index)
        };
      }
      
      // Normal handling for other sections
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: prev[section][field].filter((_, i) => i !== index)
        }
      };
    });
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Store file for Azure Blob Storage upload
      setProfilePictureFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile data to Azure Data Lake and Blob Storage

const handleSave = async () => {
  setIsLoading(true);
  setSaveStatus('');
  
  try {
    // Get userId from auth
    const userId = user?.idTokenClaims?.oid || user?.idTokenClaims?.sub || userInfo?.id;
    
    if (!userId) {
      throw new Error('User ID not found. Please log in again.');
    }

    // Transform the form data to match backend structure
    const profileDataToSave = {
      generalInfo: {
        // Personal details
        firstName: formData.personalDetails.firstName,
        lastName: formData.personalDetails.lastName,
        fullName: formData.personalDetails.fullName,
        email: formData.personalDetails.email,
        dateOfBirth: formData.personalDetails.dateOfBirth,
        country: formData.personalDetails.country,
        phoneNumber: formData.personalDetails.phoneNumber,
        state: formData.personalDetails.state,
        province: formData.personalDetails.province,
        gender: formData.personalDetails.gender,
        city: formData.personalDetails.city,
        address: formData.personalDetails.address,
        postalCode: formData.personalDetails.postalCode,
        // Account preferences
        preferredLanguage: formData.accountPreferences.preferredLanguage,
        timeZone: formData.accountPreferences.timeZone,
        emailNotifications: formData.accountPreferences.emailNotifications,
        smsNotifications: formData.accountPreferences.smsNotifications,
        pushNotifications: formData.accountPreferences.pushNotifications,
        // Emergency contacts
        emergencyContacts: formData.emergencyContacts,
        // Current health metrics (basic info, not IoMT data)
        height: formData.currentHealthMetrics.height,
        weight: formData.currentHealthMetrics.weight,
        bloodPressure: formData.currentHealthMetrics.bloodPressure,
        restingHeartRate: formData.currentHealthMetrics.restingHeartRate,
        bodyTemperature: formData.currentHealthMetrics.bodyTemperature
      },
      healthInfo: {
        // Medical history
        medicalHistory: formData.medicalHistory,
        // Allergies
        allergies: formData.allergies,
        // Vaccination records
        vaccinationRecords: formData.vaccinationRecords,
        // Doctor & care team
        doctorCareTeam: formData.doctorCareTeam,
        // Insurance information
        insuranceInformation: formData.insuranceInformation
      },
      lifestyle: {
        // Current medications
        currentMedications: formData.currentMedications,
        // Supplements
        supplements: formData.supplements,
        // Alternative healthcare
        alternativeHealthcare: formData.alternativeHealthcare,
        // Lifestyle habits
        lifestyleHabits: formData.lifestyleHabits,
        // Mental wellness
        mentalWellness: formData.mentalWellness
      },
      devices: {
        // Device CONFIGURATION only - not data
        // This stores which devices are connected and their settings
        connectedDevices: formData.connectedDevices.map(device => ({
          deviceId: device.deviceId || `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: device.name,
          type: device.type,
          manufacturer: device.manufacturer,
          model: device.model,
          connectionStatus: device.connectionStatus || 'pending',
          lastSyncDate: device.lastSyncDate || null,
          // Settings only, no actual data
          settings: {
            autoSync: device.autoSync || true,
            syncFrequency: device.syncFrequency || 'realtime',
            dataRetention: device.dataRetention || '1year'
          }
        })),
        // Health data source connections (which services are connected)
        healthDataSources: formData.healthDataSources,
        // Device preferences
        devicePreferences: formData.devicePreferences
      },
      // Add country at root level for regional routing
      country: formData.personalDetails.country || 'United States'
    };

    console.log('Saving profile data...', profileDataToSave);

    // Save profile data to Profile Storage
    const saveResult = await profileApiService.saveProfile(userId, profileDataToSave);
    
    // If profile picture was selected, upload it to Picture Storage
    if (profilePictureFile) {
      try {
        console.log('Uploading profile picture...');
        
        // Convert file to base64 for the current backend implementation
        const reader = new FileReader();
        const uploadPromise = new Promise((resolve, reject) => {
          reader.onloadend = async () => {
            try {
              const base64String = reader.result;
              
              const pictureData = {
                image: base64String,
                contentType: profilePictureFile.type,
                filename: `profile-${Date.now()}.${profilePictureFile.name.split('.').pop()}`
              };
              
              const response = await fetch(
                `${apiConfig.backendUrl}/api/profiles/${userId}/picture?country=${encodeURIComponent(formData.personalDetails.country || 'United States')}&code=${apiConfig.functionKeys.profilePicture}`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(pictureData)
                }
              );
              
              if (!response.ok) {
                throw new Error('Failed to upload picture');
              }
              
              const result = await response.json();
              console.log('Profile picture uploaded:', result);
              resolve(result);
            } catch (error) {
              reject(error);
            }
          };
          
          reader.onerror = () => reject(new Error('Failed to read file'));
        });
        
        reader.readAsDataURL(profilePictureFile);
        await uploadPromise;
        
      } catch (pictureError) {
        console.error('Error uploading picture:', pictureError);
        // Don't fail the entire save if picture upload fails
        setSaveStatus('Profile saved, but picture upload failed. Please try uploading the picture again.');
        setTimeout(() => setSaveStatus(''), 5000);
        return;
      }
    }

    // Save locally as backup
    profileApiService.saveProfileLocally(profileDataToSave);
    
    // Note about IoMT data
    if (formData.connectedDevices.length > 0) {
      console.log('Note: Device configurations saved. Actual IoMT data will be stored separately in IoMT storage when devices start syncing.');
    }
    
    setSaveStatus(`Profile saved successfully to ${saveResult.region} region!`);
    setTimeout(() => setSaveStatus(''), 3000);
    
  } catch (error) {
    console.error('Error saving profile:', error);
    setSaveStatus(`Error saving profile: ${error.message}`);
    setTimeout(() => setSaveStatus(''), 5000);
  } finally {
    setIsLoading(false);
  }
};

  const TabButton = ({ id, label, icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
        isActive 
          ? 'text-white' 
          : 'text-gray-600 hover:text-white'
      }`}
      style={{ 
        backgroundColor: isActive ? '#02276F' : 'transparent',
        border: isActive ? 'none' : '2px solid #E5E7EB'
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.target.style.backgroundColor = '#F1C40F';
          e.target.style.color = '#02276F';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.color = '#6B7280';
        }
      }}
    >
      <div className="flex items-center justify-center space-x-2">
        {icon}
        <span className="hidden sm:inline">{label}</span>
      </div>
    </button>
  );

  return (
    <div 
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: '#F8FAFC' }}
    >
      {/* Sidebar - Matching your Landing Page */}
      <div 
        className="flex flex-col w-64 text-white"
        style={{ 
          backgroundColor: '#02276F',
          height: '100vh',
          minHeight: '100vh'
        }}
      >
        {/* Profile Section */}
        <div className="p-6 border-b border-blue-800">
          <div className="flex flex-col items-center">
            <div className="relative flex items-center justify-center w-20 h-20 mb-3 overflow-hidden bg-gray-300 border-2 border-white rounded-full group">
              {profilePicture ? (
                <img 
                  src={profilePicture} 
                  alt="Profile" 
                  className="object-cover w-full h-full"
                />
              ) : (
                <User className="w-10 h-10 text-gray-600" />
              )}
              <label className="absolute inset-0 flex items-center justify-center transition-all duration-200 bg-black bg-opacity-0 cursor-pointer group-hover:bg-opacity-30">
                <div className="p-1 transition-opacity duration-200 bg-white rounded-full opacity-0 bg-opacity-20 group-hover:opacity-100">
                  <Camera className="w-4 h-4 text-white" />
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleProfilePictureUpload}
                  className="hidden" 
                />
              </label>
            </div>
            <h3 className="text-lg font-semibold">
              {formData.personalDetails.firstName || formData.personalDetails.fullName || 'Complete Your Profile'}
            </h3>
            <p className="w-full text-xs text-center text-blue-200 truncate opacity-75">
              {formData.personalDetails.email || 'Add your information'}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <div 
              className="flex items-center px-3 py-2 space-x-3 text-sm font-medium rounded-lg cursor-pointer"
              style={{ backgroundColor: '#F1C40F', color: '#02276F' }}
            >
              <User className="w-4 h-4" />
              <span>Profile Setup</span>
            </div>
            
            <div 
              className="flex items-center px-3 py-2 space-x-3 text-sm font-medium rounded-lg cursor-pointer hover:bg-yellow-400 hover:bg-opacity-10"
              style={{ color: '#F1C40F' }}
              onClick={() => onNavigate('landing')}
            >
              <Activity className="w-4 h-4" />
              <span>Dashboard</span>
            </div>
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-blue-800">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center w-full px-3 py-2 space-x-3 text-sm font-medium rounded-lg cursor-pointer hover:bg-yellow-400 hover:bg-opacity-10"
            style={{ color: '#F1C40F' }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {formData.personalDetails.firstName || 'Member'}!
              </h1>
              <p className="mt-1 text-sm text-gray-600">Complete your profile to get personalized healthcare recommendations</p>
            </div>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center px-6 py-2 space-x-2 font-medium text-white transition-all duration-200 rounded-lg hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#02276F' }}
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Saving to Azure...' : 'Save Profile'}</span>
            </button>
          </div>
          
          {saveStatus && (
            <div className={`mt-2 p-2 rounded text-sm ${
              saveStatus.includes('Error') 
                ? 'bg-red-100 text-red-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {saveStatus}
            </div>
          )}
        </header>

        {/* Tab Navigation */}
        <div className="p-6 pb-0">
          <div className="flex mb-6 space-x-2">
            <TabButton
              id="general"
              label="General Information"
              icon={<User className="w-4 h-4" />}
              isActive={activeTab === 'general'}
              onClick={setActiveTab}
            />
            <TabButton
              id="health"
              label="Health & Medical Information"
              icon={<Heart className="w-4 h-4" />}
              isActive={activeTab === 'health'}
              onClick={setActiveTab}
            />
            <TabButton
              id="medications"
              label="Medications & Lifestyle"
              icon={<Pill className="w-4 h-4" />}
              isActive={activeTab === 'medications'}
              onClick={setActiveTab}
            />
            <TabButton
              id="devices"
              label="IoMT Devices"
              icon={<Smartphone className="w-4 h-4" />}
              isActive={activeTab === 'devices'}
              onClick={setActiveTab}
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-6 pb-6">
          {activeTab === 'general' && (
            <GeneralInformationTab 
              formData={formData}
              handleInputChange={handleInputChange}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
            />
          )}
          
          {activeTab === 'health' && (
            <HealthMedicalTab 
              formData={formData}
              handleInputChange={handleInputChange}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
            />
          )}
          
          {activeTab === 'medications' && (
            <MedicationsLifestyleTab 
              formData={formData}
              handleInputChange={handleInputChange}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
              setFormData={setFormData} 
            />
          )}
          
          {activeTab === 'devices' && (
            <DevicesTab 
              formData={formData}
              handleInputChange={handleInputChange}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced General Information Tab Component
// Enhanced General Information Tab Component
const GeneralInformationTab = ({ formData, handleInputChange, addArrayItem, removeArrayItem }) => {
  // Ensure emergencyContacts is always an array
  if (!Array.isArray(formData.emergencyContacts)) {
    formData.emergencyContacts = [{
      name: '',
      relationship: '',
      contactNumber: '',
      email: ''
    }];
  }
  // Standardized time zones list (no duplicates)
  const timeZones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
    { value: 'Pacific/Honolulu', label: 'Hawaii Time (HST)' },
    { value: 'America/Toronto', label: 'Eastern Time (Canada)' },
    { value: 'America/Vancouver', label: 'Pacific Time (Canada)' },
    { value: 'America/Mexico_City', label: 'Central Time (Mexico)' },
    { value: 'America/Sao_Paulo', label: 'Brasília Time (BRT)' },
    { value: 'America/Argentina/Buenos_Aires', label: 'Argentina Time (ART)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)' },
    { value: 'Europe/Berlin', label: 'Central European Time (Germany)' },
    { value: 'Europe/Rome', label: 'Central European Time (Italy)' },
    { value: 'Europe/Madrid', label: 'Central European Time (Spain)' },
    { value: 'Europe/Amsterdam', label: 'Central European Time (Netherlands)' },
    { value: 'Europe/Stockholm', label: 'Central European Time (Sweden)' },
    { value: 'Europe/Helsinki', label: 'Eastern European Time (Finland)' },
    { value: 'Europe/Athens', label: 'Eastern European Time (Greece)' },
    { value: 'Europe/Istanbul', label: 'Turkey Time (TRT)' },
    { value: 'Europe/Moscow', label: 'Moscow Time (MSK)' },
    { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST)' },
    { value: 'Asia/Karachi', label: 'Pakistan Standard Time (PKT)' },
    { value: 'Asia/Kolkata', label: 'India Standard Time (IST)' },
    { value: 'Asia/Dhaka', label: 'Bangladesh Standard Time (BST)' },
    { value: 'Asia/Bangkok', label: 'Indochina Time (ICT)' },
    { value: 'Asia/Jakarta', label: 'Western Indonesian Time (WIB)' },
    { value: 'Asia/Singapore', label: 'Singapore Standard Time (SGT)' },
    { value: 'Asia/Hong_Kong', label: 'Hong Kong Time (HKT)' },
    { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
    { value: 'Asia/Seoul', label: 'Korea Standard Time (KST)' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' },
    { value: 'Australia/Perth', label: 'Australian Western Time (AWT)' },
    { value: 'Pacific/Auckland', label: 'New Zealand Time (NZST)' },
    { value: 'Africa/Cairo', label: 'Eastern European Time (Egypt)' },
    { value: 'Africa/Johannesburg', label: 'South Africa Standard Time (SAST)' },
    { value: 'Africa/Lagos', label: 'West Africa Time (WAT)' },
    { value: 'Africa/Nairobi', label: 'East Africa Time (EAT)' }
  ];

  // Alphabetized languages list
  const languages = [
    'Afrikaans', 'Albanian', 'Amharic', 'Arabic', 'Armenian', 'Azerbaijani',
    'Belarusian', 'Bengali', 'Bulgarian',
    'Chinese (Simplified)', 'Chinese (Traditional)', 'Croatian', 'Czech',
    'Danish', 'Dutch',
    'English', 'Estonian',
    'Farsi', 'Finnish', 'French',
    'Georgian', 'German', 'Greek',
    'Hausa', 'Hebrew', 'Hindi', 'Hungarian',
    'Indonesian', 'Italian',
    'Japanese',
    'Kazakh', 'Korean',
    'Latvian', 'Lithuanian',
    'Malay', 'Norwegian',
    'Pashto', 'Polish', 'Portuguese',
    'Romanian', 'Russian',
    'Serbian', 'Slovak', 'Slovenian', 'Spanish', 'Swahili', 'Swedish',
    'Tagalog', 'Thai', 'Turkish',
    'Ukrainian', 'Urdu', 'Uzbek',
    'Vietnamese',
    'Xhosa',
    'Yoruba',
    'Zulu'
  ];

  // Enhanced gender options
  const genderOptions = [
    'Male', 'Female', 'Non-binary', 'Genderfluid', 'Genderqueer', 'Transgender',
    'Agender', 'Demigender', 'Two-Spirit', 'Other', 'Prefer not to say'
  ];

  // Countries list
  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France',
    'Italy', 'Spain', 'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Sweden',
    'Norway', 'Denmark', 'Finland', 'Poland', 'Czech Republic', 'Hungary', 'Romania',
    'Bulgaria', 'Greece', 'Portugal', 'Ireland', 'Iceland', 'Luxembourg', 'Malta',
    'Cyprus', 'Estonia', 'Latvia', 'Lithuania', 'Slovenia', 'Slovakia', 'Croatia',
    'Serbia', 'Montenegro', 'Bosnia and Herzegovina', 'North Macedonia', 'Albania',
    'Moldova', 'Ukraine', 'Belarus', 'Russia', 'Turkey', 'Georgia', 'Armenia',
    'Azerbaijan', 'Kazakhstan', 'Uzbekistan', 'Kyrgyzstan', 'Tajikistan', 'Turkmenistan',
    'Afghanistan', 'Pakistan', 'India', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Bhutan',
    'Maldives', 'Myanmar', 'Thailand', 'Laos', 'Cambodia', 'Vietnam', 'Malaysia',
    'Singapore', 'Indonesia', 'Philippines', 'Brunei', 'East Timor', 'China',
    'Mongolia', 'North Korea', 'South Korea', 'Japan', 'Taiwan', 'Hong Kong', 'Macau',
    'Iran', 'Iraq', 'Syria', 'Lebanon', 'Jordan', 'Israel', 'Palestine', 'Saudi Arabia',
    'Yemen', 'Oman', 'United Arab Emirates', 'Qatar', 'Bahrain', 'Kuwait', 'Egypt',
    'Libya', 'Tunisia', 'Algeria', 'Morocco', 'Sudan', 'South Sudan', 'Ethiopia',
    'Eritrea', 'Djibouti', 'Somalia', 'Kenya', 'Uganda', 'Tanzania', 'Rwanda',
    'Burundi', 'Democratic Republic of Congo', 'Republic of Congo', 'Central African Republic',
    'Cameroon', 'Chad', 'Niger', 'Nigeria', 'Benin', 'Togo', 'Ghana', 'Burkina Faso',
    'Mali', 'Senegal', 'Mauritania', 'Gambia', 'Guinea-Bissau', 'Guinea', 'Sierra Leone',
    'Liberia', 'Ivory Coast', 'Cape Verde', 'São Tomé and Príncipe', 'Equatorial Guinea',
    'Gabon', 'Angola', 'Zambia', 'Malawi', 'Mozambique', 'Zimbabwe', 'Botswana',
    'Namibia', 'South Africa', 'Lesotho', 'Eswatini', 'Madagascar', 'Mauritius',
    'Seychelles', 'Comoros', 'Brazil', 'Argentina', 'Chile', 'Uruguay', 'Paraguay',
    'Bolivia', 'Peru', 'Ecuador', 'Colombia', 'Venezuela', 'Guyana', 'Suriname',
    'French Guiana', 'Mexico', 'Guatemala', 'Belize', 'El Salvador', 'Honduras',
    'Nicaragua', 'Costa Rica', 'Panama', 'Cuba', 'Jamaica', 'Haiti', 'Dominican Republic',
    'Puerto Rico', 'Trinidad and Tobago', 'Barbados', 'Saint Lucia', 'Saint Vincent and the Grenadines',
    'Grenada', 'Antigua and Barbuda', 'Dominica', 'Saint Kitts and Nevis', 'Bahamas',
    'New Zealand', 'Fiji', 'Papua New Guinea', 'Solomon Islands', 'Vanuatu', 'Samoa',
    'Tonga', 'Tuvalu', 'Kiribati', 'Nauru', 'Palau', 'Marshall Islands', 'Micronesia'
  ];

  return (
    <div className="space-y-6">
      {/* Personal Details - Enhanced with golden headers */}
      <div className="p-6 bg-white border border-gray-100 rounded-xl">
        <div 
          className="px-4 py-2 mb-4 rounded-lg"
          style={{ backgroundColor: '#F1C40F', color: '#02276F' }}
        >
          <h3 className="text-lg font-semibold">👤 Personal Details</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">First Name *</label>
            <input
              type="text"
              placeholder="Enter your first name"
              value={formData.personalDetails.firstName}
              onChange={(e) => handleInputChange('personalDetails', 'firstName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Last Name *</label>
            <input
              type="text"
              placeholder="Enter your last name"
              value={formData.personalDetails.lastName}
              onChange={(e) => handleInputChange('personalDetails', 'lastName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email *</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={formData.personalDetails.email}
              onChange={(e) => handleInputChange('personalDetails', 'email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Date of Birth *</label>
            <input
              type="date"
              value={formData.personalDetails.dateOfBirth}
              onChange={(e) => handleInputChange('personalDetails', 'dateOfBirth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Gender</label>
            <select
              value={formData.personalDetails.gender}
              onChange={(e) => handleInputChange('personalDetails', 'gender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select gender</option>
              {genderOptions.map(gender => (
                <option key={gender} value={gender}>{gender}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={formData.personalDetails.phoneNumber}
              onChange={(e) => handleInputChange('personalDetails', 'phoneNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {/* Address Section */}
        <div className="mt-6">
          <h4 className="mb-3 font-medium text-gray-900 text-md">📍 Address Information</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Country *</label>
              <select
                value={formData.personalDetails.country}
                onChange={(e) => handleInputChange('personalDetails', 'country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select country</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                placeholder="Enter state"
                value={formData.personalDetails.state}
                onChange={(e) => handleInputChange('personalDetails', 'state', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Province <span className="text-gray-500">(Optional)</span></label>
              <input
                type="text"
                placeholder="Enter province"
                value={formData.personalDetails.province}
                onChange={(e) => handleInputChange('personalDetails', 'province', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                placeholder="Enter your city"
                value={formData.personalDetails.city}
                onChange={(e) => handleInputChange('personalDetails', 'city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Street Address</label>
              <input
                type="text"
                placeholder="Enter street address"
                value={formData.personalDetails.address}
                onChange={(e) => handleInputChange('personalDetails', 'address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Postal Code</label>
              <input
                type="text"
                placeholder="Enter postal code"
                value={formData.personalDetails.postalCode}
                onChange={(e) => handleInputChange('personalDetails', 'postalCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 📊 Current Health Metrics - Enhanced Professional Version */}
      <div className="p-6 bg-white border border-gray-100 rounded-xl">
        <div 
          className="px-4 py-2 mb-4 rounded-lg"
          style={{ backgroundColor: '#F1C40F', color: '#02276F' }}
        >
          <h3 className="text-lg font-semibold">📊 Current Health Metrics</h3>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Height - Professional Multi-Metric */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">📏 Height</label>
            <div className="space-y-2">
              <select
                value={formData.currentHealthMetrics.height.unit}
                onChange={(e) => {
                  handleInputChange('currentHealthMetrics', 'height', e.target.value, 'unit');
                  // Clear values when unit changes
                  handleInputChange('currentHealthMetrics', 'height', '', 'value');
                  handleInputChange('currentHealthMetrics', 'height', '', 'feet');
                  handleInputChange('currentHealthMetrics', 'height', '', 'inches');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select unit</option>
                <option value="cm">Centimeters (cm)</option>
                <option value="ft-in">Feet & Inches</option>
                <option value="m">Meters (m)</option>
                <option value="in">Inches only</option>
              </select>
              
              {formData.currentHealthMetrics.height.unit === 'cm' && (
                <input
                  type="number"
                  placeholder="Height in cm (e.g., 175)"
                  value={formData.currentHealthMetrics.height.value}
                  onChange={(e) => handleInputChange('currentHealthMetrics', 'height', e.target.value, 'value')}
                  min="50"
                  max="250"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
              
              {formData.currentHealthMetrics.height.unit === 'ft-in' && (
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Feet"
                      value={formData.currentHealthMetrics.height.feet || ''}
                      onChange={(e) => handleInputChange('currentHealthMetrics', 'height', e.target.value, 'feet')}
                      min="2"
                      max="8"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-500">feet</span>
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Inches"
                      value={formData.currentHealthMetrics.height.inches || ''}
                      onChange={(e) => handleInputChange('currentHealthMetrics', 'height', e.target.value, 'inches')}
                      min="0"
                      max="11"
                      step="0.5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-500">inches</span>
                  </div>
                </div>
              )}
              
              {formData.currentHealthMetrics.height.unit === 'm' && (
                <input
                  type="number"
                  placeholder="Height in meters (e.g., 1.75)"
                  value={formData.currentHealthMetrics.height.value}
                  onChange={(e) => handleInputChange('currentHealthMetrics', 'height', e.target.value, 'value')}
                  min="0.5"
                  max="2.5"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
              
              {formData.currentHealthMetrics.height.unit === 'in' && (
                <input
                  type="number"
                  placeholder="Height in inches (e.g., 69)"
                  value={formData.currentHealthMetrics.height.value}
                  onChange={(e) => handleInputChange('currentHealthMetrics', 'height', e.target.value, 'value')}
                  min="20"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
              
              {/* Height Conversion Display */}
              {formData.currentHealthMetrics.height.value && (
                <div className="p-2 text-xs text-gray-600 rounded bg-gray-50">
                  {(() => {
                    let cm = 0;
                    if (formData.currentHealthMetrics.height.unit === 'cm') {
                      cm = parseFloat(formData.currentHealthMetrics.height.value);
                    } else if (formData.currentHealthMetrics.height.unit === 'm') {
                      cm = parseFloat(formData.currentHealthMetrics.height.value) * 100;
                    } else if (formData.currentHealthMetrics.height.unit === 'in') {
                      cm = parseFloat(formData.currentHealthMetrics.height.value) * 2.54;
                    } else if (formData.currentHealthMetrics.height.unit === 'ft-in') {
                      const feet = parseFloat(formData.currentHealthMetrics.height.feet) || 0;
                      const inches = parseFloat(formData.currentHealthMetrics.height.inches) || 0;
                      cm = (feet * 12 + inches) * 2.54;
                    }
                    
                    if (cm > 0) {
                      const totalInches = cm / 2.54;
                      const feet = Math.floor(totalInches / 12);
                      const inches = Math.round(totalInches % 12);
                      const meters = (cm / 100).toFixed(2);
                      
                      return (
                        <div>
                          <strong>Conversions:</strong><br/>
                          {cm.toFixed(1)} cm | {meters} m | {feet}'{inches}" | {totalInches.toFixed(1)}"
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Weight - Professional Multi-Metric */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">⚖️ Weight</label>
            <div className="space-y-2">
              <select
                value={formData.currentHealthMetrics.weight.unit}
                onChange={(e) => {
                  handleInputChange('currentHealthMetrics', 'weight', e.target.value, 'unit');
                  // Clear value when unit changes
                  handleInputChange('currentHealthMetrics', 'weight', '', 'value');
                  handleInputChange('currentHealthMetrics', 'weight', '', 'stones');
                  handleInputChange('currentHealthMetrics', 'weight', '', 'pounds');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select unit</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="lbs">Pounds (lbs)</option>
                <option value="st-lbs">Stone & Pounds (UK)</option>
                <option value="g">Grams (g)</option>
              </select>
              
              {formData.currentHealthMetrics.weight.unit === 'kg' && (
                <input
                  type="number"
                  placeholder="Weight in kg (e.g., 70)"
                  value={formData.currentHealthMetrics.weight.value}
                  onChange={(e) => handleInputChange('currentHealthMetrics', 'weight', e.target.value, 'value')}
                  min="20"
                  max="300"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
              
              {formData.currentHealthMetrics.weight.unit === 'lbs' && (
                <input
                  type="number"
                  placeholder="Weight in pounds (e.g., 154)"
                  value={formData.currentHealthMetrics.weight.value}
                  onChange={(e) => handleInputChange('currentHealthMetrics', 'weight', e.target.value, 'value')}
                  min="40"
                  max="600"
                  step="0.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
              
              {formData.currentHealthMetrics.weight.unit === 'st-lbs' && (
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Stone"
                      value={formData.currentHealthMetrics.weight.stones || ''}
                      onChange={(e) => handleInputChange('currentHealthMetrics', 'weight', e.target.value, 'stones')}
                      min="3"
                      max="40"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-500">stone</span>
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Pounds"
                      value={formData.currentHealthMetrics.weight.pounds || ''}
                      onChange={(e) => handleInputChange('currentHealthMetrics', 'weight', e.target.value, 'pounds')}
                      min="0"
                      max="13"
                      step="0.5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-500">pounds</span>
                  </div>
                </div>
              )}
              
              {formData.currentHealthMetrics.weight.unit === 'g' && (
                <input
                  type="number"
                  placeholder="Weight in grams (e.g., 70000)"
                  value={formData.currentHealthMetrics.weight.value}
                  onChange={(e) => handleInputChange('currentHealthMetrics', 'weight', e.target.value, 'value')}
                  min="20000"
                  max="300000"
                  step="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
              
              {/* Weight Conversion Display */}
              {formData.currentHealthMetrics.weight.value && (
                <div className="p-2 text-xs text-gray-600 rounded bg-gray-50">
                  {(() => {
                    let kg = 0;
                    if (formData.currentHealthMetrics.weight.unit === 'kg') {
                      kg = parseFloat(formData.currentHealthMetrics.weight.value);
                    } else if (formData.currentHealthMetrics.weight.unit === 'lbs') {
                      kg = parseFloat(formData.currentHealthMetrics.weight.value) * 0.453592;
                    } else if (formData.currentHealthMetrics.weight.unit === 'g') {
                      kg = parseFloat(formData.currentHealthMetrics.weight.value) / 1000;
                    } else if (formData.currentHealthMetrics.weight.unit === 'st-lbs') {
                      const stones = parseFloat(formData.currentHealthMetrics.weight.stones) || 0;
                      const pounds = parseFloat(formData.currentHealthMetrics.weight.pounds) || 0;
                      kg = (stones * 14 + pounds) * 0.453592;
                    }
                    
                    if (kg > 0) {
                      const lbs = kg * 2.20462;
                      const totalStones = Math.floor(lbs / 14);
                      const remainingPounds = (lbs % 14).toFixed(1);
                      const grams = (kg * 1000).toFixed(0);
                      
                      return (
                        <div>
                          <strong>Conversions:</strong><br/>
                          {kg.toFixed(1)} kg | {lbs.toFixed(1)} lbs | {totalStones}st {remainingPounds}lbs | {grams}g
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Blood Pressure */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">🩸 Blood Pressure</label>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Systolic"
                  value={formData.currentHealthMetrics.bloodPressure.systolic}
                  onChange={(e) => handleInputChange('currentHealthMetrics', 'bloodPressure', e.target.value, 'systolic')}
                  min="70"
                  max="200"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="px-2 py-2 text-gray-500">/</span>
                <input
                  type="number"
                  placeholder="Diastolic"
                  value={formData.currentHealthMetrics.bloodPressure.diastolic}
                  onChange={(e) => handleInputChange('currentHealthMetrics', 'bloodPressure', e.target.value, 'diastolic')}
                  min="40"
                  max="130"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input
                type="date"
                value={formData.currentHealthMetrics.bloodPressure.date}
                onChange={(e) => handleInputChange('currentHealthMetrics', 'bloodPressure', e.target.value, 'date')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.currentHealthMetrics.bloodPressure.systolic && formData.currentHealthMetrics.bloodPressure.diastolic && (
                <div className="p-2 text-xs rounded" style={{
                  backgroundColor: (() => {
                    const sys = parseInt(formData.currentHealthMetrics.bloodPressure.systolic);
                    const dia = parseInt(formData.currentHealthMetrics.bloodPressure.diastolic);
                    if (sys < 120 && dia < 80) return '#e8f5e9';
                    if (sys < 130 && dia < 80) return '#fff3e0';
                    if (sys < 140 || dia < 90) return '#ffe0b2';
                    return '#ffebee';
                  })(),
                  color: '#333'
                }}>
                  {(() => {
                    const sys = parseInt(formData.currentHealthMetrics.bloodPressure.systolic);
                    const dia = parseInt(formData.currentHealthMetrics.bloodPressure.diastolic);
                    if (sys < 120 && dia < 80) return '✓ Normal';
                    if (sys < 130 && dia < 80) return '⚠ Elevated';
                    if (sys < 140 || dia < 90) return '⚠ High Blood Pressure Stage 1';
                    return '⚠ High Blood Pressure Stage 2';
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Resting Heart Rate */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">💓 Resting Heart Rate</label>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="BPM"
                  value={formData.currentHealthMetrics.restingHeartRate}
                  onChange={(e) => handleInputChange('currentHealthMetrics', 'restingHeartRate', e.target.value)}
                  min="40"
                  max="120"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="px-3 py-2 text-gray-500 rounded-lg bg-gray-50">BPM</span>
              </div>
              {formData.currentHealthMetrics.restingHeartRate && (
                <div className="p-2 text-xs text-gray-600 rounded bg-gray-50">
                  {(() => {
                    const bpm = parseInt(formData.currentHealthMetrics.restingHeartRate);
                    if (bpm < 60) return '🏃 Athlete level (< 60 BPM)';
                    if (bpm <= 100) return '✓ Normal (60-100 BPM)';
                    return '⚠ Elevated (> 100 BPM)';
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Body Temperature */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">🌡️ Body Temperature</label>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <input
                  type="number"
                  step="0.1"
                  placeholder="Temperature"
                  value={formData.currentHealthMetrics.bodyTemperature.value}
                  onChange={(e) => handleInputChange('currentHealthMetrics', 'bodyTemperature', e.target.value, 'value')}
                  min="35"
                  max="42"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={formData.currentHealthMetrics.bodyTemperature.unit}
                  onChange={(e) => handleInputChange('currentHealthMetrics', 'bodyTemperature', e.target.value, 'unit')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="celsius">°C</option>
                  <option value="fahrenheit">°F</option>
                </select>
              </div>
              {formData.currentHealthMetrics.bodyTemperature.value && (
                <div className="p-2 text-xs text-gray-600 rounded bg-gray-50">
                  {(() => {
                    let celsius = parseFloat(formData.currentHealthMetrics.bodyTemperature.value);
                    if (formData.currentHealthMetrics.bodyTemperature.unit === 'fahrenheit') {
                      celsius = (celsius - 32) * 5/9;
                    }
                    const fahrenheit = formData.currentHealthMetrics.bodyTemperature.unit === 'celsius' 
                      ? (celsius * 9/5 + 32).toFixed(1)
                      : formData.currentHealthMetrics.bodyTemperature.value;
                    
                    return (
                      <div>
                        <strong>Conversion:</strong> {celsius.toFixed(1)}°C = {fahrenheit}°F
                        {celsius >= 36 && celsius <= 37.5 && ' ✓ Normal'}
                        {celsius < 36 && ' ⚠ Low'}
                        {celsius > 37.5 && ' ⚠ Elevated'}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BMI Calculator Display - Enhanced */}
        <div className="p-4 mt-4 rounded-lg bg-blue-50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Calculated BMI:</span>
            <div className="text-right">
              {(() => {
                let heightInMeters = 0;
                let weightInKg = 0;
                
                // Convert height to meters
                if (formData.currentHealthMetrics.height.unit === 'cm') {
                  heightInMeters = parseFloat(formData.currentHealthMetrics.height.value) / 100;
                } else if (formData.currentHealthMetrics.height.unit === 'm') {
                  heightInMeters = parseFloat(formData.currentHealthMetrics.height.value);
                } else if (formData.currentHealthMetrics.height.unit === 'ft-in') {
                  const feet = parseFloat(formData.currentHealthMetrics.height.feet) || 0;
                  const inches = parseFloat(formData.currentHealthMetrics.height.inches) || 0;
                  heightInMeters = ((feet * 12 + inches) * 2.54) / 100;
                } else if (formData.currentHealthMetrics.height.unit === 'in') {
                  heightInMeters = (parseFloat(formData.currentHealthMetrics.height.value) * 2.54) / 100;
                }
                
                // Convert weight to kg
                if (formData.currentHealthMetrics.weight.unit === 'kg') {
                  weightInKg = parseFloat(formData.currentHealthMetrics.weight.value);
                } else if (formData.currentHealthMetrics.weight.unit === 'lbs') {
                  weightInKg = parseFloat(formData.currentHealthMetrics.weight.value) * 0.453592;
                } else if (formData.currentHealthMetrics.weight.unit === 'g') {
                  weightInKg = parseFloat(formData.currentHealthMetrics.weight.value) / 1000;
                } else if (formData.currentHealthMetrics.weight.unit === 'st-lbs') {
                  const stones = parseFloat(formData.currentHealthMetrics.weight.stones) || 0;
                  const pounds = parseFloat(formData.currentHealthMetrics.weight.pounds) || 0;
                  weightInKg = (stones * 14 + pounds) * 0.453592;
                }
                
                if (heightInMeters > 0 && weightInKg > 0) {
                  const bmi = weightInKg / (heightInMeters * heightInMeters);
                  let category = '';
                  let color = '';
                  
                  if (bmi < 18.5) { category = 'Underweight'; color = 'text-yellow-600'; }
                  else if (bmi < 25) { category = 'Normal'; color = 'text-green-600'; }
                  else if (bmi < 30) { category = 'Overweight'; color = 'text-orange-600'; }
                  else { category = 'Obese'; color = 'text-red-600'; }
                  
                  return (
                    <>
                      <span className={`text-lg font-semibold ${color}`}>
                        {bmi.toFixed(1)}
                      </span>
                      <span className={`block text-sm ${color}`}>
                        {category}
                      </span>
                    </>
                  );
                }
                return <span className="text-lg font-semibold text-gray-400">--</span>;
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Account Preferences - Enhanced with alphabetized languages */}
      <div className="p-6 bg-white border border-gray-100 rounded-xl">
        <div 
          className="px-4 py-2 mb-4 rounded-lg"
          style={{ backgroundColor: '#F1C40F', color: '#02276F' }}
        >
          <h3 className="text-lg font-semibold">⚙️ Account Preferences</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Preferred Language</label>
            <select
              value={formData.accountPreferences.preferredLanguage}
              onChange={(e) => handleInputChange('accountPreferences', 'preferredLanguage', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {languages.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Time Zone</label>
            <select
              value={formData.accountPreferences.timeZone}
              onChange={(e) => handleInputChange('accountPreferences', 'timeZone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {timeZones.map(tz => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block mb-3 text-sm font-medium text-gray-700">📧 Notification Preferences</label>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.accountPreferences.emailNotifications}
                onChange={(e) => handleInputChange('accountPreferences', 'emailNotifications', e.target.checked)}
                className="mr-2 rounded"
                style={{ accentColor: '#02276F' }}
              />
              <span className="text-sm">📧 Email Notifications</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.accountPreferences.smsNotifications}
                onChange={(e) => handleInputChange('accountPreferences', 'smsNotifications', e.target.checked)}
                className="mr-2 rounded"
                style={{ accentColor: '#02276F' }}
              />
              <span className="text-sm">📱 SMS Notifications</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.accountPreferences.pushNotifications}
                onChange={(e) => handleInputChange('accountPreferences', 'pushNotifications', e.target.checked)}
                className="mr-2 rounded"
                style={{ accentColor: '#02276F' }}
              />
              <span className="text-sm">🔔 Push Notifications</span>
            </label>
          </div>
        </div>
      </div>

      {/* Emergency Contacts - Enhanced */}
      <div className="p-6 bg-white border border-gray-100 rounded-xl">
        <div 
          className="flex items-center justify-between px-4 py-2 mb-4 rounded-lg"
          style={{ backgroundColor: '#F1C40F', color: '#02276F' }}
        >
          <h3 className="text-lg font-semibold">🚨 Emergency Contacts</h3>
          <button
            onClick={() => addArrayItem('emergencyContacts', null, { name: '', relationship: '', contactNumber: '', email: '' })}
            className="px-3 py-1 text-sm border border-current rounded hover:bg-current hover:bg-opacity-10"
          >
            + Add Contact
          </button>
        </div>
        {formData.emergencyContacts.map((contact, index) => (
          <div key={index} className="grid grid-cols-1 gap-4 p-4 mb-4 border border-gray-200 rounded-lg md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Name *</label>
              <input
                type="text"
                placeholder="Contact name"
                value={contact.name}
                onChange={(e) => {
                  const updatedContacts = [...formData.emergencyContacts];
                  updatedContacts[index].name = e.target.value;
                  handleInputChange('emergencyContacts', null, updatedContacts);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Relationship</label>
              <select
                value={contact.relationship}
                onChange={(e) => {
                  const updatedContacts = [...formData.emergencyContacts];
                  updatedContacts[index].relationship = e.target.value;
                  handleInputChange('emergencyContacts', null, updatedContacts);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select relationship</option>
                <option value="Spouse">Spouse</option>
                <option value="Parent">Parent</option>
                <option value="Child">Child</option>
                <option value="Sibling">Sibling</option>
                <option value="Friend">Friend</option>
                <option value="Other Family">Other Family</option>
                <option value="Guardian">Guardian</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number *</label>
              <input
                type="tel"
                placeholder="Phone number"
                value={contact.contactNumber}
                onChange={(e) => {
                  const updatedContacts = [...formData.emergencyContacts];
                  updatedContacts[index].contactNumber = e.target.value;
                  handleInputChange('emergencyContacts', null, updatedContacts);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Email address"
                value={contact.email}
                onChange={(e) => {
                  const updatedContacts = [...formData.emergencyContacts];
                  updatedContacts[index].email = e.target.value;
                  handleInputChange('emergencyContacts', null, updatedContacts);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {formData.emergencyContacts.length > 1 && (
              <div className="col-span-full">
                <button
                  onClick={() => removeArrayItem('emergencyContacts', null, index)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  ❌ Remove Contact
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
// Enhanced Health & Medical Information Tab Component
const HealthMedicalTab = ({ formData, handleInputChange, addArrayItem, removeArrayItem }) => {
  // Comprehensive vaccination list
  const vaccinationsList = [
    'COVID-19', 'Influenza (Flu)', 'Tetanus', 'Diphtheria', 'Pertussis (Whooping Cough)', 
    'Measles', 'Mumps', 'Rubella (MMR)', 'Polio', 'Hepatitis A', 'Hepatitis B', 
    'Varicella (Chickenpox)', 'Pneumococcal', 'Meningococcal', 'HPV (Human Papillomavirus)', 
    'Shingles (Zoster)', 'Haemophilus influenzae type b (Hib)', 'Rotavirus', 
    'Japanese Encephalitis', 'Yellow Fever', 'Typhoid', 'Rabies', 'Anthrax', 
    'Smallpox', 'Tuberculosis (BCG)', 'Tick-borne Encephalitis', 'Cholera', 
    'Dengue Fever', 'Malaria (Prophylaxis)', 'Monkeypox', 'RSV (Respiratory Syncytial Virus)',
    'Adenovirus', 'Plague', 'Tularemia', 'Q Fever', 'Venezuelan Equine Encephalitis'
  ];

  // Common medical conditions for quick selection
  const commonConditions = [
    'Hypertension', 'Diabetes Type 1', 'Diabetes Type 2', 'Heart Disease', 'Asthma', 
    'COPD', 'Arthritis', 'Osteoporosis', 'Depression', 'Anxiety', 'Bipolar Disorder',
    'High Cholesterol', 'Thyroid Disease', 'Kidney Disease', 'Liver Disease', 
    'Cancer', 'Stroke', 'Epilepsy', 'Migraine', 'Sleep Apnea', 'GERD', 
    'Irritable Bowel Syndrome', 'Crohn\'s Disease', 'Ulcerative Colitis', 'Fibromyalgia',
    'Lupus', 'Rheumatoid Arthritis', 'Multiple Sclerosis', 'Parkinson\'s Disease',
    'Alzheimer\'s Disease', 'Chronic Fatigue Syndrome', 'Celiac Disease', 'Glaucoma'
  ];

  // Allergy severity levels
  const allergySeverityLevels = ['Mild', 'Moderate', 'Severe', 'Life-threatening'];

  return (
    <div className="space-y-6">
      {/* Medical History - Enhanced */}
      <div className="p-6 bg-white border border-gray-100 rounded-xl">
        <div 
          className="px-4 py-2 mb-4 rounded-lg"
          style={{ backgroundColor: '#F1C40F', color: '#02276F' }}
        >
          <h3 className="text-lg font-semibold">📋 Medical History</h3>
        </div>
        
        {/* Quick Condition Selection */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">Known Medical Conditions</label>
          <div className="grid grid-cols-2 gap-2 mb-4 md:grid-cols-3 lg:grid-cols-4">
            {commonConditions.slice(0, 16).map(condition => (
              <label key={condition} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={formData.medicalHistory.knownConditions.includes(condition)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      addArrayItem('medicalHistory', 'knownConditions', condition);
                    } else {
                      const index = formData.medicalHistory.knownConditions.indexOf(condition);
                      removeArrayItem('medicalHistory', 'knownConditions', index);
                    }
                  }}
                  className="mr-2"
                  style={{ accentColor: '#02276F' }}
                />
                <span>{condition}</span>
              </label>
            ))}
          </div>
          <details className="mb-4">
            <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
              Show more conditions...
            </summary>
            <div className="grid grid-cols-2 gap-2 mt-2 md:grid-cols-3 lg:grid-cols-4">
              {commonConditions.slice(16).map(condition => (
                <label key={condition} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={formData.medicalHistory.knownConditions.includes(condition)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        addArrayItem('medicalHistory', 'knownConditions', condition);
                      } else {
                        const index = formData.medicalHistory.knownConditions.indexOf(condition);
                        removeArrayItem('medicalHistory', 'knownConditions', index);
                      }
                    }}
                    className="mr-2"
                    style={{ accentColor: '#02276F' }}
                  />
                  <span>{condition}</span>
                </label>
              ))}
            </div>
          </details>
          <textarea
            placeholder="Add any other conditions not listed above..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Family Medical History</label>
            <textarea
              placeholder="List family conditions (parents, siblings, grandparents)"
              value={formData.medicalHistory.familyMedicalHistory}
              onChange={(e) => handleInputChange('medicalHistory', 'familyMedicalHistory', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Previous Surgeries & Hospitalizations</label>
            <textarea
              placeholder="List surgeries with dates and hospitals"
              value={formData.medicalHistory.previousSurgeries.join(', ')}
              onChange={(e) => handleInputChange('medicalHistory', 'previousSurgeries', e.target.value.split(', '))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Allergies - Enhanced with Multiple Entries and Individual Severity */}
      <div className="p-6 bg-white border border-gray-100 rounded-xl">
        <div 
          className="px-4 py-2 mb-4 rounded-lg"
          style={{ backgroundColor: '#F1C40F', color: '#02276F' }}
        >
          <h3 className="text-lg font-semibold">⚠️ Allergies & Sensitivities</h3>
        </div>
        
        {/* Medication Allergies */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">💊 Medication Allergies</label>
            <button
              onClick={() => {
                const newAllergy = { name: '', severity: 'Moderate' };
                const currentAllergies = Array.isArray(formData.allergies.medicationAllergies) 
                  ? formData.allergies.medicationAllergies.filter(a => typeof a === 'object' && a !== null)
                  : [];
                handleInputChange('allergies', 'medicationAllergies', [...currentAllergies, newAllergy]);
              }}
              className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
            >
              + Add Medication Allergy
            </button>
          </div>
          <div className="space-y-2">
            {(Array.isArray(formData.allergies.medicationAllergies) ? formData.allergies.medicationAllergies : [])
              .filter(allergy => typeof allergy === 'object' && allergy !== null)
              .map((allergy, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="e.g., Penicillin, Aspirin"
                  value={allergy.name || ''}
                  onChange={(e) => {
                    const updated = [...formData.allergies.medicationAllergies];
                    updated[index] = { ...updated[index], name: e.target.value };
                    handleInputChange('allergies', 'medicationAllergies', updated);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={allergy.severity || 'Moderate'}
                  onChange={(e) => {
                    const updated = [...formData.allergies.medicationAllergies];
                    updated[index] = { ...updated[index], severity: e.target.value };
                    handleInputChange('allergies', 'medicationAllergies', updated);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {allergySeverityLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    const updated = formData.allergies.medicationAllergies.filter((_, i) => i !== index);
                    handleInputChange('allergies', 'medicationAllergies', updated);
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            ))}
            {(!formData.allergies.medicationAllergies || formData.allergies.medicationAllergies.length === 0) && (
              <p className="text-sm text-gray-500">No medication allergies added</p>
            )}
          </div>
        </div>

        {/* Food Allergies */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">🥜 Food Allergies</label>
            <button
              onClick={() => {
                const newAllergy = { name: '', severity: 'Moderate' };
                const currentAllergies = Array.isArray(formData.allergies.foodAllergies) 
                  ? formData.allergies.foodAllergies.filter(a => typeof a === 'object' && a !== null)
                  : [];
                handleInputChange('allergies', 'foodAllergies', [...currentAllergies, newAllergy]);
              }}
              className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
            >
              + Add Food Allergy
            </button>
          </div>
          <div className="space-y-2">
            {(Array.isArray(formData.allergies.foodAllergies) ? formData.allergies.foodAllergies : [])
              .filter(allergy => typeof allergy === 'object' && allergy !== null)
              .map((allergy, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="e.g., Peanuts, Shellfish, Dairy"
                  value={allergy.name || ''}
                  onChange={(e) => {
                    const updated = [...formData.allergies.foodAllergies];
                    updated[index] = { ...updated[index], name: e.target.value };
                    handleInputChange('allergies', 'foodAllergies', updated);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={allergy.severity || 'Moderate'}
                  onChange={(e) => {
                    const updated = [...formData.allergies.foodAllergies];
                    updated[index] = { ...updated[index], severity: e.target.value };
                    handleInputChange('allergies', 'foodAllergies', updated);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {allergySeverityLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    const updated = formData.allergies.foodAllergies.filter((_, i) => i !== index);
                    handleInputChange('allergies', 'foodAllergies', updated);
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            ))}
            {(!formData.allergies.foodAllergies || formData.allergies.foodAllergies.length === 0) && (
              <p className="text-sm text-gray-500">No food allergies added</p>
            )}
          </div>
        </div>

        {/* Environmental Allergies */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">🌿 Environmental Allergies</label>
            <button
              onClick={() => {
                const newAllergy = { name: '', severity: 'Moderate' };
                const currentAllergies = Array.isArray(formData.allergies.environmentalAllergies) 
                  ? formData.allergies.environmentalAllergies.filter(a => typeof a === 'object' && a !== null)
                  : [];
                handleInputChange('allergies', 'environmentalAllergies', [...currentAllergies, newAllergy]);
              }}
              className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
            >
              + Add Environmental Allergy
            </button>
          </div>
          <div className="space-y-2">
            {(Array.isArray(formData.allergies.environmentalAllergies) ? formData.allergies.environmentalAllergies : [])
              .filter(allergy => typeof allergy === 'object' && allergy !== null)
              .map((allergy, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="e.g., Pollen, Dust, Pet Dander"
                  value={allergy.name || ''}
                  onChange={(e) => {
                    const updated = [...formData.allergies.environmentalAllergies];
                    updated[index] = { ...updated[index], name: e.target.value };
                    handleInputChange('allergies', 'environmentalAllergies', updated);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={allergy.severity || 'Moderate'}
                  onChange={(e) => {
                    const updated = [...formData.allergies.environmentalAllergies];
                    updated[index] = { ...updated[index], severity: e.target.value };
                    handleInputChange('allergies', 'environmentalAllergies', updated);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {allergySeverityLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    const updated = formData.allergies.environmentalAllergies.filter((_, i) => i !== index);
                    handleInputChange('allergies', 'environmentalAllergies', updated);
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            ))}
            {(!formData.allergies.environmentalAllergies || formData.allergies.environmentalAllergies.length === 0) && (
              <p className="text-sm text-gray-500">No environmental allergies added</p>
            )}
          </div>
        </div>
      </div>

      {/* Vaccination Records - Enhanced with Comprehensive List */}
      <div className="p-6 bg-white border border-gray-100 rounded-xl">
        <div 
          className="px-4 py-2 mb-4 rounded-lg"
          style={{ backgroundColor: '#F1C40F', color: '#02276F' }}
        >
          <h3 className="text-lg font-semibold">💉 Vaccination Records</h3>
        </div>
        
        {/* COVID-19 Status */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">COVID-19 Vaccination Status</label>
          <select
            value={formData.vaccinationRecords.covidVaccineStatus}
            onChange={(e) => handleInputChange('vaccinationRecords', 'covidVaccineStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select status</option>
            <option value="Not Vaccinated">Not Vaccinated</option>
            <option value="Partially Vaccinated">Partially Vaccinated (1 dose)</option>
            <option value="Fully Vaccinated">Fully Vaccinated (2 doses)</option>
            <option value="Boosted">Boosted (3+ doses)</option>
            <option value="Recently Boosted">Recently Boosted (2024/2025)</option>
          </select>
        </div>

        {/* Vaccination Checklist */}
        <div className="mb-4">
          <label className="block mb-3 text-sm font-medium text-gray-700">Vaccination History</label>
          <p className="mb-4 text-sm text-gray-600">Check all vaccines you have received. This helps our AI provide better health recommendations.</p>
          
          {/* Core/Common Vaccines */}
          <div className="mb-4">
            <h4 className="mb-2 font-medium text-gray-800 text-md">🏥 Core Vaccines</h4>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
              {vaccinationsList.slice(0, 18).map(vaccine => (
                <label key={vaccine} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={formData.vaccinationRecords.vaccinations[vaccine] || false}
                    onChange={(e) => handleInputChange('vaccinationRecords', 'vaccinations', {
                      ...formData.vaccinationRecords.vaccinations,
                      [vaccine]: e.target.checked
                    })}
                    className="mr-2"
                    style={{ accentColor: '#02276F' }}
                  />
                  <span>{vaccine}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Travel/Special Vaccines */}
          <details className="mb-4">
            <summary className="text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-800">
              🌍 Travel & Special Vaccines
            </summary>
            <div className="grid grid-cols-1 gap-2 mt-2 md:grid-cols-2 lg:grid-cols-3">
              {vaccinationsList.slice(18).map(vaccine => (
                <label key={vaccine} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={formData.vaccinationRecords.vaccinations[vaccine] || false}
                    onChange={(e) => handleInputChange('vaccinationRecords', 'vaccinations', {
                      ...formData.vaccinationRecords.vaccinations,
                      [vaccine]: e.target.checked
                    })}
                    className="mr-2"
                    style={{ accentColor: '#02276F' }}
                  />
                  <span>{vaccine}</span>
                </label>
              ))}
            </div>
          </details>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Additional Vaccines or Notes</label>
            <textarea
              placeholder="List any other vaccines or specific dates/boosters"
              value={formData.vaccinationRecords.routineImmunizations.join(', ')}
              onChange={(e) => handleInputChange('vaccinationRecords', 'routineImmunizations', e.target.value.split(', '))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Doctor & Care Team - Enhanced */}
      <div className="p-6 bg-white border border-gray-100 rounded-xl">
        <div 
          className="px-4 py-2 mb-4 rounded-lg"
          style={{ backgroundColor: '#F1C40F', color: '#02276F' }}
        >
          <h3 className="text-lg font-semibold">👩‍⚕️ Healthcare Team & Providers</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Primary Care Physician</label>
            <input
              type="text"
              placeholder="Dr. Name, Practice/Hospital"
              value={formData.doctorCareTeam.primaryCarePhysician}
              onChange={(e) => handleInputChange('doctorCareTeam', 'primaryCarePhysician', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Preferred Hospital</label>
            <input
              type="text"
              placeholder="Hospital name and location"
              value={formData.doctorCareTeam.preferredHospital}
              onChange={(e) => handleInputChange('doctorCareTeam', 'preferredHospital', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Specialists</label>
            <textarea
              placeholder="List specialists (Cardiologist, Endocrinologist, etc.)"
              value={formData.doctorCareTeam.specialists.join(', ')}
              onChange={(e) => handleInputChange('doctorCareTeam', 'specialists', e.target.value.split(', '))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Upcoming Appointments</label>
            <textarea
              placeholder="Date, Time, Doctor, Purpose"
              value={formData.doctorCareTeam.upcomingAppointments.join(', ')}
              onChange={(e) => handleInputChange('doctorCareTeam', 'upcomingAppointments', e.target.value.split(', '))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Emergency Medical Contact</label>
          <input
            type="text"
            placeholder="Doctor or hospital for medical emergencies"
            value={formData.doctorCareTeam.emergencyContact}
            onChange={(e) => handleInputChange('doctorCareTeam', 'emergencyContact', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 🏥 Insurance Information - MOVED FROM GENERAL TAB */}
      <div className="p-6 bg-white border border-gray-100 rounded-xl">
        <div 
          className="px-4 py-2 mb-4 rounded-lg"
          style={{ backgroundColor: '#F1C40F', color: '#02276F' }}
        >
          <h3 className="text-lg font-semibold">🏥 Insurance Information <span className="text-sm font-normal">(Optional)</span></h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Insurance Provider</label>
            <input
              type="text"
              placeholder="Provider name"
              value={formData.insuranceInformation.providerName}
              onChange={(e) => handleInputChange('insuranceInformation', 'providerName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Policy Number</label>
            <input
              type="text"
              placeholder="Policy number"
              value={formData.insuranceInformation.policyNumber}
              onChange={(e) => handleInputChange('insuranceInformation', 'policyNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Group Number</label>
            <input
              type="text"
              placeholder="Group number"
              value={formData.insuranceInformation.groupNumber}
              onChange={(e) => handleInputChange('insuranceInformation', 'groupNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Member ID</label>
            <input
              type="text"
              placeholder="Member ID"
              value={formData.insuranceInformation.memberID}
              onChange={(e) => handleInputChange('insuranceInformation', 'memberID', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Coverage Details</label>
          <textarea
            placeholder="Describe your coverage (copays, deductibles, covered services)"
            value={formData.insuranceInformation.coverageDetails}
            onChange={(e) => handleInputChange('insuranceInformation', 'coverageDetails', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* AI Data Collection Notice */}
      <div 
        className="p-6 border-2 rounded-xl"
        style={{ backgroundColor: 'rgba(2, 39, 111, 0.05)', borderColor: '#02276F' }}
      >
        <h3 className="mb-4 text-lg font-semibold" style={{ color: '#02276F' }}>
          🤖 AI-Powered Health Insights
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-start space-x-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: '#F1C40F', color: '#02276F' }}
            >
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Personalized Recommendations</h4>
              <p className="text-sm text-gray-600">Our AI analyzes your health data to provide tailored wellness advice</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: '#86B7F7', color: '#02276F' }}
            >
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Privacy Protected</h4>
              <p className="text-sm text-gray-600">All data is encrypted and stored securely in Azure Data Lake</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: '#00FC14', color: '#02276F' }}
            >
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Predictive Health</h4>
              <p className="text-sm text-gray-600">Early detection of potential health risks and prevention strategies</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: '#C80C0C', color: 'white' }}
            >
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Care Coordination</h4>
              <p className="text-sm text-gray-600">Seamless integration with your healthcare providers</p>
            </div>
          </div>
        </div>
        <div className="p-3 mt-4 rounded-lg bg-blue-50">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> The more complete your health profile, the better our AI can assist you with personalized healthcare recommendations and early warning systems.
          </p>
        </div>
      </div>
    </div>
  );
};
// Enhanced Medications & Lifestyle Tab Component
const MedicationsLifestyleTab = ({ formData, handleInputChange, addArrayItem, removeArrayItem, setFormData }) => {
  // Ensure currentMedications is always an array
  if (!Array.isArray(formData.currentMedications)) {
    formData.currentMedications = [];
  }
  
  // Alternative Healthcare Providers with Professional Associations
  const alternativeProviders = [
    {
      id: 'naturopaths',
      name: 'Naturopathic Doctors',
      association: 'American Association of Naturopathic Physicians (AANP)',
      description: 'Licensed naturopathic doctors who address health issues through natural remedies, focusing on whole-body wellness.',
      icon: '🌿',
      services: ['Natural remedies', 'Nutritional counseling', 'Herbal medicine', 'Lifestyle counseling']
    },
    {
      id: 'chiropractors',
      name: 'Chiropractors',
      association: 'American Chiropractic Association (ACA)',
      description: 'Certified chiropractors offering care for musculoskeletal disorders, including spinal adjustments and rehabilitation therapy.',
      icon: '🦴',
      services: ['Spinal adjustments', 'Physical therapy', 'Pain management', 'Sports injury treatment']
    },
    {
      id: 'acupuncturists',
      name: 'Acupuncturists',
      association: 'American Association of Acupuncture and Oriental Medicine (AAAOM)',
      description: 'Licensed acupuncture providers offering traditional Chinese medicine practices such as acupuncture and herbal treatments.',
      icon: '🎯',
      services: ['Acupuncture', 'Traditional Chinese medicine', 'Herbal treatments', 'Cupping therapy']
    },
    {
      id: 'nutritionists',
      name: 'Nutritionists & Dietitians',
      association: 'National Association of Nutrition Professionals (NANP)',
      description: 'Holistic nutrition professionals who help create personalized nutrition plans emphasizing balanced diets and wellness.',
      icon: '🥗',
      services: ['Nutritional counseling', 'Diet planning', 'Weight management', 'Food sensitivity testing']
    },
    {
      id: 'homeopaths',
      name: 'Homeopathic Practitioners',
      association: 'National Center for Homeopathy (NCH)',
      description: 'Homeopathic doctors who practice natural medicine, focusing on gentle, individualized treatment approaches.',
      icon: '💧',
      services: ['Homeopathic remedies', 'Constitutional analysis', 'Detoxification', 'Chronic disease management']
    },
    {
      id: 'yoga_therapists',
      name: 'Yoga Therapists',
      association: 'International Association of Yoga Therapists (IAYT)',
      description: 'Certified practitioners who guide therapeutic yoga and mind-body exercises for conditions like chronic pain, anxiety, and stress.',
      icon: '🧘',
      services: ['Therapeutic yoga', 'Meditation guidance', 'Stress management', 'Mind-body healing']
    },
    {
      id: 'reflexologists',
      name: 'Reflexologists',
      association: 'Reflexology Association of America (RAA)',
      description: 'Practitioners providing non-invasive, pressure-point therapy to promote overall wellness and natural healing.',
      icon: '👣',
      services: ['Foot reflexology', 'Hand reflexology', 'Pressure point therapy', 'Stress relief']
    },
    {
      id: 'energy_healers',
      name: 'Energy Healers',
      association: 'Association for Comprehensive Energy Psychology (ACEP)',
      description: 'Certified practitioners providing therapies like Reiki, emotional freedom techniques (EFT), and other energy-based practices.',
      icon: '✨',
      services: ['Reiki healing', 'Energy balancing', 'Chakra alignment', 'Emotional freedom techniques']
    },
    {
      id: 'balneotherapy',
      name: 'Balneotherapy Specialists',
      association: 'International Association of Balneology (IAB)',
      description: 'Practitioners offering water-based therapies including mineral water treatments, hydrotherapy, and spa wellness.',
      icon: '🌊',
      services: ['Mineral water therapy', 'Hydrotherapy', 'Therapeutic baths', 'Spa treatments']
    }
  ];

  // Exercise types for better data collection
  const exerciseTypes = [
    'Walking', 'Running', 'Cycling', 'Swimming', 'Weight Training', 'Yoga', 'Pilates',
    'Dance', 'Martial Arts', 'Rock Climbing', 'Tennis', 'Basketball', 'Soccer', 'Golf',
    'Hiking', 'CrossFit', 'Zumba', 'Spinning', 'Boxing', 'Rowing', 'Other'
  ];

  // Sleep quality options
  const sleepQualityOptions = [
    'Excellent', 'Good', 'Fair', 'Poor', 'Very Poor'
  ];

  // Stress level options
  const stressLevelOptions = [
    'Very Low', 'Low', 'Moderate', 'High', 'Very High', 'Overwhelming'
  ];

  return (
    <div className="space-y-6">
      {/* Current Medications - Fixed */}
      {/* Current Medications - Fixed Version */}
      <div className="p-6 bg-white border border-gray-100 rounded-xl">
        <div 
          className="flex items-center justify-between px-4 py-2 mb-4 rounded-lg"
          style={{ backgroundColor: '#F1C40F', color: '#02276F' }}
        >
          <h3 className="text-lg font-semibold">💊 Current Medications</h3>
          <button
            onClick={() => {
              const newMedication = {
                name: '',
                dosage: '',
                frequency: '',
                prescribingDoctor: '',
                startDate: '',
                endDate: '',
                purpose: '',
                sideEffects: ''
              };
              
              // Use setFormData directly
              setFormData(prev => ({
                ...prev,
                currentMedications: [...(prev.currentMedications || []), newMedication]
              }));
            }}
            className="px-3 py-1 text-sm transition-all duration-200 border border-current rounded hover:bg-current hover:bg-opacity-10"
          >
            + Add Medication
          </button>
        </div>

        {(!formData.currentMedications || formData.currentMedications.length === 0) ? (
          <div className="py-8 text-center text-gray-500">
            <Pill className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No medications added yet.</p>
            <p className="text-sm">Click "Add Medication" to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {formData.currentMedications.map((medication, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Medication Name *</label>
                    <input
                      type="text"
                      placeholder="e.g., Metformin, Lisinopril"
                      value={medication.name || ''}
                      onChange={(e) => {
                        const updatedMedications = [...formData.currentMedications];
                        updatedMedications[index] = { ...updatedMedications[index], name: e.target.value };
                        setFormData(prev => ({
                          ...prev,
                          currentMedications: updatedMedications
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Dosage & Strength</label>
                    <input
                      type="text"
                      placeholder="e.g., 500mg, 10mg"
                      value={medication.dosage || ''}
                      onChange={(e) => {
                        const updatedMedications = [...formData.currentMedications];
                        updatedMedications[index] = { ...updatedMedications[index], dosage: e.target.value };
                        setFormData(prev => ({
                          ...prev,
                          currentMedications: updatedMedications
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Frequency</label>
                    <select
                      value={medication.frequency || ''}
                      onChange={(e) => {
                        const updatedMedications = [...formData.currentMedications];
                        updatedMedications[index] = { ...updatedMedications[index], frequency: e.target.value };
                        setFormData(prev => ({
                          ...prev,
                          currentMedications: updatedMedications
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select frequency</option>
                      <option value="Once daily">Once daily</option>
                      <option value="Twice daily">Twice daily</option>
                      <option value="Three times daily">Three times daily</option>
                      <option value="Four times daily">Four times daily</option>
                      <option value="Every other day">Every other day</option>
                      <option value="Weekly">Weekly</option>
                      <option value="As needed">As needed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Prescribing Doctor</label>
                    <input
                      type="text"
                      placeholder="Dr. Smith"
                      value={medication.prescribingDoctor || ''}
                      onChange={(e) => {
                        const updatedMedications = [...formData.currentMedications];
                        updatedMedications[index] = { ...updatedMedications[index], prescribingDoctor: e.target.value };
                        setFormData(prev => ({
                          ...prev,
                          currentMedications: updatedMedications
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Start Date</label>
                    <input
                      type="date"
                      value={medication.startDate || ''}
                      onChange={(e) => {
                        const updatedMedications = [...formData.currentMedications];
                        updatedMedications[index] = { ...updatedMedications[index], startDate: e.target.value };
                        setFormData(prev => ({
                          ...prev,
                          currentMedications: updatedMedications
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Purpose/Condition</label>
                    <input
                      type="text"
                      placeholder="e.g., Diabetes, High blood pressure"
                      value={medication.purpose || ''}
                      onChange={(e) => {
                        const updatedMedications = [...formData.currentMedications];
                        updatedMedications[index] = { ...updatedMedications[index], purpose: e.target.value };
                        setFormData(prev => ({
                          ...prev,
                          currentMedications: updatedMedications
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Side Effects Experienced</label>
                  <textarea
                    placeholder="List any side effects you've experienced"
                    value={medication.sideEffects || ''}
                    onChange={(e) => {
                      const updatedMedications = [...formData.currentMedications];
                      updatedMedications[index] = { ...updatedMedications[index], sideEffects: e.target.value };
                      setFormData(prev => ({
                        ...prev,
                        currentMedications: updatedMedications
                      }));
                    }}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end mt-3">
                  <button
                    onClick={() => {
                      const updated = formData.currentMedications.filter((_, i) => i !== index);
                      setFormData(prev => ({
                        ...prev,
                        currentMedications: updated
                      }));
                    }}
                    className="text-sm text-red-600 transition-colors duration-200 hover:text-red-800"
                  >
                    ❌ Remove Medication
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Supplements & Alternative Medicine - Enhanced */}
      <div className="p-6 bg-white border border-gray-100 rounded-xl">
        <div 
          className="px-4 py-2 mb-4 rounded-lg"
          style={{ backgroundColor: '#F1C40F', color: '#02276F' }}
        >
          <h3 className="text-lg font-semibold">🌿 Supplements & Alternative Medicine</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Vitamins & Supplements</label>
            <textarea
              placeholder="List vitamins and supplements (Vitamin D, Omega-3, Probiotics, etc.)"
              value={formData.supplements.vitaminsSupplements.join(', ')}
              onChange={(e) => handleInputChange('supplements', 'vitaminsSupplements', e.target.value.split(', '))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Herbal Remedies & Natural Products</label>
            <textarea
              placeholder="List herbal remedies (Turmeric, Ginkgo, Echinacea, etc.)"
              value={formData.supplements.herbalRemedies.join(', ')}
              onChange={(e) => handleInputChange('supplements', 'herbalRemedies', e.target.value.split(', '))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Alternative Healthcare Providers - NEW COMPREHENSIVE SECTION */}
      <div className="p-6 bg-white border border-gray-100 rounded-xl">
        <div 
          className="px-4 py-2 mb-4 rounded-lg"
          style={{ backgroundColor: '#F1C40F', color: '#02276F' }}
        >
          <h3 className="text-lg font-semibold">🌟 Alternative & Traditional Healthcare Providers</h3>
        </div>
        
        <div className="p-4 mb-6 rounded-lg bg-blue-50">
          <h4 className="mb-2 font-semibold text-blue-900">🚀 MediCureOn's Revolutionary Approach</h4>
          <p className="text-sm text-blue-800">
            We're the first healthcare platform to integrate traditional and alternative medicine with AI-powered recommendations. 
            Tell us about your preferences and experience with these healing modalities.
          </p>
        </div>

        <div className="space-y-6">
          {alternativeProviders.map((provider) => (
            <div key={provider.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{provider.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{provider.name}</h4>
                    <p className="text-sm text-gray-600">{provider.association}</p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={formData.alternativeHealthcare.providers[provider.id] || false}
                      onChange={(e) => handleInputChange('alternativeHealthcare', 'providers', {
                        ...formData.alternativeHealthcare.providers,
                        [provider.id]: e.target.checked
                      })}
                      className="mr-2"
                      style={{ accentColor: '#02276F' }}
                    />
                    <span>Currently Using</span>
                  </label>
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={formData.alternativeHealthcare.interests[provider.id] || false}
                      onChange={(e) => handleInputChange('alternativeHealthcare', 'interests', {
                        ...formData.alternativeHealthcare.interests,
                        [provider.id]: e.target.checked
                      })}
                      className="mr-2"
                      style={{ accentColor: '#00FC14' }}
                    />
                    <span>Interested In</span>
                  </label>
                </div>
              </div>
              
              <p className="mb-3 text-sm text-gray-700">{provider.description}</p>
              
              <div className="mb-3">
                <p className="mb-1 text-sm font-medium text-gray-700">Services:</p>
                <div className="flex flex-wrap gap-1">
                  {provider.services.map((service, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 text-xs rounded-full"
                      style={{ backgroundColor: '#E3F2FD', color: '#02276F' }}
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {(formData.alternativeHealthcare.providers[provider.id] || formData.alternativeHealthcare.interests[provider.id]) && (
                <div className="p-3 mt-3 rounded-lg bg-gray-50">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Experience/Notes for {provider.name}
                  </label>
                  <textarea
                    placeholder="Share your experience or what you'd like to know about this modality"
                    value={formData.alternativeHealthcare.previousExperience[provider.id] || ''}
                    onChange={(e) => handleInputChange('alternativeHealthcare', 'previousExperience', {
                      ...formData.alternativeHealthcare.previousExperience,
                      [provider.id]: e.target.value
                    })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 mt-6 rounded-lg bg-green-50">
          <h4 className="mb-2 font-semibold text-green-900">🤝 Professional Network Integration</h4>
          <p className="text-sm text-green-800">
            MediCureOn partners with certified practitioners from all major professional associations. 
            Our AI will match you with qualified providers based on your preferences and location.
          </p>
        </div>
      </div>

      {/* Lifestyle & Habits - Enhanced with Multiple Exercise Routines and Dietary Preferences */}
      <div className="p-6 bg-white border border-gray-100 rounded-xl">
        <div 
          className="px-4 py-2 mb-4 rounded-lg"
          style={{ backgroundColor: '#F1C40F', color: '#02276F' }}
        >
          <h3 className="text-lg font-semibold">🏃‍♀️ Lifestyle & Health Habits</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Smoking */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">🚭 Smoking Status</label>
            <div className="space-y-2">
              <select
                value={formData.lifestyleHabits.smoking.status}
                onChange={(e) => handleInputChange('lifestyleHabits', 'smoking', e.target.value, 'status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="No">Never smoked</option>
                <option value="Former">Former smoker</option>
                <option value="Yes">Current smoker</option>
                <option value="Occasional">Occasional smoker</option>
              </select>
              {(formData.lifestyleHabits.smoking.status === 'Yes' || formData.lifestyleHabits.smoking.status === 'Occasional') && (
                <input
                  type="text"
                  placeholder="Frequency (e.g., 1 pack/day, 5 cigarettes/day)"
                  value={formData.lifestyleHabits.smoking.frequency}
                  onChange={(e) => handleInputChange('lifestyleHabits', 'smoking', e.target.value, 'frequency')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
              {formData.lifestyleHabits.smoking.status === 'Former' && (
                <input
                  type="date"
                  placeholder="Quit date"
                  value={formData.lifestyleHabits.smoking.quitDate}
                  onChange={(e) => handleInputChange('lifestyleHabits', 'smoking', e.target.value, 'quitDate')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          </div>

          {/* Alcohol */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">🍷 Alcohol Consumption</label>
            <div className="space-y-2">
              <select
                value={formData.lifestyleHabits.alcoholConsumption.status}
                onChange={(e) => handleInputChange('lifestyleHabits', 'alcoholConsumption', e.target.value, 'status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="No">Don't drink</option>
                <option value="Occasionally">Occasionally</option>
                <option value="Socially">Socially</option>
                <option value="Regularly">Regularly</option>
                <option value="Daily">Daily</option>
              </select>
              {formData.lifestyleHabits.alcoholConsumption.status !== 'No' && (
                <>
                  <input
                    type="text"
                    placeholder="Frequency (e.g., 2-3 drinks/week, 1 glass wine/day)"
                    value={formData.lifestyleHabits.alcoholConsumption.frequency}
                    onChange={(e) => handleInputChange('lifestyleHabits', 'alcoholConsumption', e.target.value, 'frequency')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={formData.lifestyleHabits.alcoholConsumption.type}
                    onChange={(e) => handleInputChange('lifestyleHabits', 'alcoholConsumption', e.target.value, 'type')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Type of alcohol</option>
                    <option value="Beer">Beer</option>
                    <option value="Wine">Wine</option>
                    <option value="Spirits">Spirits/Liquor</option>
                    <option value="Mixed">Mixed drinks</option>
                    <option value="Various">Various types</option>
                  </select>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Exercise Routines - Multiple Selection */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">💪 Exercise Routines</label>
            <button
              onClick={() => {
                const newRoutine = { type: '', frequency: '', duration: '' };
                setFormData(prev => ({
                  ...prev,
                  lifestyleHabits: {
                    ...prev.lifestyleHabits,
                    exerciseRoutines: [...(prev.lifestyleHabits.exerciseRoutines || []), newRoutine]
                  }
                }));
              }}
              className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
            >
              + Add Exercise Routine
            </button>
          </div>
          
          {(!formData.lifestyleHabits.exerciseRoutines || formData.lifestyleHabits.exerciseRoutines.length === 0) ? (
            <p className="text-sm text-gray-500">No exercise routines added. Click "Add Exercise Routine" to get started.</p>
          ) : (
            <div className="space-y-2">
              {formData.lifestyleHabits.exerciseRoutines.map((routine, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <select
                    value={routine.type || ''}
                    onChange={(e) => {
                      const updated = [...formData.lifestyleHabits.exerciseRoutines];
                      updated[index] = { ...updated[index], type: e.target.value };
                      setFormData(prev => ({
                        ...prev,
                        lifestyleHabits: {
                          ...prev.lifestyleHabits,
                          exerciseRoutines: updated
                        }
                      }));
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select exercise type</option>
                    {exerciseTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <select
                    value={routine.frequency || ''}
                    onChange={(e) => {
                      const updated = [...formData.lifestyleHabits.exerciseRoutines];
                      updated[index] = { ...updated[index], frequency: e.target.value };
                      setFormData(prev => ({
                        ...prev,
                        lifestyleHabits: {
                          ...prev.lifestyleHabits,
                          exerciseRoutines: updated
                        }
                      }));
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Frequency</option>
                    <option value="Daily">Daily</option>
                    <option value="5-6 times/week">5-6 times/week</option>
                    <option value="3-4 times/week">3-4 times/week</option>
                    <option value="1-2 times/week">1-2 times/week</option>
                    <option value="Occasionally">Occasionally</option>
                    <option value="Rarely">Rarely</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Duration (e.g., 30 min)"
                    value={routine.duration || ''}
                    onChange={(e) => {
                      const updated = [...formData.lifestyleHabits.exerciseRoutines];
                      updated[index] = { ...updated[index], duration: e.target.value };
                      setFormData(prev => ({
                        ...prev,
                        lifestyleHabits: {
                          ...prev.lifestyleHabits,
                          exerciseRoutines: updated
                        }
                      }));
                    }}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => {
                      const updated = formData.lifestyleHabits.exerciseRoutines.filter((_, i) => i !== index);
                      setFormData(prev => ({
                        ...prev,
                        lifestyleHabits: {
                          ...prev.lifestyleHabits,
                          exerciseRoutines: updated
                        }
                      }));
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dietary Preferences - Multiple Selection with Checkboxes */}
        <div className="mt-6">
          <label className="block mb-3 text-sm font-medium text-gray-700">🥗 Dietary Preferences (Select all that apply)</label>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
            {[
              'No restrictions', 'Vegetarian', 'Vegan', 'Pescatarian', 
              'Keto', 'Paleo', 'Mediterranean', 'Low-carb', 'Low-fat', 
              'Gluten-free', 'Dairy-free', 'Sugar-free', 'Low-sodium',
              'Intermittent fasting', 'Whole30', 'DASH Diet', 'Anti-inflammatory',
              'Organic only', 'Non-GMO', 'Halal', 'Kosher', 'Other'
            ].map(diet => {
              // Ensure dietaryPreferences is an array
              const currentPreferences = Array.isArray(formData.lifestyleHabits.dietaryPreferences) 
                ? formData.lifestyleHabits.dietaryPreferences 
                : [];
              
              return (
                <label key={diet} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={currentPreferences.includes(diet)}
                    onChange={(e) => {
                      let updated;
                      if (e.target.checked) {
                        // If selecting "No restrictions", clear all others
                        if (diet === 'No restrictions') {
                          updated = ['No restrictions'];
                        } else {
                          // Remove "No restrictions" if selecting any other option
                          updated = [...currentPreferences.filter(d => d !== 'No restrictions'), diet];
                        }
                      } else {
                        updated = currentPreferences.filter(d => d !== diet);
                      }
                      setFormData(prev => ({
                        ...prev,
                        lifestyleHabits: {
                          ...prev.lifestyleHabits,
                          dietaryPreferences: updated
                        }
                      }));
                    }}
                    className="mr-2"
                    style={{ accentColor: '#02276F' }}
                  />
                  <span>{diet}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Sleep Habits - Keep as is */}
        <div className="mt-6">
          <label className="block mb-3 text-sm font-medium text-gray-700">😴 Sleep Habits</label>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block mb-1 text-xs text-gray-600">Hours per night</label>
              <select
                value={formData.lifestyleHabits.sleepHabits.hoursPerNight}
                onChange={(e) => handleInputChange('lifestyleHabits', 'sleepHabits', e.target.value, 'hoursPerNight')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select hours</option>
                <option value="Less than 5">Less than 5</option>
                <option value="5-6">5-6 hours</option>
                <option value="6-7">6-7 hours</option>
                <option value="7-8">7-8 hours</option>
                <option value="8-9">8-9 hours</option>
                <option value="More than 9">More than 9</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-xs text-gray-600">Sleep quality</label>
              <select
                value={formData.lifestyleHabits.sleepHabits.quality}
                onChange={(e) => handleInputChange('lifestyleHabits', 'sleepHabits', e.target.value, 'quality')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select quality</option>
                {sleepQualityOptions.map(quality => (
                  <option key={quality} value={quality}>{quality}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-xs text-gray-600">Typical bedtime</label>
              <input
                type="time"
                value={formData.lifestyleHabits.sleepHabits.bedtime}
                onChange={(e) => handleInputChange('lifestyleHabits', 'sleepHabits', e.target.value, 'bedtime')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-xs text-gray-600">Wake time</label>
              <input
                type="time"
                value={formData.lifestyleHabits.sleepHabits.wakeTime}
                onChange={(e) => handleInputChange('lifestyleHabits', 'sleepHabits', e.target.value, 'wakeTime')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mental Wellness & Stress Levels - Enhanced */}
      <div className="p-6 bg-white border border-gray-100 rounded-xl">
        <div 
          className="px-4 py-2 mb-4 rounded-lg"
          style={{ backgroundColor: '#F1C40F', color: '#02276F' }}
        >
          <h3 className="text-lg font-semibold">🧠 Mental Wellness & Stress Management</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Current Stress Level</label>
            <select
              value={formData.mentalWellness.stressLevels}
              onChange={(e) => handleInputChange('mentalWellness', 'stressLevels', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select stress level</option>
              {stressLevelOptions.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Therapy/Counseling History</label>
            <select
              value={formData.mentalWellness.therapyHistory}
              onChange={(e) => handleInputChange('mentalWellness', 'therapyHistory', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select status</option>
              <option value="Never">Never had therapy</option>
              <option value="Past">Past therapy/counseling</option>
              <option value="Current">Currently in therapy</option>
              <option value="Considering">Considering therapy</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Mood Tracking</label>
            <textarea
              placeholder="Describe your typical mood patterns, emotional wellness, any concerns"
              value={formData.mentalWellness.moodTracking}
              onChange={(e) => handleInputChange('mentalWellness', 'moodTracking', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Meditation & Mindfulness Practices</label>
            <textarea
              placeholder="Describe any meditation, mindfulness, breathing exercises, or stress management techniques you practice"
              value={formData.mentalWellness.meditationPractices}
              onChange={(e) => handleInputChange('mentalWellness', 'meditationPractices', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Data Collection for AI Notice */}
      <div 
        className="p-6 border-2 rounded-xl"
        style={{ backgroundColor: 'rgba(241, 196, 15, 0.1)', borderColor: '#F1C40F' }}
      >
        <h3 className="mb-4 text-lg font-semibold" style={{ color: '#02276F' }}>
          🤖 AI-Powered Lifestyle Optimization
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-start space-x-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: '#F1C40F', color: '#02276F' }}
            >
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Medication Management</h4>
              <p className="text-sm text-gray-600">AI-powered drug interaction checks and dosage optimization</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: '#86B7F7', color: '#02276F' }}
            >
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Lifestyle Recommendations</h4>
              <p className="text-sm text-gray-600">Personalized wellness plans based on your habits and goals</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: '#00FC14', color: '#02276F' }}
            >
              <User className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Alternative Provider Matching</h4>
              <p className="text-sm text-gray-600">Connect with certified alternative healthcare practitioners</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: '#C80C0C', color: 'white' }}
            >
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Holistic Health Integration</h4>
              <p className="text-sm text-gray-600">Traditional + alternative medicine for complete wellness</p>
            </div>
          </div>
        </div>
        <div className="p-3 mt-4 rounded-lg bg-yellow-50">
          <p className="text-sm text-yellow-800">
            💡 <strong>Revolutionary Healthcare:</strong> Your lifestyle and medication data helps our AI create the world's first integrated traditional-alternative healthcare recommendations.
          </p>
        </div>
      </div>
    </div>
  );
};


// Enhanced IoMT Devices Tab Component with Comprehensive Device List + Voice Assistants
const DevicesTab = ({ formData, handleInputChange, addArrayItem, removeArrayItem }) => {
  
  // Handle device connection - USE ONLY THIS ONE
  const handleDeviceConnection = async (deviceKey, isConnected) => {
    if (deviceKey === 'apple' && !isConnected) {
      try {
        // Check if running on mobile (Capacitor)
        if (window.Capacitor && window.Capacitor.isNativePlatform()) {
          // Mobile app - direct connection
          const result = await appleHealthKitService.initialize(formData.userId || 'user123');
          if (result.success) {
            handleInputChange('healthDataSources', 'apple', true);
            alert('Apple Health connected successfully!');
          } else {
            alert(result.message);
          }
        } else {
          // Web browser - show download instructions
          showAppleHealthModal();
        }
      } catch (error) {
        console.error('Failed to connect Apple Health:', error);
        alert('Failed to connect Apple Health. Please try again.');
      }
    } else if (deviceKey === 'apple' && isConnected) {
      // Disconnect
      handleInputChange('healthDataSources', deviceKey, false);
    } else {
      // Handle other devices normally
      handleInputChange('healthDataSources', deviceKey, !isConnected);
    }
  };

  // Show modal for Apple Health connection on web
  // Show modal for Apple Health connection on web
const showAppleHealthModal = () => {
  // Create modal container
  const modalContainer = document.createElement('div');
  modalContainer.id = 'apple-health-modal';
  modalContainer.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;';
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.style.cssText = 'background: white; padding: 2rem; border-radius: 1rem; max-width: 500px; margin: 1rem; position: relative;';
  
  // Create modal HTML
  modalContent.innerHTML = `
    <h2 style="color: #02276F; margin-bottom: 1rem;">Connect Apple Health</h2>
    <p style="margin-bottom: 1rem;">To connect your Apple Health data:</p>
    <ol style="margin-left: 1.5rem; margin-bottom: 1rem;">
      <li>Download the MediCureOn app from the App Store</li>
      <li>Sign in with your account</li>
      <li>Grant health permissions when prompted</li>
      <li>Your data will sync automatically!</li>
    </ol>
    <p style="margin-bottom: 1rem; padding: 1rem; background: #F1C40F; border-radius: 0.5rem;">
      <strong>Coming Soon!</strong> The MediCureOn app is currently in development.
    </p>
    <div style="display: flex; gap: 1rem; justify-content: flex-end;">
      <button id="close-modal-btn" style="padding: 0.5rem 1rem; border: 1px solid #ccc; border-radius: 0.5rem; cursor: pointer;">Close</button>
    </div>
  `;
  
  // Append content to container
  modalContainer.appendChild(modalContent);
  document.body.appendChild(modalContainer);
  
  // Add event listener to close button
  const closeBtn = document.getElementById('close-modal-btn');
  closeBtn.addEventListener('click', () => {
    modalContainer.remove();
  });
  
  // Also close when clicking outside the modal
  modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer) {
      modalContainer.remove();
    }
  });
};
  const deviceCategories = [
    {
      category: "Consumer Smartwatches & Fitness Trackers",
      devices: [
        {
          name: 'Apple Watch',
          company: 'Apple',
          description: 'Apple Watch Series 9/10, Ultra 2 with ECG, HR, SpO₂, sleep tracking, fall detection',
          icon: <Smartphone className="w-6 h-6" />,
          features: ['ECG', 'Heart Rate', 'SpO₂', 'Sleep Tracking', 'Fall Detection', 'Mental Health'],
          integration: 'Apple HealthKit, EHR support',
          connected: formData.healthDataSources.apple,
          key: 'apple',
          status: 'Widely adopted, ideal for iPhone users'
        },
        {
          name: 'Galaxy Watch Series',
          company: 'Samsung',
          description: 'Galaxy Watch 5-7, Ultra, FE with ECG, BP monitoring, body composition',
          icon: <Activity className="w-6 h-6" />,
          features: ['ECG', 'Blood Pressure', 'Body Composition', 'Menstrual Cycle'],
          integration: 'Samsung Health, Natural Cycles',
          connected: formData.healthDataSources.samsung,
          key: 'samsung',
          status: 'Android-friendly predictive wellness'
        },
        {
          name: 'Fitbit',
          company: 'Fitbit (Google)',
          description: 'Versa, Sense, Charge Series with comprehensive health tracking',
          icon: <Heart className="w-6 h-6" />,
          features: ['Heart Rate', 'ECG', 'Sleep', 'Stress', 'SpO₂', 'Temperature'],
          integration: 'Fitbit App, Google Fit',
          connected: formData.healthDataSources.fitbit,
          key: 'fitbit',
          status: 'Chronic care, kids health (Ace LTE)'
        },
        {
          name: 'Garmin',
          company: 'Garmin',
          description: 'Venu, Fenix, Forerunner with advanced fitness metrics',
          icon: <Scale className="w-6 h-6" />,
          features: ['Heart Rate', 'Stress', 'SpO₂', 'Respiration', 'Body Battery™'],
          integration: 'Garmin Connect',
          connected: formData.healthDataSources.garmin,
          key: 'garmin',
          status: 'Fitness + potential clinical use'
        },
        {
          name: 'Withings Complete Health Ecosystem',
          company: 'Withings',
          description: 'BeamO 4-in-1 scanner, Body Scan smart scale, U-Scan Nutrio, ScanWatch, BPMs - 7+ revolutionary devices',
          icon: <Stethoscope className="w-6 h-6" />,
          features: ['BeamO 4-in-1 Scanner', 'Body Scan Scale', 'U-Scan Nutrio', 'ECG', 'SpO₂', 'Blood Pressure', 'Muscle Mass', 'Urine Analysis'],
          integration: 'Withings Health Mate, comprehensive ecosystem',
          connected: formData.healthDataSources.withings,
          key: 'withings',
          status: 'Revolutionary health ecosystem, MediCureOn strategic partner, clinical-grade accuracy'
        },
        {
          name: 'Oura Ring',
          company: 'Oura',
          description: 'Advanced sleep and recovery tracking ring',
          icon: <Droplets className="w-6 h-6" />,
          features: ['HRV', 'Sleep', 'Temperature', 'Recovery Tracking'],
          integration: 'Oura App, 3rd-party APIs',
          connected: formData.healthDataSources.oura,
          key: 'oura',
          status: 'Wellness + potential chronic care'
        }
      ]
    },
    {
      category: "Clinical-Grade Medical Devices",
      devices: [
        {
          name: 'KardiaMobile',
          company: 'AliveCor',
          description: 'Portable ECG device for cardiac monitoring',
          icon: <Heart className="w-6 h-6" />,
          features: ['Cardiac Monitoring', 'Arrhythmia Detection', 'FDA Approved'],
          integration: 'Kardia app',
          connected: formData.healthDataSources.alivecor,
          key: 'alivecor',
          status: 'Remote diagnosis, physician sharing'
        },
        {
          name: 'HeartGuide',
          company: 'Omron',
          description: 'Wearable blood pressure monitor',
          icon: <Activity className="w-6 h-6" />,
          features: ['Blood Pressure', 'Heart Rate', 'Sleep'],
          integration: 'Omron Connect',
          connected: formData.healthDataSources.omron,
          key: 'omron',
          status: 'Hypertension management'
        },
        {
          name: 'Continuous Glucose Monitor',
          company: 'Dexcom',
          description: 'Real-time glucose monitoring system',
          icon: <Droplets className="w-6 h-6" />,
          features: ['Real-time Glucose', 'Trend Alerts', 'Share Data'],
          integration: 'Dexcom app, EHR integration',
          connected: formData.healthDataSources.dexcom,
          key: 'dexcom',
          status: 'Diabetes management, real-time data'
        }
      ]
    },
    {
      category: "Emerging & Specialized Devices",
      devices: [
        {
          name: 'K\'Watch Glucose',
          company: 'PK Vitality',
          description: 'Non-invasive glucose monitoring smartwatch (in development)',
          icon: <Clock className="w-6 h-6" />,
          features: ['Non-invasive Glucose', 'Continuous Monitoring'],
          integration: 'Custom app integration',
          connected: false,
          key: 'pkwatch',
          status: 'Emerging technology, diabetes innovation'
        },
        {
          name: 'Smart Clinical Glasses',
          company: 'Rods & Cones',
          description: 'Smart glasses for remote surgical guidance and telemedicine',
          icon: <Smartphone className="w-6 h-6" />,
          features: ['Remote Guidance', 'Telemedicine', 'Professional Use'],
          integration: 'Professional healthcare platforms',
          connected: false,
          key: 'smartglasses',
          status: 'Professional healthcare, underserved areas'
        }
      ]
    },
    {
      category: "Hospital & Professional Equipment",
      devices: [
        {
          name: 'Smart Hospital Beds',
          company: 'Stryker',
          description: 'ProCuity smart beds with movement monitoring',
          icon: <Activity className="w-6 h-6" />,
          features: ['Movement Monitoring', 'Patient Safety', 'Fall Prevention'],
          integration: 'Hospital management systems',
          connected: false,
          key: 'stryker',
          status: 'Hospital care, movement monitoring'
        },
        {
          name: 'Connected EKGs & Ventilators',
          company: 'Philips',
          description: 'Professional medical equipment for clinical use',
          icon: <Stethoscope className="w-6 h-6" />,
          features: ['Clinical EKGs', 'Ventilator Monitoring', 'Patient Data'],
          integration: 'Clinical information systems',
          connected: false,
          key: 'philips',
          status: 'Clinical use in cardiology, pulmonology'
        },
        {
          name: 'Vitals360',
          company: 'VoCare',
          description: 'Compact multi-vital monitoring device for home use',
          icon: <Heart className="w-6 h-6" />,
          features: ['Multi-vital Monitoring', 'Home-based Care', 'Remote Monitoring'],
          integration: 'Healthcare provider platforms',
          connected: false,
          key: 'vocare',
          status: 'Home-based multi-vital IoMT device'
        }
      ]
    }
  ];

  // Data sync frequency options
  const syncFrequencyOptions = [
    { value: 'realtime', label: 'Real-time (Immediate)' },
    { value: 'every15min', label: 'Every 15 minutes' },
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'manual', label: 'Manual sync only' }
  ];

  // Data retention options
  const retentionOptions = [
    { value: '3months', label: '3 Months' },
    { value: '6months', label: '6 Months' },
    { value: '1year', label: '1 Year' },
    { value: '2years', label: '2 Years' },
    { value: '5years', label: '5 Years' },
    { value: 'indefinite', label: 'Indefinite' }
  ];

  // Enhanced manual device types with VOICE ASSISTANTS
  const manualDeviceTypes = [
    // Voice Assistants & Smart Home Health
    'Amazon Alexa (Echo, Echo Show, Echo Dot)',
    'Google Assistant (Google Home, Nest Hub)',
    'Apple Siri (HomePod, HomePod Mini)',
    'Samsung Bixby (Galaxy Home)',
    'Microsoft Cortana',
    'Smart Home Health Hub',
    // Traditional Medical Devices
    'Blood Pressure Monitor', 
    'Glucose Monitor', 
    'Heart Rate Monitor', 
    'Smart Scale',
    'Sleep Tracker', 
    'Pulse Oximeter', 
    'Smart Thermometer', 
    'Spirometer',
    'Peak Flow Meter', 
    'Smart Inhaler', 
    'Medication Reminder Device',
    'Smart Contact Lenses', 
    'Smart Bandages', 
    'Wearable Insulin Pump',
    'Smart Pills/Sensors', 
    'Posture Monitor', 
    'Stress Monitor',
    // Emerging Voice-Enabled Health Devices
    'Voice-Enabled Health Scanner',
    'Smart Mirror with Health Metrics',
    'Voice-Controlled Medication Dispenser',
    'Smart Speaker with Health Monitoring',
    'Other'
  ];

  return (
    <div className="space-y-6">
      {/* Device Connection Overview */}
      <div className="p-6 bg-white border border-gray-100 rounded-xl">
        <div 
          className="px-4 py-2 mb-4 rounded-lg"
          style={{ backgroundColor: '#F1C40F', color: '#02276F' }}
        >
          <h3 className="text-lg font-semibold">📱 Connected Health Devices & IoMT Integration</h3>
        </div>
        
        <div className="p-4 mb-6 rounded-lg bg-blue-50">
          <h4 className="mb-2 font-semibold text-blue-900">🚀 Comprehensive IoMT Ecosystem</h4>
          <p className="mb-2 text-sm text-blue-800">
            MediCureOn integrates with the most comprehensive range of health devices and medical equipment, 
            from consumer wearables to professional clinical instruments.
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">Consumer Devices</span>
            <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">Clinical Equipment</span>
            <span className="px-2 py-1 text-xs text-purple-800 bg-purple-100 rounded-full">Emerging Tech</span>
            <span className="px-2 py-1 text-xs text-orange-800 bg-orange-100 rounded-full">Professional Tools</span>
            <span className="px-2 py-1 text-xs text-yellow-800 bg-yellow-100 rounded-full">🎤 Voice Assistants</span>
          </div>
        </div>

        {/* Connected Devices Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
          <div className="p-3 text-center rounded-lg bg-green-50">
            <div className="text-2xl font-bold text-green-600">
              {Object.values(formData.healthDataSources).filter(Boolean).length}
            </div>
            <div className="text-sm text-green-800">Connected</div>
          </div>
          <div className="p-3 text-center rounded-lg bg-blue-50">
            <div className="text-2xl font-bold text-blue-600">
              {deviceCategories.reduce((total, category) => total + category.devices.length, 0)}
            </div>
            <div className="text-sm text-blue-800">Available</div>
          </div>
          <div className="p-3 text-center rounded-lg bg-purple-50">
            <div className="text-2xl font-bold text-purple-600">
              {formData.connectedDevices.length}
            </div>
            <div className="text-sm text-purple-800">Manual Devices</div>
          </div>
          <div className="p-3 text-center rounded-lg bg-orange-50">
            <div className="text-2xl font-bold text-orange-600">24/7</div>
            <div className="text-sm text-orange-800">Monitoring</div>
          </div>
        </div>
      </div>

      {/* Device Categories */}
      {deviceCategories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="p-6 bg-white border border-gray-100 rounded-xl">
          <div 
            className="px-4 py-2 mb-4 rounded-lg"
            style={{ 
              backgroundColor: categoryIndex % 2 === 0 ? '#F1C40F' : '#86B7F7', 
              color: '#02276F' 
            }}
          >
            <h3 className="text-lg font-semibold">
              {categoryIndex === 0 && '⌚'} 
              {categoryIndex === 1 && '🏥'} 
              {categoryIndex === 2 && '🔬'} 
              {categoryIndex === 3 && '🏨'} 
              {' '}{category.category}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {category.devices.map((device) => (
              <div 
                key={device.key}
                className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                  device.connected 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div 
                      className={`p-2 rounded-lg ${
                        device.connected ? 'bg-green-100' : 'bg-gray-100'
                      }`}
                      style={{ color: device.connected ? '#00FC14' : '#02276F' }}
                    >
                      {device.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-1 space-x-2">
                        <h4 className="font-semibold text-gray-900">{device.name}</h4>
                        <span className="px-2 py-1 text-xs text-gray-700 bg-gray-200 rounded-full">
                          {device.company}
                        </span>
                      </div>
                      <p className="mb-2 text-sm text-gray-600">{device.description}</p>
                      
                      {/* Features */}
                      <div className="mb-2">
                        <div className="flex flex-wrap gap-1">
                          {device.features.map((feature, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Integration Info */}
                      <p className="mb-1 text-xs text-gray-500">
                        <strong>Integration:</strong> {device.integration}
                      </p>
                      <p className="text-xs text-gray-500">
                        <strong>Status:</strong> {device.status}
                      </p>

                      {device.connected && (
                        <div className="p-2 mt-2 bg-green-100 rounded-lg">
                          <p className="text-sm font-medium text-green-700">✓ Connected & Syncing</p>
                          <p className="text-xs text-green-600">Last sync: 2 minutes ago</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleDeviceConnection(device.key, device.connected)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      device.connected
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'text-white hover:opacity-90'
                    }`}
                    style={{ 
                      backgroundColor: device.connected ? undefined : '#02276F'
                    }}
                  >
                    {device.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Device Data Preferences - Enhanced */}
      <div className="p-6 bg-white border border-gray-100 rounded-xl">
        <div 
          className="px-4 py-2 mb-4 rounded-lg"
          style={{ backgroundColor: '#F1C40F', color: '#02276F' }}
        >
          <h3 className="text-lg font-semibold">⚙️ Data Sync & Privacy Preferences</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Automatic Data Sync</h4>
                <p className="text-sm text-gray-600">Automatically sync new data from connected devices</p>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.devicePreferences.autoSync}
                  onChange={(e) => handleInputChange('devicePreferences', 'autoSync', e.target.checked)}
                  className="mr-2 rounded"
                  style={{ accentColor: '#02276F' }}
                />
                <span className="text-sm">Enable</span>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Share with Healthcare Provider</h4>
                <p className="text-sm text-gray-600">Allow your doctor to access your device data</p>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.devicePreferences.shareWithDoctor}
                  onChange={(e) => handleInputChange('devicePreferences', 'shareWithDoctor', e.target.checked)}
                  className="mr-2 rounded"
                  style={{ accentColor: '#02276F' }}
                />
                <span className="text-sm">Enable</span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Sync Frequency</label>
              <select
                value={formData.devicePreferences.syncFrequency}
                onChange={(e) => handleInputChange('devicePreferences', 'syncFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {syncFrequencyOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Data Retention Period</label>
              <select
                value={formData.devicePreferences.dataRetention}
                onChange={(e) => handleInputChange('devicePreferences', 'dataRetention', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {retentionOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Device Entry - Enhanced with VOICE ASSISTANTS */}
      <div className="p-6 bg-white border border-gray-100 rounded-xl">
        <div 
          className="px-4 py-2 mb-4 rounded-lg"
          style={{ backgroundColor: '#F1C40F', color: '#02276F' }}
        >
          <h3 className="text-lg font-semibold">➕ Manual Device Entry</h3>
        </div>
        
        <div className="p-4 mb-4 border border-yellow-200 rounded-lg bg-yellow-50">
          <h4 className="mb-2 font-semibold text-yellow-900">🎤 Voice Assistant Integration</h4>
          <p className="mb-2 text-sm text-yellow-800">
            Add your voice assistants (Alexa, Google Assistant, Siri) to enable future voice-controlled health queries. 
            Soon you'll be able to ask: <em>"Alexa, what's my latest blood pressure reading?"</em> or 
            <em>"Hey Google, remind me to take my medication."</em>
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">🗣️ Voice Health Queries</span>
            <span className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">📊 Spoken Health Reports</span>
            <span className="px-2 py-1 text-xs text-purple-800 bg-purple-100 rounded-full">⏰ Voice Medication Reminders</span>
          </div>
        </div>
        
        <p className="mb-4 text-sm text-gray-600">
          Add devices not listed above, specialized medical equipment, or voice assistants you use at home or in clinical settings.
        </p>
        
        <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Device Name</label>
            <input
              type="text"
              placeholder="e.g., Amazon Echo Show, Omron BP Monitor"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Device Type</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select type</option>
              {manualDeviceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Manufacturer</label>
            <input
              type="text"
              placeholder="e.g., Amazon, Google, Apple, Omron"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Model Number</label>
            <input
              type="text"
              placeholder="Model/Serial number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            className="px-4 py-2 font-medium text-white transition-all duration-200 rounded-lg hover:opacity-90"
            style={{ backgroundColor: '#02276F' }}
          >
            <Plus className="inline w-4 h-4 mr-2" />
            Add Device
          </button>
        </div>

        {/* Manual Devices List */}
        {formData.connectedDevices.length > 0 && (
          <div className="mt-6">
            <h4 className="mb-3 font-medium text-gray-900">Your Manual Devices</h4>
            <div className="space-y-2">
              {formData.connectedDevices.map((device, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <span className="font-medium">{device.name}</span>
                    <span className="ml-2 text-sm text-gray-600">({device.type})</span>
                  </div>
                  <button
                    onClick={() => removeArrayItem('connectedDevices', null, index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Integration Benefits - Enhanced */}
      <div 
        className="p-6 border-2 rounded-xl"
        style={{ backgroundColor: 'rgba(2, 39, 111, 0.05)', borderColor: '#02276F' }}
      >
        <h3 className="mb-4 text-lg font-semibold" style={{ color: '#02276F' }}>
          🚀 IoMT Integration Benefits
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-start space-x-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: '#F1C40F', color: '#02276F' }}
            >
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Real-time Health Monitoring</h4>
              <p className="text-sm text-gray-600">Continuous tracking of vital signs and health metrics</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: '#86B7F7', color: '#02276F' }}
            >
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Clinical Integration</h4>
              <p className="text-sm text-gray-600">Seamless data sharing with healthcare providers</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: '#00FC14', color: '#02276F' }}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Early Warning System</h4>
              <p className="text-sm text-gray-600">AI-powered alerts for health anomalies</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: '#C80C0C', color: 'white' }}
            >
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">HIPAA Compliant</h4>
              <p className="text-sm text-gray-600">Enterprise-grade security and privacy</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: '#9C27B0', color: 'white' }}
            >
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Predictive Analytics</h4>
              <p className="text-sm text-gray-600">Machine learning for health trend prediction</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: '#FF9800', color: 'white' }}
            >
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Personalized Care</h4>
              <p className="text-sm text-gray-600">Tailored recommendations based on device data</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 mt-6 rounded-lg bg-blue-50">
          <h4 className="mb-2 font-semibold text-blue-900">🌐 Global Healthcare Innovation</h4>
          <p className="text-sm text-blue-800">
            MediCureOn's comprehensive IoMT integration enables the world's most advanced 
            personalized healthcare platform, combining consumer devices with clinical-grade 
            equipment for unprecedented health insights.
          </p>
        </div>

        <div className="p-4 mt-4 rounded-lg bg-green-50">
          <h4 className="mb-2 font-semibold text-green-900">🔬 AI Training & Data Science</h4>
          <p className="text-sm text-green-800">
            Your device data helps train our AI models to provide better predictions, 
            early warning systems, and personalized health recommendations for millions of users worldwide.
          </p>
        </div>

        {/* NEW: Voice Assistant Future Features */}
        <div className="p-4 mt-4 border border-yellow-200 rounded-lg bg-yellow-50">
          <h4 className="mb-2 font-semibold text-yellow-900">🎤 Future Voice Health Features</h4>
          <p className="mb-2 text-sm text-yellow-800">
            With voice assistants connected to your MediCureOn profile, you'll soon be able to:
          </p>
          <ul className="space-y-1 text-sm text-yellow-800">
            <li>• <strong>"Alexa, what's my latest health summary?"</strong> - Get spoken health reports</li>
            <li>• <strong>"Hey Google, remind me to take my blood pressure medication"</strong> - Voice medication management</li>
            <li>• <strong>"Siri, log my blood sugar reading as 120"</strong> - Voice data entry</li>
            <li>• <strong>"Alexa, schedule my next doctor appointment"</strong> - Healthcare scheduling</li>
            <li>• <strong>"Hey Google, how am I doing with my fitness goals?"</strong> - Progress tracking</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Export the ProfileManager component
export default ProfileManager;