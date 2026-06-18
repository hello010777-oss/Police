import React, { useState, useRef, useEffect } from "react";
import { 
  Camera, 
  Download, 
  RotateCcw, 
  Smile, 
  ShieldAlert, 
  Sparkles, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Upload, 
  Plus, 
  Minus, 
  RotateCw, 
  Check, 
  ChevronRight, 
  RefreshCw, 
  Home, 
  PartyPopper,
  Info 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { 
  UNIFORM_TEMPLATES, 
  POLICE_STICKERS, 
  DEPARTMENT_OPTIONS, 
  COMPLIMENT_OPTIONS,
  UniformTemplate,
  AccessorySticker
} from "./data";

import { ActiveSticker, KidLicenseInfo, ApplicationMode } from "./types";
import { sfx } from "./utils/audio";
import { PoliceUniform } from "./components/PoliceUniform";

const renderStickerIcon = (stickerId: string, emoji: string) => {
  if (stickerId === "hat_blue") {
    return (
      <svg className="w-16 h-12 filter drop-shadow-md select-none inline-block pointer-events-none" viewBox="0 0 100 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 45 C 20 54, 80 54, 88 45 C 92 42, 8 42, 12 45 Z" fill="#0f172a" />
        <path d="M20 42 C 20 42, 50 45, 80 42 L 78 30 C 78 30, 50 33, 22 30 Z" fill="#1e3a8a" />
        <path d="M22 30 C 15 15, 85 15, 78 30 C 50 25, 50 25, 22 30 Z" fill="#3b82f6" />
        <path d="M20 42 Q 50 44, 80 42" stroke="#fbbf24" strokeWidth="2.5" />
        <circle cx="50" cy="36" r="6" fill="#fbbf24" stroke="#d97706" />
        <polygon points="50,32 52,35 55,35 53,37 54,40 50,38 46,40 47,37 45,35 48,35" fill="#ef4444" />
      </svg>
    );
  }
  if (stickerId === "hat_yellow") {
    return (
      <svg className="w-16 h-12 filter drop-shadow-md select-none inline-block pointer-events-none" viewBox="0 0 100 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 45 C 20 54, 80 54, 88 45 C 92 42, 8 42, 12 45 Z" fill="#0f172a" />
        <path d="M20 42 C 20 42, 50 45, 80 42 L 78 30 C 78 30, 50 33, 22 30 Z" fill="#eab308" />
        <path d="M20 36 L 80 36" stroke="#475569" strokeWidth="3" strokeDasharray="3 3" />
        <path d="M22 30 C 15 15, 85 15, 78 30 C 50 25, 50 25, 22 30 Z" fill="#fef08a" />
        <circle cx="50" cy="27" r="5" fill="#94a3b8" />
      </svg>
    );
  }
  if (stickerId === "hat_swat_black") {
    return (
      <svg className="w-16 h-12 filter drop-shadow-md select-none inline-block pointer-events-none" viewBox="0 0 100 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 42 C 15 18, 85 18, 80 42 C 85 45, 15 45, 20 42 Z" fill="#0f172a" />
        <path d="M25 40 C 30 14, 70 14, 75 40 Z" fill="#1e293b" />
        <rect x="42" y="22" width="16" height="12" rx="2" fill="#334155" />
        <text x="50" y="31" fill="#ffffff" fontSize="5px" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">특공대</text>
        <path d="M18 36 Q 50 40, 82 36" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
        <circle cx="23" cy="41" r="2.5" fill="#64748b" />
        <circle cx="77" cy="41" r="2.5" fill="#64748b" />
      </svg>
    );
  }
  if (stickerId === "hat_coast_white") {
    return (
      <svg className="w-16 h-12 filter drop-shadow-md select-none inline-block pointer-events-none" viewBox="0 0 100 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 45 C 20 54, 80 54, 88 45 C 92 42, 8 42, 12 45 Z" fill="#0f172a" />
        <path d="M20 42 C 20 42, 50 45, 80 42 L 78 30 C 78 30, 50 33, 22 30 Z" fill="#1e3a8a" />
        <path d="M20 42 Q 50 44, 80 42" stroke="#eab308" strokeWidth="2.5" />
        <circle cx="50" cy="36" r="4.5" fill="#fbbf24" />
        <path d="M22 30 C 15 12, 85 12, 78 30 C 50 25, 50 25, 22 30 Z" fill="#f8fafc" />
        <path d="M50 16 L 53 23 L 50 27 L 47 23 Z" fill="#eab308" />
      </svg>
    );
  }
  return (
    <span className="text-4xl select-none select-all-none inline-block filter drop-shadow">
      {emoji}
    </span>
  );
};

export default function App() {
  // Application State
  const [mode, setMode] = useState<ApplicationMode>("home");
  const [childName, setChildName] = useState("");
  const [selectedUniformId, setSelectedUniformId] = useState("patrol");
  const [appointmentType, setAppointmentType] = useState("경찰관");
  const [selectedDept, setSelectedDept] = useState("유치원 안전 지킴이");
  const [selectedCompliment, setSelectedCompliment] = useState("친구들과 사이좋게 놀고 먼저 차례를 양보하는 착한 마음씨");
  
  // Media & Camera State
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  // Photo positioning (Aligning kid face under uniform)
  const [photoPos, setPhotoPos] = useState({ x: 0, y: 0 });
  const [photoScale, setPhotoScale] = useState(1.0);
  const [photoRotation, setPhotoRotation] = useState(0);

  // Background Photo drag control state
  const [photoDrag, setPhotoDrag] = useState<{
    startX: number;
    startY: number;
    startPos: { x: number; y: number };
    type: 'move' | 'resize';
    startScale: number;
  } | null>(null);

  // Sticker Collage State
  const [stickers, setStickers] = useState<ActiveSticker[]>([]);
  const [focusedStickerId, setFocusedStickerId] = useState<string | null>(null);

  // Status & Audio Controls
  const [isMuted, setIsMuted] = useState(false);
  const [countdown, setCountdown] = useState(-1);
  const [isFlash, setIsFlash] = useState(false);
  const [isGeneratingLicense, setIsGeneratingLicense] = useState(false);
  const [generatedLicenseUrl, setGeneratedLicenseUrl] = useState<string | null>(null);
  const [badgeNo, setBadgeNo] = useState("");
  const [aiLetter, setAiLetter] = useState("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-generate fresh Badge Number & Date
  const getTodayString = () => {
    const today = new Date();
    return `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
  };

  useEffect(() => {
    // Make a random badge number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setBadgeNo(`경찰-2026-${randomNum}`);
  }, [mode]);

  // Handle Sounds safely
  const triggerSound = (type: 'click' | 'siren' | 'shutter' | 'success') => {
    if (isMuted) return;
    if (type === 'click') sfx.playClick();
    if (type === 'siren') sfx.playSiren();
    if (type === 'shutter') sfx.playShutter();
    if (type === 'success') sfx.playSuccess();
  };

  // Start/Stop Camera Streams
  const startCamera = async () => {
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn("Camera failed to start in iframe context:", err);
      setCameraError("카메라를 켤 수 없어요! 대신 예쁜 사진 파일을 직접 올려주세요 💖");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Triggers Camera Start on photo step
  useEffect(() => {
    if (mode === "photo") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [mode]);

  // Countdown timer trigger
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
        triggerSound('siren');
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // SHUTTER SNAP AT 0!
      capturePhoto();
      setCountdown(-1);
    }
  }, [countdown]);

  // Capture video frame to image state
  const capturePhoto = () => {
    if (videoRef.current) {
      triggerSound('shutter');
      setIsFlash(true);
      setTimeout(() => setIsFlash(false), 200);

      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      // Find square bounding dimensions
      const size = Math.min(video.videoWidth, video.videoHeight);
      canvas.width = size;
      canvas.height = size;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Crop center
        const startX = (video.videoWidth - size) / 2;
        const startY = (video.videoHeight - size) / 2;
        
        // Mirror-flip horizontally so captured image matches preview exactly
        ctx.translate(size, 0);
        ctx.scale(-1, 1);
        
        ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);
        setPhotoUrl(canvas.toDataURL("image/png"));
        
        // Reset base photo alignment sliders
        setPhotoPos({ x: 0, y: 0 });
        setPhotoScale(1.1); // default zoom in slightly for circular fit
        setPhotoRotation(0);
        
        // Clear old decorations
        setStickers([]);
        setFocusedStickerId(null);
        
        // Move forward after a tiny delay for visual pacing
        setTimeout(() => {
          setMode("decorate");
        }, 300);
      }
    }
  };

  // Keyboard and File Upload fallback
  const handleLocalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
          setPhotoPos({ x: 0, y: 0 });
          setPhotoScale(1.1);
          setPhotoRotation(0);
          setStickers([]);
          setFocusedStickerId(null);
          triggerSound('success');
          setMode("decorate");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add customized stickers on canvas
  const addSticker = (stickerTemplate: AccessorySticker) => {
    triggerSound('click');
    const newSticker: ActiveSticker = {
      id: `${stickerTemplate.id}_${Date.now()}`,
      stickerId: stickerTemplate.id,
      emoji: stickerTemplate.emoji,
      name: stickerTemplate.name,
      x: 50, // default center percentage
      y: 35, // default slightly above neck cutout
      scale: 1.2,
      rotation: 0
    };
    setStickers(prev => [...prev, newSticker]);
    setFocusedStickerId(newSticker.id);
  };

  // Adjust variables of active sticker
  const updateActiveSticker = (field: 'scale' | 'rotation', factor: number) => {
    if (!focusedStickerId) return;
    triggerSound('click');
    setStickers(prev => prev.map(s => {
      if (s.id === focusedStickerId) {
        return {
          ...s,
          [field]: field === 'scale' 
            ? Math.max(0.4, Math.min(4.0, s.scale + factor))
            : (s.rotation + factor + 360) % 360
        };
      }
      return s;
    }));
  };

  const deleteActiveSticker = () => {
    if (!focusedStickerId) return;
    triggerSound('click');
    setStickers(prev => prev.filter(s => s.id !== focusedStickerId));
    setFocusedStickerId(null);
  };

  const deleteStickerById = (id: string, e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    triggerSound('click');
    setStickers(prev => prev.filter(s => s.id !== id));
    if (focusedStickerId === id) {
      setFocusedStickerId(null);
    }
  };

  // Draggable & Resizable Mouse/Touch Handlers for Stickers and Photo background
  const [dragState, setDragState] = useState<{
    stickerId: string;
    type: 'move' | 'resize';
    startX: number;
    startY: number;
    stickerStartX: number;
    stickerStartY: number;
    startScale: number;
  } | null>(null);

  const handlePhotoDragStart = (e: React.MouseEvent | React.TouchEvent, type: 'move' | 'resize') => {
    e.stopPropagation();
    e.preventDefault();
    setFocusedStickerId(null); // unfocus stickers
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setPhotoDrag({
      startX: clientX,
      startY: clientY,
      startPos: { ...photoPos },
      type: type,
      startScale: photoScale
    });
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, sticker: ActiveSticker) => {
    e.preventDefault();
    setFocusedStickerId(sticker.id);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setDragState({
      stickerId: sticker.id,
      type: 'move',
      startX: clientX,
      startY: clientY,
      stickerStartX: sticker.x,
      stickerStartY: sticker.y,
      startScale: sticker.scale
    });
  };

  const handleResizeStart = (e: React.MouseEvent | React.TouchEvent, sticker: ActiveSticker) => {
    e.stopPropagation();
    e.preventDefault();
    setFocusedStickerId(sticker.id);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setDragState({
      stickerId: sticker.id,
      type: 'resize',
      startX: clientX,
      startY: clientY,
      stickerStartX: sticker.x,
      stickerStartY: sticker.y,
      startScale: sticker.scale
    });
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (photoDrag) {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      if (photoDrag.type === 'move') {
        const deltaX = clientX - photoDrag.startX;
        const deltaY = clientY - photoDrag.startY;
        const rect = containerRef.current ? containerRef.current.getBoundingClientRect() : { width: 344, height: 430 };
        const frameW = rect.width || 344;
        const frameH = rect.height || 430;
        setPhotoPos({
          x: photoDrag.startPos.x + deltaX / frameW,
          y: photoDrag.startPos.y + deltaY / frameH
        });
      } else if (photoDrag.type === 'resize') {
        const delta = (clientX - photoDrag.startX + (clientY - photoDrag.startY)) / 150;
        setPhotoScale(Math.max(0.3, Math.min(5.0, photoDrag.startScale + delta)));
      }
      return;
    }

    if (!dragState || !containerRef.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    if (dragState.type === 'resize') {
      // Linear scale adjustment depending on distance dragged (outward expands, inward shrinks)
      const delta = (clientX - dragState.startX + (clientY - dragState.startY)) / 120;
      setStickers(prev => prev.map(s => {
        if (s.id === dragState.stickerId) {
          return {
            ...s,
            scale: Math.max(0.4, Math.min(4.0, dragState.startScale + delta))
          };
        }
        return s;
      }));
    } else {
      const rect = containerRef.current.getBoundingClientRect();
      const deltaXPercent = ((clientX - dragState.startX) / rect.width) * 100;
      const deltaYPercent = ((clientY - dragState.startY) / rect.height) * 100;

      setStickers(prev => prev.map(s => {
        if (s.id === dragState.stickerId) {
          return {
            ...s,
            x: Math.max(5, Math.min(95, dragState.stickerStartX + deltaXPercent)),
            y: Math.max(5, Math.min(95, dragState.stickerStartY + deltaYPercent))
          };
        }
        return s;
      }));
    }
  };

  const handleDragEnd = () => {
    setDragState(null);
    setPhotoDrag(null);
  };

  // Reset all adjustments
  const resetPhotoPositions = () => {
    triggerSound('click');
    setPhotoPos({ x: 0, y: 0 });
    setPhotoScale(1.1);
    setPhotoRotation(0);
  };

  // Generates physical honorary license directly client-side
  const handleGenerateLicense = () => {
    if (!childName.trim()) {
      alert("아이의 이름을 입력해 주세요! 포돌이 서장님이 이름을 불러줄 거예요 👮");
      return;
    }
    
    triggerSound('click');
    setIsGeneratingLicense(true);
    
    // Render high-fidelity certificate immediately
    compileLicense(false, () => {
      setMode("badge");
      triggerSound('success');
    });
  };

  // HIGH FIDELITY OFFSCREEN CANVAS DRAWING ENGINE!
  // Combines: Base photo, positioning coordinates, uniform paths, sticker layers, 
  // borders, gold seals, and wrapped custom AI texts perfectly into a single image download!
  const compileLicense = (downloadImmediately = false, onComplete?: () => void) => {

    if (photoUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        executeDrawing(img);
      };
      img.onerror = () => {
        executeDrawing(null);
      };
      img.src = photoUrl;
    } else {
      executeDrawing(null);
    }

    function executeDrawing(loadedImg: HTMLImageElement | null) {
      const canvas = document.createElement("canvas");
      canvas.width = 1100;
      canvas.height = 700;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 1. Draw elegant background gradient (Navy blue / Gold margins)
    const cardGrad = ctx.createLinearGradient(0, 0, 1100, 700);
    cardGrad.addColorStop(0, "#0f172a"); // slate-900
    cardGrad.addColorStop(0.5, "#1e1b4b"); // indigo-950
    cardGrad.addColorStop(1, "#030712"); // black-950
    ctx.fillStyle = cardGrad;
    ctx.fillRect(0, 0, 1100, 700);

    // Decorative geometric patterns for security ID card look
    ctx.strokeStyle = "rgba(251, 191, 36, 0.08)"; // light gold grid
    ctx.lineWidth = 1;
    for (let i = 0; i < 1100; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 700);
      ctx.stroke();
    }
    for (let j = 0; j < 700; j += 40) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(1100, j);
      ctx.stroke();
    }

    // Double Gold Frame Border lines
    ctx.strokeStyle = "#fbbf24"; // amber-400
    ctx.lineWidth = 6;
    ctx.strokeRect(20, 20, 1060, 660);
    ctx.strokeStyle = "#d97706"; // amber-600
    ctx.lineWidth = 2;
    ctx.strokeRect(26, 26, 1048, 648);

    // 2. Headings
    ctx.font = "bold 44px 'SchoolSafeOuting', sans-serif";
    ctx.fillStyle = "#fbbf24";
    ctx.textAlign = "center";
    ctx.fillText("⭐ 대한민국 명예경찰 임명장 ⭐", 550, 85);

    ctx.font = "19px monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("REPUBLIC OF KOREA HONORARY KIDS POLICE LICENSE", 550, 120);

    // Divider Line
    ctx.strokeStyle = "rgba(251, 191, 36, 0.4)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(80, 138);
    ctx.lineTo(1020, 138);
    ctx.stroke();

    // 3. Compile and Draw Kid Photo inside a Leftside passport polaroid Frame
    const photoFrameX = 75;
    const photoFrameY = 170;
    const photoFrameW = 340;
    const photoFrameH = 445;

    // Draw white photopaper border
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(photoFrameX, photoFrameY, photoFrameW, photoFrameH);
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 2;
    ctx.strokeRect(photoFrameX, photoFrameY, photoFrameW, photoFrameH);

    // Dynamic inner photo box
    const innerPhotoX = photoFrameX + 15;
    const innerPhotoY = photoFrameY + 15;
    const innerPhotoW = photoFrameW - 30;
    const innerPhotoH = 387.5; // Exactly 4:5 aspect ratio (310 * 1.25) to match visual preview

    // Fill inner photo with deep placeholder gray first
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(innerPhotoX, innerPhotoY, innerPhotoW, innerPhotoH);

    // Draw base cropped user face image with adjustments!
    if (photoUrl && loadedImg) {
      const img = loadedImg;
      ctx.save();
      // Clip mask so the photo fits nicely inside our white margins
      ctx.beginPath();
      ctx.rect(innerPhotoX, innerPhotoY, innerPhotoW, innerPhotoH);
      ctx.clip();

      const cX = innerPhotoX + innerPhotoW / 2;
      const cY = innerPhotoY + innerPhotoH / 2;

      // Translate by the positional offsets relative to the unrotated container
      ctx.translate(cX + photoPos.x * innerPhotoW, cY + photoPos.y * innerPhotoH);
      ctx.rotate((photoRotation * Math.PI) / 180);

      const imgW = img.naturalWidth || img.width;
      const imgH = img.naturalHeight || img.height;
      const imgRatio = imgW / imgH;
      const containerRatio = innerPhotoW / innerPhotoH;

      let coverW = innerPhotoW;
      let coverH = innerPhotoH;

      if (imgRatio > containerRatio) {
        coverW = innerPhotoH * imgRatio;
      } else {
        coverH = innerPhotoW / imgRatio;
      }

      const dw = coverW * photoScale;
      const dh = coverH * photoScale;

      ctx.drawImage(img, -dw/2, -dh/2, dw, dh);
      ctx.restore();
    }

    // Draw Chosen Uniform Overlay over the photo on Canvas
    ctx.save();
    ctx.beginPath();
    ctx.rect(innerPhotoX, innerPhotoY, innerPhotoW, innerPhotoH);
    ctx.clip();

    // Uniform dimensions scaled down perfectly from the 400x300 viewport
    const uniW = innerPhotoW;
    const uniH = innerPhotoW * 3 / 4; // aspect ratio 4:3
    const uniY = innerPhotoY + innerPhotoH - uniH; // align perfectly to the bottom

    ctx.save();
    ctx.translate(innerPhotoX, uniY);
    ctx.scale(innerPhotoW / 400, innerPhotoW / 400);

    if (selectedUniformId === 'patrol') {
      // Main Navy Torso
      ctx.fillStyle = "#1e3a8a";
      ctx.strokeStyle = "#172554";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(40, 300);
      ctx.lineTo(40, 250);
      ctx.quadraticCurveTo(40, 140, 100, 120);
      ctx.lineTo(150, 90);
      ctx.quadraticCurveTo(200, 160, 250, 90);
      ctx.lineTo(300, 120);
      ctx.quadraticCurveTo(360, 140, 360, 250);
      ctx.lineTo(360, 300);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Light blue shirt insert
      ctx.fillStyle = "#93c5fd";
      ctx.beginPath();
      ctx.moveTo(150, 90);
      ctx.lineTo(200, 150);
      ctx.lineTo(250, 90);
      ctx.lineTo(200, 90);
      ctx.closePath();
      ctx.fill();

      // Gold tie
      ctx.fillStyle = "#fbbf24";
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(190, 120);
      ctx.lineTo(210, 120);
      ctx.lineTo(215, 220);
      ctx.lineTo(200, 245);
      ctx.lineTo(185, 220);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Shoulder epaulets (Gold)
      ctx.fillStyle = "#fbbf24";
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(60, 115);
      ctx.lineTo(120, 95);
      ctx.lineTo(130, 110);
      ctx.lineTo(70, 130);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(340, 115);
      ctx.lineTo(280, 95);
      ctx.lineTo(270, 110);
      ctx.lineTo(330, 130);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Collar wings
      ctx.fillStyle = "#1e40af";
      ctx.strokeStyle = "#1d4ed8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(130, 95);
      ctx.lineTo(175, 130);
      ctx.lineTo(185, 100);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(270, 95);
      ctx.lineTo(225, 130);
      ctx.lineTo(215, 100);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Star badge
      ctx.fillStyle = "#fbbf24";
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(110, 152);
      ctx.lineTo(115, 163);
      ctx.lineTo(127, 165);
      ctx.lineTo(118, 174);
      ctx.lineTo(120, 186);
      ctx.lineTo(110, 180);
      ctx.lineTo(100, 186);
      ctx.lineTo(102, 174);
      ctx.lineTo(93, 165);
      ctx.lineTo(105, 163);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(110, 170, 4, 0, Math.PI * 2);
      ctx.fill();

      // Pocket
      ctx.fillStyle = "#1d4ed8";
      ctx.strokeStyle = "#1e3a8a";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(260, 160);
      ctx.lineTo(310, 160);
      ctx.lineTo(310, 210);
      ctx.lineTo(285, 225);
      ctx.lineTo(260, 210);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(260, 160);
      ctx.lineTo(285, 175);
      ctx.lineTo(310, 160);
      ctx.stroke();

      // Silver chain
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 4;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(200, 150);
      ctx.quadraticCurveTo(240, 160, 270, 180);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

    } else if (selectedUniformId === 'traffic') {
      // Main Fluorescent Neon Vest
      ctx.fillStyle = "#eab308";
      ctx.strokeStyle = "#ca8a04";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(40, 300);
      ctx.lineTo(40, 250);
      ctx.quadraticCurveTo(40, 140, 100, 120);
      ctx.lineTo(150, 90);
      ctx.quadraticCurveTo(200, 160, 250, 90);
      ctx.lineTo(300, 120);
      ctx.quadraticCurveTo(360, 140, 360, 250);
      ctx.lineTo(360, 300);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // White inner insert
      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.moveTo(150, 90);
      ctx.lineTo(200, 140);
      ctx.lineTo(250, 90);
      ctx.lineTo(200, 90);
      ctx.closePath();
      ctx.fill();

      // Black tie
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.moveTo(192, 105);
      ctx.lineTo(208, 105);
      ctx.lineTo(212, 190);
      ctx.lineTo(200, 210);
      ctx.lineTo(188, 190);
      ctx.closePath();
      ctx.fill();

      // Silver reflective bands
      ctx.fillStyle = "#cbd5e1";
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(75, 180);
      ctx.quadraticCurveTo(200, 200, 325, 180);
      ctx.lineTo(330, 215);
      ctx.quadraticCurveTo(200, 235, 70, 215);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(98, 135);
      ctx.lineTo(132, 155);
      ctx.lineTo(115, 190);
      ctx.lineTo(82, 170);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(302, 135);
      ctx.lineTo(268, 155);
      ctx.lineTo(285, 190);
      ctx.lineTo(318, 170);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Traffic Police Badging
      ctx.fillStyle = "#3b82f6";
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(115, 155, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Winged emblem
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.moveTo(108, 155);
      ctx.quadraticCurveTo(115, 151, 122, 155);
      ctx.quadraticCurveTo(115, 159, 108, 155);
      ctx.closePath();
      ctx.fill();

      // Whistle
      ctx.fillStyle = "#64748b";
      ctx.beginPath();
      ctx.arc(200, 155, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.rect(197, 155, 6, 30);
      ctx.fill();

      // Red whistle cord
      ctx.strokeStyle = "#dc2626";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(175, 110);
      ctx.quadraticCurveTo(200, 135, 225, 110);
      ctx.stroke();

    } else if (selectedUniformId === 'swat') {
      // Tactical Charcoal Vest
      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(40, 300);
      ctx.lineTo(40, 250);
      ctx.quadraticCurveTo(40, 140, 100, 120);
      ctx.lineTo(150, 90);
      ctx.quadraticCurveTo(200, 165, 250, 90);
      ctx.lineTo(300, 120);
      ctx.quadraticCurveTo(360, 140, 360, 250);
      ctx.lineTo(360, 300);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Inner Black T-shirt
      ctx.fillStyle = "#020617";
      ctx.beginPath();
      ctx.moveTo(150, 90);
      ctx.lineTo(200, 155);
      ctx.lineTo(250, 90);
      ctx.lineTo(200, 90);
      ctx.closePath();
      ctx.fill();

      // Tactical Shoulder Straps with rotations
      ctx.save();
      ctx.translate(75, 112);
      ctx.rotate((-15 * Math.PI) / 180);
      ctx.fillStyle = "#334155";
      ctx.beginPath();
      ctx.roundRect(0, 0, 30, 40, 3);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.translate(295, 112);
      ctx.rotate((15 * Math.PI) / 180);
      ctx.fillStyle = "#334155";
      ctx.beginPath();
      ctx.roundRect(0, 0, 30, 40, 3);
      ctx.fill();
      ctx.restore();

      // Heavy Duty Chest Straps / Molle Grid
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(100, 180);
      ctx.lineTo(300, 180);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(100, 215);
      ctx.lineTo(300, 215);
      ctx.stroke();

      // Molle Pouches on vest
      ctx.fillStyle = "#334155";
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(110, 230, 50, 50, 4);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.roundRect(175, 230, 50, 50, 4);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.roundRect(240, 230, 50, 50, 4);
      ctx.fill();
      ctx.stroke();

      // 특공대 Wordmark Label
      ctx.fillStyle = "#facc15";
      ctx.strokeStyle = "#ca8a04";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(155, 145, 90, 26, 5);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#0f172a";
      ctx.font = "900 13px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("특공대", 200, 159);

      // Tactical radio mic clip
      ctx.fillStyle = "#020617";
      ctx.fillRect(85, 160, 13, 25);

      ctx.fillStyle = "#64748b";
      ctx.beginPath();
      ctx.arc(91, 172, 4, 0, Math.PI * 2);
      ctx.fill();

      // Spiral Wire
      ctx.strokeStyle = "#020617";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(91, 185);
      ctx.bezierCurveTo(80, 200, 110, 215, 95, 230);
      ctx.stroke();

    } else {
      // White Coast Guard Blouse
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(40, 300);
      ctx.lineTo(40, 250);
      ctx.quadraticCurveTo(40, 140, 100, 120);
      ctx.lineTo(150, 90);
      ctx.quadraticCurveTo(200, 160, 250, 90);
      ctx.lineTo(300, 120);
      ctx.quadraticCurveTo(360, 140, 360, 250);
      ctx.lineTo(360, 300);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Dark Navy Square Sailor Collar Insert
      ctx.fillStyle = "#1e3a8a";
      ctx.beginPath();
      ctx.moveTo(148, 85);
      ctx.lineTo(200, 145);
      ctx.lineTo(252, 85);
      ctx.closePath();
      ctx.fill();

      // Collar white piping line
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(152, 85);
      ctx.lineTo(200, 135);
      ctx.lineTo(248, 85);
      ctx.stroke();

      // Orange Life Jacket
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 15;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(80, 122);
      ctx.bezierCurveTo(80, 160, 100, 270, 120, 300);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(320, 122);
      ctx.bezierCurveTo(320, 160, 300, 270, 280, 300);
      ctx.stroke();
      ctx.lineCap = "butt";

      // Buckles
      ctx.fillStyle = "#fbbf24";
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.rect(100, 210, 22, 15);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.rect(278, 210, 22, 15);
      ctx.fill();
      ctx.stroke();

      // Center line link
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(110, 217);
      ctx.lineTo(290, 217);
      ctx.stroke();

      // Special Anchor Badge Pin
      ctx.fillStyle = "#fbbf24";
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(106, 165, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Anchor emblem
      ctx.strokeStyle = "#1e3a8a";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(106, 156);
      ctx.lineTo(106, 172);
      ctx.moveTo(100, 160);
      ctx.lineTo(112, 160);
      ctx.moveTo(102, 168);
      ctx.quadraticCurveTo(106, 175, 110, 168);
      ctx.stroke();
      ctx.lineCap = "butt";
    }

    ctx.restore(); // Restore scale translation context
    ctx.restore(); // Restore picture clipping mask

    // Draw placed custom Emoji/Vector stickers onto canvas with precise orientation
    stickers.forEach((st) => {
      ctx.save();
      // calculate position inside inner photo region
      const stickerX = innerPhotoX + (st.x / 100) * innerPhotoW;
      const stickerY = innerPhotoY + (st.y / 100) * innerPhotoH;

      ctx.translate(stickerX, stickerY);
      ctx.rotate((st.rotation * Math.PI) / 180);

      // Render custom vector hats with perfect pixel scale matching live viewport 0 0 100 70
      if (["hat_blue", "hat_yellow", "hat_swat_black", "hat_coast_white"].includes(st.stickerId)) {
        // scale proportional scaling factor
        const scaleFactor = (st.scale * 0.55 * (innerPhotoW / 170)) * (48 / 100);
        ctx.scale(scaleFactor, scaleFactor);
        ctx.translate(-50, -35); // Center the 100x70 viewBox

        if (st.stickerId === "hat_blue") {
          ctx.fillStyle = "#0f172a";
          ctx.beginPath();
          ctx.moveTo(12, 45);
          ctx.bezierCurveTo(20, 54, 80, 54, 88, 45);
          ctx.bezierCurveTo(92, 42, 8, 42, 12, 45);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = "#1e3a8a";
          ctx.beginPath();
          ctx.moveTo(20, 42);
          ctx.bezierCurveTo(20, 42, 50, 45, 80, 42);
          ctx.lineTo(78, 30);
          ctx.bezierCurveTo(78, 30, 50, 33, 22, 30);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = "#3b82f6";
          ctx.beginPath();
          ctx.moveTo(22, 30);
          ctx.bezierCurveTo(15, 15, 85, 15, 78, 30);
          ctx.bezierCurveTo(50, 25, 50, 25, 22, 30);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = "#fbbf24";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(20, 42);
          ctx.quadraticCurveTo(50, 44, 80, 42);
          ctx.stroke();

          ctx.fillStyle = "#fbbf24";
          ctx.strokeStyle = "#d97706";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(50, 36, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#ef4444";
          ctx.beginPath();
          ctx.moveTo(50, 32);
          ctx.lineTo(52, 35);
          ctx.lineTo(55, 35);
          ctx.lineTo(53, 37);
          ctx.lineTo(54, 40);
          ctx.lineTo(50, 38);
          ctx.lineTo(46, 40);
          ctx.lineTo(47, 37);
          ctx.lineTo(45, 35);
          ctx.lineTo(48, 35);
          ctx.closePath();
          ctx.fill();

        } else if (st.stickerId === "hat_yellow") {
          ctx.fillStyle = "#0f172a";
          ctx.beginPath();
          ctx.moveTo(12, 45);
          ctx.bezierCurveTo(20, 54, 80, 54, 88, 45);
          ctx.bezierCurveTo(92, 42, 8, 42, 12, 45);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = "#eab308";
          ctx.beginPath();
          ctx.moveTo(20, 42);
          ctx.bezierCurveTo(20, 42, 50, 45, 80, 42);
          ctx.lineTo(78, 30);
          ctx.bezierCurveTo(78, 30, 50, 33, 22, 30);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = "#475569";
          ctx.lineWidth = 3;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(20, 36);
          ctx.lineTo(80, 36);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = "#fef08a";
          ctx.beginPath();
          ctx.moveTo(22, 30);
          ctx.bezierCurveTo(15, 15, 85, 15, 78, 30);
          ctx.bezierCurveTo(50, 25, 50, 25, 22, 30);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = "#94a3b8";
          ctx.beginPath();
          ctx.arc(50, 27, 5, 0, Math.PI * 2);
          ctx.fill();

        } else if (st.stickerId === "hat_swat_black") {
          ctx.fillStyle = "#0f172a";
          ctx.beginPath();
          ctx.moveTo(20, 42);
          ctx.bezierCurveTo(15, 18, 85, 18, 80, 42);
          ctx.bezierCurveTo(85, 45, 15, 45, 20, 42);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = "#1e293b";
          ctx.beginPath();
          ctx.moveTo(25, 40);
          ctx.bezierCurveTo(30, 14, 70, 14, 75, 40);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = "#334155";
          ctx.beginPath();
          ctx.roundRect(42, 22, 16, 12, 2);
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.font = "900 5px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("특공대", 50, 28);

          ctx.strokeStyle = "#475569";
          ctx.lineWidth = 4;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(18, 36);
          ctx.quadraticCurveTo(50, 40, 82, 36);
          ctx.stroke();
          ctx.lineCap = "butt";

          ctx.fillStyle = "#64748b";
          ctx.beginPath();
          ctx.arc(23, 41, 2.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(77, 41, 2.5, 0, Math.PI * 2);
          ctx.fill();

        } else if (st.stickerId === "hat_coast_white") {
          ctx.fillStyle = "#0f172a";
          ctx.beginPath();
          ctx.moveTo(12, 45);
          ctx.bezierCurveTo(20, 54, 80, 54, 88, 45);
          ctx.bezierCurveTo(92, 42, 8, 42, 12, 45);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = "#1e3a8a";
          ctx.beginPath();
          ctx.moveTo(20, 42);
          ctx.bezierCurveTo(20, 42, 50, 45, 80, 42);
          ctx.lineTo(78, 30);
          ctx.bezierCurveTo(78, 30, 50, 33, 22, 30);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = "#eab308";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(20, 42);
          ctx.quadraticCurveTo(50, 44, 80, 42);
          ctx.stroke();

          ctx.fillStyle = "#fbbf24";
          ctx.beginPath();
          ctx.arc(50, 36, 4.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#f8fafc";
          ctx.beginPath();
          ctx.moveTo(22, 30);
          ctx.bezierCurveTo(15, 12, 85, 12, 78, 30);
          ctx.bezierCurveTo(50, 25, 50, 25, 22, 30);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = "#eab308";
          ctx.beginPath();
          ctx.moveTo(50, 16);
          ctx.lineTo(53, 23);
          ctx.lineTo(50, 27);
          ctx.lineTo(47, 23);
          ctx.closePath();
          ctx.fill();
        }

      } else {
        const emojiSize = Math.round(st.scale * 49);
        ctx.font = `${emojiSize}px sans-serif, Apple Color Emoji, Segoe UI Emoji`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(st.emoji, 0, 0);
      }
      ctx.restore();
    });

    ctx.restore(); // Restore picture clipping mask

    // Stamp "명예대원" label under polaroid picture frame
    ctx.font = "bold 21px 'SchoolSafeOuting', sans-serif";
    ctx.fillStyle = "#1e293b";
    ctx.textAlign = "center";
    ctx.fillText(`${childName || '꼬마'} 명예경찰`, photoFrameX + photoFrameW / 2, photoFrameY + photoFrameH - 18);


    // 5. Drawing Right Side Information Block
    const infoX = 460;
    const infoY = 200;

    ctx.textAlign = "left";
    
    // Field label parameters helper
    const drawMetaField = (label: string, value: string, textY: number) => {
      // label in gold
      ctx.font = "bold 21px 'SchoolSafeOuting', sans-serif";
      ctx.fillStyle = "#fbbf24";
      ctx.fillText(label, infoX, textY);
      // value in white
      ctx.font = "21px 'SchoolSafeOuting', sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(value, infoX + 110, textY);
    };

    drawMetaField("성       명:", `${childName} 대원`, infoY);
    drawMetaField("소       속:", selectedDept, infoY + 45);
    drawMetaField("임       명:", `${appointmentType || '경찰관'}`, infoY + 90);
    drawMetaField("수여 번호:", badgeNo, infoY + 135);
    drawMetaField("수여 일자:", getTodayString(), infoY + 180);

    // 6. Draw dynamic blended formal declaration text (Static, no API/AI, beautifully blended!)
    ctx.textAlign = "center";
    ctx.font = "bold 20px 'SchoolSafeOuting', sans-serif";
    ctx.fillStyle = "#fef08a"; // bright gold-yellow

    const line1Text = `[${selectedDept || '꿈나무 수호대'}] 소속의 ${childName || '꼬마'} 대원은`;
    const line2Text = `평소 "${selectedCompliment || '친구들과 사이좋게 놀고 먼저 차례를 양보하는 착한 마음씨'}"를 실천하며,`;
    const line3Text = `타인에게 큰 모범이 되었기에,`;
    const line4Text = `자랑스러운 대한민국 어린이 명예 ${appointmentType || '경찰관'}으로 정식 임명합니다.`;

    const declLines = [line1Text, line2Text, line3Text, line4Text];
    
    const blockCenterX = 705;
    const startY = 445;
    const rowHeight = 35; // tighter spacing for dynamic wrapped rows

    declLines.forEach((line, index) => {
      ctx.fillText(line, blockCenterX, startY + index * rowHeight);
    });

    // 7. Red official stamp on right bottom corner for ultimate satisfied look!
    const stampX = 980;
    const stampY = 560;
    ctx.strokeStyle = "#f87171"; // soft bright red
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.arc(stampX, stampY, 58, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(stampX, stampY, 50, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = "bold 15px sans-serif";
    ctx.fillStyle = "#ef4444";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("명   예", stampX, stampY - 19);
    ctx.fillText("경   찰", stampX, stampY);
    ctx.fillText("임   명", stampX, stampY + 19);

    // 8. Output
    const dataUrl = canvas.toDataURL("image/png");
    setGeneratedLicenseUrl(dataUrl);
    setIsGeneratingLicense(false);

    if (downloadImmediately) {
      const link = document.createElement("a");
      link.download = `어린이경찰관_${childName || '명예원'}_자격증.png`;
      link.href = dataUrl;
      link.click();
      triggerSound('success');
    }

    if (onComplete) {
      onComplete();
    }
    }
  };

  return (
    <div className="min-h-screen bg-[#1a2a6c] text-white flex flex-col justify-between overflow-x-hidden font-sans">
      
      {/* Dynamic Siren Lights on App top to give kids ultimate amusement! */}
      <div className="w-full h-3 bg-blue-950 border-b border-blue-900 flex">
        <div className="w-1/2 h-full flash-siren-blue" />
        <div className="w-1/2 h-full flash-siren-red" />
      </div>

      {/* Floating Siren and sound buttons */}
      <header className="bg-blue-800 border-b-4 border-yellow-400 py-4 px-6 md:px-10 sticky top-0 z-50 shadow-lg text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-md border-2 border-white">
            <span className="text-2xl">👮</span>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tighter italic text-yellow-450" style={{ fontFamily: "'Arial Black', 'Impact', sans-serif" }}>
              어린이 경찰 변신 사진관
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          
          <button
            onClick={() => {
              setIsMuted(!isMuted);
              triggerSound('click');
            }}
            id="sound_toggle_btn"
            className="p-2 ml-1 rounded-full bg-blue-700 hover:bg-blue-600 text-white shadow-md transition-colors border border-blue-600"
            title={isMuted ? "소리 켜기" : "소리 끄기"}
          >
            {isMuted ? <VolumeX className="w-4.5 h-4.5 text-red-300" /> : <Volume2 className="w-4.5 h-4.5 text-yellow-300" />}
          </button>
          
          {mode !== "home" && (
            <button
              onClick={() => {
                triggerSound('click');
                setMode("home");
              }}
              id="home_gback_btn"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-xs text-white font-black shadow-md border-b-2 border-red-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>처음으로</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: HOME PAGE */}
          {mode === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full max-w-xl bg-blue-900 border-4 border-yellow-400 p-6 rounded-3xl shadow-2xl relative overflow-hidden text-center"
            >
              {/* Gold star background vector */}
              <div className="absolute top-2 right-2 text-7xl opacity-10 rotate-12 select-none">⭐</div>
              <div className="absolute bottom-2 left-2 text-7xl opacity-10 -rotate-12 select-none">🚨</div>

              <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl">
                <span className="text-5xl animate-pulse">👮</span>
              </div>
              
              <span className="text-xs bg-yellow-400 text-blue-950 px-4 py-1.5 rounded-full font-black tracking-tight border border-white">
                ⭐ 대한민국 어린이 안전위원회 지정 ⭐
              </span>
              
              <h2 className="text-3xl md:text-4xl font-black mt-4 mb-3 text-white tracking-tighter italic" style={{ fontFamily: "'Arial Black', sans-serif" }}>
                어린이 명예경찰 <br />
                <span className="text-yellow-400 text-4xl md:text-5xl">변신 사진관!</span>
              </h2>
              
              <p className="text-blue-100 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
                아이의 예쁜 얼굴을 비추거나 사진 파일을 올려서 늠름한 경찰 제복을 완성하고, 인공지능 서장님의 격려 편지가 적힌 경찰 자격증을 발급받으세요!
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    triggerSound('click');
                    setMode("photo");
                  }}
                  id="direct_cam_start_btn"
                  className="flex-1 bg-red-500 hover:bg-red-600 border-b-4 border-red-800 active:translate-y-1 active:border-b-0 text-white font-black text-xl py-4 px-6 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Camera className="w-5 h-5 text-white" />
                  <span>카메라로 즉시 촬영하기 📸</span>
                </button>
              </div>

              <div className="mt-5 border-t border-blue-800 pt-5 text-xs text-blue-300 flex items-center justify-center gap-1.5">
                <Info className="w-4 h-4 text-yellow-400" />
                <span>유치원 미디어 패드 및 스마트 TV에서 가로/세로 모두 완벽 호환됩니다.</span>
              </div>
            </motion.div>
          )}

          {/* STEP 2: PHOTO CAPTURE & FALLBACK */}
          {mode === "photo" && (
            <motion.div
              key="photo"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-blue-900 border-4 border-yellow-400 p-6 rounded-3xl shadow-2xl relative overflow-hidden text-white"
            >
              <h2 className="text-2xl font-black mb-4 text-center tracking-tighter text-yellow-400 italic" style={{ fontFamily: "'Arial Black', sans-serif" }}>
                📸 꼬마 경찰대원
              </h2>

              {/* Video stage container */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black border-8 border-white shadow-2xl flex items-center justify-center">
                
                {/* Camera fail or Camera denied container */}
                {cameraError ? (
                  <div className="p-6 text-center max-w-sm">
                    <div className="w-16 h-16 bg-blue-950/50 text-red-400 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ShieldAlert className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-bold text-slate-200 leading-relaxed mb-4">{cameraError}</p>
                    
                    {/* Instant File Selection */}
                    <label id="upload_label_trigger" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-sm cursor-pointer shadow-md transition-all active:scale-95">
                      <Upload className="w-4 h-4" />
                      <span>내 컴퓨터에서 사진 불러오기</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleLocalFileSelect} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform -scale-x-100"
                    />

                    {/* RED blink box for live recording look */}
                    <div className="absolute top-4 left-4 z-40 bg-red-600 px-4 py-2 rounded-md animate-pulse flex items-center gap-2 border border-white">
                      <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
                      <span className="font-bold text-xs uppercase text-white tracking-wider">촬영 중...</span>
                    </div>

                    {/* Badge Overlay */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4/5 py-2 bg-blue-900/80 border-2 border-yellow-400 rounded-xl flex flex-col items-center justify-center z-30 shadow-md">
                      <div className="w-10/12 h-0.5 bg-yellow-400 mb-1"></div>
                      <span className="text-[9px] tracking-widest font-bold text-yellow-105 font-mono">POLICE DEPARTMENT</span>
                      <span className="text-sm font-black text-white uppercase tracking-tight font-sans">Junior Officer</span>
                    </div>

                    {/* Hollow neck cutout so child aligns perfectly */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 bg-transparent rounded-2xl">
                      {/* Face dotted alignment guide */}
                      <div className="w-[180px] h-[225px] border-4 border-dashed border-yellow-400/80 rounded-full mx-auto mt-[40px] relative">
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-blue-950 px-2 py-0.5 rounded text-[10px] font-black tracking-wider whitespace-nowrap">
                          여기에 머리를 맞춰요!
                        </div>
                      </div>

                      {/* Ghost preview of selected police uniform below neck cutout */}
                      <div className="w-[190px] h-[130px] mx-auto opacity-80">
                        <PoliceUniform type={selectedUniformId as any} />
                      </div>
                    </div>
                  </>
                )}

                {/* White Flash Effect overlay */}
                {isFlash && (
                  <div className="absolute inset-0 bg-white z-50 animate-fade-out" />
                )}

                {/* Countdown visual overlays */}
                {countdown > 0 && (
                  <div className="absolute inset-0 bg-black/80 z-30 flex flex-col items-center justify-center">
                    <motion.div
                      key={countdown}
                      initial={{ scale: 0.3, opacity: 0 }}
                      animate={{ scale: 1.4, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 150 }}
                      className="text-yellow-400 text-[180px] font-black drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]"
                      style={{ fontFamily: "'Arial Black', sans-serif" }}
                    >
                      {countdown}
                    </motion.div>
                    <span className="text-white text-base mt-4 font-bold tracking-wider animate-bounce">
                      곧 맛보기 셔터가 터져요! 📸
                    </span>
                  </div>
                )}
              </div>

              {/* Camera Actions and Fallbacks */}
              <div className="mt-4 flex gap-2.5">
                {!cameraError && (
                  <button
                    onClick={() => {
                      triggerSound('click');
                      setCountdown(3);
                    }}
                    disabled={countdown >= 0}
                    id="countdown_run_btn"
                    className="flex-1 py-4 bg-blue-700 text-white hover:bg-blue-600 rounded-xl font-black text-lg shadow-lg border-b-4 border-blue-900 active:translate-y-1 active:border-b-0 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <span className="text-lg">📢</span>
                    <span>3, 2, 1 찰칵 촬영하기!</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    triggerSound('click');
                    setMode("home");
                  }}
                  className="px-6 py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-black border-b-4 border-red-800 active:translate-y-1 active:border-b-0 transition-colors"
                >
                  취소
                </button>
              </div>

              {/* Secondary Upload option under camera view */}
              {!cameraError && (
                <div className="mt-4 border-t border-blue-800 pt-3 text-center">
                  <span className="text-xs text-blue-200 mr-2">직접 찍은 사진이 있나요?</span>
                  <label className="text-xs text-yellow-400 hover:underline cursor-pointer font-bold inline-flex items-center gap-1 select-none">
                    <Upload className="w-3 h-3" />
                    <span>갤러리 파일 선택하기</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLocalFileSelect} 
                      className="hidden" 
                    />
                  </label>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 3: DECORATION STUDIO (UNIFORM & COLLAGE & INFO FORM) */}
          {mode === "decorate" && (
            <motion.div
              key="decorate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-5xl bg-blue-900 border-4 border-yellow-400 p-6 rounded-3xl shadow-2xl flex flex-col lg:flex-row gap-6 relative"
            >
              
              {/* Left Column: Interactive canvas and scale controllers */}
              <div className="lg:w-[420px] flex-shrink-0 flex flex-col items-center justify-center">

                {/* Layered collage booth frame config with 8px white border */}
                <div 
                  ref={containerRef}
                  onMouseMove={handleDragMove}
                  onTouchMove={handleDragMove}
                  onMouseUp={handleDragEnd}
                  onTouchEnd={handleDragEnd}
                  className="w-full aspect-[4/5] max-w-[360px] bg-black rounded-2xl border-8 border-white overflow-hidden relative shadow-2xl select-none cursor-default"
                >
                  
                  {/* LAYER 1: Base Face Photo */}
                  {photoUrl ? (
                    <>
                      <img
                        src={photoUrl}
                        alt="Kid Cop"
                        onMouseDown={(e) => handlePhotoDragStart(e, 'move')}
                        onTouchStart={(e) => handlePhotoDragStart(e, 'move')}
                        className="absolute inset-0 w-full h-full object-cover cursor-grab active:cursor-grabbing select-none"
                        style={{
                          transform: `translate(${photoPos.x * 100}%, ${photoPos.y * 100}%) scale(${photoScale}) rotate(${photoRotation}deg)`,
                          transformOrigin: "center center",
                          transition: (dragState || photoDrag) ? "none" : "transform 0.1s ease-out",
                          touchAction: "none"
                        }}
                      />
                      {/* Photo resize handle overlay */}
                      {focusedStickerId === null && (
                        <div 
                          onMouseDown={(e) => handlePhotoDragStart(e, 'resize')}
                          onTouchStart={(e) => handlePhotoDragStart(e, 'resize')}
                          className="absolute bottom-4 left-4 w-9 h-9 bg-yellow-450 hover:bg-yellow-400 text-blue-950 border-2 border-blue-950 rounded-full flex items-center justify-center text-xs font-black cursor-se-resize z-45 shadow hover:scale-110 active:scale-95 select-none animate-bounce"
                          title="사진 크기 조절 (드래그)"
                          style={{ touchAction: "none" }}
                        >
                          ↔️
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                      사진이 없습니다.
                    </div>
                  )}

                  {/* LAYER 2: Transparent Neck cutout Uniform overlays */}
                  <div className="absolute bottom-0 left-0 w-full aspect-[4/3] pointer-events-none z-10 drop-shadow-lg">
                    <PoliceUniform type={selectedUniformId as any} />
                  </div>

                  {/* LAYER 3: Interactive Sticker Layers */}
                  {stickers.map((st) => {
                    const isFocused = st.id === focusedStickerId;
                    return (
                      <motion.div
                        key={st.id}
                        onMouseDown={(e) => handleDragStart(e, st)}
                        onTouchStart={(e) => handleDragStart(e, st)}
                        className={`absolute z-20 cursor-move transition-shadow ${
                          isFocused ? "ring-2 ring-yellow-450 ring-offset-2 ring-offset-blue-950 rounded-lg p-0.5" : ""
                        }`}
                        style={{
                          left: `${st.x}%`,
                          top: `${st.y}%`,
                          transform: `translate(-50%, -50%) rotate(${st.rotation}deg) scale(${st.scale})`,
                          touchAction: "none"
                        }}
                      >
                        <div className="select-none inline-block filter drop-shadow">
                          {renderStickerIcon(st.stickerId, st.emoji)}
                        </div>
                        
                        {/* active highlight pointer anchor */}
                        {isFocused && (
                          <>
                            {/* Interactive Delete Button on active element */}
                            <span 
                              onMouseDown={(e) => deleteStickerById(st.id, e)}
                              onTouchStart={(e) => deleteStickerById(st.id, e)}
                              className="absolute -top-4 -left-4 w-6 h-6 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-black cursor-pointer z-50 select-none shadow border-2 border-white hover:scale-110 active:scale-95"
                              title="삭제"
                              style={{ touchAction: "none" }}
                            >
                              ❌
                            </span>

                            <span className="absolute -top-3.5 -right-3.5 w-4.5 h-4.5 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] text-blue-950 font-black shadow-md">
                              ✏️
                            </span>
                            {/* Draggable resize handle for both mouse and touch resize */}
                            <span 
                              onMouseDown={(e) => handleResizeStart(e, st)}
                              onTouchStart={(e) => handleResizeStart(e, st)}
                              className="absolute -bottom-3.5 -right-3.5 w-6 h-6 bg-yellow-400 hover:bg-yellow-300 text-blue-950 border border-blue-950 rounded-full flex items-center justify-center text-xs font-black cursor-se-resize z-50 select-none shadow hover:scale-110 active:scale-95"
                              title="크기 조절"
                              style={{ touchAction: "none" }}
                            >
                              ⤡
                            </span>
                          </>
                        )}
                      </motion.div>
                    );
                  })}

                  {/* Hollow cut indicator line just for design */}
                  <div className="absolute top-2 left-2 bg-blue-950/80 rounded px-2.5 py-1 text-[10px] pointer-events-none text-yellow-300 font-bold z-10 border border-blue-900">
                    얼굴 조절 후 아래 탭에서 자유롭게 꾸미세요!
                  </div>
                </div>

                {/* Face Adjustment Box (Positioning under uniform) */}
                <div className="w-full max-w-[360px] bg-blue-950/80 border-2 border-blue-800 rounded-2xl p-4 mt-3">
                  <p className="text-xs font-black text-yellow-400 flex items-center justify-between mb-2 select-none uppercase tracking-wide">
                    <span>👤 내 얼굴에 딱 맞춰 정렬하기</span>
                    <button 
                      onClick={resetPhotoPositions}
                      className="text-[10px] text-yellow-400 hover:underline flex items-center gap-1 font-bold"
                    >
                      <RotateCcw className="w-3 h-3" /> 위치 초기화
                    </button>
                  </p>
                  
                  {/* Scaling sliders */}
                  <div className="flex items-center gap-3 select-none mb-1.5">
                    <span className="text-[10px] text-blue-200 w-12 text-right">👨 크기조절</span>
                    <Minus className="w-3.5 h-3.5 text-blue-300 cursor-pointer" onClick={() => setPhotoScale(prev => Math.max(0.4, prev - 0.05))} />
                    <input 
                      type="range"
                      min="0.5"
                      max="2.5"
                      step="0.02"
                      value={photoScale}
                      onChange={(e) => setPhotoScale(parseFloat(e.target.value))}
                      className="flex-1 h-1 bg-blue-900 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                    />
                    <Plus className="w-3.5 h-3.5 text-blue-300 cursor-pointer" onClick={() => setPhotoScale(prev => Math.min(2.5, prev + 0.05))} />
                  </div>

                  {/* Horizontal moves */}
                  <div className="flex items-center gap-3 select-none mb-1.5">
                    <span className="text-[10px] text-blue-200 w-12 text-right">↔️ 가로이동</span>
                    <input 
                      type="range"
                      min="-0.5"
                      max="0.5"
                      step="0.005"
                      value={photoPos.x}
                      onChange={(e) => setPhotoPos(prev => ({ ...prev, x: parseFloat(e.target.value) }))}
                      className="flex-1 h-1 bg-blue-900 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                    />
                  </div>

                  {/* Vertical moves */}
                  <div className="flex items-center gap-3 select-none">
                    <span className="text-[10px] text-blue-200 w-12 text-right">↕️ 세로이동</span>
                    <input 
                      type="range"
                      min="-0.5"
                      max="0.5"
                      step="0.005"
                      value={photoPos.y}
                      onChange={(e) => setPhotoPos(prev => ({ ...prev, y: parseFloat(e.target.value) }))}
                      className="flex-1 h-1 bg-blue-900 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                    />
                  </div>
                </div>
              </div>


              {/* Right Column: Custom tab drawer and identity form card */}
              <div className="flex-grow flex flex-col justify-between">
                
                <div className="space-y-4">
                  
                  {/* Tab list header for stickers / uniforms */}
                  <div className="bg-blue-950/70 p-3.5 rounded-2xl border-2 border-blue-800 shadow-inner">
                    <div className="text-xs text-yellow-400 font-extrabold mb-3 px-1 tracking-wider uppercase">
                      🎁 명예대원 전용 장비 및 이색 의복 상자
                    </div>
                    
                    {/* Uniform styles selection */}
                    <div className="text-xs font-bold text-blue-100 px-1 mb-2">제복 스타일을 터치로 선택하세요!</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {UNIFORM_TEMPLATES.map((uni) => (
                        <button
                          key={uni.id}
                          onClick={() => {
                            triggerSound('click');
                            setSelectedUniformId(uni.id);
                            setAppointmentType(uni.name);
                          }}
                          className={`p-2 rounded-xl text-center border-2 transition-all select-none ${
                            selectedUniformId === uni.id
                              ? "bg-yellow-400 border-yellow-500 text-blue-950 shadow-md transform -translate-y-0.5"
                              : "bg-blue-800 border-blue-950 text-blue-100 hover:bg-blue-700"
                          }`}
                        >
                          <div className="text-sm font-black font-school">{uni.name}</div>
                          <div className={`text-[9px] font-bold ${selectedUniformId === uni.id ? "text-blue-900" : "text-yellow-405"} opacity-90 mt-0.5`}>{uni.subName.split(" ")[0]}</div>
                        </button>
                      ))}
                    </div>

                    {/* Stickers list selection categorized into Hats */}
                    <div className="mt-4 space-y-4">
                      {/* Category 1: Hats */}
                      <div>
                        <div className="text-xs font-black text-yellow-405 mb-2 px-1 flex justify-between items-center select-none">
                          <span className="text-yellow-400">🧢 모자 스티커 (클릭 시 추가)</span>
                          {focusedStickerId && (
                            <span className="text-[10px] bg-yellow-400/20 text-yellow-400 font-bold px-2 py-0.5 rounded animate-pulse">
                              스티커 조절 활성화!
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {POLICE_STICKERS.filter(st => st.category === "hat").map((st) => (
                            <button
                              key={st.id}
                              onClick={() => addSticker(st)}
                              className="bg-blue-800 border-2 border-blue-950 hover:bg-blue-700 p-2 rounded-xl text-center flex flex-col items-center gap-1.5 justify-center active:scale-95 transition-all w-full select-none"
                            >
                              <div className="w-14 h-11 flex items-center justify-center">
                                {renderStickerIcon(st.id, st.emoji)}
                              </div>
                              <span className="text-[10px] text-blue-100 font-extrabold line-clamp-1">
                                {st.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>


                  {/* Step Form Details for Card Issuing */}
                  <div className="bg-blue-950/70 p-4 rounded-2xl border-2 border-blue-800 space-y-3.5 shadow-inner">
                    <div className="text-xs text-yellow-400 font-extrabold tracking-wider uppercase">
                      📋 보안관 명부 등록 기명부
                    </div>

                    {/* Kid Name Input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-black text-blue-105 select-none text-blue-100">
                        대원 성명 수여 (예: 홍길동) <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="이름을 적어주세요!"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        className="bg-blue-900/80 border-2 border-blue-850 px-4 py-3 rounded-xl text-sm focus:border-yellow-450 focus:outline-none placeholder-blue-300 text-white font-black"
                      />
                    </div>

                    {/* Patrol Team Section */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-black text-blue-100 select-none flex justify-between items-center">
                        <span>소속</span>
                        <span className="text-[10px] text-yellow-400">✍️ 직접 수정 가능</span>
                      </label>
                      <input
                        type="text"
                        placeholder="예: 유치원 안전 지킴이"
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        className="bg-blue-900/80 border-2 border-blue-850 px-4 py-3 rounded-xl text-sm focus:border-yellow-400 focus:outline-none placeholder-blue-300 text-white font-black"
                      />
                    </div>

                    {/* Appointment Type Section (Customizable Designation) */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-black text-blue-100 select-none flex justify-between items-center">
                        <span>임명 직급 (임명 종류)</span>
                        <span className="text-[10px] text-yellow-400">✍️ 빠른 선택 또는 원하는 임명명 직접 입력</span>
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <select
                          value={['경찰관', '교통지킴이', '특공대', '해양경찰관'].includes(appointmentType) ? appointmentType : 'custom'}
                          onChange={(e) => {
                            if (e.target.value !== 'custom') {
                              setAppointmentType(e.target.value);
                              const matchedUni = UNIFORM_TEMPLATES.find(u => u.name === e.target.value);
                              if (matchedUni) {
                                setSelectedUniformId(matchedUni.id);
                              }
                            }
                            triggerSound('click');
                          }}
                          className="bg-blue-900/80 border-2 border-blue-850 px-3 py-3 text-sm focus:border-yellow-400 focus:outline-none text-white font-black cursor-pointer rounded-xl sm:w-1/3"
                        >
                          <option value="경찰관">경찰관</option>
                          <option value="교통지킴이">교통지킴이</option>
                          <option value="특공대">특공대</option>
                          <option value="해양경찰관">해양경찰관</option>
                          <option value="custom">직접 입력 (추가)</option>
                        </select>
                        <input
                          type="text"
                          placeholder="원하는 임명 종류를 마음껏 입력해보세요!"
                          value={appointmentType}
                          onChange={(e) => setAppointmentType(e.target.value)}
                          className="bg-blue-900/80 border-2 border-blue-850 px-4 py-3 rounded-xl text-sm focus:border-yellow-400 focus:outline-none placeholder-blue-300 text-white font-black flex-1"
                        />
                      </div>
                    </div>

                    {/* Specialty / Compliment Section (RESTORED & REINTEGRATED) */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-black text-blue-100 select-none flex justify-between items-center">
                        <span>특기 세부사항</span>
                        <span className="text-[10px] text-yellow-400">✍️ 추천 템플릿 선택 및 자유 편집</span>
                      </label>
                      <select
                        onChange={(e) => {
                          const option = COMPLIMENT_OPTIONS.find(o => o.label === e.target.value);
                          if (option) {
                            setSelectedCompliment(option.value);
                            triggerSound('click');
                          }
                        }}
                        className="bg-blue-900/80 border-2 border-blue-850 px-4 py-2 text-xs focus:border-yellow-400 focus:outline-none text-white font-black cursor-pointer rounded-xl"
                        defaultValue=""
                      >
                        <option value="" disabled>✨ 추천 칭찬/특기 템플릿 불러오기</option>
                        {COMPLIMENT_OPTIONS.map((opt, idx) => (
                          <option key={idx} value={opt.label}>{opt.label}</option>
                        ))}
                      </select>
                      <textarea
                        rows={2}
                        placeholder="아이의 칭찬거리나 특별한 행동(특기) 등을 정성스레 적어주세요!"
                        value={selectedCompliment}
                        onChange={(e) => setSelectedCompliment(e.target.value)}
                        className="bg-blue-900/80 border-2 border-blue-850 px-4 py-3 rounded-xl text-sm focus:border-yellow-400 focus:outline-none placeholder-blue-300 text-white font-black leading-relaxed resize-none"
                      />
                    </div>

                  </div>

                </div>

                {/* Confirm generation */}
                <div className="mt-5 flex gap-2.5">
                  <button
                    onClick={handleGenerateLicense}
                    id="badge_form_submit_btn"
                    className="flex-1 bg-red-500 hover:bg-red-650 text-white font-black text-lg py-4 px-6 rounded-2xl shadow-xl border-b-4 border-red-800 active:translate-y-1 active:border-b-0 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Check className="w-5 h-5 text-white" />
                    <span>👮 멋진 경찰 자격증 발급하기!</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      triggerSound('click');
                      setMode("photo");
                    }}
                    className="px-5 py-4 bg-blue-700 hover:bg-blue-600 text-white rounded-2xl text-sm font-black border-b-4 border-blue-900 active:translate-y-1 active:border-b-0 transition-all cursor-pointer"
                  >
                    사진 다시 찍기
                  </button>
                </div>

              </div>

            </motion.div>
          )}

          {/* STEP 4: LICENSE SHOWCASE & DOWNLOADS */}
          {mode === "badge" && (
            <motion.div
              key="badge"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full max-w-3xl text-center"
            >
              
              <div className="inline-flex items-center gap-2 mb-2 select-none">
                <PartyPopper className="w-6 h-6 text-yellow-400" />
                <span className="text-xs bg-red-500 border-b-2 border-red-800 px-3 py-1.5 rounded-full text-white font-black tracking-wider shadow">
                  대한민국 꿈나무 명예경찰 위촉 완료! 👮
                </span>
              </div>

              <h2 className="text-3xl font-black text-white mb-4 italic tracking-wide" style={{ fontFamily: "'Arial Black', sans-serif" }}>
                {childName} 경찰 대원의 명예 자격증 👮
              </h2>

              {/* Complete Printable ID CARD layout - Rendered from exact Canvas for 100% Fidelity! */}
              <div 
                id="license_printable_frame"
                className="w-full rounded-3xl bg-blue-900 border-8 border-yellow-400 p-2 shadow-2xl relative overflow-hidden flex flex-col mx-auto max-w-2xl bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 text-white"
              >
                {generatedLicenseUrl ? (
                  <div className="relative group overflow-hidden rounded-2xl select-none">
                    <img 
                      src={generatedLicenseUrl} 
                      alt="최종 발급 자격증" 
                      className="w-full h-auto object-contain block shadow-xl"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 pointer-events-none select-none">
                      <p className="text-yellow-400 text-sm font-extrabold flex items-center gap-2">
                        <span>📸 실제 저장되는 100% 고화질 임명장입니다</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center text-blue-200">
                    <div className="animate-spin text-4xl mb-4 text-yellow-400 font-bold">🎖️</div>
                    <p className="font-extrabold text-lg text-yellow-400">명예경찰 임명장을 제작하고 있습니다...</p>
                    <p className="text-xs text-blue-300 mt-2">고품격 제복 이미지와 스티커를 결합하는 중...</p>
                  </div>
                )}
              </div>

              {/* Actions for Badge view */}
              <div className="mt-5 max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => compileLicense(true)}
                  id="save_license_down_btn"
                  className="flex-1 bg-red-500 hover:bg-red-650 text-white font-black text-lg py-4 px-6 rounded-2xl shadow-xl border-b-4 border-red-800 active:translate-y-1 active:border-b-0 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-5 h-5 text-white" />
                  <span>💾 자격증 이미지 저장하기</span>
                </button>

                <button
                  onClick={() => {
                    triggerSound('click');
                    // Reset fields for the next child completely to prevent leakage
                    setChildName("");
                    setGeneratedLicenseUrl(null);
                    setStickers([]);
                    setAppointmentType("경찰관");
                    setSelectedUniformId("patrol");
                    setSelectedDept("유치원 안전 지킴이");
                    setSelectedCompliment("친구들과 사이좋게 놀고 먼저 차례를 양보하는 착한 마음씨");
                    setBadgeNo(`경찰-2026-${Math.floor(1000 + Math.random() * 9000)}`);
                    setMode("home");
                  }}
                  className="px-6 py-4 bg-blue-700 hover:bg-blue-600 text-white rounded-2xl text-sm font-black border-b-4 border-blue-900 active:translate-y-1 active:border-b-0 transition-all cursor-pointer"
                >
                  다음 어린이 촬영하기 🔄
                </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer Logo */}
      <footer className="w-full py-8 flex flex-col items-center justify-center mt-auto select-none">
        <a 
          href="https://i.imgur.com/0OMgykW_d.png?maxwidth=520&shape=thumb&fidelity=high" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block transition-transform duration-200 hover:scale-105 active:scale-95"
          id="footer_logo_link"
        >
          <img 
            src="https://i.imgur.com/0OMgykW_d.png?maxwidth=520&shape=thumb&fidelity=high" 
            alt="Gemidain" 
            referrerPolicy="no-referrer"
            className="h-16 md:h-20 max-w-[80vw] object-contain opacity-100 drop-shadow-xl transition-opacity duration-200"
          />
        </a>
      </footer>

    </div>
  );
}
