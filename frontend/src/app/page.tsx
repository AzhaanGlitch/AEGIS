"use client";

import React, { CSSProperties, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  Command,
  Database,
  FileText,
  Filter,
  Layers,
  Lock,
  UploadCloud,
  Workflow,
} from "lucide-react";
import gsap from "gsap";
import * as THREE from "three";

// ==========================================
// INTERACTIVE NEBULA SHADER COMPONENT
// ==========================================
export interface InteractiveNebulaShaderProps {
  hasActiveReminders?: boolean;
  hasUpcomingReminders?: boolean;
  disableCenterDimming?: boolean;
  className?: string;
}

function InteractiveNebulaShader({
  hasActiveReminders = false,
  hasUpcomingReminders = false,
  disableCenterDimming = false,
  className = "",
}: InteractiveNebulaShaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const materialRef  = useRef<THREE.ShaderMaterial>();

  useEffect(() => {
    const mat = materialRef.current;
    if (mat) {
      mat.uniforms.hasActiveReminders.value   = hasActiveReminders;
      mat.uniforms.hasUpcomingReminders.value = hasUpcomingReminders;
      mat.uniforms.disableCenterDimming.value = disableCenterDimming;
    }
  }, [hasActiveReminders, hasUpcomingReminders, disableCenterDimming]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Capped at 2 for performance
    container.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const clock  = new THREE.Clock();

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform vec2 iMouse;
      uniform bool hasActiveReminders;
      uniform bool hasUpcomingReminders;
      uniform bool disableCenterDimming;
      varying vec2 vUv;

      #define t iTime
      mat2 m(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
      float map(vec3 p){
        p.xz *= m(t*0.4);
        p.xy *= m(t*0.3);
        vec3 q = p*2. + t;
        return length(p + vec3(sin(t*0.7))) * log(length(p)+1.0)
             + sin(q.x + sin(q.z + sin(q.y))) * 0.5 - 1.0;
      }

      void mainImage(out vec4 O, in vec2 fragCoord) {
        vec2 uv = fragCoord / min(iResolution.x, iResolution.y) - vec2(.9, .5);
        uv.x += .4;
        vec3 col = vec3(0.0);
        float d = 2.5;

        for (int i = 0; i <= 5; i++) {
          vec3 p = vec3(0,0,5.) + normalize(vec3(uv, -1.)) * d;
          float rz = map(p);
          float f  = clamp((rz - map(p + 0.1)) * 0.5, -0.1, 1.0);

          vec3 base = hasActiveReminders
            ? vec3(0.05, 0.05, 0.05) + vec3(3.0, 3.0, 3.0) * f 
            : hasUpcomingReminders
            ? vec3(0.03, 0.03, 0.03) + vec3(1.5, 1.5, 1.5) * f 
            : vec3(0.01, 0.01, 0.01) + vec3(0.8, 0.8, 0.8) * f;

          col = col * base + smoothstep(2.5, 0.0, rz) * 0.7 * base;
          d += min(rz, 1.0);
        }

        float dist   = distance(fragCoord, iResolution*0.5);
        float radius = min(iResolution.x, iResolution.y) * 0.5;
        float dim    = disableCenterDimming
                     ? 1.0
                     : smoothstep(radius*0.3, radius*0.5, dist);

        O = vec4(col, 1.0);
        if (!disableCenterDimming) {
          O.rgb = mix(O.rgb * 0.3, O.rgb, dim);
        }
      }

      void main() {
        mainImage(gl_FragColor, vUv * iResolution);
      }
    `;

    const uniforms = {
      iTime:                { value: 0 },
      iResolution:          { value: new THREE.Vector2() },
      iMouse:               { value: new THREE.Vector2() },
      hasActiveReminders:   { value: hasActiveReminders },
      hasUpcomingReminders: { value: hasUpcomingReminders },
      disableCenterDimming: { value: disableCenterDimming },
    };

    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
    materialRef.current = material;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.iResolution.value.set(w, h);
    };
    
    const onMouseMove = (e: MouseEvent) => {
      uniforms.iMouse.value.set(e.clientX, window.innerHeight - e.clientY);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);
    onResize();

    renderer.setAnimationLoop(() => {
      uniforms.iTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    });

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      renderer.setAnimationLoop(null);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      material.dispose();
      mesh.geometry.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 bg-black ${className}`}
      aria-label="Interactive nebula background"
    />
  );
}

// ==========================================
// GLOW EFFECT (USED ELSEWHERE IN PAGE)
// ==========================================
type GlowEffectProps = {
  className?: string;
  colors?: string[];
  mode?: "rotate" | "pulse" | "flowHorizontal" | "static";
  blur?: "soft" | "medium" | "strong" | "none";
  scale?: number;
  duration?: number;
};

function GlowEffect({
  className = "",
  colors = ["#5683da", "#ff8964", "#ffffff", "#3ee7c4"],
  mode = "rotate",
  blur = "medium",
  scale = 1,
  duration = 5,
}: GlowEffectProps) {
  const blurClass = {
    soft: "blur-sm",
    medium: "blur-md",
    strong: "blur-xl",
    none: "blur-none",
  }[blur];

  return (
    <div
      className={`glow-effect glow-${mode} pointer-events-none absolute inset-0 h-full w-full transform-gpu ${blurClass} ${className}`}
      style={
        {
          "--glow-colors": colors.join(", "),
          "--glow-scale": scale,
          "--glow-duration": `${duration}s`,
        } as CSSProperties
      }
    />
  );
}

// ==========================================
// REMAINING DATA & SUBCOMPONENTS
// ==========================================
const commandCells = [
  { id: "001", title: "AVAILABILITY", value: "Open", type: "progress" },
  { id: "002", title: "SYSTEM STATS", value: "20+ Agents", type: "data" },
  { id: "003", title: "EXPERTISE", value: "Autonomous Ops", type: "text" },
];

const syncFeatures = [
  {
    icon: Workflow, 
    title: "Bidirectional memory sync",
    text: "Keep documents, chat decisions, and workflow outputs synchronized across every agent.",
  },
  {
    icon: Lock,
    title: "Private workspaces",
    text: "Separate customer data, finance files, and internal strategy with role-aware isolation.",
  },
  {
    icon: Layers,
    title: "Multiple knowledge bases",
    text: "Attach independent document stores for each department without losing global visibility.",
  },
  {
    icon: Workflow,
    title: "Process migration",
    text: "Move manual SOPs into repeatable agent workflows with checkpoints and ownership.",
  },
  {
    icon: Activity,
    title: "Live execution tracing",
    text: "Watch each task move from request to decision with timestamps, tools, and evidence.",
  },
  {
    icon: Filter,
    title: "Advanced filtering",
    text: "Find issues by source, confidence, department, severity, owner, or generated action.",
  },
];

const productivityCards = [
  {
    title: "Command palette.",
    text: "Trigger agents, retrieve docs, and open workflows without digging through menus.",
    className: "lg:col-span-1",
    visual: "command",
  },
  {
    title: "Team planner.",
    text: "Turn agent findings into scheduled work, owners, and review windows.",
    className: "lg:col-span-2",
    visual: "planner",
  },
  {
    title: "Decision room.",
    text: "Bring finance, operations, and customer signals into one shared meeting view.",
    className: "lg:col-span-2",
    visual: "meeting",
  },
  {
    title: "Critical alerts.",
    text: "Surface anomalies before they turn into missed revenue or operational drag.",
    className: "lg:col-span-1",
    visual: "alert",  
  },
];

