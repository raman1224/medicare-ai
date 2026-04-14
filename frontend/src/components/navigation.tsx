"use client";

import { useState, useEffect, useCallback, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  Search, 
  User, 
  Scan, 
  Users, 
  MapPin,
  Activity,
  MessageSquare,
  Droplets,
  MessageCircle,
  LogOut,
  Home,
  Settings,
  Bell,
  ChevronDown,
  Heart,
  Calendar,
  FileText,
  Stethoscope,
  Pill
} from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";

// Types
interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  color: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'patient' | 'doctor' | 'admin';
}

// Navigation items for both states
const publicNavItems: NavItem[] = [
  { icon: Scan, label: "Medicine Scanner", href: "/scanner", color: "green" },
  { icon: Stethoscope, label: "Symptoms Checker", href: "/symptom-checker", color: "purple" },
  { icon: MapPin, label: "Hospitals", href: "/hospitals", color: "red" },
  { icon: Activity, label: "Fitness", href: "/fitness", color: "yellow" },
  { icon: Droplets, label: "Blood Bank", href: "/blood-bank", color: "pink" },
  { icon: MessageSquare, label: "AI Chat", href: "/chat", color: "teal" },
];

const privateNavItems: NavItem[] = [
  { icon: Home, label: "Dashboard", href: "/dashboard", color: "blue" },
  { icon: Scan, label: "Medicine Scan", href: "/scanner", color: "green" },
  { icon: Stethoscope, label: "Symptoms Check", href: "/symptom-checker", color: "purple" },
  { icon: MapPin, label: "Hospitals", href: "/hospitals", color: "red" },
  { icon: Users, label: "Doctors", href: "/doctors", color: "purple" },
  { icon: Activity, label: "Fitness", href: "/fitness", color: "yellow" },
  { icon: Droplets, label: "Blood", href: "/blood-bank", color: "pink" },
  { icon: MessageSquare, label: "AI Chat", href: "/chat", color: "teal" },
  { icon: MessageCircle, label: "Messages", href: "/messages", color: "indigo" },
  { icon: Settings, label: "Settings", href: "/settings", color: "gray" },
];

// Mock auth hook - replace with your actual auth logic
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          setUser({
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'patient',
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/';
  }, []);

  return { user, loading, logout };
};

