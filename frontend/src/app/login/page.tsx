"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp, Role } from "@/context/AppContext";
import { Brain, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen w-full flex items-center justify-center relative bg-void overflow-hidden">
      {/* Background aurora beams */}
      <div className="absolute top-[-20%] left-[20%] w-[500px] h-[600px] aurora-beam rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[500px] aurora-beam rounded-full opacity-10"></div>
      
      <div className="w-full max-w-md p-8 glass-panel rounded-3xl shadow-xl relative z-10 mx-4">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-electric-iris/12 rounded-2xl border border-electric-iris/30">
            <Brain className="w-8 h-8 text-electric-iris" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-1 text-white">AEGIS OS</h2>
        <p className="text-sm text-ash text-center mb-8">Autonomous Enterprise Growth Intelligence System</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ash uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              placeholder="founder@acme.com or sales@acme.com"
              className="w-full px-4 py-3 bg-charcoal border border-slate-edge rounded-lg text-white placeholder-smoke focus:outline-none focus:border-electric-iris transition-colors text-sm"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ash uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-charcoal border border-slate-edge rounded-lg text-white placeholder-smoke focus:outline-none focus:border-electric-iris transition-colors text-sm"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full mt-6 py-3 bg-electric-iris text-white font-medium rounded-full hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            Sign In to Organization <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        
        <div className="mt-8 text-center text-xs text-smoke">
          Demo quick logins: <code className="text-ember-pulse">founder@acme.com</code>, <code className="text-ember-pulse">sales@acme.com</code>, <code className="text-ember-pulse">finance@acme.com</code>
        </div>
      </div>
    </div>
  );
}
