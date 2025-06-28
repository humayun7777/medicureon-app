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
