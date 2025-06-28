// src/components/community/CommunityHub.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Users, User, MessageSquare, Heart, Star, Shield, Crown, Award, Send, Search, Bell,
  Lock, Hash, AtSign, Smile, Paperclip, MoreVertical, Circle, Sparkles, Trophy,
  Zap, MessageCircle, Video, Phone, Flag, Mic, MicOff, ArrowLeft, Plus, Check,
  Info, Gift, Flame, Brain, Activity, Stethoscope, HeartHandshake, UserCheck,
  Dot, ChevronDown, ChevronRight, AlertCircle, HelpCircle, Verified, BadgeCheck,
  Leaf, BookOpen, Calendar, ThumbsUp, Reply, MoreHorizontal, Settings, Filter,
  X, Pin, VolumeX, Volume2, Clock, Timer, Coffee, Target, TrendingUp,
  Heart as HeartIcon, Droplets, Apple, Moon, Wind, Sun, Dumbbell, Baby,
  Flower2, RefreshCw, ShieldCheck, Lightbulb, ChefHat, Soup, Sparkle,
  TreePine, Waves, Mountain, Feather, Gem, Eye, Headphones, Briefcase,
  GraduationCap, Stethoscope as StethoscopeIcon, Medal, UserPlus, Share2,
  Bookmark, Camera, PlayCircle, PauseCircle, Users2, Building2, Globe,
  CheckCircle2, XCircle, AlertTriangle, Zap as ZapIcon, Edit3, Trash2, FileText, BarChart3
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useMediCureOnData } from '../../hooks/useMediCureOnData';
import MediCureOnSidebar from '../common/MediCureOnSidebar';

