// medicare-nepal/frontend/src/app/xray/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ProtectedRoute from "@/components/auth/protected-route";
import DashboardNav from "@/components/dashboard/nav";
import { Upload, Brain, FileText, Volume2, Download, Eye } from "lucide-react";
import Image from "next/image";

export default function XRayPage() {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        // Simulate analysis
        setAnalyzing(true);
        setTimeout(() => {
          setAnalyzing(false);
          setResult({
            diagnosis: "Normal Chest X-Ray",
            confidence: "94%",
            findings: [
              "Clear lung fields",
              "Normal heart size",
              "Intact bony structures",
              "No evidence of consolidation",
              "No pleural effusion"
            ],
            recommendations: [
              "No immediate action required",
              "Follow-up in 1 year if asymptomatic",
              "Maintain regular health checkups"
            ],
            notes: "AI analysis suggests normal findings. Always consult with a radiologist for final diagnosis."
          });
        }, 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const sampleImages = [
    { name: "Chest X-Ray", type: "Normal", icon: "🫁" },
    { name: "Knee X-Ray", type: "Fracture", icon: "🦵" },
    { name: "Spine X-Ray", type: "Scoliosis", icon: "🦴" },
    { name: "Dental X-Ray", type: "Cavity", icon: "🦷" },
  ];

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
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">X-Ray & Medical Image Analysis</h1>
                <p className="text-gray-400">AI-powered analysis of medical images with detailed explanations</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Section */}
            <div className="lg:col-span-2">
              {/* Upload Section */}
              <div className="p-8 rounded-3xl glass-card mb-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Upload Medical Image</h2>
                  <p className="text-gray-400">Supported: X-Ray, CT Scan, MRI, Ultrasound</p>
                </div>

                <div className="mb-8">
                  <label className="block">
                    <div className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                      image ? 'border-primary/50 bg-primary/5' : 'border-white/20 hover:border-primary/50 hover:bg-white/5'
                    }`}>
                      {image ? (
                        <div className="relative">
                          <div className="relative w-64 h-64 mx-auto overflow-hidden rounded-lg bg-gray-800">
                            <Image src={image} alt="X-Ray" width={256} height={256} className="object-contain" />
                          </div>
                          <button
                            onClick={() => {
                              setImage(null);
                              setResult(null);
                            }}
                            className="absolute top-2 right-2 p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <div className="text-white font-medium mb-2">Drag & drop X-Ray image</div>
                          <p className="text-gray-400 text-sm">Supports JPG, PNG, DICOM up to 25MB</p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <button
                  onClick={() => image && !analyzing && setAnalyzing(true)}
                  disabled={!image || analyzing}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {analyzing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing Image...
                    </div>
                  ) : (
                    "Analyze with AI"
                  )}
                </button>
              </div>

              {/* Results */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 rounded-3xl glass-card"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Analysis Results</h2>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400">Confidence:</span>
                        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-medium">
                          {result.confidence}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
                        <Volume2 className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <div className="mb-8">
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/20">
                      <div className="flex items-center gap-3 mb-3">
                        <FileText className="w-6 h-6 text-indigo-400" />
                        <h3 className="text-xl font-bold text-white">Diagnosis</h3>
                      </div>
                      <p className="text-white text-lg">{result.diagnosis}</p>
                    </div>
                  </div>

                  {/* Findings & Recommendations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Key Findings</h3>
                      <div className="space-y-3">
                        {result.findings.map((finding: string, i: number) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                            <span className="text-gray-300">{finding}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Recommendations</h3>
                      <div className="space-y-3">
                        {result.recommendations.map((rec: string, i: number) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                            <span className="text-gray-300">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mt-8 p-6 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                    <p className="text-gray-300">{result.notes}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium">
                      Save Report
                    </button>
                    <button className="py-3 rounded-xl glass-card text-white font-medium hover:bg-white/10">
                      Share with Doctor
                    </button>
                    <button className="py-3 rounded-xl glass-card text-white font-medium hover:bg-white/10">
                      Book Consultation
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Sample Images */}
              <div className="p-6 rounded-2xl glass-card">
                <h3 className="text-xl font-bold text-white mb-4">Sample Images</h3>
                <div className="space-y-3">
                  {sampleImages.map((sample, i) => (
                    <button
                      key={i}
                      className="w-full p-4 rounded-xl bg-white/5 text-left hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{sample.icon}</div>
                        <div>
                          <div className="text-white font-medium">{sample.name}</div>
                          <div className="text-sm text-gray-400">{sample.type}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Capabilities */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/20">
                <h3 className="text-xl font-bold text-white mb-4">AI Capabilities</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <Brain className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                    <span>Detects fractures & abnormalities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Eye className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                    <span>Identifies pneumonia patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                    <span>Generates detailed reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Volume2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                    <span>Voice explanation available</span>
                  </li>
                </ul>
              </div>

              {/* Quick Stats */}
              <div className="p-6 rounded-2xl glass-card">
                <h3 className="text-xl font-bold text-white mb-4">Analysis Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Total Analyses</span>
                    <span className="text-white font-bold">1,234</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Accuracy Rate</span>
                    <span className="text-white font-bold">94.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Avg. Processing Time</span>
                    <span className="text-white font-bold">3.2s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Reports Generated</span>
                    <span className="text-white font-bold">987</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}