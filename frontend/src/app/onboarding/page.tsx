"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Brain, FileUp, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";

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
    
    // Add to doc base context
    addDocument(files[0].name, `${(files[0].size / 1024).toFixed(1)} KB`);

    // Simulate RAG indexing
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

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-void overflow-hidden">
      <div className="absolute top-[-20%] left-[20%] w-[500px] h-[600px] aurora-beam rounded-full"></div>
      
      <div className="w-full max-w-lg p-8 glass-panel rounded-3xl shadow-xl relative z-10 mx-4">
        
        {/* Wizard Headers */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-edge/50 pb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-electric-iris" />
            <span className="font-bold text-sm text-white">AEGIS Setup Wizard</span>
          </div>
          <div className="text-xs text-smoke font-medium">Step {step} of 3</div>
        </div>

        {/* Step 1: Profile info */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Configure Your Enterprise</h3>
            <p className="text-xs text-smoke">Enter your organization details to build your business digital twin.</p>
            
            <div>
              <label className="block text-xs font-semibold text-ash uppercase tracking-wider mb-2">Organization Name</label>
              <input
                type="text"
                placeholder="Acme Enterprise Corp"
                className="w-full px-4 py-3 bg-charcoal border border-slate-edge rounded-lg text-white text-sm focus:outline-none focus:border-electric-iris"
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-ash uppercase tracking-wider mb-2">Industry Sector</label>
              <input
                type="text"
                placeholder="Logistics, SaaS, Finance"
                className="w-full px-4 py-3 bg-charcoal border border-slate-edge rounded-lg text-white text-sm focus:outline-none focus:border-electric-iris"
                value={industry}
                onChange={e => setIndustry(e.target.value)}
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!orgName || !industry}
              className="w-full mt-6 py-3 bg-electric-iris disabled:opacity-50 text-white font-medium rounded-full hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md text-sm"
            >
              Continue to Data Ingestion <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: RAG Ingestion upload */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Upload Knowledge Source Documents</h3>
            <p className="text-xs text-smoke">Drag & drop company specs, policy sheets, or CRM files to initialize hybrid vector search.</p>

            <div
              onDragOver={e => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-slate-edge rounded-xl p-8 text-center hover:border-electric-iris transition-colors cursor-pointer bg-charcoal/20"
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <FileUp className="w-10 h-10 text-ash mx-auto mb-3" />
                <span className="text-xs text-ash block">Drag and drop files here, or click to browse</span>
              </label>
            </div>

            {files.length > 0 && (
              <div className="p-3 bg-void/50 rounded-lg border border-slate-edge/50 flex justify-between items-center text-xs">
                <span className="truncate pr-2 font-medium">{files[0].name}</span>
                <span className="text-smoke">{(files[0].size / 1024).toFixed(1)} KB</span>
              </div>
            )}

            {isUploading && (
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-electric-iris font-medium">Indexing embeddings...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-edge/30 h-1 rounded-full overflow-hidden">
                  <div className="bg-electric-iris h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 bg-charcoal border border-slate-edge text-white font-medium rounded-full hover:bg-void transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={startIngestion}
                disabled={files.length === 0 || isUploading}
                className="flex-1 py-3 bg-electric-iris disabled:opacity-50 text-white font-medium rounded-full hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md text-sm"
              >
                Start Ingestion <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Finished */}
        {step === 3 && (
          <div className="space-y-4 text-center">
            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4 animate-bounce" />
            <h3 className="text-lg font-bold text-white">System Ready</h3>
            <p className="text-xs text-smoke">All vector segments indexed, agent models connected, and dashboard metrics synthesized.</p>

            <button
              onClick={() => router.push("/dashboard")}
              className="w-full mt-6 py-3 bg-electric-iris text-white font-medium rounded-full hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md text-sm"
            >
              Enter AEGIS Workspace <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
