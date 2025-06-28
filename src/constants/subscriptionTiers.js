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
