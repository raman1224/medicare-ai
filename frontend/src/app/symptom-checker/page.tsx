
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedRoute from "@/components/auth/protected-route";
import DashboardNav from "@/components/dashboard/nav";
import { api } from "@/lib/api";
import { 
  Thermometer, Brain, Loader2, AlertCircle, CheckCircle, 
   Stethoscope, Pill, Utensils, Heart,
  ChevronDown, ChevronUp, X, Plus, Clock, AlertTriangle
} from "lucide-react";

const commonSymptoms = [
  "Fever", "Cough", "Headache", "Fatigue", "Nausea", "Dizziness",
  "Shortness of breath", "Chest pain", "Sore throat", "Body aches",
  "Loss of taste/smell", "Diarrhea", "Vomiting", "Rash", "Joint pain",
  "Runny nose", "Sneezing", "Chills", "Muscle pain", "Abdominal pain"
];

export default function SymptomCheckerPage() {
  const [loading, setLoading] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<"male" | "female" | "other">("male");
  const [temperature, setTemperature] = useState("");
  const [tempUnit, setTempUnit] = useState<"celsius" | "fahrenheit">("celsius");
  const [symptomDuration, setSymptomDuration] = useState("");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<any>(null);
  const [expandedSection, setExpandedSection] = useState<string>("conditions");
  const [error, setError] = useState<string | null>(null);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms(prev => [...prev, customSymptom.trim()]);
      setCustomSymptom("");
    }
  };

  const analyzeSymptoms = async () => {
    if (selectedSymptoms.length === 0) {
      setError("Please select at least one symptom");
      return;
    }

    if (!age) {
      setError("Please enter your age");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const requestData = {
        symptoms: selectedSymptoms,
        age: parseInt(age),
        sex,
        temperature: temperature ? `${temperature}°${tempUnit === "celsius" ? "C" : "F"}` : "",
        duration: symptomDuration,
        description
      };

      // Call the API - it will handle authentication internally
      const response = await api.analyzeSymptoms(requestData);

      if (response.success) {
        setResult(response.data);
        setTimeout(() => {
          document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        setError(response.message || "Failed to analyze symptoms");
      }
    } catch (error: any) {
      console.error("Analysis error:", error);
      setError(error.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? "" : section);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'bg-red-500 text-white';
      case 'High': return 'bg-orange-500 text-white';
      case 'Moderate': return 'bg-yellow-500 text-black';
      default: return 'bg-green-500 text-white';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return <AlertCircle className="w-5 h-5" />;
      case 'High': return <AlertTriangle className="w-5 h-5" />;
      case 'Moderate': return <Clock className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <DashboardNav />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">AI Symptom Analyzer</h1>
                <p className="text-gray-400">Get intelligent health insights based on your symptoms</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20">
                <h2 className="text-xl font-bold text-white mb-6">Describe Your Symptoms</h2>
                
                {/* Age and Sex */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your age"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Sex</label>
                    <div className="flex gap-3">
                      {['male', 'female', 'other'].map((s) => (
                        <button
                          key={s}
                          onClick={() => setSex(s as any)}
                          className={`flex-1 py-3 rounded-xl font-medium capitalize transition-all ${
                            sex === s
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : 'bg-white/5 text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Temperature */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Thermometer className="w-4 h-4" />
                      Body Temperature
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setTempUnit("celsius")}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          tempUnit === "celsius" ? "bg-purple-500 text-white" : "bg-white/5 text-gray-400"
                        }`}
                      >
                        °C
                      </button>
                      <button
                        onClick={() => setTempUnit("fahrenheit")}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          tempUnit === "fahrenheit" ? "bg-purple-500 text-white" : "bg-white/5 text-gray-400"
                        }`}
                      >
                        °F
                      </button>
                    </div>
                  </div>
                  <input
                    type="number"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder={`Enter temperature in °${tempUnit === "celsius" ? "C" : "F"}`}
                  />
                </div>

                {/* Symptoms */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Select Symptoms</h3>
                    <span className="text-sm text-gray-400">{selectedSymptoms.length} selected</span>
                  </div>
                  
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={customSymptom}
                      onChange={(e) => setCustomSymptom(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomSymptom()}
                      className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Type custom symptom..."
                    />
                    <button
                      onClick={addCustomSymptom}
                      className="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                    {commonSymptoms.map(symptom => (
                      <button
                        key={symptom}
                        onClick={() => toggleSymptom(symptom)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedSymptoms.includes(symptom)
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                            : "bg-white/5 text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        {symptom}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Symptom Duration</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {["Less than 24 hours", "1-3 days", "4-7 days", "Over 1 week"].map((duration) => (
                      <button
                        key={duration}
                        onClick={() => setSymptomDuration(duration)}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          symptomDuration === duration
                            ? "bg-purple-500 text-white"
                            : "bg-white/5 text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        {duration}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Additional Details</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-24 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Describe your symptoms in detail..."
                  />
                </div>

                {error && (
                  <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <button
                  onClick={analyzeSymptoms}
                  disabled={loading || selectedSymptoms.length === 0}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5" />
                      Analyze Symptoms
                    </>
                  )}
                </button>
              </div>

              {/* Results Section */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    id="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-6"
                  >
                    {/* Urgency Card */}
                    <div className={`p-6 rounded-2xl mb-6 ${getUrgencyColor(result.urgency)}`}>
                      <div className="flex items-center gap-3">
                        {getUrgencyIcon(result.urgency)}
                        <div>
                          <h3 className="text-xl font-bold">Urgency: {result.urgency}</h3>
                          <p className="opacity-90">
                            {result.urgency === 'Critical' && 'Seek emergency care immediately'}
                            {result.urgency === 'High' && 'See a doctor within 24 hours'}
                            {result.urgency === 'Moderate' && 'Monitor symptoms, consult if worsens'}
                            {result.urgency === 'Low' && 'Rest and monitor at home'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Possible Conditions */}
                    <div className="mb-6">
                      <button
                        onClick={() => toggleSection('conditions')}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <Stethoscope className="w-5 h-5 text-blue-400" />
                          <h3 className="text-lg font-semibold text-white">Possible Conditions</h3>
                        </div>
                        {expandedSection === 'conditions' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                      
                      {expandedSection === 'conditions' && (
                        <div className="mt-4 space-y-4">
                          {result.diagnosis?.map((condition: any, i: number) => (
                            <div key={i} className="p-4 rounded-xl bg-white/5">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="text-white font-medium">{condition.name}</h4>
                                  <p className="text-sm text-gray-400">{condition.commonName}</p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-sm ${
                                  condition.severity === 'High' ? 'bg-red-500/20 text-red-400' :
                                  condition.severity === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-green-500/20 text-green-400'
                                }`}>
                                  {condition.probability}% match
                                </div>
                              </div>
                              <p className="text-gray-300 text-sm">{condition.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Medicines */}
                    {result.recommendations?.medications?.length > 0 && (
                      <div className="mb-6">
                        <button
                          onClick={() => toggleSection('medicines')}
                          className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10"
                        >
                          <div className="flex items-center gap-3">
                            <Pill className="w-5 h-5 text-green-400" />
                            <h3 className="text-lg font-semibold text-white">Recommended Medicines</h3>
                          </div>
                          {expandedSection === 'medicines' ? <ChevronUp /> : <ChevronDown />}
                        </button>
                        
                        {expandedSection === 'medicines' && (
                          <div className="mt-4 space-y-3">
                            {result.recommendations.medications.map((med: any, i: number) => (
                              <div key={i} className="p-4 rounded-xl bg-white/5">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-white font-medium">{med.name}</p>
                                    <p className="text-sm text-gray-400">{med.dosage}</p>
                                  </div>
                                  <span className="text-xs text-green-400">{med.for}</span>
                                </div>
                                {med.note && (
                                  <p className="text-xs text-yellow-400 mt-2">{med.note}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Foods */}
                    {result.recommendations?.foods?.length > 0 && (
                      <div className="mb-6">
                        <button
                          onClick={() => toggleSection('foods')}
                          className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10"
                        >
                          <div className="flex items-center gap-3">
                            <Utensils className="w-5 h-5 text-yellow-400" />
                            <h3 className="text-lg font-semibold text-white">Dietary Recommendations</h3>
                          </div>
                          {expandedSection === 'foods' ? <ChevronUp /> : <ChevronDown />}
                        </button>
                        
                        {expandedSection === 'foods' && (
                          <div className="mt-4">
                            <div className="mb-3">
                              <h4 className="text-white font-medium mb-2">✓ Foods to Eat</h4>
                              <div className="flex flex-wrap gap-2">
                                {result.recommendations.foods.map((food: string, i: number) => (
                                  <span key={i} className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
                                    {food}
                                  </span>
                                ))}
                              </div>
                            </div>
                            {result.recommendations.avoid?.length > 0 && (
                              <div>
                                <h4 className="text-white font-medium mb-2">✗ Foods to Avoid</h4>
                                <div className="flex flex-wrap gap-2">
                                  {result.recommendations.avoid.map((food: string, i: number) => (
                                    <span key={i} className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm">
                                      {food}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Home Care */}
                    {result.recommendations?.homeCare?.length > 0 && (
                      <div className="mb-6">
                        <button
                          onClick={() => toggleSection('homecare')}
                          className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10"
                        >
                          <div className="flex items-center gap-3">
                            <Heart className="w-5 h-5 text-pink-400" />
                            <h3 className="text-lg font-semibold text-white">Home Care Tips</h3>
                          </div>
                          {expandedSection === 'homecare' ? <ChevronUp /> : <ChevronDown />}
                        </button>
                        
                        {expandedSection === 'homecare' && (
                          <ul className="mt-4 space-y-2">
                            {result.recommendations.homeCare.map((tip: string, i: number) => (
                              <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                    {/* When to See Doctor */}
                    {result.recommendations?.whenToSeeDoctor?.length > 0 && (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                        <h4 className="text-red-400 font-medium mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          When to See a Doctor
                        </h4>
                        <ul className="space-y-1">
                          {result.recommendations.whenToSeeDoctor.map((sign: string, i: number) => (
                            <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                              {sign}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Disclaimer */}
                    <div className="mt-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                      <p className="text-xs text-yellow-400">
                        ⚠️ {result.disclaimer || "This is an AI-powered preliminary assessment. Always consult a qualified healthcare provider."}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Selected Symptoms */}
              {selectedSymptoms.length > 0 && (
                <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20">
                  <h3 className="text-lg font-bold text-white mb-4">Selected Symptoms</h3>
                  <div className="space-y-2">
                    {selectedSymptoms.map((symptom, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                        <span className="text-white text-sm">{symptom}</span>
                        <button
                          onClick={() => toggleSymptom(symptom)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Emergency Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  Emergency
                </h3>
                <p className="text-gray-300 text-sm mb-4">Call emergency services immediately if you experience:</p>
                <ul className="space-y-2 text-sm">
                  {["Chest pain or pressure", "Difficulty breathing", "Sudden confusion", "Severe bleeding", "Loss of consciousness"].map((sign, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5" />
                      {sign}
                    </li>
                  ))}
                </ul>
                <button className="w-full mt-4 py-3 rounded-xl bg-red-500/20 text-red-400 font-medium hover:bg-red-500/30">
                  Call Emergency: 102
                </button>
              </div>

              {/* Disclaimer */}
              <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-xs text-yellow-400">
                  ⚠️ This is an AI-powered preliminary assessment. It is not a substitute for professional medical advice, diagnosis, or treatment.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}