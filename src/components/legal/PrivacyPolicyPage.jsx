import React, { useState } from 'react';
import { ArrowLeft, Shield, Eye, Lock, Cookie, Database, UserCheck, FileText, Calendar, ChevronDown, ChevronRight } from 'lucide-react';

const PrivacyPolicyPage = ({ onNavigate, onBack }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const CollapsibleSection = ({ id, title, icon, children, defaultExpanded = false }) => {
    const isExpanded = expandedSections[id] ?? defaultExpanded;
    
    return (
      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleSection(id)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            {icon}
            <h3 className="font-semibold text-gray-900 text-left">{title}</h3>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </button>
        {isExpanded && (
          <div className="p-4 pt-0 border-t border-gray-100">
            {children}
          </div>
        )}
      </div>
    );
  };

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
              <Shield className="w-8 h-8" style={{ color: '#02276F' }} />
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy & Cookie Notice</h1>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              At MediCureOn, we take your privacy seriously. This policy explains how we collect, use, protect, 
              and share your personal and health information when you use our healthcare platform.
            </p>
          </div>

          {/* HIPAA Compliance Notice */}
          <div 
            className="p-6 border-b border-gray-100"
            style={{ backgroundColor: 'rgba(134, 183, 247, 0.1)' }}
          >
            <div className="flex items-start space-x-3">
              <UserCheck className="w-6 h-6 mt-0.5" style={{ color: '#86B7F7' }} />
              <div>
                <h3 className="font-semibold mb-2" style={{ color: '#02276F' }}>HIPAA Compliance</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#02276F' }}>
                  MediCureOn is committed to protecting your health information in compliance with HIPAA 
                  (Health Insurance Portability and Accountability Act) and other applicable healthcare privacy laws.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Content */}
          <div className="p-8 space-y-6">
            {/* Quick Summary */}
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: 'rgba(2, 39, 111, 0.05)' }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Privacy at a Glance</h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start space-x-2">
                  <Lock className="w-4 h-4 mt-0.5" style={{ color: '#00FC14' }} />
                  <span className="text-gray-700">Your health data is encrypted and secure</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Eye className="w-4 h-4 mt-0.5" style={{ color: '#00FC14' }} />
                  <span className="text-gray-700">You control who sees your information</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Database className="w-4 h-4 mt-0.5" style={{ color: '#00FC14' }} />
                  <span className="text-gray-700">Data stored in secure Azure cloud</span>
                </div>
                <div className="flex items-start space-x-2">
                  <FileText className="w-4 h-4 mt-0.5" style={{ color: '#00FC14' }} />
                  <span className="text-gray-700">Full transparency in data usage</span>
                </div>
              </div>
            </div>

            {/* Collapsible Sections */}
            <div className="space-y-4">
              <CollapsibleSection
                id="data-collection"
                title="What Information We Collect"
                icon={<Database className="w-5 h-5" style={{ color: '#02276F' }} />}
                defaultExpanded={true}
              >
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Personal Information:</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>Name, email address, phone number, date of birth</li>
                      <li>Address and emergency contact information</li>
                      <li>Profile picture (optional)</li>
                      <li>Account preferences and settings</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Health Information:</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>Health metrics from connected devices (steps, heart rate, sleep)</li>
                      <li>Medical conditions, allergies, and medications</li>
                      <li>Health goals and progress tracking</li>
                      <li>Apple Health data (with your permission)</li>
                      <li>Telehealth consultation records</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Usage Information:</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>How you use our platform and features</li>
                      <li>Device information and browser type</li>
                      <li>Log files and analytics data</li>
                    </ul>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                id="data-usage"
                title="How We Use Your Information"
                icon={<Eye className="w-5 h-5" style={{ color: '#00FC14' }} />}
              >
                <div className="space-y-4 text-gray-700">
                  <p>We use your information to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-sm">
                    <li><strong>Provide Services:</strong> Deliver healthcare platform features, health tracking, and telehealth services</li>
                    <li><strong>Personalize Experience:</strong> Customize health insights and recommendations</li>
                    <li><strong>Improve Platform:</strong> Analyze usage patterns to enhance our services</li>
                    <li><strong>Communicate:</strong> Send important updates, health reminders, and support messages</li>
                    <li><strong>Compliance:</strong> Meet legal and regulatory requirements</li>
                    <li><strong>Security:</strong> Protect against fraud and unauthorized access</li>
                  </ul>
                  <div 
                    className="border rounded-lg p-3 mt-4"
                    style={{ backgroundColor: 'rgba(0, 252, 20, 0.1)', borderColor: '#00FC14' }}
                  >
                    <p className="text-sm" style={{ color: '#02276F' }}>
                      <strong>Important:</strong> We never sell your personal or health information to third parties.
                    </p>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                id="data-security"
                title="How We Protect Your Information"
                icon={<Lock className="w-5 h-5" style={{ color: '#C80C0C' }} />}
              >
                <div className="space-y-4 text-gray-700">
                  <p>We implement multiple layers of security to protect your information:</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Technical Safeguards:</h4>
                        <ul className="text-sm space-y-1">
                          <li>• End-to-end encryption</li>
                          <li>• Secure Azure cloud infrastructure</li>
                          <li>• Multi-factor authentication</li>
                          <li>• Regular security audits</li>
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Administrative Safeguards:</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Employee access controls</li>
                          <li>• Privacy training programs</li>
                          <li>• Incident response procedures</li>
                          <li>• Regular compliance reviews</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="border rounded-lg p-3"
                    style={{ backgroundColor: 'rgba(200, 12, 12, 0.1)', borderColor: '#C80C0C' }}
                  >
                    <p className="text-sm" style={{ color: '#C80C0C' }}>
                      <strong>Data Breach Notification:</strong> In the unlikely event of a data breach affecting your information, 
                      we will notify you within 72 hours as required by law.
                    </p>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                id="cookies"
                title="Cookies and Tracking Technologies"
                icon={<Cookie className="w-5 h-5" style={{ color: '#F1C40F' }} />}
              >
                <div className="space-y-4 text-gray-700">
                  <p>We use cookies and similar technologies to improve your experience:</p>
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Essential Cookies:</h4>
                      <p className="text-sm">Required for basic platform functionality, security, and authentication. These cannot be disabled.</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Analytics Cookies:</h4>
                      <p className="text-sm">Help us understand how you use our platform to improve performance and user experience.</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Preference Cookies:</h4>
                      <p className="text-sm">Remember your settings and preferences to personalize your experience.</p>
                    </div>
                  </div>
                  <div 
                    className="border rounded-lg p-4"
                    style={{ backgroundColor: 'rgba(241, 196, 15, 0.1)', borderColor: '#F1C40F' }}
                  >
                    <h4 className="font-medium mb-2" style={{ color: '#02276F' }}>Cookie Control:</h4>
                    <p className="text-sm" style={{ color: '#02276F' }}>
                      You can manage cookie preferences in your browser settings. Note that disabling certain cookies may limit platform functionality.
                    </p>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                id="your-rights"
                title="Your Privacy Rights"
                icon={<Shield className="w-5 h-5" style={{ color: '#86B7F7' }} />}
              >
                <div className="space-y-4 text-gray-700">
                  <p>You have the following rights regarding your personal information:</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#86B7F7' }}></div>
                        <div>
                          <h4 className="font-medium text-gray-900">Access</h4>
                          <p className="text-sm">Request copies of your personal information</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#86B7F7' }}></div>
                        <div>
                          <h4 className="font-medium text-gray-900">Rectification</h4>
                          <p className="text-sm">Request correction of inaccurate information</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#86B7F7' }}></div>
                        <div>
                          <h4 className="font-medium text-gray-900">Erasure</h4>
                          <p className="text-sm">Request deletion of your personal information</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#86B7F7' }}></div>
                        <div>
                          <h4 className="font-medium text-gray-900">Portability</h4>
                          <p className="text-sm">Request transfer of your data to another service</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#86B7F7' }}></div>
                        <div>
                          <h4 className="font-medium text-gray-900">Restriction</h4>
                          <p className="text-sm">Request limitation of data processing</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#86B7F7' }}></div>
                        <div>
                          <h4 className="font-medium text-gray-900">Objection</h4>
                          <p className="text-sm">Object to certain types of data processing</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="border rounded-lg p-4"
                    style={{ backgroundColor: 'rgba(134, 183, 247, 0.1)', borderColor: '#86B7F7' }}
                  >
                    <p className="text-sm" style={{ color: '#02276F' }}>
                      <strong>Exercise Your Rights:</strong> Contact us at privacy@medicureon.com to exercise any of these rights. 
                      We will respond within 30 days.
                    </p>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                id="contact"
                title="Contact Information"
                icon={<FileText className="w-5 h-5 text-gray-600" />}
              >
                <div className="space-y-4 text-gray-700">
                  <p>For privacy-related questions or concerns, please contact us:</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2 text-sm">
                      <p><strong>Privacy Officer:</strong> privacy@medicureon.com</p>
                      <p><strong>Data Protection Officer:</strong> dpo@medicureon.com</p>
                      <p><strong>General Support:</strong> support@medicureon.com</p>
                      <p><strong>Phone:</strong> 1-800-MEDICURE</p>
                      <p><strong>Mail:</strong> MediCureOn Privacy Department<br />
                      [Your Business Address]</p>
                    </div>
                  </div>
                  <p className="text-sm">
                    We are committed to resolving any privacy concerns promptly and transparently.
                  </p>
                </div>
              </CollapsibleSection>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-100 rounded-b-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>HIPAA Compliant • SOC 2 Certified • GDPR Ready</span>
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

export default PrivacyPolicyPage;