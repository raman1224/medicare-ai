// medicare-nepal/frontend/src/components/sections/FeatureModes.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  Pill, 
  Stethoscope, 
  Heart, 
  Droplets, 
  Dumbbell, 
  MessageCircle, 
  MapPin,
  X 
} from "lucide-react";

const featureModes = [
  {
    id: 1,
    title: "Medicine & Image Analyzer",
    description: "Upload photos of medicines like Google Lens for instant identification with active ingredients, usage, side effects, and Nepal pricing",
    icon: Pill,
    color: "from-blue-500 to-cyan-500",
    badge: "AI POWERED",
    highlights: ["Medicine Detection", "Nepal Pricing", "Side Effects", "Storage Tips"],
    route: "/scanner"
  },
  {
    id: 2,
    title: "Symptom Analyzer",
    description: "Describe symptoms with temperature, blood pressure, images. Get urgency levels 🟢🟡🔴 and guidance without diagnosis",
    icon: Stethoscope,
    color: "from-purple-500 to-pink-500",
    badge: "SAFE & RESPONSIBLE",
    highlights: ["Urgency Levels", "Emergency Detection", "When to See Doctor", "Basic Care"],
    route: "/symptom-checker"
  },
  {
    id: 3,
    title: "Real-Time AI Chat",
    description: "24/7 health guidance via text or voice. Supportive AI that adapts to your emotions and detects emergencies instantly",
    icon: MessageCircle,
    color: "from-green-500 to-emerald-500",
    badge: "24/7 SUPPORT",
    highlights: ["Voice Support", "Emergency Detect", "Emotional AI", "Follow-ups"],
    route: "/chat"
  },
  {
    id: 4,
    title: "Hospital & Emergency Finder",
    description: "Find hospitals by province, district, city and specialty. Get location, type, and emergency availability",
    icon: MapPin,
    color: "from-orange-500 to-red-500",
    badge: "LOCATION AWARE",
    highlights: ["Province Filter", "Specialty Search", "Emergency Info", "Contact Details"],
    route: "/hospitals"
  },
  {
    id: 5,
    title: "Blood Donation System",
    description: "Request blood or become a donor. Community-driven urgent care with safety guidance and emergency response",
    icon: Droplets,
    color: "from-red-500 to-pink-500",
    badge: "LIFE SAVING",
    highlights: ["Blood Groups", "Urgency Request", "Donor Network", "Safety Rules"],
    route: "/blood-bank"
  },
  {
    id: 6,
    title: "Fitness & Daily Health",
    description: "Calorie calculator, home workouts, Nepali food suggestions. Daily routine tracking without body shaming",
    icon: Dumbbell,
    color: "from-yellow-500 to-amber-500",
    badge: "HOLISTIC HEALTH",
    highlights: ["BMI Calculator", "Meal Plans", "Workouts", "Sleep Tracking"],
    route: "/fitness"
  },
  {
    id: 7,
    title: "Health Warnings & Myths",
    description: "Learn what happens if symptoms ignored. Nepal-specific health myths debunked with factual information",
    icon: Heart,
    color: "from-indigo-500 to-blue-500",
    badge: "EDUCATIONAL",
    highlights: ["Myth Busting", "Warning Signs", "Fact Checking", "Probability Based"],
    route: "/symptom-checker"
  },
  {
    id: 8,
    title: "Doctor Appointment",
    description: "Book appointments with verified doctors via video/chat consultation with E-prescription",
    icon: Activity,
    color: "from-teal-500 to-cyan-500",
    badge: "TRUSTED NETWORK",
    highlights: ["Video Consult", "Chat", "E-Prescription", "Follow-up"],
    route: "/doctors"
  }
];

export default function FeatureModes() {
  const [selectedFeature, setSelectedFeature] = useState<typeof featureModes[0] | null>(null);
  const router = useRouter();

  const handleCardClick = (feature: typeof featureModes[0]) => {
    setSelectedFeature(feature);
  };

  const handleNavigate = (route: string) => {
    setSelectedFeature(null);
    router.push(route);
  };

  const getColorClasses = (gradient: string) => {
    const colors: Record<string, { text: string; bg: string; border: string }> = {
      "from-blue-500": { text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800" },
      "from-purple-500": { text: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950/30", border: "border-purple-200 dark:border-purple-800" },
      "from-green-500": { text: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/30", border: "border-green-200 dark:border-green-800" },
      "from-orange-500": { text: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-200 dark:border-orange-800" },
      "from-red-500": { text: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800" },
      "from-yellow-500": { text: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-950/30", border: "border-yellow-200 dark:border-yellow-800" },
      "from-indigo-500": { text: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/30", border: "border-indigo-200 dark:border-indigo-800" },
      "from-teal-500": { text: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-950/30", border: "border-teal-200 dark:border-teal-800" },
    };
    return colors[gradient] || colors["from-blue-500"];
  };

  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 relative overflow-hidden bg-gray-50 dark:bg-transparent">
      {/* Background gradient elements */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/10 dark:bg-green-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              8 Intelligent Healthcare Features
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Complete healthcare platform with AI-powered tools, emergency detection, and community support
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featureModes.map((feature, index) => {
            const IconComponent = feature.icon;
            const colorClasses = getColorClasses(feature.color.split(' ')[0]);
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleCardClick(feature)}
                className="group cursor-pointer"
              >
                <div className="relative h-full">
                  {/* Card background with gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
                  />

                  {/* Main card */}
                  <div className="relative bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-6 h-full flex flex-col justify-between rounded-2xl hover:shadow-xl transition-all duration-300">
                    {/* Badge */}
                    <div
                      className={`inline-flex w-fit mb-4 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${feature.color} text-white shadow-lg`}
                    >
                      {feature.badge}
                    </div>

                    {/* Icon */}
                    <div className="mb-4">
                      <IconComponent
                        className={`w-12 h-12 bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`}
                      />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {feature.description}
                    </p>

                    {/* Quick highlights */}
                    <div className="space-y-2">
                      {feature.highlights.slice(0, 3).map((highlight, i) => (
                        <div key={i} className="flex items-center text-sm">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${feature.color} mr-2`} />
                          <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
                        </div>
                      ))}
                    </div>

                    {/* Hover arrow */}
                    <div className={`mt-4 flex items-center ${colorClasses.text} font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity`}>
                      Click to Learn More →
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Feature Detail Modal */}
        <AnimatePresence>
          {selectedFeature && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedFeature(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedFeature.color} p-0.5`}>
                        <div className="w-full h-full bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center">
                          <selectedFeature.icon className={`w-6 h-6 bg-gradient-to-br ${selectedFeature.color} bg-clip-text text-transparent`} />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {selectedFeature.title}
                        </h3>
                        <div className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r ${selectedFeature.color} text-white mt-1`}>
                          {selectedFeature.badge}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedFeature(null)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                    <p className="text-gray-600 dark:text-gray-400">{selectedFeature.description}</p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Key Features</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedFeature.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${selectedFeature.color}`} />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => handleNavigate(selectedFeature.route)}
                      className={`flex-1 px-6 py-3 bg-gradient-to-r ${selectedFeature.color} rounded-xl text-white font-semibold hover:shadow-lg transition-all`}
                    >
                      Get Started
                    </button>
                    <button
                      onClick={() => setSelectedFeature(null)}
                      className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}