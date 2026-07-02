"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Sparkles } from "lucide-react";

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([
    {"id": "L1", "name": "Apex Logistics Corp", "score": 92, "status": "Hot", "value": "$120,000"},
    {"id": "L2", "name": "Stellar Systems LLC", "score": 85, "status": "Warm", "value": "$75,000"},
    {"id": "L3", "name": "Omni Global Group", "score": 79, "status": "Warm", "value": "$95,000"},
    {"id": "L4", "name": "Pinnacle Tech", "score": 45, "status": "Cold", "value": "$50,000"}
  ]);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/dashboard/sales")
      .then(res => res.json())
      .then(data => {
        if (data.leads) setLeads(data.leads);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Header title="AI Lead Ingestion & Scoring" />
      
      <div className="flex-1 p-8 relative z-10">
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Active HubSpot / Salesforce Leads</h3>
            <button className="px-4 py-2 bg-electric-iris text-white font-medium rounded-full text-xs hover:bg-opacity-90 transition-all flex items-center gap-2 cursor-pointer shadow-md">
              Sync HubSpot CRM <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-edge text-xs font-semibold uppercase tracking-wider text-smoke">
                  <th className="py-3 px-4">Lead Name</th>
                  <th className="py-3 px-4">AI Score</th>
                  <th className="py-3 px-4">Deal Status</th>
                  <th className="py-3 px-4">Estimated Value</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-edge/50 text-sm">
                {leads.map((lead: any, i: number) => (
                  <tr key={i} className="hover:bg-charcoal/30">
                    <td className="py-4 px-4 font-medium text-white">{lead.name}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        lead.score >= 80 ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"
                      }`}>
                        {lead.score} / 100
                      </span>
                    </td>
                    <td className="py-4 px-4">{lead.status}</td>
                    <td className="py-4 px-4 text-emerald-400 font-semibold">{lead.value}</td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => {
                          // Redirect to chat with prefilled input
                          router.push(`/chat?query=Draft+outreach+for+${encodeURIComponent(lead.name)}`);
                        }}
                        className="text-xs text-electric-iris hover:underline font-medium cursor-pointer"
                      >
                        Draft Outreach
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
