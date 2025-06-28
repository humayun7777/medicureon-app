// src/components/common/PlanDashboardLayout.jsx
import React from 'react';
import { AlertCircle } from 'lucide-react';
import MediCureOnSidebar from './MediCureOnSidebar';
import MediCureOnHeader from './MediCureOnHeader';
import { useMediCureOnData } from '../../hooks/useMediCureOnData';

const PlanDashboardLayout = ({ 
  planId,
  planName,
  subtitle,
  customBadges = [],
  onNavigate,
  children,
  showDevelopmentBanner = true,
  isRealTimeData = false // Flag for critical real-time data dashboards
}) => {
  const { isLoading, error } = useMediCureOnData();

  // Determine the active page for sidebar
  // If planId is "subscription", use "subscription" directly, otherwise use "plan-{planId}"
  const activePage = planId === 'subscription' ? 'subscription' : `plan-${planId}`;

  // Create plan-specific badges
  const defaultBadges = [
    {
      text: `${planName} Active`,
      className: "flex items-center px-3 py-1.5 bg-[#F1C40F]/20 backdrop-blur-sm rounded-full border border-[#F1C40F]/30",
      icon: () => <div className="w-2 h-2 bg-[#F1C40F] rounded-full animate-pulse mr-2" />
    },
    ...customBadges
  ];

  // Show error state
  if (error && !isRealTimeData) {
    return (
      <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F8FAFC' }}>
        <MediCureOnSidebar onNavigate={onNavigate} activePage={activePage} />
        <div className="flex items-center justify-center flex-1">
          <div className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h2 className="mb-2 text-xl font-semibold text-gray-900">Error Loading Dashboard</h2>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-[#02276F] text-white rounded-lg hover:bg-[#02276F]/90"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state only on initial load
  if (isLoading && !isRealTimeData) {
    return (
      <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F8FAFC' }}>
        <MediCureOnSidebar onNavigate={onNavigate} activePage={activePage} />
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-b-2 border-gray-900 rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600">Loading your {planName} dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F8FAFC' }}>
      <MediCureOnSidebar onNavigate={onNavigate} activePage={activePage} />
      
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
        <MediCureOnHeader
          subtitle={subtitle || `Your ${planName} Dashboard`}
          customBadges={defaultBadges}
          showBackButton={planId !== 'subscription'} // Don't show back button on subscription page
          onBack={() => onNavigate('plans')}
          backButtonText="Back to Plans"
        />

        {/* Development Banner */}
        {showDevelopmentBanner && (
          <div className="px-6 py-2 bg-orange-100 border-b border-orange-300">
            <div className="flex items-center justify-center space-x-2">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">
                Under Development - Data shown is for demonstration purposes only
              </span>
            </div>
          </div>
        )}

        {/* Main Dashboard Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PlanDashboardLayout;