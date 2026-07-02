"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import Header from "@/components/Header";
import { FileUp, CheckCircle } from "lucide-react";

export default function DocumentsPage() {
  const { documents, addDocument } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [uploadingState, setUploadingState] = useState<"idle" | "uploading" | "indexing" | "completed">("idle");
  const [indexingPct, setIndexingPct] = useState(0);
  const [indexingLogs, setIndexingLogs] = useState<string[]>([]);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles(droppedFiles);
      setUploadingState("indexing");
      setIndexingPct(10);
      setIndexingLogs(["Uploading to server..."]);
      addDocument(droppedFiles[0].name, `${(droppedFiles[0].size / 1024).toFixed(1)} KB`);

      const interval = setInterval(() => {
        setIndexingPct(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploadingState("completed");
            setIndexingLogs(logs => [...logs, "Indexing complete! Vectors pushed to Qdrant.", "Knowledge Graph updated."]);
            return 100;
          }
          const next = prev + 30;
          setIndexingLogs(logs => [...logs, `Generating chunks and parsing elements... ${next}%`]);
          return next;
        });
      }, 1000);
    }
  };

  return (
    <>
      <Header title="Company Knowledge Base Documents" />
      
      <div className="flex-1 p-8 relative z-10 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Document list */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-bold text-base mb-4">Ingested Document Library</h3>
            <div className="space-y-3">
              {documents.map((doc, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-void/50 rounded-xl border border-slate-edge/50">
                  <div>
                    <div className="font-bold text-sm">{doc.name}</div>
                    <div className="text-xs text-smoke mt-0.5">Size: {doc.size} | Status: <span className="text-emerald-400 font-semibold">{doc.status}</span></div>
                  </div>
                  <div className="text-xs text-smoke">
                    {doc.progress === 100 ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <span>{doc.progress}%</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ingest area */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-base mb-2">Ingest New File Source</h3>
              <p className="text-sm text-smoke mb-4">Drop PDFs, spreadsheets, or text files directly to run hybrid RAG processing.</p>
              
              <div
                onDragOver={e => e.preventDefault()}
                onDrop={handleFileDrop}
                className="border-2 border-dashed border-slate-edge rounded-xl p-8 text-center hover:border-electric-iris transition-colors cursor-pointer bg-charcoal/10"
              >
                <FileUp className="w-10 h-10 text-ash mx-auto mb-3" />
                <span className="text-xs text-ash">Drag and Drop files here</span>
              </div>

              {uploadingState !== "idle" && (
                <div className="mt-4 p-4 bg-void/50 rounded-lg border border-slate-edge/50">
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-electric-iris capitalize">{uploadingState}...</span>
                    <span>{indexingPct}%</span>
                  </div>
                  <div className="w-full bg-slate-edge/30 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-electric-iris h-full transition-all duration-300" style={{ width: `${indexingPct}%` }}></div>
                  </div>
                  <div className="mt-2 space-y-1">
                    {indexingLogs.slice(-2).map((log, index) => (
                      <div key={index} className="text-[10px] text-smoke">{log}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
