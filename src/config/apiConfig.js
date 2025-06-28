// =============================================
// API Configuration for MediCureOn
// Backend and external service endpoints
// =============================================

export const apiConfig = {
  // Azure Function App URL
  backendUrl: "https://medicureon-app-api.azurewebsites.net",
  
  // Your Function Keys
  functionKeys: {
    health: "or0Gx2cWyzvGCv-2A8aq6dtNELF5c3d-_DsCkUJ1aLNSAzFuGfFmiQ==",
    profileGet: "QXR1Kn-EvcrrbrvHIgCUPWFFHNALcvmMQXKxF1XHsi18AzFuUafBRw==",
    profileUpdate: "GHqPIhBN1foEaEes--LIMAS8veji9TYMHI28XTW6Kpr8AzFuG7GZNw==",
    profilePicture: "8G52jO7IxbnQSwyRE_w6Bs8QWWEzTqGnKxjLP6kHDesCAzFujq9JHA==",
    createCheckoutSession: "nNtAsgHBWDH1bg-bsOFfoJFd4iUBLq16gbLfkF6V8o3pAzFuX9jpQw==",
    checkSubscriptionStatus: "eHh14ElI14vzccqjOtaeFJrw1VCjf5IXtYXBu5zoEOEuAzFu77_lmw==",
    saveSubscription: "s3_ECo4iyQcMFDU1v6w6ue73c7bUYn-EIMRNze0kACfZAzFuFi352A==",
    enrollInPlan: "H8NKGodW2BKUw5r9WXatmGLybOrkIyi_wW9TIvU-YpfRAzFuajKk-A==",
    retrieveCheckoutSession: "Z6dPkafK833f4UUpBAdOGs8rQfui1HOWC9GBdfs5i7k4AzFuZDbJ6w==",
    unenrollFromPlan: "FNuK90uYL0C_66Jt8brFbDKZsTRnDr0w_LVkxUImq-NIAzFuldpteA==",
    // Add these when you get the function keys from Azure Portal
    iomtDataSave: "4JTTDVg3nbWJzJwQWuXSeB3V_G8hyXL3Vs47MZjb0BqXAzFuvDGFBQ==",
    iomtDataGet: "y1iSLPBYfza3MxF2idY4Ev_eOfqvnWYDL3E_Z3OYFveHAzFuaf1thA=="  
  },
  
  // Endpoints matching your Azure Functions
  endpoints: {
    // Health check
    health: "/api/health",
    
    // Profile endpoints
    profile: "/api/profile",
    profiles: {
      get: (userId) => `/api/profiles/${userId}`,
      update: (userId) => `/api/profiles/${userId}`,
      picture: (userId) => `/api/profiles/${userId}/picture`
    },
    
    // IoMT data endpoints (NEW)
    iomt: {
      save: (userId) => `/api/iomt/${userId}`,
      get: (userId) => `/api/iomt/${userId}`
    },
    
    // Subscription endpoints
    subscription: {
      check: (userId) => `/api/subscriptions/${userId}`,
      save: "/api/save-subscription",
      enrollPlan: "/api/enroll-in-plan",
      unenrollPlan: (userId, planId) => `/api/plans/${userId}/${planId}`
    },
    
    // Payment endpoints
    payments: {
      createCheckout: "/api/create-checkout-session",
      webhook: "/api/stripe-webhook"
    },
    
    // Future endpoints
    healthData: "/api/health-data",
    crypto: "/api/crypto-payments"
  }
};

// Complete Country to Region Mapping - All 195 countries
export const countryToRegion = {
  // US Region (Americas, Africa, Middle East + default) - 115 countries
  "United States": "US",
  "Canada": "US",
  "Mexico": "US",
  "Guatemala": "US",
  "Belize": "US",
  "El Salvador": "US",
  "Honduras": "US",
  "Nicaragua": "US",
  "Costa Rica": "US",
  "Panama": "US",
  "Cuba": "US",
  "Jamaica": "US",
  "Haiti": "US",
  "Dominican Republic": "US",
  "Puerto Rico": "US",
  "Trinidad and Tobago": "US",
  "Barbados": "US",
  "Saint Lucia": "US",
  "Saint Vincent and the Grenadines": "US",
  "Grenada": "US",
  "Antigua and Barbuda": "US",
  "Dominica": "US",
  "Saint Kitts and Nevis": "US",
  "Bahamas": "US",
  "Brazil": "US",
  "Argentina": "US",
  "Chile": "US",
  "Uruguay": "US",
  "Paraguay": "US",
  "Bolivia": "US",
  "Peru": "US",
  "Ecuador": "US",
  "Colombia": "US",
  "Venezuela": "US",
  "Guyana": "US",
  "Suriname": "US",
  "French Guiana": "US",
  
  // African countries
  "Egypt": "US",
  "Libya": "US",
  "Tunisia": "US",
  "Algeria": "US",
  "Morocco": "US",
  "Sudan": "US",
  "South Sudan": "US",
  "Ethiopia": "US",
  "Eritrea": "US",
  "Djibouti": "US",
  "Somalia": "US",
  "Kenya": "US",
  "Uganda": "US",
  "Tanzania": "US",
  "Rwanda": "US",
  "Burundi": "US",
  "Democratic Republic of Congo": "US",
  "Republic of Congo": "US",
  "Central African Republic": "US",
  "Cameroon": "US",
  "Chad": "US",
  "Niger": "US",
  "Nigeria": "US",
  "Benin": "US",
  "Togo": "US",
  "Ghana": "US",
  "Burkina Faso": "US",
  "Mali": "US",
  "Senegal": "US",
  "Mauritania": "US",
  "Gambia": "US",
  "Guinea-Bissau": "US",
  "Guinea": "US",
  "Sierra Leone": "US",
  "Liberia": "US",
  "Ivory Coast": "US",
  "Cape Verde": "US",
  "São Tomé and Príncipe": "US",
  "Equatorial Guinea": "US",
  "Gabon": "US",
  "Angola": "US",
  "Zambia": "US",
  "Malawi": "US",
  "Mozambique": "US",
  "Zimbabwe": "US",
  "Botswana": "US",
  "Namibia": "US",
  "South Africa": "US",
  "Lesotho": "US",
  "Eswatini": "US",
  "Madagascar": "US",
  "Mauritius": "US",
  "Seychelles": "US",
  "Comoros": "US",
  
  // Middle East
  "Saudi Arabia": "US",
  "Yemen": "US",
  "Oman": "US",
  "United Arab Emirates": "US",
  "Qatar": "US",
  "Bahrain": "US",
  "Kuwait": "US",
  "Iraq": "US",
  "Syria": "US",
  "Lebanon": "US",
  "Jordan": "US",
  "Israel": "US",
  "Palestine": "US",
  "Iran": "US",
  "Turkey": "US",
  "Georgia": "US",
  "Armenia": "US",
  "Azerbaijan": "US",
  
  // EU Region (Europe - GDPR compliance) - 44 countries
  "Austria": "EU",
  "Belgium": "EU",
  "Bulgaria": "EU",
  "Croatia": "EU",
  "Cyprus": "EU",
  "Czech Republic": "EU",
  "Denmark": "EU",
  "Estonia": "EU",
  "Finland": "EU",
  "France": "EU",
  "Germany": "EU",
  "Greece": "EU",
  "Hungary": "EU",
  "Ireland": "EU",
  "Italy": "EU",
  "Latvia": "EU",
  "Lithuania": "EU",
  "Luxembourg": "EU",
  "Malta": "EU",
  "Netherlands": "EU",
  "Poland": "EU",
  "Portugal": "EU",
  "Romania": "EU",
  "Slovakia": "EU",
  "Slovenia": "EU",
  "Spain": "EU",
  "Sweden": "EU",
  "United Kingdom": "EU",
  "Norway": "EU",
  "Switzerland": "EU",
  "Iceland": "EU",
  "Liechtenstein": "EU",
  "Monaco": "EU",
  "San Marino": "EU",
  "Vatican City": "EU",
  "Andorra": "EU",
  "Serbia": "EU",
  "Montenegro": "EU",
  "North Macedonia": "EU",
  "Albania": "EU",
  "Bosnia and Herzegovina": "EU",
  "Kosovo": "EU",
  "Moldova": "EU",
  "Ukraine": "EU",
  "Belarus": "EU",
  "Russia": "EU",
  
  // APAC Region (Asia-Pacific) - 36 countries
  "Afghanistan": "APAC",
  "Pakistan": "APAC",
  "India": "APAC",
  "Bangladesh": "APAC",
  "Sri Lanka": "APAC",
  "Nepal": "APAC",
  "Bhutan": "APAC",
  "Maldives": "APAC",
  "Myanmar": "APAC",
  "Thailand": "APAC",
  "Laos": "APAC",
  "Cambodia": "APAC",
  "Vietnam": "APAC",
  "Malaysia": "APAC",
  "Singapore": "APAC",
  "Indonesia": "APAC",
  "Philippines": "APAC",
  "Brunei": "APAC",
  "East Timor": "APAC",
  "China": "APAC",
  "Mongolia": "APAC",
  "North Korea": "APAC",
  "South Korea": "APAC",
  "Japan": "APAC",
  "Taiwan": "APAC",
  "Hong Kong": "APAC",
  "Macau": "APAC",
  "Australia": "APAC",
  "New Zealand": "APAC",
  "Fiji": "APAC",
  "Papua New Guinea": "APAC",
  "Solomon Islands": "APAC",
  "Vanuatu": "APAC",
  "Samoa": "APAC",
  "Tonga": "APAC",
  "Tuvalu": "APAC",
  "Kiribati": "APAC",
  "Nauru": "APAC",
  "Palau": "APAC",
  "Marshall Islands": "APAC",
  "Micronesia": "APAC",
  
  // Central Asian countries (could go to APAC or US, defaulting to US)
  "Kazakhstan": "US",
  "Uzbekistan": "US",
  "Kyrgyzstan": "US",
  "Tajikistan": "US",
  "Turkmenistan": "US"
};

// Helper function to get region from country
export const getRegionFromCountry = (country) => {
  return countryToRegion[country] || "US";
};