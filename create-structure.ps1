# =============================================
# MediCureOn Enhanced Folder Structure Script
# Creates complete project structure with crypto payments
# =============================================

Write-Host "🏥 Creating MediCureOn Enhanced Folder Structure" -ForegroundColor Blue
Write-Host "=================================================" -ForegroundColor Blue

# Check if we're in the right directory
if (!(Test-Path "src")) {
    Write-Host "❌ Error: Please run this script from the medicureon-frontend directory" -ForegroundColor Red
    Write-Host "Run: cd medicureon-frontend" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Creating enhanced folder structure..." -ForegroundColor Green

# Create main component directories
Write-Host "📁 Creating component directories..." -ForegroundColor Cyan

# Authentication components
New-Item -Path "src\components\auth" -ItemType Directory -Force | Out-Null
Write-Host "  ✅ src\components\auth" -ForegroundColor Green

# Dashboard components  
New-Item -Path "src\components\dashboard" -ItemType Directory -Force | Out-Null
Write-Host "  ✅ src\components\dashboard" -ForegroundColor Green

# Profile management (4 tabs)
New-Item -Path "src\components\profile" -ItemType Directory -Force | Out-Null
Write-Host "  ✅ src\components\profile" -ForegroundColor Green

# Healthcare plans (10 cards)
New-Item -Path "src\components\plans" -ItemType Directory -Force | Out-Null
Write-Host "  ✅ src\components\plans" -ForegroundColor Green

# Subscription plans (4 tiers)
New-Item -Path "src\components\subscription" -ItemType Directory -Force | Out-Null
Write-Host "  ✅ src\components\subscription" -ForegroundColor Green

# Payment systems with crypto integration
New-Item -Path "src\components\payments" -ItemType Directory -Force | Out-Null
New-Item -Path "src\components\payments\stripe" -ItemType Directory -Force | Out-Null
New-Item -Path "src\components\payments\crypto" -ItemType Directory -Force | Out-Null
New-Item -Path "src\components\payments\billing" -ItemType Directory -Force | Out-Null
New-Item -Path "src\components\payments\discounts" -ItemType Directory -Force | Out-Null
Write-Host "  ✅ src\components\payments (with crypto integration)" -ForegroundColor Green

# Shared components
New-Item -Path "src\components\shared" -ItemType Directory -Force | Out-Null
Write-Host "  ✅ src\components\shared" -ForegroundColor Green

# Charts components for health data
New-Item -Path "src\components\charts" -ItemType Directory -Force | Out-Null
Write-Host "  ✅ src\components\charts" -ForegroundColor Green

# Configuration directories
Write-Host "📁 Creating configuration directories..." -ForegroundColor Cyan
New-Item -Path "src\config" -ItemType Directory -Force | Out-Null
Write-Host "  ✅ src\config" -ForegroundColor Green

# Services for API calls
Write-Host "📁 Creating services directories..." -ForegroundColor Cyan
New-Item -Path "src\services" -ItemType Directory -Force | Out-Null
Write-Host "  ✅ src\services" -ForegroundColor Green

# Custom hooks
Write-Host "📁 Creating hooks directories..." -ForegroundColor Cyan
New-Item -Path "src\hooks" -ItemType Directory -Force | Out-Null
Write-Host "  ✅ src\hooks" -ForegroundColor Green

# Utility functions
Write-Host "📁 Creating utils directories..." -ForegroundColor Cyan
New-Item -Path "src\utils" -ItemType Directory -Force | Out-Null
Write-Host "  ✅ src\utils" -ForegroundColor Green

# Constants and data
Write-Host "📁 Creating constants directories..." -ForegroundColor Cyan
New-Item -Path "src\constants" -ItemType Directory -Force | Out-Null
Write-Host "  ✅ src\constants" -ForegroundColor Green

# Type definitions
Write-Host "📁 Creating types directories..." -ForegroundColor Cyan
New-Item -Path "src\types" -ItemType Directory -Force | Out-Null
Write-Host "  ✅ src\types" -ForegroundColor Green

# Assets
Write-Host "📁 Creating assets directories..." -ForegroundColor Cyan
New-Item -Path "src\assets\images\logo" -ItemType Directory -Force | Out-Null
New-Item -Path "src\assets\images\healthcare-plans" -ItemType Directory -Force | Out-Null
New-Item -Path "src\assets\images\crypto-icons" -ItemType Directory -Force | Out-Null
New-Item -Path "src\assets\images\backgrounds" -ItemType Directory -Force | Out-Null
New-Item -Path "src\assets\icons" -ItemType Directory -Force | Out-Null
New-Item -Path "src\assets\fonts" -ItemType Directory -Force | Out-Null
Write-Host "  ✅ src\assets (with crypto icons)" -ForegroundColor Green

# Styles
Write-Host "📁 Creating styles directories..." -ForegroundColor Cyan
New-Item -Path "src\styles" -ItemType Directory -Force | Out-Null
Write-Host "  ✅ src\styles" -ForegroundColor Green

Write-Host "`n🎯 Creating essential configuration files..." -ForegroundColor Yellow

# Create MSAL authentication config
@"
// =============================================
// MSAL Configuration for MediCureOn
// Your specific Entra External ID configuration
// =============================================

export const msalConfig = {
  auth: {
    clientId: "6e193dab-52c6-4dd6-95dd-abfb09d15d06",
    authority: "https://medicureoniam.b2clogin.com/medicureoniam.onmicrosoft.com/B2C_1_MediCureOn_SignUpSignIn",
    knownAuthorities: ["medicureoniam.b2clogin.com"],
    redirectUri: process.env.NODE_ENV === 'production' 
      ? "https://medicureon-dev-webapp.azurestaticapps.net/"
      : "http://localhost:3000/",
    postLogoutRedirectUri: process.env.NODE_ENV === 'production'
      ? "https://www.medicureon.com"
      : "http://localhost:3000/"
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  }
};

export const loginRequest = {
  scopes: ["openid", "profile", "email"]
};
"@ | Out-File -FilePath "src\config\authConfig.js" -Encoding UTF8

Write-Host "  ✅ Created authConfig.js" -ForegroundColor Green

# Create API configuration
@"
// =============================================
// API Configuration for MediCureOn
// Backend and external service endpoints
// =============================================

export const apiConfig = {
  backendUrl: process.env.NODE_ENV === 'production'
    ? "https://medicureon-dev-functions.azurewebsites.net"
    : "http://localhost:7071",
  endpoints: {
    profile: "/api/profile",
    subscription: "/api/subscription",
    healthData: "/api/health-data",
    payments: "/api/payments",
    crypto: "/api/crypto-payments"
  }
};
"@ | Out-File -FilePath "src\config\apiConfig.js" -Encoding UTF8

Write-Host "  ✅ Created apiConfig.js" -ForegroundColor Green

# Create crypto configuration
@"
// =============================================
// Cryptocurrency Configuration for MediCureOn
// Ethereum token and wallet integration
// =============================================

export const cryptoConfig = {
  // Your Ethereum token details
  token: {
    name: "MediCureOn Token",
    symbol: "MDCR", // Replace with your actual token symbol
    contractAddress: "0x...", // Replace with your actual contract address
    decimals: 18,
    network: "ethereum" // or "polygon", "bsc", etc.
  },
  
  // Supported wallets
  wallets: {
    metamask: true,
    walletconnect: true,
    coinbaseWallet: true
  },
  
  // Discount rates for crypto payments
  discounts: {
    tokenPayment: 0.15, // 15% discount for token payments
    ethPayment: 0.10,   // 10% discount for ETH payments
    minimumDiscount: 5  // Minimum $5 discount
  },
  
  // Network configuration
  networks: {
    ethereum: {
      chainId: 1,
      name: "Ethereum Mainnet",
      rpcUrl: "https://mainnet.infura.io/v3/YOUR_PROJECT_ID"
    },
    polygon: {
      chainId: 137,
      name: "Polygon",
      rpcUrl: "https://polygon-mainnet.infura.io/v3/YOUR_PROJECT_ID"
    }
  }
};
"@ | Out-File -FilePath "src\config\cryptoConfig.js" -Encoding UTF8

Write-Host "  ✅ Created cryptoConfig.js" -ForegroundColor Green

# Create Stripe configuration
@"
// =============================================
// Stripe Configuration for MediCureOn
// Payment processing setup
// =============================================

export const stripeConfig = {
  publishableKey: process.env.NODE_ENV === 'production'
    ? "pk_live_..." // Replace with your live key
    : "pk_test_...", // Replace with your test key
    
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#3f2381', // MediCureOn primary color
      colorBackground: '#ffffff',
      colorText: '#1e293b'
    }
  }
};
"@ | Out-File -FilePath "src\config\stripeConfig.js" -Encoding UTF8

