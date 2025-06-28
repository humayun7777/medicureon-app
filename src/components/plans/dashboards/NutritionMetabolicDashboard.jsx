import React, { useState, useEffect } from 'react';
import { 
  Activity,
  Apple,
  Droplets,
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
  Info,
  CheckCircle,
  Coffee,
  Utensils,
  Carrot,
  Fish,
  Beef,
  Egg,
  Milk,
  Wheat,
  Cookie,
  Pizza,
  Salad,
  ChefHat,
  Dumbbell,
  Scale,
  BarChart3,
  PieChart,
  Flame,
  Battery,
  BatteryLow,
  Gauge,
  ShoppingCart,
  Calendar,
  Award,
  Pill,
  TestTube,
  Microscope,
  FlaskConical,
  Stethoscope,
  Sun,
  Leaf,
  Cherry,
  GlassWater,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, RadialBarChart, RadialBar, Cell, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter } from 'recharts';
import PlanDashboardLayout from '../../common/PlanDashboardLayout';
import { fetchRealTimeData } from '../../../hooks/useMediCureOnData';

const NutritionMetabolicDashboard = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMealPlan, setSelectedMealPlan] = useState('balanced');
  const [waterIntake, setWaterIntake] = useState(5); // glasses
  const [selectedNutrient, setSelectedNutrient] = useState(null);
  
  // Real-time IoMT data states
  const [realtimeMetrics, setRealtimeMetrics] = useState({
    glucoseLevel: null,
    ketoneLevel: null,
    metabolicRate: null,
    hydrationLevel: null,
    lastUpdated: null
  });

  // Fetch real-time IoMT data for metabolic monitoring
  useEffect(() => {
    const fetchRealtimeData = async () => {
      try {
        // This would be your actual IoMT endpoint
        const response = await fetchRealTimeData('/api/iomt/nutrition/realtime', {
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
        console.error('Error fetching real-time nutrition data:', error);
      }
    };

    // Fetch immediately
    fetchRealtimeData();
    
    // Set up polling for real-time data every 30 seconds
    const interval = setInterval(fetchRealtimeData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // BMR and metabolic data
  const metabolicData = {
    bmr: realtimeMetrics.metabolicRate || 1652,
    tdee: 2281,
    metabolicAge: 28,
    visceralFat: 8,
    bodyWater: realtimeMetrics.hydrationLevel || 55
  };

  // Daily nutrition intake
  const nutritionIntake = [
    { time: '8 AM', calories: 380, protein: 25, carbs: 45, fat: 12 },
    { time: '10 AM', calories: 150, protein: 8, carbs: 20, fat: 5 },
    { time: '12 PM', calories: 520, protein: 35, carbs: 60, fat: 15 },
    { time: '3 PM', calories: 180, protein: 10, carbs: 25, fat: 6 },
    { time: '6 PM', calories: 480, protein: 30, carbs: 55, fat: 18 },
    { time: '8 PM', calories: 120, protein: 5, carbs: 15, fat: 4 }
  ];

  // Macronutrient distribution
  const macroDistribution = [
    { name: 'Protein', value: 25, target: 30, color: '#3B82F6' },
    { name: 'Carbs', value: 45, target: 40, color: '#F59E0B' },
    { name: 'Fat', value: 30, target: 30, color: '#10B981' }
  ];

  // Micronutrient levels
  const micronutrients = [
    { name: 'Vitamin D', level: 32, optimal: 50, unit: 'ng/mL', status: 'Low', color: '#F59E0B' },
    { name: 'B12', level: 450, optimal: 500, unit: 'pg/mL', status: 'Normal', color: '#10B981' },
    { name: 'Iron', level: 65, optimal: 90, unit: 'mcg/dL', status: 'Low', color: '#EF4444' },
    { name: 'Calcium', level: 9.8, optimal: 10, unit: 'mg/dL', status: 'Normal', color: '#10B981' },
    { name: 'Magnesium', level: 1.7, optimal: 2.0, unit: 'mg/dL', status: 'Low', color: '#F59E0B' },
    { name: 'Zinc', level: 85, optimal: 100, unit: 'mcg/dL', status: 'Normal', color: '#10B981' }
  ];

  // Hydration tracking
  const hydrationData = [
    { time: '8 AM', amount: 2, total: 2 },
    { time: '10 AM', amount: 1, total: 3 },
    { time: '12 PM', amount: 2, total: 5 },
    { time: '2 PM', amount: 1, total: 6 },
    { time: '4 PM', amount: 1, total: 7 },
    { time: '6 PM', amount: 1, total: 8 },
    { time: '8 PM', amount: 1, total: 9 }
  ];

  // Food sensitivity markers
  const foodSensitivities = [
    { food: 'Gluten', sensitivity: 15, threshold: 50 },
    { food: 'Dairy', sensitivity: 65, threshold: 50 },
    { food: 'Eggs', sensitivity: 10, threshold: 50 },
    { food: 'Soy', sensitivity: 25, threshold: 50 },
    { food: 'Nuts', sensitivity: 5, threshold: 50 }
  ];

  // Gut health indicators
  const gutHealthScore = 78;
  const microbiomeDiversity = 82;

  // Featured meals
  const featuredMeals = [
    { 
      name: "Avocado Salad",
      image: "🥗",
      calories: 285,
      protein: 12,
      rating: 4.8,
      antiInflammatory: 95,
      glycemicIndex: "Low"
    },
    { 
      name: "Tuna with Zucchini",
      image: "🐟",
      calories: 310,
      protein: 38,
      rating: 4.9,
      antiInflammatory: 88,
      glycemicIndex: "Low"
    },
    { 
      name: "Chicken and Brussels",
      image: "🍗",
      calories: 340,
      protein: 35,
      rating: 4.7,
      antiInflammatory: 82,
      glycemicIndex: "Medium"
    },
    { 
      name: "Set of Salad",
      image: "🥬",
      calories: 220,
      protein: 8,
      rating: 4.6,
      antiInflammatory: 92,
      glycemicIndex: "Low"
    },
    { 
      name: "Salmon with Asparagus",
      image: "🍣",
      calories: 380,
      protein: 42,
      rating: 5.0,
      antiInflammatory: 98,
      glycemicIndex: "Low"
    }
  ];

  // Metabolic health indicators
  const metabolicHealth = [
    { metric: 'Insulin Sensitivity', score: 85, trend: 'up' },
    { metric: 'Metabolic Flexibility', score: 78, trend: 'stable' },
    { metric: 'Mitochondrial Function', score: 82, trend: 'up' },
    { metric: 'Inflammation Markers', score: 72, trend: 'down' },
    { metric: 'Oxidative Stress', score: 68, trend: 'down' }
  ];

  // Custom badges for this plan
  const customBadges = [
    {
      text: '1,830 cal today',
      className: "flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full",
      icon: () => <Apple className="w-3 h-3 text-white mr-1.5" />
    }
  ];

  return (
    <PlanDashboardLayout
      planId={6}
      planName="Nutrition & Metabolic Health"
      subtitle="Optimize your nutrition for peak metabolic health 🥗"
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
          Nutrition & Metabolic Health
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
          {/* Top Stats Row */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-4">
            {/* BMR Card */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">BMR</span>
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{metabolicData.bmr.toLocaleString()}</p>
              <p className="text-xs text-gray-500">calories/day</p>
              <div className="flex items-center mt-2 text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>+2% from last month</span>
              </div>
              {realtimeMetrics.lastUpdated && (
                <p className="mt-1 text-xs text-gray-400">Live update</p>
              )}
            </div>

            {/* HydroStatus Card */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">HydroStatus</span>
                <Droplets className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{waterIntake}/8</p>
              <p className="text-xs text-gray-500">glasses today</p>
              <div className="w-full h-2 mt-2 overflow-hidden bg-gray-200 rounded-full">
                <div 
                  className="h-full transition-all bg-blue-500 rounded-full"
                  style={{ width: `${(waterIntake / 8) * 100}%` }}
                ></div>
              </div>
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
              <p className="mb-1 text-3xl font-bold">1,830</p>
              <p className="text-sm">Today</p>
              <div className="p-2 mt-2 text-xs bg-white rounded-lg bg-opacity-30">
                <span>451 cal under target</span>
              </div>
            </div>
          </div>

          {/* Water Intake Tracker */}
          <div className="p-6 mb-6 bg-white shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Water Intake Tracker</h3>
              <button 
                onClick={() => setWaterIntake(Math.min(waterIntake + 1, 12))}
                className="flex items-center px-3 py-1 text-sm text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Glass
              </button>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">{waterIntake * 250}ml</p>
                <p className="text-sm text-gray-500">Current intake</p>
              </div>
              <div className="flex-1 px-8">
                <ResponsiveContainer width="100%" height={80}>
                  <AreaChart data={hydrationData}>
                    <Area type="monotone" dataKey="total" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
                    <XAxis dataKey="time" hide />
                    <YAxis hide />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-400">2L</p>
                <p className="text-sm text-gray-500">Daily goal</p>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-1">
              {[...Array(12)].map((_, index) => (
                <div
                  key={index}
                  className={`h-8 rounded-full transition-all cursor-pointer ${
                    index < waterIntake 
                      ? 'bg-blue-500' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  onClick={() => setWaterIntake(index + 1)}
                >
                  <GlassWater className={`w-4 h-4 mx-auto mt-2 ${
                    index < waterIntake ? 'text-white' : 'text-gray-400'
                  }`} />
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-center text-gray-500">
              {waterIntake < 8 
                ? `${8 - waterIntake} more glasses to reach your daily goal`
                : waterIntake === 8
                ? "Daily goal achieved! 🎉"
                : "Excellent hydration! Keep it up! 💪"
              }
            </p>
          </div>

          {/* Macronutrient Balance & Daily Intake */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
            {/* Macronutrient Distribution */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="mb-4 font-semibold text-gray-900">Macronutrient Balance</h3>
              <div className="flex items-center justify-center mb-4">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie
                      data={macroDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {macroDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {macroDistribution.map((macro, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center text-sm font-medium">
                        <div 
                          className="w-3 h-3 mr-2 rounded-full"
                          style={{ backgroundColor: macro.color }}
                        ></div>
                        {macro.name}
                      </span>
                      <span className="text-sm">
                        {macro.value}% <span className="text-gray-400">(Target: {macro.target}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full">
                      <div 
                        className="h-full transition-all rounded-full"
                        style={{ 
                          width: `${macro.value}%`,
                          backgroundColor: macro.color
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Calorie Intake */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="mb-4 font-semibold text-gray-900">Daily Nutrition Timeline</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={nutritionIntake}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="calories" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-between mt-4 text-sm">
                <div className="text-center">
                  <p className="font-bold text-gray-900">113g</p>
                  <p className="text-xs text-gray-500">Protein</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900">220g</p>
                  <p className="text-xs text-gray-500">Carbs</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900">60g</p>
                  <p className="text-xs text-gray-500">Fat</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900">28g</p>
                  <p className="text-xs text-gray-500">Fiber</p>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Diet Menu */}
          <div className="p-6 mb-6 bg-white shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Featured Diet Menu</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700">View all</button>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {featuredMeals.map((meal, index) => (
                <div key={index} className="cursor-pointer group">
                  <div className="p-4 transition-all bg-gray-50 rounded-xl hover:shadow-lg hover:bg-white">
                    <div className="mb-3 text-4xl text-center">{meal.image}</div>
                    <h4 className="mb-1 text-sm font-medium text-center text-gray-900">{meal.name}</h4>
                    <div className="space-y-1 text-xs text-center text-gray-500">
                      <p>{meal.calories} cal • {meal.protein}g protein</p>
                      <div className="flex items-center justify-center">
                        <span className="flex items-center">
                          ⭐ {meal.rating}
                        </span>
                      </div>
                      <div className="flex justify-center space-x-1">
                        <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                          {meal.glycemicIndex} GI
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Micronutrients & Vitamins */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
            {/* Micronutrient Levels */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="flex items-center mb-4 font-semibold text-gray-900">
                <TestTube className="w-5 h-5 mr-2 text-purple-600" />
                Vitamin & Mineral Status
              </h3>
              <div className="space-y-3">
                {micronutrients.map((nutrient, index) => (
                  <div key={index} className="p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-medium">{nutrient.name}</span>
                        <span className="ml-2 text-sm text-gray-500">
                          {nutrient.level} {nutrient.unit}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        nutrient.status === 'Normal' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {nutrient.status}
                      </span>
                    </div>
                    <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full">
                      <div 
                        className="h-full transition-all rounded-full"
                        style={{ 
                          width: `${(nutrient.level / nutrient.optimal) * 100}%`,
                          backgroundColor: nutrient.color,
                          maxWidth: '100%'
                        }}
                      ></div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Optimal: {nutrient.optimal} {nutrient.unit}
                    </p>
                  </div>
                ))}
              </div>
              <button className="w-full px-4 py-2 mt-4 text-sm font-medium text-purple-600 transition-colors rounded-lg bg-purple-50 hover:bg-purple-100">
                View Full Blood Panel
              </button>
            </div>

            {/* Metabolic Health Score */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="flex items-center mb-4 font-semibold text-gray-900">
                <Microscope className="w-5 h-5 mr-2 text-green-600" />
                Metabolic Health Indicators
              </h3>
              <div className="mb-4 text-center">
                <div className="relative inline-flex items-center justify-center w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#10B981"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56 * 0.78} ${2 * Math.PI * 56}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute">
                    <p className="text-2xl font-bold text-gray-900">78%</p>
                    <p className="text-xs text-gray-500">Overall Score</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {metabolicHealth.map((indicator, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <span className="text-sm">{indicator.metric}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{indicator.score}%</span>
                      {indicator.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
                      {indicator.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
                      {indicator.trend === 'stable' && <span className="w-3 h-3 text-gray-400">—</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Food Sensitivities & Gut Health */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
            {/* Food Sensitivity Analysis */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="flex items-center mb-4 font-semibold text-gray-900">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                Food Sensitivity Markers
              </h3>
              <div className="space-y-3">
                {foodSensitivities.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{item.food}</span>
                      <span className={`text-sm ${
                        item.sensitivity > item.threshold ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {item.sensitivity > item.threshold ? 'Sensitive' : 'Tolerant'}
                      </span>
                    </div>
                    <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full">
                      <div 
                        className="h-full transition-all rounded-full"
                        style={{ 
                          width: `${item.sensitivity}%`,
                          backgroundColor: item.sensitivity > item.threshold ? '#EF4444' : '#10B981'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-gray-500">
                Based on IgG antibody testing. Values above 50 indicate potential sensitivity.
              </p>
            </div>

            {/* Gut Health Score */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="flex items-center mb-4 font-semibold text-gray-900">
                <Leaf className="w-5 h-5 mr-2 text-green-600" />
                Gut Health & Microbiome
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-4 text-center bg-green-50 rounded-xl">
                  <Waves className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold text-green-600">{gutHealthScore}%</p>
                  <p className="text-xs text-gray-600">Gut Health Score</p>
                </div>
                <div className="p-4 text-center bg-purple-50 rounded-xl">
                  <Cherry className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-2xl font-bold text-purple-600">{microbiomeDiversity}%</p>
                  <p className="text-xs text-gray-600">Microbiome Diversity</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <span className="text-sm">Beneficial Bacteria</span>
                  <span className="text-sm font-medium text-green-600">High</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <span className="text-sm">Inflammatory Markers</span>
                  <span className="text-sm font-medium text-green-600">Low</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <span className="text-sm">Digestive Efficiency</span>
                  <span className="text-sm font-medium text-yellow-600">Moderate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Insights Banner */}
          <div className="p-6 text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-2 text-xl font-bold">Great nutritional balance today! 🥗</h3>
                <p className="text-sm opacity-90">Your protein intake is optimal for muscle maintenance. Consider adding more Vitamin D-rich foods or supplementation based on your blood levels.</p>
                <div className="flex items-center mt-3 space-x-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span className="text-sm">Anti-inflammatory diet score: 85%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm">Metabolic health improving</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center justify-center w-24 h-24 bg-white rounded-full bg-opacity-20">
                  <Apple className="w-12 h-12" />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
            /* Aman AI Coach Tab */
            <div className="space-y-6">
              {/* AI Coach Header */}
              <div className="p-8 text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center mb-4 space-x-3">
                      <div className="p-3 bg-white rounded-full bg-opacity-20">
                        <Bot className="w-8 h-8" />
                      </div>
                      <h2 className="text-3xl font-bold">Aman AI Nutritionist</h2>
                    </div>
                    <p className="text-lg opacity-90">Your personalized nutrition & metabolic optimization expert</p>
                  </div>
                  <Sparkles className="w-16 h-16 opacity-20" />
                </div>
              </div>

              {/* Personalized Nutrition Analysis */}
              <div className="p-6 bg-white shadow-sm rounded-xl">
                <h3 className="flex items-center mb-4 text-xl font-semibold">
                  <FlaskConical className="w-5 h-5 mr-2 text-green-600" />
                  Aman's Metabolic Analysis
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                  <div className="p-4 text-center border-2 border-blue-200 rounded-lg bg-blue-50">
                    <Gauge className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <h4 className="mb-1 font-medium">Metabolic Type</h4>
                    <p className="text-2xl font-bold text-blue-600">Balanced</p>
                    <p className="mt-2 text-xs text-gray-600">40% carb efficient</p>
                  </div>

                  <div className="p-4 text-center border-2 border-green-200 rounded-lg bg-green-50">
                    <Battery className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <h4 className="mb-1 font-medium">Energy Efficiency</h4>
                    <p className="text-2xl font-bold text-green-600">82%</p>
                    <p className="mt-2 text-xs text-gray-600">Above average</p>
                  </div>

                  <div className="p-4 text-center border-2 border-purple-200 rounded-lg bg-purple-50">
                    <Brain className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <h4 className="mb-1 font-medium">Nutrient Absorption</h4>
                    <p className="text-2xl font-bold text-purple-600">75%</p>
                    <p className="mt-2 text-xs text-gray-600">Room to improve</p>
                  </div>

                  <div className="p-4 text-center border-2 border-yellow-200 rounded-lg bg-yellow-50">
                    <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                    <h4 className="mb-1 font-medium">Inflammation Level</h4>
                    <p className="text-2xl font-bold text-yellow-600">Low</p>
                    <p className="mt-2 text-xs text-gray-600">hs-CRP: 0.8 mg/L</p>
                  </div>
                </div>
              </div>

              {/* Personalized Meal Plan */}
              <div className="p-6 bg-white shadow-sm rounded-xl">
                <h3 className="flex items-center mb-4 text-lg font-semibold">
                  <ChefHat className="w-5 h-5 mr-2 text-green-600" />
                  Aman's Personalized Meal Plan
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {/* Breakfast */}
                  <div className="p-4 border border-green-200 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-green-900">Breakfast (7:30 AM)</h4>
                      <Coffee className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">Metabolic Boost Bowl</p>
                      <ul className="space-y-1 text-gray-700">
                        <li>• Greek yogurt (150g)</li>
                        <li>• Mixed berries (80g)</li>
                        <li>• Chia seeds (15g)</li>
                        <li>• Walnuts (20g)</li>
                      </ul>
                      <div className="pt-2 mt-2 border-t border-green-200">
                        <p className="text-xs"><strong>Macros:</strong> 380 cal • 25g protein • 28g carbs • 18g fat</p>
                        <p className="mt-1 text-xs text-green-600">High antioxidants, omega-3s</p>
                      </div>
                    </div>
                  </div>

                  {/* Lunch */}
                  <div className="p-4 border border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-blue-900">Lunch (12:30 PM)</h4>
                      <Salad className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">Power Protein Salad</p>
                      <ul className="space-y-1 text-gray-700">
                        <li>• Grilled salmon (120g)</li>
                        <li>• Mixed greens (200g)</li>
                        <li>• Avocado (½)</li>
                        <li>• Quinoa (60g cooked)</li>
                      </ul>
                      <div className="pt-2 mt-2 border-t border-blue-200">
                        <p className="text-xs"><strong>Macros:</strong> 520 cal • 38g protein • 35g carbs • 24g fat</p>
                        <p className="mt-1 text-xs text-blue-600">Anti-inflammatory, complete proteins</p>
                      </div>
                    </div>
                  </div>

                  {/* Dinner */}
                  <div className="p-4 border border-purple-200 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-purple-900">Dinner (6:30 PM)</h4>
                      <Utensils className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">Metabolic Reset Plate</p>
                      <ul className="space-y-1 text-gray-700">
                        <li>• Chicken breast (150g)</li>
                        <li>• Roasted vegetables (250g)</li>
                        <li>• Sweet potato (100g)</li>
                        <li>• Olive oil drizzle</li>
                      </ul>
                      <div className="pt-2 mt-2 border-t border-purple-200">
                        <p className="text-xs"><strong>Macros:</strong> 480 cal • 42g protein • 45g carbs • 12g fat</p>
                        <p className="mt-1 text-xs text-purple-600">Balanced, nutrient-dense</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 mt-4 rounded-lg bg-yellow-50">
                  <p className="text-sm font-medium text-yellow-800">
                    <strong>Aman's Daily Targets:</strong> 2,180 cal • 140g protein (26%) • 218g carbs (40%) • 82g fat (34%) • 35g fiber
                  </p>
                </div>
              </div>

              {/* Supplement Protocol */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Personalized Supplements */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h3 className="flex items-center mb-4 text-lg font-semibold">
                    <Pill className="w-5 h-5 mr-2 text-green-600" />
                    Aman's Supplement Protocol
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 border border-green-200 rounded-lg bg-green-50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-green-900">Vitamin D3</span>
                        <span className="text-sm text-green-600">Priority: High</span>
                      </div>
                      <p className="text-sm text-gray-700">4000 IU daily with breakfast</p>
                      <p className="mt-1 text-xs text-gray-600">Your level: 32 ng/mL → Target: 50 ng/mL</p>
                    </div>

                    <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-blue-900">Omega-3 (EPA/DHA)</span>
                        <span className="text-sm text-blue-600">Priority: High</span>
                      </div>
                      <p className="text-sm text-gray-700">2g daily with dinner</p>
                      <p className="mt-1 text-xs text-gray-600">Reduces inflammation, supports metabolism</p>
                    </div>

                    <div className="p-3 border border-purple-200 rounded-lg bg-purple-50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-purple-900">Magnesium Glycinate</span>
                        <span className="text-sm text-purple-600">Priority: Medium</span>
                      </div>
                      <p className="text-sm text-gray-700">400mg before bed</p>
                      <p className="mt-1 text-xs text-gray-600">Improves sleep, muscle recovery</p>
                    </div>

                    <div className="p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-yellow-900">Probiotic Complex</span>
                        <span className="text-sm text-yellow-600">Priority: Medium</span>
                      </div>
                      <p className="text-sm text-gray-700">50B CFU, empty stomach</p>
                      <p className="mt-1 text-xs text-gray-600">Supports gut health & nutrient absorption</p>
                    </div>
                  </div>
                </div>

                {/* Hydration Optimization */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h3 className="flex items-center mb-4 text-lg font-semibold">
                    <Droplets className="w-5 h-5 mr-2 text-blue-600" />
                    Aman's Hydration Strategy
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 text-center rounded-lg bg-blue-50">
                      <p className="text-3xl font-bold text-blue-600">2.8L</p>
                      <p className="text-sm text-gray-600">Your optimal daily intake</p>
                      <p className="mt-1 text-xs text-gray-500">Based on weight, activity, climate</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <span className="flex items-center text-sm">
                          <Sun className="w-4 h-4 mr-2 text-yellow-500" />
                          Wake up
                        </span>
                        <span className="text-sm font-medium">500ml + lemon</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <span className="flex items-center text-sm">
                          <Coffee className="w-4 h-4 mr-2 text-brown-500" />
                          Pre-workout
                        </span>
                        <span className="text-sm font-medium">750ml + electrolytes</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <span className="flex items-center text-sm">
                          <Utensils className="w-4 h-4 mr-2 text-green-500" />
                          With meals
                        </span>
                        <span className="text-sm font-medium">250ml each</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <span className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-2 text-blue-500" />
                          Throughout day
                        </span>
                        <span className="text-sm font-medium">Sip regularly</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metabolic Optimization Timeline */}
              <div className="p-6 bg-white shadow-sm rounded-xl">
                <h3 className="flex items-center mb-4 text-lg font-semibold">
                  <Target className="w-5 h-5 mr-2 text-green-600" />
                  Aman's 30-Day Metabolic Optimization
                </h3>
                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-green-500 rounded-lg bg-gradient-to-r from-green-50 to-white">
                    <div className="flex items-start space-x-3">
                      <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold text-white bg-green-600 rounded-full">1</div>
                      <div className="flex-1">
                        <h4 className="font-medium">Week 1: Reset & Stabilize</h4>
                        <ul className="mt-2 space-y-1 text-sm text-gray-600">
                          <li>• Eliminate processed foods</li>
                          <li>• Establish meal timing (12-hour eating window)</li>
                          <li>• Increase water to 2.8L daily</li>
                        </ul>
                        <div className="flex items-center mt-2 text-xs text-green-600">
                          <Target className="w-3 h-3 mr-1" />
                          Goal: Reduce inflammation by 20%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-l-4 border-blue-500 rounded-lg bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex items-start space-x-3">
                      <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold text-white bg-blue-600 rounded-full">2</div>
                      <div className="flex-1">
                        <h4 className="font-medium">Week 2: Nutrient Optimization</h4>
                        <ul className="mt-2 space-y-1 text-sm text-gray-600">
                          <li>• Increase protein to 1.2g/kg body weight</li>
                          <li>• Add targeted supplementation</li>
                          <li>• Focus on micronutrient-dense foods</li>
                        </ul>
                        <div className="flex items-center mt-2 text-xs text-blue-600">
                          <Target className="w-3 h-3 mr-1" />
                          Goal: Improve energy levels by 30%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-l-4 border-purple-500 rounded-lg bg-gradient-to-r from-purple-50 to-white">
                    <div className="flex items-start space-x-3">
                      <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold text-white bg-purple-600 rounded-full">3</div>
                      <div className="flex-1">
                        <h4 className="font-medium">Week 3-4: Metabolic Acceleration</h4>
                        <ul className="mt-2 space-y-1 text-sm text-gray-600">
                          <li>• Implement strategic carb cycling</li>
                          <li>• Add intermittent fasting (14:10)</li>
                          <li>• Optimize pre/post workout nutrition</li>
                        </ul>
                        <div className="flex items-center mt-2 text-xs text-purple-600">
                          <Target className="w-3 h-3 mr-1" />
                          Goal: Boost metabolic rate by 12%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Aman's Nutrition Optimization Predictions */}
              <div className="p-6 bg-white shadow-sm rounded-xl">
                <h3 className="flex items-center mb-4 text-lg font-semibold">
                  <Target className="w-5 h-5 mr-2 text-green-600" />
                  Aman's Nutrition Optimization Predictions
                </h3>
                <div className="space-y-4">
                  {/* Body Composition Changes */}
                  <div className="p-4 border border-green-200 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                    <h4 className="mb-3 font-medium text-green-900">Body Composition Transformation</h4>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-2 bg-green-100 rounded">
                        <p className="text-xs text-gray-600">Current</p>
                        <p className="font-bold text-green-700">22% BF</p>
                      </div>
                      <div className="p-2 bg-green-100 rounded">
                        <p className="text-xs text-gray-600">30 Days</p>
                        <p className="font-bold text-green-700">19% BF</p>
                      </div>
                      <div className="p-2 bg-green-200 rounded">
                        <p className="text-xs text-gray-600">90 Days</p>
                        <p className="font-bold text-green-800">16% BF</p>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-600">
                      <strong>Method:</strong> Strategic macro cycling + resistance training
                    </p>
                  </div>

                  {/* Energy & Performance */}
                  <div className="p-4 border border-blue-200 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h4 className="mb-3 font-medium text-blue-900">Energy & Performance Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Daily Energy Level</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-red-600">6/10</span>
                          <ArrowLeft className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-bold text-green-600">9/10</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Mental Clarity</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-red-600">70%</span>
                          <ArrowLeft className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-bold text-green-600">95%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Athletic Performance</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-red-600">Fair</span>
                          <ArrowLeft className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-bold text-green-600">Excellent</span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-600">
                      <strong>Timeline:</strong> 21 days with optimized nutrition timing
                    </p>
                  </div>

                  {/* Biomarker Improvements */}
                  <div className="p-4 border border-purple-200 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                    <h4 className="mb-3 font-medium text-purple-900">Biomarker Optimization</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm font-medium">Vitamin D</p>
                        <div className="flex items-center mt-1">
                          <div className="flex-1 h-2 overflow-hidden bg-gray-200 rounded-full">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: '64%' }}></div>
                          </div>
                          <span className="ml-2 text-xs">32→50 ng/mL</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Iron</p>
                        <div className="flex items-center mt-1">
                          <div className="flex-1 h-2 overflow-hidden bg-gray-200 rounded-full">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: '72%' }}></div>
                          </div>
                          <span className="ml-2 text-xs">65→90 mcg/dL</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">B12</p>
                        <div className="flex items-center mt-1">
                          <div className="flex-1 h-2 overflow-hidden bg-gray-200 rounded-full">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: '90%' }}></div>
                          </div>
                          <span className="ml-2 text-xs">450→500 pg/mL</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Magnesium</p>
                        <div className="flex items-center mt-1">
                          <div className="flex-1 h-2 overflow-hidden bg-gray-200 rounded-full">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                          <span className="ml-2 text-xs">1.7→2.0 mg/dL</span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-600">
                      <strong>Method:</strong> Targeted supplementation + food-first approach
                    </p>
                  </div>

                  {/* Gut Health Transformation */}
                  <div className="p-4 border border-yellow-200 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50">
                    <h4 className="mb-3 font-medium text-yellow-900">Gut Health & Microbiome</h4>
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">78%</p>
                        <p className="text-xs text-gray-600">Current Score</p>
                      </div>
                      <div className="flex-1 px-4">
                        <div className="flex items-center space-x-1">
                          <div className="w-full h-8 overflow-hidden bg-gray-200 rounded-full">
                            <div className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-green-500 animate-pulse" style={{ width: '78%' }}></div>
                          </div>
                          <ArrowLeft className="w-6 h-6 text-green-600 animate-bounce" style={{ transform: 'rotate(180deg)' }} />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">92%</p>
                        <p className="text-xs text-gray-600">45-Day Target</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-yellow-100 rounded">
                        <p className="text-xs font-medium text-yellow-700">Diversity</p>
                        <p className="text-xs">+18% species</p>
                      </div>
                      <div className="p-2 bg-yellow-100 rounded">
                        <p className="text-xs font-medium text-yellow-700">Inflammation</p>
                        <p className="text-xs">-45% markers</p>
                      </div>
                      <div className="p-2 bg-yellow-100 rounded">
                        <p className="text-xs font-medium text-yellow-700">Absorption</p>
                        <p className="text-xs">+25% efficiency</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Success Metrics */}
              <div className="p-6 bg-white shadow-sm rounded-xl">
                <h3 className="flex items-center mb-4 text-lg font-semibold">
                  <Award className="w-5 h-5 mr-2 text-green-600" />
                  Aman's 90-Day Success Metrics
                </h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="p-4 text-center border border-green-200 rounded-lg bg-gradient-to-b from-green-50 to-white">
                    <Scale className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <p className="mb-1 text-xs text-gray-600">Weight Loss</p>
                    <p className="text-2xl font-bold text-green-600">-8kg</p>
                    <p className="mt-1 text-xs text-gray-500">Sustainable rate</p>
                  </div>

                  <div className="p-4 text-center border border-blue-200 rounded-lg bg-gradient-to-b from-blue-50 to-white">
                    <Dumbbell className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="mb-1 text-xs text-gray-600">Muscle Mass</p>
                    <p className="text-2xl font-bold text-blue-600">+2kg</p>
                    <p className="mt-1 text-xs text-gray-500">Lean gains</p>
                  </div>

                  <div className="p-4 text-center border border-purple-200 rounded-lg bg-gradient-to-b from-purple-50 to-white">
                    <Heart className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <p className="mb-1 text-xs text-gray-600">Metabolic Age</p>
                    <p className="text-2xl font-bold text-purple-600">-5 yrs</p>
                    <p className="mt-1 text-xs text-gray-500">Biological age</p>
                  </div>

                  <div className="p-4 text-center border border-yellow-200 rounded-lg bg-gradient-to-b from-yellow-50 to-white">
                    <Battery className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                    <p className="mb-1 text-xs text-gray-600">Energy Score</p>
                    <p className="text-2xl font-bold text-yellow-600">+65%</p>
                    <p className="mt-1 text-xs text-gray-500">Daily vitality</p>
                  </div>
                </div>
              </div>

              {/* Success Prediction Banner */}
              <div className="p-6 text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
                <h3 className="flex items-center mb-4 text-xl font-semibold">
                  <Award className="w-6 h-6 mr-2" />
                  Aman's Nutrition Success Prediction
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold">16%</p>
                    <p className="text-sm opacity-80">Target Body Fat</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">90 days</p>
                    <p className="text-sm opacity-80">To transformation</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">92%</p>
                    <p className="text-sm opacity-80">Gut health target</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">88%</p>
                    <p className="text-sm opacity-80">Success probability</p>
                  </div>
                </div>
                <div className="p-4 mt-6 bg-white rounded-lg bg-opacity-20">
                  <p className="text-sm">
                    <strong>Aman's Analysis:</strong> Your metabolic profile shows excellent responsiveness to nutritional interventions. With your balanced metabolic type and current gut health score of 78%, you're primed for rapid improvements. The combination of strategic macro cycling, targeted supplementation, and microbiome optimization will transform your energy levels and body composition within 90 days.
                  </p>
                </div>
              </div>

              {/* Start AI Plan Button */}
              <div className="text-center">
                <button className="px-8 py-4 font-bold text-white transition-all duration-200 transform shadow-lg bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:from-green-700 hover:to-emerald-700 hover:scale-105">
                  Activate Aman's Metabolic Optimization Protocol
                </button>
              </div>
            </div>
          )}
        </PlanDashboardLayout>
  );
};

export default NutritionMetabolicDashboard;