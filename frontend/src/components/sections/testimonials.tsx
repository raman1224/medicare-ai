
"use client";

import { motion } from "framer-motion";
import { Star, CheckCircle } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Ramesh Poudel",
    role: "Cardiologist, Kathmandu Hospital",
    image: "👨‍⚕️",
    rating: 5,
    text: "Medicare Nepal's AI symptom analyzer helps triage patients effectively. It's revolutionized how we handle initial consultations.",
    verified: true,
  },
  {
    name: "Anita Sharma",
    role: "Patient, Bhaktapur",
    image: "👩",
    rating: 5,
    text: "The medicine scanner saved me from taking wrong medication. Instant identification with Nepal pricing is a game-changer!",
    verified: true,
  },
  {
    name: "Blood Donor Network",
    role: "Community Initiative",
    image: "🩸",
    rating: 5,
    text: "Connected 500+ donors with recipients in emergency situations. The verification system ensures safety for everyone.",
    verified: true,
  },
  {
    name: "Dr. Sunita Rai",
    role: "Pediatrician, Pokhara",
    image: "👩‍⚕️",
    rating: 5,
    text: "The real-time chat feature provides 24/7 support to new parents. Emotional AI understands anxiety and provides calm guidance.",
    verified: true,
  },
];

export default function Testimonials() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Trusted by <span className="text-gradient">Healthcare Community</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
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
              className="group p-6 rounded-3xl glass-card hover-lift"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{testimonial.image}</div>
                {testimonial.verified && (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                )}
              </div>
              
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
              
              <p className="text-gray-300 mb-6 italic">"{testimonial.text}"</p>
              
              <div>
                <div className="text-white font-semibold">{testimonial.name}</div>
                <div className="text-sm text-gray-400">{testimonial.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}