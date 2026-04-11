// medicare-nepal/frontend/src/app/doctors/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProtectedRoute from "@/components/auth/protected-route";
import DashboardNav from "@/components/dashboard/nav";
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Clock, 
  Video, 
  Phone, 
  Calendar,
  Users,
  Award,
  Check,
  Shield,
  ChevronDown,
  Sparkles,
  ThumbsUp,
  Clock4,
  DollarSign,
  Languages
} from "lucide-react";

const specializations = [
  { id: "all", name: "All Specialties", icon: "🏥" },
  { id: "cardiologist", name: "Cardiologist", icon: "❤️" },
  { id: "dermatologist", name: "Dermatologist", icon: "🔬" },
  { id: "pediatrician", name: "Pediatrician", icon: "👶" },
  { id: "orthopedic", name: "Orthopedic", icon: "🦴" },
  { id: "neurologist", name: "Neurologist", icon: "🧠" },
  { id: "psychiatrist", name: "Psychiatrist", icon: "🧠" },
  { id: "gynecologist", name: "Gynecologist", icon: "🌸" },
  { id: "dentist", name: "Dentist", icon: "🦷" },
  { id: "general", name: "General Physician", icon: "👨‍⚕️" },
  { id: "ent", name: "ENT Specialist", icon: "👂" },
  { id: "eye", name: "Eye Specialist", icon: "👁️" },
];

const doctors = [
  {
    id: 1,
    name: "Dr. Ramesh Poudel",
    specialization: "Cardiologist",
    experience: 15,
    rating: 4.8,
    reviews: 124,
    consultationFee: "NPR 1500",
    availability: "Today",
    languages: ["English", "Nepali", "Hindi"],
    verified: true,
    videoConsultation: true,
    hospital: "Norvic International Hospital",
    location: "Kathmandu",
    avatar: "👨‍⚕️",
    nextAvailable: "10:00 AM",
    popular: true,
  },
  {
    id: 2,
    name: "Dr. Sunita Rai",
    specialization: "Pediatrician",
    experience: 12,
    rating: 4.9,
    reviews: 89,
    consultationFee: "NPR 1200",
    availability: "Tomorrow",
    languages: ["English", "Nepali"],
    verified: true,
    videoConsultation: true,
    hospital: "Grande Hospital",
    location: "Pokhara",
    avatar: "👩‍⚕️",
    nextAvailable: "11:00 AM",
    popular: true,
  },
  {
    id: 3,
    name: "Dr. Hari Sharma",
    specialization: "Orthopedic",
    experience: 18,
    rating: 4.7,
    reviews: 156,
    consultationFee: "NPR 2000",
    availability: "Today",
    languages: ["English", "Nepali"],
    verified: true,
    videoConsultation: false,
    hospital: "Bir Hospital",
    location: "Kathmandu",
    avatar: "👨‍⚕️",
    nextAvailable: "3:00 PM",
  },
  {
    id: 4,
    name: "Dr. Anita Basnet",
    specialization: "Dermatologist",
    experience: 10,
    rating: 4.6,
    reviews: 67,
    consultationFee: "NPR 1000",
    availability: "Tomorrow",
    languages: ["English", "Nepali"],
    verified: true,
    videoConsultation: true,
    hospital: "Teaching Hospital",
    location: "Kathmandu",
    avatar: "👩‍⚕️",
    nextAvailable: "1:00 PM",
  },
  {
    id: 5,
    name: "Dr. Rajesh Karki",
    specialization: "Neurologist",
    experience: 14,
    rating: 4.8,
    reviews: 92,
    consultationFee: "NPR 1800",
    availability: "Today",
    languages: ["English", "Nepali"],
    verified: true,
    videoConsultation: true,
    hospital: "Medicare Hospital",
    location: "Biratnagar",
    avatar: "👨‍⚕️",
    nextAvailable: "2:00 PM",
    popular: true,
  },
  {
    id: 6,
    name: "Dr. Priya Shrestha",
    specialization: "Gynecologist",
    experience: 11,
    rating: 4.9,
    reviews: 78,
    consultationFee: "NPR 1300",
    availability: "Tomorrow",
    languages: ["English", "Nepali"],
    verified: true,
    videoConsultation: true,
    hospital: "Paropakar Hospital",
    location: "Kathmandu",
    avatar: "👩‍⚕️",
    nextAvailable: "10:30 AM",
  },
];