// Helper function to get color classes
const getColorClasses = (color: string, isActive: boolean = false) => {
  const colors: Record<string, { icon: string; bg: string; activeBg: string; hoverBg: string }> = {
    green: { icon: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/30", activeBg: "bg-green-100 dark:bg-green-900/50", hoverBg: "hover:bg-green-50 dark:hover:bg-green-950/20" },
    purple: { icon: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950/30", activeBg: "bg-purple-100 dark:bg-purple-900/50", hoverBg: "hover:bg-purple-50 dark:hover:bg-purple-950/20" },
    red: { icon: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", activeBg: "bg-red-100 dark:bg-red-900/50", hoverBg: "hover:bg-red-50 dark:hover:bg-red-950/20" },
    yellow: { icon: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-950/30", activeBg: "bg-yellow-100 dark:bg-yellow-900/50", hoverBg: "hover:bg-yellow-50 dark:hover:bg-yellow-950/20" },
    pink: { icon: "text-pink-600 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-950/30", activeBg: "bg-pink-100 dark:bg-pink-900/50", hoverBg: "hover:bg-pink-50 dark:hover:bg-pink-950/20" },
    teal: { icon: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-950/30", activeBg: "bg-teal-100 dark:bg-teal-900/50", hoverBg: "hover:bg-teal-50 dark:hover:bg-teal-950/20" },
    blue: { icon: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30", activeBg: "bg-blue-100 dark:bg-blue-900/50", hoverBg: "hover:bg-blue-50 dark:hover:bg-blue-950/20" },
    indigo: { icon: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/30", activeBg: "bg-indigo-100 dark:bg-indigo-900/50", hoverBg: "hover:bg-indigo-50 dark:hover:bg-indigo-950/20" },
    gray: { icon: "text-gray-600 dark:text-gray-400", bg: "bg-gray-50 dark:bg-gray-800/30", activeBg: "bg-gray-100 dark:bg-gray-700/50", hoverBg: "hover:bg-gray-50 dark:hover:bg-gray-800/20" },
  };
  return colors[color] || colors.gray;
};

// Main Navigation Component
export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [unreadCount] = useState(3);
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Get current nav items based on auth state
  const navItems = user ? privateNavItems : publicNavItems;

  // Loading state
  if (loading) {
    return (
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-4 border-b border-gray-200 dark:border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
              <div className="hidden sm:block">
                <div className="w-32 h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
                <div className="w-20 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
              <div className="w-24 h-10 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`
          fixed top-0 w-full z-50 transition-all duration-300
          ${scrolled 
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg dark:shadow-2xl dark:shadow-primary/5 border-b border-gray-200 dark:border-white/10' 
            : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-white/5'
          }
        `}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo - Rounded design */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                {/* Animated gradient ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-secondary to-accent blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary/30 dark:to-secondary/30 rounded-full flex items-center justify-center overflow-hidden border-2 border-white dark:border-gray-700 shadow-lg">
                  <Image
                    src="/logo6.png"
                    alt="Medicare Nepal"
                    width={48}
                    height={48}
                    className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-full"
                    priority
                  />
                </div>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Medicare
                </span>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Nepal</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.slice(0, 6).map((item) => {
                const isActive = pathname === item.href;
                const colorClasses = getColorClasses(item.color, isActive);
                
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 relative group
                      ${isActive 
                        ? `${colorClasses.activeBg} ${colorClasses.icon} shadow-sm` 
                        : `text-gray-600 dark:text-gray-400 ${colorClasses.hoverBg} hover:${colorClasses.icon}`
                      }
                    `}
                  >
                    <item.icon className={`w-4 h-4 transition-colors ${isActive ? colorClasses.icon : 'group-hover:' + colorClasses.icon}`} />
                    <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300 relative group"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                
                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                    >
                      <div className="p-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search medicines, doctors, hospitals..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            autoFocus
                          />
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Quick searches:</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {["Paracetamol", "Hospitals", "Blood Donation", "Doctor"].map((term) => (
                              <button key={term} className="px-2 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                {term}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <ThemeToggle />

              {/* Notifications - Only for logged in users */}
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all relative group"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                      </>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  <AnimatePresence>
                    {notificationsOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setNotificationsOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                        >
                          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-gray-900 dark:text-white font-semibold">Notifications</h3>
                          </div>
                          <div className="max-h-96 overflow-y-auto">
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No new notifications</p>
                            </div>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Auth Section */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-md">
                      {user.avatar ? (
                        <Image src={user.avatar} alt={user.name} width={36} height={36} className="rounded-full" />
                      ) : (
                        <span className="text-sm font-medium text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate hidden xl:block">
                      {user.name}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Menu Dropdown */}
                  <AnimatePresence>
                    {userMenuOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setUserMenuOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                        >
                          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="text-gray-900 dark:text-white font-medium text-sm">{user.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{user.email}</div>
                            <div className="mt-2">
                              <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary">
                                {user.role}
                              </span>
                            </div>
                          </div>
                          <div className="p-2">
                            {[
                              { icon: User, label: "Profile", href: "/profile" },
                              { icon: FileText, label: "Medical Records", href: "/records" },
                              { icon: Calendar, label: "Appointments", href: "/appointments" },
                              { icon: Heart, label: "Favorites", href: "/favorites" },
                              { icon: Settings, label: "Settings", href: "/settings" },
                            ].map((item) => (
                              <Link
                                key={item.label}
                                href={item.href}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                onClick={() => setUserMenuOpen(false)}
                              >
                                <item.icon className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">{item.label}</span>
                              </Link>
                            ))}
                          </div>
                          <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                            <button
                              onClick={() => {
                                setUserMenuOpen(false);
                                logout();
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              <span className="text-sm font-medium">Logout</span>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    <span className="font-medium">Sign In</span>
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 text-sm"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-white/10"
            >
              <div className="container mx-auto px-4 py-4">
                {/* Mobile Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                {/* Theme Toggle in Mobile */}
                <div className="flex justify-end mb-4">
                  <ThemeToggle />
                </div>

                {/* Navigation Grid */}
                <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto">
                  {navItems.map((item) => {
                    const colorClasses = getColorClasses(item.color);
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300 group"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className={`p-2 rounded-lg ${colorClasses.bg} mb-2 group-hover:scale-110 transition-transform`}>
                          <item.icon className={`w-5 h-5 ${colorClasses.icon}`} />
                        </div>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile Auth Section */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-md">
                            <span className="text-sm font-medium text-white">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-gray-900 dark:text-white font-medium text-sm">{user.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</div>
                          </div>
                        </div>
                        <Bell className="w-5 h-5 text-gray-400" />
                      </div>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        href="/auth/login"
                        className="block w-full py-3 text-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/auth/register"
                        className="block w-full py-3 text-center rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Get Started Free
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-20" />
    </>
  );
}