"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function CustomersPage() {
  const router = useRouter();
  const [supportData, setSupportData] = useState<any>({
    ticketStats: { open: 18, critical: 3, avgResolution: "1.8 hrs" },
    tickets: [
      {"id": "T101", "subject": "Billing issue with invoice INV-882", "priority": "High", "customer": "Stellar Systems", "suggestedAction": "Refund the duplicate payment processing fee."},
      {"id": "T102", "subject": "API Timeout on /search endpoint", "priority": "Critical", "customer": "Apex Logistics", "suggestedAction": "Check Qdrant collection performance; retry connection."}
    ]
  });

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/dashboard/support")
      .then(res => res.json())
      .then(data => setSupportData(data))
      .catch(() => {});
  }, []);

  return (
    <>
      <Header title="Customer Support Intelligence" />
      
      <div className="flex-1 p-8 relative z-10 space-y-6">
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="font-bold text-base mb-4">Open Support Tickets</h3>
          <div className="space-y-4">
            {supportData.tickets.map((ticket: any, idx: number) => (
              <div key={idx} className="p-4 bg-void/50 rounded-xl border border-slate-edge/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-electric-iris font-bold">{ticket.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      ticket.priority === "Critical" ? "bg-rose-500/25 text-rose-400 border border-rose-500/30" : "bg-amber-500/25 text-amber-400"
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm mt-1">{ticket.subject}</h4>
                  <p className="text-xs text-smoke">Customer: {ticket.customer}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      router.push(`/chat?query=Draft+resolution+for+support+ticket+${ticket.id}`);
                    }}
                    className="px-3 py-1.5 bg-electric-iris/20 text-electric-iris text-xs font-semibold rounded-full border border-electric-iris/30 hover:bg-opacity-90 transition-all cursor-pointer"
                  >
                    Draft Resolution
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