const CommunityHub = ({ onNavigate }) => {
  const { user, userInfo } = useAuth();
  const { 
    profilePicture, 
    getUserDisplayName,
    userSubscription,
    activePlans,
    profileData
  } = useMediCureOnData();

  const [selectedChannel, setSelectedChannel] = useState(null);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showChannelInfo, setShowChannelInfo] = useState(false);
  const [activeTypers, setActiveTypers] = useState([]);
  const [messageReactions, setMessageReactions] = useState({});
  const [editingMessage, setEditingMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const [showPollCreator, setShowPollCreator] = useState(false);

  const displayName = getUserDisplayName();
  const userGender = profileData?.gender || 'unspecified';

  // Health Plan Channels - All 10 plans
  const healthPlanChannels = [
    {
      id: 'weight-loss-excellence',
      name: 'Weight Loss Excellence',
      icon: '⚖️',
      description: 'Scientific weight management and lifestyle transformation',
      members: 2456,
      online: 342,
      category: 'health-plans',
      locked: false,
      planRequired: 'weight-loss',
      color: 'emerald',
      lastMessage: 'Dr. Martinez: New study on intermittent fasting benefits',
      lastMessageTime: '2m ago',
      unread: 5,
      expertPresent: true,
      weeklyGoal: 'Lose 1-2 lbs safely'
    },
    {
      id: 'diabetes-blood-sugar',
      name: 'Diabetes & Blood Sugar Control',
      icon: '🩸',
      description: 'Comprehensive diabetes management and prevention',
      members: 1834,
      online: 267,
      category: 'health-plans',
      locked: false,
      planRequired: 'diabetic-care',
      color: 'orange',
      lastMessage: 'Celebrating: John\'s A1C dropped to 6.5!',
      lastMessageTime: '5m ago',
      unread: 3,
      monitoringActive: true,
      avgA1C: '6.8'
    },
    {
      id: 'heart-health-excellence',
      name: 'Heart Health Excellence',
      icon: '❤️',
      description: 'Cardiovascular wellness and recovery support',
      members: 1923,
      online: 298,
      category: 'health-plans',
      locked: false,
      planRequired: 'cardiac-wellness',
      color: 'rose',
      lastMessage: 'Dr. Chen: Remember your daily BP monitoring',
      lastMessageTime: '8m ago',
      unread: 0,
      emergencySupport: true,
      avgBPReduction: '15%'
    },
    {
      id: 'sleep-optimization',
      name: 'Sleep Optimization Program',
      icon: '😴',
      description: 'Advanced sleep therapy and circadian rhythm management',
      members: 1567,
      online: 89,
      category: 'health-plans',
      locked: false,
      planRequired: 'sleep-wellness',
      color: 'indigo',
      lastMessage: 'Tonight: Guided sleep meditation at 9 PM',
      lastMessageTime: '15m ago',
      unread: 2,
      avgSleepImprovement: '+2.3 hrs'
    },
    {
      id: 'stress-mental-wellness',
      name: 'Stress & Mental Wellness',
      icon: '🧠',
      description: 'Mental health support with licensed therapists',
      members: 2103,
      online: 412,
      category: 'health-plans',
      locked: false,
      planRequired: 'mental-wellness',
      color: 'purple',
      lastMessage: 'Safe space sharing circle starting soon',
      lastMessageTime: '3m ago',
      unread: 0,
      moderatorPresent: true,
      safeSpace: true,
      therapistOnCall: true
    },
    {
      id: 'nutrition-hydration-pro',
      name: 'Nutrition & Hydration Pro',
      icon: '🥗',
      description: 'Personalized nutrition plans and hydration tracking',
      members: 2987,
      online: 523,
      category: 'health-plans',
      locked: false,
      planRequired: 'nutrition-plan',
      color: 'lime',
      lastMessage: 'Nutritionist Anna: Meal prep Sunday tips!',
      lastMessageTime: '6m ago',
      unread: 8,
      mealPlansShared: 156
    },
    {
      id: 'respiratory-fitness',
      name: 'Respiratory Fitness Master',
      icon: '🫁',
      description: 'Breathing exercises and lung health optimization',
      members: 892,
      online: 134,
      category: 'health-plans',
      locked: false,
      planRequired: 'respiratory-health',
      color: 'sky',
      lastMessage: 'Live: Pranayama breathing session',
      lastMessageTime: '1m ago',
      unread: 1,
      o2Improvement: '+8%'
    },
    {
      id: 'womens-health-complete',
      name: 'Women\'s Health Complete',
      icon: '👩‍⚕️',
      description: 'Comprehensive women\'s health and wellness support',
      members: 3456,
      online: 678,
      category: 'health-plans',
      locked: false,
      planRequired: 'womens-health',
      color: 'pink',
      lastMessage: 'Dr. Sarah: Hormonal balance workshop tomorrow',
      lastMessageTime: '12m ago',
      unread: 15,
      genderRestricted: 'female',
      expertPanel: true
    },
    {
      id: 'recovery-rehabilitation',
      name: 'Recovery & Rehabilitation',
      icon: '🔄',
      description: 'Post-surgery and injury recovery programs',
      members: 1234,
      online: 198,
      category: 'health-plans',
      locked: false,
      planRequired: 'surgery-recovery',
      color: 'amber',
      lastMessage: 'PT Mike: Daily stretching routine posted',
      lastMessageTime: '20m ago',
      unread: 4,
      recoveryRate: '94%'
    },
    {
      id: 'total-health-prevention',
      name: 'Total Health Prevention',
      icon: '🛡️',
      description: 'Preventive care and longevity optimization',
      members: 4567,
      online: 789,
      category: 'health-plans',
      locked: false,
      planRequired: 'preventive-care',
      color: 'teal',
      lastMessage: 'Annual health screening reminders sent',
      lastMessageTime: '30m ago',
      unread: 2,
      preventionScore: '92/100'
    }
  ];

  // Community Channels - Alternative Healing Focus
  const communityChannels = [
    {
      id: 'traditional-remedies',
      name: 'Traditional Family Remedies',
      icon: '🌿',
      description: 'Share grandma\'s recipes and time-tested healing methods',
      members: 3456,
      online: 567,
      category: 'community',
      locked: false,
      color: 'green',
      lastMessage: 'Maria: My abuela\'s cold remedy works wonders!',
      lastMessageTime: '4m ago',
      unread: 12,
      trending: true    },
    {
      id: 'islamic-wellness',
      name: 'Islamic Wellness & Healing',
      icon: '☪️',
      description: 'Traditional Islamic healing practices and prophetic medicine',
      members: 2103,
      online: 342,
      category: 'community',
      locked: false,
      color: 'orange',
      lastMessage: 'Dr. Amina: Prophetic medicine for winter wellness',
      lastMessageTime: '10m ago',
      unread: 5
    },
    {
      id: 'tcm-healing',
      name: 'Traditional Chinese Medicine',
      icon: '☯️',
      description: 'Acupuncture, herbs, and energy healing discussions',
      members: 1876,
      online: 298,
      category: 'community',
      locked: false,
      color: 'red',
      lastMessage: 'Dr. Li: Meridian points for headache relief',
      lastMessageTime: '15m ago',
      unread: 3
    },
    {
      id: 'herbal-medicine',
      name: 'Herbal Medicine Garden',
      icon: '🌱',
      description: 'Growing and using medicinal herbs safely',
      members: 2567,
      online: 423,
      category: 'community',
      locked: false,
      color: 'emerald',
      lastMessage: 'New guide: Growing turmeric at home',
      lastMessageTime: '7m ago',
      unread: 8
    },
    {
      id: 'energy-healing',
      name: 'Energy Healing & Reiki',
      icon: '✨',
      description: 'Chakras, auras, and energy work practices',
      members: 1432,
      online: 234,
      category: 'community',
      locked: false,
      color: 'purple',
      lastMessage: 'Reiki Master Jane: Distance healing circle tonight',
      lastMessageTime: '2m ago',
      unread: 6
    },
    {
      id: 'meditation-mindfulness',
      name: 'Meditation & Mindfulness',
      icon: '🧘',
      description: 'Daily practices for inner peace and clarity',
      members: 3789,
      online: 612,
      category: 'community',
      locked: false,
      color: 'indigo',
      lastMessage: 'Morning meditation starting in 5 minutes',
      lastMessageTime: '1m ago',
      unread: 2,
      liveSession: true
    },
    {
      id: 'holistic-nutrition',
      name: 'Holistic Nutrition Kitchen',
      icon: '🥘',
      description: 'Food as medicine - healing recipes and tips',
      members: 4123,
      online: 734,
      category: 'community',
      locked: false,
      color: 'yellow',
      lastMessage: 'Chef Ana: Anti-inflammatory soup recipe',
      lastMessageTime: '9m ago',
      unread: 18
    },
    {
      id: 'sound-healing',
      name: 'Sound Healing & Therapy',
      icon: '🔔',
      description: 'Healing through frequencies, bowls, and music',
      members: 987,
      online: 156,
      category: 'community',
      locked: false,
      color: 'cyan',
      lastMessage: 'Live: Tibetan singing bowl session',
      lastMessageTime: '3m ago',
      unread: 1,
      audioEnabled: true
    },
    {
      id: 'aromatherapy',
      name: 'Aromatherapy & Essential Oils',
      icon: '🌸',
      description: 'Safe use of essential oils for health and wellness',
      members: 2345,
      online: 389,
      category: 'community',
      locked: false,
      color: 'pink',
      lastMessage: 'Safety alert: Dilution ratios for children',
      lastMessageTime: '11m ago',
      unread: 7
    },
    {
      id: 'movement-therapy',
      name: 'Movement as Medicine',
      icon: '💃',
      description: 'Tai Chi, Qigong, yoga, and therapeutic movement',
      members: 1789,
      online: 267,
      category: 'community',
      locked: false,
      color: 'violet',
      lastMessage: 'Morning Qigong class recording available',
      lastMessageTime: '25m ago',
      unread: 4
    }
  ];

  // Live Events
  const [liveEvents] = useState([
    {
      id: 1,
      title: 'Celebrity Health Talk: Chris Hemsworth on Longevity',
      speaker: 'Chris Hemsworth',
      speakerTitle: 'Actor & Wellness Advocate',
      speakerAvatar: '🌟',
      topic: 'Biohacking for Longevity',
      startTime: '2:00 PM EST',
      duration: '60 min',
      attendees: 1234,
      maxAttendees: 5000,
      status: 'upcoming',
      description: 'Learn about cutting-edge longevity practices',
      tags: ['Celebrity', 'Longevity', 'Fitness'],
      isPremium: true
    },
    {
      id: 2,
      title: 'Dr. Andrew Huberman: Optimize Your Brain',
      speaker: 'Dr. Andrew Huberman',
      speakerTitle: 'Stanford Neuroscientist',
      speakerAvatar: '🧠',
      topic: 'Neuroscience of Peak Performance',
      startTime: '3:30 PM EST',
      duration: '90 min',
      attendees: 3456,
      maxAttendees: 10000,
      status: 'upcoming',
      description: 'Science-based tools for brain optimization',
      tags: ['Science', 'Brain Health', 'Performance']
    },
    {
      id: 3,
      title: 'LIVE NOW: Yassir Ahmed Meditation',
      speaker: 'Yassir Ahmed',
      speakerTitle: 'Wellness Pioneer',
      speakerAvatar: '☪️',
      topic: 'Quantum Healing Meditation',
      startTime: 'NOW',
      duration: '45 min',
      attendees: 8901,
      maxAttendees: 15000,
      status: 'live',
      description: 'Join a powerful group meditation',
      tags: ['Meditation', 'Spirituality', 'Healing'],
      isLive: true
    }
  ]);

  // Enhanced Moderators (5 as requested)
  const [liveModerators] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Mitchell, MD',
      title: 'Chief Medical Officer',
      avatar: null,
      status: 'active',
      specialties: ['Internal Medicine', 'Preventive Care'],
      activeIn: ['total-health-prevention', 'general'],
      responseTime: '< 1 min',
      verified: true,
      rating: 4.9,
      helpedToday: 47
    },
    {
      id: 2,
      name: 'Dr. James Chen, Cardiologist',
      title: 'Heart Health Specialist',
      avatar: null,
      status: 'active',
      specialties: ['Cardiology', 'Post-Surgery Care'],
      activeIn: ['heart-health-excellence', 'recovery-rehabilitation'],
      responseTime: '< 3 min',
      verified: true,
      rating: 4.8,
      helpedToday: 32
    },
    {
      id: 3,
      name: 'Maria Rodriguez, RN, CDE',
      title: 'Diabetes Educator',
      avatar: null,
      status: 'active',
      specialties: ['Diabetes Management', 'Nutrition'],
      activeIn: ['diabetes-blood-sugar', 'nutrition-hydration-pro'],
      responseTime: '< 2 min',
      verified: true,
      rating: 5.0,
      helpedToday: 56
    },
    {
      id: 4,
      name: 'Dr. Lisa Thompson, PhD',
      title: 'Mental Health Director',
      avatar: null,
      status: 'active',
      specialties: ['Clinical Psychology', 'Stress Management'],
      activeIn: ['stress-mental-wellness', 'sleep-optimization'],
      responseTime: '< 5 min',
      verified: true,
      rating: 4.9,
      helpedToday: 28,
      emergencyAvailable: true
    },
    {
      id: 5,
      name: 'Dr. Priya Patel, OB/GYN',
      title: 'Women\'s Health Expert',
      avatar: null,
      status: 'active',
      specialties: ['Women\'s Health', 'Hormonal Balance'],
      activeIn: ['womens-health-complete'],
      responseTime: '< 4 min',
      verified: true,
      rating: 4.9,
      helpedToday: 41
    }
  ]);

  // Health Coaches (formerly Health Gurus)
  const [healthCoaches] = useState([
    {
      id: 1,
      name: 'Coach Michael Thompson',
      title: 'Elite Performance Coach',
      avatar: null,
      verified: true,
      status: 'online',
      achievements: 234,
      followers: 5.2,
      rating: 4.9,
      specialties: ['Weight Loss', 'Strength Training', 'Marathon Prep'],
      currentlyHelping: 4,
      testimonials: 412,
      completedChallenges: 18,
      successStories: 156,
      nextAvailable: 'In 30 min',
      consultationRate: '$75/session'
    },
    {
      id: 2,
      name: 'Coach Anna Williams',
      title: 'Certified Nutrition Coach',
      avatar: null,
      verified: true,
      status: 'online',
      achievements: 189,
      followers: 4.8,
      rating: 5.0,
      specialties: ['Meal Planning', 'Eating Disorders', 'Sports Nutrition'],
      currentlyHelping: 2,
      testimonials: 324,
      completedChallenges: 22,
      successStories: 198,
      nextAvailable: 'Now',
      consultationRate: '$65/session'
    },
    {
      id: 3,
      name: 'Coach David Lee',
      title: 'Holistic Wellness Expert',
      avatar: null,
      verified: true,
      status: 'busy',
      achievements: 167,
      followers: 6.1,
      rating: 4.8,
      specialties: ['Stress Reduction', 'Sleep Optimization', 'Work-Life Balance'],
      currentlyHelping: 6,
      testimonials: 567,
      completedChallenges: 25,
      successStories: 234,
      nextAvailable: 'Tomorrow 9 AM',
      consultationRate: '$80/session'
    }
  ]);

  // Enhanced messages with professional health context
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: 'Dr. Sarah Mitchell, MD',
      avatar: null,
      role: 'moderator',
      verified: true,
      message: '📌 Welcome to Heart Health Excellence! Today\'s focus: "New Guidelines for Blood Pressure Management". Dr. Chen will be hosting a live Q&A at 2 PM EST. Please prepare your questions!',
      time: '10:00 AM',
      pinned: true,
      edited: false,
      reactions: [
        { emoji: '❤️', count: 89, users: ['John D.', 'Maria R.', 'and 87 others'] },
        { emoji: '👍', count: 45, users: ['Alex K.', 'Sam L.', 'and 43 others'] },
        { emoji: '🙏', count: 23, users: ['Emma W.', 'David C.', 'and 21 others'] }
      ],
      replies: [],
      attachments: [
        { type: 'pdf', name: 'BP_Guidelines_2025.pdf', size: '2.3 MB' }
      ]
    },
    {
      id: 2,
      user: 'John Martinez',
      avatar: null,
      role: 'member',
      message: 'Good morning everyone! Just got my lab results - my cholesterol dropped 40 points in 3 months! Thank you all for the support and tips! 🎉',
      time: '10:15 AM',
      edited: false,
      reactions: [
        { emoji: '🎉', count: 67, users: ['Dr. Chen', 'Coach Mike', 'and 65 others'] },
        { emoji: '💪', count: 34, users: ['Maria R.', 'Alex K.', 'and 32 others'] },
        { emoji: '🔥', count: 28, users: ['Sarah M.', 'Tom B.', 'and 26 others'] }
      ],
      replies: [
        {
          id: 21,
          user: 'Dr. James Chen',
          role: 'moderator',
          verified: true,
          message: 'Fantastic progress, John! A 40-point reduction is clinically significant. Would you mind sharing your top 3 lifestyle changes that made the biggest impact? This could help other members.',
          time: '10:18 AM',
          reactions: [
            { emoji: '👏', count: 12, users: ['John M.', 'Lisa C.', 'and 10 others'] }
          ]
        },
        {
          id: 22,
          user: 'John Martinez',
          role: 'member',
          message: 'Of course! 1) Mediterranean diet (thanks to Anna\'s meal plans), 2) Daily 30-min walks, 3) Meditation for stress. The community accountability was huge too!',
          time: '10:22 AM',
          reactions: [
            { emoji: '📝', count: 45, users: ['New members taking notes'] }
          ]
        }
      ],
      thread: {
        count: 15,
        lastReply: '10:45 AM',
        participants: ['Dr. Chen', 'Coach Anna', '8 others']
      }
    },
    {
      id: 3,
      user: 'Coach Anna Williams',
      avatar: null,
      role: 'coach',
      verified: true,
      message: '📊 Weekly Meal Prep Challenge Results:\n\n🥇 Sarah M. - 7/7 days\n🥈 David L. - 6/7 days\n🥉 Emma K. - 6/7 days\n\nAmazing commitment everyone! I\'ve uploaded this week\'s anti-inflammatory meal plan. Check the files section!',
      time: '10:30 AM',
      edited: true,
      editedTime: '10:32 AM',
      reactions: [
        { emoji: '🥗', count: 78, users: ['Meal prep warriors'] },
        { emoji: '⭐', count: 45, users: ['Inspired members'] }
      ],
      attachments: [
        { type: 'image', name: 'meal_prep_week4.jpg', size: '1.2 MB', preview: true },
        { type: 'pdf', name: 'Anti_Inflammatory_Meal_Plan.pdf', size: '856 KB' }
      ],
      poll: {
        question: 'What meal prep topic for next week?',
        options: [
          { text: 'High-Protein Breakfasts', votes: 34, percentage: 45 },
          { text: 'Heart-Healthy Dinners', votes: 28, percentage: 37 },
          { text: 'Portable Lunch Ideas', votes: 14, percentage: 18 }
        ],
        totalVotes: 76,
        endsIn: '2 hours'
      }
    }
  ]);

  // Check channel access including gender restrictions
  const hasChannelAccess = (channel) => {
    if (channel.genderRestricted && channel.genderRestricted !== userGender) {
      return false;
    }
    if (!channel.planRequired) return true;
    return activePlans?.some(plan => plan.id === channel.planRequired);
  };

  // Enhanced reactions
  const quickReactions = ['❤️', '👍', '🔥', '💪', '🙏', '🤗', '⭐', '💚', '🎯', '💡'];

  // Add reaction to message
  const addReaction = (messageId, emoji) => {
    setMessages(prevMessages => 
      prevMessages.map(msg => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find(r => r.emoji === emoji);
          if (existingReaction) {
            return {
              ...msg,
              reactions: msg.reactions.map(r => 
                r.emoji === emoji 
                  ? { ...r, count: r.count + 1, users: [...r.users, displayName] }
                  : r
              )
            };
          } else {
            return {
              ...msg,
              reactions: [...msg.reactions, { emoji, count: 1, users: [displayName] }]
            };
          }
        }
        return msg;
      })
    );
  };

  // Typing indicator simulation
  useEffect(() => {
    if (message.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // All channels combined
  const allChannels = [...healthPlanChannels, ...communityChannels];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Main Sidebar */}
      <MediCureOnSidebar 
        onNavigate={onNavigate} 
        activePage="community"
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Professional Header */}
        <header className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">MediCureOn Community Hub</h1>
                  <p className="text-sm text-gray-600">Professional Health Support Network • 24/7 Moderated</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Professional Stats */}
                <div className="flex items-center px-4 py-2 space-x-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center space-x-2">
                    <Circle className="w-2 h-2 text-green-500 fill-green-500 animate-pulse" />
                    <span className="text-sm font-medium text-gray-700">
                      {allChannels.reduce((sum, ch) => sum + ch.online, 0).toLocaleString()} online
                    </span>
                  </div>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {liveModerators.filter(m => m.status === 'active').length} Moderators
                    </span>
                  </div>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <div className="flex items-center space-x-2">
                    <HeartHandshake className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {healthCoaches.filter(c => c.status === 'online').length} Coaches
                    </span>
                  </div>
                </div>

                {/* Quick Actions */}
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2 transition-colors rounded-lg hover:bg-gray-100"
                >
                  {soundEnabled ? 
                    <Volume2 className="w-5 h-5 text-gray-600" /> : 
                    <VolumeX className="w-5 h-5 text-gray-400" />
                  }
                </button>
                <button className="relative p-2 transition-colors rounded-lg hover:bg-gray-100">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                <button className="p-2 transition-colors rounded-lg hover:bg-gray-100">
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Channel List (Narrower width: w-80 instead of w-96) */}
          <div className="flex flex-col flex-shrink-0 h-full overflow-hidden bg-white border-r border-gray-200 w-80">
            {/* Search with Filters */}
            <div className="flex-shrink-0 p-4 border-b border-gray-100">
              <div className="relative mb-3">
                <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  placeholder="Search channels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 text-sm transition-all rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
                <button className="absolute p-1 transform -translate-y-1/2 rounded right-2 top-1/2 hover:bg-gray-200">
                  <Filter className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Live Events Section */}
            {liveEvents.some(e => e.status === 'live') && (
              <div className="flex-shrink-0 p-4 border-b border-orange-200 bg-gradient-to-r from-red-50 to-orange-50">
                <h3 className="flex items-center mb-2 text-sm font-semibold text-red-700">
                  <Circle className="w-2 h-2 mr-2 text-red-500 fill-red-500 animate-pulse" />
                  LIVE NOW
                </h3>
                {liveEvents.filter(e => e.status === 'live').map(event => (
                  <div key={event.id} className="p-2 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{event.speaker}</h4>
                        <p className="text-xs text-gray-600">{event.topic}</p>
                      </div>
                      <button className="px-2 py-1 text-xs font-medium text-white bg-red-600 rounded-full hover:bg-red-700">
                        Join
                      </button>
                    </div>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <Users className="w-3 h-3 mr-1" />
                      <span>{event.attendees.toLocaleString()} watching</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Channels List - Scrollable (Main scrolling area) */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {/* Health Plan Channels */}
              <div className="p-3">
                <h3 className="flex items-center mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  <span className="mr-2">🏥</span>
                  Health Plans ({healthPlanChannels.length})
                </h3>
                
                {healthPlanChannels.map(channel => {
                  const hasAccess = hasChannelAccess(channel);
                  const isSelected = selectedChannel?.id === channel.id;
                  
                  return (
                    <div
                      key={channel.id}
                      onClick={() => hasAccess && setSelectedChannel(channel)}
                      className={`
                        group relative mb-1.5 p-2 rounded-lg cursor-pointer transition-all duration-200
                        ${isSelected 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' 
                          : hasAccess 
                            ? 'hover:bg-gray-50 hover:shadow-sm' 
                            : 'opacity-50 cursor-not-allowed'
                        }
                      `}
                    >
                      <div className="flex items-start space-x-2">
                        <div className={`
                          w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm
                          ${isSelected ? 'bg-white/20' : 'bg-gradient-to-br from-gray-100 to-gray-200'}
                        `}>
                          <span className="text-lg">{channel.icon}</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-sm font-semibold truncate ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                              {channel.name}
                              {channel.expertPresent && <StethoscopeIcon className="inline w-3 h-3 ml-1" />}
                              {channel.locked && !hasAccess && <Lock className="inline w-3 h-3 ml-1" />}
                            </h4>
                            {channel.unread > 0 && !isSelected && (
                              <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                                {channel.unread}
                              </span>
                            )}
                          </div>
                          
                          <p className={`text-xs truncate mt-0.5 ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
                            {channel.description}
                          </p>
                          
                          <div className={`text-xs truncate mt-0.5 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                            {channel.lastMessage}
                          </div>
                          
                          <div className="flex items-center justify-between mt-1">
                            <span className={`text-xs ${isSelected ? 'text-white/60' : 'text-gray-400'}`}>
                              {channel.lastMessageTime}
                            </span>
                            <span className={`text-xs ${isSelected ? 'text-white/60' : 'text-gray-400'}`}>
                              <Users className="inline w-3 h-3 mr-1" />
                              {channel.online}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {!hasAccess && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-gray-900/20 backdrop-blur-sm">
                          <span className="px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-full">
                            {channel.genderRestricted ? 'Gender Restricted' : 'Join Plan'}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Community Channels */}
              <div className="p-3 border-t border-gray-100">
                <h3 className="flex items-center mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  <span className="mr-2">🌿</span>
                  Community ({communityChannels.length})
                </h3>
                
                {communityChannels.map(channel => {
                  const isSelected = selectedChannel?.id === channel.id;
                  
                  return (
                    <div
                      key={channel.id}
                      onClick={() => setSelectedChannel(channel)}
                      className={`
                        group relative mb-1.5 p-2 rounded-lg cursor-pointer transition-all duration-200
                        ${isSelected 
                          ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-md' 
                          : 'hover:bg-gray-50 hover:shadow-sm'
                        }
                      `}
                    >
                      <div className="flex items-start space-x-2">
                        <div className={`
                          w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm
                          ${isSelected ? 'bg-white/20' : 'bg-gradient-to-br from-green-100 to-teal-100'}
                        `}>
                          <span className="text-lg">{channel.icon}</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-sm font-semibold truncate ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                              {channel.name}
                              {channel.trending && <TrendingUp className="inline w-3 h-3 ml-1 text-orange-500" />}
                              {channel.liveSession && <Circle className="inline w-2 h-2 ml-1 text-red-500 fill-red-500 animate-pulse" />}
                            </h4>
                            {channel.unread > 0 && !isSelected && (
                              <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                                {channel.unread}
                              </span>
                            )}
                          </div>
                          
                          <p className={`text-xs truncate mt-0.5 ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
                            {channel.description}
                          </p>
                          
                          <div className={`text-xs truncate mt-0.5 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                            {channel.lastMessage}
                          </div>
                          
                          <div className="flex items-center justify-between mt-1">
                            <span className={`text-xs ${isSelected ? 'text-white/60' : 'text-gray-400'}`}>
                              {channel.lastMessageTime}
                            </span>
                            <span className={`text-xs ${isSelected ? 'text-white/60' : 'text-gray-400'}`}>
                              <Users className="inline w-3 h-3 mr-1" />
                              {channel.online}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Live Events */}
              <div className="p-3 border-t border-gray-100">
                <h3 className="flex items-center mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  <span className="mr-2">📅</span>
                  Upcoming Events ({liveEvents.filter(e => e.status === 'upcoming').length})
                </h3>
                
                {liveEvents.filter(e => e.status === 'upcoming').map(event => (
                  <div key={event.id} className="p-2 mb-2 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                    <div className="flex items-start space-x-2">
                      <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-sm">
                        <span className="text-lg">{event.speakerAvatar}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900">{event.title}</h4>
                        <p className="text-xs text-gray-600 mt-0.5">{event.speaker} • {event.topic}</p>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span><Clock className="inline w-3 h-3 mr-1" />{event.startTime}</span>
                            <span><Users className="inline w-3 h-3 mr-1" />{event.attendees}</span>
                          </div>
                          <button className="px-2 py-1 text-xs text-white bg-purple-600 rounded-full hover:bg-purple-700">
                            Register
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex-shrink-0 p-3 border-t border-gray-200 bg-gray-50">
              <button className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-sm font-medium text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg">
                <Plus className="w-4 h-4" />
                <span>Create Group</span>
              </button>
            </div>
          </div>

          {/* Center - Chat Area (Wider with flex-1) */}
          <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
            {selectedChannel ? (
              <>
                {/* Chat Header */}
                <div className="flex-shrink-0 px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                        selectedChannel.category === 'health-plans' 
                          ? 'from-blue-400 to-purple-600' 
                          : 'from-green-400 to-teal-600'
                      } flex items-center justify-center shadow-lg`}>
                        <span className="text-2xl">{selectedChannel.icon}</span>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h2 className="text-lg font-bold text-gray-900">
                            {selectedChannel.name}
                          </h2>
                          {selectedChannel.safeSpace && (
                            <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                              Safe Space
                            </span>
                          )}
                          {selectedChannel.expertPresent && (
                            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                              Expert Present
                            </span>
                          )}
                        </div>
                        <button 
                          onClick={() => setShowChannelInfo(!showChannelInfo)}
                          className="flex items-center text-sm text-gray-600 hover:text-gray-800"
                        >
                          {selectedChannel.description}
                          <ChevronDown className={`ml-1 w-3 h-3 transition-transform ${showChannelInfo ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button className="flex items-center px-4 py-2 space-x-2 font-medium text-green-700 transition-colors rounded-lg bg-green-50 hover:bg-green-100">
                        <Video className="w-4 h-4" />
                        <span className="text-sm">Join Video Call</span>
                      </button>
                      <button className="p-2 transition-colors rounded-lg hover:bg-gray-100">
                        <Phone className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 transition-colors rounded-lg hover:bg-gray-100">
                        <Pin className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 transition-colors rounded-lg hover:bg-gray-100">
                        <Info className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Channel Info Dropdown */}
                  {showChannelInfo && (
                    <div className="p-4 mt-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
                      <div className="grid grid-cols-5 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{selectedChannel.members.toLocaleString()}</p>
                          <p className="text-xs text-gray-600">Total Members</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600">{selectedChannel.online}</p>
                          <p className="text-xs text-gray-600">Online Now</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-purple-600">
                            {selectedChannel.expertPresent ? '3' : selectedChannel.moderatorPresent ? '2' : '1'}
                          </p>
                          <p className="text-xs text-gray-600">Health Experts</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-blue-600">4.9</p>
                          <p className="text-xs text-gray-600">Helpfulness</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-orange-600">
                            {selectedChannel.avgA1C || selectedChannel.avgBPReduction || selectedChannel.avgSleepImprovement || '95%'}
                          </p>
                          <p className="text-xs text-gray-600">Success Rate</p>
                        </div>
                      </div>
                      
                      {selectedChannel.weeklyGoal && (
                        <div className="p-3 mt-4 bg-white rounded-lg">
                          <p className="flex items-center text-sm font-medium text-gray-900">
                            <Target className="w-4 h-4 mr-2 text-green-600" />
                            This Week's Goal: {selectedChannel.weeklyGoal}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Messages Area */}
                <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`${msg.pinned ? 'bg-gradient-to-r from-yellow-50 to-orange-50 -mx-6 px-6 py-4 border-l-4 border-yellow-400' : ''}`}>
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center shadow-md
                            ${msg.role === 'coach' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                              msg.role === 'moderator' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                              msg.role === 'provider' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                              'bg-gradient-to-r from-gray-400 to-gray-500'}
                          `}>
                            {msg.role === 'coach' ? <Crown className="w-5 h-5 text-white" /> :
                             msg.role === 'moderator' ? <Shield className="w-5 h-5 text-white" /> :
                             msg.role === 'provider' ? <Stethoscope className="w-5 h-5 text-white" /> :
                             <User className="w-5 h-5 text-white" />}
                          </div>
                          {msg.verified && (
                            <div className="relative float-right -mt-2 -mr-2">
                              <BadgeCheck className="w-5 h-5 text-blue-500 fill-white" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-baseline space-x-2">
                            <span className="font-semibold text-gray-900">{msg.user}</span>
                            {msg.role === 'coach' && <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">Health Coach</span>}
                            {msg.role === 'moderator' && <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">Moderator</span>}
                            {msg.role === 'provider' && <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">Healthcare Provider</span>}
                            <span className="text-xs text-gray-500">{msg.time}</span>
                            {msg.edited && <span className="text-xs text-gray-400">(edited {msg.editedTime})</span>}
                            {msg.pinned && <Pin className="w-3 h-3 text-yellow-600" />}
                          </div>
                          
                          <p className="mt-1 text-gray-800 whitespace-pre-wrap">{msg.message}</p>
                          
                          {/* Attachments */}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {msg.attachments.map((attachment, idx) => (
                                <div key={idx} className="flex items-center p-2 space-x-2 bg-gray-100 rounded-lg">
                                  {attachment.type === 'pdf' && <FileText className="w-4 h-4 text-red-600" />}
                                  {attachment.type === 'image' && <Camera className="w-4 h-4 text-blue-600" />}
                                  <span className="text-sm text-gray-700">{attachment.name}</span>
                                  <span className="text-xs text-gray-500">{attachment.size}</span>
                                  <button className="ml-auto text-xs text-blue-600 hover:text-blue-800">Download</button>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Poll */}
                          {msg.poll && (
                            <div className="p-4 mt-3 rounded-lg bg-gray-50">
                              <h4 className="mb-3 font-medium text-gray-900">{msg.poll.question}</h4>
                              <div className="space-y-2">
                                {msg.poll.options.map((option, idx) => (
                                  <div key={idx} className="relative">
                                    <button className="w-full p-3 text-left transition-colors bg-white rounded-lg hover:bg-gray-50">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm">{option.text}</span>
                                        <span className="text-xs text-gray-500">{option.votes} votes ({option.percentage}%)</span>
                                      </div>
                                      <div className="h-2 mt-2 overflow-hidden bg-gray-200 rounded-full">
                                        <div 
                                          className="h-full transition-all bg-gradient-to-r from-blue-500 to-purple-500"
                                          style={{ width: `${option.percentage}%` }}
                                        />
                                      </div>
                                    </button>
                                  </div>
                                ))}
                              </div>
                              <p className="mt-3 text-xs text-gray-500">
                                {msg.poll.totalVotes} votes • Ends {msg.poll.endsIn}
                              </p>
                            </div>
                          )}
                          
                          {/* Reactions */}
                          {msg.reactions && msg.reactions.length > 0 && (
                            <div className="flex flex-wrap items-center mt-2 space-x-2">
                              {msg.reactions.map((reaction, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => addReaction(msg.id, reaction.emoji)}
                                  className="flex items-center px-2 py-1 space-x-1 transition-all bg-gray-100 rounded-full hover:bg-gray-200 hover:scale-105"
                                >
                                  <span className="text-sm">{reaction.emoji}</span>
                                  <span className="text-xs font-medium text-gray-600">{reaction.count}</span>
                                </button>
                              ))}
                              <button 
                                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                                onClick={() => setShowEmojiPicker(true)}
                              >
                                <Plus className="w-3 h-3 text-gray-400" />
                              </button>
                            </div>
                          )}
                          
                          {/* Action buttons */}
                          <div className="flex items-center mt-3 space-x-4">
                            <button
                              onClick={() => setReplyingTo(msg)}
                              className="flex items-center space-x-1 text-xs text-gray-500 transition-colors hover:text-gray-700"
                            >
                              <Reply className="w-3 h-3" />
                              <span>Reply</span>
                            </button>
                            <button 
                              onClick={() => setShowEmojiPicker(true)}
                              className="flex items-center space-x-1 text-xs text-gray-500 transition-colors hover:text-gray-700"
                            >
                              <Smile className="w-3 h-3" />
                              <span>React</span>
                            </button>
                            {(msg.role === 'coach' || msg.role === 'provider') && (
                              <button className="flex items-center space-x-1 text-xs font-medium text-purple-600 hover:text-purple-700">
                                <MessageCircle className="w-3 h-3" />
                                <span>Book Consultation</span>
                              </button>
                            )}
                            {msg.user === displayName && (
                              <button 
                                onClick={() => setEditingMessage(msg.id)}
                                className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                            )}
                            <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700">
                              <Share2 className="w-3 h-3" />
                              <span>Share</span>
                            </button>
                            <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700">
                              <Bookmark className="w-3 h-3" />
                              <span>Save</span>
                            </button>
                            <button className="text-xs text-gray-500 hover:text-gray-700">
                              <MoreHorizontal className="w-3 h-3" />
                            </button>
                          </div>
                          
                          {/* Thread indicator */}
                          {msg.thread && (
                            <button className="flex items-center mt-3 space-x-2 text-xs font-medium text-blue-600 hover:text-blue-700">
                              <MessageSquare className="w-3 h-3" />
                              <span>{msg.thread.count} replies</span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-500">Last reply {msg.thread.lastReply}</span>
                              <span className="flex -space-x-1">
                                {msg.thread.participants.slice(0, 3).map((_, i) => (
                                  <div key={i} className="w-5 h-5 bg-gray-300 border-2 border-white rounded-full" />
                                ))}
                                {msg.thread.participants.length > 3 && (
                                  <div className="flex items-center justify-center w-5 h-5 text-xs bg-gray-200 border-2 border-white rounded-full">
                                    +{msg.thread.participants.length - 3}
                                  </div>
                                )}
                              </span>
                            </button>
                          )}
                          
                          {/* Replies */}
                          {msg.replies && msg.replies.length > 0 && (
                            <div className="pl-4 mt-3 space-y-3 border-l-2 border-gray-200">
                              {msg.replies.map((reply) => (
                                <div key={reply.id} className="flex space-x-3">
                                  <div className={`
                                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md
                                    ${reply.role === 'coach' ? 'bg-gradient-to-r from-purple-400 to-pink-400' :
                                      reply.role === 'moderator' ? 'bg-gradient-to-r from-blue-400 to-cyan-400' :
                                      reply.verified ? 'bg-gradient-to-r from-green-400 to-emerald-400' :
                                      'bg-gray-300'}
                                  `}>
                                    {reply.role === 'coach' ? <Crown className="w-4 h-4 text-white" /> :
                                     reply.role === 'moderator' ? <Shield className="w-4 h-4 text-white" /> :
                                     <User className="w-4 h-4 text-white" />}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-baseline space-x-2">
                                      <span className="text-sm font-medium text-gray-900">{reply.user}</span>
                                      {reply.verified && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                                      <span className="text-xs text-gray-500">{reply.time}</span>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-700">{reply.message}</p>
                                    {reply.reactions && reply.reactions.length > 0 && (
                                      <div className="flex items-center mt-2 space-x-1">
                                        {reply.reactions.map((reaction, idx) => (
                                          <button
                                            key={idx}
                                            className="flex items-center px-2 py-0.5 text-xs bg-gray-100 rounded-full hover:bg-gray-200"
                                          >
                                            <span>{reaction.emoji}</span>
                                            <span className="ml-1 text-gray-600">{reaction.count}</span>
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicators */}
                  {isTyping && (
                    <div className="flex items-center space-x-2 text-gray-500">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-xs">Several people are typing...</span>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="flex-shrink-0 px-6 py-4 bg-white border-t border-gray-200">
                  {/* Replying indicator */}
                  {replyingTo && (
                    <div className="flex items-center justify-between p-3 mb-3 border border-blue-200 rounded-lg bg-blue-50">
                      <div className="flex items-center space-x-2">
                        <Reply className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-700">
                          Replying to <span className="font-semibold">{replyingTo.user}</span>
                        </span>
                      </div>
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  {/* Input Actions Bar */}
                  <div className="flex items-center mb-3 space-x-2">
                    <button
                      onClick={() => setShowPollCreator(true)}
                      className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-1"
                    >
                      <BarChart3 className="w-3 h-3" />
                      <span>Poll</span>
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>Schedule</span>
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-1">
                      <Gift className="w-3 h-3" />
                      <span>Reward</span>
                    </button>
                  </div>
                  
                  <div className="flex items-end space-x-4">
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 transition-colors rounded-lg hover:text-gray-600 hover:bg-gray-100">
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 transition-colors rounded-lg hover:text-gray-600 hover:bg-gray-100">
                        <Camera className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 transition-colors rounded-lg hover:text-gray-600 hover:bg-gray-100">
                        <Mic className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="relative flex-1">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            // Send message logic here
                          }
                        }}
                        placeholder={selectedChannel.safeSpace 
                          ? "This is a safe space. Share openly and respectfully..." 
                          : "Share your experience, ask questions, or offer support..."}
                        className="w-full px-4 py-3 transition-all resize-none bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                        rows="1"
                        style={{ minHeight: '48px', maxHeight: '120px' }}
                      />
                      <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="absolute text-gray-400 right-3 bottom-3 hover:text-gray-600"
                      >
                        <Smile className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <button
                      disabled={!message.trim()}
                      className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center space-x-2 ${
                        message.trim()
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transform hover:scale-[1.02]'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                      <span>Send</span>
                    </button>
                  </div>
                  
                  {/* Quick emoji reactions */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-1">
                      <span className="mr-2 text-xs text-gray-500">Quick reactions:</span>
                      {quickReactions.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => setMessage(message + emoji)}
                          className="p-1.5 text-lg transition-all rounded-lg hover:bg-gray-100 hover:scale-110"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      Press Enter to send • Shift+Enter for new line
                    </span>
                  </div>
                </div>
              </>
            ) : (
              /* Welcome Screen */
              <div className="flex items-center justify-center flex-1 p-8">
                <div className="max-w-3xl text-center">
                  <div className="flex items-center justify-center w-32 h-32 mx-auto mb-6 rounded-full shadow-2xl bg-gradient-to-r from-blue-500 to-purple-600">
                    <HeartHandshake className="w-16 h-16 text-white" />
                  </div>
                  <h2 className="mb-4 text-3xl font-bold text-gray-900">
                    Welcome to MediCureOn Community Hub
                  </h2>
                  <p className="mb-8 text-lg text-gray-600">
                    Join {allChannels.reduce((sum, ch) => sum + ch.members, 0).toLocaleString()} members on their health journeys. 
                    Get 24/7 support from certified healthcare professionals, health coaches, and peers who understand your journey.
                  </p>
                  
                  <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                      <Shield className="w-10 h-10 mx-auto mb-2 text-purple-600" />
                      <h3 className="font-semibold text-gray-900">24/7 Moderated</h3>
                      <p className="mt-1 text-sm text-gray-600">Professional oversight always</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                      <Stethoscope className="w-10 h-10 mx-auto mb-2 text-green-600" />
                      <h3 className="font-semibold text-gray-900">Expert Support</h3>
                      <p className="mt-1 text-sm text-gray-600">Verified healthcare pros</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                      <Users className="w-10 h-10 mx-auto mb-2 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">Real Community</h3>
                      <p className="mt-1 text-sm text-gray-600">Connect with people like you</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl">
                      <Trophy className="w-10 h-10 mx-auto mb-2 text-orange-600" />
                      <h3 className="font-semibold text-gray-900">Proven Results</h3>
                      <p className="mt-1 text-sm text-gray-600">95% success rate</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => setSelectedChannel(communityChannels[0])}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                    >
                      Explore Community Channels
                    </button>
                    <p className="text-sm text-gray-500">
                      or select a channel from the left to begin
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Professional Support (Narrower width: w-80 instead of w-96) */}
          <div className="flex flex-col flex-shrink-0 h-full overflow-hidden bg-white border-l border-gray-200 w-80">
            <div className="flex-shrink-0 text-white bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="p-4">
                <h2 className="text-lg font-bold">Professional Support Team</h2>
                <p className="text-sm text-white/80">Expert help when you need it</p>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {/* Active Moderators - 5 as requested */}
              <div className="p-3 border-b border-gray-100">
                <h3 className="flex items-center mb-2 text-sm font-semibold text-gray-700">
                  <Shield className="w-4 h-4 mr-2 text-blue-600" />
                  Active Moderators ({liveModerators.filter(m => m.status === 'active').length})
                </h3>
                <div className="space-y-2">
                  {liveModerators.map((mod) => (
                    <div key={mod.id} className="flex items-start p-2 space-x-2 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50">
                      <div className="relative">
                        <div className="flex items-center justify-center rounded-full shadow-md w-9 h-9 bg-gradient-to-r from-blue-500 to-cyan-500">
                          <Shield className="w-4 h-4 text-white" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900">{mod.name}</h4>
                        <p className="text-xs text-gray-600">{mod.title}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {mod.specialties.map((spec, idx) => (
                            <span key={idx} className="text-xs px-1.5 py-0.5 bg-white text-blue-700 rounded">
                              {spec}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center space-x-2 text-xs">
                            <span className="font-medium text-green-600">
                              <CheckCircle2 className="inline w-3 h-3 mr-0.5" />
                              {mod.responseTime}
                            </span>
                            <span className="text-gray-500">
                              Helped {mod.helpedToday}
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-amber-600">
                            <Star className="w-3 h-3 mr-0.5 fill-amber-600" />
                            {mod.rating}
                          </div>
                        </div>
                        {mod.emergencyAvailable && (
                          <div className="inline-flex items-center px-2 py-0.5 mt-1 text-xs text-red-700 bg-red-100 rounded-full">
                            <AlertCircle className="w-3 h-3 mr-0.5" />
                            Emergency Available
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Health Coaches */}
              <div className="p-3 border-b border-gray-100">
                <h3 className="flex items-center mb-2 text-sm font-semibold text-gray-700">
                  <Crown className="w-4 h-4 mr-2 text-purple-600" />
                  Health Coaches Online ({healthCoaches.filter(c => c.status === 'online').length})
                </h3>
                <div className="space-y-2">
                  {healthCoaches.map((coach) => (
                    <div key={coach.id} className="p-2 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                      <div className="flex items-start space-x-2">
                        <div className="relative">
                          <div className="flex items-center justify-center rounded-full shadow-md w-9 h-9 bg-gradient-to-r from-purple-500 to-pink-500">
                            <Crown className="w-4 h-4 text-white" />
                          </div>
                          {coach.verified && (
                            <BadgeCheck className="absolute w-4 h-4 text-blue-500 -bottom-0.5 -right-0.5 fill-white" />
                          )}
                          <div className={`absolute top-0 right-0 w-2 h-2 rounded-full border-2 border-white ${
                            coach.status === 'online' ? 'bg-green-500' : 
                            coach.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
                          }`}></div>
                        </div>
                        <div className="flex-1">
                          <h4 className="flex items-center text-sm font-semibold text-gray-900">
                            {coach.name}
                            <div className="flex items-center ml-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              <span className="ml-0.5 text-xs text-gray-600">{coach.rating}</span>
                            </div>
                          </h4>
                          <p className="text-xs text-gray-600">{coach.title}</p>
                          
                          <div className="grid grid-cols-2 gap-1 mt-1 text-xs">
                            <div className="flex items-center text-gray-600">
                              <Trophy className="w-3 h-3 mr-0.5 text-purple-500" />
                              {coach.completedChallenges} done
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Users className="w-3 h-3 mr-0.5 text-blue-500" />
                              {coach.followers}K
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Heart className="w-3 h-3 mr-0.5 text-red-500" />
                              {coach.successStories} wins
                            </div>
                            <div className="flex items-center text-gray-600">
                              <MessageSquare className="w-3 h-3 mr-0.5 text-green-500" />
                              {coach.testimonials}
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mt-1">
                            {coach.specialties.slice(0, 2).map((spec, idx) => (
                              <span key={idx} className="text-xs px-1.5 py-0.5 bg-white text-purple-700 rounded">
                                {spec}
                              </span>
                            ))}
                            {coach.specialties.length > 2 && (
                              <span className="text-xs px-1.5 py-0.5 bg-purple-200 text-purple-700 rounded">
                                +{coach.specialties.length - 2}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="text-xs">
                              <span className="text-gray-500">Next: </span>
                              <span className="font-medium text-green-600">{coach.nextAvailable}</span>
                            </div>
                            <button className="px-2 py-1 text-xs font-medium text-white transition-colors bg-purple-600 rounded-full hover:bg-purple-700">
                              Book
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-2 text-sm font-medium text-purple-600 hover:text-purple-700">
                  View All Coaches →
                </button>
              </div>

              {/* Quick Help */}
              <div className="p-3 border-b border-gray-100">
                <h3 className="flex items-center mb-2 text-sm font-semibold text-gray-700">
                  <HeartHandshake className="w-4 h-4 mr-2 text-red-600" />
                  Need Immediate Help?
                </h3>
                <div className="space-y-2">
                  <button className="w-full p-2 transition-colors rounded-lg bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center justify-center bg-red-500 rounded-full w-9 h-9">
                          <AlertTriangle className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                          <h4 className="text-sm font-semibold text-gray-900">Crisis Support</h4>
                          <p className="text-xs text-gray-600">24/7 Emergency</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                  
                  <button className="w-full p-2 transition-colors rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center justify-center bg-blue-500 rounded-full w-9 h-9">
                          <Headphones className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                          <h4 className="text-sm font-semibold text-gray-900">Talk Now</h4>
                          <p className="text-xs text-gray-600">Connect with counselor</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Community Stats */}
              <div className="p-3">
                <h3 className="flex items-center mb-2 text-sm font-semibold text-gray-700">
                  <Activity className="w-4 h-4 mr-2 text-green-600" />
                  Community Impact Today
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 text-center rounded-lg bg-gradient-to-br from-green-50 to-emerald-50">
                    <p className="text-xl font-bold text-green-600">1.2K</p>
                    <p className="text-xs text-gray-600">Questions</p>
                  </div>
                  <div className="p-2 text-center rounded-lg bg-gradient-to-br from-purple-50 to-pink-50">
                    <p className="text-xl font-bold text-purple-600">567</p>
                    <p className="text-xs text-gray-600">Helped</p>
                  </div>
                  <div className="p-2 text-center rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50">
                    <p className="text-xl font-bold text-blue-600">89</p>
                    <p className="text-xs text-gray-600">Success</p>
                  </div>
                  <div className="p-2 text-center rounded-lg bg-gradient-to-br from-orange-50 to-amber-50">
                    <p className="text-xl font-bold text-orange-600">4.9</p>
                    <p className="text-xs text-gray-600">Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityHub;