import React, { useState, useEffect } from 'react';
import { 
  Activity,
  Heart,
  Brain,
  Target,
  Calendar,
  AlertCircle,
  AlertTriangle,
  Timer,
  Zap,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Bot,
  Clock,
  Shield,
  Waves,
  Info,
  CheckCircle,
  Stethoscope,
  BarChart3,
  Gauge,
  ThermometerSun,
  Droplets,
  Wind,
  Moon,
  Sun,
  BatteryCharging,
  Wifi,
  Monitor,
  Cpu,
  Eye,
  Fingerprint,
  Award,
  ChevronRight,
  ChevronLeft,
  PieChart,
  TrendingNeutral,
  Beaker,
  CircuitBoard,
  Database,
  Microscope,
  Pill,
  HeartHandshake,
  Minus
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart, ReferenceLine } from 'recharts';
import PlanDashboardLayout from '../../common/PlanDashboardLayout';
import { fetchRealTimeData } from '../../../hooks/useMediCureOnData';

const PreventiveIntelligenceDashboard = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeGadget, setActiveGadget] = useState('vital-signs');

  // Enhanced physiological age state - can be older or younger
  const [physiologicalAge, setPhysiologicalAge] = useState(45); // Example: older than chronological
  const [chronologicalAge] = useState(38);
  
  // Calculate age difference
  const ageDifference = physiologicalAge - chronologicalAge;
  const isYounger = ageDifference < 0;
  
  // Real-time IoMT data states
  const [realtimeMetrics, setRealtimeMetrics] = useState({
    heartRate: null,
    bloodPressure: null,
    spO2: null,
    temperature: null,
    lastUpdated: null
  });

  // Fetch real-time IoMT data
  useEffect(() => {
    const fetchRealtimeData = async () => {
      try {
        const response = await fetchRealTimeData('/api/iomt/preventive/realtime', {
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

  // Real-time vital signs data
  const vitalSignsData = {
    heartRate: { current: realtimeMetrics.heartRate || 72, average: 68, hrv: 42 },
    bloodPressure: { 
      systolic: realtimeMetrics.bloodPressure?.systolic || 118, 
      diastolic: realtimeMetrics.bloodPressure?.diastolic || 78, 
      trend: 'stable' 
    },
    spO2: { current: realtimeMetrics.spO2 || 98, average: 97 },
    temperature: { current: realtimeMetrics.temperature || 98.2, variation: 0.3 },
    respiratoryRate: { current: 14, average: 15 },
    hydration: { level: 85, electrolytes: 'balanced' },
    stress: { level: 25, trend: 'decreasing' }
  };

  // ECG waveform data
  const ecgData = Array.from({ length: 150 }, (_, i) => {
    const value = i % 30 === 15 ? 1.5 : 
                  i % 30 === 16 ? -0.5 : 
                  i % 30 === 17 ? 0.3 : 
                  0 + (Math.random() - 0.5) * 0.1;
    return { x: i, y: value };
  });

  // 24-hour vitals trend
  const vitalsTrend = [
    { time: '00:00', hr: 58, bp: 110, spo2: 98, temp: 97.8 },
    { time: '04:00', hr: 52, bp: 105, spo2: 97, temp: 97.5 },
    { time: '08:00', hr: 72, bp: 118, spo2: 98, temp: 98.2 },
    { time: '12:00', hr: 85, bp: 125, spo2: 99, temp: 98.6 },
    { time: '16:00', hr: 78, bp: 120, spo2: 98, temp: 98.4 },
    { time: '20:00', hr: 68, bp: 115, spo2: 98, temp: 98.1 },
    { time: '23:59', hr: 60, bp: 112, spo2: 97, temp: 97.9 }
  ];

  // Sleep insights data
  const sleepData = {
    duration: 7.5,
    score: 85,
    stages: [
      { stage: 'Deep', hours: 1.8, percentage: 24 },
      { stage: 'REM', hours: 1.5, percentage: 20 },
      { stage: 'Light', hours: 3.7, percentage: 49 },
      { stage: 'Awake', hours: 0.5, percentage: 7 }
    ],
    hrv: { average: 45, trend: 'improving' },
    recovery: 82
  };

  // Enhanced physiological age factors to show negative impacts
  const physioAgeFactors = [
    { factor: 'Cardiovascular', score: 92, impact: -3 },
    { factor: 'Metabolic', score: 65, impact: +2 }, // Poor score adds years
    { factor: 'Sleep Quality', score: 45, impact: +3 }, // Poor sleep adds years
    { factor: 'Physical Activity', score: 78, impact: -1 },
    { factor: 'Stress Levels', score: 35, impact: +2.5 }, // High stress adds years
    { factor: 'Nutrition', score: 55, impact: +1.5 } // Poor nutrition adds years
  ];

  // Health score breakdown
  const healthScoreData = [
    { metric: 'Heart Health', value: 88, fullMark: 100 },
    { metric: 'Sleep Quality', value: 85, fullMark: 100 },
    { metric: 'Stress Management', value: 75, fullMark: 100 },
    { metric: 'Physical Fitness', value: 82, fullMark: 100 },
    { metric: 'Metabolic Health', value: 90, fullMark: 100 },
    { metric: 'Immune Function', value: 86, fullMark: 100 }
  ];

  // AI Coach insights
  const aiInsights = [
    { 
      type: 'alert', 
      priority: 'high',
      message: 'Your HRV is trending upward - great recovery!',
      recommendation: 'Consider a high-intensity workout today'
    },
    {
      type: 'insight',
      priority: 'medium',
      message: 'Sleep quality improved by 12% this week',
      recommendation: 'Maintain your current bedtime routine'
    },
    {
      type: 'goal',
      priority: 'low',
      message: 'You\'re 80% to your weekly activity goal',
      recommendation: 'A 20-minute walk will complete it'
    }
  ];

  // Custom badges for this plan
  const customBadges = [
    {
      text: 'Health Score: 86%',
      className: "flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full",
      icon: () => <Cpu className="w-3 h-3 text-white mr-1.5" />
    }
  ];

  return (
    <PlanDashboardLayout
      planId={4}
      planName="Preventive Intelligence Monitoring"
      subtitle="Your Health Intelligence Hub 🧬"
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
          Health Intelligence Hub
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
          {/* Gadget Navigation */}
          <div className="flex mb-6 space-x-2 overflow-x-auto">
            <button
              onClick={() => setActiveGadget('vital-signs')}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeGadget === 'vital-signs' 
                  ? 'bg-[#02276F] text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Monitor className="w-4 h-4" />
                <span>Vital Sign Monitoring</span>
              </div>
            </button>
            <button
              onClick={() => setActiveGadget('ai-health-coach')}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeGadget === 'ai-health-coach' 
                  ? 'bg-[#02276F] text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span>AI Health Coach</span>
              </div>
            </button>
            <button
              onClick={() => setActiveGadget('cardio-sleep')}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeGadget === 'cardio-sleep' 
                  ? 'bg-[#02276F] text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span>Cardio & Sleep</span>
              </div>
            </button>
            <button
              onClick={() => setActiveGadget('physiological-age')}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeGadget === 'physiological-age' 
                  ? 'bg-[#02276F] text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Fingerprint className="w-4 h-4" />
                <span>Physiological Age</span>
              </div>
            </button>
          </div>

          {/* Gadget Content */}
          {activeGadget === 'vital-signs' && (
            <>
              {/* Real-time Vital Signs Dashboard */}
              <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
                {/* ECG Monitor */}
                <div className="p-6 bg-white shadow-sm lg:col-span-2 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Live ECG Monitor</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600">Normal Sinus Rhythm</span>
                    </div>
                  </div>
                  <div className="relative h-48 p-4 overflow-hidden bg-gray-900 rounded-lg">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={ecgData}>
                        <Line 
                          type="monotone" 
                          dataKey="y" 
                          stroke="#00FF00" 
                          strokeWidth={2}
                          dot={false}
                          animationDuration={0}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="absolute text-xs text-green-400 top-2 left-2">
                      Lead II
                    </div>
                    <div className="absolute grid grid-cols-3 gap-4 text-green-400 bottom-2 left-2">
                      <div>
                        <p className="text-xs opacity-60">HR</p>
                        <p className="text-lg font-bold">{vitalSignsData.heartRate.current}</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-60">PR</p>
                        <p className="text-lg font-bold">156ms</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-60">QRS</p>
                        <p className="text-lg font-bold">92ms</p>
                      </div>
                    </div>
                  </div>
                  {realtimeMetrics.lastUpdated && (
                    <p className="mt-2 text-xs text-right text-gray-400">
                      Updated {new Date(realtimeMetrics.lastUpdated).toLocaleTimeString()}
                    </p>
                  )}
                </div>

                {/* Vital Signs Grid */}
                <div className="space-y-4">
                  {/* Blood Pressure */}
                  <div className="p-4 bg-white shadow-sm rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Droplets className="w-5 h-5 text-red-500" />
                        <span className="text-sm font-medium">Blood Pressure</span>
                      </div>
                      <Minus className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-bold text-red-600">{vitalSignsData.bloodPressure.systolic}</span>
                      <span className="text-lg text-gray-600">/{vitalSignsData.bloodPressure.diastolic}</span>
                      <span className="text-sm text-gray-500">mmHg</span>
                    </div>
                    <div className="w-full h-1 mt-2 overflow-hidden bg-gray-200 rounded-full">
                      <div className="h-full bg-green-500" style={{ width: '75%' }}></div>
                    </div>
                  </div>

                  {/* SpO2 */}
                  <div className="p-4 bg-white shadow-sm rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Wind className="w-5 h-5 text-blue-500" />
                        <span className="text-sm font-medium">Oxygen Saturation</span>
                      </div>
                    </div>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-bold text-blue-600">{vitalSignsData.spO2.current}</span>
                      <span className="text-sm text-gray-500">%SpO₂</span>
                    </div>
                    <div className="mt-2 text-xs text-green-600">Optimal Range</div>
                  </div>

                  {/* Temperature */}
                  <div className="p-4 bg-white shadow-sm rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <ThermometerSun className="w-5 h-5 text-orange-500" />
                        <span className="text-sm font-medium">Body Temperature</span>
                      </div>
                    </div>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-bold text-orange-600">{vitalSignsData.temperature.current}</span>
                      <span className="text-sm text-gray-500">°F</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">±{vitalSignsData.temperature.variation}° daily variation</div>
                  </div>
                </div>
              </div>

              {/* 24-Hour Vital Trends */}
              <div className="p-6 mb-6 bg-white shadow-sm rounded-xl">
                <h3 className="mb-4 font-semibold text-gray-900">24-Hour Vital Sign Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={vitalsTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="left" domain={[40, 140]} label={{ value: 'HR/BP', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" domain={[95, 100]} label={{ value: 'SpO2 %', angle: 90, position: 'insideRight' }} />
                    <Tooltip />
                    <Area yAxisId="left" type="monotone" dataKey="hr" stroke="#EF4444" fill="#FEE2E2" strokeWidth={2} name="Heart Rate" />
                    <Line yAxisId="left" type="monotone" dataKey="bp" stroke="#3B82F6" strokeWidth={2} name="Blood Pressure" />
                    <Line yAxisId="right" type="monotone" dataKey="spo2" stroke="#10B981" strokeWidth={2} name="SpO2" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Additional Vital Metrics */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* HRV & Stress */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h3 className="flex items-center mb-4 font-semibold text-gray-900">
                    <Brain className="w-5 h-5 mr-2 text-purple-500" />
                    HRV & Stress Analysis
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Heart Rate Variability</span>
                        <span className="font-medium">{vitalSignsData.heartRate.hrv}ms</span>
                      </div>
                      <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                        <div className="h-full bg-purple-500" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Stress Level</span>
                        <span className="font-medium">{vitalSignsData.stress.level}%</span>
                      </div>
                      <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                        <div className="h-full bg-green-500" style={{ width: `${100 - vitalSignsData.stress.level}%` }}></div>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-50">
                      <p className="text-xs text-purple-700">
                        <strong>AI Insight:</strong> Your stress is {vitalSignsData.stress.trend}. Consider a 5-minute breathing exercise.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hydration & Electrolytes */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h3 className="flex items-center mb-4 font-semibold text-gray-900">
                    <Droplets className="w-5 h-5 mr-2 text-blue-500" />
                    Hydration Status
                  </h3>
                  <div className="relative mb-4">
                    <div className="flex items-center justify-center">
                      <div className="relative w-32 h-32">
                        <svg viewBox="0 0 100 100" className="transform -rotate-90">
                          <circle cx="50" cy="50" r="40" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                          <circle cx="50" cy="50" r="40" stroke="#3B82F6" strokeWidth="8" fill="none"
                            strokeDasharray={`${2 * Math.PI * 40 * (vitalSignsData.hydration.level / 100)} ${2 * Math.PI * 40}`}
                            strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <p className="text-2xl font-bold text-blue-600">{vitalSignsData.hydration.level}%</p>
                          <p className="text-xs text-gray-500">Hydrated</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Electrolyte Balance</span>
                      <span className="font-medium text-green-600">Balanced</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daily Intake</span>
                      <span className="font-medium">2.1L / 2.5L</span>
                    </div>
                  </div>
                </div>

                {/* Respiratory */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h3 className="flex items-center mb-4 font-semibold text-gray-900">
                    <Wind className="w-5 h-5 mr-2 text-teal-500" />
                    Respiratory Health
                  </h3>
                  <div className="text-center">
                    <div className="mb-4">
                      <p className="text-3xl font-bold text-teal-600">{vitalSignsData.respiratoryRate.current}</p>
                      <p className="text-sm text-gray-500">breaths/min</p>
                    </div>
                    <ResponsiveContainer width="100%" height={80}>
                      <AreaChart data={[
                        { x: 1, y: 12 },
                        { x: 2, y: 14 },
                        { x: 3, y: 13 },
                        { x: 4, y: 15 },
                        { x: 5, y: 14 }
                      ]}>
                        <Area type="monotone" dataKey="y" stroke="#14B8A6" fill="#14B8A6" fillOpacity={0.2} strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                    <p className="text-xs text-gray-600">Normal respiratory pattern</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeGadget === 'ai-health-coach' && (
            <>
              {/* AI Health Coach Dashboard */}
              <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
                {/* Real-time Insights */}
                <div className="p-6 bg-white shadow-sm lg:col-span-2 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="flex items-center font-semibold text-gray-900">
                      <Brain className="w-5 h-5 mr-2 text-indigo-600" />
                      AI Health Insights
                    </h3>
                    <button className="text-sm text-indigo-600 hover:text-indigo-800">View All</button>
                  </div>
                  <div className="space-y-4">
                    {aiInsights.map((insight, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${
                        insight.priority === 'high' ? 'border-red-200 bg-red-50' :
                        insight.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                        'border-green-200 bg-green-50'
                      }`}>
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-full ${
                            insight.type === 'alert' ? 'bg-red-100' :
                            insight.type === 'insight' ? 'bg-blue-100' :
                            'bg-green-100'
                          }`}>
                            {insight.type === 'alert' ? <AlertTriangle className="w-4 h-4 text-red-600" /> :
                             insight.type === 'insight' ? <Info className="w-4 h-4 text-blue-600" /> :
                             <Target className="w-4 h-4 text-green-600" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{insight.message}</p>
                            <p className="mt-1 text-sm text-gray-600">{insight.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Daily Progress */}
                <div className="space-y-4">
                  {/* Health Score */}
                  <div className="p-6 text-white shadow-sm bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                    <h3 className="mb-4 font-semibold">Today's Health Score</h3>
                    <div className="text-center">
                      <p className="text-5xl font-bold">86</p>
                      <p className="text-sm opacity-80">Excellent</p>
                      <div className="flex items-center justify-center mt-4 space-x-1">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs">+3 from yesterday</span>
                      </div>
                    </div>
                  </div>

                  {/* Goal Progress */}
                  <div className="p-6 bg-white shadow-sm rounded-xl">
                    <h3 className="mb-4 font-semibold text-gray-900">Daily Goals</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Steps</span>
                          <span className="font-medium">8,432 / 10,000</span>
                        </div>
                        <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                          <div className="h-full bg-blue-500" style={{ width: '84%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Active Minutes</span>
                          <span className="font-medium">45 / 30</span>
                        </div>
                        <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                          <div className="h-full bg-green-500" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Hydration</span>
                          <span className="font-medium">2.1L / 2.5L</span>
                        </div>
                        <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                          <div className="h-full bg-cyan-500" style={{ width: '84%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Behavioral Patterns & Recommendations */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Pattern Recognition */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h3 className="mb-4 font-semibold text-gray-900">Behavioral Pattern Analysis</h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-blue-900">Optimal Workout Time</span>
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-sm text-gray-700">Your energy peaks at 7:00 AM and 5:00 PM based on HRV patterns</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-green-900">Sleep Consistency</span>
                        <Moon className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-700">Best recovery when sleeping 10:30 PM - 6:30 AM</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-purple-900">Stress Triggers</span>
                        <Brain className="w-4 h-4 text-purple-600" />
                      </div>
                      <p className="text-sm text-gray-700">Work meetings correlate with 40% increase in stress levels</p>
                    </div>
                  </div>
                </div>

                {/* Adaptive Recommendations */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h3 className="mb-4 font-semibold text-gray-900">Today's Personalized Plan</h3>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 space-x-3 rounded-lg bg-indigo-50">
                      <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold text-white bg-indigo-600 rounded-full">1</div>
                      <div>
                        <p className="font-medium">Morning Meditation</p>
                        <p className="text-sm text-gray-600">5 minutes at 7:00 AM for optimal cortisol regulation</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 space-x-3 rounded-lg bg-indigo-50">
                      <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold text-white bg-indigo-600 rounded-full">2</div>
                      <div>
                        <p className="font-medium">High-Intensity Workout</p>
                        <p className="text-sm text-gray-600">Your HRV indicates perfect recovery for HIIT today</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 space-x-3 rounded-lg bg-indigo-50">
                      <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold text-white bg-indigo-600 rounded-full">3</div>
                      <div>
                        <p className="font-medium">Afternoon Walk</p>
                        <p className="text-sm text-gray-600">20 minutes post-lunch to stabilize glucose</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 space-x-3 rounded-lg bg-indigo-50">
                      <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold text-white bg-indigo-600 rounded-full">4</div>
                      <div>
                        <p className="font-medium">Evening Wind-down</p>
                        <p className="text-sm text-gray-600">Blue light filter at 8 PM, sleep by 10:30 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeGadget === 'cardio-sleep' && (
            <>
              {/* Cardiovascular & Sleep Insights */}
              <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
                {/* Sleep Analysis */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h3 className="mb-4 font-semibold text-gray-900">Last Night's Sleep Analysis</h3>
                  <div className="mb-4 text-center">
                    <p className="text-4xl font-bold text-indigo-600">{sleepData.duration}h</p>
                    <p className="text-sm text-gray-500">Sleep Duration</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 text-center rounded-lg bg-purple-50">
                      <p className="text-xl font-bold text-purple-600">{sleepData.score}</p>
                      <p className="text-xs text-gray-600">Sleep Score</p>
                    </div>
                    <div className="p-3 text-center rounded-lg bg-green-50">
                      <p className="text-xl font-bold text-green-600">{sleepData.recovery}%</p>
                      <p className="text-xs text-gray-600">Recovery</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {sleepData.stages.map((stage, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>{stage.stage}</span>
                          <span className="font-medium">{stage.hours}h ({stage.percentage}%)</span>
                        </div>
                        <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                          <div 
                            className={`h-full ${
                              stage.stage === 'Deep' ? 'bg-purple-600' :
                              stage.stage === 'REM' ? 'bg-indigo-600' :
                              stage.stage === 'Light' ? 'bg-blue-400' :
                              'bg-gray-400'
                            }`}
                            style={{ width: `${stage.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cardiovascular Insights */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h3 className="mb-4 font-semibold text-gray-900">Cardiovascular Health</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={healthScoreData}>
                      <PolarGrid stroke="#E5E7EB" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar name="Score" dataKey="value" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-3 text-center rounded-lg bg-red-50">
                      <p className="text-sm font-medium">Resting HR</p>
                      <p className="text-xl font-bold text-red-600">58 bpm</p>
                    </div>
                    <div className="p-3 text-center rounded-lg bg-purple-50">
                      <p className="text-sm font-medium">Avg HRV</p>
                      <p className="text-xl font-bold text-purple-600">45ms</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sleep & Heart Rate Correlation */}
              <div className="p-6 bg-white shadow-sm rounded-xl">
                <h3 className="mb-4 font-semibold text-gray-900">Sleep Quality vs Heart Rate Variability</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <ComposedChart data={[
                    { day: 'Mon', sleep: 85, hrv: 42 },
                    { day: 'Tue', sleep: 78, hrv: 38 },
                    { day: 'Wed', sleep: 82, hrv: 41 },
                    { day: 'Thu', sleep: 88, hrv: 45 },
                    { day: 'Fri', sleep: 75, hrv: 35 },
                    { day: 'Sat', sleep: 90, hrv: 48 },
                    { day: 'Sun', sleep: 85, hrv: 45 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" label={{ value: 'Sleep Score', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: 'HRV (ms)', angle: 90, position: 'insideRight' }} />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="sleep" fill="#8B5CF6" />
                    <Line yAxisId="right" type="monotone" dataKey="hrv" stroke="#EC4899" strokeWidth={3} />
                  </ComposedChart>
                </ResponsiveContainer>
                <div className="p-4 mt-4 rounded-lg bg-purple-50">
                  <p className="text-sm text-purple-800">
                    <strong>AI Insight:</strong> Your HRV strongly correlates with sleep quality. Prioritize consistent sleep schedule for optimal recovery.
                  </p>
                </div>
              </div>
            </>
          )}

          {activeGadget === 'physiological-age' && (
            <>
              {/* Enhanced Physiological Age Calculator */}
              <div className={`p-6 mb-6 text-white rounded-xl ${
                isYounger 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600' 
                  : 'bg-gradient-to-r from-red-600 to-orange-600'
              }`}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="text-center">
                    <p className="text-sm opacity-80">Chronological Age</p>
                    <p className="text-4xl font-bold">{chronologicalAge}</p>
                    <p className="text-sm opacity-80">years</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm opacity-80">Physiological Age</p>
                    <p className={`text-5xl font-bold ${isYounger ? 'text-yellow-300' : 'text-white'}`}>
                      {physiologicalAge}
                    </p>
                    <p className="text-sm opacity-80">years</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm opacity-80">Age Difference</p>
                    <p className={`text-4xl font-bold ${isYounger ? 'text-green-300' : 'text-yellow-300'}`}>
                      {isYounger ? '' : '+'}{Math.abs(ageDifference)}
                    </p>
                    <p className="text-sm opacity-80">
                      years {isYounger ? 'younger' : 'older'}
                    </p>
                  </div>
                </div>
                
                {!isYounger && (
                  <div className="p-4 mt-6 bg-white rounded-lg bg-opacity-20">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5" />
                      <p className="text-sm font-medium">
                        Your physiological age is higher than your chronological age. Let's work together to reverse this!
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Age Factors Analysis - Enhanced to show problems */}
              <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
                {/* Contributing Factors */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h3 className="mb-4 font-semibold text-gray-900">Physiological Age Factors</h3>
                  <div className="space-y-3">
                    {physioAgeFactors.map((factor, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{factor.factor}</span>
                          <span className={`text-sm ${factor.impact < 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {factor.impact > 0 ? '+' : ''}{factor.impact} years
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                          <div 
                            className={`h-full ${
                              factor.score >= 85 ? 'bg-green-500' : 
                              factor.score >= 70 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`}
                            style={{ width: `${factor.score}%` }}
                          ></div>
                        </div>
                        {factor.score < 70 && (
                          <p className="mt-1 text-xs text-red-600">Needs improvement</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Age Progression Chart */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h3 className="mb-4 font-semibold text-gray-900">Physiological Age Trend</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={[
                      { month: 'Jan', physio: 46, chrono: 38 },
                      { month: 'Feb', physio: 46, chrono: 38 },
                      { month: 'Mar', physio: 45.5, chrono: 38 },
                      { month: 'Apr', physio: 45, chrono: 38 },
                      { month: 'May', physio: 45, chrono: 38 },
                      { month: 'Jun', physio: 45, chrono: 38 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[35, 50]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="chrono" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="5 5" name="Chronological" />
                      <Line type="monotone" dataKey="physio" stroke="#EF4444" strokeWidth={3} name="Physiological" />
                    </LineChart>
                  </ResponsiveContainer>
                  {!isYounger && (
                    <div className="p-3 mt-4 rounded-lg bg-orange-50">
                      <p className="text-sm text-orange-800">
                        <strong>Trend:</strong> Your physiological age has started to improve! Keep up the good work.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Longevity Recommendations - Enhanced for age reversal */}
              <div className="p-6 bg-white shadow-sm rounded-xl">
                <h3 className="mb-4 font-semibold text-gray-900">
                  {isYounger ? 'Longevity Optimization Protocol' : 'Age Reversal Action Plan'}
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className={`p-4 text-center rounded-lg ${
                    isYounger 
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50' 
                      : 'bg-gradient-to-br from-red-50 to-pink-50'
                  }`}>
                    <Award className={`w-8 h-8 mx-auto mb-2 ${isYounger ? 'text-green-600' : 'text-red-600'}`} />
                    <h4 className="mb-2 font-medium">{isYounger ? 'Continue' : 'Critical'}</h4>
                    <ul className="space-y-1 text-sm text-left text-gray-600">
                      <li>• {isYounger ? 'Daily exercise routine' : 'Start 30min daily walks'}</li>
                      <li>• {isYounger ? 'Mediterranean diet' : 'Eliminate processed foods'}</li>
                      <li>• {isYounger ? '7-8 hours sleep' : 'Fix sleep schedule NOW'}</li>
                      <li>• {isYounger ? 'Stress management' : 'Daily meditation required'}</li>
                    </ul>
                  </div>
                  <div className="p-4 text-center rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50">
                    <Target className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                    <h4 className="mb-2 font-medium">{isYounger ? 'Optimize' : 'Urgent'}</h4>
                    <ul className="space-y-1 text-sm text-left text-gray-600">
                      <li>• {isYounger ? 'Increase HIIT sessions' : 'Add strength training'}</li>
                      <li>• {isYounger ? 'Add intermittent fasting' : 'Start 16:8 fasting'}</li>
                      <li>• {isYounger ? 'Reduce sugar intake' : 'Cut sugar completely'}</li>
                      <li>• {isYounger ? 'Morning sun exposure' : 'Vitamin D supplement'}</li>
                    </ul>
                  </div>
                  <div className="p-4 text-center rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50">
                    <Fingerprint className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <h4 className="mb-2 font-medium">Advanced</h4>
                    <ul className="space-y-1 text-sm text-left text-gray-600">
                      <li>• NAD+ optimization</li>
                      <li>• Senolytic protocols</li>
                      <li>• Hormesis training</li>
                      <li>• Telomere support</li>
                    </ul>
                  </div>
                </div>
                
                {!isYounger && (
                  <div className="p-4 mt-6 border border-red-200 rounded-lg bg-red-50">
                    <h4 className="mb-2 font-medium text-red-900">🚨 Immediate Action Required</h4>
                    <p className="text-sm text-red-800">
                      Your physiological age indicates accelerated aging. Following this protocol can help you reverse 
                      your physiological age by 5-10 years in the next 6 months. Start with the Critical actions TODAY.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Integrated Health Summary */}
          <div className={`p-6 mt-6 text-white rounded-xl ${
            isYounger 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600' 
              : 'bg-gradient-to-r from-orange-600 to-red-600'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-2 text-xl font-bold">
                  {isYounger 
                    ? 'Your health is optimizing beautifully! 🚀' 
                    : 'Time to take control of your health! 💪'
                  }
                </h3>
                <p className="text-sm opacity-90">
                  {isYounger 
                    ? `All systems are functioning above baseline. Your physiological age is ${Math.abs(ageDifference)} years younger than your chronological age!`
                    : `Your physiological age is ${ageDifference} years older than your chronological age. But don't worry - with our AI-powered protocols, you can reverse this!`
                  }
                </p>
                <div className="flex items-center mt-3 space-x-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span className="text-sm">
                      {isYounger ? 'Low Risk Profile' : 'Improvable Risk Profile'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm">
                      {isYounger ? 'Improving Trajectory' : 'Ready for Transformation'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center justify-center w-24 h-24 bg-white rounded-full bg-opacity-20">
                  <Cpu className="w-12 h-12" />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
            /* Aman AI Coach Tab */
            <div className="space-y-6">
              {/* AI Coach Header */}
              <div className="p-8 text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center mb-4 space-x-3">
                      <div className="p-3 bg-white rounded-full bg-opacity-20">
                        <Bot className="w-8 h-8" />
                      </div>
                      <h2 className="text-3xl font-bold">Aman AI Longevity Coach</h2>
                    </div>
                    <p className="text-lg opacity-90">Your comprehensive health optimization AI powered by real-time biometric data</p>
                  </div>
                  <Sparkles className="w-16 h-16 opacity-20" />
                </div>
              </div>

              {/* Predictive Health Analysis */}
              <div className="p-6 bg-white shadow-sm rounded-xl">
                <h3 className="flex items-center mb-4 text-xl font-semibold">
                  <Microscope className="w-5 h-5 mr-2 text-purple-600" />
                  Aman's Predictive Health Analysis
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <div className="p-4 text-center border-2 border-green-200 rounded-lg bg-green-50">
                    <Heart className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <h4 className="mb-1 font-medium">Cardiovascular</h4>
                    <p className="text-2xl font-bold text-green-600">2%</p>
                    <p className="text-xs text-gray-600">10-year risk</p>
                    <p className="mt-2 text-xs text-green-600">Excellent</p>
                  </div>
                  <div className="p-4 text-center border-2 border-blue-200 rounded-lg bg-blue-50">
                    <Brain className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <h4 className="mb-1 font-medium">Cognitive</h4>
                    <p className="text-2xl font-bold text-blue-600">Sharp</p>
                    <p className="text-xs text-gray-600">Performance</p>
                    <p className="mt-2 text-xs text-blue-600">Above Average</p>
                  </div>
                  <div className="p-4 text-center border-2 border-purple-200 rounded-lg bg-purple-50">
                    <Shield className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <h4 className="mb-1 font-medium">Immune</h4>
                    <p className="text-2xl font-bold text-purple-600">Strong</p>
                    <p className="text-xs text-gray-600">Function</p>
                    <p className="mt-2 text-xs text-purple-600">Optimized</p>
                  </div>
                  <div className="p-4 text-center border-2 border-yellow-200 rounded-lg bg-yellow-50">
                    <Gauge className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                    <h4 className="mb-1 font-medium">Metabolic</h4>
                    <p className="text-2xl font-bold text-yellow-600">92%</p>
                    <p className="text-xs text-gray-600">Efficiency</p>
                    <p className="mt-2 text-xs text-yellow-600">High Performance</p>
                  </div>
                </div>
              </div>

              {/* Personalized Longevity Protocol */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Daily Optimization */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h3 className="flex items-center mb-4 text-lg font-semibold">
                    <Clock className="w-5 h-5 mr-2 text-purple-600" />
                    Aman's Daily Optimization Schedule
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-purple-200 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-purple-900">Morning Protocol</span>
                        <span className="text-sm text-purple-600">6:00-8:00 AM</span>
                      </div>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• 10 min sunlight exposure (Vitamin D + Circadian)</li>
                        <li>• Cold shower 2 min (Hormesis activation)</li>
                        <li>• Breathwork 5 min (HRV optimization)</li>
                      </ul>
                    </div>

                    <div className="p-4 border border-green-200 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-green-900">Midday Optimization</span>
                        <span className="text-sm text-green-600">12:00-2:00 PM</span>
                      </div>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• 20 min walk post-lunch (Glucose control)</li>
                        <li>• 5 min meditation (Stress reduction)</li>
                        <li>• Hydration check (2L milestone)</li>
                      </ul>
                    </div>

                    <div className="p-4 border border-indigo-200 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-indigo-900">Evening Recovery</span>
                        <span className="text-sm text-indigo-600">8:00-10:00 PM</span>
                      </div>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Blue light off (Melatonin production)</li>
                        <li>• Magnesium supplement (Sleep quality)</li>
                        <li>• 4-7-8 breathing (Parasympathetic activation)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Longevity Interventions */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h3 className="flex items-center mb-4 text-lg font-semibold">
                    <Pill className="w-5 h-5 mr-2 text-purple-600" />
                    Aman's Longevity Stack
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50">
                      <div>
                        <p className="font-medium">NAD+ Precursors</p>
                        <p className="text-xs text-gray-600">NMN 500mg morning</p>
                      </div>
                      <span className="text-sm font-medium text-purple-600">Cellular Energy</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                      <div>
                        <p className="font-medium">Resveratrol</p>
                        <p className="text-xs text-gray-600">500mg with yogurt</p>
                      </div>
                      <span className="text-sm font-medium text-blue-600">SIRT1 Activation</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                      <div>
                        <p className="font-medium">Metformin</p>
                        <p className="text-xs text-gray-600">500mg (consult physician)</p>
                      </div>
                      <span className="text-sm font-medium text-green-600">mTOR Inhibition</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50">
                      <div>
                        <p className="font-medium">Omega-3 DHA/EPA</p>
                        <p className="text-xs text-gray-600">2g daily</p>
                      </div>
                      <span className="text-sm font-medium text-orange-600">Inflammation Control</span>
                    </div>
                  </div>
                  <div className="p-3 mt-4 rounded-lg bg-purple-50">
                    <p className="text-sm text-purple-800">
                      <strong>Aman notes:</strong> This stack is optimized for your biomarkers. Always consult healthcare provider before starting.
                    </p>
                  </div>
                </div>
              </div>

              {/* Advanced Biohacking Protocols */}
              <div className="p-6 bg-white shadow-sm rounded-xl">
                <h3 className="flex items-center mb-4 text-lg font-semibold">
                  <CircuitBoard className="w-5 h-5 mr-2 text-purple-600" />
                  Aman's Advanced Biohacking Protocols
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-red-50 to-pink-50">
                    <div className="flex items-start space-x-3">
                      <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold text-white bg-red-600 rounded-full">1</div>
                      <div>
                        <h4 className="mb-1 font-medium">Hormetic Stressors</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Sauna: 20min @ 180°F 4x/week</li>
                          <li>• Cold plunge: 3min @ 50°F</li>
                          <li>• HIIT: 2x/week threshold training</li>
                          <li>• Fasting: 16:8 daily + 24h monthly</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50">
                    <div className="flex items-start space-x-3">
                      <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold text-white bg-purple-600 rounded-full">2</div>
                      <div>
                        <h4 className="mb-1 font-medium">Circadian Optimization</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Dawn simulator wake-up</li>
                          <li>• 10,000 lux morning light</li>
                          <li>• Red light therapy evening</li>
                          <li>• Temperature regulation</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50">
                    <div className="flex items-start space-x-3">
                      <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold text-white bg-green-600 rounded-full">3</div>
                      <div>
                        <h4 className="mb-1 font-medium">Recovery Tech</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• PEMF therapy 20min daily</li>
                          <li>• Compression therapy legs</li>
                          <li>• HRV biofeedback training</li>
                          <li>• Neurofeedback 2x/week</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Physiological Age Optimization */}
              <div className="p-6 bg-white shadow-sm rounded-xl">
                <h3 className="flex items-center mb-4 text-lg font-semibold">
                  <Fingerprint className="w-5 h-5 mr-2 text-purple-600" />
                  Aman's Physiological Age Reversal Protocol
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-3 font-medium">12-Week Intensive Phase</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                        <span className="text-sm">Senolytic Fasting</span>
                        <span className="text-sm font-medium">3-day quarterly</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                        <span className="text-sm">Exercise Volume</span>
                        <span className="text-sm font-medium">Zone 2: 180min/week</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                        <span className="text-sm">Sleep Optimization</span>
                        <span className="text-sm font-medium">8h + 20min nap</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                        <span className="text-sm">Stress Reduction</span>
                        <span className="text-sm font-medium">2x daily meditation</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-3 font-medium">Expected Outcomes</h4>
                    <div className="space-y-2">
                      <div className="p-3 rounded-lg bg-green-50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Physiological Age</span>
                          <span className="text-sm font-bold text-green-600">-3 years</span>
                        </div>
                        <p className="mt-1 text-xs text-gray-600">Expected reduction in 12 weeks</p>
                      </div>
                      <div className="p-3 rounded-lg bg-purple-50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Telomere Length</span>
                          <span className="text-sm font-bold text-purple-600">+7%</span>
                        </div>
                        <p className="mt-1 text-xs text-gray-600">Projected elongation</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI-Powered Health Predictions */}
              <div className="p-6 text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-xl">
                <h3 className="flex items-center mb-4 text-xl font-semibold">
                  <Target className="w-6 h-6 mr-2" />
                  Aman's 5-Year Health Trajectory Prediction
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold">28</p>
                    <p className="text-sm opacity-80">Physiological Age in 5 Years</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">99.2%</p>
                    <p className="text-sm opacity-80">Disease-Free Probability</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">95</p>
                    <p className="text-sm opacity-80">Projected Healthspan</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">Top 1%</p>
                    <p className="text-sm opacity-80">Global Health Ranking</p>
                  </div>
                </div>
                <div className="p-4 mt-6 bg-white rounded-lg bg-opacity-20">
                  <p className="text-sm">
                    <strong>Aman's Analysis:</strong> Your current health trajectory is exceptional. By maintaining your comprehensive protocol and incorporating the advanced interventions, you're on track to achieve physiological age reversal of 10 years within 5 years. Your multi-system optimization approach is yielding compound benefits across all biomarkers.
                  </p>
                </div>
              </div>

              {/* Start AI Plan Button */}
              <div className="text-center">
                <button className="px-8 py-4 font-bold text-white transition-all duration-200 transform shadow-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 rounded-xl hover:from-purple-700 hover:via-indigo-700 hover:to-pink-700 hover:scale-105">
                  Activate Aman's Comprehensive Longevity Protocol
                </button>
              </div>
            </div>
          )}
        </PlanDashboardLayout>
  );
};

export default PreventiveIntelligenceDashboard;