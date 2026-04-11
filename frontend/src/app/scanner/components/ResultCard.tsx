"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  Activity, Clock, DollarSign, AlertTriangle, 
  Shield, Info, CheckCircle, X, AlertCircle,
  Pill, Thermometer, Droplet, Heart
} from "lucide-react";

interface MedicineResult {
  name: string;
  genericName: string;
  brand?: string;
  dosage?: string;
  form?: string;
  category?: string;
  uses?: string[];
  sideEffects?: string[];
  precautions?: string[];
  contraindications?: string[];
  dosageInstructions?: {
    adult?: string;
    pediatric?: string;
    geriatric?: string;
  };
  priceNepal?: {
    min: number;
    max: number;
    currency: string;
  };
  alternatives?: Array<{ name: string; genericName?: string }>;
  requiresPrescription?: boolean;
  pregnancyCategory?: string;
  lactationSafe?: boolean;
  verified?: boolean;
  expiryWarning?: number;
  storage?: string;
  confidence?: number;
  note?: string;
  message?: string;
  error?: string;
}

interface ResultCardProps {
  result: MedicineResult;
  onClose: () => void;
}

export default function ResultCard({ result, onClose }: ResultCardProps) {
  const [activeTab, setActiveTab] = useState<"info" | "details" | "safety">("info");

  // Check if result is error or empty
  if (!result) {
    return (
      <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-6">
        <div className="text-center text-red-400">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p>No data available</p>
        </div>
      </div>
    );
  }

  // Check if it's an error response
  if (result.message || result.error) {
    return (
      <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-6">
        <div className="text-center text-yellow-400">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Scan Failed</h3>
          <p>{result.message || result.error || "Please try again with a clearer image"}</p>
          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Default values for missing data
  const defaultDosage = {
    adult: "Consult your doctor for proper dosage",
    pediatric: "Consult your doctor for proper dosage",
    geriatric: "Consult your doctor for proper dosage"
  };

  const dosageInstructions = result.dosageInstructions || defaultDosage;
  const priceNepal = result.priceNepal || { min: 50, max: 200, currency: "NPR" };
  const uses = result.uses || ["Consult doctor for more information"];
  const sideEffects = result.sideEffects || ["Consult doctor for more information"];
  const precautions = result.precautions || ["Follow doctor's advice"];
  const contraindications = result.contraindications || ["Consult doctor before use"];
  const alternatives = result.alternatives || [];
  const storage = result.storage || "Store according to package instructions";
  const confidence = result.confidence || 75;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-6"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      {/* Verified badge */}
      {result.verified && (
        <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none">
          <div className="absolute transform rotate-45 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-1 right-[-35px] top-[20px] w-[170px] text-center text-sm">
            <CheckCircle className="w-4 h-4 inline mr-1" />
            Verified
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 pr-8">
        <h2 className="text-2xl font-bold text-white mb-1">
          {result.name || "Medicine Identified"}
        </h2>
        <p className="text-gray-300">
          Generic: {result.genericName || "Information not available"}
        </p>
        {result.brand && (
          <p className="text-sm text-gray-400">Brand: {result.brand}</p>
        )}
      </div>

      {/* Confidence Score */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
        <div className="flex justify-between items-center text-white mb-2">
          <span className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            AI Confidence Score
          </span>
          <span className="font-bold text-lg">{confidence}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          />
        </div>
        {result.note && (
          <p className="text-xs text-gray-400 mt-2">{result.note}</p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-white/10 pb-4">
        {[
          { id: "info", label: "Basic Info", icon: Info },
          { id: "details", label: "Details", icon: Activity },
          { id: "safety", label: "Safety", icon: Shield }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {activeTab === "info" && (
          <>
            {/* Uses */}
            <div>
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                Uses & Indications
              </h4>
              <div className="flex flex-wrap gap-2">
                {uses.slice(0, 5).map((use, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-sm border border-blue-500/30">
                    {use}
                  </span>
                ))}
              </div>
            </div>

            {/* Dosage */}
            <div>
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-400" />
                Dosage Instructions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="p-2 rounded-lg bg-white/5">
                  <span className="text-gray-400 text-xs">Adult</span>
                  <p className="text-white text-sm">{dosageInstructions.adult}</p>
                </div>
                <div className="p-2 rounded-lg bg-white/5">
                  <span className="text-gray-400 text-xs">Pediatric</span>
                  <p className="text-white text-sm">{dosageInstructions.pediatric}</p>
                </div>
                <div className="p-2 rounded-lg bg-white/5">
                  <span className="text-gray-400 text-xs">Geriatric</span>
                  <p className="text-white text-sm">{dosageInstructions.geriatric}</p>
                </div>
              </div>
            </div>

            {/* Price */}
            <div>
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-yellow-400" />
                Price in Nepal
              </h4>
              <div className="p-3 rounded-xl bg-yellow-500/20 border border-yellow-500/30">
                <p className="text-xl font-bold text-white">
                  NPR {priceNepal.min} - {priceNepal.max}
                </p>
                <p className="text-gray-400 text-xs mt-1">Retail price range (approx.)</p>
              </div>
            </div>
          </>
        )}

        {activeTab === "details" && (
          <>
            {/* Medicine Details */}
            <div className="grid grid-cols-2 gap-3">
              {result.form && (
                <div className="p-3 rounded-lg bg-white/5">
                  <span className="text-gray-400 text-xs">Form</span>
                  <p className="text-white font-medium text-sm">{result.form}</p>
                </div>
              )}
              {result.dosage && (
                <div className="p-3 rounded-lg bg-white/5">
                  <span className="text-gray-400 text-xs">Dosage</span>
                  <p className="text-white font-medium text-sm">{result.dosage}</p>
                </div>
              )}
              {result.category && (
                <div className="p-3 rounded-lg bg-white/5">
                  <span className="text-gray-400 text-xs">Category</span>
                  <p className="text-white font-medium text-sm">{result.category}</p>
                </div>
              )}
              {result.requiresPrescription !== undefined && (
                <div className="p-3 rounded-lg bg-white/5">
                  <span className="text-gray-400 text-xs">Prescription</span>
                  <p className={`font-medium text-sm ${result.requiresPrescription ? 'text-red-400' : 'text-green-400'}`}>
                    {result.requiresPrescription ? 'Required' : 'OTC (Over The Counter)'}
                  </p>
                </div>
              )}
            </div>

            {/* Storage */}
            <div>
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Pill className="w-4 h-4 text-purple-400" />
                Storage
              </h4>
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-gray-300 text-sm">{storage}</p>
                {result.expiryWarning && (
                  <p className="text-yellow-400 text-xs mt-1">
                    Expiry warning: {result.expiryWarning} days before expiry
                  </p>
                )}
              </div>
            </div>

            {/* Alternatives */}
            {alternatives.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-400" />
                  Alternative Medicines
                </h4>
                <div className="flex flex-wrap gap-2">
                  {alternatives.slice(0, 5).map((alt, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-sm">
                      {typeof alt === 'string' ? alt : alt.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "safety" && (
          <>
            {/* Side Effects */}
            <div>
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2 text-yellow-400">
                <AlertTriangle className="w-4 h-4" />
                Side Effects
              </h4>
              <div className="flex flex-wrap gap-2">
                {sideEffects.slice(0, 5).map((effect, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-yellow-500/20 text-yellow-300 text-sm">
                    {effect}
                  </span>
                ))}
              </div>
            </div>

            {/* Precautions */}
            <div>
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                Precautions
              </h4>
              <ul className="space-y-1">
                {precautions.slice(0, 5).map((pre, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                    <span>{pre}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contraindications */}
            <div>
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                Contraindications
              </h4>
              <div className="flex flex-wrap gap-2">
                {contraindications.slice(0, 5).map((contra, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-red-500/20 text-red-300 text-sm">
                    {contra}
                  </span>
                ))}
              </div>
            </div>

            {/* Pregnancy & Lactation */}
            {(result.pregnancyCategory || result.lactationSafe !== undefined) && (
              <div className="grid grid-cols-2 gap-3">
                {result.pregnancyCategory && (
                  <div className="p-3 rounded-lg bg-white/5">
                    <span className="text-gray-400 text-xs">Pregnancy Category</span>
                    <p className="text-white font-medium text-lg">{result.pregnancyCategory}</p>
                    <p className="text-gray-500 text-xs">
                      {result.pregnancyCategory === 'A' ? 'Safe' : 
                       result.pregnancyCategory === 'B' ? 'Probably safe' :
                       result.pregnancyCategory === 'C' ? 'Caution advised' :
                       result.pregnancyCategory === 'D' ? 'Not recommended' :
                       'Avoid if possible'}
                    </p>
                  </div>
                )}
                {result.lactationSafe !== undefined && (
                  <div className="p-3 rounded-lg bg-white/5">
                    <span className="text-gray-400 text-xs">Lactation Safety</span>
                    <p className={`font-medium text-lg ${result.lactationSafe ? 'text-green-400' : 'text-red-400'}`}>
                      {result.lactationSafe ? 'Safe' : 'Not Recommended'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-xs text-yellow-400 flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              This information is for reference only. Always consult a qualified healthcare 
              professional before taking any medication. The AI analysis is not a substitute 
              for professional medical advice.
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}