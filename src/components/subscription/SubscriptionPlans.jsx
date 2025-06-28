import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Star, 
  Shield, 
  Crown, 
  Gem,
  Users,
  Sparkles,
  Zap,
  Award,
  X,
  TrendingUp,
  Lock,
  CheckCircle,
  ArrowRight,
  Rocket,
  Heart,
  Clock,
  Phone,
  Globe,
  Gift,
  RefreshCw,
  FileText,
  Activity,
  CreditCard,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useMediCureOnData } from '../../hooks/useMediCureOnData';
import { apiConfig } from '../../config/apiConfig';
import { stripeConfig } from '../../config/stripeConfig';
import PlanDashboardLayout from '../common/PlanDashboardLayout';

const SubscriptionPlans = ({ onNavigate }) => {
  const { user, userInfo } = useAuth();
  const { userSubscription: currentSubscription } = useMediCureOnData();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState(null);

  // Get user email
  const userEmail = userInfo?.email || user?.username || user?.idTokenClaims?.email;

  // Custom badges for this page
  const customBadges = [
    stripeConfig.testMode && {
      text: 'Test Mode',
      className: "px-3 py-1.5 bg-orange-500/20 backdrop-blur-sm rounded-full",
      icon: null
    }
  ].filter(Boolean);

  // ANNUAL SUBSCRIPTION PLANS - Enhanced
  const subscriptionPlans = [
    {
      id: 'standard',
      name: 'Standard',
      icon: Shield,
      price: 12,
      monthlyEquivalent: 1,
      stripeProductId: stripeConfig.products.standard,
      gradient: 'from-gray-400 to-gray-600',
      cardGradient: 'from-gray-50 to-white',
      borderColor: 'border-gray-200',
      iconColor: '#6B7280',
      accentColor: '#6B7280',
      popularityScore: '2.5K users',
      features: [
        { text: 'Access to 1 Healthcare Plan', highlight: false, icon: FileText },
        { text: 'Basic health tracking', highlight: false, icon: Activity },
        { text: 'Monthly health reports', highlight: false, icon: TrendingUp },
        { text: 'Email support', highlight: false, icon: MessageSquare },
        { text: 'Mobile app access', highlight: false, icon: Sparkles },
        { text: 'Connect up to 2 devices', highlight: false, icon: Zap }
      ],
      recommended: false,
      description: 'Perfect for individuals starting their health journey',
      savings: null
    },
    {
      id: 'silver',
      name: 'Silver',
      icon: Star,
      price: 36,
      monthlyEquivalent: 3,
      stripeProductId: stripeConfig.products.silver,
      gradient: 'from-slate-400 to-slate-600',
      cardGradient: 'from-slate-50 to-white',
      borderColor: 'border-slate-300',
      iconColor: '#64748B',
      accentColor: '#64748B',
      popularityScore: '5.2K users',
      features: [
        { text: 'Access to 2 Healthcare Plans', highlight: true, icon: FileText },
        { text: 'Advanced health tracking', highlight: false, icon: Activity },
        { text: 'Weekly health reports', highlight: true, icon: TrendingUp },
        { text: 'Priority email support', highlight: false, icon: MessageSquare },
        { text: 'Telehealth consultations (2/month)', highlight: true, icon: Phone },
        { text: 'Family member profiles (up to 3)', highlight: false, icon: Users },
        { text: 'Connect up to 5 devices', highlight: true, icon: Zap }
      ],
      recommended: false,
      description: 'Ideal for health-conscious individuals and small families',
    },
    {
      id: 'gold',
      name: 'Gold',
      icon: Crown,
      price: 60,
      monthlyEquivalent: 5,
      stripeProductId: stripeConfig.products.gold,
      gradient: 'from-yellow-400 to-amber-600',
      cardGradient: 'from-yellow-50 via-amber-50 to-yellow-50',
      borderColor: 'border-yellow-400',
      iconColor: '#F59E0B',
      accentColor: '#F59E0B',
      popularityScore: '12.8K users',
      features: [
        { text: 'Access to 8 Healthcare Plans', highlight: true, icon: FileText },
        { text: 'Premium health tracking with AI insights', highlight: true, icon: Activity },
        { text: 'Daily health reports', highlight: true, icon: TrendingUp },
        { text: '24/7 phone & chat support', highlight: true, icon: Phone },
        { text: 'Unlimited telehealth consultations', highlight: true, icon: Heart },
        { text: 'Family member profiles (up to 5)', highlight: false, icon: Users },
        { text: 'Prescription management', highlight: true, icon: Shield },
        { text: 'Unlimited device connections', highlight: true, icon: Zap }
      ],
      recommended: true,
      description: 'Comprehensive care for families and health enthusiasts',
    },
    {
      id: 'platinum',
      name: 'Platinum',
      icon: Gem,
      price: 120,
      monthlyEquivalent: 10,
      stripeProductId: stripeConfig.products.platinum,
      gradient: 'from-purple-600 via-purple-500 to-indigo-600',
      cardGradient: 'from-purple-50 via-indigo-50 to-purple-50',
      borderColor: 'border-purple-400',
      iconColor: '#7C3AED',
      accentColor: '#7C3AED',
      popularityScore: '3.1K users',
      premium: true,
      features: [
        { text: 'Access to ALL Healthcare Plans', highlight: true, icon: FileText },
        { text: 'Executive health tracking with AI', highlight: true, icon: Rocket },
        { text: 'Real-time health monitoring', highlight: true, icon: Activity },
        { text: 'Dedicated health concierge', highlight: true, icon: Award },
        { text: 'Unlimited telehealth + home visits', highlight: true, icon: Heart },
        { text: 'Unlimited family members', highlight: true, icon: Users },
        { text: 'Global coverage', highlight: true, icon: Globe },
        { text: 'Priority specialist referrals', highlight: true, icon: Star },
        { text: 'Annual executive health screening', highlight: true, icon: Shield },
        { text: 'Custom health programs', highlight: true, icon: Sparkles }
      ],
      recommended: false,
      description: 'Ultimate healthcare experience for executives and large families',
    }
  ];

  const handleSubscribe = async (plan) => {
    if (currentSubscription?.type === plan.id) {
      return;
    }
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const processPayment = async () => {
    setLoading(true);
    try {
      const url = `${apiConfig.backendUrl}/api/create-checkout-session?code=${apiConfig.functionKeys.createCheckoutSession}`;
      const userId = user?.localAccountId || user?.username || user?.idTokenClaims?.oid;
      const firstName = userInfo?.firstName || userInfo?.displayName?.split(' ')[0] || 'Member';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: selectedPlan.stripeProductId,
          userEmail: userEmail || 'test@medicureon.com',
          userId: userId,
          userName: firstName,
          successUrl: `${window.location.origin}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/subscription`
        }),
      });

      const responseText = await response.text();
      
      if (!response.ok) {
        let errorMessage = `Server error: ${response.status}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = responseText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error('Invalid response from server');
      }

      if (!data.sessionUrl) {
        throw new Error('No checkout session URL received');
      }
      
      window.location.href = data.sessionUrl;

    } catch (error) {
      console.error('Payment error:', error);
      alert(`Payment failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PlanDashboardLayout
      planId="subscription"
      planName="Subscription Plans"
      subtitle="Choose the perfect plan for your health journey 💎"
      customBadges={customBadges}
      onNavigate={onNavigate}
      showDevelopmentBanner={false}
    >
      {/* Value Props Section */}
      <div className="grid grid-cols-1 gap-4 mb-8 lg:grid-cols-4">
        <div className="p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Total Members</p>
              <p className="text-2xl font-bold text-blue-900">23.6K+</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Satisfaction Rate</p>
              <p className="text-2xl font-bold text-green-900">98%</p>
            </div>
            <Heart className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Health Plans</p>
              <p className="text-2xl font-bold text-purple-900">10+</p>
            </div>
            <FileText className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Avg Savings</p>
              <p className="text-2xl font-bold text-orange-900">$850/yr</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-4xl font-bold text-gray-900">
          Transform Your Health with <span className="text-[#02276F]">MediCureOn</span>
        </h2>
        <p className="max-w-3xl mx-auto text-lg text-gray-600">
          Join thousands who've revolutionized their healthcare with AI-powered insights, 
          comprehensive monitoring, and personalized care plans tailored to your unique needs.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {subscriptionPlans.map((plan, index) => {
          const Icon = plan.icon;
          const isCurrentPlan = currentSubscription?.type === plan.id;
          const isHovered = hoveredPlan === plan.id;
          
          return (
            <div
              key={plan.id}
              className={`relative transform transition-all duration-500 ${
                isHovered ? 'scale-105 z-10' : 'scale-100'
              } ${plan.recommended ? 'lg:scale-105' : ''}`}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              onMouseLeave={() => setHoveredPlan(null)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card Container */}
              <div 
                className={`relative bg-gradient-to-br ${plan.cardGradient} rounded-2xl shadow-xl overflow-hidden border-2 transition-all duration-300 ${
                  isCurrentPlan ? 'border-green-500 shadow-green-200' : 
                  isHovered ? `${plan.borderColor} shadow-2xl` : 'border-gray-200'
                }`}
              >
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, ${plan.accentColor} 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                  }}></div>
                </div>

                {/* Badges */}
                {plan.recommended && !isCurrentPlan && (
                  <div className="absolute top-0 left-0 right-0 py-2 text-sm font-bold tracking-wide text-center text-white uppercase shadow-lg bg-gradient-to-r from-[#F1C40F] to-[#FDB931] animate-pulse">
                    <div className="flex items-center justify-center">
                      <Crown className="w-4 h-4 mr-1" />
                      Most Popular Choice
                    </div>
                  </div>
                )}
                {isCurrentPlan && (
                  <div className="absolute top-0 left-0 right-0 py-2 text-sm font-bold tracking-wide text-center text-white uppercase shadow-lg bg-gradient-to-r from-green-500 to-green-600">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Your Current Plan
                    </div>
                  </div>
                )}

                <div className={`p-6 ${(plan.recommended && !isCurrentPlan) || isCurrentPlan ? 'pt-14' : ''}`}>
                  {/* Plan Header */}
                  <div className="mb-6 text-center">
                    <div className={`relative w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg transform transition-all duration-300 ${
                      isHovered ? 'rotate-6 scale-110' : ''
                    }`}>
                      <Icon className="w-12 h-12 text-white" />
                      {plan.premium && (
                        <Sparkles className="absolute w-6 h-6 text-yellow-300 -top-2 -right-2 animate-pulse" />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="mt-1 text-xs font-medium" style={{ color: plan.accentColor }}>
                      {plan.popularityScore}
                    </p>
                  </div>

                  {/* Price Section */}
                  <div className="mb-6 text-center">
                    <div className="relative">
                      <div className="flex items-baseline justify-center">
                        <span className="text-2xl font-bold text-gray-500">$</span>
                        <span className="text-5xl font-bold text-gray-900">
                          {plan.price}
                        </span>
                        <span className="ml-2 text-lg text-gray-600">/year</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Just ${plan.monthlyEquivalent}/month
                      </p>
                      {plan.savings && (
                        <div className="inline-flex items-center px-2 py-1 mt-2 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                          {plan.savings}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6 space-y-3">
                    {plan.features.slice(0, 6).map((feature, idx) => {
                      const FeatureIcon = feature.icon;
                      return (
                        <div key={idx} className="flex items-start group">
                          <div className={`rounded-lg p-1.5 mr-3 transition-all duration-300 ${
                            feature.highlight 
                              ? `bg-gradient-to-br ${plan.gradient} group-hover:scale-110` 
                              : 'bg-gray-100 group-hover:bg-gray-200'
                          }`}>
                            <FeatureIcon className={`w-3 h-3 ${
                              feature.highlight ? 'text-white' : 'text-gray-600'
                            }`} />
                          </div>
                          <span className={`text-sm leading-relaxed ${
                            feature.highlight ? 'text-gray-900 font-medium' : 'text-gray-700'
                          }`}>
                            {feature.text}
                          </span>
                        </div>
                      );
                    })}
                    {plan.features.length > 6 && (
                      <p className="text-xs font-medium text-center" style={{ color: plan.accentColor }}>
                        + {plan.features.length - 6} more features
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={isCurrentPlan}
                    className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 transform shadow-lg ${
                      isCurrentPlan
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : plan.recommended || plan.premium
                        ? `bg-gradient-to-r ${plan.gradient} text-white hover:shadow-xl hover:scale-105`
                        : 'bg-white text-gray-800 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center justify-center">
                      {isCurrentPlan ? (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Current Plan
                        </>
                      ) : (
                        <>
                          Get Started
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </span>
                  </button>

                  {/* Bottom Description */}
                  <p className="mt-4 text-xs text-center text-gray-600">
                    {plan.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Section */}
      <div className="mt-16">
        <div className="p-8 bg-white shadow-xl rounded-2xl">
          <h3 className="mb-8 text-2xl font-bold text-center text-gray-900">
            Why 23,000+ Members Trust MediCureOn
          </h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="text-center group">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-all duration-300 bg-blue-100 rounded-full group-hover:bg-blue-200 group-hover:scale-110">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Bank-Level Security</h4>
              <p className="mt-1 text-sm text-gray-600">256-bit SSL encryption</p>
            </div>
            <div className="text-center group">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-all duration-300 bg-yellow-100 rounded-full group-hover:bg-yellow-200 group-hover:scale-110">
                <Zap className="w-8 h-8 text-yellow-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Instant Activation</h4>
              <p className="mt-1 text-sm text-gray-600">Start using immediately</p>
            </div>
            <div className="text-center group">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-all duration-300 bg-green-100 rounded-full group-hover:bg-green-200 group-hover:scale-110">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900">30-Day Guarantee</h4>
              <p className="mt-1 text-sm text-gray-600">Full refund if not satisfied</p>
            </div>
            <div className="text-center group">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-all duration-300 bg-purple-100 rounded-full group-hover:bg-purple-200 group-hover:scale-110">
                <Phone className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900">24/7 Support</h4>
              <p className="mt-1 text-sm text-gray-600">Always here to help</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="p-8 mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
        <h3 className="mb-4 text-xl font-bold text-center text-gray-900">
          Frequently Asked Questions
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="p-4 bg-white rounded-lg">
            <h4 className="font-semibold text-gray-900">Can I change plans anytime?</h4>
            <p className="mt-1 text-sm text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <h4 className="font-semibold text-gray-900">Is my data secure?</h4>
            <p className="mt-1 text-sm text-gray-600">Absolutely. We use bank-level encryption and comply with HIPAA, GDPR, and PDPA regulations.</p>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <h4 className="font-semibold text-gray-900">What payment methods do you accept?</h4>
            <p className="mt-1 text-sm text-gray-600">We accept all major credit cards, debit cards, and digital wallets through Stripe.</p>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <h4 className="font-semibold text-gray-900">Can I cancel anytime?</h4>
            <p className="mt-1 text-sm text-gray-600">Yes, you can cancel your subscription anytime. You'll retain access until the end of your billing period.</p>
          </div>
        </div>
      </div>

      {/* Enhanced Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden bg-white shadow-2xl rounded-2xl">
            <div className="relative overflow-hidden bg-gradient-to-r from-[#02276F] to-[#033A8E] p-6">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)',
                  backgroundSize: '15px 15px'
                }}></div>
              </div>
              <div className="relative flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Complete Your Subscription</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-white transition-opacity hover:opacity-75"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Selected Plan Summary */}
              <div className={`p-4 mb-6 rounded-xl bg-gradient-to-br ${selectedPlan.cardGradient} border border-gray-200`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${selectedPlan.gradient} flex items-center justify-center mr-3`}>
                      <selectedPlan.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{selectedPlan.name} Plan</h4>
                      <p className="text-sm text-gray-600">Billed annually</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">${selectedPlan.price}</p>
                    <p className="text-sm text-gray-600">/year</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/50">
                  <span className="text-sm text-gray-600">Monthly equivalent</span>
                  <span className="font-semibold text-gray-900">${selectedPlan.monthlyEquivalent}/mo</span>
                </div>
              </div>

              {/* Security Features */}
              <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                <div className="p-3 rounded-lg bg-gray-50">
                  <Shield className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                  <p className="text-xs text-gray-600">Secure</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <Lock className="w-5 h-5 mx-auto mb-1 text-green-600" />
                  <p className="text-xs text-gray-600">Encrypted</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <CheckCircle className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                  <p className="text-xs text-gray-600">Verified</p>
                </div>
              </div>

              {/* Payment Message */}
              <div className="mb-6 text-center">
                <p className="text-gray-600">
                  You'll be securely redirected to complete your payment
                </p>
                {stripeConfig.testMode && (
                  <div className="inline-flex items-center px-3 py-1 mt-2 text-xs font-medium text-orange-700 bg-orange-100 rounded-full">
                    Test Mode: Use card 4242 4242 4242 4242
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={processPayment}
                  disabled={loading}
                  className="relative w-full px-4 py-4 overflow-hidden font-semibold text-white transition-all duration-300 rounded-xl hover:shadow-lg disabled:opacity-50 group"
                  style={{ backgroundColor: '#02276F' }}
                >
                  <span className="relative flex items-center justify-center">
                    {loading ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Continue to Secure Payment
                        <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                </button>
                
                <p className="text-xs text-center text-gray-500">
                  Powered by Stripe • 256-bit SSL Encryption • PCI Compliant
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </PlanDashboardLayout>
  );
};

export default SubscriptionPlans;