Write-Host "  ✅ Created stripeConfig.js" -ForegroundColor Green

# Create constants for healthcare plans
@"
// =============================================
// Healthcare Plans Data
// 10 healthcare service plans
// =============================================

export const healthcarePlans = [
  {
    id: 'primary-care',
    name: 'Primary Care Plus',
    category: 'General Health',
    price: 99,
    duration: 'per visit',
    description: 'Comprehensive primary care with same-day appointments',
    features: ['Same-day appointments', 'Comprehensive exams', 'Basic lab work', 'Prescription management'],
    popular: false
  },
  {
    id: 'telemedicine',
    name: 'Virtual Care 24/7',
    category: 'Telehealth',
    price: 49,
    duration: 'per consultation',
    description: '24/7 virtual consultations with licensed physicians',
    features: ['24/7 availability', 'Video consultations', 'Prescription delivery', 'Follow-up care'],
    popular: true
  },
  {
    id: 'specialist-care',
    name: 'Specialist Network',
    category: 'Specialty Care',
    price: 199,
    duration: 'per visit',
    description: 'Access to top specialists in various medical fields',
    features: ['Cardiology', 'Dermatology', 'Endocrinology', 'Fast appointments'],
    popular: false
  },
  {
    id: 'mental-health',
    name: 'Mental Wellness',
    category: 'Mental Health',
    price: 129,
    duration: 'per session',
    description: 'Comprehensive mental health support and therapy',
    features: ['Licensed therapists', 'Psychiatry services', 'Group therapy', 'Crisis support'],
    popular: false
  },
  {
    id: 'preventive-care',
    name: 'Preventive Health',
    category: 'Prevention',
    price: 79,
    duration: 'per screening',
    description: 'Comprehensive preventive care and health screenings',
    features: ['Annual physicals', 'Cancer screenings', 'Vaccinations', 'Health coaching'],
    popular: false
  },
  {
    id: 'womens-health',
    name: "Women's Health Pro",
    category: "Women's Health",
    price: 149,
    duration: 'per visit',
    description: 'Specialized care for women at every life stage',
    features: ['Gynecology', 'Prenatal care', 'Fertility services', 'Mammograms'],
    popular: false
  },
  {
    id: 'urgent-care',
    name: 'Urgent Care Express',
    category: 'Urgent Care',
    price: 89,
    duration: 'per visit',
    description: 'Fast treatment for non-emergency medical needs',
    features: ['No appointment needed', 'X-rays available', 'Minor procedures', 'Fast service'],
    popular: false
  },
  {
    id: 'chronic-care',
    name: 'Chronic Disease Management',
    category: 'Chronic Care',
    price: 179,
    duration: 'per month',
    description: 'Ongoing management of chronic health conditions',
    features: ['Diabetes management', 'Hypertension care', 'Regular monitoring', 'Care coordination'],
    popular: true
  },
  {
    id: 'executive-health',
    name: 'Executive Health Package',
    category: 'Premium Care',
    price: 399,
    duration: 'per package',
    description: 'Comprehensive health package for busy executives',
    features: ['Full body scan', 'Executive physical', 'Concierge service', 'Same-day results'],
    popular: false
  },
  {
    id: 'family-care',
    name: 'Family Care Bundle',
    category: 'Family Health',
    price: 249,
    duration: 'per family/month',
    description: 'Complete healthcare coverage for the entire family',
    features: ['All family members', 'Pediatric care', 'Adult care', 'Dental included'],
    popular: true
  }
];
"@ | Out-File -FilePath "src\constants\healthPlans.js" -Encoding UTF8

