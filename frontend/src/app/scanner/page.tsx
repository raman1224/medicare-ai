"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import ProtectedRoute from "@/components/auth/protected-route";
import DashboardNav from "@/components/dashboard/nav";
import { Camera, Upload, Search, Pill, AlertCircle, DollarSign, Clock, X } from "lucide-react";
import Image from "next/image";

export default function ScannerPage() {
  const [image, setImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.match('image.*')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      // Simulate scanning
      setScanning(true);
      setTimeout(() => {
        setScanning(false);
        setResult({
          name: "Paracetamol 500mg",
          generic: "Acetaminophen",
          uses: "Pain relief, fever reduction",
          sideEffects: ["Nausea", "Liver damage (overdose)"],
          dosage: "1 tablet every 4-6 hours",
          price: "NPR 50-80",
          alternatives: ["Ibuprofen", "Aspirin"],
          warning: "Do not exceed 4g per day"
        });
      }, 2000);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setImage(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const medicines = [
    { name: "Paracetamol", price: "NPR 50-80", uses: "Pain, Fever" },
    { name: "Amoxicillin", price: "NPR 120-180", uses: "Antibiotic" },
    { name: "Cetirizine", price: "NPR 40-60", uses: "Allergies" },
    { name: "Omeprazole", price: "NPR 90-120", uses: "Acidity" },
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
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">AI Medicine Scanner</h1>
                <p className="text-gray-400">Upload medicine photos for instant identification</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Scanner Section */}
            <div className="lg:col-span-2">
              <div className="p-8 rounded-3xl glass-card mb-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Upload Medicine Photo</h2>
                  <p className="text-gray-400">Take a clear photo of medicine packaging or tablet</p>
                </div>

                {/* Upload Area */}
                <div className="mb-8">
                  <div
                    className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-blue-500 bg-blue-500/10'
                        : image
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-white/20 hover:border-primary/50 hover:bg-white/5'
                    }`}
                    onClick={handleClickUpload}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {image ? (
                      <div className="relative">
                        <Image 
                          src={image} 
                          alt="Medicine" 
                          className="max-h-64 mx-auto rounded-lg object-contain" 
                          width={300}
                          height={300}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage();
                          }}
                          className="absolute top-2 right-2 p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className={`w-16 h-16 mx-auto mb-4 transition-colors ${
                          isDragging ? 'text-blue-400' : 'text-gray-400'
                        }`} />
                        <div className="text-white font-medium mb-2">
                          {isDragging ? 'Drop image here' : 'Drag & drop or click to upload'}
                        </div>
                        <p className="text-gray-400 text-sm">Supports JPG, PNG up to 10MB</p>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Camera Button */}
                <button className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                  <Camera className="w-5 h-5" />
                  Open Camera
                </button>
              </div>

              {/* Results */}
              {scanning ? (
                <div className="p-8 rounded-3xl glass-card text-center">
                  <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                  <h3 className="text-xl font-bold text-white mb-2">Scanning Medicine...</h3>
                  <p className="text-gray-400">Analyzing image with AI</p>
                </div>
              ) : result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 rounded-3xl glass-card"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{result.name}</h3>
                      <p className="text-gray-400">Generic: {result.generic}</p>
                    </div>
                    <div className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium">
                      Identified ✓
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-white/5">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-yellow-400" />
                          <h4 className="font-semibold text-white">Uses</h4>
                        </div>
                        <p className="text-gray-300">{result.uses}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-5 h-5 text-blue-400" />
                          <h4 className="font-semibold text-white">Dosage</h4>
                        </div>
                        <p className="text-gray-300">{result.dosage}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-white/5">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-green-400" />
                          <h4 className="font-semibold text-white">Price in Nepal</h4>
                        </div>
                        <p className="text-2xl font-bold text-white">{result.price}</p>
                        <p className="text-gray-400 text-sm">Approximate retail price</p>
                      </div>
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-red-400" />
                          <h4 className="font-semibold text-white">Warning</h4>
                        </div>
                        <p className="text-gray-300">{result.warning}</p>
                      </div>
                    </div>
                  </div>

                  {/* Side Effects */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-white mb-3">Possible Side Effects</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.sideEffects.map((effect: string, i: number) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-sm">
                          {effect}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Alternatives */}
                  <div>
                    <h4 className="font-semibold text-white mb-3">Alternative Medicines</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.alternatives.map((alt: string, i: number) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm">
                          {alt}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Popular Medicines */}
              <div className="p-6 rounded-2xl glass-card">
                <h3 className="text-xl font-bold text-white mb-4">Popular Medicines</h3>
                <div className="space-y-3">
                  {medicines.map((med, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Pill className="w-5 h-5 text-primary" />
                          <span className="font-medium text-white">{med.name}</span>
                        </div>
                        <span className="text-green-400 font-medium">{med.price}</span>
                      </div>
                      <p className="text-gray-400 text-sm">{med.uses}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
                <h3 className="text-xl font-bold text-white mb-4">📸 Scanning Tips</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                    <span>Ensure good lighting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                    <span>Focus on text/logo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                    <span>Include entire packaging</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                    <span>Check expiry date</span>
                  </li>
                </ul>
              </div>

              {/* Search */}
              <div className="p-6 rounded-2xl glass-card">
                <h3 className="text-xl font-bold text-white mb-4">Search Medicine</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter medicine name..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <button className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium">
                  Search Database
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

// "use client";

// import { useState, useRef, useEffect, useCallback, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Image from "next/image";
// import ProtectedRoute from "@/components/auth/protected-route";
// import DashboardNav from "@/components/dashboard/nav";
// import { useScanner } from "./hooks/useScanner";
// import CameraView from "./components/CameraView";
// import ResultCard from "./components/ResultCard";
// import { 
//   Upload, Camera, Search, Pill, TrendingUp, Clock, 
//   Sparkles, Loader2, X, AlertCircle 
// } from "lucide-react";

// // Fixed animation variants - no TypeScript errors
// const fadeInUp = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { 
//     opacity: 1, 
//     y: 0,
//     transition: { duration: 0.5 }
//   }
// };

// export default function ScannerPage() {
//   // ✅ ALL HOOKS MUST BE AT THE TOP - BEFORE ANY CONDITIONS
//   const [mounted, setMounted] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
  
//   const {
//     image,
//     scanning,
//     result,
//     scanProgress,
//     scanStage,
//     scanHistory,
//     popularMedicines,
//     isDragging,
//     handleFile,
//     handleScan,
//     handleRemoveImage,
//     handleDragOver,
//     handleDragLeave,
//     handleDrop,
//     startCamera,
//     stopCamera,
//     cameraActive,
//     capturedImage,
//     cameraError,
//     switchCamera,
//     flashlight,
//     toggleFlashlight,
//     handleCapture,
//     searchQuery,
//     setSearchQuery,
//     handleSearch,
//     isSearching,
//     searchResults,
//     showSearchResults
//   } = useScanner();

//   // ✅ useMemo is a hook - must be at top level
//   const displayImage = useMemo(() => image || capturedImage, [image, capturedImage]);

//   // Handle mounting for client-side only
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // Event handlers (these are not hooks, so they can be after conditions)
//   const handleClickUpload = useCallback(() => {
//     fileInputRef.current?.click();
//   }, []);

//   const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) handleFile(file);
//   }, [handleFile]);

//   // Don't render anything until mounted (prevents window errors)
//   if (!mounted) {
//     return (
//       <ProtectedRoute>
//         <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//           <DashboardNav />
//           <div className="flex items-center justify-center h-[80vh]">
//             <Loader2 className="w-8 h-8 text-white animate-spin" />
//           </div>
//         </div>
//       </ProtectedRoute>
//     );
//   }

//   return (
//     <ProtectedRoute>
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//         {/* Fixed Background (no window usage) */}
//         <div className="fixed inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,80,200,0.15),transparent_50%)]" />
//           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(80,120,200,0.1),transparent_50%)]" />
//         </div>

//         <DashboardNav />
        
//         <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
//           {/* Header */}
//           <motion.div
//             initial={fadeInUp.hidden}
//             animate={fadeInUp.visible}
//             className="mb-8"
//           >
//             <div className="flex items-center gap-4">
//               <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
//                 <Camera className="w-7 h-7 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-4xl font-bold text-white flex items-center gap-2">
//                   AI Medicine Scanner
//                   <Sparkles className="w-8 h-8 text-yellow-400" />
//                 </h1>
//                 <p className="text-gray-300">
//                   Upload medicine photos for instant AI identification
//                 </p>
//               </div>
//             </div>
//           </motion.div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Main Scanner Column */}
//             <div className="lg:col-span-2 space-y-6">
//               {/* Scanner Card */}
//               <motion.div
//                 initial={fadeInUp.hidden}
//                 animate={fadeInUp.visible}
//                 className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-8"
//               >
//                 {!cameraActive && !displayImage ? (
//                   <>
//                     {/* Upload Area */}
//                     <div
//                       className={`relative border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
//                         isDragging
//                           ? 'border-blue-500 bg-blue-500/20'
//                           : 'border-white/30 hover:border-purple-500/50 hover:bg-white/10'
//                       }`}
//                       onClick={handleClickUpload}
//                       onDragOver={handleDragOver}
//                       onDragLeave={handleDragLeave}
//                       onDrop={handleDrop}
//                     >
//                       <Upload className="w-20 h-20 mx-auto mb-4 text-gray-400" />
//                       <h3 className="text-xl font-semibold text-white mb-2">
//                         {isDragging ? 'Drop to upload' : 'Drag & drop or click to upload'}
//                       </h3>
//                       <p className="text-gray-400">
//                         Supports JPG, PNG up to 10MB
//                       </p>
//                     </div>

//                     {/* Camera Button */}
//                     <button
//                       onClick={startCamera}
//                       className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
//                     >
//                       <Camera className="w-5 h-5" />
//                       Open Camera
//                     </button>
//                   </>
//                 ) : cameraActive ? (
//                   <CameraView
//                     onCapture={handleCapture}
//                     onClose={stopCamera}
//                     onSwitchCamera={switchCamera}
//                     onToggleFlashlight={toggleFlashlight}
//                     flashlight={flashlight}
//                     error={cameraError}
//                   />
//                 ) : (
//                   <div className="space-y-4">
//                     {/* Image Preview */}
//                     <div className="relative rounded-2xl overflow-hidden bg-black/30">
//                       <div className="relative aspect-video">
//                         <Image
//                           src={displayImage!}
//                           alt="Preview"
//                           fill
//                           className="object-contain"
//                           sizes="(max-width: 768px) 100vw, 50vw"
//                           priority
//                         />
//                         <button
//                           onClick={handleRemoveImage}
//                           className="absolute top-4 right-4 p-2 rounded-full bg-red-500/80 text-white hover:bg-red-600"
//                         >
//                           <X className="w-5 h-5" />
//                         </button>
//                       </div>
//                     </div>

//                     {/* Scan Button */}
//                     <button
//                       onClick={handleScan}
//                       disabled={scanning}
//                       className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold disabled:opacity-50"
//                     >
//                       {scanning ? (
//                         <span className="flex items-center justify-center gap-2">
//                           <Loader2 className="w-5 h-5 animate-spin" />
//                           Scanning... {scanProgress}%
//                         </span>
//                       ) : (
//                         <span className="flex items-center justify-center gap-2">
//                           <Camera className="w-5 h-5" />
//                           Scan Medicine
//                         </span>
//                       )}
//                     </button>

//                     {/* Progress Bar */}
//                     {scanning && (
//                       <div className="space-y-2">
//                         <div className="flex justify-between text-sm text-gray-300">
//                           <span>{scanStage}</span>
//                           <span>{scanProgress}%</span>
//                         </div>
//                         <div className="h-2 bg-white/10 rounded-full overflow-hidden">
//                           <motion.div
//                             className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
//                             initial={{ width: "0%" }}
//                             animate={{ width: `${scanProgress}%` }}
//                             transition={{ duration: 0.5 }}
//                           />
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                   className="hidden"
//                 />
//               </motion.div>

//               {/* Results */}
//               <AnimatePresence mode="wait">
//                 {result && !scanning && (
//                   <ResultCard result={result} onClose={handleRemoveImage} />
//                 )}
//               </AnimatePresence>
//             </div>

//             {/* Sidebar */}
//             <div className="space-y-6">
//               {/* Quick Stats */}
//               <motion.div
//                 initial={fadeInUp.hidden}
//                 animate={fadeInUp.visible}
//                 className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20"
//               >
//                 <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
//                   <TrendingUp className="w-5 h-5 text-blue-400" />
//                   Quick Stats
//                 </h3>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="text-center">
//                     <div className="text-3xl font-bold text-white">2.5k+</div>
//                     <div className="text-sm text-gray-400">Medicines</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-3xl font-bold text-white">98%</div>
//                     <div className="text-sm text-gray-400">Accuracy</div>
//                   </div>
//                 </div>
//               </motion.div>

//               {/* Popular Medicines */}
//               <motion.div
//                 initial={fadeInUp.hidden}
//                 animate={fadeInUp.visible}
//                 className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20"
//               >
//                 <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
//                   <Pill className="w-5 h-5 text-green-400" />
//                   Popular Medicines
//                 </h3>
//                 <div className="space-y-3">
//                   {popularMedicines.map((med, i) => (
//                     <div
//                       key={i}
//                       className="p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-all"
//                     >
//                       <div className="flex justify-between items-center">
//                         <div>
//                           <h4 className="font-semibold text-white">{med.name}</h4>
//                           <p className="text-sm text-gray-400">{med.genericName}</p>
//                         </div>
//                         <span className="text-green-400 text-sm">
//                           NPR {med.price.min}-{med.price.max}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </motion.div>

//               {/* Recent Scans */}
//               <motion.div
//                 initial={fadeInUp.hidden}
//                 animate={fadeInUp.visible}
//                 className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20"
//               >
//                 <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
//                   <Clock className="w-5 h-5 text-purple-400" />
//                   Recent Scans
//                 </h3>
//                 {scanHistory.length > 0 ? (
//                   <div className="space-y-3">
//                     {scanHistory.slice(0, 3).map((scan, i) => (
//                       <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-white/5">
//                         <div className="w-10 h-10 rounded-lg bg-black/30 relative overflow-hidden">
//                           <Image
//                             src={scan.imageUrl}
//                             alt={scan.medicineName}
//                             fill
//                             className="object-cover"
//                             sizes="40px"
//                           />
//                         </div>
//                         <div className="flex-1">
//                           <h4 className="font-semibold text-white text-sm">{scan.medicineName}</h4>
//                           <p className="text-xs text-gray-400">{scan.timestamp}</p>
//                         </div>
//                         <span className="text-xs text-green-400">{scan.confidence}%</span>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-gray-400 text-center py-4">No scans yet</p>
//                 )}
//               </motion.div>

//               {/* Search */}
//               <motion.div
//                 initial={fadeInUp.hidden}
//                 animate={fadeInUp.visible}
//                 className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20"
//               >
//                 <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
//                   <Search className="w-5 h-5 text-blue-400" />
//                   Search Medicine
//                 </h3>
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Enter medicine name..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//                     className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
//                   />
//                 </div>
//                 <button
//                   onClick={handleSearch}
//                   disabled={isSearching}
//                   className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium disabled:opacity-50"
//                 >
//                   {isSearching ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                       Searching...
//                     </span>
//                   ) : (
//                     'Search Database'
//                   )}
//                 </button>

//                 {/* Search Results */}
//                 <AnimatePresence>
//                   {showSearchResults && searchResults.length > 0 && (
//                     <motion.div
//                       initial={{ opacity: 0, height: 0 }}
//                       animate={{ opacity: 1, height: 'auto' }}
//                       exit={{ opacity: 0, height: 0 }}
//                       className="mt-4 space-y-2"
//                     >
//                       {searchResults.map((result, i) => (
//                         <div key={i} className="p-3 rounded-xl bg-white/5">
//                           <div className="flex justify-between items-center">
//                             <div>
//                               <h4 className="font-semibold text-white">{result.name}</h4>
//                               <p className="text-sm text-gray-400">{result.genericName}</p>
//                             </div>
//                             <span className="text-green-400 text-sm">{result.price}</span>
//                           </div>
//                         </div>
//                       ))}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </motion.div>

//               {/* Tips */}
//               <motion.div
//                 initial={fadeInUp.hidden}
//                 animate={fadeInUp.visible}
//                 className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20"
//               >
//                 <h3 className="text-xl font-bold text-white mb-4">📸 Tips</h3>
//                 <ul className="space-y-2 text-gray-300">
//                   {[
//                     "Good lighting",
//                     "Focus on text",
//                     "Clear packaging",
//                     "Check expiry"
//                   ].map((tip, i) => (
//                     <li key={i} className="flex items-center gap-2">
//                       <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
//                       {tip}
//                     </li>
//                   ))}
//                 </ul>
//               </motion.div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </ProtectedRoute>
//   );
// }