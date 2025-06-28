// src/components/plans/dashboards/SleepMedicineDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Activity,
  Moon,
  Sun,
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
  CloudMoon,
  Sunrise,
  Sunset,
  Volume2,
  VolumeX,
  Pill,
  Coffee,
  Heart,
  BedDouble,
  Eye,
  EyeOff,
  BarChart3,
  Droplets
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, RadialBarChart, RadialBar, Cell, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import PlanDashboardLayout from '../../common/PlanDashboardLayout';
import { fetchRealTimeData } from '../../../hooks/useMediCureOnData';

const SleepMedicineDashboard = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedNight, setSelectedNight] = useState('last-night');
  const [sleepGoal, setSleepGoal] = useState(8);
  const [optimalBedtime, setOptimalBedtime] = useState('22:30');
  
  // Real-time IoMT data states
  const [realtimeMetrics, setRealtimeMetrics] = useState({
    currentSleepStage: null,
    heartRate: null,
    breathingRate: null,
    movement: null,
    lastUpdated: null
  });

  // Fetch real-time IoMT data for sleep monitoring
  useEffect(() => {
    const fetchRealtimeData = async () => {
      try {
        // This would be your actual IoMT endpoint
        const response = await fetchRealTimeData('/api/iomt/sleep/realtime', {
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
        console.error('Error fetching real-time sleep data:', error);
      }
    };

    // Fetch immediately
    fetchRealtimeData();
    
    // Set up polling for real-time data every 60 seconds (less frequent for sleep)
    const interval = setInterval(fetchRealtimeData, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Sleep quality data
  const sleepQualityData = [
    { day: '01am', quality: 60, stage: 'Light' },
    { day: '02am', quality: 85, stage: 'Deep' },
    { day: '03am', quality: 90, stage: 'Deep' },
    { day: '04am', quality: 70, stage: 'REM' },
    { day: '05am', quality: 65, stage: 'Light' },
    { day: '06am', quality: 80, stage: 'REM' },
    { day: '07am', quality: 75, stage: 'Light' },
    { day: '08am', quality: 70, stage: 'Light' }
  ];

  // Sleep stages distribution
  const sleepStagesData = [
    { name: 'Deep Sleep', value: 25, color: '#4C1D95', ideal: 20 },
    { name: 'REM Sleep', value: 20, color: '#7C3AED', ideal: 25 },
    { name: 'Light Sleep', value: 50, color: '#A78BFA', ideal: 50 },
    { name: 'Awake', value: 5, color: '#EDE9FE', ideal: 5 }
  ];

  // Heart rate during sleep
  const heartRateData = [
    { time: '10pm', hr: 72 },
    { time: '12am', hr: 58 },
    { time: '2am', hr: 52 },
    { time: '4am', hr: 48 },
    { time: '6am', hr: 55 },
    { time: '8am', hr: 68 }
  ];

  // Weekly sleep pattern
  const weeklySleepData = [
    { day: 'Mon', hours: 7.5, quality: 85 },
    { day: 'Tue', hours: 6.8, quality: 75 },
    { day: 'Wed', hours: 8.2, quality: 90 },
    { day: 'Thu', hours: 7.1, quality: 80 },
    { day: 'Fri', hours: 6.5, quality: 70 },
    { day: 'Sat', hours: 9.0, quality: 95 },
    { day: 'Sun', hours: 8.5, quality: 92 }
  ];

  // Sleep environment metrics
  const environmentMetrics = {
    temperature: 68,
    humidity: 45,
    noise: 35,
    light: 2
  };

  // Circadian rhythm data
  const circadianData = [
    { time: '6 AM', melatonin: 20, cortisol: 80, alertness: 30 },
    { time: '9 AM', melatonin: 10, cortisol: 100, alertness: 80 },
    { time: '12 PM', melatonin: 5, cortisol: 60, alertness: 90 },
    { time: '3 PM', melatonin: 5, cortisol: 40, alertness: 85 },
    { time: '6 PM', melatonin: 15, cortisol: 30, alertness: 70 },
    { time: '9 PM', melatonin: 60, cortisol: 20, alertness: 40 },
    { time: '12 AM', melatonin: 90, cortisol: 10, alertness: 10 }
  ];

  // Sleep debt calculation
  const sleepDebt = 3.5; // hours

  // Recovery score
  const recoveryScore = 82;

  // Custom badges for this plan
  const customBadges = [
    {
      text: '7h 14m Sleep',
      className: "flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full",
      icon: () => <Moon className="w-3 h-3 text-white mr-1.5" />
    }
  ];

  return (
    <PlanDashboardLayout
      planId={4}
      planName="Sleep Medicine"
      subtitle="Happiness is nothing more than good health and a good night's sleep 🌙"
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
          Sleep Medicine Dashboard
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
          {/* Sleep Quality Analysis */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
            {/* Sleep Quality Chart */}
            <div className="p-6 bg-white shadow-sm lg:col-span-2 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Sleep Quality</h3>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Sleep quality indicators:</p>
                  <div className="flex items-center mt-1 space-x-3 text-xs">
                    <span className="flex items-center">
                      <div className="w-3 h-3 mr-1 bg-red-500 rounded-full"></div>
                      0-25% (Low)
                    </span>
                    <span className="flex items-center">
                      <div className="w-3 h-3 mr-1 bg-yellow-500 rounded-full"></div>
                      25-50% (Below average)
                    </span>
                    <span className="flex items-center">
                      <div className="w-3 h-3 mr-1 bg-blue-500 rounded-full"></div>
                      50-75% (Average)
                    </span>
                    <span className="flex items-center">
                      <div className="w-3 h-3 mr-1 bg-green-500 rounded-full"></div>
                      75-100% (High)
                    </span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={sleepQualityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-3 bg-white border rounded-lg shadow-lg">
                            <p className="font-semibold">{data.day}</p>
                            <p className="text-sm">Quality: {data.quality}%</p>
                            <p className="text-sm">Stage: {data.stage}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="quality" radius={[8, 8, 0, 0]}>
                    {sleepQualityData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.quality >= 90 ? '#22C55E' :
                          entry.quality >= 75 ? '#3B82F6' :
                          entry.quality >= 50 ? '#F59E0B' :
                          '#EF4444'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="mt-2 text-sm text-gray-600">
                For 7 hours of sleep, you earned 571 points. Sleep quality: 82%
              </p>
              {realtimeMetrics.lastUpdated && (
                <p className="mt-1 text-xs text-gray-400">
                  Real-time update: {new Date(realtimeMetrics.lastUpdated).toLocaleTimeString()}
                </p>
              )}
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
                <p className="mb-1 text-3xl font-bold">95</p>
                <p className="text-sm">Burned during sleep</p>
              </div>
            </div>
          </div>

          {/* Sleep Metrics Row */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
            {/* Heart Rate Chart */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Heart rate chart</h3>
                <select className="px-2 py-1 text-sm border rounded">
                  <option>09 Feb-10 Feb</option>
                </select>
              </div>
              <div className="mb-2 text-center">
                <p className="text-3xl font-bold">
                  {realtimeMetrics.heartRate || 48}
                </p>
                <p className="text-sm text-gray-500">BPM</p>
              </div>
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={heartRateData}>
                  <Line 
                    type="monotone" 
                    dataKey="hr" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <XAxis dataKey="time" hide />
                  <YAxis hide />
                </LineChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-8 gap-1 mt-2 text-xs text-center text-gray-500">
                <span>10pm</span>
                <span>12am</span>
                <span>02am</span>
                <span>04am</span>
                <span className="font-bold text-red-600">4:15am</span>
                <span>06am</span>
                <span>08am</span>
                <span>10am</span>
              </div>
            </div>

            {/* Sleep Total */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="flex items-center mb-4 font-semibold text-gray-900">
                <Moon className="w-5 h-5 mr-2 text-indigo-600" />
                Sleep total
              </h3>
              <div className="text-center">
                <div className="flex items-center justify-center mb-4 space-x-2">
                  <BedDouble className="w-6 h-6 text-indigo-600" />
                  <p className="text-3xl font-bold">7h 14m</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <Moon className="w-4 h-4 mr-1 text-gray-400" />
                      Bedtime
                    </span>
                    <span className="font-medium">10:45 PM</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <Sun className="w-4 h-4 mr-1 text-gray-400" />
                      Wake up
                    </span>
                    <span className="font-medium">6:00 AM</span>
                  </div>
                </div>
                <div className="flex justify-center mt-4 space-x-1">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-purple-200 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Sleep Stages */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="mb-4 font-semibold text-gray-900">Sleep Stages</h3>
              <div className="relative">
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={sleepStagesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {sleepStagesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{recoveryScore}%</p>
                    <p className="text-xs text-gray-500">Recovery</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {sleepStagesData.map((stage, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="flex items-center">
                      <div 
                        className="w-3 h-3 mr-2 rounded-full" 
                        style={{ backgroundColor: stage.color }}
                      ></div>
                      {stage.name}
                    </span>
                    <span className="font-medium">{stage.value}%</span>
                  </div>
                ))}
              </div>
              {realtimeMetrics.currentSleepStage && (
                <p className="mt-2 text-xs text-center text-purple-600">
                  Current: {realtimeMetrics.currentSleepStage}
                </p>
              )}
            </div>
          </div>

          {/* Sleep Environment & Circadian Rhythm */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
            {/* Sleep Environment */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="mb-4 font-semibold text-gray-900">Sleep Environment Quality</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 text-center rounded-lg bg-blue-50">
                  <ThermometerSun className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold text-blue-600">{environmentMetrics.temperature}°F</p>
                  <p className="text-xs text-gray-600">Temperature</p>
                  <p className="mt-1 text-xs text-green-600">Optimal</p>
                </div>
                <div className="p-4 text-center rounded-lg bg-green-50">
                  <Droplets className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold text-green-600">{environmentMetrics.humidity}%</p>
                  <p className="text-xs text-gray-600">Humidity</p>
                  <p className="mt-1 text-xs text-green-600">Good</p>
                </div>
                <div className="p-4 text-center rounded-lg bg-purple-50">
                  <Volume2 className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                  <p className="text-2xl font-bold text-purple-600">{environmentMetrics.noise}dB</p>
                  <p className="text-xs text-gray-600">Noise Level</p>
                  <p className="mt-1 text-xs text-green-600">Quiet</p>
                </div>
                <div className="p-4 text-center rounded-lg bg-gray-50">
                  <Sun className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <p className="text-2xl font-bold text-gray-600">{environmentMetrics.light}lux</p>
                  <p className="text-xs text-gray-600">Light Level</p>
                  <p className="mt-1 text-xs text-green-600">Dark</p>
                </div>
              </div>
            </div>

            {/* Circadian Rhythm */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="mb-4 font-semibold text-gray-900">Circadian Rhythm Tracking</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={circadianData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="melatonin" stroke="#7C3AED" strokeWidth={2} name="Melatonin" />
                  <Line type="monotone" dataKey="cortisol" stroke="#F59E0B" strokeWidth={2} name="Cortisol" />
                  <Line type="monotone" dataKey="alertness" stroke="#3B82F6" strokeWidth={2} name="Alertness" />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-center mt-2 space-x-4 text-xs">
                <span className="flex items-center">
                  <div className="w-3 h-3 mr-1 bg-purple-600 rounded-full"></div>
                  Melatonin
                </span>
                <span className="flex items-center">
                  <div className="w-3 h-3 mr-1 bg-yellow-500 rounded-full"></div>
                  Cortisol
                </span>
                <span className="flex items-center">
                  <div className="w-3 h-3 mr-1 bg-blue-600 rounded-full"></div>
                  Alertness
                </span>
              </div>
            </div>
          </div>

          {/* Weekly Sleep Pattern */}
          <div className="p-6 mb-6 bg-white shadow-sm rounded-xl">
            <h3 className="mb-4 font-semibold text-gray-900">Weekly Sleep Pattern</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklySleepData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#7C3AED" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4 mt-4 text-center">
              <div className="p-3 rounded-lg bg-purple-50">
                <p className="text-sm text-gray-600">Average Sleep</p>
                <p className="text-xl font-bold text-purple-600">7.4 hrs</p>
              </div>
              <div className="p-3 rounded-lg bg-red-50">
                <p className="text-sm text-gray-600">Sleep Debt</p>
                <p className="text-xl font-bold text-red-600">{sleepDebt} hrs</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <p className="text-sm text-gray-600">Consistency</p>
                <p className="text-xl font-bold text-green-600">78%</p>
              </div>
            </div>
          </div>

          {/* Sleep Insights */}
          <div className="p-6 text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-2 text-xl font-bold">Good sleep quality detected! 🌙</h3>
                <p className="text-sm opacity-90">Your deep sleep percentage (25%) is above average. This contributes to physical recovery and memory consolidation.</p>
                <div className="flex items-center mt-3 space-x-4">
                  <div className="flex items-center space-x-2">
                    <CloudMoon className="w-5 h-5" />
                    <span className="text-sm">5 Night Streak</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Brain className="w-5 h-5" />
                    <span className="text-sm">82% Recovery</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center justify-center w-24 h-24 bg-white rounded-full bg-opacity-20">
                  <Moon className="w-12 h-12" />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Aman AI Coach Tab */
        <div className="space-y-6">
          {/* AI Coach Header */}
          <div className="p-8 text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-4 space-x-3">
                  <div className="p-3 bg-white rounded-full bg-opacity-20">
                    <Bot className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-bold">Aman AI Sleep Coach</h2>
                </div>
                <p className="text-lg opacity-90">Your personalized sleep medicine specialist</p>
              </div>
              <Sparkles className="w-16 h-16 opacity-20" />
            </div>
          </div>

          {/* Personalized Sleep Schedule */}
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h3 className="flex items-center mb-4 text-xl font-semibold">
              <Clock className="w-5 h-5 mr-2 text-purple-600" />
              Aman's Optimized Sleep Schedule
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="p-4 text-center border-2 border-purple-200 rounded-lg bg-purple-50">
                <Sunset className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <h4 className="mb-1 font-medium">Wind Down</h4>
                <p className="text-2xl font-bold text-purple-600">9:30 PM</p>
                <p className="mt-2 text-xs text-gray-600">Start bedtime routine</p>
              </div>
              <div className="p-4 text-center border-2 border-indigo-200 rounded-lg bg-indigo-50">
                <Moon className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                <h4 className="mb-1 font-medium">Sleep Time</h4>
                <p className="text-2xl font-bold text-indigo-600">10:30 PM</p>
                <p className="mt-2 text-xs text-gray-600">Optimal bedtime</p>
              </div>
              <div className="p-4 text-center border-2 border-blue-200 rounded-lg bg-blue-50">
                <Sunrise className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <h4 className="mb-1 font-medium">Wake Time</h4>
                <p className="text-2xl font-bold text-blue-600">6:30 AM</p>
                <p className="mt-2 text-xs text-gray-600">Natural wake</p>
              </div>
              <div className="p-4 text-center border-2 border-yellow-200 rounded-lg bg-yellow-50">
                <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                <h4 className="mb-1 font-medium">Light Exposure</h4>
                <p className="text-2xl font-bold text-yellow-600">7:00 AM</p>
                <p className="mt-2 text-xs text-gray-600">10 min sunlight</p>
              </div>
            </div>
          </div>

          {/* Sleep Optimization Recommendations */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Sleep Hygiene Protocol */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="flex items-center mb-4 text-lg font-semibold">
                <BedDouble className="w-5 h-5 mr-2 text-purple-600" />
                Aman's Sleep Hygiene Protocol
              </h3>
              <div className="space-y-4">
                <div className="p-4 border border-blue-200 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h4 className="mb-2 font-medium text-blue-900">Evening Light Management</h4>
                  <p className="text-sm text-gray-700">Dim lights by 50% at 8 PM. Use blue light filters on all devices.</p>
                  <div className="flex items-center mt-2 text-xs text-blue-600">
                    <Eye className="w-3 h-3 mr-1" />
                    Reduces melatonin suppression by 70%
                  </div>
                </div>

                <div className="p-4 border border-purple-200 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                  <h4 className="mb-2 font-medium text-purple-900">Temperature Optimization</h4>
                  <p className="text-sm text-gray-700">Set bedroom to 65-68°F. Use cooling mattress pad if needed.</p>
                  <div className="flex items-center mt-2 text-xs text-purple-600">
                    <ThermometerSun className="w-3 h-3 mr-1" />
                    Improves deep sleep by 23%
                  </div>
                </div>

                <div className="p-4 border border-green-200 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                  <h4 className="mb-2 font-medium text-green-900">Pre-Sleep Routine</h4>
                  <p className="text-sm text-gray-700">10-minute meditation + progressive muscle relaxation</p>
                  <div className="flex items-center mt-2 text-xs text-green-600">
                    <Brain className="w-3 h-3 mr-1" />
                    Reduces sleep onset by 15 minutes
                  </div>
                </div>
              </div>
            </div>

            {/* Sleep Disruptors Analysis */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="flex items-center mb-4 text-lg font-semibold">
                <AlertTriangle className="w-5 h-5 mr-2 text-purple-600" />
                Aman's Sleep Disruptor Analysis
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                  <div className="flex items-center space-x-3">
                    <Coffee className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Caffeine Cutoff</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">2 PM ✓</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium">Evening Exercise</span>
                  </div>
                  <span className="text-sm font-medium text-yellow-600">Move to 6 PM</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-red-50">
                  <div className="flex items-center space-x-3">
                    <Volume2 className="w-5 h-5 text-red-600" />
                    <span className="font-medium">Noise Levels</span>
                  </div>
                  <span className="text-sm font-medium text-red-600">Use white noise</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                  <div className="flex items-center space-x-3">
                    <Pill className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Sleep Supplements</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">Magnesium OK</span>
                </div>
              </div>
              <div className="p-3 mt-4 rounded-lg bg-purple-50">
                <p className="text-sm text-purple-800">
                  <strong>Aman notes:</strong> Your main sleep disruptor is late exercise. Moving it 2 hours earlier will improve sleep onset.
                </p>
              </div>
            </div>
          </div>

          {/* Circadian Rhythm Optimization */}
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h3 className="flex items-center mb-4 text-lg font-semibold">
              <Sun className="w-5 h-5 mr-2 text-purple-600" />
              Aman's Circadian Rhythm Reset Protocol
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold text-white bg-yellow-600 rounded-full">1</div>
                  <div>
                    <h4 className="mb-1 font-medium">Morning Light Therapy</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• 10,000 lux for 30 min</li>
                      <li>• Within 30 min of waking</li>
                      <li>• Suppresses melatonin</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold text-white bg-blue-600 rounded-full">2</div>
                  <div>
                    <h4 className="mb-1 font-medium">Daytime Protocol</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• No naps after 3 PM</li>
                      <li>• Bright light exposure</li>
                      <li>• Active movement</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold text-white bg-purple-600 rounded-full">3</div>
                  <div>
                    <h4 className="mb-1 font-medium">Evening Wind-Down</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Dim lights by 8 PM</li>
                      <li>• No screens after 9 PM</li>
                      <li>• Melatonin at 9:30 PM</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sleep Stage Optimization */}
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h3 className="flex items-center mb-4 text-lg font-semibold">
              <Waves className="w-5 h-5 mr-2 text-purple-600" />
              Aman's Sleep Stage Enhancement Plan
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-3 font-medium">Current vs Target Sleep Stages</h4>
                <div className="space-y-3">
                  {sleepStagesData.map((stage, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>{stage.name}</span>
                        <span>Current: {stage.value}% / Target: {stage.ideal}%</span>
                      </div>
                      <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                        <div 
                          className="h-full rounded-full"
                          style={{ 
                            width: `${stage.value}%`,
                            backgroundColor: stage.color
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-3 font-medium">Stage-Specific Recommendations</h4>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-purple-50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Increase REM Sleep</span>
                      <span className="text-xs text-purple-600">+5% needed</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">Avoid alcohol, maintain consistent schedule</p>
                  </div>
                  <div className="p-3 rounded-lg bg-indigo-50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Optimize Deep Sleep</span>
                      <span className="text-xs text-green-600">On target ✓</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">Continue current exercise routine</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Success Prediction */}
          <div className="p-6 text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
            <h3 className="flex items-center mb-4 text-xl font-semibold">
              <Target className="w-6 h-6 mr-2" />
              Aman's Sleep Optimization Predictions
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <div className="text-center">
                <p className="text-3xl font-bold">8.5 hrs</p>
                <p className="text-sm opacity-80">Target Sleep Duration</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">95%</p>
                <p className="text-sm opacity-80">Sleep Efficiency Goal</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">&lt; 5 min</p>
                <p className="text-sm opacity-80">Sleep Onset Time</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">30%</p>
                <p className="text-sm opacity-80">Deep Sleep Target</p>
              </div>
            </div>
            <div className="p-4 mt-6 bg-white rounded-lg bg-opacity-20">
              <p className="text-sm">
                <strong>Aman's Analysis:</strong> With your current sleep patterns and the optimization protocol, you'll achieve restorative sleep quality within 21 days. Your circadian rhythm shows excellent responsiveness to light therapy.
              </p>
            </div>
          </div>

          {/* Start AI Plan Button */}
          <div className="text-center">
            <button className="px-8 py-4 font-bold text-white transition-all duration-200 transform shadow-lg bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl hover:from-purple-700 hover:to-indigo-700 hover:scale-105">
              Activate Aman's Sleep Medicine Protocol
            </button>
          </div>
        </div>
      )}
    </PlanDashboardLayout>
  );
};

export default SleepMedicineDashboard;