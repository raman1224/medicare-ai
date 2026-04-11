"use client";

import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Navigation from "@/components/navigation";

// Dynamic imports with loading states
const Hero = dynamic(() => import("@/components/sections/hero"), {
  loading: () => (
    <div className="w-full h-screen bg-gradient-to-b from-gray-900 to-black animate-pulse" />
  ),
  ssr: true // Keep SSR for hero for SEO
});

const FeaturesGrid = dynamic(() => import("@/components/sections/FeaturesGrid"), {
  loading: () => (
    <div className="w-full py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
});

const Services = dynamic(() => import("@/components/sections/services"), {
  loading: () => (
    <div className="w-full py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="h-12 w-64 bg-gray-800 rounded-lg mx-auto mb-12 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
});

const Testimonials = dynamic(() => import("@/components/sections/testimonials"), {
  loading: () => (
    <div className="w-full py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="h-12 w-64 bg-gray-800 rounded-lg mx-auto mb-12 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
});

const CTA = dynamic(() => import("@/components/sections/cta"), {
  loading: () => (
    <div className="w-full py-20 bg-gradient-to-r from-primary/20 to-secondary/20">
      <div className="container mx-auto px-4 text-center">
        <div className="h-12 w-96 max-w-full bg-gray-800 rounded-lg mx-auto mb-6 animate-pulse" />
        <div className="h-14 w-48 bg-gray-800 rounded-full mx-auto animate-pulse" />
      </div>
    </div>
  )
});

const Footer = dynamic(() => import("@/components/footer"), {
  loading: () => (
    <div className="w-full py-12 bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-900 rounded-xl animate-pulse" />
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
  // Preload on idle
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      import("@/components/sections/FeaturesGrid");
      import("@/components/sections/services");
    });
  }
};

export default function Home() {
  // Execute preload after initial render
  if (typeof window !== 'undefined') {
    setTimeout(preloadComponents, 2000);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <Navigation />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero is critical - load immediately */}
        <Suspense fallback={
          <div className="w-full h-screen bg-gradient-to-b from-gray-900 to-black animate-pulse" />
        }>
          <Hero />
        </Suspense>

        {/* Lazy load below-the-fold content */}
        <Suspense fallback={
          <div className="w-full py-20 bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-48 bg-gray-800 rounded-2xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        }>
          <FeaturesGrid />
        </Suspense>

        <Suspense fallback={
          <div className="w-full py-20 bg-black">
            <div className="container mx-auto px-4">
              <div className="h-12 w-64 bg-gray-800 rounded-lg mx-auto mb-12 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-800 rounded-2xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        }>
          <Services />
        </Suspense>

        <Suspense fallback={
          <div className="w-full py-20 bg-gray-900">
            <div className="container mx-auto px-4">
              <div className="h-12 w-64 bg-gray-800 rounded-lg mx-auto mb-12 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-48 bg-gray-800 rounded-2xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        }>
          <Testimonials />
        </Suspense>

        <Suspense fallback={
          <div className="w-full py-20 bg-gradient-to-r from-primary/20 to-secondary/20">
            <div className="container mx-auto px-4 text-center">
              <div className="h-12 w-96 max-w-full bg-gray-800 rounded-lg mx-auto mb-6 animate-pulse" />
              <div className="h-14 w-48 bg-gray-800 rounded-full mx-auto animate-pulse" />
            </div>
          </div>
        }>
          <CTA />
        </Suspense>

        <Suspense fallback={
          <div className="w-full py-12 bg-gray-950">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-900 rounded-xl animate-pulse" />
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