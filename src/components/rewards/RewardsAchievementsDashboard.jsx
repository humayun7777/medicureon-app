// src/components/rewards/RewardsAchievementsDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Star,
  Gift,
  Target,
  Zap,
  Heart,
  Activity,
  Award,
  Crown,
  Medal,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Shield,
  Lock,
  Unlock,
  ChevronRight,
  ArrowLeft,
  Filter,
  Search,
  ShoppingCart,
  Users,
  MessageSquare,
  User,
  LogOut,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Flame,
  Diamond,
  Globe,
  Flag,
  ChevronDown,
  ChevronUp,
  Coins,
  FileText,
  CreditCard,
  BarChart3,
  IdCard
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { useMediCureOnData } from '../../hooks/useMediCureOnData';
import MediCureOnSidebar from '../common/MediCureOnSidebar';
import MediCureOnHeader from '../common/MediCureOnHeader';

const RewardsAchievementsDashboard = ({ onNavigate }) => {
  const { user, userInfo } = useAuth();
  const { 
    profilePicture, 
    getUserDisplayName,
    refreshAll
  } = useMediCureOnData();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showGlobalLeaderboard, setShowGlobalLeaderboard] = useState(false);

  // Mock data - would come from backend
  const [userData, setUserData] = useState({
    points: 2750,
    level: 12,
    levelName: 'Health Champion',
    nextLevelPoints: 3000,
    totalEarned: 15420,
    totalSpent: 12670,
    streak: 7,
    rank: 156,
    totalUsers: 10000,
    country: userInfo?.country || 'United States'
  });

  // Top 25 Global Achievers - Mock data
  const [globalTop25] = useState([
    { rank: 1, username: 'HealthMaster99', country: 'United States', points: 45230, level: 28, achievements: 142, profilePic: null, flag: '🇺🇸' },
    { rank: 2, username: 'FitLife2025', country: 'Pakistan', points: 42150, level: 26, achievements: 138, profilePic: null, flag: '🇵🇰' },
    { rank: 3, username: 'WellnessWarrior', country: 'United Kingdom', points: 39800, level: 25, achievements: 135, profilePic: null, flag: '🇬🇧' },
    { rank: 4, username: 'ActiveLife365', country: 'Australia', points: 38500, level: 24, achievements: 132, profilePic: null, flag: '🇦🇺' },
    { rank: 5, username: 'HealthyHabits', country: 'Germany', points: 37200, level: 23, achievements: 128, profilePic: null, flag: '🇩🇪' },
    { rank: 6, username: 'FitnessFirst', country: 'France', points: 36100, level: 23, achievements: 125, profilePic: null, flag: '🇫🇷' },
    { rank: 7, username: 'WellnessJourney', country: 'Japan', points: 35000, level: 22, achievements: 122, profilePic: null, flag: '🇯🇵' },
    { rank: 8, username: 'HealthGoals2025', country: 'South Korea', points: 34200, level: 22, achievements: 120, profilePic: null, flag: '🇰🇷' },
    { rank: 9, username: 'FitAndHealthy', country: 'Netherlands', points: 33400, level: 21, achievements: 118, profilePic: null, flag: '🇳🇱' },
    { rank: 10, username: 'ActiveLifestyle', country: 'Sweden', points: 32600, level: 21, achievements: 115, profilePic: null, flag: '🇸🇪' },
    { rank: 11, username: 'HealthyMind', country: 'India', points: 31800, level: 20, achievements: 112, profilePic: null, flag: '🇮🇳' },
    { rank: 12, username: 'FitnessJunkie', country: 'Brazil', points: 31000, level: 20, achievements: 110, profilePic: null, flag: '🇧🇷' },
    { rank: 13, username: 'WellbeingFirst', country: 'Spain', points: 30200, level: 19, achievements: 108, profilePic: null, flag: '🇪🇸' },
    { rank: 14, username: 'HealthyChoice', country: 'Italy', points: 29400, level: 19, achievements: 105, profilePic: null, flag: '🇮🇹' },
    { rank: 15, username: 'ActiveDaily', country: 'Mexico', points: 28600, level: 18, achievements: 102, profilePic: null, flag: '🇲🇽' },
    { rank: 16, username: 'FitForLife', country: 'Singapore', points: 27800, level: 18, achievements: 100, profilePic: null, flag: '🇸🇬' },
    { rank: 17, username: 'HealthMatters', country: 'Norway', points: 27000, level: 17, achievements: 98, profilePic: null, flag: '🇳🇴' },
    { rank: 18, username: 'WellnessPath', country: 'Denmark', points: 26200, level: 17, achievements: 95, profilePic: null, flag: '🇩🇰' },
    { rank: 19, username: 'FitnessGoals', country: 'Switzerland', points: 25400, level: 16, achievements: 92, profilePic: null, flag: '🇨🇭' },
    { rank: 20, username: 'HealthyLiving', country: 'Finland', points: 24600, level: 16, achievements: 90, profilePic: null, flag: '🇫🇮' },
    { rank: 21, username: 'ActiveMind', country: 'New Zealand', points: 23800, level: 15, achievements: 88, profilePic: null, flag: '🇳🇿' },
    { rank: 22, username: 'FitnessPro', country: 'Belgium', points: 23000, level: 15, achievements: 85, profilePic: null, flag: '🇧🇪' },
    { rank: 23, username: 'WellnessExpert', country: 'Austria', points: 22200, level: 14, achievements: 82, profilePic: null, flag: '🇦🇹' },
    { rank: 24, username: 'HealthyHero', country: 'Ireland', points: 21400, level: 14, achievements: 80, profilePic: null, flag: '🇮🇪' },
    { rank: 25, username: 'FitAndFab', country: 'Portugal', points: 20600, level: 13, achievements: 78, profilePic: null, flag: '🇵🇹' }
  ]);

  // Extreme Challenges - 10,000 points each
  const [challenges] = useState([
    {
      id: 1,
      name: 'Million Step Marathon',
      description: 'Walk 1,000,000 steps in 90 days - that\'s over 11,000 steps daily!',
      icon: '🏃‍♂️',
      points: 10000,
      duration: '90 days',
      progress: 342580,
      total: 1000000,
      startDate: '2025-01-01',
      endDate: '2025-03-31',
      participants: 1234,
      difficulty: 'extreme',
      gradient: 'from-purple-500 to-pink-500',
      active: true
    },
    {
      id: 2,
      name: 'Triple Threat Champion',
      description: 'Start 3 health plans and achieve all goals within 90 days',
      icon: '🏆',
      points: 10000,
      duration: '90 days',
      progress: 1,
      total: 3,
      startDate: '2025-01-15',
      endDate: '2025-04-15',
      participants: 892,
      difficulty: 'extreme',
      gradient: 'from-yellow-400 to-orange-500',
      active: true
    },
    {
      id: 3,
      name: 'Weight Loss Warrior',
      description: 'Lose 20kg (44lbs) in 6 months with healthy habits',
      icon: '⚖️',
      points: 10000,
      duration: '180 days',
      progress: 7.5,
      total: 20,
      startDate: '2025-01-01',
      endDate: '2025-06-30',
      participants: 567,
      difficulty: 'extreme',
      gradient: 'from-green-500 to-teal-500',
      active: true
    },
    {
      id: 4,
      name: '365 Day Streak',
      description: 'Log your health data every single day for an entire year',
      icon: '🔥',
      points: 10000,
      duration: '365 days',
      progress: 45,
      total: 365,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      participants: 2103,
      difficulty: 'extreme',
      gradient: 'from-red-500 to-orange-600',
      active: true
    },
    {
      id: 5,
      name: 'Meditation Master',
      description: 'Complete 500 meditation sessions of 20+ minutes each',
      icon: '🧘',
      points: 10000,
      duration: '180 days',
      progress: 127,
      total: 500,
      startDate: '2025-01-01',
      endDate: '2025-06-30',
      participants: 445,
      difficulty: 'extreme',
      gradient: 'from-indigo-500 to-purple-600',
      active: true
    },
    {
      id: 6,
      name: 'Hydration Hurricane',
      description: 'Drink 3L of water daily for 100 consecutive days',
      icon: '💧',
      points: 10000,
      duration: '100 days',
      progress: 32,
      total: 100,
      startDate: '2025-01-10',
      endDate: '2025-04-20',
      participants: 1567,
      difficulty: 'extreme',
      gradient: 'from-blue-500 to-cyan-500',
      active: true
    },
    {
      id: 7,
      name: 'Sleep Perfectionist',
      description: 'Get 7-9 hours of quality sleep for 180 nights',
      icon: '😴',
      points: 10000,
      duration: '180 days',
      progress: 42,
      total: 180,
      startDate: '2025-01-01',
      endDate: '2025-06-30',
      participants: 789,
      difficulty: 'extreme',
      gradient: 'from-purple-600 to-blue-600',
      active: true
    },
    {
      id: 8,
      name: 'Calorie Conqueror',
      description: 'Burn 500,000 calories through exercise activities',
      icon: '🔥',
      points: 10000,
      duration: '120 days',
      progress: 125000,
      total: 500000,
      startDate: '2025-01-01',
      endDate: '2025-04-30',
      participants: 923,
      difficulty: 'extreme',
      gradient: 'from-orange-500 to-red-600',
      active: true
    },
    {
      id: 9,
      name: 'Heart Rate Hero',
      description: 'Complete 300 cardio sessions with 30+ min in target zone',
      icon: '❤️',
      points: 10000,
      duration: '150 days',
      progress: 67,
      total: 300,
      startDate: '2025-01-01',
      endDate: '2025-05-31',
      participants: 334,
      difficulty: 'extreme',
      gradient: 'from-pink-500 to-rose-600',
      active: true
    },
    {
      id: 10,
      name: 'Nutrition Ninja',
      description: 'Log every meal with perfect macros for 90 days straight',
      icon: '🥗',
      points: 10000,
      duration: '90 days',
      progress: 28,
      total: 90,
      startDate: '2025-01-15',
      endDate: '2025-04-15',
      participants: 445,
      difficulty: 'extreme',
      gradient: 'from-green-600 to-lime-500',
      active: true
    },
    {
      id: 11,
      name: 'Community Champion',
      description: 'Help 100 community members achieve their health goals',
      icon: '🤝',
      points: 10000,
      duration: '120 days',
      progress: 23,
      total: 100,
      startDate: '2025-01-01',
      endDate: '2025-04-30',
      participants: 178,
      difficulty: 'extreme',
      gradient: 'from-teal-500 to-blue-600',
      active: true
    },
    {
      id: 12,
      name: 'Ultimate Transformation',
      description: 'Complete all 10 health plans with 100% success rate',
      icon: '🌟',
      points: 10000,
      duration: '365 days',
      progress: 2,
      total: 10,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      participants: 89,
      difficulty: 'legendary',
      gradient: 'from-yellow-500 via-purple-500 to-pink-500',
      active: true
    }
  ]);

  const [achievements, setAchievements] = useState([
    // Unlocked Achievements
    { id: 1, name: 'First Steps', description: 'Complete your first 5,000 steps', category: 'activity', icon: '🚶', points: 50, earned: true, earnedDate: '2025-01-15', rarity: 'common' },
    { id: 2, name: 'Hydration Hero', description: 'Drink 8 glasses of water for 7 days straight', category: 'nutrition', icon: '💧', points: 100, earned: true, earnedDate: '2025-01-18', rarity: 'common' },
    { id: 3, name: 'Early Bird', description: 'Log morning activity for 30 days', category: 'activity', icon: '🌅', points: 200, earned: true, earnedDate: '2025-01-20', rarity: 'rare' },
    { id: 4, name: 'Weight Warrior', description: 'Lose your first 5kg', category: 'weight', icon: '⚖️', points: 300, earned: true, earnedDate: '2025-01-22', rarity: 'rare' },
    { id: 5, name: 'Community Helper', description: 'Help 10 community members', category: 'social', icon: '🤝', points: 150, earned: true, earnedDate: '2025-01-23', rarity: 'uncommon' },
    
    // Locked Achievements
    { id: 6, name: 'Marathon Walker', description: 'Walk 100,000 steps in a month', category: 'activity', icon: '🏃', points: 500, earned: false, progress: 67500, total: 100000, rarity: 'epic' },
    { id: 7, name: 'Calorie Master', description: 'Stay within calorie budget for 60 days', category: 'nutrition', icon: '🔥', points: 400, earned: false, progress: 22, total: 60, rarity: 'rare' },
    { id: 8, name: 'Sleep Champion', description: 'Get 7+ hours of sleep for 30 nights', category: 'wellness', icon: '😴', points: 250, earned: false, progress: 18, total: 30, rarity: 'uncommon' },
    { id: 9, name: 'Meditation Master', description: 'Complete 100 meditation sessions', category: 'wellness', icon: '🧘', points: 350, earned: false, progress: 45, total: 100, rarity: 'rare' },
    { id: 10, name: 'Elite Achiever', description: 'Unlock 50 achievements', category: 'special', icon: '🏆', points: 1000, earned: false, progress: 5, total: 50, rarity: 'legendary' }
  ]);

  const [rewards, setRewards] = useState([
    { id: 1, name: 'Premium Health Consultation', description: '30-min session with certified nutritionist', cost: 500, category: 'consultation', icon: '👨‍⚕️', available: true },
    { id: 2, name: 'Smart Scale Pro', description: 'Advanced body composition analyzer', cost: 2000, category: 'device', icon: '⚖️', available: true, discount: 20 },
    { id: 3, name: '1 Month Premium Aman Access', description: 'Unlock all Aman features', cost: 300, category: 'subscription', icon: '🤖', available: true },
    { id: 4, name: 'Organic Supplement Pack', description: '30-day supply of vitamins', cost: 800, category: 'product', icon: '💊', available: true },
    { id: 5, name: 'Charity Donation', description: 'Donate to health research', cost: 100, category: 'charity', icon: '❤️', available: true },
    { id: 6, name: 'Exclusive Badge Pack', description: 'Rare profile badges', cost: 1500, category: 'cosmetic', icon: '🎖️', available: false },
    { id: 7, name: 'Fitness Tracker Band', description: 'Track your daily activities', cost: 1200, category: 'device', icon: '⌚', available: true },
    { id: 8, name: 'Meal Plan Guide', description: 'Personalized nutrition plan', cost: 400, category: 'consultation', icon: '📋', available: true }
  ]);

  const [pointsHistory, setPointsHistory] = useState([
    { date: '2025-01-23', description: 'Daily login bonus', points: 10, type: 'earned' },
    { date: '2025-01-23', description: 'Completed 5000 steps', points: 25, type: 'earned' },
    { date: '2025-01-22', description: 'Achievement: Weight Warrior', points: 300, type: 'earned' },
    { date: '2025-01-21', description: 'Redeemed: Health Consultation', points: -500, type: 'spent' },
    { date: '2025-01-20', description: 'Weekly streak bonus', points: 100, type: 'earned' }
  ]);

  const displayName = getUserDisplayName();

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All', icon: '🎯' },
    { id: 'activity', name: 'Activity', icon: '🏃' },
    { id: 'nutrition', name: 'Nutrition', icon: '🥗' },
    { id: 'weight', name: 'Weight Loss', icon: '⚖️' },
    { id: 'wellness', name: 'Wellness', icon: '🧘' },
    { id: 'social', name: 'Community', icon: '🤝' },
    { id: 'special', name: 'Special', icon: '🏆' }
  ];

  // Rarity colors
  const rarityColors = {
    common: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
    uncommon: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
    rare: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
    epic: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
    legendary: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' }
  };

  // Filter achievements
  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  // Calculate stats
  const earnedAchievements = achievements.filter(a => a.earned).length;
  const totalAchievements = achievements.length;
  const completionRate = Math.round((earnedAchievements / totalAchievements) * 100);

  // Points chart data
  const pointsChartData = [
    { name: 'Mon', points: 120 },
    { name: 'Tue', points: 180 },
    { name: 'Wed', points: 150 },
    { name: 'Thu', points: 250 },
    { name: 'Fri', points: 190 },
    { name: 'Sat', points: 220 },
    { name: 'Sun', points: 300 }
  ];

  // Top countries for leaderboard
  const topCountries = [
    { rank: 1, country: 'United States', region: 'North America', flag: '🇺🇸', totalPoints: 452300 },
    { rank: 2, country: 'Canada', region: 'North America', flag: '🇨🇦', totalPoints: 421500 },
    { rank: 3, country: 'Pakistan', region: 'Asia', flag: '🇵🇰', totalPoints: 398000 },
    { rank: 4, country: 'Australia', region: 'Oceania', flag: '🇦🇺', totalPoints: 385000 },
    { rank: 5, country: 'Germany', region: 'Europe', flag: '🇩🇪', totalPoints: 372000 },
    { rank: 6, country: 'France', region: 'Europe', flag: '🇫🇷', totalPoints: 361000 },
    { rank: 7, country: 'Japan', region: 'Asia', flag: '🇯🇵', totalPoints: 350000 },
    { rank: 8, country: 'South Korea', region: 'Asia', flag: '🇰🇷', totalPoints: 342000 },
    { rank: 9, country: 'Netherlands', region: 'Europe', flag: '🇳🇱', totalPoints: 334000 },
    { rank: 10, country: 'Sweden', region: 'Europe', flag: '🇸🇪', totalPoints: 326000 }
  ];

  // Custom badges for header
  const customBadges = [
    {
      text: `${userData.points.toLocaleString()} MediCoins`,
      className: "flex items-center px-3 py-1.5 bg-[#F1C40F]/20 backdrop-blur-sm rounded-full border border-[#F1C40F]/30",
      icon: () => <Trophy className="w-3 h-3 text-[#F1C40F] mr-1.5" />
    },
    {
      text: `Level ${userData.level}`,
      className: "flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full",
      icon: () => <Crown className="w-3 h-3 text-white mr-1.5" />
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Use centralized sidebar */}
      <MediCureOnSidebar 
        onNavigate={onNavigate} 
        activePage="rewards"
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Use centralized header */}
        <MediCureOnHeader
          title="Rewards & Achievements"
          subtitle="Celebrate your health milestones and earn rewards"
          customBadges={customBadges}
          showRefresh={true}
          onRefresh={refreshAll}
        />

        {/* Tabs */}
        <div className="px-6 pt-6">
          <div className="flex space-x-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 px-1 font-medium transition-all ${
                activeTab === 'overview'
                  ? 'text-[#02276F] border-b-2 border-[#02276F]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`pb-3 px-1 font-medium transition-all ${
                activeTab === 'achievements'
                  ? 'text-[#02276F] border-b-2 border-[#02276F]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Achievements
            </button>
            <button
              onClick={() => setActiveTab('rewards')}
              className={`pb-3 px-1 font-medium transition-all ${
                activeTab === 'rewards'
                  ? 'text-[#02276F] border-b-2 border-[#02276F]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Rewards Catalog
            </button>
            <button
              onClick={() => setActiveTab('challenges')}
              className={`pb-3 px-1 font-medium transition-all flex items-center space-x-2 ${
                activeTab === 'challenges'
                  ? 'text-[#02276F] border-b-2 border-[#02276F]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Challenges</span>
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`pb-3 px-1 font-medium transition-all flex items-center space-x-2 ${
                activeTab === 'leaderboard'
                  ? 'text-[#02276F] border-b-2 border-[#02276F]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Global Top 25</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-3 px-1 font-medium transition-all ${
                activeTab === 'history'
                  ? 'text-[#02276F] border-b-2 border-[#02276F]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Points History
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                {/* Current Points */}
                <div className="p-6 text-white bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <Trophy className="w-8 h-8 opacity-50" />
                    <span className="text-sm opacity-80">Available</span>
                  </div>
                  <p className="text-3xl font-bold">{userData.points.toLocaleString()}</p>
                  <p className="text-sm opacity-80">MediCoins</p>
                </div>

                {/* Level Progress */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <Crown className="w-6 h-6 text-purple-500" />
                    <span className="text-sm text-gray-600">Level {userData.level}</span>
                  </div>
                  <p className="mb-2 text-lg font-semibold text-gray-900">{userData.levelName}</p>
                  <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full">
                    <div 
                      className="h-full transition-all duration-500 rounded-full bg-gradient-to-r from-purple-500 to-purple-600"
                      style={{ width: `${(userData.points / userData.nextLevelPoints) * 100}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{userData.nextLevelPoints - userData.points} points to level {userData.level + 1}</p>
                </div>

                {/* Achievements Progress */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <Award className="w-6 h-6 text-blue-500" />
                    <span className="text-sm text-gray-600">{completionRate}%</span>
                  </div>
                  <p className="mb-2 text-lg font-semibold text-gray-900">{earnedAchievements}/{totalAchievements}</p>
                  <p className="text-sm text-gray-600">Achievements Unlocked</p>
                </div>

                {/* Current Streak */}
                <div className="p-6 text-white bg-gradient-to-br from-orange-400 to-red-500 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <Flame className="w-8 h-8 opacity-50" />
                    <span className="text-sm opacity-80">Streak</span>
                  </div>
                  <p className="text-3xl font-bold">{userData.streak}</p>
                  <p className="text-sm opacity-80">Days Active</p>
                </div>
              </div>

              {/* Points Earning Chart */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">Points Earned This Week</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={pointsChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip />
                      <Bar dataKey="points" fill="#F1C40F" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-3 text-center rounded-lg bg-gray-50">
                      <p className="text-2xl font-bold text-gray-900">1,410</p>
                      <p className="text-sm text-gray-600">This Week</p>
                    </div>
                    <div className="p-3 text-center rounded-lg bg-gray-50">
                      <p className="text-2xl font-bold text-gray-900">5,230</p>
                      <p className="text-sm text-gray-600">This Month</p>
                    </div>
                  </div>
                </div>

                {/* Quick Leaderboard Preview */}
                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Your Global Ranking</h3>
                    <button 
                      onClick={() => setActiveTab('leaderboard')}
                      className="text-sm text-[#02276F] hover:underline"
                    >
                      View Top 25 →
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 mb-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 font-bold text-white rounded-full bg-gradient-to-r from-yellow-400 to-orange-500">
                        {userData.rank}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Your Rank</p>
                        <p className="text-sm text-gray-600">Top {Math.round((userData.rank / userData.totalUsers) * 100)}% of users</p>
                      </div>
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  
                  <div className="space-y-3">
                    {globalTop25.slice(0, 3).map((user) => (
                      <div key={user.rank} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-bold">
                            {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{user.username}</span>
                            <span className="text-xl">{user.flag}</span>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{user.points.toLocaleString()} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Achievements Showcase */}
              <div className="p-6 bg-white shadow-sm rounded-xl">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Achievements</h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {achievements.filter(a => a.earned).slice(0, 4).map((achievement) => (
                    <div key={achievement.id} className="text-center">
                      <div className="relative inline-block mb-3">
                        <div className={`w-20 h-20 flex items-center justify-center rounded-full ${rarityColors[achievement.rarity].bg} ${rarityColors[achievement.rarity].border} border-2`}>
                          <span className="text-3xl">{achievement.icon}</span>
                        </div>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-[#02276F] text-white text-xs rounded-full">
                          +{achievement.points}
                        </div>
                      </div>
                      <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                      <p className="text-xs text-gray-500">{achievement.earnedDate}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="space-y-6">
              {/* Global Stats Header */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="p-6 bg-gradient-to-br from-[#02276F] to-[#033A8E] rounded-xl text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Globe className="w-8 h-8 opacity-50" />
                    <span className="text-sm opacity-80">Global</span>
                  </div>
                  <p className="text-3xl font-bold">{userData.totalUsers.toLocaleString()}</p>
                  <p className="text-sm opacity-80">Active Users Worldwide</p>
                </div>

                <div className="p-6 bg-white shadow-sm rounded-xl">
                  <h4 className="mb-4 text-lg font-semibold text-gray-900">Top 10 Countries</h4>
                  <div className="space-y-2 max-h-[120px] overflow-y-auto">
                    {topCountries.slice(0, 10).map((country) => (
                      <div key={country.rank} className="flex items-center justify-between p-2 transition-colors rounded-lg bg-gray-50 hover:bg-gray-100">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-bold text-gray-600">#{country.rank}</span>
                          <span className="text-xl">{country.flag}</span>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{country.country}</p>
                            <p className="text-xs text-gray-500">{country.region}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-[#02276F]">{(country.totalPoints / 1000).toFixed(1)}K</p>
                          <p className="text-xs text-gray-500">points</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 text-white bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <Trophy className="w-8 h-8 opacity-50" />
                    <span className="text-sm opacity-80">Total</span>
                  </div>
                  <p className="text-3xl font-bold">2.5M+</p>
                  <p className="text-sm opacity-80">Points Earned Globally</p>
                </div>
              </div>

              {/* Top 25 Leaderboard */}
              <div className="overflow-hidden bg-white shadow-sm rounded-xl">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Global Top 25 Health Champions</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Updated</span>
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">5 mins ago</span>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-200 bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Rank</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">User</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Country</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">Level</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">Achievements</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Points</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {globalTop25.map((user) => (
                        <tr key={user.rank} className={`hover:bg-gray-50 transition-colors ${user.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-transparent' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {user.rank === 1 && <span className="mr-2 text-2xl">🥇</span>}
                              {user.rank === 2 && <span className="mr-2 text-2xl">🥈</span>}
                              {user.rank === 3 && <span className="mr-2 text-2xl">🥉</span>}
                              {user.rank > 3 && (
                                <span className="mr-2 text-lg font-bold text-gray-700">#{user.rank}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 w-10 h-10">
                                <div className="flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full">
                                  <User className="w-5 h-5 text-gray-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.username}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">{user.flag}</span>
                              <span className="text-sm text-gray-600">{user.country}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Lvl {user.level}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center space-x-1">
                              <Trophy className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm font-medium text-gray-900">{user.achievements}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <span className="text-lg font-bold text-[#02276F]">{user.points.toLocaleString()}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Your Position */}
              {userData.rank > 25 && (
                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <h4 className="mb-4 text-lg font-semibold text-gray-900">Your Position</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-16 h-16 text-xl font-bold text-white rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                        {userData.rank}
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900">{displayName}</p>
                        <p className="text-sm text-gray-600">Keep going! You're {globalTop25[24].points - userData.points} points away from Top 25</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#02276F]">{userData.points.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Total Points</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-6">
              {/* Category Filter */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2 overflow-x-auto">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                        selectedCategory === category.id
                          ? 'bg-[#02276F] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                    </button>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {filteredAchievements.filter(a => a.earned).length}/{filteredAchievements.length} Unlocked
                  </span>
                </div>
              </div>

              {/* Achievements Grid - Changed to 4 columns */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {filteredAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`relative p-4 rounded-xl transition-all ${
                      achievement.earned
                        ? 'bg-white shadow-sm hover:shadow-md'
                        : 'bg-gray-50 opacity-75'
                    }`}
                  >
                    {/* Rarity Badge */}
                    <div className={`absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-xs font-medium ${rarityColors[achievement.rarity].bg} ${rarityColors[achievement.rarity].text}`}>
                      {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <div className={`relative w-16 h-16 flex items-center justify-center rounded-full mb-3 ${
                        achievement.earned
                          ? `${rarityColors[achievement.rarity].bg} ${rarityColors[achievement.rarity].border} border-2`
                          : 'bg-gray-200'
                      }`}>
                        <span className="text-2xl">{achievement.icon}</span>
                        {!achievement.earned && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                            <Lock className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <h4 className="mb-1 text-sm font-semibold text-gray-900">{achievement.name}</h4>
                      <p className="mb-2 text-xs text-gray-600">{achievement.description}</p>
                      
                      {achievement.earned ? (
                        <div>
                          <span className="text-xs text-gray-500">Earned {achievement.earnedDate}</span>
                          <p className="mt-1 font-semibold text-[#02276F]">+{achievement.points}</p>
                        </div>
                      ) : (
                        <div className="w-full mt-2">
                          <div className="flex justify-between mb-1 text-xs text-gray-500">
                            <span>Progress</span>
                            <span>{Math.round((achievement.progress / achievement.total) * 100)}%</span>
                          </div>
                          <div className="w-full h-1.5 overflow-hidden bg-gray-200 rounded-full">
                            <div
                              className="h-full bg-gradient-to-r from-[#02276F] to-[#F1C40F] rounded-full transition-all duration-500"
                              style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="space-y-6">
              {/* Rewards Filter */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-[#02276F] text-white rounded-lg font-medium">
                    All Rewards
                  </button>
                  <button className="px-4 py-2 font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                    Consultations
                  </button>
                  <button className="px-4 py-2 font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                    Products
                  </button>
                  <button className="px-4 py-2 font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                    Premium Features
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  Balance: <span className="font-semibold text-[#02276F]">{userData.points.toLocaleString()} MediCoins</span>
                </div>
              </div>

              {/* Rewards Grid - Changed to 4 columns */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {rewards.map((reward) => (
                  <div
                    key={reward.id}
                    className={`relative bg-white rounded-xl shadow-sm overflow-hidden ${
                      reward.available && userData.points >= reward.cost
                        ? 'hover:shadow-lg transition-shadow cursor-pointer'
                        : 'opacity-75'
                    }`}
                  >
                    {reward.discount && (
                      <div className="absolute z-10 px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full top-2 left-2">
                        -{reward.discount}%
                      </div>
                    )}

                    <div className="p-4">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
                        <span className="text-2xl">{reward.icon}</span>
                      </div>
                      
                      <h4 className="mb-1 text-sm font-semibold text-center text-gray-900">{reward.name}</h4>
                      <p className="mb-3 text-xs text-center text-gray-600">{reward.description}</p>
                      
                      <div className="flex flex-col items-center">
                        <div className="mb-2">
                          {reward.discount ? (
                            <div className="flex items-baseline space-x-2">
                              <span className="text-lg font-bold text-[#02276F]">
                                {Math.round(reward.cost * (1 - reward.discount / 100))}
                              </span>
                              <span className="text-sm text-gray-500 line-through">{reward.cost}</span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-[#02276F]">{reward.cost}</span>
                          )}
                          <span className="ml-1 text-xs text-gray-500">coins</span>
                        </div>
                        
                        <button
                          className={`w-full px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            reward.available && userData.points >= reward.cost
                              ? 'bg-[#02276F] text-white hover:opacity-90'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                          disabled={!reward.available || userData.points < reward.cost}
                        >
                          {!reward.available ? 'Unavailable' : userData.points < reward.cost ? 'Insufficient' : 'Redeem'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Special Offers */}
              <div className="p-6 text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="mb-2 text-xl font-bold">Limited Time Offer! 🎉</h3>
                    <p className="opacity-90">Double points on all health activities this week</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-80">Ends in</p>
                    <p className="text-2xl font-bold">2d 14h 32m</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'challenges' && (
            <div className="space-y-6">
              {/* Challenges Header */}
              <div className="text-center">
                <h2 className="mb-2 text-2xl font-bold text-gray-900">Extreme Health Challenges</h2>
                <p className="text-gray-600">Push your limits and earn 10,000 points per challenge!</p>
              </div>

              {/* Active Challenges Summary */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-700">Active Challenges</p>
                      <p className="text-2xl font-bold text-purple-900">{challenges.filter(c => c.active).length}</p>
                    </div>
                    <Zap className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-700">Total Participants</p>
                      <p className="text-2xl font-bold text-orange-900">{challenges.reduce((sum, c) => sum + c.participants, 0).toLocaleString()}</p>
                    </div>
                    <Users className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-green-100 to-teal-100 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-700">Your Progress</p>
                      <p className="text-2xl font-bold text-green-900">3/12</p>
                    </div>
                    <Trophy className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-700">Potential Points</p>
                      <p className="text-2xl font-bold text-indigo-900">120K</p>
                    </div>
                    <Star className="w-8 h-8 text-indigo-500" />
                  </div>
                </div>
              </div>

              {/* Challenges Grid - Changed to 4 columns */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {challenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="relative overflow-hidden transition-all duration-300 transform bg-white shadow-lg rounded-xl hover:shadow-xl hover:scale-105"
                  >
                    {/* Gradient Header */}
                    <div className={`h-24 bg-gradient-to-br ${challenge.gradient} relative`}>
                      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                      <div className="absolute top-2 left-2">
                        <span className="text-2xl">{challenge.icon}</span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <div className="px-2 py-0.5 bg-white rounded-full bg-opacity-20 backdrop-blur-md">
                          <span className="text-xs font-bold text-white uppercase">
                            {challenge.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <h3 className="text-sm font-bold text-white">{challenge.name}</h3>
                        <div className="flex items-center space-x-1 text-xs text-white">
                          <Clock className="w-3 h-3" />
                          <span>{challenge.duration}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <p className="mb-3 text-xs text-gray-600 line-clamp-2">{challenge.description}</p>
                      
                      {/* Progress */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-700">Progress</span>
                          <span className="text-xs font-bold text-gray-900">
                            {((challenge.progress / challenge.total) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full">
                          <div
                            className={`h-full bg-gradient-to-r ${challenge.gradient} transition-all duration-500`}
                            style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-1 text-gray-600">
                          <Users className="w-3 h-3" />
                          <span className="text-xs">{challenge.participants.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                         <Trophy className="w-3 h-3 text-yellow-500" />
                         <span className="text-sm font-bold text-gray-900">{challenge.points.toLocaleString()}</span>
                       </div>
                     </div>

                     {/* Action Button */}
                     <button className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all bg-gradient-to-r ${challenge.gradient} text-white hover:opacity-90 transform hover:scale-105`}>
                       {challenge.progress > 0 ? 'Continue' : 'Start'}
                     </button>
                   </div>
                 </div>
               ))}
             </div>

             {/* Motivational Section */}
             <div className="p-6 mt-8 text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
               <div className="flex items-center justify-between">
                 <div>
                   <h3 className="mb-2 text-xl font-bold">Ready for the Ultimate Challenge? 💪</h3>
                   <p className="opacity-90">
                     Complete any challenge to join the elite club of health champions and earn massive rewards!
                   </p>
                 </div>
                 <div className="hidden lg:block">
                   <Diamond className="w-24 h-24 opacity-20" />
                 </div>
               </div>
             </div>
           </div>
         )}

         {activeTab === 'history' && (
           <div className="space-y-6">
             {/* Summary Cards */}
             <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
               <div className="p-6 bg-white shadow-sm rounded-xl">
                 <div className="flex items-center justify-between mb-2">
                   <h4 className="font-medium text-gray-700">Total Earned</h4>
                   <TrendingUp className="w-5 h-5 text-green-500" />
                 </div>
                 <p className="text-2xl font-bold text-gray-900">{userData.totalEarned.toLocaleString()}</p>
                 <p className="text-sm text-gray-500">Lifetime points</p>
               </div>
               
               <div className="p-6 bg-white shadow-sm rounded-xl">
                 <div className="flex items-center justify-between mb-2">
                   <h4 className="font-medium text-gray-700">Total Spent</h4>
                   <ShoppingCart className="w-5 h-5 text-red-500" />
                 </div>
                 <p className="text-2xl font-bold text-gray-900">{userData.totalSpent.toLocaleString()}</p>
                 <p className="text-sm text-gray-500">On rewards</p>
               </div>
               
               <div className="p-6 bg-white shadow-sm rounded-xl">
                 <div className="flex items-center justify-between mb-2">
                   <h4 className="font-medium text-gray-700">Current Balance</h4>
                   <Coins className="w-5 h-5 text-yellow-500" />
                 </div>
                 <p className="text-2xl font-bold text-gray-900">{userData.points.toLocaleString()}</p>
                 <p className="text-sm text-gray-500">Available to spend</p>
               </div>
             </div>

             {/* Transaction History */}
             <div className="bg-white shadow-sm rounded-xl">
               <div className="p-6 border-b border-gray-200">
                 <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
               </div>
               
               <div className="divide-y divide-gray-200">
                 {pointsHistory.map((transaction, index) => (
                   <div key={index} className="p-6 transition-colors hover:bg-gray-50">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-4">
                         <div className={`p-2 rounded-full ${
                           transaction.type === 'earned' ? 'bg-green-100' : 'bg-red-100'
                         }`}>
                           {transaction.type === 'earned' ? (
                             <TrendingUp className={`w-5 h-5 text-green-600`} />
                           ) : (
                             <TrendingDown className={`w-5 h-5 text-red-600`} />
                           )}
                         </div>
                         <div>
                           <p className="font-medium text-gray-900">{transaction.description}</p>
                           <p className="text-sm text-gray-500">{transaction.date}</p>
                         </div>
                       </div>
                       <span className={`font-semibold ${
                         transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                       }`}>
                         {transaction.type === 'earned' ? '+' : ''}{transaction.points}
                       </span>
                     </div>
                   </div>
                 ))}
               </div>
               
               <div className="p-4 text-center border-t border-gray-200">
                 <button className="text-sm font-medium text-[#02276F] hover:underline">
                   Load More Transactions
                 </button>
               </div>
             </div>
           </div>
         )}
       </div>
     </div>
   </div>
 );
};

export default RewardsAchievementsDashboard;