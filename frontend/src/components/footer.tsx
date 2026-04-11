// frontend/src/components/footer.tsx (Updated Product Section)
"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  Pill, 
  Stethoscope, 
  MessageSquare, 
  MapPin, 
  Droplets, 
  Brain, 
  Users, 
  Calendar 
} from "lucide-react";

const quickActions = [
  { icon: Pill, label: "Medicine Scan", href: "/scanner", color: "blue" },
  { icon: Stethoscope, label: "Symptom Check", href: "/symptom-checker", color: "green" },
  { icon: MessageSquare, label: "AI Chat", href: "/chat", color: "purple" },
  { icon: MapPin, label: "Find Hospital", href: "/hospitals", color: "red" },
  { icon: Droplets, label: "Blood Bank", href: "/blood-bank", color: "pink" },
  { icon: Brain, label: "X-Ray Analysis", href: "/xray", color: "indigo" },
  { icon: Users, label: "Doctors", href: "/doctors", color: "teal" },
  { icon: Calendar, label: "Appointments", href: "/appointments", color: "orange" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Section - Column 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo6.png"
                  alt="Medicare Nepal Logo"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <h3 className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Medicare Nepal
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Your trusted AI-powered healthcare companion in Nepal.
            </p>
          </div>

          {/* Product Links - Column 2 (First 4 items) */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Access</h4>
            <ul className="space-y-2">
              {quickActions.slice(0, 4).map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    <item.icon className={`w-4 h-4 text-${item.color}-500 dark:text-${item.color}-400 group-hover:scale-110 transition-transform`} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Links - Column 3 (Last 4 items) */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">More Services</h4>
            <ul className="space-y-2">
              {quickActions.slice(4, 8).map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    <item.icon className={`w-4 h-4 text-${item.color}-500 dark:text-${item.color}-400 group-hover:scale-110 transition-transform`} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Company - Column 4 */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
              
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* Bottom Bar with DANGOL AI Attribution */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
           {/* DANGOL AI Attribution */}
          <div className="flex items-center gap-2 text-md text-gray-500 dark:text-gray-500">
  <div className="relative w-15 h-15">
                <Image
                  src="/g5.png"
                  alt="dangol ai Logo"
                  fill
                  className="rounded-full object-cover"
                />
              </div>          
                <span className="text-gray-500 dark:text-gray-500">Developed by</span>
            <a
              href="https://raman1224.github.io/DANGOL_AI/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 group"
            >
              <span className="font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                DANGOL AI
              </span>
          
            </a>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            &copy; {new Date().getFullYear()} Medicare Nepal. All rights reserved.
          </p>
          
         
        </div>
      </div>
    </footer>
  );
}