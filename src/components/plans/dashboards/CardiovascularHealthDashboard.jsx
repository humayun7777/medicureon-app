// src/components/plans/dashboards/CardiovascularHealthDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Activity,
  Heart,
  Droplets,
  Target,
  AlertCircle,
  Timer,
  Zap,
  RefreshCw,
  Brain,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Bot,
  AlertTriangle,
  Clock,
  Shield,
  Waves,
  Wind,
  ThermometerSun,
  Info,
  CheckCircle,
  XCircle,
  Stethoscope,
  BarChart3,
  HeartHandshake
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, RadialBarChart, RadialBar, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import PlanDashboardLayout from '../../common/PlanDashboardLayout';
import { fetchRealTimeData } from '../../../hooks/useMediCureOnData';

const CardiovascularHealthDashboard = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [heartRateZone, setHeartRateZone] = useState('resting');
  const [targetHeartRate, setTargetHeartRate] = useState({ min: 120, max: 150 });
  
  // Real-time IoMT data states
  const [realtimeMetrics, setRealtimeMetrics] = useState({
    currentHR: null,
    bloodPressure: null,
    spo2: null,
    hrv: null,
    lastUpdated: null
  });

  // Fetch real-time IoMT data for critical metrics
  useEffect(() => {
    const fetchRealtimeData = async () => {
      try {
        // This would be your actual IoMT endpoint
        const response = await fetchRealTimeData('/api/iomt/cardiovascular/realtime', {
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

  // ECG data simulation
  const ecgData = Array.from({ length: 100 }, (_, i) => {
    const value = i % 20 === 10 ? 1.2 : 
                  i % 20 === 11 ? -0.4 : 
                  i % 20 === 12 ? 0.2 : 
                  0 + (Math.random() - 0.5) * 0.1;
    return { x: i, y: value };
  });

  // Heart rate variability data
  const hrvData = [
    { time: '12 AM', hrv: 45, hr: 58 },
    { time: '4 AM', hrv: 62, hr: 52 },
    { time: '8 AM', hrv: 48, hr: 72 },
    { time: '12 PM', hrv: 35, hr: 85 },
    { time: '4 PM', hrv: 40, hr: 78 },
    { time: '8 PM', hrv: 55, hr: 65 },
    { time: '11 PM', hrv: 58, hr: 60 }
  ];

  // Blood pressure trends
  const bpTrends = [
    { day: 'Mon', systolic: 118, diastolic: 78 },
    { day: 'Tue', systolic: 120, diastolic: 80 },
    { day: 'Wed', systolic: 115, diastolic: 75 },
    { day: 'Thu', systolic: 122, diastolic: 82 },
    { day: 'Fri', systolic: 119, diastolic: 79 },
    { day: 'Sat', systolic: 125, diastolic: 83 },
    { day: 'Sun', systolic: 117, diastolic: 77 }
  ];

  // Heart health metrics for radar chart
  const heartHealthMetrics = [
    { metric: 'Resting HR', value: 85, fullMark: 100 },
    { metric: 'HRV', value: 75, fullMark: 100 },
    { metric: 'BP Control', value: 90, fullMark: 100 },
    { metric: 'Recovery', value: 70, fullMark: 100 },
    { metric: 'Exercise', value: 65, fullMark: 100 },
    { metric: 'Stress', value: 80, fullMark: 100 }
  ];

  // Recommended heart-healthy meals
  const heartHealthyMeals = [
    { name: "Avocado salad", calories: 250, sodium: "180mg", fiber: "12g", omega3: "High", image: "🥗" },
    { name: "Tuna with zucchini", calories: 220, sodium: "200mg", fiber: "8g", omega3: "Very High", image: "🐟" },
    { name: "Oatmeal with berries", calories: 180, sodium: "50mg", fiber: "10g", omega3: "Low", image: "🥣" },
    { name: "Grilled salmon", calories: 300, sodium: "150mg", fiber: "0g", omega3: "Very High", image: "🍣" },
    { name: "Quinoa bowl", calories: 280, sodium: "120mg", fiber: "15g", omega3: "Medium", image: "🍲" }
  ];

  // Heart rate zones
  const heartRateZones = {
    resting: { min: 50, max: 70, color: '#22C55E' },
    moderate: { min: 70, max: 120, color: '#3B82F6' },
    vigorous: { min: 120, max: 150, color: '#F59E0B' },
    peak: { min: 150, max: 180, color: '#EF4444' }
  };

  // Custom badges for this plan
  const customBadges = [
    {
      text: realtimeMetrics.currentHR ? `HR: ${realtimeMetrics.currentHR} bpm` : 'HR: 72 bpm',
      className: "flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full",
      icon: () => <Heart className="w-3 h-3 text-white mr-1.5" />
    }
  ];

  return (
    <PlanDashboardLayout
      planId={3}
      planName="Cardiovascular Health"
      subtitle="Happiness is nothing more than good health ❤️"
      customBadges={customBadges}
      onNavigate={onNavigate}
      showDevelopmentBanner={true}
      isRealTimeData={true}
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
          Cardiovascular Health
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
          {/* Heart ECG and Stats Row */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
            {/* ECG Card */}
            <div className="p-6 bg-white shadow-sm lg:col-span-2 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Heart ECG</h3>
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-red-600">
                    {realtimeMetrics.bloodPressure || '70/120'}
                  </span>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Blood Pressure</p>
                    <p className="text-sm font-medium text-green-600">Normal</p>
                  </div>
                </div>
              </div>
              <div className="relative h-40 p-4 overflow-hidden bg-gray-900 rounded-lg">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ecgData}>
                    <Line 
                      type="monotone" 
                      dataKey="y" 
                      stroke="#22C55E" 
                      strokeWidth={2}
                      dot={false}
                      animationDuration={0}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="absolute text-xs text-green-400 top-2 left-2">
                  Lead II
                </div>
                <div className="absolute text-xs text-green-400 top-2 right-2 animate-pulse">
                  ● LIVE
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-3 text-center">
                <div>
                  <p className="text-xs text-gray-500">HR</p>
                  <p className="text-lg font-bold">{realtimeMetrics.currentHR || 72} bpm</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">PR Interval</p>
                  <p className="text-lg font-bold">156 ms</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">QRS</p>
                  <p className="text-lg font-bold">92 ms</p>
                </div>
              </div>
              {realtimeMetrics.lastUpdated && (
                <p className="mt-2 text-xs text-center text-gray-400">
                  Last updated: {new Date(realtimeMetrics.lastUpdated).toLocaleTimeString()}
                </p>
              )}
            </div>

            {/* Stats Cards Column */}
            <div className="space-y-4">
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
                <p className="mb-1 text-3xl font-bold">2,500</p>
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
                      <Zap className="w-5 h-5" />
                    </div>
                    <span className="font-semibold">Calories</span>
                  </div>
                </div>
                <p className="mb-1 text-3xl font-bold">420</p>
                <p className="text-sm">Today</p>
              </div>
            </div>
          </div>

          {/* Heart Metrics Row */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
            {/* Standing Heart Rate */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="flex items-center mb-4 font-semibold text-gray-900">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                Standing heart rate
              </h3>
              <div className="relative">
                <div className="w-32 h-32 mx-auto">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    <circle cx="50" cy="50" r="40" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                    <circle cx="50" cy="50" r="40" stroke="#22C55E" strokeWidth="8" fill="none"
                      strokeDasharray={`${2 * Math.PI * 40 * 0.75} ${2 * Math.PI * 40}`}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-3xl font-bold">98</p>
                    <p className="text-sm text-gray-500">bpm</p>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-sm font-medium text-center text-green-600">Normal</p>
            </div>

            {/* Saturation */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="flex items-center mb-4 font-semibold text-gray-900">
                <Droplets className="w-5 h-5 mr-2 text-blue-500" />
                Saturation
              </h3>
              <div className="text-center">
                <div className="flex items-baseline justify-center space-x-1">
                  <span className="text-4xl font-bold text-blue-600">
                    {realtimeMetrics.spo2 || 97}
                  </span>
                  <span className="text-lg text-gray-500">%SpO₂</span>
                </div>
                <div className="relative mt-4">
                  <div className="w-32 h-32 mx-auto">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                      <circle cx="50" cy="50" r="40" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                      <circle cx="50" cy="50" r="40" stroke="#3B82F6" strokeWidth="8" fill="none"
                        strokeDasharray={`${2 * Math.PI * 40 * 0.97} ${2 * Math.PI * 40}`}
                        strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">Normal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Heart Rate Variability */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="flex items-center mb-4 font-semibold text-gray-900">
                <Waves className="w-5 h-5 mr-2 text-purple-500" />
                HRV (Heart Rate Variability)
              </h3>
              <div className="text-center">
                <div className="flex items-baseline justify-center space-x-1">
                  <span className="text-4xl font-bold text-purple-600">
                    {realtimeMetrics.hrv || 42}
                  </span>
                  <span className="text-lg text-gray-500">ms</span>
                </div>
                <p className="mt-2 text-sm font-medium text-purple-600">Good Recovery</p>
                <div className="mt-4">
                  <ResponsiveContainer width="100%" height={60}>
                    <AreaChart data={hrvData.slice(-4)}>
                      <Area type="monotone" dataKey="hrv" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Heart Health Score */}
          <div className="p-6 mb-6 bg-white shadow-sm rounded-xl">
            <h3 className="mb-4 font-semibold text-gray-900">Cardiovascular Health Score</h3>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={heartHealthMetrics}>
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar name="Score" dataKey="value" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                <div className="mb-4 text-center">
                  <p className="text-5xl font-bold text-red-600">82/100</p>
                  <p className="text-lg text-gray-600">Overall Heart Health Score</p>
                </div>
                {heartHealthMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{metric.metric}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 overflow-hidden bg-gray-200 rounded-full">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-red-400 to-red-600"
                          style={{ width: `${metric.value}%` }}
                        ></div>
                      </div>
                      <span className="w-12 text-sm font-medium text-right">{metric.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Blood Pressure Trends */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="mb-4 font-semibold text-gray-900">Blood Pressure Trends</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={bpTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[60, 140]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="systolic" stroke="#EF4444" strokeWidth={2} name="Systolic" />
                  <Line type="monotone" dataKey="diastolic" stroke="#3B82F6" strokeWidth={2} name="Diastolic" />
                </LineChart>
              </ResponsiveContainer>
              <div className="p-3 mt-4 rounded-lg bg-green-50">
                <p className="text-sm text-green-700">
                  <strong>Good News:</strong> Your blood pressure has been stable this week with an average of 119/79 mmHg
                </p>
              </div>
            </div>

            {/* Heart Rate Zones */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="mb-4 font-semibold text-gray-900">Heart Rate Zones (Today)</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="flex items-center">
                      <div className="w-3 h-3 mr-2 bg-green-500 rounded-full"></div>
                      Resting (50-70 bpm)
                    </span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="h-3 overflow-hidden bg-gray-200 rounded-full">
                    <div className="h-full bg-green-500" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="flex items-center">
                      <div className="w-3 h-3 mr-2 bg-blue-500 rounded-full"></div>
                      Moderate (70-120 bpm)
                    </span>
                    <span className="font-medium">35%</span>
                  </div>
                  <div className="h-3 overflow-hidden bg-gray-200 rounded-full">
                    <div className="h-full bg-blue-500" style={{ width: '35%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="flex items-center">
                      <div className="w-3 h-3 mr-2 bg-yellow-500 rounded-full"></div>
                      Vigorous (120-150 bpm)
                    </span>
                    <span className="font-medium">15%</span>
                  </div>
                  <div className="h-3 overflow-hidden bg-gray-200 rounded-full">
                    <div className="h-full bg-yellow-500" style={{ width: '15%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="flex items-center">
                      <div className="w-3 h-3 mr-2 bg-red-500 rounded-full"></div>
                      Peak (150+ bpm)
                    </span>
                    <span className="font-medium">5%</span>
                  </div>
                  <div className="h-3 overflow-hidden bg-gray-200 rounded-full">
                    <div className="h-full bg-red-500" style={{ width: '5%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Heart Healthy Meals */}
          <div className="p-6 mb-6 bg-white shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Recommended Low-Sodium and Heart-Healthy Meals</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {heartHealthyMeals.map((meal, index) => (
                <div key={index} className="cursor-pointer group">
                  <div className="relative p-4 transition-all rounded-lg bg-gradient-to-br from-red-50 to-pink-50 hover:shadow-md">
                    <div className="mb-3 text-4xl text-center">{meal.image}</div>
                    <h4 className="mb-1 text-sm font-medium text-gray-900">{meal.name}</h4>
                    <div className="space-y-1 text-xs text-gray-500">
                      <p className="flex justify-between">
                        <span>Sodium:</span>
                        <span className={meal.sodium === "50mg" ? "text-green-600 font-medium" : ""}>{meal.sodium}</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Omega-3:</span>
                        <span className={meal.omega3 === "Very High" ? "text-blue-600 font-medium" : ""}>{meal.omega3}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Heart Health Tips */}
          <div className="p-6 text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-2 text-xl font-bold">Excellent cardiovascular fitness! ❤️</h3>
                <p className="text-sm opacity-90">Your resting heart rate of 58 bpm and HRV of 42ms indicate strong heart health. Keep up your exercise routine!</p>
                <div className="flex items-center mt-3 space-x-4">
                  <div className="flex items-center space-x-2">
                    <HeartHandshake className="w-5 h-5" />
                    <span className="text-sm">15 Day Streak</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span className="text-sm">Low Risk</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center justify-center w-24 h-24 bg-white rounded-full bg-opacity-20">
                  <Heart className="w-12 h-12" />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Aman AI Coach Tab */
        <div className="space-y-6">
          {/* AI Coach Header */}
          <div className="p-8 text-white bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-4 space-x-3">
                  <div className="p-3 bg-white rounded-full bg-opacity-20">
                    <Bot className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-bold">Aman AI Coach</h2>
                </div>
                <p className="text-lg opacity-90">Your personalized cardiovascular health optimizer</p>
              </div>
              <Sparkles className="w-16 h-16 opacity-20" />
            </div>
          </div>

          {/* Heart Rate Target Zones */}
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h3 className="flex items-center mb-4 text-xl font-semibold">
              <Target className="w-5 h-5 mr-2 text-red-600" />
              Aman's Personalized Heart Rate Zones
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="p-4 text-center border-2 border-green-200 rounded-lg bg-green-50">
                <Heart className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <h4 className="mb-1 font-medium">Resting Zone</h4>
                <p className="text-2xl font-bold text-green-600">50-70</p>
                <p className="text-sm text-gray-600">bpm</p>
                <p className="mt-2 text-xs text-gray-500">Recovery & Rest</p>
              </div>
              <div className="p-4 text-center border-2 border-blue-200 rounded-lg bg-blue-50">
                <Activity className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <h4 className="mb-1 font-medium">Fat Burn Zone</h4>
                <p className="text-2xl font-bold text-blue-600">108-126</p>
                <p className="text-sm text-gray-600">bpm</p>
                <p className="mt-2 text-xs text-gray-500">50-60% Max HR</p>
              </div>
              <div className="p-4 text-center border-2 border-yellow-200 rounded-lg bg-yellow-50">
                <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                <h4 className="mb-1 font-medium">Cardio Zone</h4>
                <p className="text-2xl font-bold text-yellow-600">126-153</p>
                <p className="text-sm text-gray-600">bpm</p>
                <p className="mt-2 text-xs text-gray-500">60-75% Max HR</p>
              </div>
              <div className="p-4 text-center border-2 border-red-200 rounded-lg bg-red-50">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-600" />
                <h4 className="mb-1 font-medium">Peak Zone</h4>
                <p className="text-2xl font-bold text-red-600">153-180</p>
                <p className="text-sm text-gray-600">bpm</p>
                <p className="mt-2 text-xs text-gray-500">75-95% Max HR</p>
              </div>
            </div>
          </div>

          {/* AI Recommendations Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Exercise Optimization */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="flex items-center mb-4 text-lg font-semibold">
                <Timer className="w-5 h-5 mr-2 text-red-600" />
                Aman's Exercise Protocol
              </h3>
              <div className="space-y-4">
                <div className="p-4 border border-green-200 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                  <h4 className="mb-2 font-medium text-green-900">Zone 2 Cardio</h4>
                  <p className="text-sm text-gray-700">150 minutes/week at 108-126 bpm improves mitochondrial efficiency by 35%</p>
                  <div className="flex items-center mt-2 text-xs text-green-600">
                    <Clock className="w-3 h-3 mr-1" />
                    Best time: 6-7 AM (fasted state)
                  </div>
                </div>

                <div className="p-4 border border-blue-200 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h4 className="mb-2 font-medium text-blue-900">HIIT Sessions</h4>
                  <p className="text-sm text-gray-700">2x/week, 20 min sessions. Improves VO2 max and stroke volume</p>
                  <div className="flex items-center mt-2 text-xs text-blue-600">
                    <Zap className="w-3 h-3 mr-1" />
                    30s sprint / 90s recovery x 10
                  </div>
                </div>

                <div className="p-4 border border-purple-200 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                  <h4 className="mb-2 font-medium text-purple-900">Recovery Protocol</h4>
                  <p className="text-sm text-gray-700">HRV-guided recovery. Current HRV suggests 48h between intense sessions</p>
                  <div className="flex items-center mt-2 text-xs text-purple-600">
                    <Heart className="w-3 h-3 mr-1" />
                    Next intense workout: Thursday
                  </div>
                </div>
              </div>
            </div>

            {/* Cardiovascular Risk Factors */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="flex items-center mb-4 text-lg font-semibold">
                <Shield className="w-5 h-5 mr-2 text-red-600" />
                Aman's Risk Factor Analysis
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Blood Pressure</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">Optimal</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Resting Heart Rate</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">Excellent</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium">Exercise Minutes</span>
                  </div>
                  <span className="text-sm font-medium text-yellow-600">Needs 30min more</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium">HRV Score</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">Above Average</span>
                </div>
              </div>
              <div className="p-3 mt-4 rounded-lg bg-blue-50">
                <p className="text-sm text-blue-800">
                  <strong>Aman says:</strong> Your cardiovascular age is 5 years younger than your chronological age!
                </p>
              </div>
            </div>
          </div>

          {/* Heart Health Optimization Plan */}
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h3 className="flex items-center mb-4 text-lg font-semibold">
              <Brain className="w-5 h-5 mr-2 text-red-600" />
              Aman's 30-Day Heart Optimization Protocol
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg bg-gradient-to-br from-red-50 to-pink-50">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold text-white bg-red-600 rounded-full">1</div>
                  <div>
                    <h4 className="mb-1 font-medium">Week 1-2: Base Building</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• 30 min Zone 2 cardio daily</li>
                      <li>• Resting HR target: &lt;60 bpm</li>
                      <li>• 2L water minimum</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-red-50 to-pink-50">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold text-white bg-red-600 rounded-full">2</div>
                  <div>
                    <h4 className="mb-1 font-medium">Week 3-4: Intensity Phase</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Add 2x HIIT sessions</li>
                      <li>• HRV target: &gt;50ms</li>
                      <li>• Mediterranean diet focus</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-red-50 to-pink-50">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold text-white bg-red-600 rounded-full">3</div>
                  <div>
                    <h4 className="mb-1 font-medium">Maintenance</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• VO2 max test</li>
                      <li>• Optimize recovery</li>
                      <li>• Track improvements</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nutrition Recommendations */}
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h3 className="flex items-center mb-4 text-lg font-semibold">
              <Heart className="w-5 h-5 mr-2 text-red-600" />
              Aman's Heart-Healthy Nutrition Plan
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-3 font-medium">Daily Targets</h4>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 rounded bg-gray-50">
                    <span className="text-sm">Omega-3 Fatty Acids</span>
                    <span className="text-sm font-medium">2-4g</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-gray-50">
                    <span className="text-sm">Sodium</span>
                    <span className="text-sm font-medium">&lt;1,500mg</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-gray-50">
                    <span className="text-sm">Fiber</span>
                    <span className="text-sm font-medium">30-35g</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-gray-50">
                    <span className="text-sm">Potassium</span>
                    <span className="text-sm font-medium">3,500-4,700mg</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="mb-3 font-medium">Supplement Protocol</h4>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-red-50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">CoQ10</span>
                      <span className="text-xs text-gray-600">200mg/day</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Supports heart muscle function</p>
                  </div>
                  <div className="p-3 rounded-lg bg-red-50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Magnesium Glycinate</span>
                      <span className="text-xs text-gray-600">400mg/day</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Regulates heart rhythm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Success Prediction */}
          <div className="p-6 text-white bg-gradient-to-r from-red-600 to-pink-600 rounded-xl">
            <h3 className="flex items-center mb-4 text-xl font-semibold">
              <Target className="w-6 h-6 mr-2" />
              Aman's Cardiovascular Health Predictions
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <div className="text-center">
                <p className="text-3xl font-bold">52 bpm</p>
                <p className="text-sm opacity-80">Target Resting HR</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">115/75</p>
                <p className="text-sm opacity-80">Optimal BP</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">+15%</p>
                <p className="text-sm opacity-80">VO2 Max Increase</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">94%</p>
                <p className="text-sm opacity-80">Success Rate</p>
              </div>
            </div>
            <div className="p-4 mt-6 bg-white rounded-lg bg-opacity-20">
              <p className="text-sm">
                <strong>Aman's Analysis:</strong> Based on your current metrics and adherence patterns, you're on track to achieve elite cardiovascular fitness. Your heart is responding excellently to the training protocol!
              </p>
            </div>
          </div>

          {/* Start AI Plan Button */}
          <div className="text-center">
            <button className="px-8 py-4 font-bold text-white transition-all duration-200 transform shadow-lg bg-gradient-to-r from-red-600 to-pink-600 rounded-xl hover:from-red-700 hover:to-pink-700 hover:scale-105">
              Activate Aman's Cardiovascular Optimization Protocol
            </button>
          </div>
        </div>
      )}
    </PlanDashboardLayout>
  );
};

export default CardiovascularHealthDashboard;