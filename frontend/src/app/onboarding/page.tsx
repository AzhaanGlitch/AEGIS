"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { FileUp, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function OnboardingPage() {
  const router = useRouter();
  const { addDocument } = useApp();
  const [step, setStep] = useState(1);
  const [orgName, setOrgName] = useState("");
  const [industry, setIndustry] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const startIngestion = () => {
    if (files.length === 0) return;
    setIsUploading(true);
    setProgress(10);
    
    addDocument(files[0].name, `${(files[0].size / 1024).toFixed(1)} KB`);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setStep(3);
          return 100;
        }
        return prev + 30;
      });
    }, 800);
  };

  const handleBackNavigation = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-black overflow-hidden">
      
      <div className="relative w-full max-w-md mx-4">
        {/* Glow effect behind the card matching the sign-in page perfectly */}
        <div 
          className="absolute inset-0 -m-1 bg-gradient-to-r from-[#5683da] via-[#ff8964] to-[#3ee7c4] rounded-3xl opacity-20 blur-xl animate-pulse pointer-events-none" 
          style={{ animationDuration: "4s" }}
        />
        
        {/* Onboarding Card Matching UI Styling */}
        <div className="relative z-10 w-full bg-black/90 border border-white/10 rounded-2xl px-10 py-14 shadow-2xl backdrop-blur-md">
          
          {/* Back Button matching the exact location, typography, and hover translation */}
          <button
            type="button"
            onClick={handleBackNavigation}
            className="absolute top-5 left-5 flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition cursor-pointer font-mono uppercase tracking-wider group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back
          </button>

          {/* Core Branding and Headers copied directly from Sign In setup */}
          <div className="flex flex-col items-center mb-10 mt-2">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex items-center gap-3 mb-8 cursor-pointer hover:opacity-85 transition"
            >
              <Image
                src="/aegis_logo_without_bg.png"
                alt="AEGIS Logo"
                width={36}
                height={36}
                priority
              />
              <span className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-white">
                AEGIIS
              </span>
            </button>
            <h2 className="text-2xl font-bold text-center text-white tracking-tight font-sans">
              {step === 1 && "Configure Enterprise"}
              {step === 2 && "Ingest Knowledge"}
              {step === 3 && "System Online"}
            </h2>
          </div>

          {/* Step 1: Profile information */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2.5 font-mono">
                  Organization Name
                </label>
                <input
                  type="text"
                  placeholder="Acme Enterprise Corp"
                  className="w-full px-4 py-3.5 bg-black/50 border border-white/10 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-white/20 transition text-sm font-sans"
                  value={orgName}
                  onChange={e => setOrgName(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2.5 font-mono">
                  Industry Sector
                </label>
                <input
                  type="text"
                  placeholder="Logistics, SaaS, Finance"
                  className="w-full px-4 py-3.5 bg-black/50 border border-white/10 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-white/20 transition text-sm font-sans"
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!orgName || !industry}
                className="w-full mt-10 py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-102 duration-300 font-sans text-xs uppercase tracking-wider"
              >
                Continue to Ingestion <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: RAG Ingestion upload */}
          {step === 2 && (
            <div className="space-y-6">
              <div
                onDragOver={e => e.preventDefault()}
                onDrop={handleFileDrop}
                className="border border-dashed border-white/10 rounded-xl p-8 text-center hover:border-white/20 transition cursor-pointer bg-black/40"
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload" className="cursor-pointer block">
                  <FileUp className="w-8 h-8 text-slate-500 mx-auto mb-3" />
                  <span className="text-xs font-mono tracking-wide text-slate-400 block">
                    Drag files here or click to browse
                  </span>
                </label>
              </div>

              {files.length > 0 && (
                <div className="p-3.5 bg-black/30 rounded-lg border border-white/5 flex justify-between items-center text-xs font-mono text-slate-300">
                  <span className="truncate pr-2">{files[0].name}</span>
                  <span className="text-slate-500 shrink-0">{(files[0].size / 1024).toFixed(1)} KB</span>
                </div>
              )}

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Indexing vector segments...</span>
                    <span className="text-white">{progress}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-[3px] rounded-full overflow-hidden">
                    <div className="bg-white h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              )}

              <button
                onClick={startIngestion}
                disabled={files.length === 0 || isUploading}
                className="w-full mt-10 py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-102 duration-300 font-sans text-xs uppercase tracking-wider"
              >
                {isUploading ? "Processing..." : "Start Ingestion"} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 3: Deployment Completed */}
          {step === 3 && (
            <div className="space-y-6 text-center font-sans">
              <CheckCircle className="w-12 h-12 text-[#3ee7c4] mx-auto mb-2 animate-pulse" />
              <p className="text-sm leading-relaxed text-slate-400 font-normal">
                All localized datasets vectorized, custom workflow engines populated, and node portal addresses established securely.
              </p>

              <button
                onClick={() => router.push("/dashboard")}
                className="w-full mt-10 py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-102 duration-300 font-sans text-xs uppercase tracking-wider"
              >
                Enter OS Control Plane <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}