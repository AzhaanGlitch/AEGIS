"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp, Role } from "@/context/AppContext";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  TrendingUp,
  Sliders,
  ShieldCheck,
  Database,
  Workflow,
  Brain,
  History,
  Settings,
  Layers,
  Wrench,
  Search
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout, currentRole, setCurrentRole } = useApp();

  const hasAccess = (section: string) => {
    const accessMatrix: Record<string, string[]> = {
      dashboard: ["Founder", "Sales Mgr", "Marketing Mgr", "HR", "Finance", "Support", "Admin"],
      chat: ["Founder", "Sales Mgr", "Marketing Mgr", "HR", "Finance", "Support", "Admin"],
      leads: ["Founder", "Sales Mgr", "Marketing Mgr", "Admin"],
      crm: ["Founder", "Sales Mgr", "Admin"],
      marketing: ["Founder", "Marketing Mgr", "Admin"],
      finance: ["Founder", "Finance", "Admin"],
      customers: ["Founder", "Support", "Admin"],
      knowledge: ["Founder", "Sales Mgr", "Marketing Mgr", "HR", "Finance", "Support", "Admin"],
      workflows: ["Founder", "Sales Mgr", "Marketing Mgr", "HR", "Finance", "Admin"],
      admin: ["Founder", "Admin"]
    };
    return accessMatrix[section]?.includes(currentRole) ?? false;
  };

  const linkClass = (path: string) => {
    const isActive = pathname === path || pathname.startsWith(path + "/");
    return `w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
      isActive ? "bg-electric-iris/15 text-white border-l-2 border-electric-iris" : "text-ash hover:bg-void hover:text-white"
    }`;
  };

  return (
    <aside className="w-64 bg-charcoal border-r border-slate-edge flex flex-col justify-between z-20 shrink-0 h-screen">
      <div className="overflow-y-auto flex-1">
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-edge flex items-center gap-3">
          <Brain className="w-6 h-6 text-electric-iris animate-pulse" />
          <span className="font-bold text-lg tracking-tight">AEGIS OS</span>
        </div>

        {/* Profile / Switcher */}
        <div className="px-4 py-4 border-b border-slate-edge">
          <div className="text-xs text-smoke uppercase tracking-wider font-semibold mb-1">Active Profile</div>
          <div className="text-sm font-semibold truncate">{user?.organization || "Acme Enterprise"}</div>
          
          <select
            value={currentRole}
            onChange={e => setCurrentRole(e.target.value as Role)}
            className="mt-2 w-full px-2 py-1.5 bg-void border border-slate-edge rounded text-xs text-ash focus:outline-none focus:border-electric-iris"
          >
            <option value="Founder">Founder (Full Access)</option>
            <option value="Sales Mgr">Sales Manager</option>
            <option value="Marketing Mgr">Marketing Manager</option>
            <option value="HR">HR Specialist</option>
            <option value="Finance">Finance Analyst</option>
            <option value="Support">Customer Support</option>
            <option value="Admin">Administrator</option>
          </select>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1.5">
          <Link href="/dashboard" className={linkClass("/dashboard")}>
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>

          <Link href="/chat" className={linkClass("/chat")}>
            <MessageSquare className="w-4 h-4" /> AI Workspace
          </Link>

          <div className="pt-4 pb-1 px-3 text-[10px] uppercase font-bold tracking-wider text-smoke">Intelligence Hub</div>
          
          {hasAccess("leads") && (
            <Link href="/intelligence/leads" className={linkClass("/intelligence/leads")}>
              <Users className="w-4 h-4" /> Leads & Pipeline
            </Link>
          )}

          {hasAccess("marketing") && (
            <Link href="/intelligence/marketing" className={linkClass("/intelligence/marketing")}>
              <TrendingUp className="w-4 h-4" /> Campaigns
            </Link>
          )}

          {hasAccess("finance") && (
            <Link href="/intelligence/finance" className={linkClass("/intelligence/finance")}>
              <Sliders className="w-4 h-4" /> Financials
            </Link>
          )}

          {hasAccess("customers") && (
            <Link href="/intelligence/customers" className={linkClass("/intelligence/customers")}>
              <ShieldCheck className="w-4 h-4" /> Tickets
            </Link>
          )}

          <div className="pt-4 pb-1 px-3 text-[10px] uppercase font-bold tracking-wider text-smoke">Knowledge Base</div>

          <Link href="/knowledge/documents" className={linkClass("/knowledge/documents")}>
            <Database className="w-4 h-4" /> Documents Library
          </Link>

          <Link href="/knowledge/graph" className={linkClass("/knowledge/graph")}>
            <Search className="w-4 h-4" /> Graph Explorer
          </Link>

          {hasAccess("workflows") && (
            <Link href="/workflows" className={linkClass("/workflows")}>
              <Workflow className="w-4 h-4" /> Workflow Builder
            </Link>
          )}
        </nav>
      </div>

      {/* User Info / Logout */}
      <div className="p-4 border-t border-slate-edge flex items-center justify-between">
        <div className="truncate pr-2">
          <div className="text-xs text-ash truncate">{user?.email || "guest@acme.com"}</div>
          <div className="text-[10px] text-smoke font-semibold">{currentRole}</div>
        </div>
        <button
          onClick={logout}
          className="text-xs text-ember-pulse hover:underline cursor-pointer font-medium"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
