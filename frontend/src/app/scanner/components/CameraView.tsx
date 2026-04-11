"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, X, RefreshCw, Zap } from "lucide-react";

interface CameraViewProps {
  onCapture: () => void;
  onClose: () => void;
  onSwitchCamera: () => void;
  onToggleFlashlight: () => void;
  flashlight: boolean;
  error: string | null;
}

export default function CameraView({
  onCapture,
  onClose,
  onSwitchCamera,
  onToggleFlashlight,
  flashlight,
  error
}: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Get camera stream
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error("Camera error:", err);
      });

    return () => {
      // Cleanup
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="space-y-4"
    >
      <div className="relative rounded-2xl overflow-hidden bg-black aspect-video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        
        {/* Camera controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-3">
          <button
            onClick={onSwitchCamera}
            className="p-3 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          
          <button
            onClick={onCapture}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"
          >
            <div className="w-14 h-14 rounded-full bg-white" />
          </button>
          
          <button
            onClick={onToggleFlashlight}
            className={`p-3 rounded-full backdrop-blur-sm ${
              flashlight ? 'bg-yellow-500 text-white' : 'bg-black/50 text-white hover:bg-black/70'
            }`}
          >
            <Zap className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-red-500/80 text-white hover:bg-red-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-center">
          {error}
        </div>
      )}
    </motion.div>
  );
}