"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import ProtectedRoute from "@/components/auth/protected-route";
import DashboardNav from "@/components/dashboard/nav";
import Navigation from "@/components/navigation";
import { 
  Pill, 
  Stethoscope, 
  MessageSquare, 
  MapPin, 
  Droplets, 
  Activity, 
  Brain, 
  Users,
  Calendar,
  HeartPulse,
  TrendingUp,
  Bell,
  Clock,
  Award
} from "lucide-react";
import Footer from "@/components/footer";

const healthMetrics = [
  { label: "Steps Today", value: "8,542", unit: "steps", icon: Activity, change: "+12%" },
  { label: "Sleep", value: "7.2", unit: "hours", icon: Clock, change: "+0.5h" },
  { label: "Heart Rate", value: "72", unit: "bpm", icon: HeartPulse, change: "-2" },
  { label: "BMI", value: "22.3", unit: "@/m²", icon: TrendingUp, change: "-0.3" },
];

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

const recentActivities = [
  { time: "10:30 AM", action: "Medicine scanned", type: "success" },
  { time: "Yesterday", action: "Chat with AI Health Assistant", type: "info" },
  { time: "2 days ago", action: "Hospital appointment booked", type: "success" },
  { time: "1 week ago", action: "Blood donation request", type: "warning" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  return (
//     Token check
// User exists
// Redirect if not logged in
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950">
        <DashboardNav />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Welcome back, <span className="text-gradient">{user?.name}</span> 👋
                </h1>
                <p className="text-gray-400 mt-2">
                  Your health dashboard • {user?.country} • {user?.language}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 rounded-xl glass-card text-white flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <span className="text-white font-bold">{user?.name?.charAt(0)}</span>
                </div>
              </div>
            </div>

            {/* Health Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {healthMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="p-6 rounded-2xl glass-card hover-lift"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                      <span className={`text-sm font-medium ${
                        metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {metric.change}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {metric.value}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {metric.label} • {metric.unit}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
              <Link href="/features" className="text-primary hover:text-primary/80">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={action.href}
                      className="block p-4 rounded-2xl glass-card text-center hover:border-white/20 transition-all group"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${action.color}-500/20 to-${action.color}-500/10 mx-auto mb-3 flex items-center justify-center group-hover:from-${action.color}-500/30 group-hover:to-${action.color}-500/20 transition-all`}>
                        <Icon className={`w-6 h-6 text-${action.color}-400`} />
                      </div>
                      <span className="text-sm text-white font-medium">{action.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="flex gap-2 mb-6 p-1 rounded-xl bg-white/5">
                {["overview", "health", "medicines", "appointments"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                      activeTab === tab
                        ? "bg-gradient-to-r from-primary to-secondary text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Active Tab Content */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Emergency Card */}
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-red-500/10 to-red-500/5 border border-red-500/20">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Emergency Services</h3>
                        <p className="text-gray-300">24/7 emergency support available</p>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium">
                        🚨 Critical
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button className="py-3 rounded-xl bg-red-500/20 text-red-400 font-medium hover:bg-red-500/30 transition-colors">
                        🚑 Call Ambulance
                      </button>
                      <button className="py-3 rounded-xl glass-card text-white font-medium hover:bg-white/10 transition-colors">
                        📍 Nearest Hospital
                      </button>
                    </div>
                  </div>

                  {/* Health Insights */}
                  <div className="p-6 rounded-2xl glass-card">
                    <h3 className="text-xl font-bold text-white mb-4">Health Insights</h3>
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-green-400 font-medium">✓ Good Progress</span>
                          <Award className="w-5 h-5 text-green-400" />
                        </div>
                        <p className="text-gray-300 text-sm">
                          You have maintained consistent sleep patterns this week. Keep it up!
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-yellow-400 font-medium">⚠️ Needs Attention</span>
                          <Activity className="w-5 h-5 text-yellow-400" />
                        </div>
                        <p className="text-gray-300 text-sm">
                          Step count 15% below target. Try a 30-minute walk today.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <div className="p-6 rounded-2xl glass-card">
                <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'success' ? 'bg-green-500' :
                        activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div>
                        <p className="text-white text-sm">{activity.action}</p>
                        <p className="text-gray-400 text-xs">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 rounded-lg text-primary hover:bg-white/5 transition-colors">
                  View all activity →
                </button>
              </div>

              {/* Health Tips */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10">
                <h3 className="text-xl font-bold text-white mb-4">💡 Health Tip</h3>
                <p className="text-gray-300 mb-4">
                  Stay hydrated! Drink at least 8 glasses of water daily for optimal health.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Daily Goal</span>
                  <span className="text-green-400">2.5L / 3L</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: '83%' }} />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="p-6 rounded-2xl glass-card">
                <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">AI Consultations</span>
                    <span className="text-white font-medium">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Medicines Scanned</span>
                    <span className="text-white font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Steps This Week</span>
                    <span className="text-white font-medium">59,842</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sleep Average</span>
                    <span className="text-white font-medium">7.1h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
              <Footer />
      
    </ProtectedRoute>
  );
}