Write-Host "  ✅ Created healthPlans.js (10 healthcare plans)" -ForegroundColor Green

# Create subscription tiers
@"
// =============================================
// Subscription Tiers Data
// 4 subscription plans for healthcare access
// =============================================

export const subscriptionTiers = [
  {
    id: 'standard',
    name: 'Standard',
    subtitle: 'Essential healthcare access',
    price: {
      monthly: 9.99,
      yearly: 99.99
    },
    color: 'blue',
    features: [
      'Access to 3 healthcare plans',
      'Basic health tracking',
      'Email support',
      'Mobile app access',
      'Monthly health reports'
    ],
    limitations: [
      'Limited plan selection',
      'Basic support only'
    ],
    popular: false
  },
  {
    id: 'silver',
    name: 'Silver',
    subtitle: 'Enhanced healthcare management',
    price: {
      monthly: 19.99,
      yearly: 199.99
    },
    color: 'gray',
    features: [
      'Access to 6 healthcare plans',
      'Advanced health analytics',
      'Priority email support',
      'Telemedicine access',
      'Weekly health insights'
    ],
    limitations: [
      'Limited premium features'
    ],
    popular: false
  },
  {
    id: 'gold',
    name: 'Gold',
    subtitle: 'Comprehensive healthcare platform',
    price: {
      monthly: 39.99,
      yearly: 399.99
    },
    color: 'yellow',
    features: [
      'Access to ALL 10 healthcare plans',
      'Unlimited telemedicine',
      'Live chat support',
      'Family health management',
      'AI-powered health insights',
      'Crypto payment discounts'
    ],
    limitations: [],
    popular: true
  },
  {
    id: 'platinum',
    name: 'Platinum',
    subtitle: 'Premium healthcare experience',
    price: {
      monthly: 79.99,
      yearly: 799.99
    },
    color: 'purple',
    features: [
      'Everything in Gold',
      'Dedicated health advisor',
      '24/7 concierge support',
      'Executive health packages',
      'Global healthcare access',
      'Maximum crypto discounts',
      'VIP specialist access'
    ],
    limitations: [],
    popular: false
  }
];
"@ | Out-File -FilePath "src\constants\subscriptionTiers.js" -Encoding UTF8

