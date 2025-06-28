import React, { useState, useEffect } from 'react';
import { 
  Activity,
  Calendar,
  Droplets,
  Target,
  AlertCircle,
  Timer,
  Zap,
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
  Heart,
  Moon,
  Sun,
  Flower2,
  Baby,
  Pill,
  Apple,
  BarChart3,
  Thermometer,
  HeartHandshake,
  Stethoscope,
  CircleDot,
  Gauge
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, RadialBarChart, RadialBar, Cell, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import PlanDashboardLayout from '../../common/PlanDashboardLayout';
import { fetchRealTimeData } from '../../../hooks/useMediCureOnData';

const WomenReproductiveHormonalDashboard = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTimeframe, setSelectedTimeframe] = useState('current-cycle');
  const [cycleDay, setCycleDay] = useState(14);
  const [selectedMonth, setSelectedMonth] = useState('current');
  
  // Real-time IoMT data states
  const [realtimeMetrics, setRealtimeMetrics] = useState({
    temperature: null,
    heartRateVariability: null,
    lastUpdated: null
  });

  // Fetch real-time IoMT data
  useEffect(() => {
    const fetchRealtimeData = async () => {
      try {
        const response = await fetchRealTimeData('/api/iomt/womens-health/realtime', {
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

  // Hormone levels throughout cycle
  const hormoneData = [
    { day: 1, estrogen: 20, progesterone: 5, lh: 10, fsh: 25, phase: 'Menstrual' },
    { day: 5, estrogen: 30, progesterone: 5, lh: 12, fsh: 15, phase: 'Follicular' },
    { day: 10, estrogen: 60, progesterone: 8, lh: 20, fsh: 10, phase: 'Follicular' },
    { day: 14, estrogen: 90, progesterone: 10, lh: 65, fsh: 8, phase: 'Ovulation' },
    { day: 18, estrogen: 70, progesterone: 50, lh: 15, fsh: 5, phase: 'Luteal' },
    { day: 24, estrogen: 40, progesterone: 70, lh: 10, fsh: 5, phase: 'Luteal' },
    { day: 28, estrogen: 25, progesterone: 20, lh: 8, fsh: 10, phase: 'Pre-menstrual' }
  ];

  // Cycle symptoms tracking
  const symptomsData = [
    { symptom: 'Mood', intensity: 75, optimal: 90 },
    { symptom: 'Energy', intensity: 65, optimal: 85 },
    { symptom: 'Sleep Quality', intensity: 70, optimal: 90 },
    { symptom: 'Cramping', intensity: 30, optimal: 10 },
    { symptom: 'Bloating', intensity: 40, optimal: 15 },
    { symptom: 'Libido', intensity: 80, optimal: 80 }
  ];

  // Temperature tracking (BBT)
  const temperatureData = [
    { day: 1, temp: 97.2, phase: 'Menstrual' },
    { day: 5, temp: 97.3, phase: 'Follicular' },
    { day: 10, temp: 97.4, phase: 'Follicular' },
    { day: 14, temp: 97.8, phase: 'Ovulation' },
    { day: 18, temp: 98.2, phase: 'Luteal' },
    { day: 24, temp: 98.1, phase: 'Luteal' },
    { day: 28, temp: 97.6, phase: 'Pre-menstrual' }
  ];

  // Fertility window data
  const fertilityData = [
    { day: 'Day 10', fertility: 20, label: 'Low' },
    { day: 'Day 11', fertility: 40, label: 'Medium' },
    { day: 'Day 12', fertility: 70, label: 'High' },
    { day: 'Day 13', fertility: 90, label: 'Peak' },
    { day: 'Day 14', fertility: 95, label: 'Peak' },
    { day: 'Day 15', fertility: 60, label: 'High' },
    { day: 'Day 16', fertility: 30, label: 'Medium' }
  ];

  // Cycle phases for calendar
  const cycleCalendar = {
    days: Array.from({ length: 28 }, (_, i) => ({
      day: i + 1,
      phase: i < 5 ? 'menstrual' : i < 14 ? 'follicular' : i === 14 ? 'ovulation' : 'luteal',
      isToday: i + 1 === cycleDay
    }))
  };

  // Recommended foods by cycle phase
  const phaseFoods = {
    menstrual: [
      { name: "Dark leafy greens", benefit: "Iron replenishment", icon: "🥬" },
      { name: "Dark chocolate", benefit: "Magnesium for cramps", icon: "🍫" },
      { name: "Ginger tea", benefit: "Anti-inflammatory", icon: "🍵" }
    ],
    follicular: [
      { name: "Sprouted foods", benefit: "Support rising estrogen", icon: "🌱" },
      { name: "Citrus fruits", benefit: "Vitamin C boost", icon: "🍊" },
      { name: "Avocado", benefit: "Healthy fats", icon: "🥑" }
    ],
    luteal: [
      { name: "Complex carbs", benefit: "Stabilize mood", icon: "🍠" },
      { name: "Chickpeas", benefit: "B vitamins", icon: "🫘" },
      { name: "Dark berries", benefit: "Antioxidants", icon: "🫐" }
    ]
  };

  // Bone density and health metrics
  const healthMetrics = {
    boneDensity: 92,
    cardiovascular: 88,
    metabolic: 85,
    hormonal: 78,
    mental: 82
  };

  // Menopause transition indicators (for 40+ users)
  const menopauseIndicators = {
    avgCycleLength: 26,
    cycleVariability: 3,
    hotFlashFrequency: 2,
    nightSweats: 1,
    moodChanges: 'Mild'
  };

  // Custom badges for this plan
  const customBadges = [
    {
      text: `Day ${cycleDay}`,
      className: "flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full",
      icon: () => <CircleDot className="w-3 h-3 text-white mr-1.5" />
    }
  ];

  return (
    <PlanDashboardLayout
      planId={3}
      planName="Women's Reproductive & Hormonal Health"
      subtitle="Your Women's Health Dashboard 🌸"
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
          Women's Health
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
          {/* Cycle Overview and Stats */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
            {/* Cycle Calendar */}
            <div className="p-6 bg-white shadow-sm lg:col-span-2 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Your current cycle</h3>
                <select className="px-2 py-1 text-sm border rounded">
                  <option>Jan 2025</option>
                </select>
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} className="text-xs font-medium text-center text-gray-500">{day}</div>
                ))}
                {cycleCalendar.days.map((day) => (
                  <div 
                    key={day.day}
                    className={`relative p-2 text-center rounded-lg cursor-pointer transition-all ${
                      day.isToday ? 'ring-2 ring-[#F1C40F]' : ''
                    } ${
                      day.phase === 'menstrual' ? 'bg-red-100 text-red-700' :
                      day.phase === 'follicular' ? 'bg-green-100 text-green-700' :
                      day.phase === 'ovulation' ? 'bg-purple-100 text-purple-700' :
                      'bg-orange-100 text-orange-700'
                    }`}
                  >
                    <span className="text-sm font-medium">{day.day}</span>
                    {day.day === 14 && (
                      <div className="absolute top-0 right-0 w-2 h-2 bg-purple-600 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Current Phase Indicator */}
              <div className="relative mt-4">
                <div className="flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    <svg viewBox="0 0 200 200" className="transform -rotate-90">
                      <circle cx="100" cy="100" r="90" stroke="#E5E7EB" strokeWidth="20" fill="none" />
                      <circle 
                        cx="100" 
                        cy="100" 
                        r="90" 
                        stroke="#7C3AED" 
                        strokeWidth="20" 
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 90 * (cycleDay / 28)} ${2 * Math.PI * 90}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-lg font-medium text-gray-600">Day</p>
                      <p className="text-4xl font-bold text-[#02276F]">{cycleDay}</p>
                      <p className="text-sm text-purple-600">Follicular</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase Legend */}
              <div className="flex justify-center mt-4 space-x-4 text-xs">
                <span className="flex items-center">
                  <div className="w-3 h-3 mr-1 bg-red-500 rounded-full"></div>
                  Menstrual
                </span>
                <span className="flex items-center">
                  <div className="w-3 h-3 mr-1 bg-green-500 rounded-full"></div>
                  Follicular
                </span>
                <span className="flex items-center">
                  <div className="w-3 h-3 mr-1 bg-purple-500 rounded-full"></div>
                  Ovulation
                </span>
                <span className="flex items-center">
                  <div className="w-3 h-3 mr-1 bg-orange-500 rounded-full"></div>
                  Luteal
                </span>
              </div>

              {/* Phase-specific foods */}
              <div className="mt-4">
                <h4 className="mb-2 text-sm font-medium text-gray-700">Recommended Low-Calorie and Heart-Healthy Meals</h4>
                <div className="grid grid-cols-3 gap-2">
                  {phaseFoods.follicular.map((food, i) => (
                    <div key={i} className="p-3 text-center rounded-lg bg-gray-50">
                      <div className="mb-1 text-2xl">{food.icon}</div>
                      <p className="text-xs font-medium">{food.name}</p>
                      <p className="text-xs text-gray-500">{food.benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Stats Column */}
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
                <p className="mb-1 text-3xl font-bold">1,850</p>
                <p className="text-sm">kCal</p>
              </div>

              {/* Temperature Card */}
              <div className="p-6 bg-white shadow-sm rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="w-5 h-5 text-pink-600" />
                    <span className="font-semibold">Temperature</span>
                  </div>
                </div>
                <p className="mb-1 text-3xl font-bold">
                  {realtimeMetrics.temperature || 98.2}
                </p>
                <div className="relative w-full h-16 mt-2">
                  <svg viewBox="0 0 100 40" className="w-full h-full">
                    <path d="M 10 30 Q 30 20 50 25 T 90 20" stroke="#EC4899" strokeWidth="2" fill="none" />
                  </svg>
                  <div className="absolute text-xs text-center -bottom-2">
                    <span className="text-pink-600">Post-ovulation</span>
                  </div>
                </div>
                {realtimeMetrics.lastUpdated && (
                  <p className="mt-2 text-xs text-center text-gray-400">
                    Updated {new Date(realtimeMetrics.lastUpdated).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Hormone Balance Analysis */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
            {/* Hormone Levels Chart */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="mb-4 font-semibold text-gray-900">Hormonal balance</h3>
              <div className="text-xs text-right text-gray-500">21 Jan, 2025 at 10:10</div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={hormoneData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" label={{ value: 'Cycle Day', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Hormone Level', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="estrogen" stroke="#EC4899" strokeWidth={2} name="Estrogen" />
                  <Line type="monotone" dataKey="progesterone" stroke="#8B5CF6" strokeWidth={2} name="Progesterone" />
                  <Line type="monotone" dataKey="lh" stroke="#F59E0B" strokeWidth={2} name="LH" />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-center mt-2 space-x-4 text-xs">
                <span className="flex items-center">
                  <div className="w-3 h-3 mr-1 bg-pink-500 rounded-full"></div>
                  Estrogen
                </span>
                <span className="flex items-center">
                  <div className="w-3 h-3 mr-1 bg-purple-600 rounded-full"></div>
                  Progesterone
                </span>
                <span className="flex items-center">
                  <div className="w-3 h-3 mr-1 bg-yellow-500 rounded-full"></div>
                  LH
                </span>
              </div>
            </div>

            {/* Current Hormone Levels */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="mb-4 font-semibold text-gray-900">Current Hormone Levels</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 text-center rounded-lg bg-pink-50">
                  <div className="relative w-20 h-20 mx-auto mb-2">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                      <circle cx="50" cy="50" r="40" stroke="#FEE2E2" strokeWidth="8" fill="none" />
                      <circle cx="50" cy="50" r="40" stroke="#EC4899" strokeWidth="8" fill="none"
                        strokeDasharray={`${2 * Math.PI * 40 * 0.35} ${2 * Math.PI * 40}`}
                        strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-pink-600">35</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium">Testosterone</p>
                  <p className="text-xs text-gray-500">ng/dL</p>
                </div>
                
                <div className="p-4 text-center rounded-lg bg-red-50">
                  <div className="relative w-20 h-20 mx-auto mb-2">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                      <circle cx="50" cy="50" r="40" stroke="#FEE2E2" strokeWidth="8" fill="none" />
                      <circle cx="50" cy="50" r="40" stroke="#EF4444" strokeWidth="8" fill="none"
                        strokeDasharray={`${2 * Math.PI * 40 * 0.85} ${2 * Math.PI * 40}`}
                        strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-red-600">85</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium">Cortisol</p>
                  <p className="text-xs text-gray-500">μg/dL</p>
                </div>

                <div className="p-4 text-center rounded-lg bg-yellow-50">
                  <div className="relative w-20 h-20 mx-auto mb-2">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                      <circle cx="50" cy="50" r="40" stroke="#FEF3C7" strokeWidth="8" fill="none" />
                      <circle cx="50" cy="50" r="40" stroke="#F59E0B" strokeWidth="8" fill="none"
                        strokeDasharray={`${2 * Math.PI * 40 * 0.95} ${2 * Math.PI * 40}`}
                        strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-yellow-600">295</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium">Estradiol</p>
                  <p className="text-xs text-gray-500">pg/mL</p>
                </div>

                <div className="p-4 text-center rounded-lg bg-green-50">
                  <div className="relative w-20 h-20 mx-auto mb-2">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                      <circle cx="50" cy="50" r="40" stroke="#D1FAE5" strokeWidth="8" fill="none" />
                      <circle cx="50" cy="50" r="40" stroke="#10B981" strokeWidth="8" fill="none"
                        strokeDasharray={`${2 * Math.PI * 40 * 0.25} ${2 * Math.PI * 40}`}
                        strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-green-600">25</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium">Estrone</p>
                  <p className="text-xs text-gray-500">pg/mL</p>
                </div>

                <div className="p-4 text-center rounded-lg bg-purple-50">
                  <div className="relative w-20 h-20 mx-auto mb-2">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                      <circle cx="50" cy="50" r="40" stroke="#EDE9FE" strokeWidth="8" fill="none" />
                      <circle cx="50" cy="50" r="40" stroke="#8B5CF6" strokeWidth="8" fill="none"
                        strokeDasharray={`${2 * Math.PI * 40 * 0.02} ${2 * Math.PI * 40}`}
                        strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-purple-600">2</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium">Progesterone</p>
                  <p className="text-xs text-gray-500">ng/mL</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fertility & Symptoms */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
            {/* Fertility Window */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="flex items-center mb-4 font-semibold text-gray-900">
                <Baby className="w-5 h-5 mr-2 text-purple-600" />
                Fertility Window
              </h3>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={fertilityData}>
                  <defs>
                    <linearGradient id="fertilityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" />
                  <YAxis hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="fertility" stroke="#8B5CF6" fillOpacity={1} fill="url(#fertilityGradient)" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-4 text-center">
                <p className="text-sm font-medium text-purple-600">Peak Fertility: Day 13-14</p>
                <p className="text-xs text-gray-500">Ovulation expected in 2 days</p>
              </div>
            </div>

            {/* Symptom Tracking */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="mb-4 font-semibold text-gray-900">Today's Symptoms</h3>
              <div className="space-y-3">
                {symptomsData.slice(0, 4).map((symptom, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>{symptom.symptom}</span>
                      <span className="font-medium">{symptom.intensity}%</span>
                    </div>
                    <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${symptom.intensity}%`,
                          backgroundColor: symptom.intensity > 50 ? '#22C55E' : '#F59E0B'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bone & Overall Health */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="mb-4 font-semibold text-gray-900">Overall Health Score</h3>
              <div className="relative mb-4">
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                      <circle cx="50" cy="50" r="40" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                      <circle cx="50" cy="50" r="40" stroke="#EC4899" strokeWidth="8" fill="none"
                        strokeDasharray={`${2 * Math.PI * 40 * 0.86} ${2 * Math.PI * 40}`}
                        strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-3xl font-bold text-pink-600">86%</p>
                      <p className="text-xs text-gray-500">Excellent</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Bone Density</span>
                  <span className="font-medium text-green-600">{healthMetrics.boneDensity}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Cardiovascular</span>
                  <span className="font-medium text-green-600">{healthMetrics.cardiovascular}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Hormonal Balance</span>
                  <span className="font-medium text-yellow-600">{healthMetrics.hormonal}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Menopause Transition Indicators (for 40+ users) */}
          <div className="p-6 mb-6 bg-white shadow-sm rounded-xl">
            <h3 className="mb-4 font-semibold text-gray-900">Perimenopause Indicators (Age 40+)</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              <div className="p-4 text-center rounded-lg bg-purple-50">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <p className="text-sm font-medium">Cycle Length</p>
                <p className="text-2xl font-bold text-purple-600">{menopauseIndicators.avgCycleLength} days</p>
                <p className="text-xs text-gray-500">±{menopauseIndicators.cycleVariability} days</p>
              </div>
              <div className="p-4 text-center rounded-lg bg-red-50">
                <ThermometerSun className="w-6 h-6 mx-auto mb-2 text-red-600" />
                <p className="text-sm font-medium">Hot Flashes</p>
                <p className="text-2xl font-bold text-red-600">{menopauseIndicators.hotFlashFrequency}/day</p>
                <p className="text-xs text-gray-500">Mild intensity</p>
              </div>
              <div className="p-4 text-center rounded-lg bg-blue-50">
                <Moon className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium">Night Sweats</p>
                <p className="text-2xl font-bold text-blue-600">{menopauseIndicators.nightSweats}/week</p>
                <p className="text-xs text-gray-500">Occasional</p>
              </div>
              <div className="p-4 text-center rounded-lg bg-orange-50">
                <Brain className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                <p className="text-sm font-medium">Mood Changes</p>
                <p className="text-2xl font-bold text-orange-600">{menopauseIndicators.moodChanges}</p>
                <p className="text-xs text-gray-500">Manageable</p>
              </div>
              <div className="p-4 text-center rounded-lg bg-green-50">
                <Shield className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="text-sm font-medium">Overall Status</p>
                <p className="text-lg font-bold text-green-600">Pre-menopause</p>
                <p className="text-xs text-gray-500">Regular monitoring</p>
              </div>
            </div>
          </div>

          {/* Health Insights */}
          <div className="p-6 text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-2 text-xl font-bold">Your hormonal balance looks great! 🌸</h3>
                <p className="text-sm opacity-90">
                  Your estrogen and progesterone levels are within optimal range for your cycle phase. 
                  Keep maintaining your healthy lifestyle!
                </p>
                <div className="flex items-center mt-3 space-x-4">
                  <div className="flex items-center space-x-2">
                    <Flower2 className="w-5 h-5" />
                    <span className="text-sm">Balanced Hormones</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <HeartHandshake className="w-5 h-5" />
                    <span className="text-sm">Healthy Cycle</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center justify-center w-24 h-24 bg-white rounded-full bg-opacity-20">
                  <Flower2 className="w-12 h-12" />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Aman AI Coach Tab */
        <div className="space-y-6">
          {/* AI Coach Header */}
          <div className="p-8 text-white bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-4 space-x-3">
                  <div className="p-3 bg-white rounded-full bg-opacity-20">
                    <Bot className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-bold">Aman AI Women's Health Coach</h2>
                </div>
                <p className="text-lg opacity-90">Your personalized reproductive & hormonal health optimizer</p>
              </div>
              <Sparkles className="w-16 h-16 opacity-20" />
            </div>
          </div>

          {/* Cycle Optimization Protocol */}
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h3 className="flex items-center mb-4 text-xl font-semibold">
              <CircleDot className="w-5 h-5 mr-2 text-pink-600" />
              Aman's Cycle Sync Protocol
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="p-4 text-center border-2 border-red-200 rounded-lg bg-red-50">
                <Droplets className="w-8 h-8 mx-auto mb-2 text-red-600" />
                <h4 className="mb-1 font-medium">Menstrual Phase</h4>
                <p className="mb-2 text-sm font-bold text-red-600">Days 1-5</p>
                <ul className="space-y-1 text-xs text-left text-gray-600">
                  <li>• Rest & gentle yoga</li>
                  <li>• Iron-rich foods</li>
                  <li>• Warm compresses</li>
                  <li>• Extra sleep</li>
                </ul>
              </div>
              <div className="p-4 text-center border-2 border-green-200 rounded-lg bg-green-50">
                <Flower2 className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <h4 className="mb-1 font-medium">Follicular Phase</h4>
                <p className="mb-2 text-sm font-bold text-green-600">Days 6-14</p>
                <ul className="space-y-1 text-xs text-left text-gray-600">
                  <li>• High-intensity workouts</li>
                  <li>• Fresh vegetables</li>
                  <li>• New projects</li>
                  <li>• Social activities</li>
                </ul>
              </div>
              <div className="p-4 text-center border-2 border-purple-200 rounded-lg bg-purple-50">
                <Sun className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <h4 className="mb-1 font-medium">Ovulatory Phase</h4>
                <p className="mb-2 text-sm font-bold text-purple-600">Days 15-17</p>
                <ul className="space-y-1 text-xs text-left text-gray-600">
                  <li>• Peak performance</li>
                  <li>• Antioxidant foods</li>
                  <li>• Important meetings</li>
                  <li>• HIIT workouts</li>
                </ul>
              </div>
              <div className="p-4 text-center border-2 border-orange-200 rounded-lg bg-orange-50">
                <Moon className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <h4 className="mb-1 font-medium">Luteal Phase</h4>
                <p className="mb-2 text-sm font-bold text-orange-600">Days 18-28</p>
                <ul className="space-y-1 text-xs text-left text-gray-600">
                  <li>• Strength training</li>
                  <li>• Complex carbs</li>
                  <li>• Self-care focus</li>
                  <li>• Magnesium foods</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Hormone Balancing Recommendations */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Nutrition Protocol */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="flex items-center mb-4 text-lg font-semibold">
                <Apple className="w-5 h-5 mr-2 text-pink-600" />
                Aman's Hormone-Balancing Nutrition
              </h3>
              <div className="space-y-4">
                <div className="p-4 border border-pink-200 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50">
                  <h4 className="mb-2 font-medium text-pink-900">Seed Cycling Protocol</h4>
                  <p className="text-sm text-gray-700">Days 1-14: 1 tbsp flax + 1 tbsp pumpkin seeds</p>
                  <p className="text-sm text-gray-700">Days 15-28: 1 tbsp sesame + 1 tbsp sunflower seeds</p>
                  <div className="flex items-center mt-2 text-xs text-pink-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Supports natural hormone production
                  </div>
                </div>

                <div className="p-4 border border-green-200 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                  <h4 className="mb-2 font-medium text-green-900">Phytoestrogen Foods</h4>
                  <p className="text-sm text-gray-700">Include: Soy, flaxseeds, chickpeas, berries</p>
                  <div className="flex items-center mt-2 text-xs text-green-600">
                    <Heart className="w-3 h-3 mr-1" />
                    Balances estrogen naturally
                  </div>
                </div>

                <div className="p-4 border border-purple-200 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                  <h4 className="mb-2 font-medium text-purple-900">Anti-Inflammatory Protocol</h4>
                  <p className="text-sm text-gray-700">Omega-3s, turmeric, green tea, leafy greens</p>
                  <div className="flex items-center mt-2 text-xs text-purple-600">
                    <Shield className="w-3 h-3 mr-1" />
                    Reduces PMS symptoms by 40%
                  </div>
                </div>
              </div>
            </div>

            {/* Symptom Management */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="flex items-center mb-4 text-lg font-semibold">
                <Stethoscope className="w-5 h-5 mr-2 text-pink-600" />
                Aman's Symptom Relief Protocols
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-pink-50">
                  <div className="flex items-center space-x-3">
                    <Brain className="w-5 h-5 text-pink-600" />
                    <span className="font-medium">PMS Mood Swings</span>
                  </div>
                  <span className="text-sm text-pink-600">B6 + Magnesium</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50">
                  <div className="flex items-center space-x-3">
                    <Droplets className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">Heavy Periods</span>
                  </div>
                  <span className="text-sm text-purple-600">Iron + Vitamin K</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50">
                  <div className="flex items-center space-x-3">
                    <Waves className="w-5 h-5 text-orange-600" />
                    <span className="font-medium">Cramping</span>
                  </div>
                  <span className="text-sm text-orange-600">Heat therapy + Yoga</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Low Energy</span>
                  </div>
                  <span className="text-sm text-green-600">CoQ10 + B Complex</span>
                </div>
              </div>
              <div className="p-3 mt-4 rounded-lg bg-pink-50">
                <p className="text-sm text-pink-800">
                  <strong>Aman notes:</strong> Your symptoms pattern suggests mild estrogen dominance. 
                  Focus on liver support and fiber intake.
                </p>
              </div>
            </div>
          </div>

          {/* Fertility Optimization (if applicable) */}
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h3 className="flex items-center mb-4 text-lg font-semibold">
              <Baby className="w-5 h-5 mr-2 text-pink-600" />
              Aman's Fertility Enhancement Protocol
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg bg-gradient-to-br from-pink-50 to-purple-50">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold text-white bg-pink-600 rounded-full">1</div>
                  <div>
                    <h4 className="mb-1 font-medium">Egg Quality Support</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• CoQ10: 600mg/day</li>
                      <li>• Vitamin D: 2000 IU</li>
                      <li>• Folate: 800mcg</li>
                      <li>• DHEA (if indicated)</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold text-white bg-purple-600 rounded-full">2</div>
                  <div>
                    <h4 className="mb-1 font-medium">Cervical Mucus Quality</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Hydration: 2.5L/day</li>
                      <li>• Evening primrose oil</li>
                      <li>• Vitamin E: 400 IU</li>
                      <li>• Avoid antihistamines</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-pink-50 to-purple-50">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold text-white bg-pink-600 rounded-full">3</div>
                  <div>
                    <h4 className="mb-1 font-medium">Timing Optimization</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• BBT tracking daily</li>
                      <li>• OPK testing day 10-16</li>
                      <li>• CM monitoring</li>
                      <li>• Intercourse day 11-15</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Perimenopause Support (40+) */}
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h3 className="flex items-center mb-4 text-lg font-semibold">
              <Gauge className="w-5 h-5 mr-2 text-pink-600" />
              Aman's Perimenopause Transition Support
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-3 font-medium">Hormone Support Supplements</h4>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 rounded bg-gray-50">
                    <span className="text-sm">Black Cohosh</span>
                    <span className="text-sm font-medium">80mg/day</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-gray-50">
                    <span className="text-sm">Maca Root</span>
                    <span className="text-sm font-medium">1500mg/day</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-gray-50">
                    <span className="text-sm">Ashwagandha</span>
                    <span className="text-sm font-medium">600mg/day</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-gray-50">
                    <span className="text-sm">DIM</span>
                    <span className="text-sm font-medium">200mg/day</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="mb-3 font-medium">Lifestyle Modifications</h4>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-pink-50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Hot Flash Management</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">Layer clothing, cool bedroom, avoid triggers</p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Bone Health</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">Weight-bearing exercise, calcium + D3</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Success Predictions */}
          <div className="p-6 text-white bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl">
            <h3 className="flex items-center mb-4 text-xl font-semibold">
              <Target className="w-6 h-6 mr-2" />
              Aman's Women's Health Optimization Predictions
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <div className="text-center">
                <p className="text-3xl font-bold">28 days</p>
                <p className="text-sm opacity-80">Optimal Cycle Length</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">-75%</p>
                <p className="text-sm opacity-80">PMS Symptom Reduction</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">95%</p>
                <p className="text-sm opacity-80">Hormone Balance Score</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">+40%</p>
                <p className="text-sm opacity-80">Energy Improvement</p>
              </div>
            </div>
            <div className="p-4 mt-6 bg-white rounded-lg bg-opacity-20">
              <p className="text-sm">
                <strong>Aman's Analysis:</strong> Based on your hormone patterns and cycle regularity, 
                implementing the cycle-sync protocol will optimize your reproductive health within 3 cycles. 
                Your follicular phase shows excellent responsiveness to nutritional interventions.
              </p>
            </div>
          </div>

          {/* Start AI Plan Button */}
          <div className="text-center">
            <button className="px-8 py-4 font-bold text-white transition-all duration-200 transform shadow-lg bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl hover:from-pink-700 hover:to-purple-700 hover:scale-105">
              Activate Aman's Women's Health Optimization Protocol
            </button>
          </div>
        </div>
      )}
    </PlanDashboardLayout>
  );   
};

export default WomenReproductiveHormonalDashboard;