"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp, Role } from "@/context/AppContext";
import { Brain, ArrowRight, ArrowLeft } from "lucide-react";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Image from "next/image";

const firebaseConfig = {
  apiKey: "AIzaSyCEm7CuKNn5n3vGSW9t6Qs8342ORDpc8ts",
  authDomain: "aegis-ce95a.firebaseapp.com",
  projectId: "aegis-ce95a",
  storageBucket: "aegis-ce95a.firebasestorage.app",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export default function LoginPage() {
  const { user, login } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const endpoint = isSignUp ? "/api/v1/auth/register" : "/api/v1/auth/login";
    const payload = isSignUp
      ? { email, password, organization: orgName || "Acme Enterprise Corp" }
      : { email, password };

    try {
      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Authentication request failed.");
      }

      if (isSignUp) {
        alert("Registration request sent! " + (data.message || "Please check your inbox."));
        setIsSignUp(false);
      } else {
        const emailLower = email.toLowerCase();
        let chosenRole: Role = "Founder";
        if (emailLower.includes("sales")) chosenRole = "Sales Mgr";
        else if (emailLower.includes("marketing")) chosenRole = "Marketing Mgr";
        else if (emailLower.includes("hr")) chosenRole = "HR";
        else if (emailLower.includes("finance")) chosenRole = "Finance";
        else if (emailLower.includes("support")) chosenRole = "Support";
        else if (emailLower.includes("admin")) chosenRole = "Admin";

        login(email, chosenRole);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Connection failed. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const userEmail = result.user.email || "google-user@acme.com";
      const userName = result.user.displayName || userEmail.split("@")[0];
      
      // Record this user in Neon PostgreSQL Database
      await fetch("http://localhost:8000/api/v1/auth/record-google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail })
      }).catch(e => console.log("Failed to sync Google user to Neon DB", e));

      login(userEmail, "Founder", userName);
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message || "Google OAuth failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-black overflow-hidden">
      <div className="relative w-full max-w-md mx-4">
        {/* Glow effect behind the card */}
        <div 
          className="absolute inset-0 -m-1 bg-gradient-to-r from-[#5683da] via-[#ff8964] to-[#3ee7c4] rounded-3xl opacity-20 blur-xl animate-pulse pointer-events-none" 
          style={{ animationDuration: "4s" }}
        />
        
        {/* Login Card */}
        <div className="relative z-10 w-full bg-black/90 border border-white/10 rounded-2xl px-10 py-12 shadow-2xl backdrop-blur-md">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="absolute top-5 left-5 flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition cursor-pointer font-mono uppercase tracking-wider group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back
          </button>

          <div className="flex flex-col items-center mb-6 mt-2">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex items-center gap-3 mb-6 cursor-pointer hover:opacity-85 transition"
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
              {isSignUp ? "Create Enterprise Node" : "Sign In to OS"}
            </h2>
            <p className="text-xs text-slate-500 text-center mt-2 uppercase tracking-widest font-mono">
              AEGIS / Autonomous Node Portal
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg font-mono text-center">
              {errorMsg}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2 font-mono">
                  Organization Name
                </label>
                <input
                  type="text"
                  placeholder="Acme Enterprise Corp"
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-electric-iris focus:ring-1 focus:ring-electric-iris transition text-sm font-sans"
                  value={orgName}
                  onChange={e => setOrgName(e.target.value)}
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2 font-mono">
                Email Address
              </label>
              <input
                type="email"
                placeholder="founder@acme.com or sales@acme.com"
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-electric-iris focus:ring-1 focus:ring-electric-iris transition text-sm font-sans"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2 font-mono">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-electric-iris focus:ring-1 focus:ring-electric-iris transition text-sm font-sans"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 bg-white text-black font-bold rounded-full hover:bg-white/90 disabled:opacity-50 transition flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-102 duration-300 font-sans text-xs uppercase tracking-wider"
            >
              {loading ? "Authorizing..." : (isSignUp ? "Register Node" : "Sign In to Organization")} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Social login divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <span className="relative z-10 px-3 bg-black/90 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              Or Connect Via
            </span>
          </div>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full py-3 bg-black border border-white/10 rounded-full hover:bg-white/5 transition flex items-center justify-center gap-2 cursor-pointer text-xs font-mono uppercase tracking-wider text-white"
          >
            <svg className="w-4 h-4 mr-1 text-white fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.51 0-6.377-2.87-6.377-6.38 0-3.51 2.87-6.378 6.377-6.378 1.45 0 2.84.49 3.96 1.38l3.12-3.12C18.82 1.912 15.66 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.47 0 10.74-4.54 10.74-10.91 0-.67-.06-1.3-.17-1.92H12.24z"/>
            </svg>
            Continue with Google
          </button>

          <div className="mt-8 pt-4 border-t border-white/5 text-center text-xs">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-electric-iris hover:underline cursor-pointer font-sans"
            >
              {isSignUp ? "Already have an account? Sign In" : "Need a new node? Create account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}