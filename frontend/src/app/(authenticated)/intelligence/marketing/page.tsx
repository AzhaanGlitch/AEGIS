"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";

export default function MarketingPage() {
  const [marketingData, setMarketingData] = useState<any>({
    kpis: { totalSpend: "$45,000", mqls: "1,240", cpl: "$36.29", roi: "342%" },
    channels: [
      {"name": "Google Ads", "spend": "$18,000", "leads": 520, "roi": "290%"},
      {"name": "LinkedIn Ads", "spend": "$15,000", "leads": 390, "roi": "380%"},
      {"name": "SEO & Organic", "spend": "$7,000", "leads": 280, "roi": "510%"}
    ]
  });

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/dashboard/marketing")
      .then(res => res.json())
      .then(data => setMarketingData(data))
      .catch(() => {});
  }, []);

  return (
    <>
      <Header title="Marketing Campaigns & Analytics" />
      
      <div className="flex-1 p-8 relative z-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-panel p-5 rounded-xl">
            <div className="text-xs text-smoke uppercase font-semibold mb-1">Total Spend</div>
            <div className="text-xl font-bold">{marketingData.kpis.totalSpend}</div>
          </div>
          <div className="glass-panel p-5 rounded-xl">
            <div className="text-xs text-smoke uppercase font-semibold mb-1">MQLs Generated</div>
            <div className="text-xl font-bold">{marketingData.kpis.mqls}</div>
          </div>
          <div className="glass-panel p-5 rounded-xl">
            <div className="text-xs text-smoke uppercase font-semibold mb-1">Cost Per Lead</div>
            <div className="text-xl font-bold">{marketingData.kpis.cpl}</div>
          </div>
          <div className="glass-panel p-5 rounded-xl">
            <div className="text-xs text-smoke uppercase font-semibold mb-1">Average ROI</div>
            <div className="text-xl font-bold text-emerald-400">{marketingData.kpis.roi}</div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="font-bold text-base mb-4">Paid Ad Channel Breakdown</h3>
          <div className="space-y-4">
            {marketingData.channels.map((channel: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center p-4 bg-void/50 rounded-xl border border-slate-edge/50">
                <div>
                  <div className="font-bold text-sm">{channel.name}</div>
                  <div className="text-xs text-smoke mt-1">Spend: {channel.spend} | Leads: {channel.leads}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-smoke font-semibold uppercase">ROI</div>
                  <div className="text-sm font-extrabold text-emerald-400">{channel.roi}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