Write-Host "  ✅ Created subscriptionTiers.js (4 subscription plans)" -ForegroundColor Green

# Create crypto tokens constants
@"
// =============================================
// Cryptocurrency Token Information
// Your Ethereum token details and supported cryptos
// =============================================

export const cryptoTokens = {
  // Your primary token
  medicureToken: {
    name: "MediCureOn Token",
    symbol: "MDCR", // Replace with your actual symbol
    contractAddress: "0x...", // Replace with your contract address
    decimals: 18,
    network: "ethereum",
    icon: "/assets/images/crypto-icons/mdcr-token.png",
    discountRate: 0.15 // 15% discount
  },
  
  // Supported cryptocurrencies
  supportedTokens: [
    {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      icon: "/assets/images/crypto-icons/eth.png",
      discountRate: 0.10 // 10% discount
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      contractAddress: "0xA0b86a33E6A1B1Cf95d8a9F4f7A3d8D7E3C9B5F7",
      decimals: 6,
      icon: "/assets/images/crypto-icons/usdc.png",
      discountRate: 0.05 // 5% discount
    }
  ]
};
"@ | Out-File -FilePath "src\constants\cryptoTokens.js" -Encoding UTF8

Write-Host "  ✅ Created cryptoTokens.js (your crypto configuration)" -ForegroundColor Green

# Update Tailwind config with MediCureOn colors
$tailwindConfig = @"
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'medicure': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          primary: '#3f2381',
          secondary: '#b2b423',
          accent: '#122c60',
        },
        'healthcare': {
          blue: '#0ea5e9',
          green: '#10b981',
          purple: '#6366f1',
        },
        'crypto': {
          gold: '#f59e0b',
          bitcoin: '#f7931a',
          ethereum: '#627eea'
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-medicure': 'linear-gradient(135deg, #3f2381 0%, #122c60 100%)',
        'gradient-healthcare': 'linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)',
        'gradient-crypto': 'linear-gradient(135deg, #f59e0b 0%, #f7931a 100%)'
      }
    },
  },
  plugins: [],
}
"@

$tailwindConfig | Out-File -FilePath "tailwind.config.js" -Encoding UTF8 -Force
Write-Host "  ✅ Updated tailwind.config.js with crypto colors" -ForegroundColor Green

Write-Host "`n🎉 Enhanced Folder Structure Created Successfully!" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Blue

Write-Host "`n📁 Created Directories:" -ForegroundColor Yellow
Write-Host "  🔐 Authentication components" -ForegroundColor White
Write-Host "  🏠 Dashboard with health charts" -ForegroundColor White
Write-Host "  👤 Profile management (4 tabs)" -ForegroundColor White
Write-Host "  🏥 Healthcare plans (10 cards)" -ForegroundColor White
Write-Host "  💳 Subscription plans (4 tiers)" -ForegroundColor White
Write-Host "  💰 Payment systems (Stripe + Crypto)" -ForegroundColor White
Write-Host "  🪙 Cryptocurrency integration" -ForegroundColor White
Write-Host "  📊 Chart components (Recharts)" -ForegroundColor White
Write-Host "  🔧 Configuration, services, hooks, utils" -ForegroundColor White

Write-Host "`n🎯 Ready for Phase 2C: Component Development!" -ForegroundColor Cyan
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Build Landing Dashboard with health charts" -ForegroundColor White
Write-Host "  2. Create Profile Management (4-tab system)" -ForegroundColor White
Write-Host "  3. Design Healthcare Plans (10 beautiful cards)" -ForegroundColor White
Write-Host "  4. Implement Subscription Plans with crypto payments" -ForegroundColor White

Write-Host "`n🚀 Your healthcare platform with crypto innovation is ready!" -ForegroundColor Green