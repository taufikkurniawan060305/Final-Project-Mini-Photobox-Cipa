import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw, AlertCircle, ArrowRight } from 'lucide-react';

export default function CaptureScreen({ onPhotosCaptured, onBack }) {
  const [stream, setStream] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [error, setError] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);
  const [flash, setFlash] = useState(false);

  const videoRef = useRef(null);
  const captureIntervalRef = useRef(null);
  const isFirstLoadRef = useRef(true);

  // Initialize camera and request permissions
  useEffect(() => {
    let activeStream = null;

    async function initCamera() {
      try {
        // Step 1: Request permission using standard video constraints to trigger dialog
        const initialStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        
        activeStream = initialStream;
        setStream(initialStream);
        if (videoRef.current) {
          videoRef.current.srcObject = initialStream;
        }

        // Step 2: Enumerate devices (will be fully populated since permission is granted)
        const devs = await navigator.mediaDevices.enumerateDevices();
        const videoDevs = devs.filter(d => d.kind === 'videoinput');
        setDevices(videoDevs);

        if (videoDevs.length > 0) {
          const frontCam = videoDevs.find(d => d.label.toLowerCase().includes('front') || d.label.toLowerCase().includes('user'));
          const defaultDevice = frontCam ? frontCam.deviceId : videoDevs[0].deviceId;
          
          // Match the active track to find if its device matches
          const activeTrack = initialStream.getVideoTracks()[0];
          const activeSettings = activeTrack ? activeTrack.getSettings() : {};
          
          setSelectedDeviceId(activeSettings.deviceId || defaultDevice);
        }
        setError(null);
      } catch (err) {
        console.error("Camera access error:", err);
        setError("Unable to access camera. Please make sure permissions are granted and no other application is using your webcam.");
      }
    }

    initCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Handle camera device switching
  useEffect(() => {
    if (!selectedDeviceId || !stream) return;
    
    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false;
      return;
    }

    // Stop current stream before requesting the new one
    stream.getTracks().forEach(track => track.stop());

    navigator.mediaDevices.getUserMedia({
      video: { 
        deviceId: { exact: selectedDeviceId },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    })
    .then(mediaStream => {
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    })
    .catch(err => {
      console.error("Error switching camera device:", err);
    });
  }, [selectedDeviceId]);

  // Handle switching camera device
  const handleDeviceChange = (e) => {
    setSelectedDeviceId(e.target.value);
  };

  // Start the automated 4-photo capture session
  const startCaptureSession = () => {
    if (isCapturing) return;
    setIsCapturing(true);
    setPhotos([]);
    capturePhotosSequence();
  };

  const capturePhotosSequence = async () => {
    const captured = [];
    
    for (let i = 0; i < 4; i++) {
      setActivePhotoIndex(i);
      
      // 3-second countdown for each photo
      for (let count = 3; count > 0; count--) {
        setCountdown(count);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Trigger Flash & Photo Capture
      setCountdown('FLASH!');
      setFlash(true);
      captureSinglePhoto(captured);
      
      // Keep flash active briefly
      await new Promise(resolve => setTimeout(resolve, 150));
      setFlash(false);
      setCountdown(null);

      // Wait 2 seconds between photos so the user can pose for the next one
      if (i < 3) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    setIsCapturing(false);
    setActivePhotoIndex(null);
    
    // Automatically transition to editor screen with the 4 captured photos
    setTimeout(() => {
      onPhotosCaptured(captured);
    }, 800);
  };

  // Capture a single frame from the video stream
  const captureSinglePhoto = (capturedList) => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    
    // Use high resolution for clean prints
    // 4:3 aspect ratio crop from center of video stream
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    
    // Calculate 4:3 box dimensions
    let cropWidth, cropHeight;
    if (videoWidth / videoHeight > 4 / 3) {
      cropHeight = videoHeight;
      cropWidth = videoHeight * (4 / 3);
    } else {
      cropWidth = videoWidth;
      cropHeight = videoWidth * (3 / 4);
    }
    
    const startX = (videoWidth - cropWidth) / 2;
    const startY = (videoHeight - cropHeight) / 2;

    canvas.width = 1200; // high-res
    canvas.height = 900;
    
    const ctx = canvas.getContext('2d');
    
    // Mirror the captured image to match screen preview
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    
    ctx.drawImage(
      video,
      startX, startY, cropWidth, cropHeight, // source video
      0, 0, canvas.width, canvas.height       // destination canvas
    );
    
    const dataUrl = canvas.toDataURL('image/png');
    capturedList.push(dataUrl);
    setPhotos([...capturedList]);
  };

  // Clean up streams on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-6 flex flex-col items-center">
      {/* Top navigation/bar */}
      <div className="w-full flex justify-between items-center mb-8">
        <button
          onClick={onBack}
          disabled={isCapturing}
          className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 text-sm disabled:opacity-50"
        >
          &larr; Back / Kembali
        </button>

        {/* Camera Selector */}
        {devices.length > 1 && (
          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-full px-4 py-1.5 text-xs text-gray-300">
            <RefreshCw className="w-3.5 h-3.5" />
            <select
              value={selectedDeviceId}
              onChange={handleDeviceChange}
              disabled={isCapturing}
              className="bg-transparent border-none text-white focus:outline-none cursor-pointer pr-4"
            >
              {devices.map(device => (
                <option key={device.deviceId} value={device.deviceId} className="bg-[#1A1A1A] text-white">
                  {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Main Preview (3 cols on large, 1 on mobile) */}
        <div className="lg:col-span-3 flex flex-col items-center">
          <div className="relative w-full max-w-2xl aspect-[4/3] rounded-3xl overflow-hidden glass border border-white/10 shadow-2xl bg-black">
            
            {/* Webcam video component */}
            {stream && !error && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            )}

            {/* Placeholder / Loading */}
            {!stream && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 gap-3">
                <div className="w-8 h-8 border-2 border-amber-300/40 border-t-amber-300 rounded-full animate-spin" />
                <span className="text-sm font-light tracking-wide">Starting Camera...</span>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-[#18181B] text-gray-400 gap-4">
                <AlertCircle className="w-12 h-12 text-red-400/80" />
                <p className="max-w-md text-sm font-light leading-relaxed">{error}</p>
                <button
                  onClick={() => setSelectedDeviceId(selectedDeviceId)}
                  className="px-6 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 text-white text-xs tracking-wider uppercase transition-all"
                >
                  Retry Connection
                </button>
              </div>
            )}

            {/* Countdown Overlay */}
            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] transition-all">
                <div className="text-center animate-pulse">
                  <span className={`font-serif text-8xl md:text-9xl font-bold tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] ${countdown === 'FLASH!' ? 'text-amber-100 scale-110' : ''}`}>
                    {countdown}
                  </span>
                </div>
              </div>
            )}

            {/* Screen Flash Animation */}
            {flash && (
              <div className="absolute inset-0 bg-white animate-flash z-50 pointer-events-none" />
            )}

            {/* Progress overlay / Capture counter */}
            {isCapturing && (
              <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-black/60 border border-white/10 text-xs font-medium text-white tracking-widest uppercase">
                Photo {photos.length + 1} / 4
              </div>
            )}
          </div>

          {/* Capture Trigger */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              onClick={startCaptureSession}
              disabled={isCapturing || !stream}
              className={`px-12 py-5 rounded-full font-medium tracking-wider text-sm flex items-center gap-3 shadow-xl transition-all duration-300 select-none ${
                isCapturing 
                  ? 'bg-amber-300/10 border border-amber-300/20 text-amber-300 cursor-not-allowed scale-95 shadow-none' 
                  : 'bg-[#E6DFD3] text-[#121212] hover:bg-white hover:scale-105 hover:shadow-white/5 active:scale-95 cursor-pointer'
              }`}
            >
              <Camera className={`w-5 h-5 ${isCapturing ? 'animate-bounce' : ''}`} />
              <span>
                {isCapturing 
                  ? `Taking Photos... (Foto ke-${photos.length + 1})` 
                  : 'Take 4 Photos / Mulai Ambil Foto'
                }
              </span>
            </button>
            <p className="text-xs text-gray-500 font-light mt-1 text-center">
              Takes 4 frames with a 3-second countdown each. Say cheese!
            </p>
          </div>
        </div>

        {/* Thumbnail Sidebar (1 col on large, horizontal list on mobile) */}
        <div className="lg:col-span-1 flex flex-col gap-4 w-full">
          <h3 className="text-xs font-semibold tracking-widest text-gray-400 uppercase hidden lg:block">
            Captured / Hasil Foto
          </h3>
          
          <div className="flex flex-row lg:flex-col gap-4 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 no-scrollbar justify-center">
            {[0, 1, 2, 3].map((index) => {
              const photo = photos[index];
              const isActive = activePhotoIndex === index;
              
              return (
                <div 
                  key={index}
                  className={`flex-shrink-0 w-24 h-18 lg:w-full lg:h-32 rounded-2xl overflow-hidden relative border transition-all duration-300 ${
                    isActive 
                      ? 'border-amber-300 ring-2 ring-amber-300/20 scale-102' 
                      : photo 
                        ? 'border-white/20' 
                        : 'border-white/5 bg-white/[0.02]'
                  }`}
                >
                  {photo ? (
                    <img 
                      src={photo} 
                      alt={`Capture ${index + 1}`} 
                      className="w-full h-full object-cover scale-x-[-1]" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs font-light tracking-wide">
                      {isActive && isCapturing ? (
                        <div className="w-4 h-4 border border-amber-300/40 border-t-amber-300 rounded-full animate-spin" />
                      ) : (
                        `Frame ${index + 1}`
                      )}
                    </div>
                  )}
                  {photo && (
                    <div className="absolute bottom-2 right-2 bg-black/60 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-gray-300 font-semibold border border-white/10">
                      {index + 1}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick jump if done but somehow stuck */}
          {photos.length === 4 && !isCapturing && (
            <button
              onClick={() => onPhotosCaptured(photos)}
              className="w-full mt-4 py-3 px-4 bg-white/5 hover:bg-white/10 text-white text-xs font-medium rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-all"
            >
              Continue to Editor <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
