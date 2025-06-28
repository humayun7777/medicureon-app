import React from 'react';
import { ArrowLeft, Calendar, Shield, FileText, AlertTriangle, User } from 'lucide-react';

const TermsOfUsePage = ({ onNavigate, onBack }) => {

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Matching your Landing Page style */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onBack ? onBack() : window.history.back()}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#02276F' }}
                >
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span 
                  className="text-xl font-bold"
                  style={{ color: '#02276F' }}
                >
                  MediCureOn
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-500 flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Last updated: December 2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Title Section */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="w-8 h-8" style={{ color: '#02276F' }} />
              <h1 className="text-3xl font-bold text-gray-900">Terms of Use</h1>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              Welcome to MediCureOn. These Terms of Use govern your access to and use of our healthcare platform, 
              including our website, mobile applications, and related services.
            </p>
          </div>

          {/* Important Notice */}
          <div 
            className="p-6 border-b border-gray-100"
            style={{ backgroundColor: '#F1C40F', backgroundColor: 'rgba(241, 196, 15, 0.1)' }}
          >
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 mt-0.5" style={{ color: '#F1C40F' }} />
              <div>
                <h3 className="font-semibold mb-2" style={{ color: '#02276F' }}>Important Healthcare Notice</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#02276F' }}>
                  MediCureOn provides health information and connectivity services but does not provide medical advice, 
                  diagnosis, or treatment. Always consult with qualified healthcare providers for medical decisions.
                </p>
              </div>
            </div>
          </div>

          {/* Terms Content */}
          <div className="p-8 space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span 
                  className="text-white text-sm font-bold px-2 py-1 rounded"
                  style={{ backgroundColor: '#02276F' }}
                >
                  1
                </span>
                <span>Acceptance of Terms</span>
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  By accessing or using MediCureOn's services, you agree to be bound by these Terms of Use and our Privacy Policy. 
                  If you do not agree to these terms, please do not use our services.
                </p>
                <p>
                  We may update these terms from time to time. Your continued use of our services after any changes 
                  constitutes acceptance of the new terms.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span 
                  className="text-white text-sm font-bold px-2 py-1 rounded"
                  style={{ backgroundColor: '#02276F' }}
                >
                  2
                </span>
                <span>Description of Service</span>
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  MediCureOn is a healthcare platform that provides:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Personal health data tracking and management</li>
                  <li>Integration with health devices and Apple Health</li>
                  <li>Telehealth consultation scheduling and management</li>
                  <li>Health insights and analytics</li>
                  <li>Subscription-based healthcare plans</li>
                  <li>Secure health data storage and sharing</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span 
                  className="text-white text-sm font-bold px-2 py-1 rounded"
                  style={{ backgroundColor: '#02276F' }}
                >
                  3
                </span>
                <span>User Responsibilities</span>
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>As a user of MediCureOn, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Use the service only for lawful purposes</li>
                  <li>Respect the privacy and rights of other users</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Not misuse or attempt to gain unauthorized access to our systems</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span 
                  className="text-white text-sm font-bold px-2 py-1 rounded"
                  style={{ backgroundColor: '#02276F' }}
                >
                  4
                </span>
                <span>Health Information and Medical Disclaimer</span>
              </h2>
              <div className="text-gray-700 space-y-4">
                <div 
                  className="border rounded-lg p-4"
                  style={{ backgroundColor: '#FFE5E5', borderColor: '#C80C0C' }}
                >
                  <p style={{ color: '#C80C0C' }} className="font-medium">
                    <strong>Medical Disclaimer:</strong> MediCureOn is not a healthcare provider and does not provide 
                    medical advice, diagnosis, or treatment. The information and services provided through our platform 
                    are for informational purposes only.
                  </p>
                </div>
                <p>
                  You acknowledge that:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Our platform is not a substitute for professional medical advice</li>
                  <li>You should always consult with qualified healthcare providers</li>
                  <li>Emergency medical situations require immediate professional care</li>
                  <li>We do not validate the accuracy of user-provided health data</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span 
                  className="text-white text-sm font-bold px-2 py-1 rounded"
                  style={{ backgroundColor: '#02276F' }}
                >
                  5
                </span>
                <span>Privacy and Data Protection</span>
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  Your privacy is important to us. Our collection, use, and protection of your personal and health 
                  information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
                </p>
                <p>
                  By using our services, you consent to the collection and use of your information as described 
                  in our Privacy Policy, including compliance with HIPAA and other applicable healthcare privacy laws.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span 
                  className="text-white text-sm font-bold px-2 py-1 rounded"
                  style={{ backgroundColor: '#02276F' }}
                >
                  6
                </span>
                <span>Subscription and Payment Terms</span>
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  MediCureOn offers various subscription plans with different features and pricing. By subscribing, you agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Pay all applicable fees according to your chosen plan</li>
                  <li>Automatic renewal unless cancelled before the renewal date</li>
                  <li>Our refund policy as stated in your subscription agreement</li>
                  <li>Price changes with 30 days advance notice</li>
                </ul>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span 
                  className="text-white text-sm font-bold px-2 py-1 rounded"
                  style={{ backgroundColor: '#02276F' }}
                >
                  7
                </span>
                <span>Contact Information</span>
              </h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  If you have questions about these Terms of Use, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    <p><strong>Email:</strong> legal@medicureon.com</p>
                    <p><strong>Address:</strong> MediCureOn Legal Department</p>
                    <p><strong>Phone:</strong> 1-800-MEDICURE</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-100 rounded-b-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Protected by enterprise-grade security</span>
              </div>
              <div className="text-sm text-gray-500">
                Effective Date: December 10, 2024
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUsePage;