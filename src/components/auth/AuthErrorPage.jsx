import React, { useEffect, useState } from 'react';
import { RefreshCw, AlertCircle, Home, LogIn, Clock, Shield } from 'lucide-react';

const AuthErrorPage = ({ onNavigate, onBack }) => {
  const [searchParams] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams;
  });
  const [countdown, setCountdown] = useState(10);
  const errorType = searchParams.get('error') || 'auth_failed';

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleRetry();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRetry = () => {
    window.location.href = '/';
  };

  const handleContactSupport = () => {
    window.open('mailto:support@medicureon.com?subject=Authentication Issue', '_blank');
  };

  const getErrorContent = () => {
    switch (errorType) {
      case 'session_timeout':
        return {
          icon: <Clock className="w-16 h-16" style={{ color: '#02276F' }} />,
          title: 'Session Expired',
          message: 'Your session has expired for security reasons. Please sign in again to continue.',
          details: 'For your security, we automatically sign you out after 30 minutes of inactivity.'
        };
      case 'request_method':
        return {
          icon: <AlertCircle className="w-16 h-16" style={{ color: '#F1C40F' }} />,
          title: 'Authentication Error',
          message: 'We encountered a technical issue during sign-in. Please try again.',
          details: 'This is usually a temporary issue that resolves itself quickly.'
        };
      default:
        return {
          icon: <Shield className="w-16 h-16" style={{ color: '#C80C0C' }} />,
          title: 'Sign-In Issue',
          message: 'We\'re having trouble signing you in right now. Please try again.',
          details: 'If this problem persists, please contact our support team for assistance.'
        };
    }
  };

  const errorContent = getErrorContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* MediCureOn Logo - Matching your branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#02276F' }}
            >
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span 
              className="text-2xl font-bold"
              style={{ color: '#02276F' }}
            >
              MediCureOn
            </span>
          </div>
        </div>

        {/* Error Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Error Icon */}
          <div className="text-center mb-6">
            {errorContent.icon}
          </div>

          {/* Error Title */}
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">
            {errorContent.title}
          </h1>

          {/* Error Message */}
          <p className="text-gray-600 text-center mb-4 leading-relaxed">
            {errorContent.message}
          </p>

          {/* Error Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 text-center">
              {errorContent.details}
            </p>
          </div>

          {/* Auto-redirect Notice */}
          <div 
            className="border rounded-lg p-4 mb-6"
            style={{ backgroundColor: '#86B7F7', borderColor: '#02276F' }}
          >
            <div className="flex items-center justify-center space-x-2 text-white">
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">
                Automatically redirecting in {countdown} seconds...
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-all duration-200 flex items-center justify-center space-x-2"
              style={{ backgroundColor: '#02276F' }}
            >
              <LogIn className="w-4 h-4" />
              <span>Try Again Now</span>
            </button>

            <button
              onClick={() => onNavigate ? onNavigate('landing') : (window.location.href = '/')}
              className="w-full text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2"
              style={{ backgroundColor: '#F1C40F' }}
            >
              <Home className="w-4 h-4" />
              <span>Return to Home</span>
            </button>
          </div>

          {/* Support Link */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-500 mb-3">
              Still having trouble?
            </p>
            <button
              onClick={handleContactSupport}
              className="w-full text-sm font-medium transition-colors duration-200 hover:opacity-80"
              style={{ color: '#02276F' }}
            >
              Contact Support Team
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <button
              onClick={() => onNavigate ? onNavigate('terms') : (window.location.href = '/terms')}
              className="hover:opacity-80 transition-colors duration-200"
              style={{ color: '#02276F' }}
            >
              Terms of Use
            </button>
            <button
              onClick={() => onNavigate ? onNavigate('privacy') : (window.location.href = '/privacy')}
              className="hover:opacity-80 transition-colors duration-200"
              style={{ color: '#02276F' }}
            >
              Privacy Policy
            </button>
            <button
              onClick={handleContactSupport}
              className="hover:opacity-80 transition-colors duration-200"
              style={{ color: '#02276F' }}
            >
              Support
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            © 2024 MediCureOn. Your Health, Our Priority.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthErrorPage;