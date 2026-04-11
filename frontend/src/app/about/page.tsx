// medicare-nepal/frontend/src/app/about/page.tsx

"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { Heart, Stethoscope, Brain, Shield, Activity, Droplets, MapPin, MessageSquare, Scan, Hospital, Users, Globe, Sparkles, Cpu, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import ProtectedRoute from "@/components/auth/protected-route";
import DashboardNav from "@/components/dashboard/nav";
import Footer from "@/components/footer";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const features = [
  {
    icon: <Brain className="h-8 w-8" />,
    title: "AI Symptom Checker",
    description: "Advanced AI-powered symptom analysis with disease prediction",
    color: "from-purple-500 to-pink-500",
    delay: 0.1
  },
  {
    icon: <MessageSquare className="h-8 w-8" />,
    title: "Real-Time Chat",
    description: "Instant messaging with doctors & patients via WebSocket",
    color: "from-blue-500 to-cyan-500",
    delay: 0.2
  },
  {
    icon: <Droplets className="h-8 w-8" />,
    title: "Blood Donation Network",
    description: "Connect donors with recipients across Nepal",
    color: "from-red-500 to-orange-500",
    delay: 0.3
  },
  {
    icon: <Scan className="h-8 w-8" />,
    title: "Medicine Scanner",
    description: "Scan medicines for detailed information & usage",
    color: "from-green-500 to-emerald-500",
    delay: 0.4
  },
  {
    icon: <Hospital className="h-8 w-8" />,
    title: "Hospital Directory",
    description: "Comprehensive hospital database with locations",
    color: "from-indigo-500 to-purple-500",
    delay: 0.5
  },
  {
    icon: <Activity className="h-8 w-8" />,
    title: "Fitness Tracker",
    description: "Personal health & fitness monitoring",
    color: "from-yellow-500 to-orange-500",
    delay: 0.6
  }
];

const stats = [
  { label: "Active Users", value: "50K+", icon: <Users /> },
  { label: "Doctors", value: "2K+", icon: <Stethoscope /> },
  { label: "Hospitals", value: "500+", icon: <Hospital /> },
  { label: "Blood Donations", value: "10K+", icon: <Heart /> }
];

const teamMembers = [
  {
    name: "Dr. Arjun Sharma",
    role: "Medical Director",
    image: "/team/arjun.jpg",
    description: "Cardiologist with 15+ years experience"
  },
  {
    name: "Priya Basnet",
    role: "Tech Lead",
    image: "/team/priya.jpg",
    description: "Full-Stack Developer & AI Specialist"
  },
  {
    name: "Rajendra Gurung",
    role: "Operations Head",
    image: "/team/rajendra.jpg",
    description: "Healthcare Management Expert"
  },
  {
    name: "Samantha Rai",
    role: "UX Designer",
    image: "/team/samantha.jpg",
    description: "Patient Experience Specialist"
  }
];

