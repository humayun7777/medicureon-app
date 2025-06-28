// src/components/plans/HealthcarePlans.jsx
import React, { useState, useEffect } from 'react';
// Import plan icons
import weightLossIcon from '../../assets/icons/plans/plan01.png';
import diabetesIcon from '../../assets/icons/plans/plan02.png';
import heartHealthIcon from '../../assets/icons/plans/plan03.png';
import sleepIcon from '../../assets/icons/plans/plan04.png';
import stressIcon from '../../assets/icons/plans/plan05.png';
import nutritionIcon from '../../assets/icons/plans/plan06.png';
import respiratoryIcon from '../../assets/icons/plans/plan07.png';
import womensHealthIcon from '../../assets/icons/plans/plan08.png';
import recoveryIcon from '../../assets/icons/plans/plan09.png';
import preventiveIcon from '../../assets/icons/plans/plan10.png';
import { 
  Shield, 
  Heart, 
  Brain, 
  Activity, 
  Users, 
  UserCheck,
  Lock,
  Check,
  X,
  Smartphone,
  AlertCircle,
  Target,
  TrendingUp,
  Award,
  Clock,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useMediCureOnData } from '../../hooks/useMediCureOnData';
import { apiConfig } from '../../config/apiConfig';
import MediCureOnSidebar from '../common/MediCureOnSidebar';
import MediCureOnHeader from '../common/MediCureOnHeader';

// Custom icon components
const Scale = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z" />
    <path d="M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z" />
    <path d="M7 21h10" />
    <path d="M12 3v18" />
    <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
  </svg>
);

const Droplets = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
    <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
  </svg>
);

const Moon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const Apple = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06z" />
    <path d="M10 2c1 2 2 2 4 0" />
  </svg>
);

const Wind = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
    <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
    <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
  </svg>
);

