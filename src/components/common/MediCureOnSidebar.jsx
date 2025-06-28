// src/components/common/MediCureOnSidebar.jsx
import React from 'react';
import { 
  Activity, 
  FileText, 
  CreditCard, 
  Users, 
  MessageSquare, 
  ArrowLeft, 
  User,
  Trophy,
  LogOut // Add LogOut icon
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useMediCureOnData } from '../../hooks/useMediCureOnData';

const MediCureOnSidebar = ({ onNavigate, activePage = 'landing' }) => {
  const { user, userInfo, logout } = useAuth(); // Add logout from useAuth
  const { profilePicture, userSubscription, getUserDisplayName } = useMediCureOnData();

  const firstName = getUserDisplayName();
  const userEmail = userInfo?.email || user?.username || 'user@medicureon.com';

  const navItems = [
    { id: 'landing', label: 'My Health', icon: Activity },
    { id: 'rewards', label: 'Rewards & Achievements', icon: Trophy },
    { id: 'plans', label: 'Plans', icon: FileText },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
  ];

  // Determine if we're on a plan dashboard
  const isPlanDashboard = activePage.startsWith('plan-');
  const backDestination = isPlanDashboard ? 'plans' : 'landing';
  const backLabel = isPlanDashboard ? 'Back to Plans' : 'Back to Dashboard';

  return (
    <div 
      className="relative flex flex-col flex-shrink-0 w-64 text-white"
      style={{ 
        backgroundColor: '#02276F',
        height: '100vh',
        minHeight: '100vh'
      }}
    >
      {/* Profile Section */}
      <div className="p-6 border-b border-blue-800">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-20 h-20 mb-3 overflow-hidden bg-gray-300 border-2 border-white rounded-full">
            {profilePicture ? (
              <img 
                src={profilePicture} 
                alt={firstName} 
                className="object-cover w-full h-full"
              />
            ) : (
              <User className="w-10 h-10 text-gray-600" />
            )}
          </div>
          <h3 className="text-lg font-semibold">{firstName}</h3>
          <p className="w-full text-xs text-center text-blue-200 truncate opacity-75">
            {userEmail}
          </p>
          {userSubscription && userSubscription.type && (
            <div className="px-2 py-1 mt-2 bg-yellow-400 rounded-full bg-opacity-20">
              <p className="text-xs font-medium text-yellow-300 capitalize">
                {userSubscription.type} Member
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = activePage === item.id || 
                           (isPlanDashboard && item.id === 'plans');
            
            return (
              <div 
                key={item.id}
                className={`flex items-center px-3 py-2 space-x-3 text-sm font-medium rounded-lg cursor-pointer ${
                  isActive 
                    ? 'bg-[#F1C40F] text-[#02276F]' 
                    : 'text-[#F1C40F] hover:bg-yellow-400 hover:bg-opacity-10'
                }`}
                onClick={() => onNavigate(item.id)}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Bottom Navigation - Updated with Profile and Logout */}
      <div className="p-4 border-t border-blue-800">
        <div className="space-y-1">
          {/* Profile Option */}
          <div 
            className={`flex items-center px-3 py-2 space-x-3 text-sm font-medium rounded-lg cursor-pointer hover:bg-yellow-400 hover:bg-opacity-10 ${
              activePage === 'profile' ? 'bg-[#F1C40F] text-[#02276F]' : 'text-[#F1C40F]'
            }`}
            onClick={() => onNavigate('profile')}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </div>
          
          {/* Logout Option */}
          <div 
            className="flex items-center px-3 py-2 space-x-3 text-sm font-medium rounded-lg cursor-pointer hover:bg-yellow-400 hover:bg-opacity-10 text-[#F1C40F]"
            onClick={logout}
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </div>
          
          {/* Back Button (only show on plan dashboards) */}
          {isPlanDashboard && (
            <button
              onClick={() => onNavigate(backDestination)}
              className="flex items-center w-full px-3 py-2 mt-2 space-x-3 text-sm font-medium rounded-lg cursor-pointer hover:bg-yellow-400 hover:bg-opacity-10"
              style={{ color: '#F1C40F' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{backLabel}</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Yellow accent edge on the right side of sidebar */}
      <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-[#F1C40F] via-[#FDB931] to-[#F1C40F]"></div>
    </div>
  );
};

export default MediCureOnSidebar;