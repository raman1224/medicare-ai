"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedRoute from "@/components/auth/protected-route";
import DashboardNav from "@/components/dashboard/nav";
import {
  Droplets, Users, AlertCircle, Shield, Heart, Clock,
  MapPin, Phone, MessageCircle, Search, Filter, X,
  CheckCircle, AlertTriangle, Mail, Calendar, Award,
  Navigation, Activity, UserCheck, Zap, Globe,
  ThumbsUp, Bell, UserPlus, ArrowRight, Eye
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { bloodBankAPI } from "@/lib/api";

import Link from "next/link";
import { useRouter } from "next/navigation";

// Types
interface Donor {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  bloodGroup: string;
  location: {
    province: string;
    district: string;
    address?: string;
  };
  lastDonation?: string;
  donorAvailable: boolean;
  verified?: boolean;
  avatar?: string;
  totalDonations?: number;
}

interface BloodRequest {
  _id: string;
  bloodGroup: string;
  units: number;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  location: {
    province: string;
    district: string;
    address: string;
  };
  patientInfo: {
    name: string;
    age: number;
    gender: string;
    condition: string;
  };
  contact: {
    phone: string;
    relationship: string;
  };
  requiredBy: string;
  status: string;
  createdAt: string;
}

interface StatData {
  totalDonors: number;
  availableDonors: number;
  bloodGroups: Array<{ _id: string; count: number }>;
  totalRequests: number;
  urgentNeeds: number;
  livesSaved: number;
}

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const provinces = [
  "Province 1", "Province 2", "Bagmati", "Gandaki",
  "Lumbini", "Karnali", "Sudurpashchim"
];

export default function BloodBankPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isDonor, setIsDonor] = useState(false);
  const [donorProfile, setDonorProfile] = useState<any>(null);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showDonorForm, setShowDonorForm] = useState(false);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [stats, setStats] = useState<StatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [formData, setFormData] = useState({
    // Request form
    patientName: "",
    patientAge: "",
    patientGender: "male",
    patientCondition: "",
    bloodGroup: "",
    units: "1",
    urgency: "Medium",
    contactPhone: "",
    contactRelationship: "",
    province: "",
    district: "",
    address: "",
    hospital: "",
    requiredBy: "",
    
    // Donor form
    donorBloodGroup: "",
    donorAvailable: true,
    lastDonation: "",
    emergencyContact: "",
    agreeToTerms: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  useEffect(() => {
    checkDonorStatus();
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedBloodGroup || selectedProvince) {
      fetchDonors();
    }
  }, [selectedBloodGroup, selectedProvince]);

const checkDonorStatus = async () => {
  try {
    if (user?.role === 'donor') {
      const response = await bloodBankAPI.getDonorProfile();
      if (response.success && response.data) {
        setIsDonor(true);
        setDonorProfile(response.data);
      } else {
        setIsDonor(false);
        setDonorProfile(null);
      }
    } else {
      setIsDonor(false);
      setDonorProfile(null);
    }
  } catch (error) {
    console.error('Error checking donor status:', error);
    // Don't show error to user, just set as non-donor
    setIsDonor(false);
    setDonorProfile(null);
  }
};

  const fetchData = async () => {
    try {
      setLoading(true);
      const [requestsRes, donorsRes, statsRes] = await Promise.all([
        bloodBankAPI.getRequests(),
        bloodBankAPI.getDonors(),
        bloodBankAPI.getStatistics()
      ]);

      setRequests(requestsRes.data);
      setDonors(donorsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      showNotification('error', 'Failed to load data. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDonors = async () => {
    try {
      const params: any = {};
      if (selectedBloodGroup) params.bloodGroup = selectedBloodGroup;
      if (selectedProvince) params.location = selectedProvince;
      
      const response = await bloodBankAPI.getDonors(params);
      setDonors(response.data);
    } catch (error) {
      console.error('Error fetching donors:', error);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const requestData = {
        bloodGroup: formData.bloodGroup,
        units: parseInt(formData.units),
        urgency: formData.urgency,
        hospital: formData.hospital,
        requiredBy: formData.requiredBy,
        patientInfo: {
          name: formData.patientName,
          age: parseInt(formData.patientAge),
          gender: formData.patientGender,
          condition: formData.patientCondition
        },
        contact: {
          phone: formData.contactPhone,
          relationship: formData.contactRelationship
        },
        location: {
          province: formData.province,
          district: formData.district,
          address: formData.address
        }
      };

      const response = await bloodBankAPI.createRequest(requestData);
      
      if (response.success) {
        showNotification('success', 'Blood request created successfully!');
        setShowRequestForm(false);
        fetchData();
        resetForm();
        
        // Auto-match donors
        const matchResponse = await bloodBankAPI.matchDonors(response.data._id);
        if (matchResponse.data.matchingDonors?.length > 0) {
          showNotification('info', `${matchResponse.data.matchingDonors.length} potential donors found nearby!`);
        }
      }
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to create request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDonorRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const donorData = {
        bloodGroup: formData.donorBloodGroup,
        available: formData.donorAvailable,
        lastDonation: formData.lastDonation || undefined,
        emergencyContact: formData.emergencyContact
      };

      const response = await bloodBankAPI.registerAsDonor(donorData);
      
      if (response.success) {
        showNotification('success', 'Registered as donor successfully!');
        setIsDonor(true);
        setDonorProfile(response.data);
        setShowDonorForm(false);
        fetchData();
        resetForm();
      }
    } catch (error: any) {
      showNotification('error', error.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

   const handleUpdateAvailability = async () => {
    try {
      const response = await bloodBankAPI.updateDonorStatus({ 
        available: !donorProfile?.donorAvailable 
      });
      if (response.success) {
        setDonorProfile((prev: any) => ({ 
          ...prev, 
          donorAvailable: !prev?.donorAvailable 
        }));
        showNotification('success', 'Availability updated!');
      }
    } catch (error: any) {
      showNotification('error', error.message);
    }
  };

  const handleMessageDonor = (donorId: string, donorName: string) => {
    router.push(`/messages?userId=${donorId}&name=${encodeURIComponent(donorName)}&type=donor`);
  };

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const resetForm = () => {
    setFormData({
      patientName: "", patientAge: "", patientGender: "male", patientCondition: "",
      bloodGroup: "", units: "1", urgency: "Medium", contactPhone: "",
      contactRelationship: "", province: "", district: "", address: "",
      hospital: "", requiredBy: "", donorBloodGroup: "", donorAvailable: true,
      lastDonation: "", emergencyContact: "", agreeToTerms: false
    });
  };

  const filteredDonors = donors.filter(donor => 
    donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.location.district?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const urgentRequests = requests.filter(r => r.urgency === 'Critical' || r.urgency === 'High');

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950">
        <DashboardNav />
        
        {/* Notification Toast */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`fixed top-20 right-4 z-50 p-4 rounded-xl shadow-xl border ${
                notification.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                notification.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                'bg-blue-500/10 border-blue-500/30 text-blue-400'
              }`}
            >
              <div className="flex items-center gap-3">
                {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
                {notification.type === 'error' && <AlertCircle className="w-5 h-5" />}
                {notification.type === 'info' && <AlertTriangle className="w-5 h-5" />}
                <span>{notification.message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-3 mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                  <Droplets className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">Blood Donation Network</h1>
                  <p className="text-sm sm:text-base text-gray-400">Connect donors with recipients. Save lives together.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                  <Activity className="w-4 h-4 inline mr-1" />
                  {stats?.availableDonors || 0} Available
                </span>
              </div>
            </div>
          </motion.div>

          {/* Hero Section - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 mb-6 sm:mb-8"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">Every Drop Counts</h2>
                <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
                  Join our community of life-savers. Request blood in emergencies or become a donor to help others.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <button
                    onClick={() => setShowRequestForm(true)}
                    className="px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all text-sm sm:text-base"
                  >
                    Request Blood
                  </button>
                  <button
                    onClick={() => setShowDonorForm(true)}
                    className="px-6 sm:px-8 py-3 rounded-xl glass-card text-white font-semibold hover:bg-white/10 transition-colors text-sm sm:text-base"
                  >
                    Become a Donor
                  </button>
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-6xl mb-2 sm:mb-4">🩸</div>
                <div className="text-2xl sm:text-3xl font-bold text-white">{stats?.livesSaved || 1234}</div>
                <div className="text-xs sm:text-sm text-gray-400">Lives Saved</div>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards - Mobile Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl glass-card">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mb-1 sm:mb-2" />
              <div className="text-lg sm:text-2xl font-bold text-white">{stats?.totalDonors || 2458}</div>
              <div className="text-xs sm:text-sm text-gray-400">Active Donors</div>
            </div>
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl glass-card">
              <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mb-1 sm:mb-2" />
              <div className="text-lg sm:text-2xl font-bold text-white">{stats?.totalRequests || 1234}</div>
              <div className="text-xs sm:text-sm text-gray-400">Requests</div>
            </div>
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl glass-card">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mb-1 sm:mb-2" />
              <div className="text-lg sm:text-2xl font-bold text-white">{urgentRequests.length || 12}</div>
              <div className="text-xs sm:text-sm text-gray-400">Urgent Needs</div>
            </div>
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl glass-card">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mb-1 sm:mb-2" />
              <div className="text-lg sm:text-2xl font-bold text-white">{stats?.availableDonors || 845}</div>
              <div className="text-xs sm:text-sm text-gray-400">Available</div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left Column - Blood Groups & Requests */}
            <div className="lg:col-span-2 space-y-6">
              {/* Blood Groups Selection */}
              <div className="glass-card p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Find Donors by Blood Group</h3>
                <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 sm:gap-3">
                  {bloodGroups.map(group => (
                    <button
                      key={group}
                      onClick={() => setSelectedBloodGroup(selectedBloodGroup === group ? "" : group)}
                      className={`p-3 sm:p-4 rounded-xl text-center transition-all ${
                        selectedBloodGroup === group
                          ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25"
                          : "glass-card text-gray-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <div className="text-base sm:text-xl font-bold">{group}</div>
                      <div className="text-[10px] sm:text-xs mt-1 opacity-75">
                        {stats?.bloodGroups?.find(bg => bg._id === group)?.count || 0} donors
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Search & Filters */}
              <div className="glass-card p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search donors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-gray-300 hover:text-white transition-colors w-full sm:w-auto justify-center"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                    {(selectedProvince) && (
                      <span className="ml-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs">
                        1
                      </span>
                    )}
                  </button>
                </div>

                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Province
                          </label>
                          <select
                            value={selectedProvince}
                            onChange={(e) => setSelectedProvince(e.target.value)}
                            className="w-full p-2 rounded-xl bg-white/5 border border-white/10 text-white"
                          >
                            <option value="">All Provinces</option>
                            {provinces.map(p => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Donors List */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">
                  {selectedBloodGroup ? `${selectedBloodGroup} Donors` : 'Available Donors'}
                </h3>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : filteredDonors.length === 0 ? (
                  <div className="text-center py-12 glass-card">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No donors found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredDonors.map((donor) => (
                      <motion.div
                        key={donor._id}
                        whileHover={{ y: -2 }}
                        className="p-4 rounded-xl glass-card hover-lift"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center">
                              <span className="text-lg font-bold text-red-400">{donor.bloodGroup}</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-white">{donor.name}</h4>
                                {donor.verified && (
                                  <CheckCircle className="w-4 h-4 text-blue-400" />
                                )}
                                {donor.donorAvailable ? (
                                  <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs">
                                    Available
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-gray-500/10 text-gray-400 text-xs">
                                    Unavailable
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-400 mt-1">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {donor.location?.district || donor.location?.province}
                                </span>
                                {donor.lastDonation && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Last: {new Date(donor.lastDonation).toLocaleDateString()}
                                  </span>
                                )}
                                {donor.totalDonations && (
                                  <span className="flex items-center gap-1">
                                    <Award className="w-3 h-3" />
                                    {donor.totalDonations} donations
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 sm:ml-auto">
                            <button
                              onClick={() => handleMessageDonor(donor._id, donor.name)}
                              disabled={!donor.donorAvailable}
                              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
                                donor.donorAvailable
                                  ? 'bg-gradient-to-r from-primary to-primary/80 text-white hover:shadow-lg hover:shadow-primary/25'
                                  : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span className="sm:hidden">Message</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Requests */}
              {requests.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-white">Active Requests</h3>
                    <Link href="/blood-bank/requests" className="text-primary hover:text-primary/80 text-sm">
                      View all →
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {requests.slice(0, 3).map(request => (
                      <motion.div
                        key={request._id}
                        whileHover={{ y: -2 }}
                        className="p-4 rounded-xl glass-card hover-lift"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              request.urgency === "Critical" ? "bg-red-500/20" :
                              request.urgency === "High" ? "bg-orange-500/20" :
                              request.urgency === "Medium" ? "bg-yellow-500/20" : "bg-green-500/20"
                            }`}>
                              <span className={`text-lg font-bold ${
                                request.urgency === "Critical" ? "text-red-400" :
                                request.urgency === "High" ? "text-orange-400" :
                                request.urgency === "Medium" ? "text-yellow-400" : "text-green-400"
                              }`}>
                                {request.bloodGroup}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-white">{request.bloodGroup} Needed</h4>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  request.urgency === "Critical" ? "bg-red-500/10 text-red-400" :
                                  request.urgency === "High" ? "bg-orange-500/10 text-orange-400" :
                                  request.urgency === "Medium" ? "bg-yellow-500/10 text-yellow-400" : "bg-green-500/10 text-green-400"
                                }`}>
                                  {request.urgency}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {request.location.district}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Droplets className="w-3 h-3" />
                                  {request.units} units
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(request.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-red-500/25 transition-all">
                            Donate
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Donor Status & Info */}
            <div className="space-y-4 sm:space-y-6">
              {/* Donor Status Card */}
              <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl glass-card">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Your Donor Status</h3>
                {isDonor && donorProfile ? (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl ${
                      donorProfile.donorAvailable 
                        ? 'bg-green-500/10 border border-green-500/20' 
                        : 'bg-yellow-500/10 border border-yellow-500/20'
                    }`}>
                      <div className="flex items-center gap-3 mb-2">
                        {donorProfile.donorAvailable ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="text-green-400 font-medium">Available to Donate</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-5 h-5 text-yellow-400" />
                            <span className="text-yellow-400 font-medium">Currently Unavailable</span>
                          </>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm">
                        {donorProfile.donorAvailable 
                          ? 'Thank you for being ready to save lives!'
                          : 'Update your availability to help others.'}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Blood Group</span>
                        <span className="text-white font-bold text-lg">{donorProfile.bloodGroup}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Donation</span>
                        <span className="text-white">
                          {donorProfile.lastDonation 
                            ? new Date(donorProfile.lastDonation).toLocaleDateString()
                            : 'Never'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Donations</span>
                        <span className="text-white">{donorProfile.totalDonations || 0} times</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Verified Donor</span>
                        <span className={donorProfile.verified ? 'text-green-400' : 'text-yellow-400'}>
                          {donorProfile.verified ? 'Yes' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleUpdateAvailability}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
                    >
                      {donorProfile.donorAvailable ? 'Mark Unavailable' : 'Mark Available'}
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-white font-medium mb-2">Not a donor yet?</h4>
                    <p className="text-gray-400 text-sm mb-4">Join our network of life-savers</p>
                    <button
                      onClick={() => setShowDonorForm(true)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium"
                    >
                      Register as Donor
                    </button>
                  </div>
                )}
              </div>

              {/* Emergency Alert */}
              <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-red-500/20 to-red-500/5 border border-red-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <h3 className="text-lg font-bold text-white">Emergency Need</h3>
                </div>
                <p className="text-sm text-gray-300 mb-4">
                  Critical blood shortage detected. Your immediate response can save lives.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Critical Requests:</span>
                    <span className="text-red-400 font-bold">{urgentRequests.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Blood Types Needed:</span>
                    <span className="text-white">
                      {[...new Set(urgentRequests.map(r => r.bloodGroup))].join(', ')}
                    </span>
                  </div>
                </div>
                <button className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:shadow-lg hover:shadow-red-500/25 transition-all">
                  <Zap className="w-4 h-4 inline mr-2" />
                  Respond to Emergency
                </button>
              </div>

              {/* Safety Guidelines */}
              <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                <h3 className="text-lg font-bold text-white mb-4">Safety Guidelines</h3>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>All donors are medically screened</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>Sterile equipment used for all donations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>Post-donation care and follow-up provided</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>Complete confidentiality maintained</span>
                  </li>
                </ul>
              </div>

              {/* Blood Donation Tips */}
              <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl glass-card">
                <h3 className="text-lg font-bold text-white mb-4">Donation Tips</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-400 text-xs">1</span>
                    </div>
                    <p className="text-sm text-gray-300">Drink plenty of water before donation</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-400 text-xs">2</span>
                    </div>
                    <p className="text-sm text-gray-300">Eat iron-rich foods like spinach, beans</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-400 text-xs">3</span>
                    </div>
                    <p className="text-sm text-gray-300">Get good sleep the night before</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-400 text-xs">4</span>
                    </div>
                    <p className="text-sm text-gray-300">Avoid fatty foods 24 hours before</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Request Blood Modal */}
        <AnimatePresence>
          {showRequestForm && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gray-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Request Blood</h3>
                  <button
                    onClick={() => setShowRequestForm(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleRequestSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto pr-2 ">
                  {/* Patient Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Patient Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mt-2 mb-2">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.patientName}
                          onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                          placeholder="Patient's full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Age *</label>
                        <input
                          type="number"
                          required
                          min="0"
                          max="120"
                          value={formData.patientAge}
                          onChange={(e) => setFormData({...formData, patientAge: e.target.value})}
                          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                          placeholder="Age"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Gender *</label>
                        <select
                          required
                          value={formData.patientGender}
                          onChange={(e) => setFormData({...formData, patientGender: e.target.value})}
                          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm text-gray-400 mb-2">Medical Condition *</label>
                        <input
                          type="text"
                          required
                          value={formData.patientCondition}
                          onChange={(e) => setFormData({...formData, patientCondition: e.target.value})}
                          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                          placeholder="e.g., Surgery, Accident, Treatment"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Blood Details */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Blood Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Blood Group *</label>
                        <select
                          required
                          value={formData.bloodGroup}
                          onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary"
                        >
                          <option value="">Select</option>
                          {bloodGroups.map(group => (
                            <option key={group} value={group}>{group}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Units *</label>
                        <select
                          required
                          value={formData.units}
                          onChange={(e) => setFormData({...formData, units: e.target.value})}
                          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary"
                        >
                          {[1,2,3,4,5,6,7,8,9,10].map(num => (
                            <option key={num} value={num}>{num} unit{num > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Urgency *</label>
                        <select
                          required
                          value={formData.urgency}
                          onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Contact Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={formData.contactPhone}
                          onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                          placeholder="98XXXXXXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Relationship *</label>
                        <input
                          type="text"
                          required
                          value={formData.contactRelationship}
                          onChange={(e) => setFormData({...formData, contactRelationship: e.target.value})}
                          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                          placeholder="e.g., Family, Friend"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Location</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Province *</label>
                        <select
                          required
                          value={formData.province}
                          onChange={(e) => setFormData({...formData, province: e.target.value})}
                          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary"
                        >
                          <option value="">Select Province</option>
                          {provinces.map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">District *</label>
                        <input
                          type="text"
                          required
                          value={formData.district}
                          onChange={(e) => setFormData({...formData, district: e.target.value})}
                          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                          placeholder="e.g., Kathmandu"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm text-gray-400 mb-2">Full Address *</label>
                        <input
                          type="text"
                          required
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                          placeholder="Street, Ward No., Landmark"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hospital & Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Hospital *</label>
                      <input
                        type="text"
                        required
                        value={formData.hospital}
                        onChange={(e) => setFormData({...formData, hospital: e.target.value})}
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                        placeholder="Hospital name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Required By *</label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.requiredBy}
                        onChange={(e) => setFormData({...formData, requiredBy: e.target.value})}
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all disabled:opacity-50"
                    >
                      {submitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </span>
                      ) : 'Submit Request'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRequestForm(false)}
                      className="px-6 py-3 rounded-xl glass-card text-gray-300 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Donor Registration Modal */}
        <AnimatePresence>
          {showDonorForm && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gray-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-lg w-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Become a Donor</h3>
                  <button
                    onClick={() => setShowDonorForm(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleDonorRegister} className="space-y-5">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Blood Group *</label>
                    <select
                      required
                      value={formData.donorBloodGroup}
                      onChange={(e) => setFormData({...formData, donorBloodGroup: e.target.value})}
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary"
                    >
                      <option value="">Select Blood Group</option>
                      {bloodGroups.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Last Donation Date (if any)</label>
                    <input
                      type="date"
                      max={new Date().toISOString().split('T')[0]}
                      value={formData.lastDonation}
                      onChange={(e) => setFormData({...formData, lastDonation: e.target.value})}
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Emergency Contact *</label>
                    <input
                      type="tel"
                      required
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                      placeholder="98XXXXXXXX"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="available"
                      checked={formData.donorAvailable}
                      onChange={(e) => setFormData({...formData, donorAvailable: e.target.checked})}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary"
                    />
                    <label htmlFor="available" className="text-gray-300 text-sm">
                      I am available to donate blood
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      checked={formData.agreeToTerms}
                      onChange={(e) => setFormData({...formData, agreeToTerms: e.target.checked})}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary mt-1"
                    />
                    <label htmlFor="terms" className="text-gray-400 text-sm">
                      I confirm that I meet the eligibility criteria for blood donation and agree to the terms and conditions.
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={submitting || !formData.agreeToTerms}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all disabled:opacity-50"
                    >
                      {submitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Registering...
                        </span>
                      ) : 'Register as Donor'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDonorForm(false)}
                      className="px-6 py-3 rounded-xl glass-card text-gray-300 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}