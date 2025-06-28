// src/components/plans/dashboards/DiabetesBloodSugarDashboard.jsx
import React, { useState, useEffect } from 'react';
import medicalBodyImage from '../../../assets/images/medical-body-diabetes.png';
import { 
  Activity,
  TrendingUp,
  Droplets,
  Flame,
  Target,
  Calendar,
  AlertCircle,
  Plus,
  Minus,
  Heart,
  Timer,
  Zap,
  Brain,
  Sparkles,
  TrendingDown,
  Bot,
  AlertTriangle,
  Clock,
  Utensils,
  Moon,
  Sun,
  Coffee,
  Cookie,
  Scale,
  ChevronLeft,
  ChevronRight,
  Info,
  Shield,
  Syringe
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, RadialBarChart, RadialBar, Cell } from 'recharts';
import PlanDashboardLayout from '../../common/PlanDashboardLayout';
import { fetchRealTimeData } from '../../../hooks/useMediCureOnData';

const DiabetesBloodSugarDashboard = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTimeframe, setSelectedTimeframe] = useState('daily');
  const [glucoseUnit, setGlucoseUnit] = useState('mg/dl');
  const [targetGlucose, setTargetGlucose] = useState(100);
  const [insulinSensitivity, setInsulinSensitivity] = useState('moderate');
  
  // Real-time glucose data states
  const [realtimeGlucose, setRealtimeGlucose] = useState({
    current: null,
    trend: null,
    lastReading: null,
    cgmConnected: false
  });

  // Fetch real-time glucose data
  useEffect(() => {
    const fetchGlucoseData = async () => {
      try {
        // This would be your actual CGM endpoint
        const response = await fetchRealTimeData('/api/iomt/diabetes/glucose', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setRealtimeGlucose(data);
        }
      } catch (error) {
        console.error('Error fetching glucose data:', error);
      }
    };

    // Fetch immediately
    fetchGlucoseData();
    
    // Set up polling for real-time data every 5 minutes (CGM update frequency)
    const interval = setInterval(fetchGlucoseData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Mock data for blood glucose throughout the day
  const glucoseData = [
    { time: '6 AM', glucose: 95, event: 'Fasting' },
    { time: '8 AM', glucose: 140, event: 'After Breakfast' },
    { time: '10 AM', glucose: 110, event: '' },
    { time: '12 PM', glucose: 105, event: 'Before Lunch' },
    { time: '2 PM', glucose: 135, event: 'After Lunch' },
    { time: '4 PM', glucose: 100, event: '' },
    { time: '6 PM', glucose: 95, event: 'Before Dinner' },
    { time: '8 PM', glucose: 130, event: 'After Dinner' },
    { time: '10 PM', glucose: 105, event: 'Before Bed' }
  ];

  // A1C trend data
  const a1cTrend = [
    { month: 'Jun', a1c: 7.2 },
    { month: 'Jul', a1c: 6.9 },
    { month: 'Aug', a1c: 6.7 },
    { month: 'Sep', a1c: 6.5 },
    { month: 'Oct', a1c: 6.3 },
    { month: 'Nov', a1c: 6.1 }
  ];

  // Recommended meals
  const recommendedMeals = [
    { name: "Scrambled eggs with spinach", category: "BREAKFAST", glycemicIndex: "Low", carbs: 5, protein: 18, image: "🥚" },
    { name: "Chicken and Avocado", category: "LUNCH", glycemicIndex: "Low", carbs: 12, protein: 30, image: "🥗" },
    { name: "Salmon with asparagus", category: "DINNER", glycemicIndex: "Low", carbs: 8, protein: 35, image: "🐟" },
    { name: "Greek yogurt with berries", category: "SNACK", glycemicIndex: "Medium", carbs: 15, protein: 12, image: "🥛" },
    { name: "Mixed nuts", category: "SNACK", glycemicIndex: "Low", carbs: 6, protein: 8, image: "🥜" }
  ];

  // Time in range calculation
  const timeInRange = {
    low: 5,
    target: 75,
    high: 20
  };

  // Insulin and medication schedule
  const medicationSchedule = [
    { time: '7:00 AM', type: 'Long-acting insulin', dose: '20 units', taken: true },
    { time: '8:00 AM', type: 'Metformin', dose: '500mg', taken: true },
    { time: '1:00 PM', type: 'Rapid-acting insulin', dose: '8 units', taken: false },
    { time: '8:00 PM', type: 'Metformin', dose: '500mg', taken: false }
  ];

  // Custom badges for this plan
  const customBadges = [
    {
      text: realtimeGlucose.current ? `${realtimeGlucose.current} mg/dl` : 'A1C: 6.1%',
      className: "flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full",
      icon: () => <TrendingDown className="w-3 h-3 text-white mr-1.5" />
    }
  ];

  return (
    <PlanDashboardLayout
      planId={2}
      planName="Diabetes & Blood Sugar Control"
      subtitle="Happiness is nothing more than good health"
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
          Diabetes & Blood Sugar
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
          {/* Main Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column - Body Visualization */}
            <div className="lg:col-span-1">
              <div className="h-full p-6 bg-white shadow-sm rounded-xl">
                <h3 className="mb-4 font-semibold text-gray-900">Health Metrics</h3>
                
                {/* Body Visualization */}
                <div className="relative mb-6">
                  <div className="relative w-48 h-64 mx-auto">
                    <img 
                      src={medicalBodyImage}
                      alt="Medical body visualization"
                      className="object-contain w-full h-full"
                    />
                    
                    {/* Pancreas highlight overlay */}
                    <div 
                      className="absolute"
                      style={{ 
                        top: '42%', 
                        left: '50%', 
                        transform: 'translate(-50%, -50%)',
                        width: '60px',
                        height: '30px'
                      }}
                    >
                      <div className="relative w-full h-full">
                        <div className="absolute inset-0 bg-orange-400 rounded-full opacity-30 animate-pulse"></div>
                        <div className="absolute inset-0 bg-orange-500 rounded-full opacity-20 animate-ping"></div>
                        
                        <div className="absolute px-2 py-1 text-xs font-medium text-white transform -translate-x-1/2 bg-orange-500 rounded-full -bottom-6 left-1/2 whitespace-nowrap">
                          Pancreas
                        </div>
                      </div>
                    </div>
                    
                    {/* Glucose indicators */}
                    <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                      <div className="relative">
                        <div className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ top: '-20px', left: '-30px' }}></div>
                        <div className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ top: '-10px', left: '30px', animationDelay: '0.5s' }}></div>
                        <div className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ top: '20px', left: '-25px', animationDelay: '1s' }}></div>
                        <div className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ top: '15px', left: '25px', animationDelay: '1.5s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-red-50">
                    <span className="text-sm font-medium">Water</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-red-600">10%</span>
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50">
                    <span className="text-sm font-medium">Visceral fat</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-orange-600">25%</span>
                      <TrendingUp className="w-4 h-4 text-orange-600" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                    <span className="text-sm font-medium">Waist (in)</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-green-600">34</span>
                      <TrendingDown className="w-4 h-4 text-green-600" />
                    </div>
                  </div>

                  {/* BMI */}
                  <div className="p-4 mt-4 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">BMI</span>
                      <span className="text-xs text-gray-500">21 Jan, 2025 at 10:10</span>
                    </div>
                    <p className="mb-2 text-2xl font-bold">22.5</p>
                    <div className="relative h-2 rounded-full bg-gradient-to-r from-blue-400 via-green-400 to-red-400">
                      <div className="absolute w-3 h-3 bg-white border-2 border-gray-800 rounded-full" 
                        style={{ left: '40%', top: '-2px' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column - Stats Cards */}
            <div className="space-y-6 lg:col-span-2">
              {/* Top Stats Row */}
              <div className="grid grid-cols-2 gap-4">
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
                        <Flame className="w-5 h-5" />
                      </div>
                      <span className="font-semibold">Calories</span>
                    </div>
                  </div>
                  <p className="mb-1 text-3xl font-bold">1,200</p>
                  <p className="text-sm">Today</p>
                </div>
              </div>

              {/* Blood Pressure and Glucose Cards */}
              <div className="grid grid-cols-2 gap-4">
                {/* Blood Pressure */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h3 className="flex items-center mb-4 font-semibold text-gray-900">
                    <Droplets className="w-5 h-5 mr-2 text-red-500" />
                    Blood pressure
                  </h3>
                  <div className="flex items-baseline mb-2 space-x-2">
                    <span className="text-3xl font-bold text-red-600">102</span>
                    <span className="text-lg text-gray-600">/72</span>
                    <span className="text-sm text-gray-500">mmHg</span>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Normal
                  </span>
                  <div className="mt-4">
                    <ResponsiveContainer width="100%" height={60}>
                      <AreaChart data={[
                        { time: 1, sys: 120, dia: 80 },
                        { time: 2, sys: 118, dia: 78 },
                        { time: 3, sys: 115, dia: 75 },
                        { time: 4, sys: 110, dia: 73 },
                        { time: 5, sys: 102, dia: 72 }
                      ]}>
                        <Area type="monotone" dataKey="sys" stroke="#EF4444" fill="#FEE2E2" strokeWidth={2} />
                        <Area type="monotone" dataKey="dia" stroke="#3B82F6" fill="#DBEAFE" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Glucose */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h3 className="flex items-center mb-4 font-semibold text-gray-900">
                    <Droplets className="w-5 h-5 mr-2 text-yellow-500" />
                    Glucose
                  </h3>
                  <div className="flex items-baseline mb-2 space-x-2">
                    <span className="text-3xl font-bold text-yellow-600">
                      {realtimeGlucose.current || 85}
                    </span>
                    <span className="text-sm text-gray-500">mg/dl</span>
                    {realtimeGlucose.trend && (
                      <span className={`text-sm ${realtimeGlucose.trend === 'rising' ? 'text-red-500' : 'text-green-500'}`}>
                        {realtimeGlucose.trend === 'rising' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                  {realtimeGlucose.cgmConnected && (
                    <p className="mb-2 text-xs text-green-600">CGM Connected</p>
                  )}
                  <div className="relative">
                    <div className="w-32 h-32 mx-auto">
                      <svg viewBox="0 0 100 100" className="transform -rotate-90">
                        <circle cx="50" cy="50" r="40" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                        <circle cx="50" cy="50" r="40" stroke="#22C55E" strokeWidth="8" fill="none"
                          strokeDasharray={`${2 * Math.PI * 40 * 0.7} ${2 * Math.PI * 40}`}
                          strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-medium text-green-600">Normal</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Glucose Monitoring Chart */}
          <div className="p-6 mt-6 bg-white shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">24-Hour Glucose Monitoring</h3>
              <div className="flex items-center space-x-4">
                <span className="flex items-center text-sm">
                  <div className="w-3 h-3 mr-2 bg-green-500 rounded-full"></div>
                  Target Range (70-130 mg/dl)
                </span>
                <select 
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="px-3 py-1 text-sm border rounded-lg"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={glucoseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" />
                <YAxis domain={[60, 160]} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload[0]) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 bg-white border rounded-lg shadow-lg">
                          <p className="font-semibold">{data.time}</p>
                          <p className="text-sm">Glucose: {data.glucose} mg/dl</p>
                          {data.event && <p className="text-xs text-gray-500">{data.event}</p>}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {/* Target range background */}
                <defs>
                  <linearGradient id="targetRange" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22C55E" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#22C55E" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey={() => 130} stroke="none" fill="url(#targetRange)" />
                <Area type="monotone" dataKey={() => 70} stroke="none" fill="white" />
                <Line type="monotone" dataKey="glucose" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Recommended Meals */}
          <div className="p-6 mt-6 bg-white shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Recommended protein and healthy fat meals</h3>
              <div className="flex space-x-2">
                <button className="p-1 rounded hover:bg-gray-100">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="p-1 rounded hover:bg-gray-100">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {recommendedMeals.map((meal, index) => (
                <div key={index} className="cursor-pointer group">
                  <div className="relative p-4 transition-all bg-gray-100 rounded-lg hover:shadow-md">
                    <span className="absolute px-2 py-1 text-xs font-medium bg-white rounded-full top-2 right-2">
                      {meal.category}
                    </span>
                    <div className="mb-3 text-4xl text-center">{meal.image}</div>
                    <h4 className="mb-1 text-sm font-medium text-gray-900">{meal.name}</h4>
                    <div className="text-xs text-gray-500">
                      <p>Carbs: {meal.carbs}g</p>
                      <p>Protein: {meal.protein}g</p>
                      <p className="font-medium text-green-600">GI: {meal.glycemicIndex}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Metrics Row */}
          <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-3">
            {/* Time in Range */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="mb-4 font-semibold text-gray-900">Time in Range (24h)</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>High (&gt;180)</span>
                    <span className="font-medium">{timeInRange.high}%</span>
                  </div>
                  <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                    <div className="h-full bg-red-500" style={{ width: `${timeInRange.high}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Target (70-180)</span>
                    <span className="font-medium">{timeInRange.target}%</span>
                  </div>
                  <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                    <div className="h-full bg-green-500" style={{ width: `${timeInRange.target}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Low (&lt;70)</span>
                    <span className="font-medium">{timeInRange.low}%</span>
                  </div>
                  <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                    <div className="h-full bg-orange-500" style={{ width: `${timeInRange.low}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* A1C Progress */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="mb-4 font-semibold text-gray-900">A1C Progress</h3>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={a1cTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[5, 8]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="a1c" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-2 text-center">
                <p className="text-sm text-gray-600">Current A1C: <span className="font-bold text-green-600">6.1%</span></p>
                <p className="text-xs text-gray-500">Target: &lt; 7.0%</p>
              </div>
            </div>

            {/* Medication Schedule */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="flex items-center mb-4 font-semibold text-gray-900">
                <Syringe className="w-5 h-5 mr-2 text-blue-600" />
                Today's Medications
              </h3>
              <div className="space-y-2">
                {medicationSchedule.map((med, index) => (
                  <div key={index} className={`flex items-center justify-between p-2 rounded-lg ${med.taken ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full ${med.taken ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div>
                        <p className="text-sm font-medium">{med.type}</p>
                        <p className="text-xs text-gray-500">{med.time} • {med.dose}</p>
                      </div>
                    </div>
                    {!med.taken && (
                      <button className="px-3 py-1 text-xs text-white bg-blue-600 rounded-full hover:bg-blue-700">
                        Take
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insights Banner */}
          <div className="p-6 mt-6 text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-2 text-xl font-bold">Great glucose control today! 🎯</h3>
                <p className="text-sm opacity-90">Your average glucose is 95 mg/dl with 75% time in range. Keep up the excellent work!</p>
                <div className="flex items-center mt-3 space-x-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span className="text-sm">30 Day Streak</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="w-5 h-5" />
                    <span className="text-sm">A1C Improving</span>
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
          <div className="p-8 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-4 space-x-3">
                  <div className="p-3 bg-white rounded-full bg-opacity-20">
                    <Bot className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-bold">Aman AI Coach</h2>
                </div>
                <p className="text-lg opacity-90">Your personalized diabetes management assistant</p>
              </div>
              <Sparkles className="w-16 h-16 opacity-20" />
            </div>
          </div>

          {/* Glucose Target Setting */}
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h3 className="flex items-center mb-4 text-xl font-semibold">
              <Target className="w-5 h-5 mr-2 text-indigo-600" />
              Aman's Personalized Glucose Targets
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="p-4 text-center rounded-lg bg-blue-50">
                <Sun className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <h4 className="mb-1 font-medium">Fasting</h4>
                <p className="text-2xl font-bold text-blue-600">80-110</p>
                <p className="text-sm text-gray-600">mg/dl</p>
              </div>
              <div className="p-4 text-center rounded-lg bg-orange-50">
                <Utensils className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <h4 className="mb-1 font-medium">Before Meals</h4>
                <p className="text-2xl font-bold text-orange-600">80-130</p>
                <p className="text-sm text-gray-600">mg/dl</p>
              </div>
              <div className="p-4 text-center rounded-lg bg-purple-50">
                <Clock className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <h4 className="mb-1 font-medium">2hrs After Meals</h4>
                <p className="text-2xl font-bold text-purple-600">&lt;180</p>
                <p className="text-sm text-gray-600">mg/dl</p>
              </div>
            </div>
          </div>

          {/* AI Recommendations Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Meal Timing Optimization */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="flex items-center mb-4 text-lg font-semibold">
                <Clock className="w-5 h-5 mr-2 text-green-600" />
                Aman's Optimal Meal Schedule
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-green-50">
                  <div className="flex items-center space-x-3">
                    <Coffee className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">Breakfast</p>
                      <p className="text-sm text-gray-600">Low carb, high protein</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">7:00 AM</p>
                    <p className="text-xs text-gray-500">30g carbs max</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50">
                  <div className="flex items-center space-x-3">
                    <Sun className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Lunch</p>
                      <p className="text-sm text-gray-600">Balanced macros</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">12:30 PM</p>
                    <p className="text-xs text-gray-500">45g carbs max</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-purple-50">
                  <div className="flex items-center space-x-3">
                    <Moon className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Dinner</p>
                      <p className="text-sm text-gray-600">Light, early dinner</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-purple-600">6:00 PM</p>
                    <p className="text-xs text-gray-500">35g carbs max</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-yellow-50">
                  <p className="text-sm text-yellow-800">
                    <strong>Aman's Tip:</strong> Spacing meals 4-5 hours apart helps maintain stable glucose levels throughout the day.
                  </p>
                </div>
              </div>
            </div>

            {/* Exercise Recommendations */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="flex items-center mb-4 text-lg font-semibold">
                <Activity className="w-5 h-5 mr-2 text-indigo-600" />
                Aman's Exercise Protocol
              </h3>
              <div className="space-y-4">
                <div className="p-4 border border-indigo-200 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50">
                  <h4 className="mb-2 font-medium text-indigo-900">Morning Walk</h4>
                  <p className="text-sm text-gray-700">30 minutes after breakfast helps reduce post-meal glucose spikes by up to 30%.</p>
                  <div className="flex items-center mt-2 text-xs text-indigo-600">
                    <Clock className="w-3 h-3 mr-1" />
                    Best time: 8:00-8:30 AM
                  </div>
                </div>

                <div className="p-4 border border-green-200 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                  <h4 className="mb-2 font-medium text-green-900">Resistance Training</h4>
                  <p className="text-sm text-gray-700">2-3 times per week improves insulin sensitivity by 25% over 3 months.</p>
                  <div className="flex items-center mt-2 text-xs text-green-600">
                    <Calendar className="w-3 h-3 mr-1" />
                    Mon, Wed, Fri at 5:00 PM
                  </div>
                </div>

                <div className="p-4 border border-purple-200 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                  <h4 className="mb-2 font-medium text-purple-900">Evening Yoga</h4>
                  <p className="text-sm text-gray-700">Reduces stress hormones that can spike glucose levels overnight.</p>
                  <div className="flex items-center mt-2 text-xs text-purple-600">
                    <Moon className="w-3 h-3 mr-1" />
                    Daily at 8:00 PM
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Glucose Pattern Analysis */}
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h3 className="flex items-center mb-4 text-lg font-semibold">
              <Brain className="w-5 h-5 mr-2 text-purple-600" />
              Aman's Pattern Analysis & Predictions
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg bg-red-50">
                <AlertTriangle className="w-6 h-6 mb-2 text-red-600" />
                <h4 className="mb-1 font-medium text-red-900">Dawn Phenomenon Detected</h4>
                <p className="text-sm text-gray-700">Your glucose rises 15-20 mg/dl between 4-7 AM.</p>
                <p className="mt-2 text-xs font-medium text-red-600">Aman suggests: Adjust basal insulin timing</p>
              </div>

              <div className="p-4 rounded-lg bg-green-50">
                <TrendingDown className="w-6 h-6 mb-2 text-green-600" />
                <h4 className="mb-1 font-medium text-green-900">Excellent Post-Meal Control</h4>
                <p className="text-sm text-gray-700">Your glucose returns to baseline within 2 hours 85% of the time.</p>
                <p className="mt-2 text-xs font-medium text-green-600">Keep up the great work!</p>
              </div>

              <div className="p-4 rounded-lg bg-blue-50">
                <Info className="w-6 h-6 mb-2 text-blue-600" />
                <h4 className="mb-1 font-medium text-blue-900">Weekend Pattern</h4>
                <p className="text-sm text-gray-700">Glucose runs 10% higher on weekends due to schedule changes.</p>
                <p className="mt-2 text-xs font-medium text-blue-600">Aman suggests: Maintain meal timing</p>
              </div>
            </div>
          </div>

          {/* Personalized Action Plan */}
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h3 className="flex items-center mb-4 text-lg font-semibold">
              <Zap className="w-5 h-5 mr-2 text-orange-600" />
              Aman's 30-Day Optimization Plan
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-8 h-8 font-bold text-white bg-indigo-600 rounded-full">1</div>
                <div className="flex-1">
                  <h4 className="font-medium">Week 1-2: Stabilize Fasting Glucose</h4>
                  <p className="text-sm text-gray-600">Focus on consistent dinner timing and reduce late-night snacking</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-8 h-8 font-bold text-white bg-indigo-600 rounded-full">2</div>
                <div className="flex-1">
                  <h4 className="font-medium">Week 3-4: Optimize Post-Meal Response</h4>
                  <p className="text-sm text-gray-600">Implement 15-minute walks after each meal</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-8 h-8 font-bold text-white bg-indigo-600 rounded-full">3</div>
                <div className="flex-1">
                  <h4 className="font-medium">Month 2: Reduce A1C by 0.3%</h4>
                  <p className="text-sm text-gray-600">Fine-tune insulin-to-carb ratios based on continuous monitoring</p>
                </div>
              </div>
            </div>
          </div>

          {/* Success Prediction */}
          <div className="p-6 text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
            <h3 className="flex items-center mb-4 text-xl font-semibold">
              <Target className="w-6 h-6 mr-2" />
              Aman's Success Prediction
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <div className="text-center">
                <p className="text-3xl font-bold">5.8%</p>
                <p className="text-sm opacity-80">Target A1C</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">3 months</p>
                <p className="text-sm opacity-80">To achieve target</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">92%</p>
                <p className="text-sm opacity-80">Success probability</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">85%</p>
                <p className="text-sm opacity-80">Time in range goal</p>
              </div>
            </div>
            <div className="p-4 mt-6 bg-white rounded-lg bg-opacity-20">
              <p className="text-sm">
                <strong>Aman's Analysis:</strong> Based on your current trends and adherence patterns, you're on track to achieve optimal glucose control. Your consistency with monitoring and meal timing gives you a significant advantage.
              </p>
            </div>
          </div>

          {/* Start AI Plan Button */}
          <div className="text-center">
            <button className="px-8 py-4 font-bold text-white transition-all duration-200 transform shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 hover:scale-105">
              Activate Aman's Diabetes Optimization Plan
            </button>
          </div>
        </div>
      )}
    </PlanDashboardLayout>
  );
};

export default DiabetesBloodSugarDashboard;