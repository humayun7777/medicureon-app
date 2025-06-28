// src/components/dashboard/EnhancedLandingMetrics.jsx
import React, { useState, useEffect } from 'react';
import { 
  Heart, Trophy, Target, TrendingUp, Zap, Activity, 
  Droplets, Scale, Brain, Moon, Award, Flag
} from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import iomtApiService from '../../services/iomtApiService';
import profileApiService from '../../services/profileApiService';
import { useAuth } from '../../hooks/useAuth';

const EnhancedLandingMetrics = ({ onNavigate }) => {
  const { user } = useAuth();
  const userId = user?.localAccountId || user?.username || user?.idTokenClaims?.oid;
  
  // State for real-time metrics
  const [healthMetrics, setHealthMetrics] = useState({
    steps: { current: 0, dailyGoal: 10000, planGoal: 0 },
    heartRate: { current: 0, resting: 0, zones: {} },
    sleep: { hours: 0, quality: 0 },
    water: { current: 0, goal: 8 },
    calories: { burned: 0, consumed: 0, budget: 2000 },
    weight: { current: 0, goal: 0, startWeight: 0 },
    stress: { level: 'low', score: 0 },
    activity: { minutes: 0, goal: 30 }
  });

  // State for user plans and challenges
  const [userGoals, setUserGoals] = useState({
    activePlans: [],
    challenges: [],
    primaryGoal: null
  });

  // State for health score calculation
  const [healthScore, setHealthScore] = useState({
    overall: 0,
    components: {
      activity: 0,
      nutrition: 0,
      sleep: 0,
      vitals: 0,
      consistency: 0
    },
    trend: 0,
    level: 1
  });

  // Fetch user's enrolled plans and challenges
  const fetchUserGoals = async () => {
    try {
      // Get user profile to see enrolled plans
      const profileData = await profileApiService.getProfile(userId);
      
      if (profileData.enrolledPlans) {
        const plans = profileData.enrolledPlans;
        const challenges = profileData.activeChallenges || [];
        
        // Determine primary goal based on plans and challenges
        let primaryGoal = determinePrimaryGoal(plans, challenges);
        
        setUserGoals({
          activePlans: plans,
          challenges: challenges,
          primaryGoal: primaryGoal
        });
        
        // Update daily goals based on plans
        updateDailyGoals(plans, challenges);
      }
    } catch (error) {
      console.error('Error fetching user goals:', error);
    }
  };

  // Determine the primary daily goal
  const determinePrimaryGoal = (plans, challenges) => {
    // Priority: Active challenges > Weight loss plans > Other plans
    
    // Check for million step challenge
    const millionStepChallenge = challenges.find(c => c.type === 'million-steps');
    if (millionStepChallenge) {
      const daysRemaining = Math.ceil((new Date(millionStepChallenge.endDate) - new Date()) / (1000 * 60 * 60 * 24));
      const stepsRemaining = 1000000 - (millionStepChallenge.progress || 0);
      const dailyRequired = Math.ceil(stepsRemaining / daysRemaining);
      
      return {
        type: 'challenge',
        name: '1 Million Steps Challenge',
        metric: 'steps',
        daily: Math.max(dailyRequired, 11111), // At least 11,111 steps/day for 90 days
        total: 1000000,
        progress: millionStepChallenge.progress || 0,
        daysRemaining: daysRemaining,
        icon: '🏃‍♂️'
      };
    }
    
    // Check for weight loss plan
    const weightLossPlan = plans.find(p => p.planId === 'weight-loss' || p.planId === 'nutrition-weight');
    if (weightLossPlan && weightLossPlan.goals) {
      return {
        type: 'plan',
        name: 'Weight Loss Journey',
        metric: 'steps',
        daily: weightLossPlan.goals.dailySteps || 4000,
        weightGoal: weightLossPlan.goals.targetWeight,
        calorieGoal: weightLossPlan.goals.dailyCalories || 1800,
        icon: '⚖️'
      };
    }
    
    // Default goal
    return {
      type: 'default',
      name: 'Daily Wellness',
      metric: 'steps',
      daily: 10000,
      icon: '🎯'
    };
  };

  // Update daily goals based on active plans
  const updateDailyGoals = (plans, challenges) => {
    let stepGoal = 10000; // Default
    let calorieGoal = 2000; // Default
    let waterGoal = 8; // Default
    
    // Check weight loss plan
    const weightLossPlan = plans.find(p => p.planId === 'weight-loss');
    if (weightLossPlan && weightLossPlan.goals) {
      stepGoal = weightLossPlan.goals.dailySteps || 4000;
      calorieGoal = weightLossPlan.goals.dailyCalories || 1800;
    }
    
    // Check million step challenge (overrides plan goals)
    const millionStepChallenge = challenges.find(c => c.type === 'million-steps');
    if (millionStepChallenge) {
      const daysRemaining = Math.ceil((new Date(millionStepChallenge.endDate) - new Date()) / (1000 * 60 * 60 * 24));
      const stepsRemaining = 1000000 - (millionStepChallenge.progress || 0);
      const dailyRequired = Math.ceil(stepsRemaining / daysRemaining);
      stepGoal = Math.max(dailyRequired, 11111, stepGoal); // Take the highest requirement
    }
    
    setHealthMetrics(prev => ({
      ...prev,
      steps: { ...prev.steps, dailyGoal: stepGoal, planGoal: stepGoal },
      calories: { ...prev.calories, budget: calorieGoal },
      water: { ...prev.water, goal: waterGoal }
    }));
  };

  // Fetch real-time health metrics
  const fetchHealthMetrics = async () => {
    try {
      // Get IoMT data
      const response = await iomtApiService.getIomtData(userId, {
        limit: 1,
        aggregation: 'daily'
      });
      
      if (response.success && response.data.length > 0) {
        const latestData = response.data[0];
        updateMetricsFromIoMT(latestData);
      }
      
      // Calculate and update health score
      calculateHealthScore();
    } catch (error) {
      console.error('Error fetching health metrics:', error);
    }
  };

  // Update metrics from IoMT data
  const updateMetricsFromIoMT = (data) => {
    if (!data.metrics) return;
    
    const metrics = data.metrics;
    
    setHealthMetrics(prev => ({
      ...prev,
      steps: {
        ...prev.steps,
        current: metrics.steps?.latest?.value || prev.steps.current
      },
      heartRate: {
        current: metrics.heartRate?.latest?.value || prev.heartRate.current,
        resting: metrics.heartRate?.aggregates?.min || prev.heartRate.resting,
        zones: metrics.heartRate?.zones || prev.heartRate.zones
      },
      sleep: {
        hours: metrics.sleep?.duration?.value || prev.sleep.hours,
        quality: metrics.sleep?.quality?.value || prev.sleep.quality
      },
      calories: {
        ...prev.calories,
        burned: metrics.activeCalories?.latest?.value || prev.calories.burned
      },
      weight: {
        ...prev.weight,
        current: metrics.weight?.latest?.value || prev.weight.current
      },
      activity: {
        minutes: metrics.exerciseMinutes?.latest?.value || prev.activity.minutes,
        goal: 30
      }
    }));
  };

  // Calculate overall health score
  const calculateHealthScore = () => {
    const { steps, heartRate, sleep, water, calories, activity } = healthMetrics;
    
    // Activity Score (30% weight)
    const stepProgress = Math.min(100, (steps.current / steps.dailyGoal) * 100);
    const activityMinProgress = Math.min(100, (activity.minutes / activity.goal) * 100);
    const activityScore = (stepProgress * 0.6 + activityMinProgress * 0.4);
    
    // Nutrition Score (20% weight)
    const calorieBalance = Math.abs(calories.burned - calories.consumed) / calories.budget;
    const nutritionScore = Math.max(0, 100 - (calorieBalance * 100));
    
    // Sleep Score (25% weight)
    const sleepScore = sleep.hours >= 7 && sleep.hours <= 9 ? 100 : 
                      sleep.hours >= 6 && sleep.hours <= 10 ? 80 : 60;
    
    // Vitals Score (15% weight)
    const hrScore = heartRate.current > 0 && heartRate.current < 100 ? 100 : 70;
    const vitalsScore = hrScore; // Can add more vitals later
    
    // Consistency Score (10% weight) - Based on streak and regular data
    const consistencyScore = 85; // Placeholder - would track daily check-ins
    
    // Calculate weighted overall score
    const overall = Math.round(
      (activityScore * 0.30) +
      (nutritionScore * 0.20) +
      (sleepScore * 0.25) +
      (vitalsScore * 0.15) +
      (consistencyScore * 0.10)
    );
    
    // Calculate trend (compare with last week)
    const trend = 5; // Placeholder - would compare with historical data
    
    // Determine level based on score
    const level = Math.floor(overall / 10) + 1;
    
    setHealthScore({
      overall,
      components: {
        activity: Math.round(activityScore),
        nutrition: Math.round(nutritionScore),
        sleep: Math.round(sleepScore),
        vitals: Math.round(vitalsScore),
        consistency: Math.round(consistencyScore)
      },
      trend,
      level
    });
  };

  // Initialize data
  useEffect(() => {
    fetchUserGoals();
    fetchHealthMetrics();
    
    // Refresh every minute
    const interval = setInterval(() => {
      fetchHealthMetrics();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [userId]);

  // Format large numbers
  const formatLargeNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return {
    healthScore,
    healthMetrics,
    userGoals,
    formatLargeNumber
  };
};

// Export the enhanced cards for the landing page
export const OverallHealthScoreCard = () => {
  const { healthScore } = EnhancedLandingMetrics({ onNavigate: () => {} });
  
  const getHealthLevel = (score) => {
    if (score >= 90) return { name: 'Excellent', color: '#00FC14' };
    if (score >= 80) return { name: 'Great', color: '#10B981' };
    if (score >= 70) return { name: 'Good', color: '#F1C40F' };
    if (score >= 60) return { name: 'Fair', color: '#F59E0B' };
    return { name: 'Needs Attention', color: '#EF4444' };
  };
  
  const level = getHealthLevel(healthScore.overall);
  
  return (
    <div className="p-6 text-white shadow-lg bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold opacity-90">Overall Health Score</h3>
          <p className="text-sm opacity-70">Real-time health assessment</p>
        </div>
        <Heart className="w-8 h-8 opacity-50" />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-5xl font-bold">{healthScore.overall}%</div>
          <div className="flex items-center mt-2 space-x-2">
            <div className={`px-2 py-1 rounded-full text-xs font-medium`} 
                 style={{ backgroundColor: level.color + '33', color: level.color }}>
              {level.name}
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">+{healthScore.trend}% this week</span>
            </div>
          </div>
        </div>
        <div className="w-24 h-24">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart data={[{ value: healthScore.overall, fill: level.color }]}>
              <RadialBar 
                minAngle={15} 
                clockWise={true}
                dataKey="value" 
                cornerRadius={10} 
                fill={level.color}
                background={{ fill: 'rgba(255,255,255,0.1)' }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Mini component breakdown */}
      <div className="pt-4 mt-4 border-t border-white/20">
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(healthScore.components).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-xs capitalize opacity-70">{key}</div>
              <div className="text-sm font-semibold">{value}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const TodaysProgressCard = ({ onNavigate }) => {
  const { healthMetrics, userGoals, formatLargeNumber } = EnhancedLandingMetrics({ onNavigate });
  const goal = userGoals.primaryGoal;
  
  const getProgressColor = (current, goal) => {
    const percentage = (current / goal) * 100;
    if (percentage >= 100) return 'from-green-500 to-green-600';
    if (percentage >= 75) return 'from-blue-500 to-blue-600';
    if (percentage >= 50) return 'from-yellow-500 to-yellow-600';
    return 'from-orange-500 to-orange-600';
  };
  
  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Today's Progress</h3>
          <p className="text-sm text-gray-600">
            {goal?.name || 'Daily Wellness Goals'} {goal?.icon}
          </p>
        </div>
        <Target className="w-5 h-5 text-gray-400" />
      </div>
      
      {/* Show challenge progress if active */}
      {goal?.type === 'challenge' && (
        <div className="p-3 mb-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-900">Challenge Progress</span>
            <Flag className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-purple-900">
              {formatLargeNumber(goal.progress)}
            </span>
            <span className="text-sm text-purple-700">/ {formatLargeNumber(goal.total)}</span>
          </div>
          <div className="w-full h-2 mt-2 overflow-hidden bg-purple-200 rounded-full">
            <div 
              className="h-full transition-all duration-500 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
              style={{ width: `${(goal.progress / goal.total) * 100}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-purple-700">{goal.daysRemaining} days remaining</p>
        </div>
      )}
      
      <div className="space-y-4">
        {/* Steps Progress - Dynamic based on goal */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-blue-100 rounded">
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Steps</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {healthMetrics.steps.current.toLocaleString()} / {healthMetrics.steps.dailyGoal.toLocaleString()}
            </span>
          </div>
          <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
            <div 
              className={`h-full transition-all duration-500 rounded-full bg-gradient-to-r ${getProgressColor(healthMetrics.steps.current, healthMetrics.steps.dailyGoal)}`}
              style={{ width: `${Math.min(100, (healthMetrics.steps.current / healthMetrics.steps.dailyGoal) * 100)}%` }}
            />
          </div>
          {goal?.type === 'challenge' && (
            <p className="mt-1 text-xs text-gray-500">
              Daily target for challenge: {goal.daily.toLocaleString()} steps
            </p>
          )}
        </div>

        {/* Calories Progress - Show for weight loss plans */}
        {(goal?.type === 'plan' && goal?.calorieGoal) && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-orange-100 rounded">
                  <Zap className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Calories</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {healthMetrics.calories.burned} / {healthMetrics.calories.budget} kcal
              </span>
            </div>
            <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
              <div 
                className="h-full transition-all duration-500 rounded-full bg-gradient-to-r from-orange-500 to-orange-600"
                style={{ width: `${Math.min(100, (healthMetrics.calories.burned / healthMetrics.calories.budget) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Water Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-cyan-100 rounded">
                <Droplets className="w-4 h-4 text-cyan-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Water</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {healthMetrics.water.current} / {healthMetrics.water.goal} glasses
            </span>
          </div>
          <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
            <div 
              className="h-full transition-all duration-500 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600"
              style={{ width: `${(healthMetrics.water.current / healthMetrics.water.goal) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-3 mt-4 text-sm font-medium transition-colors rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 text-[#02276F]" 
           onClick={() => onNavigate('plans')}>
        View All Health Plans →
      </div>
    </div>
  );
};

export default EnhancedLandingMetrics;