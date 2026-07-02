"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Bell } from "lucide-react";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { currentRole } = useApp();

  return (
    <header className="h-16 border-b border-slate-edge px-8 flex items-center justify-between bg-charcoal/40 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold capitalize">{title}</h1>
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-electric-iris/10 text-electric-iris border border-electric-iris/20 uppercase">
          {currentRole} Access
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Bell className="w-5 h-5 text-ash hover:text-white cursor-pointer" />
        <div className="h-4 w-px bg-slate-edge"></div>
        <span className="text-xs text-smoke font-medium">Acme Admin Portal</span>
      </div>
    </header>
  );
}
