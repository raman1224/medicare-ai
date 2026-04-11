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
  FileText
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
  { icon: Users, label: "Symptoms Checker", href: "/symptom-checker", color: "purple" },
  { icon: MapPin, label: "Hospitals", href: "/hospitals", color: "red" },
  { icon: Activity, label: "Fitness", href: "/fitness", color: "yellow" },
  { icon: Droplets, label: "Blood Bank", href: "/blood-bank", color: "pink" },
  { icon: MessageSquare, label: "AI Chat", href: "/chat", color: "teal" },
];

const privateNavItems: NavItem[] = [
    { icon: Home, label: "Dashboard", href: "/dashboard", color: "blue" },
    { icon: Scan, label: "Medicine Scan", href: "/scanner", color: "green" },
    { icon: Users, label: "Symptoms Check", href: "/symptom-checker", color: "purple" },
    { icon: MapPin, label: "Hospitals", href: "/hospitals", color: "red" },
        { icon: Users, label: "Doctors", href: "/doctors", color: "purple" },
    { icon: Activity, label: "Fitness", href: "/fitness", color: "yellow" },
        { icon: Droplets, label: "Blood", href: "/blood-bank", color: "pink" },
    { icon: MessageSquare, label: "AI ", href: "/chat", color: "teal" },
        { icon: MessageCircle, label: "Messages", href: "/messages", color: "indigo" },
    { icon: Settings, label: "Settings", href: "/settings", color: "gray" },
];

// Mock auth hook - replace with your actual auth logic
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Mock user data - replace with API call
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

// Main Navigation Component
export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
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
  }, [pathname]);

  // Get current nav items based on auth state
  const navItems = user ? privateNavItems : publicNavItems;

  // Loading state
  if (loading) {
    return (
      <nav className="fixed top-0 w-full z-50 bg-gray-900/50 backdrop-blur-sm py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-800 rounded-2xl animate-pulse" />
              <div className="hidden sm:block">
                <div className="w-32 h-6 bg-gray-800 rounded animate-pulse mb-2" />
                <div className="w-20 h-4 bg-gray-800 rounded animate-pulse" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-800 rounded-full animate-pulse" />
              <div className="w-24 h-10 bg-gray-800 rounded-full animate-pulse" />
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
            ? 'bg-gray-900/95 backdrop-blur-xl py-2 shadow-2xl shadow-primary/5 border-b border-white/10' 
            : 'bg-gradient-to-b from-black/80 via-black/50 to-transparent backdrop-blur-sm py-4'
          }
        `}
      >
        <div className="container mx-auto px-1 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-2xl flex items-center justify-center overflow-hidden border border-white/10">
                  <Image
                    src="/logo6.png"
                    alt="Medicare Nepal"
                    width={48}
                    height={48}
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                    priority
                  />
                </div>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-lg sm:text-xl font-bold text-white">Medicare</span>
                <span className="text-xs sm:text-sm text-gray-400">Nepal</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.slice(0, 6).map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 relative group
                      ${isActive 
                        ? 'bg-white/10 text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <item.icon className={`w-4 h-4 text-${item.color}-400`} />
                    <span className="text-sm whitespace-nowrap">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
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
              <button
                className="p-2 text-gray-400 hover:text-white transition-colors relative group"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

                            <ThemeToggle />
              

              {/* Notifications - Only for logged in users */}
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 text-gray-400 hover:text-white transition-colors relative group"
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
                          className="absolute right-0 mt-2 w-80 bg-gray-900 rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50"
                        >
                          <div className="p-3 border-b border-white/10">
                            <h3 className="text-white font-semibold">Notifications</h3>
                          </div>
                          <div className="max-h-96 overflow-y-auto">
                            <div className="p-4 text-center text-gray-400">
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
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                      {user.avatar ? (
                        <Image src={user.avatar} alt={user.name} width={32} height={32} className="rounded-full" />
                      ) : (
                        <span className="text-sm font-medium text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-300 max-w-[100px] truncate hidden xl:block">
                      {user.name}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
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
                          className="absolute right-0 mt-2 w-64 bg-gray-900 rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50"
                        >
                          <div className="p-3 border-b border-white/10">
                            <div className="text-white font-medium text-sm">{user.name}</div>
                            <div className="text-xs text-gray-400 truncate">{user.email}</div>
                            <div className="mt-1 text-xs text-primary capitalize">{user.role}</div>
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
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
                                onClick={() => setUserMenuOpen(false)}
                              >
                                <item.icon className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">{item.label}</span>
                              </Link>
                            ))}
                          </div>
                          <div className="p-2 border-t border-white/10">
                            <button
                              onClick={() => {
                                setUserMenuOpen(false);
                                logout();
                              }}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors text-red-400 w-full"
                            >
                              <LogOut className="w-4 h-4" />
                              <span className="text-sm">Logout</span>
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
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-primary via-secondary to-accent text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 text-sm"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
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
              className="lg:hidden bg-gray-900/95 backdrop-blur-xl border-t border-white/10 mt-2"
            >
              <div className="container mx-auto px-4 py-4">
                {/* Mobile Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                  {/* Theme Toggle in Mobile */}
                <div className="flex justify-end mb-4">
                  <ThemeToggle />
                </div>

                {/* Navigation Grid */}
                <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className={`p-2 rounded-lg bg-${item.color}-500/20 mb-2 group-hover:scale-110 transition-transform`}>
                        <item.icon className={`w-5 h-5 text-${item.color}-400`} />
                      </div>
                      <span className="text-xs text-gray-300 text-center">{item.label}</span>
                    </Link>
                  ))}
                </div>

                {/* Mobile Auth Section */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-white font-medium text-sm">{user.name}</div>
                            <div className="text-xs text-gray-400 capitalize">{user.role}</div>
                          </div>
                        </div>
                        <Bell className="w-5 h-5 text-gray-400" />
                      </div>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        href="/auth/login"
                        className="block w-full py-3 text-center text-gray-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/auth/register"
                        className="block w-full py-3 text-center rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold"
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