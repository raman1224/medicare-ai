// medicare-nepal/frontend/src/components/dashboard/nav.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  Bell, 
  Search, 
  User, 
  LogOut, 
  Home, 
  Scan, 
  Users, 
  MapPin,
  Activity,
  MessageSquare,
  Droplets,
  Settings,
  MessageCircle
} from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "../theme-toggle";

export default function DashboardNav() {
    const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard", color: "blue" },
    { icon: Scan, label: "Medicine Scan", href: "/scanner", color: "green" },
    { icon: Users, label: "Symptom Check", href: "/symptom-checker", color: "purple" },
    { icon: MapPin, label: "Hospitals", href: "/hospitals", color: "red" },
    { icon: Users, label: "Doctors", href: "/doctors", color: "purple" },
    { icon: Activity, label: "Fitness", href: "/fitness", color: "yellow" },
    { icon: Droplets, label: "Blood", href: "/blood-bank", color: "pink" },
    { icon: MessageSquare, label: "AI", href: "/chat", color: "teal" },
    // { icon: MessageCircle, label: "Messages", href: "/messages", color: "indigo" },
    // { icon: Settings, label: "", href: "/settings", color: "gray" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 glass-effect border-b border-white/10"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3 flex-shrink-0">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl blur-lg opacity-70" />
                <div className="relative w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                   <Image
  src="/logo6.png"
  alt="medicare-nepal"
  width={52}
  height={62}
  className="rounded-xl drop-shadow-md"
  priority={false}
/>
                  </span>
                </div>
              </div>
              <div>
                <span className="text-lg font-bold text-white">Medicare Nepal</span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <motion.div key={item.label} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 px-2 xl:px-3 py-2 rounded-lg text-gray-300 hover:text-white transition-colors hover:bg-white/5 whitespace-nowrap`}
                >
                  <item.icon className={`w-4 h-4 text-${item.color}-400`} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-0.5 flex-shrink-0">


            <Link href="/messages">
            <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-400 hover:text-white transition-colors relative"
            >
              <MessageCircle className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              )}
            </motion.button>
            </Link>
                                   {/* Theme Toggle */}
            <ThemeToggle />

          
            <motion.div 
            whileHover={{ scale: 1.05 }} className="relative">
              <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-300 hidden xl:inline">{user?.name}</span>
              </button>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden xl:inline">Logout</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="lg:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-effect border-t border-white/10"
          >
            <div className="p-4">
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search features..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
                  {/* Theme Toggle in Mobile */}
              <div className="flex justify-end mb-4">
                <ThemeToggle />
              </div>


              {/* Navigation Items */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {navItems.map((item) => (
                  <motion.div
                    key={item.label}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={item.href}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className={`w-6 h-6 text-${item.color}-400 mb-2`} />
                      <span className="text-sm text-gray-300 text-center">{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* User Actions */}
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-0.5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-white font-medium">{user?.name}</div>
                      <div className="text-xs text-gray-400">Patient</div>
                    </div>
                  </div>
                  <Bell className="w-5 h-5 text-gray-400" />
                </button>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}