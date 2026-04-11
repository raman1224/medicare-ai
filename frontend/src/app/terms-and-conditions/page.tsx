// medicare-nepal/frontend/src/app/terms-and-conditions/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Shield, 
  FileText, 
  Scale, 
  AlertCircle, 
  CheckCircle,
  ArrowLeft,
  ExternalLink,
  Clock,
  Users,
  Lock,
  Activity,
  Database,
  Globe,
  Gavel
} from "lucide-react";
import DashboardNav from "@/components/dashboard/nav";

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Header with glass effect matching nav */}
     <DashboardNav />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 dark:bg-primary/20 rounded-2xl mb-6">
            <Scale className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Terms & Conditions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Please read these terms carefully before using Medicare Nepal's services
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
            <Clock className="w-4 h-4" />
            <span>Effective Date: January 1, 2025</span>
            <span className="mx-2">•</span>
            <span>Version 2.1</span>
          </div>
        </motion.div>

        {/* Quick Navigation Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {quickNavItems.map((item, index) => (
            <a
              key={item.label}
              href={`#${item.href}`}
              className="group p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all hover:shadow-lg"
            >
              <item.icon className="w-6 h-6 text-primary mb-2" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">
                {item.label}
              </p>
            </a>
          ))}
        </motion.div>

        {/* Terms Content */}
        <div className="space-y-10">
          {/* Acceptance of Terms */}
          <TermSection 
            icon={CheckCircle}
            title="1. Acceptance of Terms"
            id="acceptance"
          >
            <p className="mb-3">
              By accessing or using Medicare Nepal's website, mobile application, or any related services (collectively, the "Service"), you agree to be bound by these Terms & Conditions. If you disagree with any part of these terms, you may not access the Service.
            </p>
            <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 p-4 rounded-r-xl mt-3">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                <strong>Important:</strong> These terms constitute a legally binding agreement between you and Medicare Nepal. By using our services, you acknowledge that you have read, understood, and agree to be bound by these terms.
              </p>
            </div>
          </TermSection>

          {/* Eligibility */}
          <TermSection 
            icon={Users}
            title="2. Eligibility & Account Registration"
            id="eligibility"
          >
            <p className="mb-3">To use our Service, you must:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-2">
              <li>Be at least 18 years of age or have parental/guardian consent</li>
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain the security of your account credentials</li>
              <li>Promptly update any changes to your information</li>
              <li>Not share your account with unauthorized users</li>
            </ul>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Medicare Nepal reserves the right to suspend or terminate accounts that violate these requirements.
            </p>
          </TermSection>

          {/* Medical Disclaimer */}
          <TermSection 
            icon={Activity}
            title="3. Medical Disclaimer & Emergency Situations"
            id="medical"
            highlight
          >
            <div className="space-y-3">
              <p className="font-semibold text-red-600 dark:text-red-400">
                ⚠️ IMPORTANT MEDICAL DISCLAIMER
              </p>
              <p>
                Medicare Nepal is a healthcare facilitation platform and does not provide direct medical advice, diagnosis, or treatment. The information provided through our Service is for informational purposes only and should not be considered a substitute for professional medical advice.
              </p>
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm">
                  <strong>In case of medical emergency:</strong> Call 102 (Ambulance Service) or visit the nearest hospital immediately. Do not rely on electronic communications for emergency medical needs.
                </p>
              </div>
              <p>
                Always consult with qualified healthcare professionals for medical concerns. Reliance on any information provided by Medicare Nepal is solely at your own risk.
              </p>
            </div>
          </TermSection>

          {/* User Obligations */}
          <TermSection 
            icon={Shield}
            title="4. User Conduct & Obligations"
            id="conduct"
          >
            <p className="mb-3">You agree not to:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {userObligations.map((obligation, idx) => (
                <div key={idx} className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{obligation}</span>
                </div>
              ))}
            </div>
          </TermSection>

          {/* Telemedicine Services */}
          <TermSection 
            icon={Video}
            title="5. Telemedicine & Virtual Consultations"
            id="telemedicine"
          >
            <p className="mb-3">
              Our telemedicine services connect you with licensed healthcare providers. By using these services, you acknowledge:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-2">
              <li>Telemedicine consultations are subject to provider availability</li>
              <li>Not all medical conditions can be diagnosed virtually</li>
              <li>You may be referred for in-person examination when necessary</li>
              <li>Consultations may be recorded for quality and training purposes</li>
              <li>Fees for virtual consultations are non-refundable after service delivery</li>
            </ul>
          </TermSection>

          {/* Prescriptions & Medications */}
          <TermSection 
            icon={FileText}
            title="6. Prescriptions & Medications"
            id="prescriptions"
          >
            <p>
              Prescriptions provided through Medicare Nepal are subject to applicable laws and regulations. We do not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-2 mt-2">
              <li>Dispense controlled substances without proper in-person evaluation</li>
              <li>Guarantee prescription fulfillment at pharmacies</li>
              <li>Assume responsibility for medication side effects or interactions</li>
            </ul>
            <p className="mt-3">
              Always verify prescriptions with your local pharmacist and disclose all medications and supplements you're taking.
            </p>
          </TermSection>

          {/* Payments & Refunds */}
          <TermSection 
            icon={CreditCard}
            title="7. Payments, Fees & Refunds"
            id="payments"
          >
            <p className="mb-3">Our payment terms include:</p>
            <div className="space-y-2">
              <PaymentPolicyItem text="All fees are in Nepalese Rupees (NPR) unless otherwise specified" />
              <PaymentPolicyItem text="Payments must be made through approved payment gateways" />
              <PaymentPolicyItem text="Refunds are processed according to our refund policy" />
              <PaymentPolicyItem text="Cancellation fees may apply for late appointment changes" />
              <PaymentPolicyItem text="Subscription services auto-renew unless cancelled" />
            </div>
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Refund Policy:</strong> Consultations cancelled 24+ hours before appointment receive full refund. Cancellations within 24 hours receive 50% refund. No-shows are non-refundable.
              </p>
            </div>
          </TermSection>

          {/* Privacy & Data Protection */}
          <TermSection 
            icon={Lock}
            title="8. Privacy & Data Protection"
            id="privacy"
          >
            <p>
              Your privacy is critically important to us. Our <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link> explains how we collect, use, and protect your information. By using our Service, you consent to our data practices as described in the Privacy Policy.
            </p>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <Database className="w-4 h-4 text-primary" />
              <span>Data stored in compliance with Nepal's Electronic Transaction Act</span>
            </div>
          </TermSection>

          {/* Intellectual Property */}
          <TermSection 
            icon={Gavel}
            title="9. Intellectual Property"
            id="ip"
          >
            <p>
              All content on Medicare Nepal, including text, graphics, logos, software, and trademarks, is the property of Medicare Nepal or its licensors and is protected by Nepali and international copyright laws. You may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-2 mt-2">
              <li>Copy, modify, or distribute our content without permission</li>
              <li>Use our trademarks without written consent</li>
              <li>Reverse engineer our software or platform</li>
            </ul>
          </TermSection>

          {/* Limitation of Liability */}
          <TermSection 
            icon={AlertCircle}
            title="10. Limitation of Liability"
            id="liability"
          >
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p className="text-sm">
                To the maximum extent permitted by law, Medicare Nepal and its affiliates, officers, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400 mt-2 ml-2">
                <li>Your use or inability to use the Service</li>
                <li>Any conduct or content of any third party on the Service</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              </ul>
            </div>
          </TermSection>

          {/* Termination */}
          <TermSection 
            icon={X}
            title="11. Termination"
            id="termination"
          >
            <p>
              We may terminate or suspend your account immediately, without prior notice, for conduct that violates these Terms & Conditions or is harmful to other users, us, or third parties. Upon termination, your right to use the Service will immediately cease.
            </p>
          </TermSection>

          {/* Governing Law */}
          <TermSection 
            icon={Globe}
            title="12. Governing Law & Dispute Resolution"
            id="law"
          >
            <p>
              These Terms shall be governed by the laws of Nepal. Any disputes arising from these terms or your use of the Service shall be resolved through binding arbitration in Kathmandu, Nepal, in accordance with the Arbitration Act of Nepal.
            </p>
          </TermSection>

          {/* Changes to Terms */}
          <TermSection 
            icon={Clock}
            title="13. Changes to Terms"
            id="changes"
          >
            <p>
              We reserve the right to modify these terms at any time. We will notify users of material changes via email or through the Service. Your continued use of the Service after such modifications constitutes acceptance of the updated terms.
          </p>
          </TermSection>

          {/* Contact Information */}
          <TermSection 
            icon={MessageCircle}
            title="14. Contact Information"
            id="contact"
          >
            <p className="mb-3">
              For questions about these Terms & Conditions, please contact us:
            </p>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p>📧 <strong>Email:</strong> legal@medicarenepal.com</p>
              <p>📞 <strong>Phone:</strong> +977 1-4412345</p>
              <p>📍 <strong>Address:</strong> Medicare Nepal, Hattisar, Kathmandu, Nepal</p>
              <p>🕒 <strong>Legal Hours:</strong> Mon-Fri, 10:00 AM - 5:00 PM NPT</p>
            </div>
          </TermSection>
        </div>

        {/* Acceptance Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800"
        >
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-2xl p-6 text-center">
            <p className="text-gray-800 dark:text-gray-200 mb-4">
              By using Medicare Nepal, you acknowledge that you have read, understood, and agree to these Terms & Conditions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Accept & Continue
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Decline
              </Link>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              Last reviewed: December 2024 | Next review: June 2025
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Helper Components
function TermSection({ 
  icon: Icon, 
  title, 
  children, 
  id, 
  highlight = false 
}: { 
  icon: any; 
  title: string; 
  children: React.ReactNode; 
  id: string;
  highlight?: boolean;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      id={id}
      className={`scroll-mt-20 p-6 rounded-2xl transition-all ${
        highlight 
          ? "bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-800" 
          : "bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700"
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
      </div>
      <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {children}
      </div>
    </motion.section>
  );
}

function PaymentPolicyItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
      <span className="text-sm text-gray-700 dark:text-gray-300">{text}</span>
    </div>
  );
}

// Data
const quickNavItems = [
  { icon: CheckCircle, label: "Acceptance", href: "acceptance" },
  { icon: Users, label: "Eligibility", href: "eligibility" },
  { icon: Activity, label: "Medical", href: "medical" },
  { icon: Shield, label: "Conduct", href: "conduct" },
];

const userObligations = [
  "Use the Service for unlawful purposes",
  "Impersonate healthcare professionals",
  "Share false or misleading medical information",
  "Attempt to hack or disrupt our systems",
  "Harass healthcare providers or staff",
  "Share account credentials with others",
];

// Additional icons needed
const Video = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const CreditCard = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const X = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const MessageCircle = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;