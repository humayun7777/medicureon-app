// src/components/dashboard/WorldClassLandingPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Activity, Droplets, Scale, Heart, Brain, Moon, Trophy, Target, 
  Zap, TrendingUp, Sparkles, Crown, Coffee, Sun, Sunset, Shield,
  Watch, Flame, AlertCircle, CheckCircle, Clock, Calendar,
  ChevronRight, Plus, Camera, Utensils, Pill, Thermometer,
  ArrowUp, ArrowDown, BarChart3, Smartphone, RefreshCw
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, RadialBarChart, RadialBar, 
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { useMediCureOnData } from '../../hooks/useMediCureOnData';
import MediCureOnSidebar from '../common/MediCureOnSidebar';
import MediCureOnHeader from '../common/MediCureOnHeader';
import iomtApiService from '../../services/iomtApiService';
import manualTrackingService from '../../services/manualTrackingService';
import challengeService from '../../services/challengeService';

const LandingPage = ({ onNavigate }) => {
  const { user, userInfo, logout, isLoading } = useAuth();
  const { 
    profilePicture, 
    getUserDisplayName,
    getGreeting,
    userSubscription,
    profileData,
    isLoading: dataLoading,
    refreshAll
  } = useMediCureOnData();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview'); // overview, nutrition, vitals
  
  // Comprehensive health state
  const [healthData, setHealthData] = useState({
    score: {
      overall: 0,
      components: {
        activity: 0,
        nutrition: 0,
        sleep: 0,
        vitals: 0,
        mental: 0
      },
      trend: 0,
      status: 'calculating'
    },
    realTimeMetrics: {
      heartRate: 0,
      steps: 0,
      calories: 0,
      water: 0,
      sleep: 0,
      stress: 'Low',
      mood: 'Good'
    },
    activePlan: null,
    aiInsights: [],
    nutritionLog: [],
    medications: [],
    vitals: {}
  });

  // Get time-based greeting
  const getTimeBasedContent = () => {
    const hour = currentTime.getHours();
    let message = '';
    let icon = null;
    
    if (hour >= 5 && hour < 12) {
      icon = <Coffee className="w-4 h-4" />;
      message = hour < 8 ? 'Rise and shine! Start your day right' : 'Good morning! Stay energized';
    } else if (hour >= 12 && hour < 17) {
      icon = <Sun className="w-4 h-4" />;
      message = 'Keep up the great work today';
    } else if (hour >= 17 && hour < 21) {
      icon = <Sunset className="w-4 h-4" />;
      message = 'Evening check-in time';
    } else {
      icon = <Moon className="w-4 h-4" />;
      message = 'Rest well for tomorrow';
    }
    
    return { message, icon };
  };

  const { message, icon: timeIcon } = getTimeBasedContent();

  // Custom header badges
  const customBadges = [
    {
      text: `Level ${Math.floor(healthData.score.overall / 10) || 1}`,
      className: "flex items-center px-3 py-1.5 bg-[#F1C40F]/20 backdrop-blur-sm rounded-full border border-[#F1C40F]/30",
      icon: () => <Crown className="w-3 h-3 text-[#F1C40F] mr-1.5" />
    },
    {
      text: `${profileData?.rewardPoints || 0} Coins`,
      className: "flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full",
      icon: () => <Trophy className="w-3 h-3 text-white mr-1.5" />
    }
  ];

  // Loading state
  if (isLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Loading Your Health Dashboard</h2>
          <p className="text-gray-600">Preparing your personalized insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <MediCureOnSidebar onNavigate={onNavigate} activePage="landing" />
      
      <div className="flex-1 overflow-auto">
        <MediCureOnHeader
          subtitle={<div className="flex items-center space-x-2"><span>{message}</span>{timeIcon}</div>}
          customBadges={customBadges}
          showRefresh={true}
          onRefresh={refreshAll}
        />

        <div className="p-6">
          {/* Hero Health Score Section */}
          <div className="mb-8">
            <HealthScoreHero healthData={healthData} profileData={profileData} />
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="flex p-1 space-x-1 bg-gray-100 rounded-xl">
              {['overview', 'nutrition', 'vitals'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                    activeTab === tab
                      ? 'bg-white text-[#02276F] shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <OverviewTab healthData={healthData} onNavigate={onNavigate} profileData={profileData} user={user} />
          )}
          
          {activeTab === 'nutrition' && (
            <NutritionTab healthData={healthData} setHealthData={setHealthData} />
          )}
          
          {activeTab === 'vitals' && (
            <VitalsTab healthData={healthData} profileData={profileData} />
          )}
        </div>
      </div>
    </div>
  );
};

