"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp, Role } from "@/context/AppContext";
import { Brain, ArrowRight, ArrowLeft } from "lucide-react";

import Image from "next/image";

export default function LoginPage() {
  const { user, login } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailLower = email.toLowerCase();
    let chosenRole: Role = "Founder";
    
    if (emailLower.includes("sales")) chosenRole = "Sales Mgr";
    else if (emailLower.includes("marketing")) chosenRole = "Marketing Mgr";
    else if (emailLower.includes("hr")) chosenRole = "HR";
    else if (emailLower.includes("finance")) chosenRole = "Finance";
    else if (emailLower.includes("support")) chosenRole = "Support";
    else if (emailLower.includes("admin")) chosenRole = "Admin";

    login(email || "founder@acme.com", chosenRole);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-black overflow-hidden">
      
      <div className="relative w-full max-w-md mx-4">
        {/* Glow effect behind the card - slowed down with custom duration */}
        <div 
          className="absolute inset-0 -m-1 bg-gradient-to-r from-[#5683da] via-[#ff8964] to-[#3ee7c4] rounded-3xl opacity-20 blur-xl animate-pulse pointer-events-none" 
          style={{ animationDuration: "4s" }}
        />
        
        {/* Login Card */}
        <div className="relative z-10 w-full bg-[#0c0c0e]/95 border border-white/10 rounded-2xl px-10 py-14 shadow-2xl backdrop-blur-md">
          
          {/* Back Button inside the card */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="absolute top-5 left-5 flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition cursor-pointer font-mono uppercase tracking-wider group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back
          </button>

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
              Sign In to OS
            </h2>
            <p className="text-xs text-slate-500 text-center mt-3 uppercase tracking-widest font-mono">
              AEGIS / Autonomous Node Portal
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2.5 font-mono">
                Email Address
              </label>
              <input
                type="email"
                placeholder="founder@acme.com or sales@acme.com"
                className="w-full px-4 py-3.5 bg-black/50 border border-white/10 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-electric-iris focus:ring-1 focus:ring-electric-iris transition text-sm font-sans"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2.5 font-mono">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3.5 bg-black/50 border border-white/10 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-electric-iris focus:ring-1 focus:ring-electric-iris transition text-sm font-sans"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full mt-10 py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-102 duration-300 font-sans text-xs uppercase tracking-wider"
            >
              Sign In to Organization <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          
          <div className="mt-10 pt-6 border-t border-white/5 text-center text-[11px] text-slate-500 leading-relaxed font-sans">
            Demo quick logins: <code className="text-amber-400 font-mono">founder@acme.com</code>, <code className="text-amber-400 font-mono">sales@acme.com</code>, <code className="text-amber-400 font-mono">finance@acme.com</code>
          </div>
        </div>
      </div>
    </div>
  );
}