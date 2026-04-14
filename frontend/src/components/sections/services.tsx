// medicare-nepal/frontend/src/components/sections/services.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Building2, Users, Microscope, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Building2,
    title: "Hospital Network",
    description: "Access to 500+ hospitals across Nepal with real-time bed availability and emergency services",
    gradient: "from-blue-500 to-cyan-500",
    route: "/hospitals",
    stats: "500+ Hospitals",
    color: "blue"
  },
  {
    icon: Users,
    title: "Expert Doctors",
    description: "Connect with 1000+ verified healthcare professionals available for consultations",
    gradient: "from-purple-500 to-pink-500",
    route: "/doctors",
    stats: "1000+ Doctors",
    color: "purple"
  },
  {
    icon: Microscope,
    title: "AI Diagnostics",
    description: "Advanced AI-powered analysis for quick preliminary assessments and health insights",
    gradient: "from-green-500 to-emerald-500",
    route: "/chat",
    stats: "98% Accuracy",
    color: "green"
  }
];

export default function Services() {
  const getColorClasses = (color: string) => {
    const colors: Record<string, { text: string; bg: string; border: string; hover: string }> = {
      blue: { 
        text: "text-blue-600 dark:text-blue-400", 
        bg: "bg-blue-50 dark:bg-blue-950/30", 
        border: "border-blue-200 dark:border-blue-800",
        hover: "hover:border-blue-300 dark:hover:border-blue-700"
      },
      purple: { 
        text: "text-purple-600 dark:text-purple-400", 
        bg: "bg-purple-50 dark:bg-purple-950/30", 
        border: "border-purple-200 dark:border-purple-800",
        hover: "hover:border-purple-300 dark:hover:border-purple-700"
      },
      green: { 
        text: "text-green-600 dark:text-green-400", 
        bg: "bg-green-50 dark:bg-green-950/30", 
        border: "border-green-200 dark:border-green-800",
        hover: "hover:border-green-300 dark:hover:border-green-700"
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <section id="services" className="py-20 md:py-32 relative overflow-hidden bg-gray-50 dark:bg-transparent">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 dark:bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 dark:bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/10 mb-6">
            <span className="text-2xl">🏥</span>
            <span className="text-sm font-medium text-primary">Healthcare Services</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Comprehensive <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Healthcare</span> Solutions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Complete healthcare ecosystem tailored for Nepal
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            const colorClasses = getColorClasses(service.color);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                {/* Card */}
                <div className={`relative h-full p-8 rounded-2xl bg-white dark:bg-gray-800/50 backdrop-blur-sm border ${colorClasses.border} ${colorClasses.hover} shadow-lg hover:shadow-xl transition-all duration-300`}>
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  {/* Icon with gradient background */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} p-0.5 mb-6`}>
                    <div className="w-full h-full bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center">
                      <IconComponent className={`w-8 h-8 ${colorClasses.text}`} />
                    </div>
                  </div>

                  {/* Stats badge */}
                  <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${colorClasses.bg} ${colorClasses.text} mb-4`}>
                    {service.stats}
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* CTA Link */}
                  <Link href={service.route}>
                    <div className={`inline-flex items-center gap-2 ${colorClasses.text} font-semibold group-hover:gap-3 transition-all duration-300 cursor-pointer`}>
                      <span>Learn more</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 dark:from-primary/5 dark:via-secondary/5 dark:to-accent/5 border border-primary/20 dark:border-primary/10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-700 dark:text-gray-300 font-semibold">✨ 24/7 Emergency Support Available</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Get immediate assistance anytime, anywhere in Nepal</p>
            </div>
            <Link href="/emergency">
              <button className="px-6 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors shadow-lg">
                Emergency → 
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}