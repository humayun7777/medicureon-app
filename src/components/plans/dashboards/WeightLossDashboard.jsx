import React, { useState, useEffect } from 'react';
import { 
  Activity,
  TrendingUp,
  Droplets,
  Flame,
  Target,
  ChevronRight,
  Plus,
  Minus,
  Scale,
  Apple,
  Timer,
  Trophy,
  Heart,
  Zap,
  ExternalLink,
  TrendingDown,
  Bot,
  Brain,
  Sparkles,
  Clock
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import PlanDashboardLayout from '../../common/PlanDashboardLayout';
import { fetchRealTimeData } from '../../../hooks/useMediCureOnData';

const WeightLossDashboard = ({ onNavigate }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('monthly');
  const [selectedGoalTimeframe, setSelectedGoalTimeframe] = useState('weekly');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [aiGoalWeight, setAiGoalWeight] = useState(60);
  const [aiTimeframe, setAiTimeframe] = useState(3);
  
  // Real-time IoMT data states
  const [realtimeMetrics, setRealtimeMetrics] = useState({
    currentWeight: null,
    heartRate: null,
    steps: null,
    lastUpdated: null
  });

  // Fetch real-time IoMT data for critical metrics
  useEffect(() => {
    const fetchRealtimeData = async () => {
      try {
        // This would be your actual IoMT endpoint
        // Using fetchRealTimeData to bypass cache for critical health data
        const response = await fetchRealTimeData('/api/iomt/weight-loss/realtime', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setRealtimeMetrics(data);
        }
      } catch (error) {
        console.error('Error fetching real-time data:', error);
      }
    };

    // Fetch immediately
    fetchRealtimeData();
    
    // Set up polling for real-time data every 30 seconds
    const interval = setInterval(fetchRealtimeData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Mock data - will be replaced with real IoMT data
  const weightData = [
    { month: 'Sept', weight: 83, target: 85 },
    { month: 'Oct', weight: 80, target: 82 },
    { month: 'Nov', weight: 76, target: 78 },
    { month: 'Dec', weight: 72, target: 75 }
  ];

  const goalProgressData = [
    { day: 'Mon', steps: 8000, calories: 2200, water: 7 },
    { day: 'Tue', steps: 6500, calories: 2400, water: 8 },
    { day: 'Wed', steps: 9000, calories: 2100, water: 6 },
    { day: 'Thu', steps: 7500, calories: 2300, water: 9 },
    { day: 'Fri', steps: 10000, calories: 2000, water: 8 },
    { day: 'Sat', steps: 5000, calories: 2500, water: 7 },
    { day: 'Sun', steps: 6000, calories: 2400, water: 8 }
  ];

  const featuredMeals = [
    { name: "Avocado salad", calories: 320, protein: 8, carbs: 15, fat: 12, image: "🥗" },
    { name: "Tuna with zucchini", calories: 280, protein: 35, carbs: 8, fat: 6, image: "🐟" }
  ];

  const bodyMetrics = {
    muscleMass: 45.2,
    bodyFat: 22.5,
    visceralFat: 8,
    boneMass: 3.2,
    metabolicAge: 28,
    bmr: 1650
  };

  const weeklyActivities = [
    { activity: "Walking", duration: "45 min", calories: 180 },
    { activity: "Strength Training", duration: "30 min", calories: 220 },
    { activity: "Yoga", duration: "60 min", calories: 150 }
  ];

  // Custom badges for this plan
  const customBadges = [
    {
      text: realtimeMetrics.currentWeight ? `${realtimeMetrics.currentWeight}kg Current` : '10kg Lost',
      className: "flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full",
      icon: () => <Activity className="w-3 h-3 text-white mr-1.5" />
    }
  ];

  return (
    <PlanDashboardLayout
      planId={1}
      planName="Weight Loss Excellence"
      subtitle="Your Weight Loss Journey Dashboard ✨"
      customBadges={customBadges}
      onNavigate={onNavigate}
      showDevelopmentBanner={true}
    >
      {/* Tabs */}
      <div className="flex mb-6 space-x-6">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`pb-2 font-semibold transition-all ${
            activeTab === 'dashboard' 
              ? 'text-[#02276F] border-b-2 border-[#02276F]' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Weight Loss Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('ai-coach')}
          className={`pb-2 font-semibold transition-all flex items-center space-x-2 ${
            activeTab === 'ai-coach' 
              ? 'text-[#02276F] border-b-2 border-[#02276F]' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Aman AI Coach</span>
        </button>
      </div>

      {activeTab === 'dashboard' ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-4">
            {/* Weight Progress Card */}
            <div className="p-6 bg-white shadow-sm lg:col-span-1 rounded-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Start weight</p>
                  <p className="text-2xl font-bold">75kg</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Current weight</p>
                  <p className="text-3xl font-bold text-[#02276F]">
                    {realtimeMetrics.currentWeight || 65}kg
                  </p>
                  {realtimeMetrics.lastUpdated && (
                    <p className="mt-1 text-xs text-gray-400">
                      Updated {new Date(realtimeMetrics.lastUpdated).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="relative h-2 overflow-hidden bg-gray-200 rounded-full">
                <div className="absolute top-0 left-0 w-2/3 h-full rounded-full bg-gradient-to-r from-red-500 to-green-500"></div>
              </div>
              <p className="mt-2 text-xs text-gray-500">25% done</p>
            </div>

            {/* Steps Card */}
            <div className="bg-[#02276F] text-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-white rounded-lg bg-opacity-20">
                    <Activity className="w-5 h-5" />
                  </div>
                  <span className="font-semibold">Steps</span>
                </div>
              </div>
              <p className="mb-1 text-3xl font-bold">{realtimeMetrics.steps || 2500}</p>
              <p className="text-sm opacity-80">Steps</p>
              <div className="p-2 mt-4 bg-white rounded-lg bg-opacity-20">
                <p className="text-xs">50% of your goals</p>
              </div>
            </div>

            {/* Calories Card */}
            <div className="p-6 text-gray-900 bg-yellow-400 shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-white rounded-lg bg-opacity-30">
                    <Flame className="w-5 h-5" />
                  </div>
                  <span className="font-semibold">Calories</span>
                </div>
              </div>
              <div className="flex items-baseline space-x-1">
                <p className="text-3xl font-bold">750</p>
                <p className="text-sm">/</p>
                <p className="text-sm">1566 KCAL</p>
              </div>
              <div className="h-2 mt-2 overflow-hidden bg-white rounded-full bg-opacity-30">
                <div className="w-1/2 h-full bg-white rounded-full"></div>
              </div>
            </div>

            {/* Water Card */}
            <div className="p-6 text-white bg-blue-400 shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-white rounded-lg bg-opacity-20">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <span className="font-semibold">Water</span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <p className="mb-1 text-3xl font-bold">1.25</p>
                <p className="text-sm opacity-80">Liters</p>
                <div className="w-full mt-4">
                  <div className="h-2 overflow-hidden bg-white rounded-full bg-opacity-30">
                    <div className="h-full bg-white rounded-full w-5/8" style={{ width: '62.5%' }}></div>
                  </div>
                  <p className="mt-1 text-xs text-center">5 of 8 glasses</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
            {/* Weight Over Time Chart */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Weight Over Time</h3>
                <select 
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="px-3 py-1 text-sm border rounded-lg"
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[60, 90]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="weight" stroke="#02276F" fill="#02276F" fillOpacity={0.1} />
                  <Line type="monotone" dataKey="target" stroke="#ff6b6b" strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Goal Progress Chart */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Goal Progress</h3>
                <select 
                  value={selectedGoalTimeframe}
                  onChange={(e) => setSelectedGoalTimeframe(e.target.value)}
                  className="px-3 py-1 text-sm border rounded-lg"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={goalProgressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="steps" fill="#02276F" radius={[8, 8, 0, 0]} barSize={20} />
                  <Bar dataKey="calories" fill="#FDB931" radius={[8, 8, 0, 0]} barSize={20} />
                  <Bar dataKey="water" fill="#60A5FA" radius={[8, 8, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Row - BMI, Calories, Diet Menu */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* BMI Card */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">BMI</h3>
                <Scale className="w-5 h-5 text-gray-400" />
              </div>
              <p className="mb-2 text-xs text-gray-500">21 Jan, 2025 at 10:10</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-bold">22.5</p>
              </div>
              <div className="mt-4">
                <div className="relative h-2 rounded-full bg-gradient-to-r from-blue-400 via-green-400 to-red-400">
                  <div className="absolute w-3 h-3 bg-white border-2 border-gray-800 rounded-full" 
                    style={{ left: '40%', top: '-2px' }}></div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>18.5</span>
                  <span>25</span>
                  <span>30</span>
                </div>
              </div>
            </div>

            {/* My Calories */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="mb-4 font-semibold text-gray-900">My calories</h3>
              <div className="flex justify-center space-x-6">
                <div className="text-center">
                  <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle cx="40" cy="40" r="30" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                      <circle cx="40" cy="40" r="30" stroke="#22c55e" strokeWidth="8" fill="none" 
                        strokeDasharray={`${2 * Math.PI * 30 * 0.5} ${2 * Math.PI * 30}`} 
                        strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-lg font-bold">50%</p>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Carbohydrates</p>
                </div>
                <div className="text-center">
                  <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle cx="40" cy="40" r="30" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                      <circle cx="40" cy="40" r="30" stroke="#3b82f6" strokeWidth="8" fill="none" 
                        strokeDasharray={`${2 * Math.PI * 30 * 0.74} ${2 * Math.PI * 30}`} 
                        strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-lg font-bold">74%</p>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Protein</p>
                </div>
                <div className="text-center">
                  <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle cx="40" cy="40" r="30" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                      <circle cx="40" cy="40" r="30" stroke="#fbbf24" strokeWidth="8" fill="none" 
                        strokeDasharray={`${2 * Math.PI * 30 * 0.15} ${2 * Math.PI * 30}`} 
                        strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-lg font-bold">15%</p>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Fat</p>
                </div>
              </div>
            </div>

            {/* Featured Diet Menu */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Featured Diet Menu</h3>
                <button className="p-1 rounded hover:bg-gray-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
              <div className="space-y-3">
                {featuredMeals.map((meal, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{meal.image}</div>
                      <div>
                        <p className="text-sm font-medium">{meal.name}</p>
                        <p className="text-xs text-gray-500">{meal.calories} calories • P{meal.protein}g</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
              <button className="w-full mt-3 py-2 bg-[#02276F] text-white rounded-lg hover:bg-[#02276F]/90 flex items-center justify-center space-x-2">
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm">Browse Partner Meals</span>
              </button>
            </div>
          </div>

          {/* Additional Features - Body Composition & Activities */}
          <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
            {/* Body Composition */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="mb-4 font-semibold text-gray-900">Body Composition Analysis</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 text-center rounded-lg bg-gray-50">
                  <Heart className="w-6 h-6 mx-auto mb-2 text-red-500" />
                  <p className="text-2xl font-bold">{bodyMetrics.muscleMass}kg</p>
                  <p className="text-xs text-gray-500">Muscle Mass</p>
                </div>
                <div className="p-4 text-center rounded-lg bg-gray-50">
                  <Scale className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold">{bodyMetrics.bodyFat}%</p>
                  <p className="text-xs text-gray-500">Body Fat</p>
                </div>
                <div className="p-4 text-center rounded-lg bg-gray-50">
                  <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                  <p className="text-2xl font-bold">{bodyMetrics.bmr}</p>
                  <p className="text-xs text-gray-500">BMR (kcal)</p>
                </div>
                <div className="p-4 text-center rounded-lg bg-gray-50">
                  <Timer className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold">{bodyMetrics.metabolicAge}</p>
                  <p className="text-xs text-gray-500">Metabolic Age</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                Synced with: Withings Smart Scale • Last update: 2 hours ago
              </p>
            </div>

            {/* Weekly Activities */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="mb-4 font-semibold text-gray-900">Recommended Activities This Week</h3>
              <div className="space-y-3">
                {weeklyActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <Activity className="w-5 h-5 text-[#02276F]" />
                      <div>
                        <p className="text-sm font-medium">{activity.activity}</p>
                        <p className="text-xs text-gray-500">{activity.duration} • {activity.calories} cal burned</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-[#02276F] text-white text-xs rounded-lg hover:bg-[#02276F]/90">
                      Start
                    </button>
                  </div>
                ))}
              </div>
              <div className="p-3 mt-4 rounded-lg bg-blue-50">
                <p className="text-xs text-blue-700">
                  💡 Based on your progress, we recommend increasing cardio activities by 15% this week
                </p>
              </div>
            </div>
          </div>

          {/* Achievement Banner */}
          <div className="p-6 mt-6 text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-2 text-xl font-bold">You're doing great! 🎉</h3>
                <p className="text-sm opacity-90">You've lost 10kg in 3 months - that's amazing progress!</p>
                <div className="flex items-center mt-3 space-x-4">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5" />
                    <span className="text-sm">5 Week Streak</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span className="text-sm">67% to Goal</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center justify-center w-24 h-24 bg-white rounded-full bg-opacity-20">
                  <Trophy className="w-12 h-12" />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
            /* AI Coach Tab Content */
            <div className="space-y-6">
              {/* AI Coach Header */}
              <div className="p-8 text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center mb-4 space-x-3">
                      <div className="p-3 bg-white rounded-full bg-opacity-20">
                        <Bot className="w-8 h-8" />
                      </div>
                      <h2 className="text-3xl font-bold">Aman AI Coach</h2>
                    </div>
                    <p className="text-lg opacity-90">Your personalized AI-powered weight loss assistant powered by Aman</p>
                  </div>
                  <Sparkles className="w-16 h-16 opacity-20" />
                </div>
              </div>

              {/* AI Goal Setting */}
              <div className="p-6 bg-white shadow-sm rounded-xl">
                <h3 className="flex items-center mb-4 text-xl font-semibold">
                  <Target className="w-5 h-5 mr-2 text-purple-600" />
                  Set Your Weight Loss Goal
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Target Weight ({weightUnit})
                    </label>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => setAiGoalWeight(Math.max(40, aiGoalWeight - 1))}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input 
                        type="number" 
                        value={aiGoalWeight}
                        onChange={(e) => setAiGoalWeight(parseInt(e.target.value) || 60)}
                        className="w-24 p-2 text-2xl font-bold text-center border-2 border-gray-200 rounded-lg"
                      />
                      <button 
                        onClick={() => setAiGoalWeight(aiGoalWeight + 1)}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">You'll lose {65 - aiGoalWeight}kg</p>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Timeframe (months)
                    </label>
                    <select 
                      value={aiTimeframe}
                      onChange={(e) => setAiTimeframe(parseInt(e.target.value))}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg"
                    >
                      <option value={1}>1 month - Aggressive</option>
                      <option value={2}>2 months - Fast</option>
                      <option value={3}>3 months - Moderate</option>
                      <option value={6}>6 months - Sustainable</option>
                    </select>
                    <p className="mt-2 text-sm text-gray-500">
                      {((65 - aiGoalWeight) / aiTimeframe).toFixed(1)}kg per month
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Daily Targets */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h3 className="flex items-center mb-4 text-lg font-semibold">
                    <TrendingDown className="w-5 h-5 mr-2 text-green-600" />
                    AI-Optimized Daily Targets
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50">
                      <div className="flex items-center space-x-3">
                        <Scale className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Daily Weigh-in</p>
                          <p className="text-sm text-gray-600">Same time each day</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">7:00 AM</p>
                        <p className="text-xs text-gray-500">Optimal time</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-purple-50">
                      <div className="flex items-center space-x-3">
                        <Activity className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-medium">Daily Steps</p>
                          <p className="text-sm text-gray-600">Progressive increase</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-purple-600">8,000</p>
                        <p className="text-xs text-gray-500">+500 from last week</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-yellow-50">
                      <div className="flex items-center space-x-3">
                        <Flame className="w-5 h-5 text-yellow-600" />
                        <div>
                          <p className="font-medium">Calorie Budget</p>
                          <p className="text-sm text-gray-600">For 0.5kg/week loss</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-yellow-600">1,500</p>
                        <p className="text-xs text-gray-500">kcal/day</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-green-50">
                      <div className="flex items-center space-x-3">
                        <Droplets className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium">Water Intake</p>
                          <p className="text-sm text-gray-600">Based on your weight</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">2.5L</p>
                        <p className="text-xs text-gray-500">10 glasses</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Insights */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h3 className="flex items-center mb-4 text-lg font-semibold">
                    <Brain className="w-5 h-5 mr-2 text-indigo-600" />
                    Aman's Personalized Insights
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-indigo-200 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50">
                      <h4 className="mb-2 font-medium text-indigo-900">Metabolism Optimization</h4>
                      <p className="text-sm text-gray-700">Based on your data, your metabolism is most active between 10 AM - 2 PM. Schedule your main meal during this window.</p>
                    </div>

                    <div className="p-4 border border-green-200 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                      <h4 className="mb-2 font-medium text-green-900">Exercise Timing</h4>
                      <p className="text-sm text-gray-700">AI analysis suggests morning workouts (6-8 AM) will maximize your fat burn by 23% based on your sleep patterns.</p>
                    </div>

                    <div className="p-4 border rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                      <h4 className="mb-2 font-medium text-amber-900">Nutrition Focus</h4>
                      <p className="text-sm text-gray-700">Reduce carb intake by 15% and increase protein to 30% of daily calories for optimal weight loss at your activity level.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Action Plan */}
              <div className="p-6 bg-white shadow-sm rounded-xl">
                <h3 className="flex items-center mb-4 text-lg font-semibold">
                  <Zap className="w-5 h-5 mr-2 text-orange-600" />
                  AI-Generated 7-Day Action Plan
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-7">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <div key={day} className="text-center">
                      <p className="mb-2 text-sm font-medium text-gray-600">{day}</p>
                      <div className="space-y-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Activity className="w-4 h-4 mx-auto text-blue-600" />
                          <p className="mt-1 text-xs">{6000 + index * 500}</p>
                        </div>
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Flame className="w-4 h-4 mx-auto text-yellow-600" />
                          <p className="mt-1 text-xs">{1500 - index * 50}</p>
                        </div>
                        {index % 2 === 0 && (
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Zap className="w-4 h-4 mx-auto text-purple-600" />
                            <p className="mt-1 text-xs">HIIT</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Predictions */}
              <div className="p-6 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
                <h3 className="flex items-center mb-4 text-xl font-semibold">
                  <TrendingDown className="w-6 h-6 mr-2" />
                  Aman's Weight Loss Prediction
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="text-center">
                    <p className="text-3xl font-bold">{aiGoalWeight}kg</p>
                    <p className="text-sm opacity-80">Target Weight</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">{new Date(Date.now() + aiTimeframe * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    <p className="text-sm opacity-80">Expected Achievement</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">87%</p>
                    <p className="text-sm opacity-80">Success Probability</p>
                  </div>
                </div>
                <div className="p-4 mt-6 bg-white rounded-lg bg-opacity-20">
                  <p className="text-sm">
                    <strong>Aman's Confidence:</strong> Based on 10,000+ similar profiles, users following this plan achieved their goals with high success rate. Your commitment level shows strong indicators for success.
                  </p>
                </div>
              </div>

              {/* Start AI Plan Button */}
              <div className="text-center">
                <button className="px-8 py-4 font-bold text-white transition-all duration-200 transform shadow-lg bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl hover:from-purple-700 hover:to-indigo-700 hover:scale-105">
                  Activate Aman's AI-Powered Weight Loss Plan
                </button>
              </div>
            </div>
          )}
          </PlanDashboardLayout>
  );
};

export default WeightLossDashboard;