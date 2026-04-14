// medicare-nepal/frontend/src/components/sections/FeaturesGrid.tsx
"use client";

import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Brain, 
  MessageSquare, 
  MapPin, 
  Droplets, 
  Activity, 
  Camera,
  Thermometer,
  Users,
  HeartPulse,
  Shield,
  Globe
} from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "AI Medicine Scanner",
    description: "Upload medicine photos for instant identification with pricing, side effects, and usage guidelines",
    gradient: "from-blue-500 to-cyan-500",
    highlights: ["Instant Detection", "Nepal Pricing", "Side Effects", "Storage Tips"],
    badge: "AI POWERED",
    color: "blue",
    route: "/scanner"
  },
  {
    icon: Thermometer,
    title: "Symptom Analyzer",
    description: "AI-powered symptom analysis with urgency levels and emergency detection",
    gradient: "from-purple-500 to-pink-500",
    highlights: ["Urgency Levels", "Emergency Detection", "Doctor Guidance", "Basic Care"],
    badge: "SAFE & RESPONSIBLE",
    color: "purple",
    route: "/symptom-checker"
  },
  {
    icon: MessageSquare,
    title: "Real-Time AI Chat",
    description: "24/7 health guidance with emotional intelligence and emergency detection",
    gradient: "from-green-500 to-emerald-500",
    highlights: ["Voice Support", "Emotional AI", "Follow-ups", "24/7 Support"],
    badge: "ALWAYS AVAILABLE",
    color: "green",
    route: "/chat"
  },
  {
    icon: MapPin,
    title: "Hospital Finder",
    description: "Find hospitals by specialty with real-time availability and directions",
    gradient: "from-orange-500 to-red-500",
    highlights: ["Live Availability", "Directions", "Contact Details", "Reviews"],
    badge: "LOCATION AWARE",
    color: "orange",
    route: "/hospitals"
  },
  {
    icon: Droplets,
    title: "Blood Donation Network",
    description: "Community-driven blood donation system with verified donors",
    gradient: "from-red-500 to-pink-500",
    highlights: ["Blood Groups", "Urgent Requests", "Donor Network", "Safety Verified"],
    badge: "LIFE SAVING",
    color: "red",
    route: "/blood-bank"
  },
  {
    icon: Activity,
    title: "Fitness Tracker",
    description: "Personalized fitness plans with Nepali food suggestions and tracking",
    gradient: "from-yellow-500 to-amber-500",
    highlights: ["BMI Calculator", "Meal Plans", "Workouts", "Sleep Tracking"],
    badge: "HOLISTIC HEALTH",
    color: "yellow",
    route: "/fitness"
  },
  {
    icon: Brain,
    title: "X-Ray & Image Analysis",
    description: "AI-powered medical image analysis with detailed explanations",
    gradient: "from-indigo-500 to-blue-500",
    highlights: ["X-Ray Analysis", "Detailed Reports", "Voice Explanation", "Export"],
    badge: "ADVANCED AI",
    color: "indigo",
    route: "/scanner"
  },
  {
    icon: Users,
    title: "Doctor Appointment",
    description: "Book appointments with verified doctors via video/chat consultation",
    gradient: "from-teal-500 to-cyan-500",
    highlights: ["Video Consult", "Chat", "E-Prescription", "Follow-up"],
    badge: "TRUSTED NETWORK",
    color: "teal",
    route: "/doctors"
  }
];

export default function FeaturesGrid() {
  const router = useRouter();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  const handleCardClick = (route: string) => {
    router.push(route);
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { text: string; bg: string; border: string }> = {
      blue: { text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800" },
      purple: { text: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950/30", border: "border-purple-200 dark:border-purple-800" },
      green: { text: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/30", border: "border-green-200 dark:border-green-800" },
      orange: { text: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-200 dark:border-orange-800" },
      red: { text: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800" },
      yellow: { text: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-950/30", border: "border-yellow-200 dark:border-yellow-800" },
      indigo: { text: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/30", border: "border-indigo-200 dark:border-indigo-800" },
      teal: { text: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-950/30", border: "border-teal-200 dark:border-teal-800" },
    };
    return colors[color] || colors.blue;
  };

  return (
    <section id="features" className="relative py-32 overflow-hidden bg-gray-50 dark:bg-transparent">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 dark:bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/10 mb-6">
            <Brain className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Complete <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Healthcare</span> Suite
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Everything you need for comprehensive healthcare management, powered by advanced AI
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => {
            const colorClasses = getColorClasses(feature.color);
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                onClick={() => handleCardClick(feature.route)}
                className="group relative h-full cursor-pointer"
              >
                {/* Gradient Border */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
                
                {/* Main Card */}
                <div className="relative h-full p-6 rounded-3xl bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Badge */}
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full mb-6 ${colorClasses.bg} border ${colorClasses.border}`}>
                    <div className={`w-2 h-2 rounded-full ${colorClasses.text}`} />
                    <span className={`text-xs font-semibold ${colorClasses.text}`}>
                      {feature.badge}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl mb-6 bg-gradient-to-br ${feature.gradient} p-0.5`}>
                    <div className="w-full h-full bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center">
                      <feature.icon className={`w-8 h-8 ${colorClasses.text}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">{feature.description}</p>

                  {/* Highlights */}
                  <div className="space-y-2">
                    {feature.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-center text-sm">
                        <div className={`w-1.5 h-1.5 rounded-full ${colorClasses.text} mr-3`} />
                        <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* Hover Indicator */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg`}>
                      <span className="text-white text-lg">→</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-4 px-6 py-4 rounded-2xl bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-gray-700 dark:text-gray-300">100% Free Forever</span>
            </div>
            <div className="w-px h-6 bg-gray-300 dark:bg-white/10" />
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-gray-700 dark:text-gray-300">Available in English & Nepali</span>
            </div>
            <div className="w-px h-6 bg-gray-300 dark:bg-white/10" />
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-gray-700 dark:text-gray-300">Emergency Support 24/7</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}