export default function AboutPage() {
  const constraintsRef = useRef(null);

  return (
    <ProtectedRoute>  
    <DashboardNav />
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-emerald-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="container relative mx-auto px-4 text-center"
        >
          <Badge className="mb-6 animate-pulse bg-gradient-to-r from-blue-500 to-purple-500">
            <Sparkles className="mr-2 h-4 w-4" />
            Transforming Healthcare in Nepal
          </Badge>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 text-5xl font-bold tracking-tight text-gray-900 md:text-7xl"
          >
            <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              MediCare Nepal
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mb-10 max-w-3xl text-xl text-gray-600"
          >
            A comprehensive digital healthcare platform connecting patients, doctors, 
            and medical services across Nepal through innovative technology.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button
            onClick={() => window.location.href = '/features'}
            size="lg" className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
              <Zap className="h-5 w-5" />
              Explore Features
            </Button>
            <Button 
            onClick={() => window.location.href = '/auth/login'}
            size="lg" variant="outline" className="gap-2 border-2">
              <Users className="h-5 w-5" />
              Join Community
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating Animation Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute left-10 top-20 hidden rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 p-4 md:block"
        >
          <Stethoscope className="h-8 w-8 text-blue-600" />
        </motion.div>
        
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -15, 15, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute right-10 top-32 hidden rounded-full bg-gradient-to-r from-green-100 to-emerald-100 p-4 md:block"
        >
          <Heart className="h-8 w-8 text-green-600" />
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid gap-8 md:grid-cols-2"
          >
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-2 border-blue-100 bg-gradient-to-br from-white to-blue-50 shadow-lg">
                <CardHeader>
                  <div className="mb-4 inline-flex rounded-full bg-blue-100 p-3">
                    <Globe className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-3xl text-gray-900">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-gray-600">
                    To democratize healthcare access in Nepal through technology, 
                    making medical services, information, and professional care 
                    available to every citizen regardless of their location.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full border-2 border-emerald-100 bg-gradient-to-br from-white to-emerald-50 shadow-lg">
                <CardHeader>
                  <div className="mb-4 inline-flex rounded-full bg-emerald-100 p-3">
                    <Cpu className="h-8 w-8 text-emerald-600" />
                  </div>
                  <CardTitle className="text-3xl text-gray-900">Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-gray-600">
                    To become Nepal's leading digital healthcare ecosystem, 
                    integrating AI, real-time communication, and comprehensive 
                    medical resources to create a healthier nation.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Platform Features
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Discover our comprehensive suite of healthcare solutions
            </p>
          </motion.div>

          <motion.div
            ref={constraintsRef}
            className="relative mb-20"
          >
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: feature.delay }}
                  drag
                  dragConstraints={constraintsRef}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card className="h-full border-2 hover:shadow-2xl transition-all duration-300 cursor-grab active:cursor-grabbing">
                    <CardHeader>
                      <div className={`mb-4 inline-flex rounded-full bg-gradient-to-r ${feature.color} p-3`}>
                        <div className="text-white">
                          {feature.icon}
                        </div>
                      </div>
                      <CardTitle className="text-2xl text-gray-900">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Detailed Feature Tabs */}
          <Tabs defaultValue="ai" className="max-w-6xl mx-auto">
            <TabsList className="grid grid-cols-3 lg:grid-cols-6 mb-8">
              <TabsTrigger value="ai">AI Assistant</TabsTrigger>
              <TabsTrigger value="chat">Real-Time Chat</TabsTrigger>
              <TabsTrigger value="blood">Blood Bank</TabsTrigger>
              <TabsTrigger value="scan">Medicine Scan</TabsTrigger>
              <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
              <TabsTrigger value="fitness">Fitness</TabsTrigger>
            </TabsList>
            
            {[
              {
                value: "ai",
                title: "AI Symptom Checker & Disease Prediction",
                description: "Our advanced AI analyzes symptoms using machine learning algorithms to provide accurate disease predictions and recommendations.",
                features: [
                  "Multi-symptom analysis",
                  "Disease probability scoring",
                  "Doctor referral suggestions",
                  "Preventive care recommendations"
                ]
              },
              {
                value: "chat",
                title: "Real-Time Medical Messaging",
                description: "Secure WebSocket-based communication platform connecting patients with healthcare professionals instantly.",
                features: [
                  "End-to-end encrypted messaging",
                  "File sharing (reports, images)",
                  "Video call integration",
                  "Prescription sharing"
                ]
              },
              {
                value: "scan",
                title: "Smart Medicine Scanner",
                description: "Scan medicine packaging to get comprehensive information about usage, side effects, and precautions.",
                features: [
                  "Barcode/QR code scanning",
                  "Nepali medicine database",
                  "Usage instructions in Nepali",
                  "Interaction warnings"
                ]
              },
              {
                value: "hospitals",
                title: "Nepal Hospital Directory",
                description: "Complete database of hospitals across Nepal with real-time availability, specialties, and location mapping.",
                features: [
                  "Location-based search",
                  "Specialty filtering",
                  "Emergency contact details",
                  "Patient reviews & ratings"
                ]
              }
            ].map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="mt-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-2xl border-2 bg-gradient-to-r from-white to-blue-50 p-8 shadow-xl"
                >
                  <h3 className="mb-4 text-3xl font-bold text-gray-900">{tab.title}</h3>
                  <p className="mb-6 text-lg text-gray-600">{tab.description}</p>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {tab.features.map((feature, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="rounded-full bg-green-100 p-1">
                          <div className="h-2 w-2 rounded-full bg-green-600" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="mb-4 text-4xl font-bold text-white">Making an Impact</h2>
            <p className="text-xl text-blue-100">Numbers that tell our story</p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="text-center"
              >
                <Card className="border-0 bg-white/10 backdrop-blur-sm">
                  <CardContent className="pt-12 pb-10">
                    <div className="mb-4 inline-flex rounded-full bg-white/20 p-4">
                      <div className="text-white">{stat.icon}</div>
                    </div>
                    <div className="mb-2 text-5xl font-bold text-white">{stat.value}</div>
                    <div className="text-lg text-blue-100">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="mb-4 text-4xl font-bold text-gray-900">Meet Our Team</h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Dedicated professionals working to transform healthcare in Nepal
            </p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className="h-full border-2 hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="mb-6 inline-block"
                    >
                      <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                        <AvatarImage src={member.image} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900">{member.name}</h3>
                    <div className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-600">
                      {member.role}
                    </div>
                    <p className="text-gray-600">{member.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Join the Healthcare Revolution
            </h2>
            <p className="mb-10 text-xl text-gray-300">
              Be part of Nepal's most comprehensive digital healthcare platform
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button
              onClick={() => window.location.href = '/auth/register'}
              size="lg" className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                <Users className="h-5 w-5" />
                Sign Up Free
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                Schedule Demo
              </Button>
            </div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-12 inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 backdrop-blur-sm"
            >
              <Shield className="h-5 w-5 text-green-400" />
              <span className="text-green-400">●</span>
              <span className="text-gray-300">HIPAA Compliant & Secure</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Button className="h-14 w-14 rounded-full bg-gradient-to-r from-red-500 to-pink-500 shadow-lg">
            <Heart className="h-6 w-6" />
          </Button>
        </motion.div>
        
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          <Button className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
            <MessageSquare className="h-6 w-6" />
          </Button>
        </motion.div>
      </div>
    </div>
                  <Footer />
    
    </ProtectedRoute>
  );
}