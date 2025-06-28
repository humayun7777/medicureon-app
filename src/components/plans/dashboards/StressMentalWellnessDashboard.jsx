// src/components/plans/dashboards/StressManagementDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Activity,
  Brain,
  Heart,
  TrendingUp,
  TrendingDown,
  Target,
  AlertCircle,
  Timer,
  Zap,
  RefreshCw,
  Sparkles,
  Bot,
  AlertTriangle,
  Clock,
  Shield,
  Waves,
  Wind,
  ThermometerSun,
  Info,
  CheckCircle,
  Sun,
  Moon,
  Coffee,
  Headphones,
  Flower2,
  TreePine,
  Mountain,
  CloudRain,
  Smile,
  Frown,
  Meh,
  BarChart3,
  Droplets,
  Pause,
  Play,
  Volume2,
  Pill,
  Calendar,
  Award,
  Battery,
  BatteryLow,
  Gauge,
  HeartHandshake,
  Laptop,
  BrainCircuit,
  Stethoscope
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, RadialBarChart, RadialBar, Cell, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter } from 'recharts';
import PlanDashboardLayout from '../../common/PlanDashboardLayout';
import { fetchRealTimeData } from '../../../hooks/useMediCureOnData';

const StressManagementDashboard = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [breathingActive, setBreathingActive] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  
  // Real-time IoMT data states
  const [realtimeMetrics, setRealtimeMetrics] = useState({
    currentStressLevel: null,
    cortisol: null,
    hrv: null,
    skinConductance: null,
    lastUpdated: null
  });

  // Fetch real-time IoMT data for stress monitoring
  useEffect(() => {
    const fetchRealtimeData = async () => {
      try {
        // This would be your actual IoMT endpoint
        const response = await fetchRealTimeData('/api/iomt/stress/realtime', {
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
        console.error('Error fetching real-time stress data:', error);
      }
    };

    // Fetch immediately
    fetchRealtimeData();
    
    // Set up polling for real-time data every 30 seconds
    const interval = setInterval(fetchRealtimeData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Cortisol levels throughout the day
  const cortisolData = [
    { time: '6 AM', level: 18, normal: 20, status: 'Peak' },
    { time: '8 AM', level: 15, normal: 16, status: 'High' },
    { time: '10 AM', level: 12, normal: 12, status: 'Normal' },
    { time: '12 PM', level: 10, normal: 10, status: 'Normal' },
    { time: '2 PM', level: 8, normal: 8, status: 'Normal' },
    { time: '4 PM', level: 9, normal: 6, status: 'Elevated' },
    { time: '6 PM', level: 7, normal: 5, status: 'Elevated' },
    { time: '8 PM', level: 5, normal: 4, status: 'Normal' },
    { time: '10 PM', level: 3, normal: 3, status: 'Low' }
  ];

  // Heart Rate Variability (HRV) data
  const hrvData = [
    { day: 'Mon', hrv: 42, stress: 65 },
    { day: 'Tue', hrv: 38, stress: 72 },
    { day: 'Wed', hrv: 45, stress: 58 },
    { day: 'Thu', hrv: 40, stress: 68 },
    { day: 'Fri', hrv: 35, stress: 78 },
    { day: 'Sat', hrv: 48, stress: 52 },
    { day: 'Sun', hrv: 50, stress: 48 }
  ];

  // Stress triggers data
  const stressTriggers = [
    { trigger: 'Work Deadlines', frequency: 85, impact: 'High' },
    { trigger: 'Sleep Deprivation', frequency: 70, impact: 'High' },
    { trigger: 'Financial', frequency: 45, impact: 'Medium' },
    { trigger: 'Social Media', frequency: 60, impact: 'Medium' },
    { trigger: 'Commute', frequency: 40, impact: 'Low' },
    { trigger: 'Relationships', frequency: 30, impact: 'Low' }
  ];

  // Mood tracking data
  const moodData = [
    { time: '8 AM', mood: 3, energy: 4, stress: 2 },
    { time: '10 AM', mood: 4, energy: 5, stress: 3 },
    { time: '12 PM', mood: 4, energy: 4, stress: 4 },
    { time: '2 PM', mood: 3, energy: 3, stress: 5 },
    { time: '4 PM', mood: 2, energy: 2, stress: 6 },
    { time: '6 PM', mood: 3, energy: 3, stress: 4 },
    { time: '8 PM', mood: 4, energy: 4, stress: 3 },
    { time: '10 PM', mood: 5, energy: 3, stress: 2 }
  ];

  // Stress response metrics
  const stressMetrics = {
    current: realtimeMetrics.currentStressLevel || 54,
    average: 62,
    recovery: 78,
    resilience: 72
  };

  // Breathing exercises
  const breathingExercises = [
    { name: "4-7-8 Breathing", duration: "5 min", benefit: "Instant calm", type: "relaxation" },
    { name: "Box Breathing", duration: "4 min", benefit: "Focus boost", type: "performance" },
    { name: "Coherent Breathing", duration: "10 min", benefit: "HRV improvement", type: "balance" }
  ];

  // Weekly stress patterns
  const weeklyStressPattern = [
    { hour: '12 AM', Mon: 20, Tue: 25, Wed: 22, Thu: 28, Fri: 30, Sat: 15, Sun: 12 },
    { hour: '6 AM', Mon: 35, Tue: 40, Wed: 38, Thu: 42, Fri: 45, Sat: 25, Sun: 20 },
    { hour: '12 PM', Mon: 65, Tue: 70, Wed: 60, Thu: 68, Fri: 75, Sat: 40, Sun: 35 },
    { hour: '6 PM', Mon: 55, Tue: 60, Wed: 52, Thu: 58, Fri: 65, Sat: 35, Sun: 30 },
  ];

  // Autonomic nervous system balance
  const autonomicBalance = [
    { aspect: 'Sympathetic', score: 65, ideal: 50 },
    { aspect: 'Parasympathetic', score: 35, ideal: 50 },
    { aspect: 'Balance', score: 70, ideal: 100 },
    { aspect: 'Adaptability', score: 82, ideal: 100 },
    { aspect: 'Recovery', score: 75, ideal: 100 }
  ];

  // Custom badges for this plan
  const customBadges = [
    {
      text: `Stress Level: ${stressMetrics.current}%`,
      className: "flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full",
      icon: () => <Brain className="w-3 h-3 text-white mr-1.5" />
    }
  ];

  return (
    <PlanDashboardLayout
      planId={5}
      planName="Stress & Mental Wellness"
      subtitle="Master your stress for optimal mental health 🧘‍♀️"
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
          Stress Management Dashboard
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
          {/* Main Metrics Grid */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-4">
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
              <p className="mb-1 text-3xl font-bold">1,200</p>
              <p className="text-sm">Today</p>
            </div>

            {/* HRV Card */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-green-50">
                    <Heart className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="font-semibold text-gray-900">HRV</span>
                </div>
              </div>
              <p className="mb-1 text-3xl font-bold text-green-600">
                {realtimeMetrics.hrv || 45}ms
              </p>
              <p className="text-sm text-gray-600">Good recovery</p>
              {realtimeMetrics.lastUpdated && (
                <p className="mt-1 text-xs text-gray-400">
                  Live update
                </p>
              )}
            </div>

            {/* Stress Score Card */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-orange-50">
                    <Gauge className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="font-semibold text-gray-900">Stress Score</span>
                </div>
              </div>
              <p className="mb-1 text-3xl font-bold text-orange-600">
                {stressMetrics.current}%
              </p>
              <p className="text-sm text-gray-600">Moderate</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
            {/* Cortisol Levels Chart */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Cortisol Rhythm</h3>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="flex items-center">
                    <div className="w-3 h-3 mr-1 bg-blue-500 rounded-full"></div>
                    Your Level
                  </span>
                  <span className="flex items-center">
                    <div className="w-3 h-3 mr-1 bg-gray-300 rounded-full"></div>
                    Normal Range
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={cortisolData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-3 bg-white border rounded-lg shadow-lg">
                            <p className="font-semibold">{data.time}</p>
                            <p className="text-sm">Your Level: {data.level} μg/dL</p>
                            <p className="text-sm">Normal: {data.normal} μg/dL</p>
                            <p className="text-xs text-gray-500">Status: {data.status}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="normal" stroke="#E5E7EB" fill="#F3F4F6" strokeWidth={2} />
                  <Area type="monotone" dataKey="level" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
              <p className="mt-2 text-xs text-gray-500">
                Elevated afternoon cortisol detected - consider stress reduction techniques
              </p>
            </div>

            {/* Heart Rate Variability Chart */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">HRV & Stress Correlation</h3>
                <select className="px-3 py-1 text-sm border rounded-lg">
                  <option>This Week</option>
                  <option>Last Month</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={hrvData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="hrv" stroke="#10B981" strokeWidth={3} name="HRV (ms)" />
                  <Line yAxisId="right" type="monotone" dataKey="stress" stroke="#EF4444" strokeWidth={3} name="Stress (%)" />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-center mt-2 space-x-4 text-xs">
                <span className="flex items-center">
                  <div className="w-3 h-3 mr-1 bg-green-500 rounded-full"></div>
                  HRV (Higher is better)
                </span>
                <span className="flex items-center">
                  <div className="w-3 h-3 mr-1 bg-red-500 rounded-full"></div>
                  Stress Level
                </span>
              </div>
            </div>
          </div>

          {/* Stress Management Tools */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
            {/* Breathing Exercise */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="flex items-center mb-4 font-semibold text-gray-900">
                <Wind className="w-5 h-5 mr-2 text-blue-600" />
                Quick Breathing Exercise
              </h3>
              <div className="space-y-3">
                {breathingExercises.map((exercise, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedExercise(exercise)}
                    className="w-full p-3 text-left transition-all border rounded-lg hover:bg-blue-50 hover:border-blue-300"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{exercise.name}</p>
                        <p className="text-xs text-gray-500">{exercise.duration} • {exercise.benefit}</p>
                      </div>
                      <Play className="w-4 h-4 text-blue-600" />
                    </div>
                  </button>
                ))}
              </div>
              {selectedExercise && (
                <div className="p-3 mt-4 text-center rounded-lg bg-blue-50">
                  <p className="text-sm font-medium text-blue-800">
                    Now playing: {selectedExercise.name}
                  </p>
                </div>
              )}
            </div>

            {/* Mood Tracker */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="flex items-center mb-4 font-semibold text-gray-900">
                <Smile className="w-5 h-5 mr-2 text-purple-600" />
                Today's Mood Pattern
              </h3>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 7]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="mood" stroke="#8B5CF6" strokeWidth={2} name="Mood" />
                  <Line type="monotone" dataKey="energy" stroke="#F59E0B" strokeWidth={2} name="Energy" />
                  <Line type="monotone" dataKey="stress" stroke="#EF4444" strokeWidth={2} name="Stress" />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-center mt-2 space-x-3 text-xs">
                <span className="flex items-center">
                  <div className="w-3 h-3 mr-1 bg-purple-600 rounded-full"></div>
                  Mood
                </span>
                <span className="flex items-center">
                  <div className="w-3 h-3 mr-1 bg-yellow-500 rounded-full"></div>
                  Energy
                </span>
                <span className="flex items-center">
                  <div className="w-3 h-3 mr-1 bg-red-500 rounded-full"></div>
                  Stress
                </span>
              </div>
            </div>

            {/* Stress Triggers */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="flex items-center mb-4 font-semibold text-gray-900">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                Top Stress Triggers
              </h3>
              <div className="space-y-2">
                {stressTriggers.slice(0, 4).map((trigger, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{trigger.trigger}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 overflow-hidden bg-gray-200 rounded-full">
                        <div 
                          className="h-full rounded-full"
                          style={{ 
                            width: `${trigger.frequency}%`,
                            backgroundColor: trigger.impact === 'High' ? '#EF4444' : trigger.impact === 'Medium' ? '#F59E0B' : '#10B981'
                          }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium" style={{ minWidth: '35px' }}>{trigger.frequency}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full px-4 py-2 mt-4 text-sm font-medium text-blue-600 transition-colors rounded-lg bg-blue-50 hover:bg-blue-100">
                View Full Analysis
              </button>
            </div>
          </div>

          {/* Advanced Metrics Row */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
            {/* Autonomic Balance */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="mb-4 font-semibold text-gray-900">Autonomic Nervous System Balance</h3>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={autonomicBalance}>
                  <PolarGrid stroke="#e0e0e0" />
                  <PolarAngleAxis dataKey="aspect" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Current" dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                  <Radar name="Ideal" dataKey="ideal" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                <div className="p-2 text-center rounded bg-blue-50">
                  <p className="font-medium text-blue-600">Sympathetic</p>
                  <p>65% (High)</p>
                </div>
                <div className="p-2 text-center rounded bg-green-50">
                  <p className="font-medium text-green-600">Parasympathetic</p>
                  <p>35% (Low)</p>
                </div>
              </div>
            </div>

            {/* Weekly Stress Heatmap */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="mb-4 font-semibold text-gray-900">Weekly Stress Patterns</h3>
              <div className="relative">
                <div className="grid grid-cols-8 gap-1 text-xs">
                  <div></div>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="font-medium text-center">{day}</div>
                  ))}
                  
                  {['12 AM', '6 AM', '12 PM', '6 PM'].map((time, timeIndex) => (
                    <React.Fragment key={time}>
                      <div className="pr-2 font-medium text-right">{time}</div>
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, dayIndex) => {
                        const value = weeklyStressPattern[timeIndex][day];
                        const intensity = value / 100;
                        return (
                          <div
                            key={`${time}-${day}`}
                            className="rounded aspect-square"
                            style={{
                              backgroundColor: `rgba(239, 68, 68, ${intensity})`,
                            }}
                            title={`${day} ${time}: ${value}% stress`}
                          />
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
                <div className="flex items-center justify-center mt-4 space-x-4 text-xs">
                  <span className="flex items-center">
                    <div className="w-4 h-4 mr-1 bg-red-200 rounded"></div>
                    Low Stress
                  </span>
                  <span className="flex items-center">
                    <div className="w-4 h-4 mr-1 bg-red-400 rounded"></div>
                    Moderate
                  </span>
                  <span className="flex items-center">
                    <div className="w-4 h-4 mr-1 bg-red-600 rounded"></div>
                    High Stress
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stress Management Recommendations */}
          <div className="p-6 mb-6 bg-white shadow-sm rounded-xl">
            <h3 className="mb-4 font-semibold text-gray-900">Personalized Stress Management Activities</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="p-4 text-center transition-all border-2 border-green-200 rounded-lg cursor-pointer bg-green-50 hover:border-green-400">
                <TreePine className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <h4 className="mb-1 text-sm font-medium">Nature Walk</h4>
                <p className="text-xs text-gray-600">20 min • -15% stress</p>
                <div className="mt-2">
                  <div className="w-full h-1 overflow-hidden bg-gray-200 rounded-full">
                    <div className="w-3/4 h-full bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 text-center transition-all border-2 border-blue-200 rounded-lg cursor-pointer bg-blue-50 hover:border-blue-400">
                <Headphones className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <h4 className="mb-1 text-sm font-medium">Meditation</h4>
                <p className="text-xs text-gray-600">15 min • -20% stress</p>
                <div className="mt-2">
                  <div className="w-full h-1 overflow-hidden bg-gray-200 rounded-full">
                    <div className="w-1/2 h-full bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 text-center transition-all border-2 border-purple-200 rounded-lg cursor-pointer bg-purple-50 hover:border-purple-400">
                <Flower2 className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <h4 className="mb-1 text-sm font-medium">Yoga Session</h4>
                <p className="text-xs text-gray-600">30 min • -25% stress</p>
                <div className="mt-2">
                  <div className="w-full h-1 overflow-hidden bg-gray-200 rounded-full">
                    <div className="w-1/4 h-full bg-purple-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 text-center transition-all border-2 border-yellow-200 rounded-lg cursor-pointer bg-yellow-50 hover:border-yellow-400">
                <Coffee className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                <h4 className="mb-1 text-sm font-medium">Tea Break</h4>
                <p className="text-xs text-gray-600">10 min • -10% stress</p>
                <div className="mt-2">
                  <div className="w-full h-1 overflow-hidden bg-gray-200 rounded-full">
                    <div className="w-full h-full bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Insights Banner */}
          <div className="p-6 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-2 text-xl font-bold">Your stress is manageable! 🧘‍♀️</h3>
                <p className="text-sm opacity-90">Your HRV shows good adaptability. Focus on afternoon stress management between 2-6 PM when cortisol spikes occur.</p>
                <div className="flex items-center mt-3 space-x-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span className="text-sm">78% Resilience Score</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="w-5 h-5" />
                    <span className="text-sm">Stress Decreasing</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center justify-center w-24 h-24 bg-white rounded-full bg-opacity-20">
                  <Brain className="w-12 h-12" />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Aman AI Coach Tab */
        <div className="space-y-6">
          {/* AI Coach Header */}
          <div className="p-8 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-4 space-x-3">
                  <div className="p-3 bg-white rounded-full bg-opacity-20">
                    <Bot className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-bold">Aman AI Stress Coach</h2>
                </div>
                <p className="text-lg opacity-90">Your personalized stress management & resilience expert</p>
              </div>
              <Sparkles className="w-16 h-16 opacity-20" />
            </div>
          </div>

          {/* Personalized Stress Profile */}
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h3 className="flex items-center mb-4 text-xl font-semibold">
              <BrainCircuit className="w-5 h-5 mr-2 text-purple-600" />
              Aman's Stress Pattern Analysis
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="p-4 text-center border-2 border-blue-200 rounded-lg bg-blue-50">
                <Laptop className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <h4 className="mb-1 font-medium">Primary Stressor</h4>
                <p className="text-2xl font-bold text-blue-600">Work Pressure</p>
                <p className="mt-2 text-xs text-gray-600">Peak: 2-5 PM weekdays</p>
                <div className="px-3 py-1 mt-2 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                  85% impact on cortisol
                </div>
              </div>

              <div className="p-4 text-center border-2 border-green-200 rounded-lg bg-green-50">
                <Battery className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <h4 className="mb-1 font-medium">Recovery Capacity</h4>
                <p className="text-2xl font-bold text-green-600">78%</p>
                <p className="mt-2 text-xs text-gray-600">Above average</p>
                <div className="px-3 py-1 mt-2 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                  Quick stress recovery
                </div>
              </div>

              <div className="p-4 text-center border-2 border-purple-200 rounded-lg bg-purple-50">
                <HeartHandshake className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <h4 className="mb-1 font-medium">Stress Type</h4>
                <p className="text-2xl font-bold text-purple-600">Acute</p>
                <p className="mt-2 text-xs text-gray-600">Short-term, manageable</p>
                <div className="px-3 py-1 mt-2 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">
                  Responds well to interventions
                </div>
              </div>
            </div>
          </div>

          {/* 4-Week Stress Reduction Protocol */}
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h3 className="flex items-center mb-4 text-lg font-semibold">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              Aman's 4-Week Stress Resilience Protocol
            </h3>
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-blue-500 rounded-lg bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold text-white bg-blue-600 rounded-full">1</div>
                  <div className="flex-1">
                    <h4 className="font-medium">Week 1: Baseline & Awareness</h4>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li>• Track stress triggers 3x daily</li>
                      <li>• Practice 5-minute breathing exercises</li>
                      <li>• Establish consistent sleep schedule</li>
                    </ul>
                    <div className="flex items-center mt-2 text-xs text-blue-600">
                      <Target className="w-3 h-3 mr-1" />
                      Goal: Reduce cortisol spikes by 15%
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-l-4 border-green-500 rounded-lg bg-gradient-to-r from-green-50 to-white">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold text-white bg-green-600 rounded-full">2</div>
                  <div className="flex-1">
                    <h4 className="font-medium">Week 2: Active Intervention</h4>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li>• Implement 2 PM micro-breaks</li>
                      <li>• Start progressive muscle relaxation</li>
                      <li>• Add 20-min nature exposure daily</li>
                    </ul>
                    <div className="flex items-center mt-2 text-xs text-green-600">
                      <Target className="w-3 h-3 mr-1" />
                      Goal: Increase HRV by 10ms
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-l-4 border-purple-500 rounded-lg bg-gradient-to-r from-purple-50 to-white">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold text-white bg-purple-600 rounded-full">3</div>
                  <div className="flex-1">
                    <h4 className="font-medium">Week 3: Cognitive Restructuring</h4>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li>• Daily stress reframing exercises</li>
                      <li>• Implement boundary setting at work</li>
                      <li>• Practice mindful transitions</li>
                    </ul>
                    <div className="flex items-center mt-2 text-xs text-purple-600">
                      <Target className="w-3 h-3 mr-1" />
                      Goal: Reduce perceived stress by 30%
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-l-4 border-yellow-500 rounded-lg bg-gradient-to-r from-yellow-50 to-white">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold text-white bg-yellow-600 rounded-full">4</div>
                  <div className="flex-1">
                    <h4 className="font-medium">Week 4: Integration & Optimization</h4>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li>• Personalized stress management routine</li>
                      <li>• Advanced HRV biofeedback training</li>
                      <li>• Long-term resilience planning</li>
                    </ul>
                    <div className="flex items-center mt-2 text-xs text-yellow-600">
                      <Target className="w-3 h-3 mr-1" />
                      Goal: Achieve 85% stress resilience score
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personalized Interventions Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Work Stress Management */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="flex items-center mb-4 text-lg font-semibold">
                <Laptop className="w-5 h-5 mr-2 text-blue-600" />
                Aman's Work Stress Solutions
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-blue-50">
                  <h4 className="mb-1 text-sm font-medium text-blue-900">2 PM Cortisol Spike Prevention</h4>
                  <p className="text-xs text-gray-700">Take a 5-minute walk or do desk stretches. Your data shows 25% stress reduction with movement.</p>
                </div>
                
                <div className="p-3 rounded-lg bg-green-50">
                  <h4 className="mb-1 text-sm font-medium text-green-900">Email Batch Processing</h4>
                  <p className="text-xs text-gray-700">Check emails only at 9 AM, 1 PM, and 5 PM. Reduces interruption stress by 40%.</p>
                </div>
                
                <div className="p-3 rounded-lg bg-purple-50">
                  <h4 className="mb-1 text-sm font-medium text-purple-900">Pomodoro Technique</h4>
                  <p className="text-xs text-gray-700">25 min focused work + 5 min break. Your optimal cycle based on HRV data.</p>
                </div>

                <div className="p-3 mt-3 border border-yellow-300 rounded-lg bg-yellow-50">
                  <p className="text-sm font-medium text-yellow-800">
                    <strong>Aman's Insight:</strong> Your stress peaks align with meeting-heavy afternoons. Consider scheduling complex tasks in the morning when cortisol naturally supports focus.
                  </p>
                </div>
              </div>
            </div>

            {/* Biometric-Based Recommendations */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="flex items-center mb-4 text-lg font-semibold">
                <Stethoscope className="w-5 h-5 mr-2 text-green-600" />
                Aman's Biometric Optimization
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">HRV Target</span>
                    <span className="text-sm text-green-600">55ms (from 45ms)</span>
                  </div>
                  <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full">
                    <div className="h-full transition-all bg-green-500 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">Daily coherent breathing will achieve this in 14 days</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Cortisol Optimization</span>
                    <span className="text-sm text-blue-600">-20% afternoon spike</span>
                  </div>
                  <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full">
                    <div className="h-full transition-all bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">Adaptogenic herbs + timed exercise</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Autonomic Balance</span>
                    <span className="text-sm text-purple-600">50/50 target</span>
                  </div>
                  <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full">
                    <div className="h-full transition-all bg-purple-500 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">Evening yoga + morning cold exposure</p>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Stress Resilience Techniques */}
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h3 className="flex items-center mb-4 text-lg font-semibold">
              <Shield className="w-5 h-5 mr-2 text-purple-600" />
              Aman's Advanced Resilience Techniques
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="p-4 border border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                <Wind className="w-6 h-6 mb-2 text-blue-600" />
                <h4 className="mb-2 font-medium">HRV Biofeedback Training</h4>
                <p className="mb-3 text-sm text-gray-700">Real-time breathing guidance synced with your heart rate patterns</p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                    <span>Increases HRV by 15-20ms</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                    <span>Reduces stress response 40%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-purple-200 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50">
                <Brain className="w-6 h-6 mb-2 text-purple-600" />
                <h4 className="mb-2 font-medium">Cognitive Behavioral Protocol</h4>
                <p className="mb-3 text-sm text-gray-700">AI-guided thought pattern analysis and restructuring</p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                    <span>Identifies stress thought loops</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                    <span>85% reduction in rumination</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-green-200 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50">
                <Mountain className="w-6 h-6 mb-2 text-green-600" />
                <h4 className="mb-2 font-medium">Hormetic Stress Training</h4>
                <p className="mb-3 text-sm text-gray-700">Controlled stress exposure to build resilience</p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                    <span>Cold therapy protocols</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                    <span>Improves stress tolerance 60%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personalized Action Plan */}
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h3 className="flex items-center mb-4 text-lg font-semibold">
              <Target className="w-5 h-5 mr-2 text-orange-600" />
              Aman's Daily Stress Management Schedule
            </h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 border border-blue-200 rounded-lg bg-blue-50">
                <Sun className="w-5 h-5 mr-3 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-blue-900">6:30 AM - Morning Reset</p>
                  <p className="text-sm text-gray-700">5 min HRV breathing + 2 min cold shower + gratitude practice</p>
                </div>
                <span className="text-xs font-medium text-blue-600">-20% morning cortisol</span>
              </div>

              <div className="flex items-center p-3 border border-green-200 rounded-lg bg-green-50">
                <Coffee className="w-5 h-5 mr-3 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium text-green-900">10:30 AM - Mid-Morning Break</p>
                  <p className="text-sm text-gray-700">Walk outside + mindful snack + 3 min breathing</p>
                </div>
                <span className="text-xs font-medium text-green-600">+15% focus</span>
              </div>

              <div className="flex items-center p-3 border border-purple-200 rounded-lg bg-purple-50">
                <Pause className="w-5 h-5 mr-3 text-purple-600" />
                <div className="flex-1">
                  <p className="font-medium text-purple-900">2:00 PM - Stress Peak Intervention</p>
                  <p className="text-sm text-gray-700">Progressive muscle relaxation + desk yoga + hydration</p>
                </div>
                <span className="text-xs font-medium text-purple-600">-30% cortisol spike</span>
              </div>

              <div className="flex items-center p-3 border border-indigo-200 rounded-lg bg-indigo-50">
                <Moon className="w-5 h-5 mr-3 text-indigo-600" />
                <div className="flex-1">
                  <p className="font-medium text-indigo-900">9:00 PM - Evening Wind-down</p>
                  <p className="text-sm text-gray-700">Digital sunset + meditation + magnesium supplement</p>
                </div>
                <span className="text-xs font-medium text-indigo-600">+25% sleep quality</span>
              </div>
            </div>
          </div>

          {/* Success Prediction */}
          <div className="p-6 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
            <h3 className="flex items-center mb-4 text-xl font-semibold">
              <Award className="w-6 h-6 mr-2" />
              Aman's Stress Mastery Predictions
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <div className="text-center">
                <p className="text-3xl font-bold">35%</p>
                <p className="text-sm opacity-80">Target Stress Level</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">21 days</p>
                <p className="text-sm opacity-80">To new baseline</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">55ms</p>
                <p className="text-sm opacity-80">HRV Target</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">92%</p>
                <p className="text-sm opacity-80">Success probability</p>
              </div>
            </div>
            <div className="p-4 mt-6 bg-white rounded-lg bg-opacity-20">
              <p className="text-sm">
                <strong>Aman's Analysis:</strong> Your stress response system is highly trainable. With consistent application of these protocols, you'll develop exceptional stress resilience. Your HRV patterns indicate rapid adaptation to interventions, especially breathing techniques and nature exposure.
              </p>
            </div>
          </div>

          {/* Start AI Plan Button */}
          <div className="text-center">
            <button className="px-8 py-4 font-bold text-white transition-all duration-200 transform shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 hover:scale-105">
              Activate Aman's Stress Resilience Protocol
            </button>
          </div>
        </div>
      )}
    </PlanDashboardLayout>
  );
};

export default StressManagementDashboard;