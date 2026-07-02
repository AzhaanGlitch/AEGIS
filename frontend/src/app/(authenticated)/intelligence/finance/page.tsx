"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { AlertTriangle } from "lucide-react";

export default function FinancePage() {
  const router = useRouter();
  const [financeData, setFinanceData] = useState<any>({
    cashFlow: { cashIn: "$320,000", cashOut: "$210,000", netBurn: "-$110,000 (Positive)" },
    anomalies: [
      {"id": "A1", "date": "June 28, 2026", "desc": "Unusual LinkedIn Ads charge ($12,500 vs average $4,200)", "severity": "High", "actionRequired": true}
    ]
  });

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/dashboard/finance")
      .then(res => res.json())
      .then(data => setFinanceData(data))
      .catch(() => {});
  }, []);

  return (
    <>
      <Header title="Financial Ledger & Forecasts" />
      
      <div className="flex-1 p-8 relative z-10 space-y-6">
        
        {/* Ledger info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl">
            <div className="text-xs text-smoke uppercase font-semibold mb-1">Cash Inflows</div>
            <div className="text-2xl font-bold">{financeData.cashFlow.cashIn}</div>
          </div>
          <div className="glass-panel p-6 rounded-2xl">
            <div className="text-xs text-smoke uppercase font-semibold mb-1">Cash Outflows</div>
            <div className="text-2xl font-bold">{financeData.cashFlow.cashOut}</div>
          </div>
          <div className="glass-panel p-6 rounded-2xl">
            <div className="text-xs text-smoke uppercase font-semibold mb-1">Net Cash Position</div>
            <div className="text-2xl font-bold text-emerald-400">{financeData.cashFlow.netBurn}</div>
          </div>
        </div>

        {/* Anomaly Detection */}
        <div className="glass-panel p-6 rounded-2xl border-l-4 border-ember-pulse">
          <h3 className="font-bold text-base text-ember-pulse mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> AI Transaction Anomaly Detection
          </h3>
          {financeData.anomalies.map((anom: any, idx: number) => (
            <div key={idx} className="text-sm">
              <p className="text-white font-medium">{anom.desc}</p>
              <p className="text-xs text-smoke mt-1">Severity: <span className="text-amber-400 font-bold">{anom.severity}</span> | Logged: {anom.date}</p>
              
              <button
                onClick={() => {
                  router.push(`/chat?query=Analyze+financial+anomaly+${anom.id}`);
                }}
                className="mt-3 px-3 py-1.5 bg-ember-pulse text-white text-xs font-semibold rounded-full hover:bg-opacity-90 transition-all cursor-pointer"
              >
                Investigate with Finance Agent
              </button>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
