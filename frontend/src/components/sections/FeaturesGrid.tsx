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
  Stethoscope, 
  Shield, 
  Globe,
  Camera,
  Thermometer,
  Users,
  HeartPulse
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
    description: "@/7 health guidance with emotional intelligence and emergency detection",
    gradient: "from-green-500 to-emerald-500",
    highlights: ["Voice Support", "Emotional AI", "Follow-ups", "@/7 Support"],
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

  return (
    <section id="features" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 mb-6">
            <Brain className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Complete <span className="text-gradient">Healthcare</span> Suite
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
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
          {features.map((feature, index) => (
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
              <div className="relative h-full p-6 rounded-3xl glass-card hover:border-white/20 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-white/5">
                {/* Badge */}
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full mb-6 bg-gradient-to-r ${feature.gradient} bg-opacity-10 border border-${feature.color}-500/20`}>
                  <div className={`w-2 h-2 rounded-full bg-${feature.color}-500`} />
                  <span className={`text-xs font-semibold text-${feature.color}-300`}>
                    {feature.badge}
                  </span>
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl mb-6 bg-gradient-to-br ${feature.gradient} p-0.5`}>
                  <div className="w-full h-full bg-gray-900 rounded-2xl flex items-center justify-center">
                    <feature.icon className={`w-8 h-8 text-${feature.color}-400`} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm mb-6">{feature.description}</p>

                {/* Highlights */}
                <div className="space-y-2">
                  {feature.highlights.map((highlight, i) => (
                    <div key={i} className="flex items-center text-sm">
                      <div className={`w-1.5 h-1.5 rounded-full bg-${feature.color}-500 mr-3`} />
                      <span className="text-gray-300">{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* Hover Indicator - Arrow Icon */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center`}>
                    <span className="text-white text-lg">→</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl glass-card">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-gray-300">100% Free Forever</span>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300">Available in English & Nepali</span>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-red-400" />
              <span className="text-gray-300">Emergency Support 24/7</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}