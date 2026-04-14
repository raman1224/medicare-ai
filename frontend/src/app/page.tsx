"use client";

import { Suspense, lazy, useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';
import Navigation from "@/components/navigation";

// Dynamic imports with loading states
const Hero = dynamic(() => import("@/components/sections/hero"), {
  loading: () => (
    <div className="w-full h-screen bg-gradient-to-b from-gray-100 to-gray-300 dark:from-gray-900 dark:to-black animate-pulse" />
  ),
  ssr: true
});

const FeaturesGrid = dynamic(() => import("@/components/sections/FeaturesGrid"), {
  loading: () => (
    <div className="w-full py-20 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
});

const Services = dynamic(() => import("@/components/sections/services"), {
  loading: () => (
    <div className="w-full py-20 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="h-12 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg mx-auto mb-12 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
});

const Testimonials = dynamic(() => import("@/components/sections/testimonials"), {
  loading: () => (
    <div className="w-full py-20 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="h-12 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg mx-auto mb-12 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
});

const CTA = dynamic(() => import("@/components/sections/cta"), {
  loading: () => (
    <div className="w-full py-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
      <div className="container mx-auto px-4 text-center">
        <div className="h-12 w-96 max-w-full bg-gray-200 dark:bg-gray-800 rounded-lg mx-auto mb-6 animate-pulse" />
        <div className="h-14 w-48 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto animate-pulse" />
      </div>
    </div>
  )
});

const Footer = dynamic(() => import("@/components/footer"), {
  loading: () => (
    <div className="w-full py-12 bg-gray-100 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-900 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
});

// Lazy load floating action button content
const FloatingActions = dynamic(() => import("@/components/floating-actions"), {
  loading: () => null,
  ssr: false
});

// Preload critical components
const preloadComponents = () => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    requestIdleCallback(() => {
      import("@/components/sections/FeaturesGrid");
      import("@/components/sections/services");
    });
  }
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState('light');

  // Handle theme detection and mounting
  useEffect(() => {
    setMounted(true);
    
    // Detect initial theme
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
    
    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDarkNow = document.documentElement.classList.contains('dark');
          setTheme(isDarkNow ? 'dark' : 'light');
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    // Execute preload after initial render
    setTimeout(preloadComponents, 2000);
    
    return () => observer.disconnect();
  }, []);

  // Don't render content until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <div className="w-full h-screen bg-gradient-to-b from-gray-100 to-gray-300 dark:from-gray-900 dark:to-black animate-pulse" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-black' : 'bg-gray-50'
    }`}>
      <Navigation />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section */}
        <Suspense fallback={
          <div className="w-full h-screen bg-gradient-to-b from-gray-100 to-gray-300 dark:from-gray-900 dark:to-black animate-pulse" />
        }>
          <Hero />
        </Suspense>

        {/* Features Grid */}
        <Suspense fallback={
          <div className="w-full py-20 bg-gray-100 dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        }>
          <FeaturesGrid />
        </Suspense>

        {/* Services Section */}
        <Suspense fallback={
          <div className="w-full py-20 bg-white dark:bg-black">
            <div className="container mx-auto px-4">
              <div className="h-12 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg mx-auto mb-12 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        }>
          <Services />
        </Suspense>

        {/* Testimonials Section */}
        <Suspense fallback={
          <div className="w-full py-20 bg-gray-100 dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="h-12 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg mx-auto mb-12 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        }>
          <Testimonials />
        </Suspense>

        {/* CTA Section */}
        <Suspense fallback={
          <div className="w-full py-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
            <div className="container mx-auto px-4 text-center">
              <div className="h-12 w-96 max-w-full bg-gray-200 dark:bg-gray-800 rounded-lg mx-auto mb-6 animate-pulse" />
              <div className="h-14 w-48 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto animate-pulse" />
            </div>
          </div>
        }>
          <CTA />
        </Suspense>

        {/* Footer */}
        <Suspense fallback={
          <div className="w-full py-12 bg-gray-100 dark:bg-gray-950">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 dark:bg-gray-900 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        }>
          <Footer />
        </Suspense>
      </motion.div>

      {/* Lazy loaded floating actions */}
      <Suspense fallback={null}>
        <FloatingActions />
      </Suspense>
    </div>
  );
}