// Hero Health Score Component
const HealthScoreHero = ({ healthData, profileData }) => {
  const getScoreColor = (score) => {
    if (score >= 90) return '#00FC14';
    if (score >= 80) return '#10B981';
    if (score >= 70) return '#F1C40F';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const scoreColor = getScoreColor(healthData.score.overall);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#02276F] via-blue-700 to-blue-800 rounded-2xl p-8 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute bg-white rounded-full -top-24 -right-24 w-96 h-96 blur-3xl"></div>
        <div className="absolute bg-blue-400 rounded-full -bottom-24 -left-24 w-96 h-96 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Your Health Dashboard</h1>
            <p className="text-blue-100">Real-time health monitoring & AI-powered insights</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-blue-100">Active Plan</p>
              <p className="font-semibold">{profileData?.enrolledPlans?.[0]?.name || 'No active plan'}</p>
            </div>
            <Watch className="w-8 h-8 opacity-50" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Score */}
          <div className="lg:col-span-1">
            <div className="p-6 bg-white/10 backdrop-blur-lg rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Overall Health Score</h3>
                <Shield className="w-5 h-5" />
              </div>
              
              <div className="relative flex items-center justify-center h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="90%"
                    data={[{ value: healthData.score.overall, fill: scoreColor }]}
                    startAngle={180}
                    endAngle={-180}
                  >
                    <RadialBar
                      dataKey="value"
                      cornerRadius={10}
                      fill={scoreColor}
                      background={{ fill: 'rgba(255,255,255,0.1)' }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold">{healthData.score.overall}%</span>
                  <span className="text-sm opacity-80">{healthData.score.status}</span>
                </div>
              </div>

              {/* Score Components */}
              <div className="grid grid-cols-5 gap-2 mt-4">
                {Object.entries(healthData.score.components).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-xs capitalize opacity-70">{key}</div>
                    <div className="text-sm font-semibold">{value}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Metrics */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[
                { icon: Heart, label: 'Heart Rate', value: `${healthData.realTimeMetrics.heartRate} bpm`, color: 'from-red-400 to-red-600' },
                { icon: Activity, label: 'Steps', value: healthData.realTimeMetrics.steps.toLocaleString(), color: 'from-blue-400 to-blue-600' },
                { icon: Flame, label: 'Calories', value: `${healthData.realTimeMetrics.calories} kcal`, color: 'from-orange-400 to-orange-600' },
                { icon: Droplets, label: 'Water', value: `${healthData.realTimeMetrics.water}/8 glasses`, color: 'from-cyan-400 to-cyan-600' },
                { icon: Moon, label: 'Sleep', value: `${healthData.realTimeMetrics.sleep}h`, color: 'from-purple-400 to-purple-600' },
                { icon: Brain, label: 'Stress', value: healthData.realTimeMetrics.stress, color: 'from-green-400 to-green-600' },
                { icon: Thermometer, label: 'Temperature', value: '98.6°F', color: 'from-yellow-400 to-yellow-600' },
                { icon: Pill, label: 'Medications', value: `${healthData.medications.length} active`, color: 'from-pink-400 to-pink-600' }
              ].map((metric, idx) => (
                <div key={idx} className="p-4 transition-all cursor-pointer bg-white/10 backdrop-blur-lg rounded-xl hover:bg-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <metric.icon className="w-5 h-5 opacity-80" />
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${metric.color} animate-pulse`}></div>
                  </div>
                  <p className="text-xs opacity-70">{metric.label}</p>
                  <p className="text-lg font-semibold">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ healthData, onNavigate, profileData, user }) => {
  const activePlan = profileData?.enrolledPlans?.[0];
  
  return (
    <div className="space-y-6">
      {/* AI Insights for Active Plan */}
      <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              AI Insights - {activePlan?.name || 'General Health'}
            </h3>
            <p className="text-sm text-gray-600">Personalized recommendations from Aman AI</p>
          </div>
          <Sparkles className="w-6 h-6 text-purple-500" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {getAIInsights(activePlan, healthData).map((insight, idx) => (
            <div key={idx} className="p-4 transition-shadow bg-white rounded-lg shadow-sm hover:shadow-md">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${insight.type === 'success' ? 'bg-green-100' : insight.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                  {insight.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                   insight.type === 'warning' ? <AlertCircle className="w-5 h-5 text-yellow-600" /> :
                   <TrendingUp className="w-5 h-5 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <h4 className="mb-1 font-medium text-gray-900">{insight.title}</h4>
                  <p className="text-sm text-gray-600">{insight.message}</p>
                  {insight.action && (
                    <button className="mt-2 text-sm font-medium text-[#02276F] hover:text-blue-800">
                      {insight.action} →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => onNavigate('ai-coach')}
          className="w-full py-3 mt-4 font-medium text-white transition-opacity rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
        >
          Chat with Aman AI for More Insights
        </button>
      </div>

      {/* Activity & Goals Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Today's Activity */}
        <div className="p-6 bg-white shadow-sm rounded-xl">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Today's Activity</h3>
          
          <div className="space-y-4">
            <ActivityRing 
              steps={healthData.realTimeMetrics.steps} 
              calories={healthData.realTimeMetrics.calories}
              activeMinutes={45}
            />
            
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Daily Goal Progress</span>
                <span className="font-semibold text-[#02276F]">
                  {Math.round((healthData.realTimeMetrics.steps / 10000) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Challenges */}
        <div className="p-6 bg-white shadow-sm rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Challenges</h3>
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>
          
          <ActiveChallenges userId={user?.localAccountId} onNavigate={onNavigate} />
        </div>
      </div>

      {/* Health Trends */}
      <div className="p-6 bg-white shadow-sm rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">7-Day Health Trends</h3>
          <select className="px-3 py-1 text-sm border border-gray-200 rounded-lg">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
        
        <HealthTrendsChart />
      </div>
    </div>
  );
};

// Nutrition Tab Component
const NutritionTab = ({ healthData, setHealthData }) => {
  const [showFoodScanner, setShowFoodScanner] = useState(false);
  const [mealType, setMealType] = useState('breakfast');
  
  return (
    <div className="space-y-6">
      {/* Nutrition Score */}
      <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Today's Nutrition</h3>
          <Utensils className="w-6 h-6 text-green-600" />
        </div>
        
        <NutritionScore />
      </div>

      {/* Quick Add Meals */}
      <div className="p-6 bg-white shadow-sm rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Track Your Meals</h3>
          <button
            onClick={() => setShowFoodScanner(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-[#02276F] text-white rounded-lg hover:opacity-90"
          >
            <Camera className="w-4 h-4" />
            <span>Scan Food</span>
          </button>
        </div>

        <MealTracker mealType={mealType} setMealType={setMealType} />
      </div>

      {/* Food Partners */}
      <div className="p-6 bg-white shadow-sm rounded-xl">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Healthy Food Partners</h3>
        <FoodPartners />
      </div>
    </div>
  );
};

// Vitals Tab Component
const VitalsTab = ({ healthData, profileData }) => {
  return (
    <div className="space-y-6">
      {/* Vital Signs Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <VitalCard
          title="Blood Pressure"
          value="120/80"
          unit="mmHg"
          status="normal"
          lastUpdated="2 hours ago"
          trend={[120, 118, 122, 119, 120]}
          icon={Heart}
        />
        
        <VitalCard
          title="Blood Sugar"
          value="95"
          unit="mg/dL"
          status="normal"
          lastUpdated="After breakfast"
          trend={[90, 95, 92, 98, 95]}
          icon={Droplets}
        />
        
        <VitalCard
          title="Body Weight"
          value={profileData?.weight || "75"}
          unit="kg"
          status="improving"
          lastUpdated="This morning"
          trend={[76, 75.5, 75.2, 75.1, 75]}
          icon={Scale}
        />
      </div>

      {/* Medications */}
      <div className="p-6 bg-white shadow-sm rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Medications</h3>
          <Pill className="w-5 h-5 text-purple-600" />
        </div>
        
        <MedicationTracker medications={profileData?.medications || []} />
      </div>

      {/* Health Reports */}
      <div className="p-6 bg-white shadow-sm rounded-xl">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Reports</h3>
        <HealthReports />
      </div>
    </div>
  );
};

// Helper Components

const ActivityRing = ({ steps, calories, activeMinutes }) => {
  const stepsProgress = (steps / 10000) * 100;
  const caloriesProgress = (calories / 500) * 100;
  const activeProgress = (activeMinutes / 30) * 100;
  
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full transform -rotate-90">
          {/* Steps Ring */}
          <circle cx="96" cy="96" r="88" stroke="#E5E7EB" strokeWidth="8" fill="none" />
          <circle 
            cx="96" cy="96" r="88" 
            stroke="#02276F" 
            strokeWidth="8" 
            fill="none"
            strokeDasharray={`${2 * Math.PI * 88}`}
            strokeDashoffset={`${2 * Math.PI * 88 * (1 - stepsProgress / 100)}`}
            className="transition-all duration-500"
          />
          
          {/* Calories Ring */}
          <circle cx="96" cy="96" r="72" stroke="#E5E7EB" strokeWidth="8" fill="none" />
          <circle 
            cx="96" cy="96" r="72" 
            stroke="#F1C40F" 
            strokeWidth="8" 
            fill="none"
            strokeDasharray={`${2 * Math.PI * 72}`}
            strokeDashoffset={`${2 * Math.PI * 72 * (1 - caloriesProgress / 100)}`}
            className="transition-all duration-500"
          />
          
          {/* Active Minutes Ring */}
          <circle cx="96" cy="96" r="56" stroke="#E5E7EB" strokeWidth="8" fill="none" />
          <circle 
            cx="96" cy="96" r="56" 
            stroke="#00FC14" 
            strokeWidth="8" 
            fill="none"
            strokeDasharray={`${2 * Math.PI * 56}`}
            strokeDashoffset={`${2 * Math.PI * 56 * (1 - activeProgress / 100)}`}
            className="transition-all duration-500"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Activity className="w-8 h-8 mb-1 text-gray-600" />
          <span className="text-2xl font-bold text-gray-900">{Math.round(stepsProgress)}%</span>
          <span className="text-xs text-gray-600">Daily Goal</span>
        </div>
      </div>
    </div>
  );
};

const ActiveChallenges = ({ userId, onNavigate }) => {
  const [challenges, setChallenges] = useState([]);
  
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const data = await challengeService.getUserChallenges(userId);
        setChallenges(data.active || []);
      } catch (error) {
        console.error('Error fetching challenges:', error);
      }
    };
    
    if (userId) fetchChallenges();
  }, [userId]);
  
  if (challenges.length === 0) {
    return (
      <div className="py-8 text-center">
        <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="mb-4 text-gray-600">No active challenges</p>
        <button 
          onClick={() => onNavigate('challenges')}
          className="text-sm font-medium text-[#02276F] hover:text-blue-800"
        >
          Browse Challenges →
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {challenges.slice(0, 3).map((challenge, idx) => (
        <div key={idx} className="p-3 rounded-lg bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-900">{challenge.name}</span>
            <span className="text-xs text-gray-600">{challenge.daysRemaining}d left</span>
          </div>
          <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full">
            <div 
              className="h-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-purple-500"
              style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-600">
              {challenge.progress.toLocaleString()} / {challenge.target.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-purple-600">
              {Math.round((challenge.progress / challenge.target) * 100)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const HealthTrendsChart = () => {
  const data = [
    { day: 'Mon', steps: 8234, calories: 420, sleep: 7.2, heartRate: 72 },
    { day: 'Tue', steps: 10123, calories: 520, sleep: 6.8, heartRate: 70 },
    { day: 'Wed', steps: 7890, calories: 380, sleep: 7.5, heartRate: 68 },
    { day: 'Thu', steps: 12456, calories: 610, sleep: 7.0, heartRate: 71 },
    { day: 'Fri', steps: 9876, calories: 480, sleep: 6.5, heartRate: 73 },
    { day: 'Sat', steps: 11234, calories: 550, sleep: 8.2, heartRate: 69 },
    { day: 'Sun', steps: 6543, calories: 320, sleep: 8.5, heartRate: 67 }
  ];
  
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip />
          <Line type="monotone" dataKey="steps" stroke="#02276F" strokeWidth={2} dot={{ fill: '#02276F' }} />
          <Line type="monotone" dataKey="calories" stroke="#F1C40F" strokeWidth={2} dot={{ fill: '#F1C40F' }} />
          <Line type="monotone" dataKey="heartRate" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const NutritionScore = () => {
  const nutritionData = {
    calories: { consumed: 1650, target: 2000 },
    protein: { consumed: 85, target: 100 },
    carbs: { consumed: 180, target: 250 },
    fat: { consumed: 55, target: 65 },
    fiber: { consumed: 22, target: 30 }
  };
  
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      {Object.entries(nutritionData).map(([nutrient, values]) => (
        <div key={nutrient} className="p-4 bg-white rounded-lg">
          <p className="mb-1 text-xs text-gray-600 capitalize">{nutrient}</p>
          <p className="text-xl font-bold text-gray-900">{values.consumed}</p>
          <p className="text-xs text-gray-500">of {values.target}g</p>
          <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-500 bg-green-500"
              style={{ width: `${Math.min(100, (values.consumed / values.target) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const MealTracker = ({ mealType, setMealType }) => {
  const meals = {
    breakfast: { icon: '🌅', time: '7:30 AM', calories: 420 },
    lunch: { icon: '☀️', time: '12:30 PM', calories: 650 },
    dinner: { icon: '🌙', time: '7:00 PM', calories: 580 },
    snacks: { icon: '🍎', time: 'Various', calories: 200 }
  };
  
  return (
    <div>
      <div className="flex mb-4 space-x-2">
        {Object.entries(meals).map(([type, meal]) => (
          <button
            key={type}
            onClick={() => setMealType(type)}
            className={`flex-1 p-3 rounded-lg border transition-all ${
              mealType === type 
                ? 'border-[#02276F] bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-2xl">{meal.icon}</span>
            <p className="mt-1 text-sm font-medium capitalize">{type}</p>
            <p className="text-xs text-gray-600">{meal.calories} cal</p>
          </button>
        ))}
      </div>
      
      <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#02276F] transition-colors">
        <Plus className="w-5 h-5 mx-auto mb-1 text-gray-400" />
        <span className="text-sm text-gray-600">Add {mealType}</span>
      </button>
    </div>
  );
};

const FoodPartners = () => {
  const partners = [
    { name: 'FreshMeals Pro', description: 'Pre-calculated nutrition meals', discount: '20% off', logo: '🥗' },
    { name: 'NutriBox', description: 'Personalized meal plans', discount: '15% off', logo: '📦' },
    { name: 'HealthyBites', description: 'Organic meal delivery', discount: 'Free delivery', logo: '🌱' }
  ];
  
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {partners.map((partner, idx) => (
        <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:border-[#02276F] transition-colors cursor-pointer">
          <div className="mb-2 text-3xl">{partner.logo}</div>
          <h4 className="font-semibold text-gray-900">{partner.name}</h4>
          <p className="mb-2 text-sm text-gray-600">{partner.description}</p>
          <p className="text-sm font-medium text-green-600">{partner.discount}</p>
        </div>
      ))}
    </div>
  );
};

const VitalCard = ({ title, value, unit, status, lastUpdated, trend, icon: Icon }) => {
  const statusColors = {
    normal: 'text-green-600 bg-green-50',
    warning: 'text-yellow-600 bg-yellow-50',
    critical: 'text-red-600 bg-red-50',
    improving: 'text-blue-600 bg-blue-50'
  };
  
  return (
    <div className="p-6 transition-shadow bg-white shadow-sm rounded-xl hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="flex items-baseline mb-2 space-x-2">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        <span className="text-sm text-gray-600">{unit}</span>
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[status]}`}>
          {status}
        </span>
        <span className="text-xs text-gray-500">{lastUpdated}</span>
      </div>
      
      <div className="h-12">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trend.map((v, i) => ({ value: v }))}>
            <Line type="monotone" dataKey="value" stroke="#02276F" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const MedicationTracker = ({ medications }) => {
  const mockMedications = [
    { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', time: '8:00 AM, 8:00 PM', taken: true },
    { name: 'Vitamin D', dosage: '1000 IU', frequency: 'Once daily', time: '9:00 AM', taken: false }
  ];
  
  const meds = medications.length > 0 ? medications : mockMedications;
  
  return (
    <div className="space-y-3">
      {meds.map((med, idx) => (
        <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              med.taken ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              <Pill className={`w-6 h-6 ${med.taken ? 'text-green-600' : 'text-yellow-600'}`} />
            </div>
            <div>
              <h5 className="font-medium text-gray-900">{med.name}</h5>
              <p className="text-sm text-gray-600">{med.dosage} • {med.frequency}</p>
              <p className="text-xs text-gray-500">{med.time}</p>
            </div>
          </div>
          <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            med.taken 
              ? 'bg-green-100 text-green-700' 
              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
          }`}>
            {med.taken ? 'Taken ✓' : 'Mark as taken'}
          </button>
        </div>
      ))}
    </div>
  );
};

const HealthReports = () => {
  const reports = [
    { type: 'Blood Work', date: '2024-06-15', status: 'Reviewed', icon: Droplets },
    { type: 'ECG Report', date: '2024-06-10', status: 'Pending Review', icon: Heart },
    { type: 'X-Ray Results', date: '2024-06-01', status: 'Normal', icon: Activity }
  ];
  
  return (
    <div className="space-y-3">
      {reports.map((report, idx) => (
        <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#02276F] transition-colors cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <report.icon className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h5 className="font-medium text-gray-900">{report.type}</h5>
              <p className="text-sm text-gray-600">{report.date}</p>
            </div>
          </div>
          <span className={`text-sm font-medium ${
            report.status === 'Normal' ? 'text-green-600' :
            report.status === 'Pending Review' ? 'text-yellow-600' :
            'text-blue-600'
          }`}>
            {report.status}
          </span>
        </div>
      ))}
    </div>
  );
};

// AI Insights Generator
const getAIInsights = (activePlan, healthData) => {
  const planInsights = {
    'weight-loss': [
      {
        type: 'success',
        title: 'Great Progress!',
        message: 'You\'ve lost 2kg this month. Keep up the consistent effort!',
        action: 'View weight trend'
      },
      {
        type: 'warning',
        title: 'Calorie Alert',
        message: 'You\'re 300 calories over budget today. Try a lighter dinner.',
        action: 'See meal suggestions'
      },
      {
        type: 'tip',
        title: 'Activity Boost',
        message: '2,000 more steps today will help you reach your weekly goal.',
        action: 'Start walking session'
      }
    ],
    'diabetes': [
      {
        type: 'success',
        title: 'Stable Glucose',
        message: 'Your blood sugar has been stable for 7 days straight!',
        action: 'View glucose trends'
      },
      {
        type: 'warning',
        title: 'Meal Timing',
        message: 'Consider having smaller, more frequent meals for better control.',
        action: 'Adjust meal plan'
      },
      {
        type: 'tip',
        title: 'Exercise Window',
        message: 'Best time for exercise: 30 mins after your next meal.',
        action: 'Schedule workout'
      }
    ],
    'default': [
      {
        type: 'success',
        title: 'Health Score Up!',
        message: 'Your overall health score improved by 5% this week.',
        action: 'See what changed'
      },
      {
        type: 'tip',
        title: 'Hydration Goal',
        message: 'You\'re 3 glasses away from your daily water target.',
        action: 'Set reminder'
      },
      {
        type: 'warning',
        title: 'Sleep Pattern',
        message: 'Your sleep has been irregular. Try a consistent bedtime.',
        action: 'View sleep tips'
      }
    ]
  };
  
  return planInsights[activePlan?.type] || planInsights.default;
};

export default LandingPage;