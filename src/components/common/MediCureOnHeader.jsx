// src/components/common/MediCureOnHeader.jsx
import React, { useState } from 'react';
import { 
  RefreshCw, 
  Activity, 
  ArrowLeft, 
  Search, 
  Bell,
  X
} from 'lucide-react';
import { useMediCureOnData } from '../../hooks/useMediCureOnData';

const MediCureOnHeader = ({ 
  title,
  subtitle,
  showRefresh = false, // Changed default to false since we have caching
  onRefresh = null,
  customBadges = [],
  showBackButton = false,
  onBack = null,
  backButtonText = "Back to Plans",
  showSearch = true, // New prop for search
  showNotifications = true, // New prop for notifications
  onSearch = null, // Callback for search
  notificationCount = 0 // Number of unread notifications
}) => {
  const { 
    isRefreshing, 
    refreshAll, 
    getGreeting, 
    getUserDisplayName
  } = useMediCureOnData();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const greeting = getGreeting();
  const firstName = getUserDisplayName();

  // Use provided onRefresh or default to refreshAll
  const handleRefresh = onRefresh || refreshAll;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleNotificationClick = () => {
    // This could open a notification dropdown or navigate to a notifications page
    console.log('Notifications clicked');
  };

  return (
    <header className="relative overflow-hidden bg-gradient-to-r from-[#02276F] to-[#033A8E] shadow-lg">
      {/* Subtle animated accent */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
      </div>
      
      <div className="relative px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {title || (
                  <>
                    {greeting}, <span className="text-[#F1C40F]">{firstName}!</span>
                  </>
                )}
              </h1>
              <p className="mt-1 text-sm text-blue-100">
                {subtitle}
              </p>
            </div>
            
            {/* Custom badges only - no default badges */}
            {customBadges.length > 0 && (
              <div className="flex items-center space-x-3">
                {customBadges.map((badge, index) => (
                  <div key={index} className={badge.className || "flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full"}>
                    {badge.icon && <badge.icon className="w-3 h-3 mr-1.5" />}
                    <span className="text-xs font-medium">
                      {badge.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Right side buttons */}
          <div className="flex items-center space-x-3">
            {/* Search Bar - Expandable */}
            {showSearch && (
              <div className={`flex items-center transition-all duration-300 ${searchOpen ? 'w-64' : 'w-auto'}`}>
                {searchOpen ? (
                  <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search health data..."
                      className="w-full px-4 py-2 pr-10 text-sm text-gray-900 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#F1C40F]"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="absolute p-1 text-gray-500 right-2 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 text-white transition-all duration-200 rounded-full bg-white/10 hover:bg-white/20"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Notifications Button */}
            {showNotifications && (
              <button
                onClick={handleNotificationClick}
                className="relative p-2 text-white transition-all duration-200 rounded-full bg-white/10 hover:bg-white/20"
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>
            )}

            {/* Refresh Button - Only show if explicitly enabled */}
            {showRefresh && handleRefresh && (
              <button
                onClick={handleRefresh}
                className="flex items-center px-3 py-1.5 text-xs font-medium text-[#02276F] bg-white rounded-full hover:bg-[#F1C40F] hover:text-[#02276F] transition-all duration-200 shadow-sm"
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-3 h-3 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            )}
            
            {/* Back Button */}
            {showBackButton && onBack && (
              <button
                onClick={onBack}
                className="flex items-center px-4 py-2 text-sm font-medium text-[#02276F] bg-white rounded-full hover:bg-[#F1C40F] hover:text-[#02276F] transition-all duration-200 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {backButtonText}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="h-1 bg-gradient-to-r from-[#F1C40F] via-[#FDB931] to-[#F1C40F]"></div>
    </header>
  );
};

export default MediCureOnHeader;