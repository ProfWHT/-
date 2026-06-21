import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Scan, Copy, Check, Download, AlertCircle, Camera, Upload, Link2, ExternalLink } from 'lucide-react';
import QRCodeBranded from './QRCodeBranded';
import { Html5Qrcode } from 'html5-qrcode';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'view' | 'scan';
}

export default function QRModal({ isOpen, onClose, initialTab = 'view' }: QRModalProps) {
  const [activeTab, setActiveTab] = useState<'view' | 'scan'>(initialTab);
  const [isCopied, setIsCopied] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const qrReaderRef = useRef<Html5Qrcode | null>(null);
  const qrcodeId = "html5-qr-video-scanner";

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setScanResult(null);
      setScanError(null);
    } else {
      stopScanner();
    }
  }, [isOpen, initialTab]);

  // Effect to manage starting and stopping scanner depending on tab
  useEffect(() => {
    if (isOpen && activeTab === 'scan') {
      // Small timeout to allow container element to render in DOM
      const timer = setTimeout(() => {
        startScanner();
      }, 300);
      return () => {
        clearTimeout(timer);
        stopScanner();
      };
    } else {
      stopScanner();
    }
  }, [activeTab, isOpen]);

  const startScanner = async () => {
    setScanResult(null);
    setScanError(null);
    try {
      if (!qrReaderRef.current) {
        qrReaderRef.current = new Html5Qrcode(qrcodeId);
      }

      setScannerActive(true);
      await qrReaderRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: (width, height) => {
            const size = Math.min(width, height) * 0.7;
            return { width: size, height: size };
          }
        },
        (decodedText) => {
          handleSuccessfulScan(decodedText);
        },
        (errorMessage) => {
          // Silent local failure because scanners trigger this on every frame they don't find a code
        }
      );
      setCameraPermission(true);
    } catch (err: any) {
      console.error("Camera scan start error:", err);
      setCameraPermission(false);
      setScannerActive(false);
      setScanError("ক্যামেরা চালু করা যায়নি। অনুগ্রহ করে ক্যামেরা অনুমতি দিন অথবা ছবি আপলোড করে কিউআর কোড স্ক্যান করুন।");
    }
  };

  const stopScanner = async () => {
    if (qrReaderRef.current && qrReaderRef.current.isScanning) {
      try {
        await qrReaderRef.current.stop();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
    setScannerActive(false);
  };

  const handleSuccessfulScan = (decodedText: string) => {
    setScanResult(decodedText);
    stopScanner();

    // If it's a URL, open it as requested
    if (isValidUrl(decodedText)) {
      // Trigger opening after a brief delay so user can register the scan success screen
      setTimeout(() => {
        window.open(decodedText, '_blank');
      }, 1200);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    scanLocalFile(file);
  };

  const scanLocalFile = async (file: File) => {
    setScanResult(null);
    setScanError(null);
    try {
      // Need a temporary reader or current pointer
      let fileScanReader = qrReaderRef.current;
      if (!fileScanReader) {
        fileScanReader = new Html5Qrcode(qrcodeId);
        qrReaderRef.current = fileScanReader;
      }
      
      // Stop scanner if already running
      if (fileScanReader.isScanning) {
        await fileScanReader.stop();
        setScannerActive(false);
      }

      const decodedText = await fileScanReader.scanFile(file, true);
      handleSuccessfulScan(decodedText);
    } catch (err) {
      console.error("File scan failed:", err);
      setScanError("এই ছবিতে কোনো সঠিক কিউআর কোড খুঁজে পাওয়া যায়নি। অনুগ্রহ করে পরিষ্কার কিউআর কোড সম্বলিত ছবি আপলোড করুন।");
    }
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const downloadQR = () => {
    // Find the svg element and download it as image/svg
    const svgElement = document.querySelector('.bg-slate-50 svg');
    if (!svgElement) return;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const blobURL = URL.createObjectURL(svgBlob);
    
    // Create temporary link to trigger download
    const dlLink = document.createElement('a');
    dlLink.href = blobURL;
    dlLink.download = "tahfizul-quran-qr.svg";
    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);
  };

  // Drag and drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      scanLocalFile(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 min-h-screen z-9999 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm transition-opacity">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full flex flex-col max-h-[90vh] border border-slate-100"
      >
        {/* Header */}
        <div className="bg-primary px-6 py-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <QrCode className="text-gold animate-pulse" size={24} />
            <div>
              <h2 className="font-bold text-lg md:text-xl">মাদরাসা কিউআর পোর্টাল</h2>
              <p className="text-[11px] opacity-80">তাহফিজুল কুরআন মডেল মাদ্রাসা</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-white/10 transition-colors text-white/90 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tab Toggle Navigation */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 gap-2">
          <button
            onClick={() => setActiveTab('view')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'view'
                ? 'bg-primary text-white shadow-md shadow-primary/10'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <QrCode size={18} />
            মাদরাসা কিউআর কোড
          </button>
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'scan'
                ? 'bg-primary text-white shadow-md shadow-primary/10'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Scan size={18} />
            কিউআর কোড স্ক্যানার
          </button>
        </div>

        {/* Modal Bodies */}
        <div className="p-6 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'view' ? (
              <motion.div
                key="view-tab"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center space-y-4"
              >
                <QRCodeBranded size={200} className="w-full my-1" />

                {/* Direct Action triggers */}
                <div className="grid grid-cols-2 gap-3 w-full max-w-sm mt-3">
                  <button 
                    onClick={() => copyToClipboard("https://tahfizulquranmodelmadrassa.xyz/")}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-sm"
                  >
                    {isCopied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                    {isCopied ? "লিংক কপিড!" : "লিংক কপি করুন"}
                  </button>
                  <button 
                    onClick={downloadQR}
                    className="py-2.5 px-4 bg-primary-dark/10 hover:bg-primary-dark/20 text-primary-dark font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Download size={16} />
                    ডাউনলোড করুন
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 text-center max-w-xs leading-relaxed">
                  এই কিউআর কোডটি ডাউনলোড করে প্রিন্ট বা বিতরণ করতে পারেন। এটি স্ক্যান করলে সরাসরি মাদরাসার ওয়েব পোর্টাল লোড হবে।
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="scan-tab"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col space-y-4"
              >
                {!scanResult ? (
                  <>
                    <h3 className="text-center font-bold text-slate-700 text-sm md:text-base">
                      আপনার ডিভাইস ক্যামেরা তাক করুন অথবা কিউআর ছবি আপলোড করুন
                    </h3>

                    {/* Camera view element */}
                    <div className="relative w-full overflow-hidden bg-slate-900 rounded-3xl aspect-square max-w-[280px] md:max-w-[320px] mx-auto border-4 border-slate-100 shadow-lg flex flex-col justify-center items-center">
                      <div id={qrcodeId} className="w-full h-full object-cover [&_video]:object-cover [&_video]:w-full [&_video]:h-full"></div>
                      
                      {/* Scanning crosshair overlay */}
                      {scannerActive && (
                        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-12">
                          <div className="flex justify-between">
                            <div className="w-8 h-8 border-t-4 border-l-4 border-gold rounded-tl"></div>
                            <div className="w-8 h-8 border-t-4 border-r-4 border-gold rounded-tr"></div>
                          </div>
                          {/* Animated laser scanning bar */}
                          <div className="w-full h-0.5 bg-gold/80 shadow-[0_0_8px_rgba(245,158,11,1)] animate-[bounce_2s_infinite]"></div>
                          <div className="flex justify-between">
                            <div className="w-8 h-8 border-b-4 border-l-4 border-gold rounded-bl"></div>
                            <div className="w-8 h-8 border-b-4 border-r-4 border-gold rounded-br"></div>
                          </div>
                        </div>
                      )}

                      {/* Not Running State */}
                      {!scannerActive && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                          <Camera size={44} className="mb-2 text-slate-500 animate-bounce" />
                          <p className="text-xs font-semibold">ক্যামেরা নিষ্ক্রিয় অবস্থায় আছে</p>
                          <button
                            onClick={startScanner}
                            className="mt-4 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-md cursor-pointer hover:bg-primary-dark transition-all"
                          >
                            পুনরায় স্ক্যান শুরু করুন
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Drag and Drop File Picker alternative */}
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                        isDragging 
                          ? 'border-gold bg-gold/5 text-gold' 
                          : 'border-slate-200 hover:border-primary/50 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <input 
                        type="file" 
                        id="qr-file-input" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileUpload}
                      />
                      <label htmlFor="qr-file-input" className="cursor-pointer flex flex-col items-center gap-1.5 w-full h-full">
                        <Upload size={24} className="text-primary" />
                        <span className="text-xs font-bold text-slate-700">ডিভাইস থেকে কিউআর ছবি আপলোড করুণ</span>
                        <span className="text-[10px] text-slate-400">অথবা ছবি ফাইলটি এখানে ড্র্যাগ করে ফেলে দিন</span>
                      </label>
                    </div>

                    {/* Messages */}
                    {scanError && (
                      <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex gap-2 text-amber-800 text-xs text-left max-w-sm mx-auto">
                        <AlertCircle size={18} className="shrink-0 text-amber-600 mt-0.5" />
                        <p className="font-semibold">{scanError}</p>
                      </div>
                    )}
                  </>
                ) : (
                  /* Success Scan View */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center py-6 text-center space-y-5"
                  >
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 animate-bounce">
                      <Scan size={32} />
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-bold text-slate-800">কিউআর কোড স্ক্যান সফল হয়েছে!</h4>
                      <p className="text-xs text-slate-500 mt-1">স্বয়ংক্রিয়ভাবে ওয়েব লিংকে প্রবেশ করা হচ্ছে...</p>
                    </div>

                    <div className="w-full max-w-sm p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                      <Link2 className="text-primary shrink-0" size={20} />
                      <p className="text-xs font-semibold text-slate-700 break-all select-all text-left">
                        {scanResult}
                      </p>
                    </div>

                    <div className="flex gap-2.5 w-full max-w-xs">
                      <button
                        onClick={() => copyToClipboard(scanResult)}
                        className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 text-xs"
                      >
                        {isCopied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                        {isCopied ? "কপি হয়েছে!" : "কপি করুন"}
                      </button>
                      
                      {isValidUrl(scanResult) && (
                        <a
                          href={scanResult}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 text-xs"
                        >
                          ওয়েবসাইটে ঢুকুন
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setScanResult(null);
                        setScanError(null);
                        startScanner();
                      }}
                      className="px-4 py-2 text-primary text-xs font-bold hover:underline"
                    >
                      আরেকটি কিউআর কোড স্ক্যান করুন
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
