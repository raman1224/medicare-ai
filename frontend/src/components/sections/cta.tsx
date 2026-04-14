// medicare-nepal/frontend/src/components/sections/cta.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield, Globe, Heart, Sparkles, Clock, Users } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 dark:from-primary/10 dark:via-secondary/10 dark:to-accent/10" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
        
        {/* Animated particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-secondary rounded-full animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-accent rounded-full animate-pulse delay-500" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 dark:from-primary/10 dark:to-secondary/10 backdrop-blur-sm mb-8"
          >
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Limited Time Offer</span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Ready to Transform{' '}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Healthcare
            </span>
            <br />
            Experience?
          </motion.h2>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12"
          >
            Join thousands of Nepali citizens who trust Medicare Nepal for their healthcare needs
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
          >
            <Link href="/auth/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent text-white font-semibold text-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Start Free Forever
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </motion.button>
            </Link>
            
            <Link href="/doctors">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-lg border-2 border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 shadow-lg hover:shadow-xl transition-all"
              >
                Find Doctors Near You
              </motion.button>
            </Link>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              {
                icon: Shield,
                title: "100% Free",
                description: "No hidden charges, no subscription fees",
                gradient: "from-blue-500 to-cyan-500",
                color: "blue"
              },
              {
                icon: Globe,
                title: "Nepal-Wide",
                description: "Available across all 7 provinces",
                gradient: "from-purple-500 to-pink-500",
                color: "purple"
              },
              {
                icon: Heart,
                title: "Life-Saving",
                description: "Emergency features that save lives",
                gradient: "from-red-500 to-orange-500",
                color: "red"
              },
            ].map((feature, index) => {
              const getColorClass = (color: string) => {
                switch(color) {
                  case 'blue': return "text-blue-600 dark:text-blue-400";
                  case 'purple': return "text-purple-600 dark:text-purple-400";
                  case 'red': return "text-red-600 dark:text-red-400";
                  default: return "text-primary";
                }
              };
              
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="group p-6 rounded-2xl bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} p-0.5 mb-4 mx-auto`}>
                    <div className="w-full h-full bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center">
                      <feature.icon className={`w-7 h-7 ${getColorClass(feature.color)}`} />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-16 pt-8 border-t border-gray-200 dark:border-white/10"
          >
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">24/7 Support</span>
              </div>
              <div className="w-px h-6 bg-gray-300 dark:bg-white/10" />
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">50K+ Active Users</span>
              </div>
              <div className="w-px h-6 bg-gray-300 dark:bg-white/10" />
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Secure & Encrypted</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}