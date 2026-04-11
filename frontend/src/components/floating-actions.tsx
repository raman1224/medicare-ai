"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  X,
  ArrowUp,
  Heart,
  Shield
} from "lucide-react";

interface ActionItem {
  icon: React.ElementType;
  label: string;
  color: string;
  href: string;
}

export default function FloatingActions() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Show scroll to top button after scrolling
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    
    window.addEventListener("scroll", handleScroll);
    
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const actions: ActionItem[] = [
    { icon: MessageCircle, label: "Live Chat", color: "from-blue-500 to-cyan-500", href: "/chat" },
    { icon: Phone, label: "Emergency", color: "from-red-500 to-pink-500", href: "tel:102" },
    { icon: Mail, label: "Contact", color: "from-purple-500 to-indigo-500", href: "/contact" },
    { icon: Heart, label: "Donate", color: "from-pink-500 to-rose-500", href: "/donate" },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="scroll-top"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 text-white shadow-lg flex items-center justify-center border border-gray-700"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Quick actions menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="quick-actions"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-gray-800 mb-2"
          >
            <div className="flex flex-col gap-2 min-w-[200px]">
              {actions.map((action) => (
                <motion.a
                  key={action.label}
                  href={action.href}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
                    <action.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white">{action.label}</span>
                  <Shield className="w-3 h-3 text-gray-500 ml-auto" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        key="main-fab"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 rounded-full bg-gradient-to-r from-primary via-secondary to-accent shadow-2xl shadow-primary/30 flex items-center justify-center group"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {/* Ripple effect */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary animate-ping opacity-30 group-hover:opacity-50" />
        
        {/* Icon */}
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification badge */}
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-black text-[10px] flex items-center justify-center text-white font-bold">
          3
        </span>
      </motion.button>
    </div>
  );
}