// app/privacy-policy/page.tsx
import React from 'react';
import Link from 'next/link';
import DashboardNav from '@/components/dashboard/nav';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen  bg-gradient-to-b">
      {/* Header with subtle medical/healthcare accent */}
      <DashboardNav />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-gray-400 rounded-full mb-4">
            <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your privacy is critically important to us. At Medicare Nepal, we have a few fundamental principles.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Last updated: December 15, 2025</span>
          </div>
        </div>

        {/* Policy Content */}
        <div className="space-y-8">
          {/* Introduction */}
          <Section title="1. Information We Collect">
            <p className="mb-3">
              Medicare Nepal collects information to provide better services to all our users. We collect information in the following ways:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li><span className="font-medium">Personal Information:</span> Name, email address, phone number, and date of birth when you create an account or schedule appointments.</li>
              <li><span className="font-medium">Health Information:</span> Medical history, prescriptions, lab reports, and other health-related data you provide.</li>
              <li><span className="font-medium">Usage Data:</span> Information about how you interact with our platform, including pages visited and features used.</li>
              <li><span className="font-medium">Payment Information:</span> Billing details and payment method information for processing medical payments.</li>
            </ul>
          </Section>

          {/* How We Use Information */}
          <Section title="2. How We Use Your Information">
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>Provide, maintain, and improve our healthcare services</li>
              <li>Process your medical appointments and prescriptions</li>
              <li>Send you important updates about your health or appointments</li>
              <li>Comply with legal and regulatory requirements in Nepal</li>
              <li>Protect against fraud and unauthorized transactions</li>
              <li>Develop new features and healthcare solutions</li>
            </ul>
          </Section>

          {/* Data Protection */}
          <Section title="3. Data Protection & Security">
            <p className="mb-3">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These include:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <SecurityCard 
                icon="🔒"
                title="Encryption"
                description="256-bit SSL encryption for all data transmission"
              />
              <SecurityCard 
                icon="🏥"
                title="Access Controls"
                description="Strict role-based access to medical records"
              />
              <SecurityCard 
                icon="📋"
                title="Regular Audits"
                description="Monthly security assessments and compliance checks"
              />
              <SecurityCard 
                icon="🇳🇵"
                title="Local Compliance"
                description="Adherence to Nepal's Electronic Transaction Act"
              />
            </div>
          </Section>

          {/* Information Sharing */}
          <Section title="4. Information Sharing & Disclosure">
            <p className="mb-3">
              We do not sell, trade, or rent your personal information to third parties. We may share information only in these circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li><span className="font-medium">Healthcare Providers:</span> With doctors and hospitals to coordinate your care</li>
              <li><span className="font-medium">Legal Requirements:</span> When required by Nepali law or court order</li>
              <li><span className="font-medium">Emergency Situations:</span> To prevent serious harm to you or others</li>
              <li><span className="font-medium">Service Providers:</span> Trusted partners who assist in operating our platform</li>
            </ul>
          </Section>

          {/* Your Rights */}
          <Section title="5. Your Privacy Rights">
            <p className="mb-3">You have the following rights regarding your information:</p>
            <div className="bg-gray-400 rounded-xl p-6 mt-3">
              <div className="grid gap-4">
                <RightItem text="Access your personal information we hold about you" />
                <RightItem text="Correct inaccurate or incomplete information" />
                <RightItem text="Request deletion of your data (subject to legal retention requirements)" />
                <RightItem text="Withdraw consent for data processing" />
                <RightItem text="Receive a copy of your data in a portable format" />
              </div>
            </div>
          </Section>

          {/* Cookies */}
          <Section title="6. Cookies & Tracking">
            <p>
              We use cookies and similar tracking technologies to improve your experience, analyze usage, and personalize content. You can control cookie settings through your browser preferences. Essential cookies cannot be disabled as they are necessary for core platform functionality.
            </p>
          </Section>

          {/* Children's Privacy */}
          <Section title="7. Children's Privacy">
            <p>
              Medicare Nepal does not knowingly collect information from children under 13 years of age. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
            </p>
          </Section>

          {/* International Users */}
          <Section title="8. International Users">
            <p>
              Our servers are located in Nepal. If you are accessing our platform from outside Nepal, please be aware that your information may be transferred to, stored, and processed in Nepal where our data protection laws may differ from those in your jurisdiction.
            </p>
          </Section>

          {/* Contact */}
          <Section title="9. Contact Us">
            <p className="mb-3">
              If you have questions about this Privacy Policy or our data practices, please contact our Data Protection Officer:
            </p>
            <div className="bg-gray-400 rounded-xl p-6 border border-gray-100">
              <div className="space-y-2">
                <ContactItem icon="📧" text="privacy@medicarenepal.com" />
                <ContactItem icon="📞" text="+977 1-4412345" />
                <ContactItem icon="📍" text="Medicare Nepal, Hattisar, Kathmandu, Nepal" />
              </div>
            </div>
          </Section>

          {/* Policy Updates */}
          <div className="bg-gray-400 border border-amber-200 rounded-xl p-5 mt-8">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Policy Updates</p>
                <p>We may update this Privacy Policy periodically. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy regularly.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600 mb-4">
            By using Medicare Nepal, you agree to this Privacy Policy.
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
          >
            Return to Homepage
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="scroll-mt-20" id={title.toLowerCase().replace(/\s+/g, '-')}>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
        {title}
      </h2>
      <div className="text-gray-700 leading-relaxed">{children}</div>
    </div>
  );
}

function SecurityCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-gray-400 rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function RightItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <svg className="w-5 h-5 text-teal-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <span className="text-gray-700">{text}</span>
    </div>
  );
}

function ContactItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-3 text-gray-700">
      <span className="text-lg">{icon}</span>
      <span>{text}</span>
    </div>
  );
}