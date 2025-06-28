import React, { useState, useEffect } from 'react';
import { 
  Activity,
  TrendingUp,
  Heart,
  Target,
  Calendar,
  AlertCircle,
  Timer,
  Zap,
  Brain,
  Sparkles,
  TrendingDown,
  Bot,
  AlertTriangle,
  Clock,
  Shield,
  Waves,
  CheckCircle,
  Gauge,
  Dumbbell,
  Footprints,
  Scale,
  Ruler,
  Move3d,
  ChevronLeft,
  ChevronRight,
  Award,
  XCircle,
  Syringe,
  Bandage,
  Apple,
  BedDouble,
  Pill
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, RadialBarChart, RadialBar, Cell, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import PlanDashboardLayout from '../../common/PlanDashboardLayout';
import { fetchRealTimeData } from '../../../hooks/useMediCureOnData';
import medicalBodyRecovery from '../../../assets/images/medical-body-recovery.png';

const PostSurgeryRecoveryDashboard = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedBodyPart, setSelectedBodyPart] = useState('knee');
  const [recoveryWeek, setRecoveryWeek] = useState(6);
  const [painLevel, setPainLevel] = useState(3);
  
  // Real-time IoMT data states
  const [realtimeMetrics, setRealtimeMetrics] = useState({
    heartRate: null,
    bloodPressure: null,
    painLevel: null,
    romProgress: null,
    lastUpdated: null
  });

  // Fetch real-time IoMT data for critical recovery metrics
  useEffect(() => {
    const fetchRealtimeData = async () => {
      try {
        // This would be your actual IoMT endpoint for post-surgery monitoring
        const response = await fetchRealTimeData('/api/iomt/post-surgery/realtime', {
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
        console.error('Error fetching real-time recovery data:', error);
      }
    };

    // Fetch immediately
    fetchRealtimeData();
    
    // Set up polling for real-time data every 30 seconds
    const interval = setInterval(fetchRealtimeData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Recovery timeline data
  const recoveryTimeline = [
    { week: 1, rom: 20, strength: 10, pain: 8, swelling: 9, phase: 'Acute' },
    { week: 2, rom: 35, strength: 15, pain: 7, swelling: 7, phase: 'Early Mobilization' },
    { week: 3, rom: 50, strength: 25, pain: 6, swelling: 5, phase: 'Early Mobilization' },
    { week: 4, rom: 65, strength: 35, pain: 5, swelling: 3, phase: 'Progressive Loading' },
    { week: 5, rom: 75, strength: 45, pain: 4, swelling: 2, phase: 'Progressive Loading' },
    { week: 6, rom: 85, strength: 55, pain: 3, swelling: 1, phase: 'Strengthening' },
    { week: 7, rom: 90, strength: 65, pain: 2, swelling: 1, phase: 'Strengthening' },
    { week: 8, rom: 95, strength: 75, pain: 1, swelling: 0, phase: 'Return to Function' }
  ];

  // Range of Motion data
  const romData = [
    { joint: 'Flexion', current: 85, target: 120, normal: 135 },
    { joint: 'Extension', current: 5, target: 0, normal: 0 },
    { joint: 'Internal Rotation', current: 30, target: 40, normal: 45 },
    { joint: 'External Rotation', current: 35, target: 45, normal: 45 }
  ];

  // Physical therapy exercises
  const exerciseData = [
    { name: 'Heel Slides', sets: 3, reps: 15, completed: true, difficulty: 'Easy' },
    { name: 'Quad Sets', sets: 3, reps: 20, completed: true, difficulty: 'Easy' },
    { name: 'Straight Leg Raises', sets: 3, reps: 10, completed: false, difficulty: 'Medium' },
    { name: 'Mini Squats', sets: 2, reps: 12, completed: false, difficulty: 'Hard' },
    { name: 'Balance Exercises', sets: 3, reps: 30, completed: false, difficulty: 'Medium' }
  ];

  // Recovery metrics for radar chart
  const recoveryMetrics = [
    { metric: 'Range of Motion', value: 85, fullMark: 100 },
    { metric: 'Strength', value: 55, fullMark: 100 },
    { metric: 'Pain Management', value: 70, fullMark: 100 },
    { metric: 'Functional Mobility', value: 60, fullMark: 100 },
    { metric: 'Daily Activities', value: 65, fullMark: 100 },
    { metric: 'Sleep Quality', value: 75, fullMark: 100 }
  ];

  // Muscle mass data
  const muscleMassData = {
    torso: 15,
    legs: 10,
    arms: 4.5
  };

  // Vital signs
  const vitalSigns = {
    heartRate: { current: realtimeMetrics.heartRate || 98, normal: '60-100' },
    bloodPressure: { 
      systolic: realtimeMetrics.bloodPressure?.systolic || 102, 
      diastolic: realtimeMetrics.bloodPressure?.diastolic || 72, 
      status: 'Normal' 
    },
    temperature: 98.2,
    oxygenSaturation: 97
  };

  // Medication schedule
  const medications = [
    { name: 'Ibuprofen', dose: '400mg', time: '8:00 AM', taken: true, type: 'Pain Relief' },
    { name: 'Collagen Supplement', dose: '10g', time: '9:00 AM', taken: true, type: 'Recovery' },
    { name: 'Vitamin D', dose: '2000 IU', time: '12:00 PM', taken: false, type: 'Bone Health' },
    { name: 'Calcium', dose: '500mg', time: '6:00 PM', taken: false, type: 'Bone Health' }
  ];

  // Recommended meals for recovery
  const recoveryMeals = [
    { name: "Chicken and Avocado", category: "HIGH PROTEIN", protein: 35, calories: 320, image: "🥗", antiInflammatory: true },
    { name: "Set of salad", category: "ANTIOXIDANTS", protein: 8, calories: 180, image: "🥬", antiInflammatory: true },
    { name: "Salmon with veggies", category: "OMEGA-3", protein: 40, calories: 380, image: "🐟", antiInflammatory: true },
    { name: "Greek yogurt parfait", category: "PROBIOTICS", protein: 20, calories: 250, image: "🥛", antiInflammatory: false },
    { name: "Turmeric smoothie", category: "ANTI-INFLAMMATORY", protein: 15, calories: 200, image: "🥤", antiInflammatory: true }
  ];

  // Pain tracking throughout the day
  const painTracking = [
    { time: '6 AM', level: 5 },
    { time: '9 AM', level: 4 },
    { time: '12 PM', level: 3 },
    { time: '3 PM', level: 4 },
    { time: '6 PM', level: 3 },
    { time: '9 PM', level: 2 }
  ];

  // Custom badges for this plan
  const customBadges = [
    {
      text: `Week ${recoveryWeek} of 12`,
      className: "flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full",
      icon: () => <Calendar className="w-3 h-3 text-white mr-1.5" />
    },
    {
      text: realtimeMetrics.romProgress ? `${realtimeMetrics.romProgress}% ROM` : '85% ROM',
      className: "flex items-center px-3 py-1.5 bg-green-500/20 backdrop-blur-sm rounded-full",
      icon: () => <Activity className="w-3 h-3 text-green-400 mr-1.5" />
    }
  ];

  return (
    <PlanDashboardLayout
      planId={9}
      planName="Post-Surgery Recovery"
      subtitle="Your Recovery Journey Dashboard 🏥"
      customBadges={customBadges}
      onNavigate={onNavigate}
      showDevelopmentBanner={true}
      isRealTimeData={true} // Enable real-time data for critical recovery monitoring
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
          Post-recovery
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
                <h3 className="mb-4 font-semibold text-gray-900">Muscle mass</h3>
                
                {/* Body Visualization */}
                <div className="relative mb-6">
                  <div className="relative w-48 h-64 mx-auto">
                    <img 
                      src={medicalBodyRecovery}
                      alt="Medical body visualization"
                      className="object-contain w-full h-full opacity-90"
                    />
                    
                    {/* Injury indicators */}
                    <div 
                      className="absolute"
                      style={{ 
                        top: '65%', 
                        left: '35%', 
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div className="relative">
                        {/* Pulsing injury indicator */}
                        <div className="absolute w-6 h-6 bg-red-400 rounded-full opacity-40 animate-pulse"></div>
                        <div className="absolute w-6 h-6 bg-red-500 rounded-full opacity-20 animate-ping"></div>
                        
                        {/* Injury label */}
                        <div className="absolute px-2 py-1 text-xs font-medium text-white transform -translate-x-1/2 bg-red-500 rounded-full -bottom-6 left-1/2 whitespace-nowrap">
                          Knee - Recovering
                        </div>
                      </div>
                    </div>

                    {/* Progress indicators */}
                    <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                      <div className="relative">
                        <div className="absolute w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ top: '-40px', left: '-20px' }}></div>
                        <div className="absolute w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ top: '40px', left: '-25px', animationDelay: '1s' }}></div>
                        <div className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ top: '20px', left: '25px', animationDelay: '0.5s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Muscle Mass Metrics */}
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Total muscle mass</p>
                    <p className="text-2xl font-bold">{muscleMassData.torso + muscleMassData.legs + muscleMassData.arms}kg</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Torso</span>
                      <span className="text-sm font-medium">{muscleMassData.torso}kg</span>
                    </div>
                    <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                      <div className="h-full bg-blue-500" style={{ width: '60%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Avg. legs</span>
                      <span className="text-sm font-medium">{muscleMassData.legs}kg</span>
                    </div>
                    <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                      <div className="h-full bg-orange-500" style={{ width: '40%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Avg. arms</span>
                      <span className="text-sm font-medium">{muscleMassData.arms}kg</span>
                    </div>
                    <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                      <div className="h-full bg-green-500" style={{ width: '35%' }}></div>
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
                        <Zap className="w-5 h-5" />
                      </div>
                      <span className="font-semibold">Calories</span>
                    </div>
                  </div>
                  <p className="mb-1 text-3xl font-bold">Under</p>
                  <p className="text-sm">maintenance level</p>
                </div>
              </div>

              {/* Vital Signs Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Heart Rate */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h3 className="flex items-center mb-4 font-semibold text-gray-900">
                    <Heart className="w-5 h-5 mr-2 text-red-500" />
                    Standing heart rate
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="relative w-24 h-24 mx-auto">
                        <svg viewBox="0 0 100 100" className="transform -rotate-90">
                          <circle cx="50" cy="50" r="40" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                          <circle cx="50" cy="50" r="40" stroke="#22C55E" strokeWidth="8" fill="none"
                            strokeDasharray={`${2 * Math.PI * 40 * 0.75} ${2 * Math.PI * 40}`}
                            strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <p className="text-2xl font-bold">{vitalSigns.heartRate.current}</p>
                          <p className="text-xs text-gray-500">Normal resting</p>
                        </div>
                      </div>
                      {realtimeMetrics.lastUpdated && (
                        <p className="mt-1 text-xs text-gray-400">
                          Live
                        </p>
                      )}
                    </div>
                    <div className="text-center">
                      <div className="relative w-24 h-24 mx-auto">
                        <svg viewBox="0 0 100 100" className="transform -rotate-90">
                          <circle cx="50" cy="50" r="40" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                          <circle cx="50" cy="50" r="40" stroke="#F59E0B" strokeWidth="8" fill="none"
                            strokeDasharray={`${2 * Math.PI * 40 * 0.85} ${2 * Math.PI * 40}`}
                            strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <p className="text-2xl font-bold">145</p>
                          <p className="text-xs text-gray-500">During exercise</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Blood Pressure */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h3 className="mb-4 font-semibold text-gray-900">Blood pressure</h3>
                  <div className="flex items-baseline mb-4 space-x-2">
                    <span className="text-3xl font-bold text-red-600">{vitalSigns.bloodPressure.systolic}</span>
                    <span className="text-lg text-gray-600">/{vitalSigns.bloodPressure.diastolic}</span>
                    <span className="text-sm text-gray-500">mmHg</span>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {vitalSigns.bloodPressure.status}
                  </span>
                  <div className="mt-4">
                    <ResponsiveContainer width="100%" height={60}>
                      <AreaChart data={[
                        { time: 1, value: 110 },
                        { time: 2, value: 108 },
                        { time: 3, value: 105 },
                        { time: 4, value: 102 }
                      ]}>
                        <Area type="monotone" dataKey="value" stroke="#3B82F6" fill="#DBEAFE" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recovery Progress Chart */}
          <div className="p-6 mt-6 bg-white shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Recovery Progress Timeline</h3>
              <div className="flex items-center space-x-4">
                <span className="flex items-center text-sm">
                  <div className="w-3 h-3 mr-2 bg-blue-500 rounded-full"></div>
                  Range of Motion
                </span>
                <span className="flex items-center text-sm">
                  <div className="w-3 h-3 mr-2 bg-green-500 rounded-full"></div>
                  Strength
                </span>
                <span className="flex items-center text-sm">
                  <div className="w-3 h-3 mr-2 bg-red-500 rounded-full"></div>
                  Pain Level
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={recoveryTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" label={{ value: 'Weeks', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Progress %', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Pain Level', angle: 90, position: 'insideRight' }} domain={[0, 10]} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload[0]) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 bg-white border rounded-lg shadow-lg">
                          <p className="font-semibold">Week {data.week}</p>
                          <p className="text-sm text-gray-600">{data.phase}</p>
                          <p className="text-sm">ROM: {data.rom}%</p>
                          <p className="text-sm">Strength: {data.strength}%</p>
                          <p className="text-sm">Pain: {data.pain}/10</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line type="monotone" dataKey="rom" stroke="#3B82F6" strokeWidth={3} name="Range of Motion" />
                <Line type="monotone" dataKey="strength" stroke="#22C55E" strokeWidth={3} name="Strength" />
                <Line type="monotone" dataKey="pain" stroke="#EF4444" strokeWidth={3} name="Pain Level" yAxisId="right" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Recommended Recovery Meals */}
          <div className="p-6 mt-6 bg-white shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Recommended Low-Calorie and Heart-Healthy Meals</h3>
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
              {recoveryMeals.map((meal, index) => (
                <div key={index} className="cursor-pointer group">
                  <div className="relative p-4 transition-all bg-gray-100 rounded-lg hover:shadow-md">
                    <span className="absolute px-2 py-1 text-xs font-medium bg-white rounded-full top-2 right-2">
                      {meal.category}
                    </span>
                    <div className="mb-3 text-4xl text-center">{meal.image}</div>
                    <h4 className="mb-1 text-sm font-medium text-gray-900">{meal.name}</h4>
                    <div className="text-xs text-gray-500">
                      <p>Protein: {meal.protein}g</p>
                      <p>Calories: {meal.calories}</p>
                      {meal.antiInflammatory && (
                        <p className="font-medium text-green-600">Anti-inflammatory</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recovery Metrics Row */}
          <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-3">
            {/* Range of Motion */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="mb-4 font-semibold text-gray-900">Range of Motion</h3>
              <div className="space-y-3">
                {romData.map((rom, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>{rom.joint}</span>
                      <span className="font-medium">{rom.current}°/{rom.target}°</span>
                    </div>
                    <div className="relative h-2 overflow-hidden bg-gray-200 rounded-full">
                      <div 
                        className="absolute h-full bg-blue-500 rounded-full"
                        style={{ width: `${(rom.current / rom.normal) * 100}%` }}
                      ></div>
                      <div 
                        className="absolute w-1 h-full bg-red-600"
                        style={{ left: `${(rom.target / rom.normal) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-center text-gray-500">Blue: Current | Red line: Target</p>
            </div>

            {/* Recovery Score */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="mb-4 font-semibold text-gray-900">Overall Recovery Score</h3>
              <div className="relative">
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={recoveryMetrics}>
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar name="Score" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 text-center">
                <p className="text-2xl font-bold text-purple-600">68%</p>
                <p className="text-sm text-gray-600">Overall Recovery</p>
              </div>
            </div>

            {/* Physical Therapy Compliance */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="flex items-center mb-4 font-semibold text-gray-900">
                <Dumbbell className="w-5 h-5 mr-2 text-green-600" />
                Today's PT Exercises
              </h3>
              <div className="space-y-2">
                {exerciseData.map((exercise, index) => (
                  <div key={index} className={`flex items-center justify-between p-2 rounded-lg ${exercise.completed ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full ${exercise.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div>
                        <p className="text-sm font-medium">{exercise.name}</p>
                        <p className="text-xs text-gray-500">{exercise.sets} sets × {exercise.reps} reps</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      exercise.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      exercise.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {exercise.difficulty}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Compliance: <span className="font-bold text-green-600">40%</span></p>
              </div>
            </div>
          </div>

          {/* Pain and Medication Tracking */}
          <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
            {/* Pain Tracking */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="mb-4 font-semibold text-gray-900">Pain Level Throughout Day</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={painTracking}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="level" stroke="#EF4444" fill="#FEE2E2" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center mt-4 space-x-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Current Pain</p>
                  <p className="text-2xl font-bold text-red-600">{realtimeMetrics.painLevel || painLevel}/10</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Average Today</p>
                  <p className="text-2xl font-bold text-orange-600">3.5/10</p>
                </div>
              </div>
            </div>

            {/* Medication Schedule */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="flex items-center mb-4 font-semibold text-gray-900">
                <Pill className="w-5 h-5 mr-2 text-blue-600" />
                Recovery Medications
              </h3>
              <div className="space-y-2">
                {medications.map((med, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${med.taken ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">{med.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          med.type === 'Pain Relief' ? 'bg-red-100 text-red-700' :
                          med.type === 'Recovery' ? 'bg-purple-100 text-purple-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {med.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{med.time} • {med.dose}</p>
                    </div>
                    {med.taken ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <button className="px-3 py-1 text-xs text-white bg-blue-600 rounded-full hover:bg-blue-700">
                        Take
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recovery Insights */}
          <div className="p-6 mt-6 text-white bg-gradient-to-r from-teal-500 to-green-500 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-2 text-xl font-bold">Excellent recovery progress! 🎯</h3>
                <p className="text-sm opacity-90">You're ahead of schedule! Your range of motion has improved by 15% this week, and pain levels are consistently decreasing.</p>
                <div className="flex items-center mt-3 space-x-4">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span className="text-sm">6 Week Milestone</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm">68% Recovered</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center justify-center w-24 h-24 bg-white rounded-full bg-opacity-20">
                  <Footprints className="w-12 h-12" />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
            /* Aman AI Coach Tab */
            <div className="space-y-6">
              {/* AI Coach Header */}
              <div className="p-8 text-white bg-gradient-to-r from-teal-600 to-green-600 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center mb-4 space-x-3">
                      <div className="p-3 bg-white rounded-full bg-opacity-20">
                        <Bot className="w-8 h-8" />
                      </div>
                      <h2 className="text-3xl font-bold">Aman AI Recovery Coach</h2>
                    </div>
                    <p className="text-lg opacity-90">Your personalized post-surgery rehabilitation specialist</p>
                  </div>
                  <Sparkles className="w-16 h-16 opacity-20" />
                </div>
              </div>

              {/* Recovery Phase Analysis */}
              <div className="p-6 bg-white shadow-sm rounded-xl">
                <h3 className="flex items-center mb-4 text-xl font-semibold">
                  <Target className="w-5 h-5 mr-2 text-teal-600" />
                  Aman's Recovery Phase Protocol
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <div className="p-4 text-center border-2 border-red-200 rounded-lg bg-red-50">
                    <Bandage className="w-8 h-8 mx-auto mb-2 text-red-600" />
                    <h4 className="mb-1 font-medium">Phase 1: Acute</h4>
                    <p className="mb-2 text-sm font-bold text-red-600">Weeks 1-2</p>
                    <ul className="space-y-1 text-xs text-left text-gray-600">
                      <li>• Pain & swelling control</li>
                      <li>• Gentle ROM exercises</li>
                      <li>• Protect surgical site</li>
                      <li>• Ice & elevation</li>
                    </ul>
                  </div>
                  <div className="p-4 text-center border-2 border-orange-200 rounded-lg bg-orange-50">
                    <Move3d className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                    <h4 className="mb-1 font-medium">Phase 2: Mobility</h4>
                    <p className="mb-2 text-sm font-bold text-orange-600">Weeks 3-6</p>
                    <ul className="space-y-1 text-xs text-left text-gray-600">
                      <li>• Progressive ROM</li>
                      <li>• Light strengthening</li>
                      <li>• Gait training</li>
                      <li>• Proprioception</li>
                    </ul>
                  </div>
                  <div className="p-4 text-center border-2 border-green-200 rounded-lg bg-green-50">
                    <Dumbbell className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <h4 className="mb-1 font-medium">Phase 3: Strength</h4>
                    <p className="mb-2 text-sm font-bold text-green-600">Weeks 7-10</p>
                    <ul className="space-y-1 text-xs text-left text-gray-600">
                      <li>• Progressive loading</li>
                      <li>• Functional exercises</li>
                      <li>• Balance training</li>
                      <li>• Sport-specific drills</li>
                    </ul>
                  </div>
                  <div className="p-4 text-center border-2 border-blue-200 rounded-lg bg-blue-50">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <h4 className="mb-1 font-medium">Phase 4: Return</h4>
                    <p className="mb-2 text-sm font-bold text-blue-600">Weeks 11-16</p>
                    <ul className="space-y-1 text-xs text-left text-gray-600">
                      <li>• Full activities</li>
                      <li>• Sport return</li>
                      <li>• Maintenance program</li>
                      <li>• Prevention focus</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Personalized Recovery Recommendations */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Exercise Progression */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h3 className="flex items-center mb-4 text-lg font-semibold">
                    <Timer className="w-5 h-5 mr-2 text-teal-600" />
                    Aman's Exercise Progression Plan
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-teal-200 rounded-lg bg-gradient-to-r from-teal-50 to-green-50">
                      <h4 className="mb-2 font-medium text-teal-900">This Week's Focus</h4>
                      <p className="text-sm text-gray-700">Quadriceps strengthening with 30% load progression. Add resistance bands to exercises.</p>
                      <div className="flex items-center mt-2 text-xs text-teal-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Safe to progress based on pain levels
                      </div>
                    </div>

                    <div className="p-4 border border-green-200 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                      <h4 className="mb-2 font-medium text-green-900">Movement Quality</h4>
                      <p className="text-sm text-gray-700">Focus on proper knee alignment during squats. Avoid valgus collapse.</p>
                      <div className="flex items-center mt-2 text-xs text-green-600">
                        <Brain className="w-3 h-3 mr-1" />
                        Neuromuscular control improving
                      </div>
                    </div>

                    <div className="p-4 border border-purple-200 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                      <h4 className="mb-2 font-medium text-purple-900">Recovery Optimization</h4>
                      <p className="text-sm text-gray-700">Implement contrast therapy: 3 min heat, 1 min cold, repeat 3x</p>
                      <div className="flex items-center mt-2 text-xs text-purple-600">
                        <Waves className="w-3 h-3 mr-1" />
                        Reduces inflammation by 40%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Assessment & Prevention */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h3 className="flex items-center mb-4 text-lg font-semibold">
                    <Shield className="w-5 h-5 mr-2 text-teal-600" />
                    Aman's Risk Assessment
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Re-injury Risk</span>
                      </div>
                      <span className="text-sm font-medium text-green-600">Low (15%)</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        <span className="font-medium">Compensatory Patterns</span>
                      </div>
                      <span className="text-sm font-medium text-yellow-600">Monitor hip</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Tissue Healing</span>
                      </div>
                      <span className="text-sm font-medium text-green-600">On track</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        <span className="font-medium">Muscle Imbalance</span>
                      </div>
                      <span className="text-sm font-medium text-orange-600">20% deficit</span>
                    </div>
                  </div>
                  <div className="p-3 mt-4 rounded-lg bg-teal-50">
                    <p className="text-sm text-teal-800">
                      <strong>Aman notes:</strong> Your recovery is progressing well. Focus on addressing the quadriceps strength deficit to prevent future issues.
                    </p>
                  </div>
                </div>
              </div>

              {/* Nutrition & Supplement Protocol */}
              <div className="p-6 bg-white shadow-sm rounded-xl">
                <h3 className="flex items-center mb-4 text-lg font-semibold">
                  <Apple className="w-5 h-5 mr-2 text-teal-600" />
                  Aman's Recovery Nutrition Protocol
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-teal-50 to-green-50">
                    <div className="flex items-start space-x-3">
                      <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold text-white bg-teal-600 rounded-full">1</div>
                      <div>
                        <h4 className="mb-1 font-medium">Tissue Repair Phase</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Protein: 1.6g/kg body weight</li>
                          <li>• Vitamin C: 1000mg/day</li>
                          <li>• Zinc: 15mg/day</li>
                          <li>• Collagen: 10-15g/day</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50">
                    <div className="flex items-start space-x-3">
                      <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold text-white bg-green-600 rounded-full">2</div>
                      <div>
                        <h4 className="mb-1 font-medium">Anti-Inflammatory</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Omega-3: 2-3g/day</li>
                          <li>• Turmeric: 500mg 2x/day</li>
                          <li>• Tart cherry juice</li>
                          <li>• Green tea: 3 cups/day</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                    <div className="flex items-start space-x-3">
                      <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold text-white bg-blue-600 rounded-full">3</div>
                      <div>
                        <h4 className="mb-1 font-medium">Energy & Recovery</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li>• Complex carbs: 3-4g/kg</li>
                          <li>• Hydration: 3L/day</li>
                          <li>• B-complex vitamins</li>
                          <li>• Magnesium: 400mg</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sleep & Recovery Optimization */}
              <div className="p-6 bg-white shadow-sm rounded-xl">
                <h3 className="flex items-center mb-4 text-lg font-semibold">
                  <BedDouble className="w-5 h-5 mr-2 text-teal-600" />
                  Aman's Sleep Optimization for Healing
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-3 font-medium">Sleep Position Guidelines</h4>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="flex-shrink-0 w-4 h-4 mt-1 text-green-600" />
                        <p className="text-sm text-gray-700">Elevate surgical limb with 2-3 pillows</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="flex-shrink-0 w-4 h-4 mt-1 text-green-600" />
                        <p className="text-sm text-gray-700">Sleep on back or unaffected side</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <XCircle className="flex-shrink-0 w-4 h-4 mt-1 text-red-600" />
                        <p className="text-sm text-gray-700">Avoid sleeping on surgical side</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-3 font-medium">Recovery Sleep Protocol</h4>
                    <div className="space-y-2">
                      <div className="p-3 rounded-lg bg-teal-50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Target Sleep</span>
                          <span className="text-sm font-bold text-teal-600">8-9 hours</span>
                        </div>
                        <p className="mt-1 text-xs text-gray-600">Growth hormone peaks during deep sleep</p>
                      </div>
                      <div className="p-3 rounded-lg bg-green-50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Nap Window</span>
                          <span className="text-sm font-bold text-green-600">1-3 PM</span>
                        </div>
                        <p className="mt-1 text-xs text-gray-600">20-30 min power nap aids recovery</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Movement Milestones */}
              <div className="p-6 bg-white shadow-sm rounded-xl">
                <h3 className="flex items-center mb-4 text-lg font-semibold">
                  <Award className="w-5 h-5 mr-2 text-teal-600" />
                  Aman's Recovery Milestones & Predictions
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-green-100 rounded-full">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Week 2: Initial Movement</h4>
                        <span className="text-sm text-green-600">Completed</span>
                      </div>
                      <p className="text-sm text-gray-600">Achieved 90° flexion, minimal swelling</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-green-100 rounded-full">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Week 4: Weight Bearing</h4>
                        <span className="text-sm text-green-600">Completed</span>
                      </div>
                      <p className="text-sm text-gray-600">Full weight bearing without assistive device</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Week 8: Return to Jogging</h4>
                        <span className="text-sm text-yellow-600">In Progress</span>
                      </div>
                      <p className="text-sm text-gray-600">Light jogging on treadmill, 10 minutes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full">
                      <Timer className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Week 12: Return to Sport</h4>
                        <span className="text-sm text-gray-600">Upcoming</span>
                      </div>
                      <p className="text-sm text-gray-600">Full clearance for recreational activities</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Success Predictions */}
              <div className="p-6 text-white bg-gradient-to-r from-teal-600 to-green-600 rounded-xl">
                <h3 className="flex items-center mb-4 text-xl font-semibold">
                  <Target className="w-6 h-6 mr-2" />
                  Aman's Recovery Success Predictions
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold">Week 10</p>
                    <p className="text-sm opacity-80">Full ROM Recovery</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">85%</p>
                    <p className="text-sm opacity-80">Strength Return</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">Week 12</p>
                    <p className="text-sm opacity-80">Return to Activities</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">96%</p>
                    <p className="text-sm opacity-80">Full Recovery Rate</p>
                  </div>
                </div>
                <div className="p-4 mt-6 bg-white rounded-lg bg-opacity-20">
                  <p className="text-sm">
                    <strong>Aman's Analysis:</strong> Based on your current progress trajectory and compliance rate, you're recovering 23% faster than average. Your dedication to PT exercises and nutrition protocol is accelerating healing. Maintain this momentum for optimal outcomes!
                  </p>
                </div>
              </div>

              {/* Start AI Plan Button */}
              <div className="text-center">
                <button className="px-8 py-4 font-bold text-white transition-all duration-200 transform shadow-lg bg-gradient-to-r from-teal-600 to-green-600 rounded-xl hover:from-teal-700 hover:to-green-700 hover:scale-105">
                  Activate Aman's Advanced Recovery Protocol
                </button>
              </div>
            </div>
          )}
        </PlanDashboardLayout>
  );
};

export default PostSurgeryRecoveryDashboard;