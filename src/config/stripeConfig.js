// MediCureOn-Frontend/src/config/stripeConfig.js

const isTestMode = process.env.REACT_APP_STRIPE_TEST_MODE === 'true';

export const stripeConfig = {
  // Current mode
  testMode: isTestMode,
  
  // Publishable key (public - safe to expose)
  publishableKey: isTestMode 
    ? process.env.REACT_APP_STRIPE_TEST_PUBLISHABLE_KEY || 'pk_test_51PW5hwEofMou0f6vjFgmFyvGTvwnODCsZueCtSnRgyPp4Mn6cE1TC7AEN9e5L3D5iOPt4w86i7GJtrpG5oQoJHOb00mHbxOmdh'
    : process.env.REACT_APP_STRIPE_LIVE_PUBLISHABLE_KEY,
  
  // Product IDs
  products: {
    standard: isTestMode
      ? process.env.REACT_APP_STRIPE_TEST_STANDARD_PRODUCT_ID || 'prod_SVpweqIKJ9yhNO'    
      : process.env.REACT_APP_STRIPE_LIVE_STANDARD_PRODUCT_ID || 'prod_SVlm4inBMzipU1',
    
    silver: isTestMode
      ? process.env.REACT_APP_STRIPE_TEST_SILVER_PRODUCT_ID || 'prod_SVpycqflB4nmbi'
      : process.env.REACT_APP_STRIPE_LIVE_SILVER_PRODUCT_ID || 'prod_SVlvVV2Gx68jCW',
    
    gold: isTestMode
      ? process.env.REACT_APP_STRIPE_TEST_GOLD_PRODUCT_ID || 'prod_SVq04VfxneE8DV'
      : process.env.REACT_APP_STRIPE_LIVE_GOLD_PRODUCT_ID || 'prod_SVlxWadp5GcPuq',
    
    platinum: isTestMode
      ? process.env.REACT_APP_STRIPE_TEST_PLATINUM_PRODUCT_ID || 'prod_SVq3KbbAXHdVTL'
      : process.env.REACT_APP_STRIPE_LIVE_PLATINUM_PRODUCT_ID || 'prod_SVlyZ3BJ32Tos4'
  },
  
  // Subscription details
  subscriptions: {
    standard: {
      name: 'Standard',
      price: 12,
      interval: 'year',
      features: ['1 Healthcare Plan', '2 Devices']
    },
    silver: {
      name: 'Silver', 
      price: 36,
      interval: 'year',
      features: ['2 Healthcare Plans', '5 Devices']
    },
    gold: {
      name: 'Gold',
      price: 60,
      interval: 'year',
      features: ['8 Healthcare Plans', 'Unlimited Devices']
    },
    platinum: {
      name: 'Platinum',
      price: 120,
      interval: 'year',
      features: ['Unlimited Healthcare Plans', 'Unlimited Devices']
    }
  }
};

// Helper function to get product ID by tier name
export const getProductId = (tier) => {
  return stripeConfig.products[tier.toLowerCase()];
};

// Helper function to check if in test mode
export const isStripeTestMode = () => {
  return stripeConfig.testMode;
};