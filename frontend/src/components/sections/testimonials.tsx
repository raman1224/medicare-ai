// medicare-nepal/frontend/src/components/sections/testimonials.tsx
"use client";

import { motion } from "framer-motion";
import { Star, CheckCircle, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Ramesh Poudel",
    role: "Cardiologist, Kathmandu Hospital",
    image: "👨‍⚕️",
    rating: 5,
    text: "Medicare Nepal's AI symptom analyzer helps triage patients effectively. It's revolutionized how we handle initial consultations.",
    verified: true,
    specialty: "Cardiology",
    location: "Kathmandu"
  },
  {
    name: "Anita Sharma",
    role: "Patient, Bhaktapur",
    image: "👩",
    rating: 5,
    text: "The medicine scanner saved me from taking wrong medication. Instant identification with Nepal pricing is a game-changer!",
    verified: true,
    specialty: "Patient",
    location: "Bhaktapur"
  },
  {
    name: "Blood Donor Network",
    role: "Community Initiative",
    image: "🩸",
    rating: 5,
    text: "Connected 500+ donors with recipients in emergency situations. The verification system ensures safety for everyone.",
    verified: true,
    specialty: "Blood Donation",
    location: "Nationwide"
  },
  {
    name: "Dr. Sunita Rai",
    role: "Pediatrician, Pokhara",
    image: "👩‍⚕️",
    rating: 5,
    text: "The real-time chat feature provides 24/7 support to new parents. Emotional AI understands anxiety and provides calm guidance.",
    verified: true,
    specialty: "Pediatrics",
    location: "Pokhara"
  },
];

export default function Testimonials() {
  return (
    <section className="py-32 relative overflow-hidden bg-gray-50 dark:bg-transparent">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 dark:bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 dark:bg-secondary/5 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/10 mb-6">
            <Quote className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Testimonials</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Trusted by <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Healthcare Community</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Doctors, patients, and donors share their experiences with Medicare Nepal
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              <div className="relative h-full p-6 rounded-2xl bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Quote icon */}
                <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote className="w-12 h-12 text-gray-900 dark:text-white" />
                </div>

                {/* Header */}
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="text-5xl">{testimonial.image}</div>
                  {testimonial.verified && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30">
                      <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                      <span className="text-xs text-green-600 dark:text-green-400">Verified</span>
                    </div>
                  )}
                </div>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                
                {/* Testimonial text */}
                <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed relative z-10">
                  "{testimonial.text}"
                </p>
                
                {/* Author info */}
                <div className="relative z-10">
                  <div className="text-gray-900 dark:text-white font-semibold">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <span className="px-2 py-1 rounded-full bg-primary/10 dark:bg-primary/10 text-primary">
                      {testimonial.specialty}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500">•</span>
                    <span className="text-gray-500 dark:text-gray-400">{testimonial.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { label: "Happy Users", value: "50K+", icon: "😊" },
            { label: "5-Star Ratings", value: "4.9", icon: "⭐" },
            { label: "Verified Doctors", value: "1000+", icon: "👨‍⚕️" },
            { label: "Cities Covered", value: "50+", icon: "🏙️" }
          ].map((stat, index) => (
            <div key={index} className="text-center p-4 rounded-xl bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}