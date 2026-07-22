"use client";

import React, { useEffect, useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Image from "next/image";
import { 
  LayoutDashboard, 
  Layers, 
  Workflow, 
  Database, 
  History,
  FileText,
  HelpCircle,
  Settings, 
  LogOut,
  MessageSquare
} from "lucide-react";

// Communication context to map state directly down to page tabs
const NavigationStateContext = createContext({
  activeView: "Dashboard",
  setActiveView: (view: string) => {},
});

export const useNavigationState = () => useContext(NavigationStateContext);

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useApp();
  const router = useRouter();
  const [activeView, setActiveView] = useState("Dashboard");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-5 h-5 border border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  const menuItems = [
    { icon: LayoutDashboard, name: "Dashboard" },
    { icon: MessageSquare, name: "Workspace Chat" },
    { icon: Layers, name: "Agent Mesh" },
    { icon: Workflow, name: "Workflows" },
    { icon: Database, name: "Knowledge Base" },
    { icon: History, name: "Logs Trace" },
    { icon: FileText, name: "Documents" },
    { icon: Settings, name: "Settings" },
    { icon: HelpCircle, name: "Support" },
  ];

  return (
    <NavigationStateContext.Provider value={{ activeView, setActiveView }}>
      <div className="flex h-screen bg-black text-white overflow-hidden relative font-sans antialiased">
        
        {/* Subtle Top Linear Light Fall */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-[#5683da]/8 via-[#3ee7c4]/2 to-transparent blur-[110px] pointer-events-none z-0" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[320px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none z-0" />

        {/* Persistent Sidebar Frame - No text, labels appear solely on hover state */}
        <aside className="w-[68px] h-full bg-[#070708]/40 border-r border-white/[0.04] flex flex-col items-center py-6 justify-between relative z-20 backdrop-blur-xl shrink-0">
          
          {/* Logo Only Header Branding Area */}
          <div className="mb-8 cursor-pointer opacity-90 hover:opacity-100 transition-opacity" onClick={() => setActiveView("Dashboard")}>
            <Image
              src="/aegis_logo_without_bg.png"
              alt="AEGIS"
              width={24}
              height={24}
              priority
            />
          </div>

          {/* Icon Mapping Loop with state dispatch mechanics */}
          <nav className="flex-1 flex flex-col gap-3 w-full px-2 mt-2">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeView === item.name;
              
              return (
                <div
                  key={item.name}
                  className="relative flex items-center justify-center"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <button
                    onClick={() => setActiveView(item.name)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-150 cursor-pointer ${
                      isActive 
                        ? "bg-white/[0.07] text-white border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.03)]" 
                        : "text-slate-500 hover:text-white hover:bg-white/[0.02]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>

                  {hoveredIdx === idx && (
                    <div className="absolute left-[56px] px-2.5 py-1.5 bg-[#0a0a0c] border border-white/10 rounded-md text-[9px] font-mono uppercase tracking-widest text-white shadow-2xl whitespace-nowrap z-50 pointer-events-none">
                      {item.name}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Session Sign Out Element */}
          <div 
            className="relative flex items-center justify-center w-full px-2"
            onMouseEnter={() => setHoveredIdx(99)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <button
              onClick={() => logout()}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 hover:text-rose-400 hover:bg-rose-500/5 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
            {hoveredIdx === 99 && (
              <div className="absolute left-[56px] px-2.5 py-1.5 bg-[#0a0a0c] border border-white/10 rounded-md text-[9px] font-mono uppercase tracking-widest text-rose-400 shadow-2xl whitespace-nowrap z-50 pointer-events-none">
                Terminate
              </div>
            )}
          </div>
        </aside>

        {/* Application Core Main Workspace Viewport */}
        <div className="flex-1 flex flex-col relative overflow-hidden h-full z-10">
          <header className="h-[64px] w-full border-b border-white/[0.02] flex items-center justify-between px-8 relative z-10 shrink-0">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-600">AEGIS // Security Matrix Operational</span>
            </div>
            {/* Top Right completely blank as instructed */}
            <div />
          </header>

          <main className="flex-1 overflow-y-auto relative bg-[#040405]/20">
            {children}
          </main>
        </div>
      </div>
    </NavigationStateContext.Provider>
  );
}