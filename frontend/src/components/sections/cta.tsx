// medicare-nepal/frontend/src/components/sections/cta.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield, Globe, Heart } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8">
            Ready to Transform <span className="text-gradient">Healthcare</span> Experience?
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Join thousands of Nepali citizens who trust Medicare Nepal for their healthcare needs
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link href="/auth/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent text-white font-semibold text-lg flex items-center gap-3"
              >
                <span>Start Free Forever</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            
            <Link href="/doctors">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl glass-card text-white font-semibold text-lg"
              >
                Find Doctors Near You
              </motion.button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: Shield,
                title: "100% Free",
                description: "No hidden charges, no subscription fees",
              },
              {
                icon: Globe,
                title: "Nepal-Wide",
                description: "Available across all 7 provinces",
              },
              {
                icon: Heart,
                title: "Life-Saving",
                description: "Emergency features that save lives",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm"
              >
                <feature.icon className="w-10 h-10 text-primary mb-4 mx-auto" />
                <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}