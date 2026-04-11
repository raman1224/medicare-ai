// medicare-nepal/frontend/src/components/sections/FeatureModes.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Activity, 
  Pill, 
  Stethoscope, 
  Heart, 
  Droplets, 
  Dumbbell, 
  MessageCircle, 
  MapPin 
} from "lucide-react";

const featureModes = [
  {
    id: 1,
    title: "Medicine & Image Analyzer",
    description:
      "Upload photos of medicines like Google Lens for instant identification with active ingredients, usage, side effects, and Nepal pricing",
    icon: Pill,
    color: "from-blue-500 to-cyan-500",
    badge: "AI POWERED",
    highlights: ["Medicine Detection", "Nepal Pricing", "Side Effects", "Storage Tips"],
    route: "/scanner"
  },
  {
    id: 2,
    title: "Symptom Analyzer",
    description:
      "Describe symptoms with temperature, blood pressure, images. Get urgency levels 🟢🟡🔴 and guidance without diagnosis",
    icon: Stethoscope,
    color: "from-purple-500 to-pink-500",
    badge: "SAFE & RESPONSIBLE",
    highlights: ["Urgency Levels", "Emergency Detection", "When to See Doctor", "Basic Care"],
    route: "/symptom-checker"
  },
  {
    id: 3,
    title: "Real-Time AI Chat",
    description:
      "@/7 health guidance via text or voice. Supportive AI that adapts to your emotions and detects emergencies instantly",
    icon: MessageCircle,
    color: "from-green-500 to-emerald-500",
    badge: "@/7 SUPPORT",
    highlights: ["Voice Support", "Emergency Detect", "Emotional AI", "Follow-ups"],
    route: "/chat"
  },
  {
    id: 4,
    title: "Hospital & Emergency Finder",
    description:
      "Find hospitals by province, district, city and specialty. Get location, type, and emergency availability",
    icon: MapPin,
    color: "from-orange-500 to-red-500",
    badge: "LOCATION AWARE",
    highlights: ["Province Filter", "Specialty Search", "Emergency Info", "Contact Details"],
    route: "/hospitals"
  },
  {
    id: 5,
    title: "Blood Donation System",
    description:
      "Request blood or become a donor. Community-driven urgent care with safety guidance and emergency response",
    icon: Droplets,
    color: "from-red-500 to-pink-500",
    badge: "LIFE SAVING",
    highlights: ["Blood Groups", "Urgency Request", "Donor Network", "Safety Rules"],
    route: "/blood-bank"
  },
  {
    id: 6,
    title: "Fitness & Daily Health",
    description:
      "Calorie calculator, home workouts, Nepali food suggestions. Daily routine tracking without body shaming",
    icon: Dumbbell,
    color: "from-yellow-500 to-amber-500",
    badge: "HOLISTIC HEALTH",
    highlights: ["BMI Calculator", "Meal Plans", "Workouts", "Sleep Tracking"],
    route: "/fitness"
  },
  {
    id: 7,
    title: "Health Warnings & Myths",
    description:
      "Learn what happens if symptoms ignored. Nepal-specific health myths debunked with factual information",
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
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const router = useRouter();

  const handleCardClick = (feature: typeof featureModes[0]) => {
    // If you want to show detail modal first, then navigate
    // setSelectedFeature(feature.id);
    
    // Direct navigation to route
    router.push(feature.route);
  };

  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 relative overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"> </div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"> </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slideInUp">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-gradient">8 Intelligent Healthcare Features</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Complete healthcare platform with AI-powered tools, emergency detection, and community support
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featureModes.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                onClick={() => handleCardClick(feature)}
                className="group cursor-pointer animate-slideInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-full">
                  {/* Card background with gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
                  ></div>

                  {/* Glass card */}
                  <div className="relative glass-effect p-6 h-full flex flex-col justify-between hover:border-white/40 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-color-accent/20">
                    {/* Badge */}
                    <div
                      className={`inline-flex w-fit mb-4 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${feature.color} text-white`}
                    >
                      {feature.badge}
                    </div>

                    {/* Icon */}
                    <IconComponent
                      className={`w-12 h-12 mb-4 bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`}
                    />

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>

                    {/* Description */}
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{feature.description}</p>

                    {/* Quick highlights */}
                    <div className="space-y-2">
                      {feature.highlights.map((highlight, i) => (
                        <div key={i} className="flex items-center text-sm text-gray-300">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${feature.color} mr-2`}></div>
                          {highlight}
                        </div>
                      ))}
                    </div>

                    {/* Hover arrow */}
                    <div className="mt-4 flex items-center text-color-accent font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to Access →
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Feature Detail Modal (Optional - can be removed if you want direct navigation) */}
        {selectedFeature && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="glass-effect p-8 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              {(() => {
                const feature = featureModes.find((f) => f.id === selectedFeature);
                if (!feature) return null;
                return (
                  <div>
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-3xl font-bold text-white mb-2">{feature.title}</h3>
                        <p className="text-gray-300">{feature.description}</p>
                      </div>
                      <button
                        onClick={() => setSelectedFeature(null)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-4 text-gray-300">
                      <p className="text-sm">This feature provides:</p>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        {feature.highlights.map((highlight, i) => (
                          <li key={i}>{highlight}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedFeature(null);
                          router.push(feature.route);
                        }}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
                      >
                        Continue to {feature.title}
                      </button>
                      <button
                        onClick={() => setSelectedFeature(null)}
                        className="px-6 py-3 bg-gray-700 rounded-lg text-white font-semibold hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}