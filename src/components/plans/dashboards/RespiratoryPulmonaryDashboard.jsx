import React, { useState, useEffect } from 'react';
import { 
  Activity,
  Wind,
  Droplets,
  Brain,
  Heart,
  TrendingUp,
  TrendingDown,
  Target,
  AlertCircle,
  AlertTriangle,
  Timer,
  Zap,
  Sparkles,
  Bot,
  Shield,
  Waves,
  Cloud,
  Sun,
  TreePine,
  Home,
  Mountain,
  Gauge,
  BarChart3,
  Stethoscope,
  Calendar,
  Award,
  Battery,
  Play,
  ArrowRight,
  Moon,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, RadialBarChart, RadialBar, Cell, PieChart, Pie } from 'recharts';
import PlanDashboardLayout from '../../common/PlanDashboardLayout';
import { fetchRealTimeData } from '../../../hooks/useMediCureOnData';

const RespiratoryHealthDashboard = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedExercise, setSelectedExercise] = useState(null);
  
  // Real-time IoMT data states
  const [realtimeMetrics, setRealtimeMetrics] = useState({
    spo2: null,
    breathingRate: null,
    heartRate: null,
    lastUpdated: null
  });

  // Fetch real-time IoMT data
  useEffect(() => {
    const fetchRealtimeData = async () => {
      try {
        const response = await fetchRealTimeData('/api/iomt/respiratory/realtime', {
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
  const breathingPatternData = [
    { time: '12 AM', rate: 14 },
    { time: '2 AM', rate: 12 },
    { time: '4 AM', rate: 13 },
    { time: '6 AM', rate: 15 },
    { time: '8 AM', rate: 18 },
    { time: '10 AM', rate: 16 },
    { time: '12 PM', rate: 17 },
    { time: '2 PM', rate: 19 },
    { time: '4 PM', rate: 18 },
    { time: '6 PM', rate: 16 },
    { time: '8 PM', rate: 15 },
    { time: '10 PM', rate: 14 }
  ];

  const oxygenSaturationData = [
    { time: '8 AM', spo2: 98 },
    { time: '10 AM', spo2: 97 },
    { time: '12 PM', spo2: 96 },
    { time: '2 PM', spo2: 97 },
    { time: '4 PM', spo2: 98 },
    { time: '6 PM', spo2: 97 },
    { time: '8 PM', spo2: 98 },
    { time: '10 PM', spo2: 99 }
  ];

  const lungFunctionData = {
    fev1: 3.2,
    fvc: 4.1,
    fev1_fvc: 78,
    pef: 450,
    fef2575: 3.5,
    vo2max: 42
  };

  const airQualityData = {
    indoor: { pm25: 12, co2: 650, humidity: 45 },
    outdoor: { aqi: 65, pm25: 28 }
  };

  const exerciseCapacityData = [
    { week: 'Week 1', distance: 2.5, vo2: 38 },
    { week: 'Week 2', distance: 2.8, vo2: 39 },
    { week: 'Week 3', distance: 3.1, vo2: 40 },
    { week: 'Week 4', distance: 3.4, vo2: 42 }
  ];

  const breathingExercises = [
    { name: "Box Breathing", pattern: "4-4-4-4", benefit: "Stress relief" },
    { name: "4-7-8 Breathing", pattern: "4-7-8", benefit: "Sleep aid" },
    { name: "Diaphragmatic", pattern: "Deep belly", benefit: "Lung capacity" },
    { name: "Pursed Lip", pattern: "2-4", benefit: "COPD relief" }
  ];

  const triggerFactors = [
    { factor: 'Pollen', level: 65, status: 'High' },
    { factor: 'Dust', level: 40, status: 'Moderate' },
    { factor: 'Pet Dander', level: 20, status: 'Low' },
    { factor: 'Smoke', level: 10, status: 'Low' }
  ];

  // Custom badges for this plan
  const customBadges = [
    {
      text: realtimeMetrics.spo2 ? `SpO₂: ${realtimeMetrics.spo2}%` : 'SpO₂: 97%',
      className: "flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full",
      icon: () => <Wind className="w-3 h-3 text-white mr-1.5" />
    }
  ];

  return (
    <PlanDashboardLayout
      planId={2}
      planName="Respiratory Health & Fitness"
      subtitle="Your Respiratory Wellness Dashboard 🫁"
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
          Respiratory Health & Fitness
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
          <span>Aman AI Pulmonologist</span>
        </button>
      </div>

      {activeTab === 'dashboard' ? (
        <>
          {/* Top Metrics */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-4">
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">Breathing disturbances</h3>
                <select className="px-2 py-1 text-xs border rounded">
                  <option>Last night</option>
                </select>
              </div>
              <div className="relative">
                <div className="flex items-center justify-center w-32 h-32 mx-auto">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                    <circle cx="64" cy="64" r="56" stroke="#10B981" strokeWidth="8" fill="none" 
                      strokeDasharray={`${2 * Math.PI * 56 * 0.15} ${2 * Math.PI * 56}`} 
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute text-center">
                    <p className="text-3xl font-bold text-gray-900">Few</p>
                    <p className="text-xs text-gray-500">disturbances</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center mt-4 space-x-1">
                <div className="w-1/3 h-2 bg-green-500 rounded-l-full"></div>
                <div className="w-1/3 h-2 bg-gray-200"></div>
                <div className="w-1/3 h-2 bg-gray-200 rounded-r-full"></div>
              </div>
            </div>

            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="mb-4 text-sm font-medium text-gray-600">Breaths per minute</h3>
              <div className="relative">
                <div className="flex items-center justify-center w-32 h-32 mx-auto">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                    <circle cx="64" cy="64" r="56" stroke="#F59E0B" strokeWidth="8" fill="none" 
                      strokeDasharray={`${2 * Math.PI * 56 * 0.75} ${2 * Math.PI * 56}`} 
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute text-center">
                    <p className="text-3xl font-bold text-gray-900">
                      {realtimeMetrics.breathingRate || 18}
                    </p>
                    <p className="text-xs text-gray-500">bpm</p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs text-center text-gray-500">Normal: 12-20 bpm</p>
              {realtimeMetrics.lastUpdated && (
                <p className="mt-1 text-xs text-center text-gray-400">
                  Updated {new Date(realtimeMetrics.lastUpdated).toLocaleTimeString()}
                </p>
              )}
            </div>

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

            <div className="p-6 text-gray-900 bg-yellow-400 shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-white rounded-lg bg-opacity-30">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="font-semibold">Calories</span>
                </div>
              </div>
              <p className="mb-1 text-3xl font-bold">1,200</p>
              <p className="text-sm">Today</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Oxygen Saturation (SpO₂)</h3>
                <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">Normal</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-4xl font-bold text-blue-600">
                    {realtimeMetrics.spo2 || 97}
                  </p>
                  <p className="text-sm text-gray-500">% SpO₂</p>
                </div>
                <div className="w-32 h-32">
                  <svg viewBox="0 0 100 50" className="w-full h-full">
                    <path d="M 10 40 Q 20 10 30 35 T 50 35 Q 60 10 70 35 T 90 35" 
                      stroke="#3B82F6" strokeWidth="3" fill="none" />
                  </svg>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={oxygenSaturationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[94, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="spo2" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="flex items-center mb-4 font-semibold text-gray-900">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                Blood pressure
              </h3>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-4xl font-bold text-red-600">128/70</p>
                  <p className="text-sm text-gray-500">mmHg</p>
                </div>
                <div className="flex items-center justify-center w-24 h-24 bg-green-100 rounded-full">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {realtimeMetrics.heartRate || 98}
                    </p>
                    <p className="text-xs text-gray-600">bpm</p>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={100}>
                <AreaChart data={[{t:1,s:125,d:68},{t:2,s:128,d:70},{t:3,s:126,d:69},{t:4,s:124,d:68},{t:5,s:128,d:70}]}>
                  <Area type="monotone" dataKey="s" stroke="#EF4444" fill="#FEE2E2" strokeWidth={2} />
                  <Area type="monotone" dataKey="d" stroke="#3B82F6" fill="#DBEAFE" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Lung Function Tests */}
          <div className="p-6 mb-6 bg-white shadow-sm rounded-xl">
            <h3 className="flex items-center mb-4 font-semibold text-gray-900">
              <Stethoscope className="w-5 h-5 mr-2 text-indigo-600" />
              Pulmonary Function Tests
            </h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
              <div className="p-4 text-center rounded-lg bg-indigo-50">
                <p className="text-xs text-gray-600">FEV₁</p>
                <p className="text-2xl font-bold text-indigo-600">{lungFunctionData.fev1}L</p>
                <p className="text-xs text-green-600">95% predicted</p>
              </div>
              <div className="p-4 text-center rounded-lg bg-blue-50">
                <p className="text-xs text-gray-600">FVC</p>
                <p className="text-2xl font-bold text-blue-600">{lungFunctionData.fvc}L</p>
                <p className="text-xs text-green-600">92% predicted</p>
              </div>
              <div className="p-4 text-center rounded-lg bg-purple-50">
                <p className="text-xs text-gray-600">FEV₁/FVC</p>
                <p className="text-2xl font-bold text-purple-600">{lungFunctionData.fev1_fvc}%</p>
                <p className="text-xs text-green-600">Normal</p>
              </div>
              <div className="p-4 text-center rounded-lg bg-green-50">
                <p className="text-xs text-gray-600">PEF</p>
                <p className="text-2xl font-bold text-green-600">{lungFunctionData.pef}</p>
                <p className="text-xs text-gray-600">L/min</p>
              </div>
              <div className="p-4 text-center rounded-lg bg-yellow-50">
                <p className="text-xs text-gray-600">FEF 25-75%</p>
                <p className="text-2xl font-bold text-yellow-600">{lungFunctionData.fef2575}</p>
                <p className="text-xs text-gray-600">L/s</p>
              </div>
              <div className="p-4 text-center rounded-lg bg-red-50">
                <p className="text-xs text-gray-600">VO₂ max</p>
                <p className="text-2xl font-bold text-red-600">{lungFunctionData.vo2max}</p>
                <p className="text-xs text-gray-600">ml/kg/min</p>
              </div>
            </div>
          </div>

          {/* Breathing Pattern & Air Quality */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="mb-4 font-semibold text-gray-900">24-Hour Breathing Pattern</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={breathingPatternData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[10, 22]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="rate" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="flex items-center mb-4 font-semibold text-gray-900">
                <Cloud className="w-5 h-5 mr-2 text-blue-600" />
                Air Quality Monitor
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-blue-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Indoor AQI</span>
                    <Home className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">Good</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>PM2.5</span>
                      <span className="font-medium">{airQualityData.indoor.pm25} μg/m³</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>CO₂</span>
                      <span className="font-medium">{airQualityData.indoor.co2} ppm</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-yellow-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Outdoor AQI</span>
                    <TreePine className="w-4 h-4 text-yellow-600" />
                  </div>
                  <p className="text-2xl font-bold text-yellow-600">{airQualityData.outdoor.aqi}</p>
                  <p className="text-xs text-gray-600">Moderate</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>PM2.5</span>
                      <span className="font-medium">{airQualityData.outdoor.pm25} μg/m³</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Breathing Exercises */}
          <div className="p-6 mb-6 bg-white shadow-sm rounded-xl">
            <h3 className="flex items-center mb-4 font-semibold text-gray-900">
              <Wind className="w-5 h-5 mr-2 text-blue-600" />
              Guided Breathing Exercises
            </h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {breathingExercises.map((exercise, index) => (
                <button 
                  key={index} 
                  onClick={() => setSelectedExercise(exercise)} 
                  className={`p-4 text-left transition-all border rounded-lg hover:shadow-md ${
                    selectedExercise?.name === exercise.name 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{exercise.name}</h4>
                    <Play className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="mb-1 text-xs text-gray-600">{exercise.pattern}</p>
                  <p className="text-xs text-blue-600">{exercise.benefit}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Respiratory Triggers & Exercise Capacity */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="flex items-center mb-4 font-semibold text-gray-900">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                Environmental Triggers
              </h3>
              <div className="space-y-3">
                {triggerFactors.map((trigger, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{trigger.factor}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        trigger.level > 50 
                          ? 'bg-red-100 text-red-700' 
                          : trigger.level > 25 
                            ? 'bg-yellow-100 text-yellow-700' 
                            : 'bg-green-100 text-green-700'
                      }`}>
                        {trigger.status}
                      </span>
                    </div>
                    <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full">
                      <div 
                        className="h-full transition-all rounded-full" 
                        style={{ 
                          width: `${trigger.level}%`, 
                          backgroundColor: trigger.level > 50 ? '#EF4444' : trigger.level > 25 ? '#F59E0B' : '#10B981' 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="flex items-center mb-4 font-semibold text-gray-900">
                <Mountain className="w-5 h-5 mr-2 text-green-600" />
                Exercise Capacity Progress
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={exerciseCapacityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="distance" stroke="#10B981" strokeWidth={2} name="Distance (km)" />
                  <Line yAxisId="right" type="monotone" dataKey="vo2" stroke="#3B82F6" strokeWidth={2} name="VO₂ (ml/kg/min)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Insights Banner */}
          <div className="p-6 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-2 text-xl font-bold">Excellent respiratory health! 🫁</h3>
                <p className="text-sm opacity-90">
                  Your lung function tests show above-average performance. SpO₂ levels are consistently in the optimal range. 
                  Continue your breathing exercises to maintain this excellent respiratory fitness.
                </p>
                <div className="flex items-center mt-3 space-x-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span className="text-sm">Lung Age: 5 years younger</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm">VO₂ max improving</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center justify-center w-24 h-24 bg-white rounded-full bg-opacity-20">
                  <Wind className="w-12 h-12" />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Aman AI Coach Tab */
        <div className="space-y-6">
          <div className="p-8 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-4 space-x-3">
                  <div className="p-3 bg-white rounded-full bg-opacity-20">
                    <Bot className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-bold">Aman AI Pulmonologist</h2>
                </div>
                <p className="text-lg opacity-90">Your personalized respiratory optimization expert</p>
              </div>
              <Sparkles className="w-16 h-16 opacity-20" />
            </div>
          </div>

          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h3 className="flex items-center mb-4 text-xl font-semibold">
              <Stethoscope className="w-5 h-5 mr-2 text-blue-600" />
              Aman's Respiratory Assessment
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <div className="p-4 text-center border-2 border-green-200 rounded-lg bg-green-50">
                <Wind className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <h4 className="mb-1 font-medium">Lung Capacity</h4>
                <p className="text-2xl font-bold text-green-600">95%</p>
                <p className="mt-2 text-xs text-gray-600">Excellent function</p>
              </div>
              <div className="p-4 text-center border-2 border-blue-200 rounded-lg bg-blue-50">
                <Waves className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <h4 className="mb-1 font-medium">Breathing Pattern</h4>
                <p className="text-2xl font-bold text-blue-600">Optimal</p>
                <p className="mt-2 text-xs text-gray-600">Diaphragmatic</p>
              </div>
              <div className="p-4 text-center border-2 border-purple-200 rounded-lg bg-purple-50">
                <Mountain className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <h4 className="mb-1 font-medium">Exercise Tolerance</h4>
                <p className="text-2xl font-bold text-purple-600">High</p>
                <p className="mt-2 text-xs text-gray-600">Athletic level</p>
              </div>
              <div className="p-4 text-center border-2 border-yellow-200 rounded-lg bg-yellow-50">
                <Shield className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                <h4 className="mb-1 font-medium">Respiratory Age</h4>
                <p className="text-2xl font-bold text-yellow-600">23 yrs</p>
                <p className="mt-2 text-xs text-gray-600">5 years younger</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h3 className="flex items-center mb-4 text-lg font-semibold">
              <Wind className="w-5 h-5 mr-2 text-blue-600" />
              Aman's Advanced Breathing Protocol
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="p-4 border border-green-200 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-green-900">Morning Activation</h4>
                  <Sun className="w-5 h-5 text-green-600" />
                </div>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">Wim Hof Method</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• 30 power breaths</li>
                    <li>• 1.5 min retention</li>
                    <li>• 15 sec recovery</li>
                    <li>• 3 rounds total</li>
                  </ul>
                  <div className="pt-2 mt-2 border-t border-green-200">
                    <p className="text-xs"><strong>Benefits:</strong> +40% oxygen efficiency</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-blue-900">Midday Reset</h4>
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                </div>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">Coherent Breathing</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• 5 sec inhale</li>
                    <li>• 5 sec exhale</li>
                    <li>• 6 breaths/min</li>
                    <li>• 10 min session</li>
                  </ul>
                  <div className="pt-2 mt-2 border-t border-blue-200">
                    <p className="text-xs"><strong>Benefits:</strong> HRV optimization</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border border-purple-200 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-purple-900">Evening Recovery</h4>
                  <Moon className="w-5 h-5 text-purple-600" />
                </div>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">4-7-8 Breathing</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• 4 sec inhale</li>
                    <li>• 7 sec hold</li>
                    <li>• 8 sec exhale</li>
                    <li>• 4 cycles</li>
                  </ul>
                  <div className="pt-2 mt-2 border-t border-purple-200">
                    <p className="text-xs"><strong>Benefits:</strong> Sleep preparation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h3 className="flex items-center mb-4 text-lg font-semibold">
              <Target className="w-5 h-5 mr-2 text-blue-600" />
              Aman's Respiratory Optimization Predictions
            </h3>
            <div className="space-y-4">
              <div className="p-4 border border-blue-200 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                <h4 className="mb-3 font-medium text-blue-900">Pulmonary Function Enhancement</h4>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2 bg-blue-100 rounded">
                    <p className="text-xs text-gray-600">Current FEV₁</p>
                    <p className="font-bold text-blue-700">3.2L</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded">
                    <p className="text-xs text-gray-600">4 Weeks</p>
                    <p className="font-bold text-blue-700">3.4L</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded">
                    <p className="text-xs text-gray-600">8 Weeks</p>
                    <p className="font-bold text-blue-700">3.5L</p>
                  </div>
                  <div className="p-2 bg-blue-200 rounded">
                    <p className="text-xs text-gray-600">Target</p>
                    <p className="font-bold text-blue-800">3.6L</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-green-200 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                <h4 className="mb-3 font-medium text-green-900">Athletic Performance Gains</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">5K Run Time</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-red-600">24:30</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-bold text-green-600">21:45</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Max Breath Hold</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-red-600">1:45</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-bold text-green-600">3:00</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-purple-200 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                <h4 className="mb-3 font-medium text-purple-900">Overall Health Impact</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm font-medium">Immune Function</p>
                    <div className="flex items-center mt-1">
                      <div className="flex-1 h-2 overflow-hidden bg-gray-200 rounded-full">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <span className="ml-2 text-xs">+35%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sleep Quality</p>
                    <div className="flex items-center mt-1">
                      <div className="flex-1 h-2 overflow-hidden bg-gray-200 rounded-full">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                      <span className="ml-2 text-xs">+30%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
            <h3 className="flex items-center mb-4 text-xl font-semibold">
              <Award className="w-6 h-6 mr-2" />
              Aman's Respiratory Excellence Prediction
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <div className="text-center">
                <p className="text-3xl font-bold">3.6L</p>
                <p className="text-sm opacity-80">Target FEV₁</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">12 weeks</p>
                <p className="text-sm opacity-80">To elite level</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">48</p>
                <p className="text-sm opacity-80">VO₂ max target</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">94%</p>
                <p className="text-sm opacity-80">Success probability</p>
              </div>
            </div>
            <div className="p-4 mt-6 bg-white rounded-lg bg-opacity-20">
              <p className="text-sm">
                <strong>Aman's Analysis:</strong> Your respiratory system shows exceptional potential for enhancement. 
                With your current lung function at 95% of predicted values and consistent SpO₂ levels, you're positioned 
                for rapid improvements. The combination of advanced breathing techniques, targeted exercise, and environmental 
                optimization will elevate your respiratory performance to athletic levels within 12 weeks.
              </p>
            </div>
          </div>

          <div className="text-center">
            <button className="px-8 py-4 font-bold text-white transition-all duration-200 transform shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 hover:scale-105">
              Activate Aman's Respiratory Excellence Protocol
            </button>
          </div>
        </div>
      )}
    </PlanDashboardLayout>
  );
};

export default RespiratoryHealthDashboard;