const FileText = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const MessageSquare = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const HealthcarePlans = ({ onNavigate }) => {
  const { user, userInfo } = useAuth();
  const { 
    userSubscription, 
    activePlans, 
    isLoading,
    isRefreshing,
    refreshAll,
    updateActivePlans,
    getUserDisplayName,
    getGreeting
  } = useMediCureOnData();

  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);

  const greeting = getGreeting();
  const firstName = getUserDisplayName();

  // Add focus listener to refresh when returning to the page
  useEffect(() => {
    const handleFocus = () => {
      if (document.hidden === false) {
        console.log('Plans page focused, data will refresh if stale');
        // refreshAll will only fetch if cache is expired
      }
    };

    // Check if we're coming from subscription success
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('from') === 'subscription-success') {
      console.log('Coming from subscription success, refreshing...');
      refreshAll();
      window.history.replaceState({}, '', window.location.pathname);
    }

    window.addEventListener('visibilitychange', handleFocus);
    
    return () => {
      window.removeEventListener('visibilitychange', handleFocus);
    };
  }, [refreshAll]);

  // Subscription plan limits
  const subscriptionLimits = {
    standard: { planLimit: 1, deviceLimit: 2 },
    silver: { planLimit: 2, deviceLimit: 5 },
    gold: { planLimit: 8, deviceLimit: 'Unlimited' },
    platinum: { planLimit: 'Unlimited', deviceLimit: 'Unlimited' }
  };

  const healthcarePlans = [
    {
      id: 1,
      name: "Weight Loss Excellence",
      shortName: "Weight loss",
      description: "Transform your body with AI-powered weight management and real-time progress tracking",
      icon: weightLossIcon,
      gradient: 'from-purple-500 to-pink-500',
      accentColor: '#EC4899',
      features: {
        iomt: ['Smart Scale', 'Fitness Tracker', 'Heart Rate Monitor'],
        keyBenefits: [
          'Real-time body composition insights',
          'AI-adjusted workout plans based on progress',
          'Daily muscle, bone mass, and BMR tracking',
          'Visceral fat monitoring and alerts',
          'Personalized nutrition recommendations'
        ],
        duration: '3-6 months',
        aiFeatures: 'Personalized meal plans, workout recommendations',
        participants: 3420,
        successRate: '89%'
      }
    },
    {
      id: 2,
      name: "Diabetes & Blood Sugar Control",
      shortName: "Pre-diabetes and Blood Sugar",
      description: "Take control of your glucose levels with continuous monitoring and predictive AI",
      icon: diabetesIcon,
      gradient: 'from-blue-500 to-cyan-500',
      accentColor: '#06B6D4',
      features: {
        iomt: ['Continuous Glucose Monitor', 'Smart Insulin Pen', 'Fitness Tracker'],
        keyBenefits: [
          'Real-time glucose monitoring',
          'Predictive alerts for blood sugar spikes',
          'Meal impact analysis',
          'Exercise recommendations based on glucose levels',
          'A1C tracking and predictions'
        ],
        duration: 'Ongoing',
        aiFeatures: 'AI-powered glucose predictions, personalized insulin recommendations',
        participants: 2890,
        successRate: '92%'
      }
    },
    {
      id: 3,
      name: "Heart Health Excellence",
      shortName: "Heart health and cardio wellness",
      description: "Protect your heart with advanced monitoring and personalized cardiac care",
      icon: heartHealthIcon,
      gradient: 'from-red-500 to-pink-600',
      accentColor: '#EF4444',
      features: {
        iomt: ['ECG Monitor', 'Blood Pressure Monitor', 'Fitness Tracker'],
        keyBenefits: [
          'Continuous ECG monitoring',
          'Blood pressure trends analysis',
          'Arrhythmia detection',
          'Stress impact on heart rate',
          'Recovery time optimization'
        ],
        duration: 'Ongoing',
        aiFeatures: 'Cardiac event prediction, personalized exercise zones',
        participants: 4150,
        successRate: '94%'
      }
    },
    {
      id: 4,
      name: "Sleep Optimization Program",
      shortName: "Sleep management",
      description: "Unlock the power of restorative sleep with advanced sleep tracking",
      icon: sleepIcon,
      gradient: 'from-indigo-500 to-purple-600',
      accentColor: '#8B5CF6',
      features: {
        iomt: ['Sleep Tracker', 'Smart Mattress Sensor', 'Wearable Ring'],
        keyBenefits: [
          'Sleep stage analysis',
          'Sleep quality scoring',
          'Optimal bedtime recommendations',
          'Environmental factor tracking',
          'Recovery insights'
        ],
        duration: '2-3 months',
        aiFeatures: 'Circadian rhythm optimization, personalized sleep hygiene tips',
        participants: 5230,
        successRate: '87%'
      }
    },
    {
      id: 5,
      name: "Stress & Mental Wellness",
      shortName: "Stress Management",
      description: "Master your stress and enhance mental clarity with biometric feedback",
      icon: stressIcon,
      gradient: 'from-green-500 to-teal-500',
      accentColor: '#10B981',
      features: {
        iomt: ['HRV Monitor', 'Meditation Headband', 'Stress Sensor'],
        keyBenefits: [
          'Real-time stress level monitoring',
          'Guided breathing exercises',
          'Meditation effectiveness tracking',
          'Cortisol pattern analysis',
          'Trigger identification'
        ],
        duration: '1-3 months',
        aiFeatures: 'Personalized stress reduction techniques, predictive stress alerts',
        participants: 3780,
        successRate: '91%'
      }
    },
    {
      id: 6,
      name: "Nutrition & Hydration Pro",
      shortName: "Nutrition and hydration",
      description: "Optimize your nutrition and hydration for peak performance",
      icon: nutritionIcon,
      gradient: 'from-yellow-400 to-orange-500',
      accentColor: '#F59E0B',
      features: {
        iomt: ['Smart Water Bottle', 'Nutrition Scanner', 'Smart Scale'],
        keyBenefits: [
          'Hydration reminders and tracking',
          'Nutritional content analysis',
          'Meal planning assistance',
          'Calorie tracking integration',
          'Micronutrient monitoring'
        ],
        duration: 'Ongoing',
        aiFeatures: 'Personalized meal plans, nutrient deficiency predictions',
        participants: 6120,
        successRate: '85%'
      }
    },
    {
      id: 7,
      name: "Respiratory Fitness Master",
      shortName: "Respiratory health and fitness",
      description: "Breathe better and boost your respiratory fitness with smart monitoring",
      icon: respiratoryIcon,
      gradient: 'from-cyan-500 to-blue-600',
      accentColor: '#0EA5E9',
      features: {
        iomt: ['Spirometer', 'Air Quality Monitor', 'Fitness Tracker'],
        keyBenefits: [
          'Lung capacity tracking',
          'Air quality impact analysis',
          'Breathing exercise guidance',
          'VO2 max improvements',
          'Recovery breathing patterns'
        ],
        duration: '3-6 months',
        aiFeatures: 'Breathing pattern optimization, environmental alerts',
        participants: 2340,
        successRate: '88%'
      }
    },
    {
      id: 8,
      name: "Women's Health Complete",
      shortName: "Women's health",
      description: "Comprehensive women's health tracking with hormone insights",
      icon: womensHealthIcon,
      gradient: 'from-pink-500 to-rose-600',
      accentColor: '#F43F5E',
      features: {
        iomt: ['Fertility Tracker', 'Smart Thermometer', 'Hormone Monitor'],
        keyBenefits: [
          'Cycle prediction and tracking',
          'Fertility window optimization',
          'Hormone level monitoring',
          'Pregnancy readiness insights',
          'Symptom pattern analysis'
        ],
        duration: 'Ongoing',
        aiFeatures: 'Fertility predictions, hormone balance recommendations',
        participants: 4890,
        successRate: '90%'
      }
    },
    {
      id: 9,
      name: "Recovery & Rehabilitation",
      shortName: "Post-recovery and rehabilitation",
      description: "Accelerate your recovery with intelligent progress tracking",
      icon: recoveryIcon,
      gradient: 'from-emerald-500 to-teal-600',
      accentColor: '#14B8A6',
      features: {
        iomt: ['Motion Sensors', 'Pain Monitor', 'Physical Therapy Tracker'],
        keyBenefits: [
          'Range of motion tracking',
          'Pain level monitoring',
          'Exercise compliance tracking',
          'Progress milestone alerts',
          'Recovery timeline optimization'
        ],
        duration: '2-6 months',
        aiFeatures: 'Adaptive recovery plans, risk assessment for re-injury',
        participants: 1670,
        successRate: '93%'
      }
    },
    {
      id: 10,
      name: "Total Health Prevention",
      shortName: "Comprehensive preventive health",
      description: "Complete health monitoring with predictive insights for disease prevention",
      icon: preventiveIcon,
      gradient: 'from-violet-500 to-purple-700',
      accentColor: '#7C3AED',
      features: {
        iomt: ['All Compatible Devices', 'Health Hub', 'Comprehensive Monitoring'],
        keyBenefits: [
          'Full-body health monitoring',
          'Early disease detection',
          'Comprehensive health scoring',
          'Preventive care reminders',
          'Long-term health predictions'
        ],
        duration: 'Ongoing',
        aiFeatures: 'Complete health AI analysis, predictive health modeling',
        participants: 890,
        successRate: '96%'
      }
    }
  ];

  const checkPlanAccess = (planId) => {
    if (!userSubscription || !userSubscription.type) {
      return { hasAccess: false, reason: 'subscription_required' };
    }

    if (activePlans.includes(planId)) {
      return { hasAccess: true, reason: 'already_enrolled' };
    }

    const limits = subscriptionLimits[userSubscription.type];
    
    if (userSubscription.type === 'platinum' || 
        (userSubscription.type === 'gold' && activePlans.length < 8)) {
      return { hasAccess: true, reason: 'can_enroll' };
    }

    if (activePlans.length >= limits.planLimit) {
      return { hasAccess: false, reason: 'plan_limit_reached' };
    }

    return { hasAccess: true, reason: 'can_enroll' };
  };

  const handlePlanClick = (plan) => {
    const access = checkPlanAccess(plan.id);
    
    if (access.reason === 'already_enrolled') {
      setSelectedPlan(plan);
      setShowPlanModal(true);
    } else if (access.reason === 'plan_limit_reached') {
      setSelectedPlan(plan);
      setShowUpgradeModal(true);
    } else {
      setSelectedPlan(plan);
      setShowPlanModal(true);
    }
  };

  const handleUnenrollPlan = async () => {
    try {
      const userId = user.localAccountId || user.username;
      const userCountry = userInfo?.country || 'United States';
      
      const response = await fetch(
        `${apiConfig.backendUrl}/api/plans/${userId}/${selectedPlan.id}?country=${encodeURIComponent(userCountry)}&code=${apiConfig.functionKeys.unenrollFromPlan || 'YOUR_FUNCTION_KEY_HERE'}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.idToken}`
          }
        }
      );

      if (response.ok) {
        // Update local state immediately
        const newActivePlans = activePlans.filter(id => id !== selectedPlan.id);
        updateActivePlans(newActivePlans);
        setShowPlanModal(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error unenrolling from plan:', error);
      alert('Failed to unenroll from plan. Please try again.');
    }
  };

  const handleChoosePlan = async () => {
    if (!userSubscription || !userSubscription.type) {
      onNavigate('subscription');
    } else {
      try {
        setEnrollmentLoading(true);
        const userId = user.localAccountId || user.username;
        const userCountry = userInfo?.country || 'United States';
        
        const response = await fetch(`${apiConfig.backendUrl}${apiConfig.endpoints.subscription.enrollPlan}?code=${apiConfig.functionKeys.enrollInPlan}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.idToken}`
          },
          body: JSON.stringify({
            userId: userId,
            planId: selectedPlan.id,
            country: userCountry
          })
        });

        if (response.ok) {
          // Update local state immediately
          updateActivePlans([...activePlans, selectedPlan.id]);
          setShowPlanModal(false);
          onNavigate(`plan-dashboard/${selectedPlan.id}`);
        } else {
          const error = await response.json();
          if (error.error === 'Plan limit reached') {
            setShowPlanModal(false);
            setShowUpgradeModal(true);
          } else {
            alert(`Error: ${error.error}`);
          }
        }
      } catch (error) {
        console.error('Error enrolling in plan:', error);
        alert('Failed to enroll in plan. Please try again.');
      } finally {
        setEnrollmentLoading(false);
      }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F8FAFC' }}>
      <MediCureOnSidebar onNavigate={onNavigate} activePage="plans" />

      <div className="flex-1 overflow-auto bg-gray-50">
        <MediCureOnHeader
          subtitle="Choose your health transformation journey 🚀"
          showRefresh={true}
          onRefresh={refreshAll}
        />

        {/* Plans Summary Cards */}
        {!isLoading && (
          <div className="px-6 pt-6">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-700">Total Plans</p>
                    <p className="text-2xl font-bold text-purple-900">10</p>
                  </div>
                  <Target className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-green-100 to-teal-100 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-700">Your Active Plans</p>
                    <p className="text-2xl font-bold text-green-900">{activePlans.length}</p>
                  </div>
                  <Activity className="w-8 h-8 text-green-500" />
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-700">Global Participants</p>
                    <p className="text-2xl font-bold text-blue-900">36K+</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-700">Avg Success Rate</p>
                    <p className="text-2xl font-bold text-orange-900">90%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-b-2 border-gray-900 rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-600">Loading your health plans...</p>
            </div>
          </div>
        ) : (
          /* Plans Grid - 4 columns with smaller cards */
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {healthcarePlans.map((plan) => {
                const access = checkPlanAccess(plan.id);
                const isEnrolled = access.reason === 'already_enrolled';
                const canEnroll = access.hasAccess && !isEnrolled;
                const isLocked = !userSubscription || !userSubscription.type;
                
                return (
                  <div
                    key={plan.id}
                    className="relative overflow-hidden transition-all duration-300 transform bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg hover:scale-105"
                    onClick={() => handlePlanClick(plan)}
                  >
                    {/* Gradient Header - Reduced height */}
                    <div className={`h-24 bg-gradient-to-br ${plan.gradient} relative`}>
                      <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                      
                      {/* Status Badge - Smaller */}
                      <div className="absolute top-2 right-2">
                        {isEnrolled ? (
                          <div className="px-2 py-0.5 bg-white border rounded-full bg-opacity-20 backdrop-blur-md border-white/30">
                            <span className="flex items-center text-xs font-bold text-white">
                              <Check className="w-2.5 h-2.5 mr-0.5" />
                              Active
                            </span>
                          </div>
                        ) : isLocked ? (
                          <div className="px-2 py-0.5 bg-black rounded-full bg-opacity-30 backdrop-blur-md">
                            <span className="flex items-center text-xs font-bold text-white">
                              <Lock className="w-2.5 h-2.5 mr-0.5" />
                              Locked
                            </span>
                          </div>
                        ) : (
                          <div className="px-2 py-0.5 bg-white rounded-full bg-opacity-20 backdrop-blur-md">
                            <span className="text-xs font-bold text-white">
                              Available
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Plan Icon - Smaller */}
                      <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                        <div className="flex items-center justify-center bg-white rounded-full w-14 h-14 bg-opacity-20 backdrop-blur-md">
                          <img 
                            src={plan.icon} 
                            alt={`${plan.name} icon`}
                            className="object-contain w-10 h-10 filter drop-shadow-lg"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Content - More compact */}
                    <div className="p-4">
                      <h3 className="mb-1 text-base font-bold text-gray-900 line-clamp-1">{plan.name}</h3>
                      <p className="mb-3 text-xs text-gray-600 line-clamp-2">{plan.description}</p>

                      {/* Stats - Smaller */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="p-2 text-center rounded-md bg-gray-50">
                          <div className="flex items-center justify-center space-x-0.5 text-gray-600">
                            <Users className="w-3 h-3" />
                            <span className="text-xs">Users</span>
                          </div>
                          <p className="text-sm font-bold" style={{ color: plan.accentColor }}>
                            {plan.features.participants > 1000 ? 
                              `${(plan.features.participants / 1000).toFixed(1)}k` : 
                              plan.features.participants}
                          </p>
                        </div>
                        <div className="p-2 text-center rounded-md bg-gray-50">
                          <div className="flex items-center justify-center space-x-0.5 text-gray-600">
                            <Award className="w-3 h-3" />
                            <span className="text-xs">Success</span>
                          </div>
                          <p className="text-sm font-bold" style={{ color: plan.accentColor }}>
                            {plan.features.successRate}
                          </p>
                        </div>
                      </div>

                      {/* Features Preview - Compact */}
                      <div className="flex items-center justify-between mb-3 text-xs text-gray-600">
                        <div className="flex items-center space-x-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{plan.features.duration}</span>
                        </div>
                        <div className="flex items-center space-x-0.5">
                          <Smartphone className="w-3 h-3" />
                          <span>{plan.features.iomt.length} Devices</span>
                        </div>
                      </div>

                      {/* Action Button - Smaller */}
                      <button 
                        className={`w-full py-2 px-3 rounded-md text-sm font-medium transition-all transform hover:scale-105 ${
                          isEnrolled 
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                            : canEnroll
                            ? `bg-gradient-to-r ${plan.gradient} text-white hover:opacity-90`
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                        disabled={!canEnroll && !isEnrolled}
                      >
                        {isEnrolled ? 'View Dashboard' : isLocked ? 'Subscribe' : 'Start Plan'}
                      </button>
                    </div>

                    {/* Progress Bar for Enrolled Plans - Compact */}
                    {isEnrolled && (
                      <div className="px-4 pb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">Progress</span>
                          <span className="text-xs font-bold" style={{ color: plan.accentColor }}>45%</span>
                        </div>
                        <div className="w-full h-1.5 overflow-hidden bg-gray-200 rounded-full">
                          <div 
                            className={`h-full bg-gradient-to-r ${plan.gradient} transition-all duration-500`}
                            style={{ width: '45%' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom CTA Section */}
            {!userSubscription || !userSubscription.type ? (
              <div className="p-6 mt-8 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="mb-2 text-xl font-bold">Unlock Your Health Transformation! 🎯</h3>
                    <p className="opacity-90">
                      Subscribe to MediCureOn and get instant access to all our AI-powered health plans
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('subscription')}
                    className="px-6 py-3 font-bold text-blue-600 transition-all transform bg-white rounded-lg hover:bg-gray-100 hover:scale-105"
                  >
                    View Subscription Plans
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 mt-8 text-white bg-gradient-to-r from-green-600 to-teal-600 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="mb-2 text-xl font-bold">You're on the {userSubscription.type} Plan! 🌟</h3>
                    <p className="opacity-90">
                      {userSubscription.type === 'platinum' 
                        ? 'You have unlimited access to all health plans!'
                        : `You can access up to ${subscriptionLimits[userSubscription.type].planLimit} plan${subscriptionLimits[userSubscription.type].planLimit > 1 ? 's' : ''} simultaneously.`
                      }
                    </p>
                  </div>
                  {userSubscription.type !== 'platinum' && (
                    <button
                      onClick={() => onNavigate('subscription')}
                      className="px-6 py-3 font-bold text-green-600 transition-all transform bg-white rounded-lg hover:bg-gray-100 hover:scale-105"
                    >
                      Upgrade Plan
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Plan Details Modal - remains the same */}
        {showPlanModal && selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 flex items-center justify-between px-6 py-4 bg-white border-b">
                <div className="flex items-center">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedPlan.name}</h2>
                  {activePlans.includes(selectedPlan.id) && (
                    <span className="px-3 py-1 ml-3 text-sm font-medium text-white bg-green-500 rounded-full">
                      Currently Enrolled
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowPlanModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <p className="mb-6 text-gray-600">{selectedPlan.description}</p>

                {/* IoMT Devices Section */}
                <div className="mb-6">
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">IoMT Features Utilized:</h3>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {selectedPlan.features.iomt.map((device, idx) => (
                      <div key={idx} className="flex items-center p-3 rounded-lg bg-blue-50">
                        <Smartphone className="w-5 h-5 mr-2 text-blue-600" />
                        <span className="text-sm text-gray-700">{device}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Benefits Section */}
                <div className="mb-6">
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">Key Benefits:</h3>
                  <ul className="space-y-2">
                    {selectedPlan.features.keyBenefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
                  <div className="p-4 rounded-lg bg-gray-50">
                    <h4 className="mb-1 font-medium text-gray-900">Duration</h4>
                    <p className="text-sm text-gray-600">{selectedPlan.features.duration}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50">
                    <h4 className="mb-1 font-medium text-gray-900">AI Features</h4>
                    <p className="text-sm text-gray-600">{selectedPlan.features.aiFeatures}</p>
                  </div>
                </div>

                {/* Subscription Info */}
                {(!userSubscription || !userSubscription.type) && (
                  <div className="p-4 mb-6 border border-yellow-200 rounded-lg bg-yellow-50">
                    <div className="flex items-start">
                      <AlertCircle className="flex-shrink-0 w-5 h-5 mr-2 text-yellow-600" />
                      <div>
                        <h4 className="font-medium text-yellow-900">Subscription Required</h4>
                        <p className="mt-1 text-sm text-yellow-700">
                          You need an active MediCureOn subscription to access this plan. 
                          Choose from our flexible subscription options to get started.
                        </p>
                        <button
                          onClick={refreshAll}
                          className="mt-2 text-sm text-blue-600 underline hover:text-blue-800"
                        >
                          Already subscribed? Click here to refresh
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  {activePlans.includes(selectedPlan.id) ? (
                    <>
                      <button
                        onClick={() => onNavigate(`plan-dashboard/${selectedPlan.id}`)}
                        className="flex-1 px-4 py-3 font-semibold text-white transition-all duration-200 bg-green-600 rounded-lg hover:bg-green-700"
                      >
                        Go to Plan Dashboard
                      </button>
                      <button
                        onClick={handleUnenrollPlan}
                        className="px-6 py-3 font-semibold text-white transition-all duration-200 bg-red-600 rounded-lg hover:bg-red-700"
                      >
                        Unenroll from Plan
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleChoosePlan}
                      disabled={enrollmentLoading}
                      className="flex-1 px-4 py-3 font-semibold text-white transition-all duration-200 rounded-lg hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: '#02276F' }}
                    >
                      {enrollmentLoading ? 'Enrolling...' : (!userSubscription || !userSubscription.type ? 'Choose Subscription Plan' : 'Choose This Plan')}
                    </button>
                  )}
                  <button
                    onClick={() => setShowPlanModal(false)}
                    className="px-6 py-3 font-semibold text-gray-700 transition-all duration-200 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Modal - remains the same */}
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl">
              <div className="mb-6 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full">
                  <AlertCircle className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-gray-900">Plan Limit Reached</h3>
                <p className="text-gray-600">
                  Your {userSubscription?.type} subscription allows only {subscriptionLimits[userSubscription?.type]?.planLimit} active plan{subscriptionLimits[userSubscription?.type]?.planLimit > 1 ? 's' : ''} at a time.
                </p>
              </div>

              <div className="p-4 mb-6 rounded-lg bg-blue-50">
                <h4 className="mb-2 font-semibold text-blue-900">Upgrade to access more plans:</h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  {userSubscription?.type === 'standard' && (
                    <>
                      <li>• Silver: Up to 2 plans</li>
                      <li>• Gold: Up to 8 plans</li>
                      <li>• Platinum: Unlimited plans</li>
                    </>
                  )}
                  {userSubscription?.type === 'silver' && (
                    <>
                      <li>• Gold: Up to 8 plans</li>
                      <li>• Platinum: Unlimited plans</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    setShowUpgradeModal(false);
                    onNavigate('subscription');
                  }}
                  className="w-full px-4 py-3 font-semibold text-white transition-all duration-200 rounded-lg hover:opacity-90"
                  style={{ backgroundColor: '#02276F' }}
                >
                  Upgrade Subscription
                </button>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full px-4 py-3 font-semibold text-gray-700 transition-all duration-200 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthcarePlans;