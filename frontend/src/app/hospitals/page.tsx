// medicare-nepal/frontend/src/app/hospitals/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ProtectedRoute from "@/components/auth/protected-route";
import DashboardNav from "@/components/dashboard/nav";
import { MapPin, Phone, Clock, Star, Filter, Navigation, Ambulance, Building } from "lucide-react";

const provinces = ["Province 1", "Province 2", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"];
const specialties = ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Emergency", "Dental", "Eye Care"];
const hospitals = [
  {
    id: 1,
    name: "Bir Hospital",
    type: "Government",
    location: "Kathmandu",
    distance: "2.5 km",
    rating: 4.2,
    emergency: true,
    specialties: ["Emergency", "General"],
    contact: "01-4221119",
    availability: "@/7"
  },
  {
    id: 2,
    name: "Norvic International Hospital",
    type: "Private",
    location: "Thapathali",
    distance: "3.1 km",
    rating: 4.5,
    emergency: true,
    specialties: ["Cardiology", "Neurology", "Emergency"],
    contact: "01-5970100",
    availability: "@/7"
  },
  {
    id: 3,
    name: "Grande International Hospital",
    type: "Private",
    location: "Tokha",
    distance: "5.8 km",
    rating: 4.4,
    emergency: true,
    specialties: ["Orthopedics", "Pediatrics", "Emergency"],
    contact: "01-4982400",
    availability: "@/7"
  },
  {
    id: 4,
    name: "Teaching Hospital",
    type: "Government",
    location: "Maharajgunj",
    distance: "4.2 km",
    rating: 4.0,
    emergency: true,
    specialties: ["General", "Teaching"],
    contact: "01-4412303",
    availability: "@/7"
  }
];

export default function HospitalsPage() {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false);

  const filteredHospitals = hospitals.filter(hospital => {
    if (selectedProvince && !hospital.location.includes(selectedProvince)) return false;
    if (selectedSpecialty && !hospital.specialties.includes(selectedSpecialty)) return false;
    if (showEmergencyOnly && !hospital.emergency) return false;
    return true;
  });

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
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Hospital Finder</h1>
                <p className="text-gray-400">Find hospitals by location, specialty, and emergency availability</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div>
              <div className="p-6 rounded-2xl glass-card sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-bold text-white">Filters</h3>
                </div>

                {/* Province Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    <MapPin className="inline w-4 h-4 mr-2" />
                    Province
                  </label>
                  <div className="space-y-2">
                    {provinces.map(province => (
                      <label key={province} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="province"
                          value={province}
                          checked={selectedProvince === province}
                          onChange={(e) => setSelectedProvince(e.target.value)}
                          className="w-4 h-4 text-primary bg-white/5 border-white/10 focus:ring-primary"
                        />
                        <span className="text-gray-300">{province}</span>
                      </label>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedProvince("")}
                    className="mt-2 text-sm text-primary hover:text-primary/80"
                  >
                    Clear selection
                  </button>
                </div>

                {/* Specialty Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    <Building className="inline w-4 h-4 mr-2" />
                    Specialty
                  </label>
                  <div className="space-y-2">
                    {specialties.map(specialty => (
                      <label key={specialty} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="specialty"
                          value={specialty}
                          checked={selectedSpecialty === specialty}
                          onChange={(e) => setSelectedSpecialty(e.target.value)}
                          className="w-4 h-4 text-primary bg-white/5 border-white/10 focus:ring-primary"
                        />
                        <span className="text-gray-300">{specialty}</span>
                      </label>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedSpecialty("")}
                    className="mt-2 text-sm text-primary hover:text-primary/80"
                  >
                    Clear selection
                  </button>
                </div>

                {/* Emergency Filter */}
                <div className="mb-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showEmergencyOnly}
                      onChange={(e) => setShowEmergencyOnly(e.target.checked)}
                      className="w-4 h-4 text-primary bg-white/5 border-white/10 rounded focus:ring-primary"
                    />
                    <div className="flex items-center gap-2">
                      <Ambulance className="w-5 h-5 text-red-400" />
                      <span className="text-gray-300">Emergency Only</span>
                    </div>
                  </label>
                </div>

                {/* Quick Stats */}
                <div className="p-4 rounded-xl bg-white/5">
                  <div className="text-sm text-gray-400 mb-2">Showing</div>
                  <div className="text-2xl font-bold text-white">{filteredHospitals.length}</div>
                  <div className="text-sm text-gray-400">hospitals available</div>
                </div>
              </div>

              {/* Emergency Card */}
              <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20">
                <h3 className="text-xl font-bold text-white mb-4">🚨 Emergency</h3>
                <button className="w-full py-3 rounded-xl bg-red-500/20 text-red-400 font-medium hover:bg-red-500/30 transition-colors mb-3">
                  Call Ambulance (102)
                </button>
                <button className="w-full py-3 rounded-xl glass-card text-white font-medium hover:bg-white/10 transition-colors">
                  Nearest Emergency Room
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search hospitals by name or location..."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl glass-card text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mb-8">
                <div className="h-64 rounded-2xl glass-card overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-green-500/20 flex items-center justify-center">
                    <div className="text-center">
                      <Navigation className="w-12 h-12 text-white mx-auto mb-4" />
                      <p className="text-white font-medium">Interactive Map Loading...</p>
                      <p className="text-gray-300 text-sm">Google Maps integration</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hospitals List */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Nearby Hospitals</h2>
                  <div className="text-gray-400">
                    Sorted by: <span className="text-white font-medium">Distance</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredHospitals.map(hospital => (
                    <motion.div
                      key={hospital.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -5 }}
                      className="p-6 rounded-2xl glass-card hover-lift"
                    >
                      <div className="flex flex-col md:flex-row md:items-start gap-6">
                        {/* Hospital Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-white mb-2">{hospital.name}</h3>
                              <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  hospital.type === "Government"
                                    ? "bg-blue-500/10 text-blue-400"
                                    : "bg-purple-500/10 text-purple-400"
                                }`}>
                                  {hospital.type}
                                </span>
                                {hospital.emergency && (
                                  <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-sm font-medium">
                                    🚨 Emergency
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                              <span className="text-white font-bold">{hospital.rating}</span>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center gap-3">
                              <MapPin className="w-5 h-5 text-gray-400" />
                              <div>
                                <div className="text-sm text-gray-400">Location</div>
                                <div className="text-white">{hospital.location}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Clock className="w-5 h-5 text-gray-400" />
                              <div>
                                <div className="text-sm text-gray-400">Availability</div>
                                <div className="text-white">{hospital.availability}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Phone className="w-5 h-5 text-gray-400" />
                              <div>
                                <div className="text-sm text-gray-400">Contact</div>
                                <div className="text-white font-medium">{hospital.contact}</div>
                              </div>
                            </div>
                          </div>

                          {/* Specialties */}
                          <div>
                            <div className="text-sm text-gray-400 mb-2">Specialties</div>
                            <div className="flex flex-wrap gap-2">
                              {hospital.specialties.map((spec, i) => (
                                <span key={i} className="px-3 py-1 rounded-full bg-white/5 text-gray-300 text-sm">
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:shadow-lg hover:shadow-primary/25 transition-all">
                            Get Directions
                          </button>
                          <button className="px-6 py-3 rounded-xl glass-card text-white font-medium hover:bg-white/10 transition-colors">
                            Call Now
                          </button>
                          <button className="px-6 py-3 rounded-xl glass-card text-white font-medium hover:bg-white/10 transition-colors">
                            Book Appointment
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* No Results */}
                {filteredHospitals.length === 0 && (
                  <div className="text-center py-12">
                    <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No hospitals found</h3>
                    <p className="text-gray-400">Try adjusting your filters or search term</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}