function MiniProductFrame() {
  return (
    <div className="product-frame relative mx-auto mt-16 w-full max-w-[1100px]">
      <GlowEffect
        className="rounded-[18px] opacity-80"
        colors={["#5683da", "#ff8964", "#ffffff", "#5683da"]}
        blur="strong"
        scale={1.05}
        duration={7}
      />
      <div className="relative border border-white/10 bg-[#0c0c0e]/95 backdrop-blur-md rounded-xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.6)] font-sans text-white">
        <div className="flex items-center justify-between border-b border-white/5 bg-black/40 px-6 py-4.5 text-xs text-white/40 font-mono tracking-wide">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#eab308]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]/80" />
            <span className="ml-2 text-[11px] text-white/30">&gt;_ AEGIS / Agent Control Plane</span>
          </div>
          <span className="text-[10px] font-bold text-[#ff8964] bg-[#ff8964]/10 border border-[#ff8964]/20 px-2.5 py-1 rounded uppercase tracking-wider">
            High Priority
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/5 bg-black/20">
          <div className="lg:col-span-8 p-10 flex flex-col gap-8">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-mono text-amber-500 font-semibold block mb-1">
                Live Alert Layer
              </span>
              <h3 className="text-xl font-bold tracking-tight text-white mb-2">
                $12.5K ad spend spike detected
              </h3>
              <p className="text-sm leading-relaxed text-white/50">
                Finance agent identified an independent paid acquisition invoice charging{" "}
                <span className="text-[#ff8964] font-medium">3.1x above</span> the historical monthly target.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase block mb-1">
                Execution Steps Tracer
              </span>
              <div className="flex items-start gap-3 bg-white/[0.01] border border-white/5 rounded-lg p-3.5 text-xs transition hover:bg-white/[0.02]">
                <span className="h-2 w-2 rounded-full bg-[#22c55e] mt-1.5 shrink-0" />
                <p className="leading-relaxed text-white/70">
                  <span className="font-mono text-white font-semibold mr-1.5">[Finance Node]</span> 
                  Matched ledger row against historical marketing campaign spend records.
                </p>
              </div>
              <div className="flex items-start gap-3 bg-white/[0.01] border border-white/5 rounded-lg p-3.5 text-xs transition hover:bg-white/[0.02]">
                <span className="h-2 w-2 rounded-full bg-[#3b82f6] mt-1.5 shrink-0" />
                <p className="leading-relaxed text-white/70">
                  <span className="font-mono text-white font-semibold mr-1.5">[CEO Router]</span> 
                  Dispatched contextual data packets and evidence directly to{" "}
                  <span className="underline decoration-white/30 underline-offset-4 text-white font-medium">marketing group</span>.
                </p>
              </div>
              <div className="flex items-start gap-3 bg-white/[0.01] border border-white/5 rounded-lg p-3.5 text-xs transition hover:bg-white/[0.02]">
                <span className="text-white/40 font-mono text-sm leading-none shrink-0 mt-0.5 font-bold">→</span>
                <p className="leading-relaxed text-white/70">
                  <span className="font-mono text-white font-semibold mr-1.5">[Ops Automator]</span> 
                  Drafted instant checklist and multi-sig review workflow layout assigned for{" "}
                  <span className="text-white font-medium">CEO Approval</span>.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 p-10 flex flex-col justify-between gap-10 bg-black/10">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase block">
                Verified Records
              </span>
              <div className="flex flex-col gap-1.5">
                {[
                  "Ledger_June2026.csv",
                  "Marketing_ROI.pdf",
                  "CRM_Accounts.json",
                ].map((fileName) => (
                  <div
                    key={fileName}
                    className="flex items-center justify-between border border-white/5 bg-white/[0.02] px-3 py-2 rounded font-mono text-[11px] text-white/70 transition hover:border-white/10"
                  >
                    <span className="truncate pr-2">{fileName}</span>
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#22c55e] shrink-0" />
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-white/5 pt-5">
              <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase block mb-2">
                Evidence Confidence Score
              </span>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-black tracking-tight text-white">86%</span>
                <span className="text-[10px] font-mono text-[#22c55e] bg-[#22c55e]/10 px-1.5 py-0.5 rounded uppercase font-semibold">
                  High certainty
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[86%] bg-gradient-to-r from-[#22c55e] to-[#3b82f6] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductivityVisual({ type }: { type: string }) {
  if (type === "command") {
    return (
      <div className="relative h-56 overflow-hidden rounded-lg bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_10%,rgba(255,137,100,0.45),transparent_34%),radial-gradient(circle_at_25%_70%,rgba(86,131,218,0.25),transparent_38%)]" />
        <div className="absolute left-1/2 top-1/2 w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-white/10 bg-black/70 p-6 shadow-2xl backdrop-blur">
          <div className="mb-4 flex items-center gap-2.5 border-b border-white/10 pb-4.5 text-xs text-white/50">
            <Command className="h-4 w-4" />
            Run command...
          </div>
          {["Summarize latest customer risks", "Create finance review task", "Open June ledger memory"].map(
            (item, index) => (
              <div
                key={item}
                className={`flex justify-between rounded-md px-3 py-2 text-xs ${
                  index === 0 ? "bg-white text-black" : "text-white/55"
                }`}
              >
                <span>{item}</span>
                <span>{index === 0 ? "Enter" : "Cmd"}</span>
              </div>
            ),
          )}
        </div>
      </div>
    );
  }

  if (type === "planner") {
    return (
      <div className="relative h-56 overflow-hidden rounded-lg bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(86,131,218,0.55),transparent_42%)]" />
        <div className="absolute left-1/2 top-7 w-[300px] -translate-x-1/2 rounded-lg bg-white p-6 text-black shadow-2xl">
          <p className="text-sm font-semibold">Today</p>
          <div className="mt-4 rounded-md border border-black/10 p-4">
            <span className="text-[10px] font-semibold text-[#ff8964]">High</span>
            <p className="mt-1.5 text-xs font-semibold">Approve anomaly response workflow</p>
            <div className="mt-4 flex items-center gap-2.5 text-[10px] text-black/45">
              <CalendarDays className="h-3.5 w-3.5" />
              4:00 PM review
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "meeting") {
    return (
      <div className="relative h-56 overflow-hidden rounded-lg bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_20%,rgba(255,255,255,0.34),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(86,131,218,0.35),transparent_34%)]" />
        <div className="absolute left-[10%] top-9 w-[280px] rounded-lg bg-white p-6 text-black shadow-2xl">
          <p className="text-sm font-semibold">Risk review</p>
          <p className="mt-3.5 text-xs text-black/55">Finance, Marketing, Ops</p>
          <button className="mt-5 rounded-full bg-[#5683da] px-5 py-2.5 text-xs font-semibold text-white">
            Join Room
          </button>
        </div>
        <div className="absolute bottom-8 right-[8%] w-[280px] rounded-lg border border-white/10 bg-black/70 p-6 text-white backdrop-blur">
          <p className="text-xs font-semibold">Agent brief ready</p>
          <p className="mt-2.5 text-xs text-white/45">3 decisions, 6 evidence links, 2 owners.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-lg bg-black">
      <div className="absolute h-44 w-44 rounded-full bg-[conic-gradient(from_90deg,#5683da,#ffffff,#ff8964,#5683da)] opacity-70 blur-sm" />
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-black shadow-2xl">
        <Bell className="h-8 w-8 text-white" />
        <span className="absolute -right-1 -top-1 rounded-full bg-[#ff8964] px-2 py-1 text-[10px] font-bold text-white">
          2
        </span>
      </div>
    </div>
  );
}

// ==========================================
// MAIN LANDING PAGE COMPONENT
// ==========================================
export default function LandingPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        revealRef.current,
        { filter: "blur(30px)", opacity: 0, scale: 1.02 },
        { filter: "blur(0px)", opacity: 1, scale: 1, duration: 2.2, ease: "expo.out" },
      );

      gsap.from(".command-cell", {
        x: 60,
        opacity: 0,
        stagger: 0.1,
        duration: 1.5,
        ease: "power4.out",
        delay: 1,
        clearProps: "all",
      });

      const handleMouseMove = (event: MouseEvent) => {
        if (!ctaRef.current) return;

        const rect = ctaRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);

        if (distance < 150) {
          gsap.to(ctaRef.current, {
            x: (event.clientX - centerX) * 0.4,
            y: (event.clientY - centerY) * 0.4,
            duration: 0.6,
          });
        } else {
          gsap.to(ctaRef.current, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.3)",
          });
        }
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen w-full overflow-x-hidden bg-[#020202] selection:bg-white selection:text-black"
    >
      <section className="relative min-h-screen overflow-hidden bg-[#020202]">
        
        {/* SWAPPED OUT OLD R3F WITH NEW INLINE INTERACTIVE NEBULA LAYER */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <InteractiveNebulaShader 
            hasActiveReminders={false} 
            hasUpcomingReminders={false} 
            disableCenterDimming={false} 
          />
        </div>

        <nav className="landing-nav relative z-10">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex w-fit items-center gap-3"
            aria-label="AEGIS home"
          >
            <Image
              src="/aegis_logo_without_bg.png"
              alt=""
              width={28}
              height={28}
              className="brand-logo"
              priority
            />
            <span className="font-mono text-[12px] font-bold uppercase tracking-[0.24em] text-white">
              AEGIIS
            </span>
          </button>
          <div className="hidden items-center gap-8 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 md:flex">
            <a href="#sync" className="transition hover:text-white">Sync</a>
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#productivity" className="transition hover:text-white">Workflow</a>
            <a href="#knowledge" className="transition hover:text-white">Knowledge</a>
          </div>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="signin-button"
          >
            Sign in
          </button>
        </nav>

        <div ref={revealRef} className="hero-layout relative z-10">
          <div className="hero-copy">
            <div>
              <h1 className="hero-title">
                AI COMMAND
                <br />
                <span className="text-outline">CENTER</span>
              </h1>
              <p className="hero-subtitle">
                Orchestrate autonomous business agents through secure workflows, live memory,
                and operational intelligence.
              </p>
            </div>

            <button
              ref={ctaRef}
              type="button"
              onClick={() => router.push("/onboarding")}
              className="hero-cta group"
            >
              <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-white/15 transition-all duration-500 group-hover:bg-white">
                <ArrowRight className="h-5 w-5 -rotate-45 text-white transition-colors duration-500 group-hover:text-black" />
              </span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                Start Setup
              </span>
            </button>
          </div>

          <div className="hero-deck">
            {commandCells.map((item) => (
              <div key={item.id} className="command-cell glass-panel p-6 sm:p-7">
                <span className="mb-3 block font-mono text-[9px] uppercase tracking-widest text-white/25">
                  {item.id} {" // "} {item.title}
                </span>

                {item.type === "progress" && (
                  <div className="mt-2 flex items-end justify-between">
                    <h2 className="text-2xl font-bold tracking-normal text-white sm:text-3xl">
                      {item.value}
                    </h2>
                    <div className="h-[2px] w-20 overflow-hidden rounded-full bg-white/5">
                      <div className="animate-loading h-full w-[60%] bg-white" />
                    </div>
                  </div>
                )}

                {item.type === "data" && (
                  <div className="mt-4 flex flex-col gap-3">
                    <div className="flex justify-between font-mono text-[10px] text-white/50">
                      <span>Agent Mesh</span>
                      <span>2026</span>
                    </div>
                    <div className="h-px w-full bg-white/5" />
                    <div className="flex justify-between font-mono text-[10px] text-white/50">
                      <span>Workflow Uptime</span>
                      <span>98.2%</span>
                    </div>
                  </div>
                )}

                {item.type === "text" && (
                  <h2 className="mt-3 text-sm font-medium leading-snug text-white/70">
                    Transforming static dashboards into{" "}
                    <span className="italic text-white">living intelligence systems</span>.
                  </h2>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Remaining content sections remain entirely structurally intact */}
      <section id="sync" className="landing-section dark-section">
        <div className="landing-container">
          <div className="section-heading">
            <h2 className="section-title text-white">Sync every signal.<br />Both ways.</h2>
            <p className="section-copy text-white/45">
              AEGIS keeps documents, agent outputs, decisions, and operational tasks connected so
              your team can move from evidence to action without copying context between tools.
            </p>
          </div>
          <MiniProductFrame />
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="features-grid">
          {syncFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title}>
                <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-lg bg-white/[0.04] text-[#6ea4ff] shadow-[0_0_35px_rgba(86,131,218,0.18)]">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="max-w-xs text-3xl font-semibold leading-tight tracking-normal text-white">
                  {feature.title}
                </h3>
                <p className="mt-5 max-w-xs text-sm leading-6 text-white/42">{feature.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="productivity" className="landing-section light-section">
        <div className="landing-container">
          <h2 className="section-title text-black">Unmatched<br />execution</h2>
          <p className="section-copy text-black/70">
            AEGIS turns business knowledge into coordinated work: agent briefings, task routing,
            anomaly handling, and decision rooms designed for operators.
          </p>
          <div className="productivity-grid">
            {productivityCards.map((card) => (
              <article
                key={card.title}
                className={`overflow-hidden rounded-lg bg-[#0a0a0b] p-8 text-white shadow-xl ${card.className}`}
              >
                <ProductivityVisual type={card.visual} />
                <div className="pt-6">
                  <h3 className="text-base font-bold tracking-normal text-white">{card.title}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-white/58">{card.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="knowledge" className="landing-section knowledge-section">
        <div className="knowledge-grid">
          <div className="knowledge-visual">
            <div className="absolute left-4 top-2 h-80 w-px bg-gradient-to-b from-transparent via-[#5683da]/35 to-transparent" />
            <div className="absolute left-0 top-20 w-80 rounded-lg bg-white p-8 shadow-2xl">
              <div className="relative mb-6 h-40 rounded-md bg-[radial-gradient(circle_at_60%_20%,rgba(255,137,100,0.32),transparent_35%),radial-gradient(circle_at_35%_70%,rgba(86,131,218,0.24),transparent_42%)]">
                <span className="absolute left-8 top-16 border border-[#5683da] bg-white/65 px-4 py-1.5 text-3xl font-bold">Runbook</span>
                <span className="absolute -left-7 top-6 rounded-full bg-[#5683da] px-3.5 py-2 text-xs font-semibold text-white">Ops</span>
                <span className="absolute -right-8 bottom-8 rounded-full bg-[#ff8964] px-3.5 py-2 text-xs font-semibold text-white">CEO</span>
              </div>
              <h3 className="text-base font-bold mt-6">Collaborative knowledge</h3>
              <p className="mt-3 text-sm leading-6 text-black/60">
                Upload docs, assign review owners, and let agents cite the exact source behind each recommendation.
              </p>
            </div>
          </div>
          <div className="knowledge-copy">
            <h2 className="section-title text-black">Knowledge at<br />your command</h2>
            <p className="section-copy text-black/72">
              AEGIS connects company documents, ledgers, CRM exports, policies, and meeting notes into a living memory layer for every agent.
            </p>
            <div className="mt-12 overflow-hidden rounded-lg border border-black/10 bg-white shadow-xl">
              <div className="h-64 bg-[linear-gradient(135deg,#dfe9ff,#ffffff_45%,#ffd8c8)] p-10 flex items-center justify-center">
                <div className="max-w-md w-full rounded-md bg-black p-8 text-white shadow-2xl">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-[#ff8964]" />
                    <span className="text-sm font-semibold">Policy summary generated</span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-white/55">
                    Procurement threshold changed in section 4.2. Suggested workflow update queued for finance approval.
                  </p>
                </div>
              </div>
              <div className="grid gap-6 p-8 px-10 sm:grid-cols-3">
                {[
                  [UploadCloud, "Fast ingestion"],
                  [Database, "Hybrid retrieval"],
                  [CheckCircle2, "Cited answers"],
                ].map(([Icon, label]) => {
                  const TypedIcon = Icon as typeof UploadCloud;
                  return (
                    <div key={label as string} className="flex items-center gap-3 text-sm font-semibold">
                      <TypedIcon className="h-5 w-5 text-[#5683da]" />
                      <span>{label as string}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section cta-section">
        <div className="cta-container">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/35">Ready for deployment</span>
            <h2 className="cta-title">Build your enterprise brain.</h2>
          </div>
          <button
            type="button"
            onClick={() => router.push("/onboarding")}
            className="group flex w-fit items-center gap-5 rounded-full bg-white px-8 py-5 text-sm font-bold uppercase tracking-[0.16em] text-black transition hover:bg-[#ff8964] hover:scale-102 duration-300"
          >
            Start onboarding
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#050505] px-6 py-8 text-white md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="font-mono uppercase tracking-[0.2em]">AEGIIS</span>
            <div className="flex items-center gap-3 border-l border-white/10 pl-4">
              <a 
                href="https://www.linkedin.com/in/azhaanalisiddiqui/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-200 text-white/40"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a 
                href="https://github.com/AzhaanGlitch" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-200 text-white/40"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
            </div>
          </div>
          <span>Autonomous intelligence workspace for business operations.</span>
        </div>
      </footer>
    </main>
  );
}