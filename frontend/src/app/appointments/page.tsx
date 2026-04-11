"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ProtectedRoute from "@/components/auth/protected-route";
import DashboardNav from "@/components/dashboard/nav";
import { Calendar, Clock, User, Video, Phone, MapPin, Star, Filter } from "lucide-react";
const doctors = [
  {
    id: 1,
    name: "Dr. Ramesh Poudel",
    specialty: "Cardiologist",
    rating: 4.8,
    experience: "15 years",
    consultationFee: "NPR 1500",
    availability: "Today",
    slots: ["10:00 AM", "11:00 AM", "2:00 PM"],
    type: "video"
  },
  {
    id: 2,
    name: "Dr. Sunita Rai",
    specialty: "Pediatrician",
    rating: 4.9,
    experience: "12 years",
    consultationFee: "NPR 1200",
    availability: "Tomorrow",
    slots: ["9:00 AM", "11:00 AM", "4:00 PM"],
    type: "in-person"
  },
  {
    id: 3,
    name: "Dr. Hari Sharma",
    specialty: "Orthopedic",
    rating: 4.7,
    experience: "18 years",
    consultationFee: "NPR 2000",
    availability: "Today",
    slots: ["3:00 PM", "4:00 PM", "5:00 PM"],
    type: "video"
  },
  {
    id: 4,
    name: "Dr. Anita Basnet",
    specialty: "Dermatologist",
    rating: 4.6,
    experience: "10 years",
    consultationFee: "NPR 1000",
    availability: "Tomorrow",
    slots: ["10:00 AM", "1:00 PM", "3:00 PM"],
    type: "in-person"
  }
];
const appointments = [
  { id: 1, doctor: "Dr. Ramesh Poudel", time: "Today, 10:00 AM", type: "Video", status: "Confirmed" },
  { id: 2, doctor: "Dr. Sunita Rai", time: "Tomorrow, 11:00 AM", type: "In-Person", status: "Scheduled" },
  { id: 3, doctor: "Dr. Hari Sharma", time: "Yesterday, 3:00 PM", type: "Video", status: "Completed" },
];

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  const handleBookAppointment = (doctor: any) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

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
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Doctor Appointments</h1>
                <p className="text-gray-400">Book consultations with verified healthcare professionals</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-6 rounded-2xl glass-card">
                  <div className="text-2xl font-bold text-white mb-2">12</div>
                  <div className="text-gray-400">Total Appointments</div>
                </div>
                <div className="p-6 rounded-2xl glass-card">
                  <div className="text-2xl font-bold text-white mb-2">3</div>
                  <div className="text-gray-400">Upcoming</div>
                </div>
                <div className="p-6 rounded-2xl glass-card">
                  <div className="text-2xl font-bold text-white mb-2">9</div>
                  <div className="text-gray-400">Completed</div>
                </div>
              </div>

              {/* Doctors List */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Available Doctors</h2>
                  <div className="flex items-center gap-3">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                    >
                      <option value="all">All Types</option>
                      <option value="video">Video</option>
                      <option value="in-person">In-Person</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {doctors
                    .filter(doctor => selectedType === "all" || doctor.type === selectedType)
                    .map(doctor => (
                      <motion.div
                        key={doctor.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -5 }}
                        className="p-6 rounded-2xl glass-card hover-lift"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center">
                            <User className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-xl font-bold text-white">{doctor.name}</h3>
                                <p className="text-gray-400">{doctor.specialty}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <span className="text-white font-medium">{doctor.rating}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                              <span>{doctor.experience} experience</span>
                              <span>•</span>
                              <span className="text-white font-medium">{doctor.consultationFee}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300">{doctor.availability}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {doctor.type === "video" ? (
                              <Video className="w-4 h-4 text-blue-400" />
                            ) : (
                              <MapPin className="w-4 h-4 text-green-400" />
                            )}
                            <span className="text-gray-300 capitalize">{doctor.type}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="text-sm text-gray-400 mb-2">Available Slots</div>
                          <div className="flex flex-wrap gap-2">
                            {doctor.slots.map((slot, i) => (
                              <button
                                key={i}
                                className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => handleBookAppointment(doctor)}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium hover:shadow-lg hover:shadow-teal-500/25 transition-all"
                        >
                          Book Appointment
                        </button>
                      </motion.div>
                    ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Appointments */}
              <div className="p-6 rounded-2xl glass-card">
                <h3 className="text-xl font-bold text-white mb-4">Upcoming Appointments</h3>
                <div className="space-y-4">
                  {appointments.map(appointment => (
                    <div key={appointment.id} className="p-4 rounded-xl bg-white/5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="text-white font-medium">{appointment.doctor}</div>
                          <div className="text-sm text-gray-400 flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            {appointment.time}
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.status === "Confirmed" ? "bg-green-500/10 text-green-400" :
                          appointment.status === "Scheduled" ? "bg-blue-500/10 text-blue-400" :
                          "bg-gray-500/10 text-gray-400"
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {appointment.type === "Video" ? (
                          <Video className="w-4 h-4 text-blue-400" />
                        ) : (
                          <MapPin className="w-4 h-4 text-green-400" />
                        )}
                        <span className="text-sm text-gray-300">{appointment.type} Consultation</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-3 rounded-xl glass-card text-white font-medium hover:bg-white/10 transition-colors">
                  View All Appointments
                </button>
              </div>

              {/* Quick Book */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-500/20">
                <h3 className="text-xl font-bold text-white mb-4">Quick Book</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Appointment Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="p-3 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors text-center">
                        <Video className="w-5 h-5 mx-auto mb-2" />
                        <span>Video</span>
                      </button>
                      <button className="p-3 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors text-center">
                        <Phone className="w-5 h-5 mx-auto mb-2" />
                        <span>In-Person</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium">
                    Find Available Slots
                  </button>
                </div>
              </div>

              {/* Emergency */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20">
                <h3 className="text-xl font-bold text-white mb-4">🚨 Need Immediate Help?</h3>
                <button className="w-full py-3 rounded-xl bg-red-500/20 text-red-400 font-medium hover:bg-red-500/30 transition-colors mb-3">
                  Emergency Consultation
                </button>
                <button className="w-full py-3 rounded-xl glass-card text-white font-medium hover:bg-white/10 transition-colors">
                  Call Doctor Now
                </button>
              </div>
            </div>
          </div>

          {/* Booking Modal */}
          {showBookingModal && selectedDoctor && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-900 rounded-3xl p-8 max-w-md w-full"
              >
                <h3 className="text-2xl font-bold text-white mb-6">Book Appointment</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/5">
                    <div className="text-white font-medium mb-2">{selectedDoctor.name}</div>
                    <div className="text-gray-400 text-sm">{selectedDoctor.specialty}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Select Slot</label>
                    <select className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white">
                      <option>Choose time slot</option>
                      {selectedDoctor.slots.map((slot: string, i: number) => (
                        <option key={i} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Consultation Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="relative cursor-pointer">
                        <input type="radio" name="type" className="sr-only peer" />
                        <div className="p-3 rounded-xl bg-white/5 text-center peer-checked:bg-gradient-to-r peer-checked:from-teal-500 peer-checked:to-cyan-500 peer-checked:text-white">
                          <Video className="w-5 h-5 mx-auto mb-2" />
                          <span>Video</span>
                        </div>
                      </label>
                      <label className="relative cursor-pointer">
                        <input type="radio" name="type" className="sr-only peer" />
                        <div className="p-3 rounded-xl bg-white/5 text-center peer-checked:bg-gradient-to-r peer-checked:from-teal-500 peer-checked:to-cyan-500 peer-checked:text-white">
                          <Phone className="w-5 h-5 mx-auto mb-2" />
                          <span>In-Person</span>
                        </div>
                      </label>
                    </div>
                  </div>
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium">
                    Confirm Booking - {selectedDoctor.consultationFee}
                  </button>
                </div>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </motion.div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}