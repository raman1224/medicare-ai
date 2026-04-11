"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { api } from "@/lib/api";
import { MedicineResult, ScanHistory, PopularMedicine } from "../types/scanner.types";

export const useScanner = () => {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<MedicineResult | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStage, setScanStage] = useState("");
  const [scanHistory, setScanHistory] = useState<ScanHistory[]>([]);
  const [popularMedicines, setPopularMedicines] = useState<PopularMedicine[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [flashlight, setFlashlight] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cameraStream = useRef<MediaStream | null>(null);

  // Load initial data
  useEffect(() => {
    loadPopularMedicines();
    loadScanHistory();
  }, []);

  // Simulate scan progress
  useEffect(() => {
    if (scanning) {
      setScanProgress(0);
      setScanStage("Analyzing image...");
      
      const stages = [
        "Analyzing image...",
        "Detecting medicine...",
        "Reading label...",
        "Checking database...",
        "Generating results..."
      ];
      
      let stageIndex = 0;
      const interval = setInterval(() => {
        setScanProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          
          if (newProgress > 20 && stageIndex < 1) {
            setScanStage(stages[1]);
            stageIndex = 1;
          } else if (newProgress > 40 && stageIndex < 2) {
            setScanStage(stages[2]);
            stageIndex = 2;
          } else if (newProgress > 60 && stageIndex < 3) {
            setScanStage(stages[3]);
            stageIndex = 3;
          } else if (newProgress > 80 && stageIndex < 4) {
            setScanStage(stages[4]);
            stageIndex = 4;
          }
          
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 200);
      
      return () => clearInterval(interval);
    }
  }, [scanning]);

  const loadPopularMedicines = async () => {
    try {
      // Mock data
      setPopularMedicines([
        { name: "Paracetamol", genericName: "Acetaminophen", price: { min: 50, max: 80 } },
        { name: "Amoxicillin", genericName: "Amoxicillin", price: { min: 120, max: 180 } },
        { name: "Cetirizine", genericName: "Cetirizine HCl", price: { min: 40, max: 60 } },
        { name: "Omeprazole", genericName: "Omeprazole", price: { min: 90, max: 120 } }
      ]);
    } catch (error) {
      console.error("Error loading popular medicines:", error);
    }
  };

  const loadScanHistory = async () => {
    try {
      // Mock data
      setScanHistory([
        {
          id: "1",
          imageUrl: "/images/med1.jpg",
          medicineName: "Paracetamol 500mg",
          timestamp: "2 days ago",
          confidence: 98
        },
        {
          id: "2",
          imageUrl: "/images/med2.jpg",
          medicineName: "Amoxicillin 250mg",
          timestamp: "5 days ago",
          confidence: 95
        }
      ]);
    } catch (error) {
      console.error("Error loading scan history:", error);
    }
  };

  const handleFile = useCallback((file: File) => {
    if (!file.type.match('image.*')) {
      alert('Please upload an image file');
      return;
    }

    setImageFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setCapturedImage(null);
      stopCamera();
    };
    reader.readAsDataURL(file);
  }, []);

  const handleScan = useCallback(async () => {
    if (!image && !capturedImage) return;
    
    setScanning(true);
    setResult(null);
        setError(null);

//     try {
//       // Mock API call
//       await new Promise(resolve => setTimeout(resolve, 3000));
      
//       const mockResult: MedicineResult = {
//         name: "Paracetamol 500mg",
//         genericName: "Acetaminophen",
//         brand: "Calpol",
//         dosage: "500mg",
//         form: "Tablet",
//         category: "Analgesic",
//         uses: ["Pain relief", "Fever reduction", "Headache"],
//         sideEffects: ["Nausea", "Liver damage (overdose)"],
//         precautions: ["Do not exceed 4g per day", "Avoid alcohol"],
//         contraindications: ["Severe liver disease"],
//         dosageInstructions: {
//           adult: "1-2 tablets every 4-6 hours",
//           pediatric: "Based on weight",
//           geriatric: "Same as adult"
//         },
//         priceNepal: { min: 50, max: 80, currency: "NPR" },
//         alternatives: [
//           { name: "Ibuprofen", genericName: "Ibuprofen" },
//           { name: "Aspirin", genericName: "Acetylsalicylic acid" }
//         ],
//         requiresPrescription: false,
//         pregnancyCategory: "B",
//         lactationSafe: true,
//         verified: true,
//         expiryWarning: 30,
//         storage: "Store at room temperature",
//         confidence: 97
//       };
      
//       setResult(mockResult);
//       setScanning(false);
      
//       // Add to history
//       setScanHistory(prev => [{
//         id: Date.now().toString(),
//         imageUrl: image || capturedImage || "",
//         medicineName: mockResult.name,
//         timestamp: "Just now",
//         confidence: mockResult.confidence
//       }, ...prev.slice(0, 4)]);
      
//     } catch (error) {
//       console.error("Error scanning:", error);
//       setScanning(false);
//     }
//   }, [image, capturedImage]);
  try {
      // Create form data
      const formData = new FormData();
      
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (capturedImage) {
        // Convert base64 to blob
        const response = await fetch(capturedImage);
        const blob = await response.blob();
        const file = new File([blob], 'captured.jpg', { type: 'image/jpeg' });
        formData.append('image', file);
      }

      // Send to backend for AI analysis
      const response = await fetch('http://localhost:5000/api/v1/analysis/medicine', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('medicare_token')}`,
        },
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data.data);
        
        // Add to history
        const newScan = {
          id: Date.now().toString(),
          imageUrl: image || capturedImage || "",
          medicineName: data.data.name,
          timestamp: "Just now",
          confidence: data.data.confidence
        };
        
        setScanHistory(prev => [newScan, ...prev.slice(0, 4)]);
      } else {
        setError(data.message || 'Failed to analyze image');
      }
      
    } catch (error: any) {
      console.error("Scan error:", error);
      setError(error.message || 'Network error. Please try again.');
    } finally {
      setScanning(false);
    }
  }, [image, imageFile, capturedImage]);

  const handleRemoveImage = useCallback(() => {
    setImage(null);
    setImageFile(null);
    setResult(null);
    setCapturedImage(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }
      });
      
      cameraStream.current = stream;
      setCameraActive(true);
    } catch (err) {
      setCameraError("Unable to access camera");
      console.error("Camera error:", err);
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (cameraStream.current) {
      cameraStream.current.getTracks().forEach(track => track.stop());
      cameraStream.current = null;
    }
    setCameraActive(false);
  }, []);

  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
    stopCamera();
    setTimeout(startCamera, 100);
  }, [startCamera, stopCamera]);

  const toggleFlashlight = useCallback(() => {
    setFlashlight(prev => !prev);
  }, []);

  const handleCapture = useCallback(() => {
    if (!cameraStream.current) return;
    
    const video = document.querySelector('video');
    const canvas = document.createElement('canvas');
    
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
      stopCamera();
    }
  }, [stopCamera]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setShowSearchResults(true);
    
    try {
      // Mock search
      await new Promise(resolve => setTimeout(resolve, 500));
      setSearchResults([
        {
          name: "Paracetamol",
          genericName: "Acetaminophen",
          price: "NPR 50-80"
        },
        {
          name: "Paracetamol Syrup",
          genericName: "Acetaminophen",
          price: "NPR 80-120"
        }
      ]);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  return {
    image,
    imageFile,
    scanning,
    result,
    error,
    scanProgress,
    scanStage,
    scanHistory,
    popularMedicines,
    isDragging,
    cameraActive,
    capturedImage,
    cameraError,
    flashlight,
    searchQuery,
    isSearching,
    searchResults,
    showSearchResults,
    handleFile,
    handleScan,
    handleRemoveImage,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    startCamera,
    stopCamera,
    switchCamera,
    toggleFlashlight,
    handleCapture,
    setSearchQuery,
    handleSearch
  };
};