export default function DoctorsPage() {
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [showVideoOnly, setShowVideoOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const filteredDoctors = doctors.filter(doctor => {
    if (selectedSpecialization !== "all" && doctor.specialization !== specializations.find(s => s.id === selectedSpecialization)?.name) {
      return false;
    }
    if (minRating > 0 && doctor.rating < minRating) {
      return false;
    }
    if (showVerifiedOnly && !doctor.verified) {
      return false;
    }
    if (showVideoOnly && !doctor.videoConsultation) {
      return false;
    }
    if (searchQuery && !doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "experience":
        return b.experience - a.experience;
      case "fee":
        return parseInt(a.consultationFee.replace("NPR ", "")) - parseInt(b.consultationFee.replace("NPR ", ""));
      default:
        return 0;
    }
  });

  const selectedSpecName = specializations.find(s => s.id === selectedSpecialization)?.name || "All Specialties";

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950">
        <DashboardNav />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Find Your Doctor</h1>
                  <p className="text-gray-400">Book appointments with verified healthcare professionals</p>
                </div>
              </div>
              
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="lg:hidden px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${isFiltersOpen ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-teal-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">500+</div>
                </div>
                <div className="text-gray-400 text-sm">Verified Doctors</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">50+</div>
                </div>
                <div className="text-gray-400 text-sm">Specialties</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <Clock4 className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">24/7</div>
                </div>
                <div className="text-gray-400 text-sm">Available</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">4.8</div>
                </div>
                <div className="text-gray-400 text-sm">Avg Rating</div>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Desktop */}
            <div className={`lg:block lg:w-80 ${isFiltersOpen ? 'block' : 'hidden'}`}>
              <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 sticky top-24 shadow-xl shadow-black/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-bold text-white">Filters</h3>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedSpecialization("all");
                      setMinRating(0);
                      setShowVerifiedOnly(false);
                      setShowVideoOnly(false);
                      setSearchQuery("");
                      setSortBy("rating");
                    }}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Clear all
                  </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                      placeholder="Search doctors, specialties..."
                    />
                  </div>
                </div>

                {/* Specialization */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Specialization
                  </label>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {specializations.map((spec) => (
                      <button
                        key={spec.id}
                        onClick={() => setSelectedSpecialization(spec.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                          selectedSpecialization === spec.id
                            ? "bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 text-white"
                            : "text-gray-300 hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        <span className="text-xl">{spec.icon}</span>
                        <span className="text-sm font-medium">{spec.name}</span>
                        {selectedSpecialization === spec.id && (
                          <Check className="w-4 h-4 ml-auto text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Minimum Rating
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[0, 3, 4, 4.5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setMinRating(rating)}
                        className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1 ${
                          minRating === rating
                            ? "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 text-yellow-400"
                            : "bg-white/5 text-gray-300 hover:bg-white/10 border border-transparent"
                        }`}
                      >
                        <Star className="w-4 h-4 fill-current" />
                        {rating === 0 ? "Any" : `${rating}+`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Checkbox Filters */}
                <div className="space-y-4 mb-6">
                  <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-gray-300">Verified Only</span>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={showVerifiedOnly}
                        onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full transition-all ${showVerifiedOnly ? 'bg-green-500' : 'bg-white/10'}`}>
                        <div className={`w-6 h-6 bg-white rounded-full transform transition-transform ${showVerifiedOnly ? 'translate-x-6' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Video className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-gray-300">Video Consultation</span>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={showVideoOnly}
                        onChange={(e) => setShowVideoOnly(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full transition-all ${showVideoOnly ? 'bg-blue-500' : 'bg-white/10'}`}>
                        <div className={`w-6 h-6 bg-white rounded-full transform transition-transform ${showVideoOnly ? 'translate-x-6' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  </label>
                </div>

                {/* Sort By */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Sort By
                  </label>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 appearance-none transition-all"
                    >
                      <option value="rating">Highest Rated</option>
                      <option value="experience">Most Experienced</option>
                      <option value="fee">Lowest Fee</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Results Count */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-400">Showing</div>
                    <div className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                      {filteredDoctors.length} found
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">{filteredDoctors.length}</div>
                  <div className="text-sm text-gray-400">doctors available</div>
                </div>
              </div>

              {/* Emergency Card */}
              <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent border border-red-500/20 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <span className="text-2xl">🚨</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">Emergency?</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">Immediate medical assistance available</p>
                <div className="space-y-3">
                  <button className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:shadow-lg hover:shadow-red-500/25 transition-all flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    Emergency Consultation
                  </button>
                  <button className="w-full py-3 px-4 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Find Nearest Hospital
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Active Filters */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
                  {selectedSpecName}
                </div>
                {minRating > 0 && (
                  <div className="px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-400 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    {minRating}+ Rating
                  </div>
                )}
                {showVerifiedOnly && (
                  <div className="px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-sm text-green-400 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Verified
                  </div>
                )}
                {showVideoOnly && (
                  <div className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400 flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    Video Available
                  </div>
                )}
                {(selectedSpecialization !== "all" || minRating > 0 || showVerifiedOnly || showVideoOnly) && (
                  <button
                    onClick={() => {
                      setSelectedSpecialization("all");
                      setMinRating(0);
                      setShowVerifiedOnly(false);
                      setShowVideoOnly(false);
                    }}
                    className="px-3 py-1.5 rounded-full bg-white/5 text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              {/* Doctors Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredDoctors.map((doctor) => (
<motion.div
  key={doctor.id}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={{ y: -5 }}
  className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
>
  {/* Doctor Header */}
  <div className="flex flex-col sm:flex-row gap-4 mb-6">
    <div className="flex items-start gap-4">
      <div className="relative">
        <div className="text-5xl">{doctor.avatar}</div>
        {doctor.verified && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-white">{doctor.name}</h3>
              {doctor.popular && (
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-400 text-xs font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Popular
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {doctor.specialization}
              </span>
              <span className="text-gray-400 text-sm">{doctor.experience} years exp.</span>
            </div>
          </div>
          
          {/* Fee Display */}
          <div className="flex items-start gap-4 sm:flex-col sm:items-end">
            <div className="text-right">
              <div className="text-gray-400 text-sm">Fee</div>
              <div className="text-2xl font-bold text-white flex items-center">
                <DollarSign className="w-5 h-5 text-gray-400" />
                {doctor.consultationFee.replace("NPR ", "")}
              </div>
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-bold">{doctor.rating}</span>
              </div>
              <span className="text-gray-400 text-sm">({doctor.reviews})</span>
            </div>
          </div>
        </div>
        
        {/* Video Badge */}
        {doctor.videoConsultation && (
          <div className="inline-flex items-center gap-1 text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full mb-4">
            <Video className="w-3 h-3" />
            <span className="text-xs font-medium">Video Available</span>
          </div>
        )}
      </div>
    </div>
  </div>

  {/* Doctor Details */}
  <div className="space-y-4 mb-6">
    <div className="flex items-center gap-3">
      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
      <span className="text-gray-300 text-sm">
        {doctor.hospital}, {doctor.location}
      </span>
    </div>
    <div className="flex items-center gap-3">
      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
      <span className="text-gray-300 text-sm">
        Next available: <span className="text-green-400 font-medium">{doctor.nextAvailable}</span>
      </span>
    </div>
    <div className="flex items-center gap-3">
      <Languages className="w-4 h-4 text-gray-400 flex-shrink-0" />
      <div className="flex flex-wrap gap-2">
        {doctor.languages.map((lang) => (
          <span key={lang} className="px-2 py-1 rounded-full bg-white/5 text-gray-300 text-xs">
            {lang}
          </span>
        ))}
      </div>
    </div>
  </div>

  {/* Action Buttons - Now properly inside the border */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
    <button className="px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center gap-2 group">
      <Calendar className="w-4 h-4" />
      <span>Book</span>
      <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
    <button className="px-4 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-2">
      <Video className="w-4 h-4" />
      <span>Video</span>
    </button>
    <button className="px-4 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-2">
      <Phone className="w-4 h-4" />
      <span>Call</span>
    </button>
  </div>
</motion.div>
                ))}
              </div>

              {/* No Results */}
              {filteredDoctors.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 rounded-full bg-white/5 mx-auto mb-6 flex items-center justify-center">
                    <Users className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">No doctors found</h3>
                  <p className="text-gray-400 mb-6">Try adjusting your filters or search for different specialties</p>
                  <button
                    onClick={() => {
                      setSelectedSpecialization("all");
                      setMinRating(0);
                      setShowVerifiedOnly(false);
                      setShowVideoOnly(false);
                      setSearchQuery("");
                    }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
                  >
                    Reset Filters
                  </button>
                </motion.div>
              )}

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-12"
              >
                <h3 className="text-2xl font-bold text-white mb-8">Why Choose Our Doctors?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">100% Verified</h4>
                    <p className="text-gray-400 text-sm">All doctors are verified with proper credentials and licenses</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">Video Consultation</h4>
                    <p className="text-gray-400 text-sm">Consult from anywhere with secure video calls</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                      <ThumbsUp className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">Patient Reviews</h4>
                    <p className="text-gray-400 text-sm">Real feedback from thousands of satisfied patients</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}