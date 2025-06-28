import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  ArrowRight, 
  Loader,
  AlertCircle,
  Home,
  FileText,
  CreditCard,
  Sparkles,
  Zap,
  Heart,
  Activity,
  Gift,
  Crown,
  Star,
  Trophy,
  Rocket,
  Users,
  Shield,
  Phone,
  Clock,
  TrendingUp,
  Award,
  ChevronRight,
  PartyPopper
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { apiConfig } from '../../config/apiConfig';

const SubscriptionSuccess = ({ onNavigate }) => {
  const { user, userInfo } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [savingSubscription, setSavingSubscription] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const processSubscription = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');

      if (!sessionId) {
        setError('No session ID found. Please contact support.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Step 1: Retrieve session details from Stripe
        console.log('Retrieving checkout session:', sessionId);
        const sessionResponse = await fetch(
          `${apiConfig.backendUrl}/api/retrieve-checkout-session?sessionId=${sessionId}&code=${apiConfig.functionKeys.retrieveCheckoutSession}`,
          {
            headers: {
              'Authorization': `Bearer ${user.idToken}`
            }
          }
        );

        if (!sessionResponse.ok) {
          throw new Error('Failed to retrieve session details');
        }

        const sessionData = await sessionResponse.json();
        console.log('Session data retrieved:', sessionData);

        // Extract subscription details
        const subscriptionInfo = {
          tier: determineTierFromProductName(sessionData.productName),
          status: 'active',
          stripeCustomerId: sessionData.customer,
          stripeSubscriptionId: sessionData.subscription?.id || sessionData.subscription,
          productName: sessionData.productName,
          currentPeriodStart: sessionData.subscription?.current_period_start 
            ? new Date(sessionData.subscription.current_period_start * 1000).toISOString()
            : new Date().toISOString(),
          currentPeriodEnd: sessionData.subscription?.current_period_end
            ? new Date(sessionData.subscription.current_period_end * 1000).toISOString()
            : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          pricePerMonth: sessionData.amount_total / 12 / 100,
          pricePerYear: sessionData.amount_total / 100,
          currency: sessionData.currency || 'usd'
        };

        setSubscriptionDetails(subscriptionInfo);

        // Step 2: Save subscription to Azure
        setSavingSubscription(true);
        console.log('Saving subscription to Azure...');
        
        const userId = user.localAccountId || user.username || user.idTokenClaims?.oid;
        const userCountry = userInfo?.country || 'United States';

        const saveResponse = await fetch(
          `${apiConfig.backendUrl}/api/save-subscription?code=${apiConfig.functionKeys.saveSubscription}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.idToken}`
            },
            body: JSON.stringify({
              userId: userId,
              subscriptionInfo: subscriptionInfo,
              country: userCountry
            })
          }
        );

        if (!saveResponse.ok) {
          const errorData = await saveResponse.json();
          throw new Error(errorData.error || 'Failed to save subscription');
        }

        const saveResult = await saveResponse.json();
        console.log('Subscription saved successfully:', saveResult);

        // Clear the session_id from URL for cleaner URL
        window.history.replaceState({}, document.title, '/subscription-success');

        // Trigger animation
        setTimeout(() => setAnimationComplete(true), 500);

      } catch (error) {
        console.error('Error processing subscription:', error);
        setError(error.message || 'Failed to process subscription. Please contact support.');
      } finally {
        setLoading(false);
        setSavingSubscription(false);
      }
    };

    processSubscription();
  }, [user, userInfo]);

  // Helper function to determine tier from product name
  const determineTierFromProductName = (productName) => {
    const lowerName = productName?.toLowerCase() || '';
    if (lowerName.includes('platinum')) return 'platinum';
    if (lowerName.includes('gold')) return 'gold';
    if (lowerName.includes('silver')) return 'silver';
    return 'standard';
  };

  // Get tier details
  const getTierDetails = (tier) => {
    const tiers = {
      standard: {
        name: 'Standard',
        icon: Shield,
        color: 'gray',
        gradient: 'from-gray-400 to-gray-600',
        bgGradient: 'from-gray-50 to-gray-100',
        benefits: ['1 Healthcare Plan', '2 Device Connections', 'Monthly Reports'],
        features: [
          { icon: FileText, text: 'Access to 1 Healthcare Plan' },
          { icon: Activity, text: 'Basic health tracking' },
          { icon: TrendingUp, text: 'Monthly health reports' }
        ]
      },
      silver: {
        name: 'Silver',
        icon: Star,
        color: 'slate',
        gradient: 'from-slate-400 to-slate-600',
        bgGradient: 'from-slate-50 to-slate-100',
        benefits: ['2 Healthcare Plans', '5 Device Connections', 'Weekly Reports', 'Telehealth'],
        features: [
          { icon: FileText, text: 'Access to 2 Healthcare Plans' },
          { icon: Phone, text: '2 Telehealth consultations/month' },
          { icon: Users, text: 'Family profiles (up to 3)' }
        ]
      },
      gold: {
        name: 'Gold',
        icon: Crown,
        color: 'yellow',
        gradient: 'from-yellow-400 to-amber-600',
        bgGradient: 'from-yellow-50 to-amber-50',
        benefits: ['8 Healthcare Plans', 'Unlimited Devices', 'Daily Reports', 'Unlimited Telehealth'],
        features: [
          { icon: FileText, text: 'Access to 8 Healthcare Plans' },
          { icon: Phone, text: 'Unlimited telehealth consultations' },
          { icon: Heart, text: 'Premium AI health insights' }
        ]
      },
      platinum: {
        name: 'Platinum',
        icon: Trophy,
        color: 'purple',
        gradient: 'from-purple-600 to-indigo-600',
        bgGradient: 'from-purple-50 to-indigo-50',
        benefits: ['All Healthcare Plans', 'Unlimited Everything', 'Real-time Monitoring', 'Concierge Service'],
        features: [
          { icon: Rocket, text: 'Access to ALL Healthcare Plans' },
          { icon: Award, text: 'Dedicated health concierge' },
          { icon: Shield, text: 'Executive health screening' }
        ]
      }
    };
    return tiers[tier] || tiers.standard;
  };

  const tierDetails = subscriptionDetails ? getTierDetails(subscriptionDetails.tier) : null;
  const TierIcon = tierDetails?.icon || Shield;

  // Get user's display name
  const getUserDisplayName = () => {
    if (userInfo?.displayName) return userInfo.displayName;
    if (userInfo?.name) return userInfo.name;
    if (user?.name) return user.name;
    if (userInfo?.firstName) return userInfo.firstName;
    const email = userInfo?.email || user?.username || user?.idTokenClaims?.email;
    if (email) return email.split('@')[0];
    return 'Member';
  };

  const firstName = getUserDisplayName().split(' ')[0] || 'Member';

  if (loading || savingSubscription) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
            <div className="relative flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-white rounded-full shadow-lg">
              <Loader className="w-10 h-10 text-[#02276F] animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {savingSubscription ? 'Activating your subscription...' : 'Processing your payment...'}
          </h2>
          <p className="mt-2 text-gray-600">This will only take a moment</p>
          <div className="flex justify-center mt-6 space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
        <div className="max-w-md p-8 bg-white shadow-2xl rounded-2xl">
          <div className="text-center">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Oops! Something went wrong</h2>
            <p className="mb-6 text-gray-600">{error}</p>
            <div className="space-y-3">
              <button
                onClick={() => onNavigate('subscription')}
                className="w-full px-6 py-3 font-semibold text-white transition-all duration-200 transform bg-[#02276F] rounded-lg hover:scale-105"
              >
                Try Again
              </button>
              <button
                onClick={() => onNavigate('landing')}
                className="w-full px-6 py-3 font-semibold text-gray-700 transition-all duration-200 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bg-purple-300 rounded-full top-20 left-10 w-72 h-72 mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute bg-yellow-300 rounded-full top-40 right-10 w-72 h-72 mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bg-pink-300 rounded-full -bottom-8 left-20 w-72 h-72 mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Confetti Effect (subtle) */}
      {animationComplete && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 w-2 h-2 bg-yellow-400 rounded-full left-1/4 animate-confetti"></div>
          <div className="absolute top-0 w-2 h-2 bg-blue-400 rounded-full left-1/2 animate-confetti animation-delay-200"></div>
          <div className="absolute top-0 w-2 h-2 bg-purple-400 rounded-full left-3/4 animate-confetti animation-delay-400"></div>
          <div className="absolute top-0 w-2 h-2 bg-pink-400 rounded-full right-1/4 animate-confetti animation-delay-600"></div>
        </div>
      )}

      {/* Main Content - Fixed container */}
      <div className="relative px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl mx-auto">
          {/* Success Card */}
          <div className={`relative overflow-hidden bg-white shadow-2xl rounded-3xl transform transition-all duration-1000 ${
            animationComplete ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}>
            {/* Top Gradient Bar */}
            <div className="h-2 bg-gradient-to-r from-[#F1C40F] via-[#FDB931] to-[#F1C40F]"></div>
            
            {/* Header Section */}
            <div className={`relative bg-gradient-to-br ${tierDetails?.bgGradient} p-8 md:p-12 text-center`}>
              {/* Success Animation */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500 rounded-full opacity-20 animate-ping"></div>
                  <div className="absolute inset-0 bg-green-400 rounded-full opacity-20 animate-ping animation-delay-200"></div>
                  <div className="relative flex items-center justify-center w-32 h-32 bg-white rounded-full shadow-xl">
                    <CheckCircle className="w-16 h-16 text-green-600" />
                  </div>
                  {/* Sparkles around success icon */}
                  <Sparkles className="absolute w-6 h-6 text-yellow-400 -top-2 -right-2 animate-pulse" />
                  <Sparkles className="absolute w-4 h-4 text-blue-400 -bottom-1 -left-1 animate-pulse animation-delay-200" />
                </div>
              </div>

              {/* Welcome Message */}
              <h1 className="mb-4 text-4xl font-bold text-gray-900">
                Congratulations, {firstName}! 🎉
              </h1>
              <p className="mb-2 text-xl text-gray-700">
                Welcome to the MediCureOn {tierDetails?.name} family!
              </p>
              <p className="text-gray-600">
                Your journey to better health starts now
              </p>
            </div>

            {/* Content Section */}
            <div className="p-8 md:p-12">
              {/* Subscription Details Card */}
              {subscriptionDetails && (
                <div className={`mb-8 p-6 rounded-2xl bg-gradient-to-br ${tierDetails?.bgGradient} border border-gray-200`}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Your {tierDetails?.name} Subscription</h3>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${tierDetails?.gradient} shadow-lg`}>
                      <TierIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Plan Info */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg bg-opacity-70">
                        <span className="flex items-center text-gray-600">
                          <Crown className="w-4 h-4 mr-2" />
                          Plan Type
                        </span>
                        <span className="font-bold text-gray-900">{tierDetails?.name}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg bg-opacity-70">
                        <span className="flex items-center text-gray-600">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Status
                        </span>
                        <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                          <div className="w-2 h-2 mr-1 bg-green-500 rounded-full animate-pulse"></div>
                          Active
                        </span>
                      </div>
                    </div>

                    {/* Billing Info */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg bg-opacity-70">
                        <span className="flex items-center text-gray-600">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Billing
                        </span>
                        <span className="font-bold text-gray-900">
                          ${subscriptionDetails.pricePerYear}/year
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg bg-opacity-70">
                        <span className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          Next Renewal
                        </span>
                        <span className="font-medium text-gray-900">
                          {new Date(subscriptionDetails.currentPeriodEnd).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Plan Benefits */}
                  <div className="mt-6">
                    <h4 className="mb-3 font-semibold text-gray-900">Your Benefits Include:</h4>
                    <div className="flex flex-wrap gap-2">
                      {tierDetails?.benefits.map((benefit, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white rounded-full bg-opacity-70"
                        >
                          <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Start Guide */}
              <div className="mb-8">
                <h3 className="flex items-center mb-6 text-xl font-bold text-gray-900">
                  <Rocket className="w-6 h-6 mr-2 text-[#02276F]" />
                  Quick Start Guide
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {tierDetails?.features.map((feature, index) => {
                    const FeatureIcon = feature.icon;
                    return (
                      <div 
                        key={index}
                        className="relative p-6 transition-all duration-300 transform bg-gray-50 rounded-xl hover:bg-gray-100 hover:scale-105 group"
                      >
                        <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${tierDetails?.gradient} opacity-10 rounded-bl-full`}></div>
                        <div className={`flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-gradient-to-br ${tierDetails?.gradient} shadow-lg`}>
                          <FeatureIcon className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="mb-2 font-semibold text-gray-900">Step {index + 1}</h4>
                        <p className="text-sm text-gray-600">{feature.text}</p>
                        <ChevronRight className="absolute w-4 h-4 text-gray-400 transition-transform bottom-4 right-4 group-hover:translate-x-1" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={() => {
                    // Navigate to plans with a flag to refresh subscription status
                    window.location.href = '/plans?from=subscription-success';
                  }}
                  className="flex items-center justify-center w-full px-6 py-4 font-bold text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-[#02276F] to-[#033A8E] rounded-xl hover:scale-105 hover:shadow-xl group"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Explore Healthcare Plans
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </button>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <button
                    onClick={() => onNavigate('landing')}
                    className="flex items-center justify-center px-4 py-3 font-medium text-gray-700 transition-all duration-200 transform bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:scale-105 group"
                  >
                    <Home className="w-4 h-4 mr-2 text-[#02276F]" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => onNavigate('profile')}
                    className="flex items-center justify-center px-4 py-3 font-medium text-gray-700 transition-all duration-200 transform bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:scale-105 group"
                  >
                    <Activity className="w-4 h-4 mr-2 text-[#02276F]" />
                    Set Health Goals
                  </button>
                  <button
                    onClick={() => onNavigate('devices')}
                    className="flex items-center justify-center px-4 py-3 font-medium text-gray-700 transition-all duration-200 transform bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:scale-105 group"
                  >
                    <Zap className="w-4 h-4 mr-2 text-[#02276F]" />
                    Connect Devices
                  </button>
                </div>
              </div>

              {/* Welcome Gift */}
              <div className="p-6 mt-8 text-center bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
                <Gift className="w-12 h-12 mx-auto mb-3 text-purple-600" />
                <h4 className="mb-2 text-lg font-bold text-gray-900">Welcome Gift! 🎁</h4>
                <p className="mb-4 text-gray-600">
                  As a new {tierDetails?.name} member, enjoy 500 bonus MediCoins!
                </p>
                <button
                  onClick={() => onNavigate('rewards')}
                  className="inline-flex items-center px-4 py-2 font-medium text-purple-700 transition-all duration-200 transform bg-white rounded-lg hover:scale-105"
                >
                  Claim Your Reward
                  <Sparkles className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Message */}
          <div className="pb-8 mt-8 text-center">
            <p className="text-gray-600">
              A confirmation email has been sent to your registered email address.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Need help? Contact our 24/7 support team at{' '}
              <a href="mailto:support@medicureon.com" className="text-[#02276F] hover:underline">
                support@medicureon.com
              </a>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        html, body {
          height: auto !important;
          overflow: visible !important;
        }
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        .animation-delay-600 {
          animation-delay: 600ms;
        }
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SubscriptionSuccess;