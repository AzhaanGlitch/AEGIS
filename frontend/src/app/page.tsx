"use client";

import React, { CSSProperties, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  Bell,
  Brain,
  CalendarDays,
  CheckCircle2,
  Command,
  Database,
  FileText,
  Filter,
  GitBranch,
  Layers,
  Lock,
  Search,
  UploadCloud,
  Workflow,
} from "lucide-react";
import gsap from "gsap";
import * as THREE from "three";

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

function LiquidBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    [],
  );

  useFrame((state) => {
    const material = meshRef.current?.material as THREE.ShaderMaterial | undefined;

    if (!material?.uniforms) return;

    material.uniforms.uTime.value = state.clock.getElapsedTime();
    material.uniforms.uMouse.value.lerp(state.mouse, 0.05);
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        transparent
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;

          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec2 uMouse;
          varying vec2 vUv;

          void main() {
            vec2 uv = vUv;
            float t = uTime * 0.15;
            vec2 m = uMouse * 0.1;
            float color = smoothstep(
              0.0,
              1.0,
              (sin(uv.x * 8.0 + t + m.x * 12.0) + sin(uv.y * 6.0 - t + m.y * 12.0)) * 0.5 + 0.5
            );

            gl_FragColor = vec4(mix(vec3(0.005), vec3(0.05), color), 1.0);
          }
        `}
      />
    </mesh>
  );
}

function Monolith() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.25;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[13, 1]} />
        <MeshDistortMaterial
          color="#0a0a0a"
          speed={4}
          distort={0.4}
          roughness={0.05}
          metalness={1}
        />
      </mesh>
    </Float>
  );
}

const commandCells = [
  { id: "001", title: "AVAILABILITY", value: "Open", type: "progress" },
  { id: "002", title: "SYSTEM STATS", value: "20+ Agents", type: "data" },
  { id: "003", title: "EXPERTISE", value: "Autonomous Ops", type: "text" },
];

const syncFeatures = [
  {
    icon: GitBranch,
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
    <div className="product-frame">
      <GlowEffect
        className="rounded-[18px] opacity-80"
        colors={["#5683da", "#ff8964", "#ffffff", "#5683da"]}
        blur="strong"
        scale={1.04}
        duration={7}
      />
      <div className="product-shell">
        <div className="product-topbar">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff8964]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#5683da]" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
          </div>
          <span>AEGIS / Agent Control Plane</span>
          <div className="h-7 w-16 rounded-full border border-white/10 bg-white/[0.03]" />
        </div>
        <div className="product-dashboard">
          <aside className="product-sidebar">
            <div className="product-search">
              <Search className="h-4 w-4" />
              Search memory
            </div>
            {["Finance", "Customers", "Workflows", "Knowledge"].map((item, index) => (
              <div key={item} className={`product-nav-item ${index === 1 ? "active" : ""}`}>
                <span>{item}</span>
                <span>{index === 1 ? "Live" : "Ready"}</span>
              </div>
            ))}
          </aside>
          <div className="product-main">
            <div className="product-hero-card">
              <div>
                <span className="panel-kicker">Revenue Anomaly</span>
                <h3>$12.5K ad spend spike</h3>
                <p>Finance agent found a paid acquisition charge 3.1x above the monthly average.</p>
              </div>
              <span className="priority-pill">High priority</span>
            </div>
            <div className="product-panels">
              <div className="agent-timeline">
                {[
                  ["Finance", "Matched ledger row against historical campaign spend."],
                  ["CEO", "Routed evidence to marketing and cash-flow review."],
                  ["Ops", "Prepared owner checklist and approval workflow."],
                ].map(([label, text]) => (
                  <div key={label} className="timeline-row">
                    <span>{label}</span>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
              <div className="source-panel">
                <div className="flex items-center gap-3">
                  <Brain className="h-5 w-5 text-[#7aa7ff]" />
                  <h3>Sources</h3>
                </div>
                <div className="source-list">
                  {["Ledger_June2026.csv", "Marketing_ROI.pdf", "CRM_Accounts.json"].map((source) => (
                    <div key={source}>
                      <span>{source}</span>
                      <CheckCircle2 className="h-4 w-4 text-[#7aa7ff]" />
                    </div>
                  ))}
                </div>
                <div className="confidence-box">
                  <span>Evidence confidence</span>
                  <strong>86%</strong>
                  <div><span /></div>
                </div>
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
        <div className="absolute left-1/2 top-1/2 w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-white/10 bg-black/70 p-4 shadow-2xl backdrop-blur">
          <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-3 text-xs text-white/50">
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
        <div className="absolute left-1/2 top-7 w-72 -translate-x-1/2 rounded-lg bg-white p-4 text-black shadow-2xl">
          <p className="text-sm font-semibold">Today</p>
          <div className="mt-3 rounded-md border border-black/10 p-3">
            <span className="text-[10px] font-semibold text-[#ff8964]">High</span>
            <p className="mt-1 text-xs font-semibold">Approve anomaly response workflow</p>
            <div className="mt-3 flex items-center gap-2 text-[10px] text-black/45">
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
        <div className="absolute left-[14%] top-9 w-64 rounded-lg bg-white p-4 text-black shadow-2xl">
          <p className="text-sm font-semibold">Risk review</p>
          <p className="mt-3 text-xs text-black/55">Finance, Marketing, Ops</p>
          <button className="mt-4 rounded-full bg-[#5683da] px-4 py-2 text-xs font-semibold text-white">
            Join Room
          </button>
        </div>
        <div className="absolute bottom-8 right-[12%] w-64 rounded-lg border border-white/10 bg-black/70 p-4 text-white backdrop-blur">
          <p className="text-xs font-semibold">Agent brief ready</p>
          <p className="mt-2 text-xs text-white/45">3 decisions, 6 evidence links, 2 owners.</p>
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
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 60], fov: 35 }}>
            <ambientLight intensity={0.4} />
            <spotLight position={[50, 50, 50]} intensity={3} />
            <LiquidBackground />
            <Monolith />
          </Canvas>
        </div>

        <nav className="landing-nav">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex w-fit items-center gap-3"
            aria-label="AEGIS home"
          >
            <Image
              src="/aegis_logo_with_bg.jpeg"
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
            <a href="#sync" className="transition hover:text-white">
              Sync
            </a>
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#productivity" className="transition hover:text-white">
              Workflow
            </a>
            <a href="#knowledge" className="transition hover:text-white">
              Knowledge
            </a>
          </div>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="signin-button"
          >
            Sign in
          </button>
        </nav>

        <div
          ref={revealRef}
          className="hero-layout"
        >
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
                  {item.id}
                  {" // "}
                  {item.title}
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

      <section id="sync" className="landing-section dark-section">
        <div className="landing-container">
          <div className="section-heading">
            <h2 className="section-title text-white">
              Sync every signal.
              <br />
              Both ways.
            </h2>
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
          <h2 className="section-title text-black">
            Unmatched
            <br />
            execution
          </h2>
          <p className="section-copy text-black/70">
            AEGIS turns business knowledge into coordinated work: agent briefings, task routing,
            anomaly handling, and decision rooms designed for operators.
          </p>

          <div className="productivity-grid">
            {productivityCards.map((card) => (
              <article
                key={card.title}
                className={`overflow-hidden rounded-lg bg-[#0a0a0b] p-4 text-white shadow-xl ${card.className}`}
              >
                <ProductivityVisual type={card.visual} />
                <div className="px-2 pb-3 pt-6">
                  <h3 className="text-base font-bold tracking-normal text-white">{card.title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/58">{card.text}</p>
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
            <div className="absolute left-0 top-20 w-72 rounded-lg bg-white p-5 shadow-2xl">
              <div className="relative mb-5 h-32 rounded-md bg-[radial-gradient(circle_at_60%_20%,rgba(255,137,100,0.32),transparent_35%),radial-gradient(circle_at_35%_70%,rgba(86,131,218,0.24),transparent_42%)]">
                <span className="absolute left-8 top-12 border border-[#5683da] bg-white/65 px-3 py-1 text-3xl font-bold">
                  Runbook
                </span>
                <span className="absolute -left-7 top-6 rounded-full bg-[#5683da] px-3 py-2 text-xs font-semibold text-white">
                  Ops
                </span>
                <span className="absolute -right-8 bottom-8 rounded-full bg-[#ff8964] px-3 py-2 text-xs font-semibold text-white">
                  CEO
                </span>
              </div>
              <h3 className="text-base font-bold">Collaborative knowledge</h3>
              <p className="mt-2 text-sm leading-6 text-black/60">
                Upload docs, assign review owners, and let agents cite the exact source behind each
                recommendation.
              </p>
            </div>
          </div>

          <div className="knowledge-copy">
            <h2 className="section-title text-black">
              Knowledge at
              <br />
              your command
            </h2>
            <p className="section-copy text-black/72">
              AEGIS connects company documents, ledgers, CRM exports, policies, and meeting notes
              into a living memory layer for every agent.
            </p>
            <p className="section-copy secondary-copy text-black/70">
              Teams can inspect citations, compare versions, and turn findings into follow-up work
              without losing the reasoning trail.
            </p>

            <div className="mt-12 overflow-hidden rounded-lg border border-black/10 bg-white shadow-xl">
              <div className="h-52 bg-[linear-gradient(135deg,#dfe9ff,#ffffff_45%,#ffd8c8)] p-6">
                <div className="max-w-md rounded-md bg-black p-5 text-white shadow-2xl">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-[#ff8964]" />
                    <span className="text-sm font-semibold">Policy summary generated</span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-white/55">
                    Procurement threshold changed in section 4.2. Suggested workflow update queued
                    for finance approval.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 p-5 sm:grid-cols-3">
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
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/35">
              Ready for deployment
            </span>
            <h2 className="cta-title">
              Build your enterprise brain.
            </h2>
          </div>
          <button
            type="button"
            onClick={() => router.push("/onboarding")}
            className="group flex w-fit items-center gap-5 rounded-full bg-white px-6 py-4 text-sm font-bold uppercase tracking-[0.16em] text-black transition hover:bg-[#ff8964]"
          >
            Start onboarding
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#050505] px-6 py-8 text-white md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono uppercase tracking-[0.2em]">AEGIIS</span>
          <span>Autonomous intelligence workspace for business operations.</span>
        </div>
      </footer>

      <style jsx global>{`
        html,
        body {
          overflow-x: hidden;
        }

        .landing-nav {
          position: absolute;
          inset: 0 0 auto;
          z-index: 30;
          width: 100%;
          max-width: 1280px;
          height: 88px;
          margin: 0 auto;
          padding: 0 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .hero-layout {
          position: relative;
          z-index: 10;
          width: min(100% - 48px, 1280px);
          min-height: 100svh;
          margin: 0 auto;
          padding: 128px 0 72px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(300px, 380px);
          align-items: center;
          gap: 56px;
        }

        .hero-copy {
          min-width: 0;
          display: flex;
          min-height: calc(100svh - 200px);
          flex-direction: column;
          justify-content: center;
          gap: 56px;
        }

        .hero-title {
          max-width: 900px;
          font-size: clamp(64px, 8.2vw, 132px);
          line-height: 0.88;
          letter-spacing: 0;
          font-weight: 900;
          text-transform: uppercase;
          color: #ffffff;
        }

        .hero-subtitle {
          max-width: 460px;
          margin-top: 32px;
          color: rgba(255, 255, 255, 0.44);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
            "Courier New", monospace;
          font-size: 11px;
          line-height: 1.9;
          letter-spacing: 0.28em;
          text-transform: uppercase;
        }

        .hero-cta {
          width: fit-content;
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .hero-deck {
          z-index: 20;
          width: 100%;
          max-width: 380px;
          justify-self: end;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .landing-section {
          position: relative;
          padding: 120px 32px;
        }

        .dark-section,
        .features-section {
          background: #0a0a0b;
          color: #ffffff;
        }

        .light-section {
          background: #f5f5f3;
          color: #000000;
        }

        .knowledge-section {
          overflow: hidden;
          background: #f7f7f6;
          color: #000000;
        }

        .landing-container,
        .features-grid,
        .knowledge-grid,
        .cta-container {
          width: min(100%, 1160px);
          margin: 0 auto;
        }

        .section-heading {
          max-width: 720px;
        }

        .section-title {
          max-width: 860px;
          font-size: clamp(56px, 6.8vw, 104px);
          line-height: 0.94;
          letter-spacing: 0;
          font-weight: 900;
        }

        .section-copy {
          max-width: 680px;
          margin-top: 28px;
          font-size: 17px;
          line-height: 1.65;
        }

        .secondary-copy {
          margin-top: 20px;
        }

        .product-frame {
          position: relative;
          width: min(100%, 980px);
          margin: 72px auto 0;
        }

        .productivity-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
          margin-top: 56px;
        }

        .productivity-grid article {
          min-height: 356px;
        }

        .features-section {
          padding: 20px 32px 120px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          column-gap: 80px;
          row-gap: 76px;
        }

        .features-grid h3 {
          font-size: clamp(25px, 2.2vw, 34px);
          line-height: 1.08;
          letter-spacing: 0;
        }

        .features-grid p {
          font-size: 15px;
          line-height: 1.6;
        }

        .knowledge-grid {
          display: grid;
          grid-template-columns: minmax(280px, 0.75fr) minmax(0, 1.25fr);
          align-items: center;
          gap: 80px;
        }

        .knowledge-visual {
          position: relative;
          min-height: 420px;
        }

        .knowledge-copy {
          min-width: 0;
        }

        .cta-section {
          background: #050505;
          color: #ffffff;
          padding-top: 96px;
          padding-bottom: 96px;
        }

        .cta-container {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 48px;
        }

        .cta-title {
          max-width: 760px;
          margin-top: 20px;
          font-size: clamp(54px, 6.2vw, 96px);
          line-height: 0.96;
          letter-spacing: 0;
          font-weight: 900;
        }

        .text-outline {
          color: transparent;
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.72);
          text-stroke: 1px rgba(255, 255, 255, 0.72);
        }

        .glass-panel {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.035);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
        }

        .glow-effect {
          scale: var(--glow-scale);
          will-change: transform, background, opacity;
          animation-duration: var(--glow-duration);
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }

        .glow-rotate {
          background: conic-gradient(from 0deg at 50% 50%, var(--glow-colors));
          animation-name: glow-rotate;
        }

        .glow-pulse {
          background: radial-gradient(circle at 50% 50%, var(--glow-colors));
          animation-name: glow-pulse;
        }

        .glow-flowHorizontal {
          background: linear-gradient(90deg, var(--glow-colors));
          animation-name: glow-flow;
        }

        .glow-static {
          background: linear-gradient(90deg, var(--glow-colors));
        }

        @keyframes glow-rotate {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes glow-pulse {
          0%,
          100% {
            opacity: 0.42;
            transform: scale(1);
          }
          50% {
            opacity: 0.78;
            transform: scale(1.08);
          }
        }

        @keyframes glow-flow {
          0%,
          100% {
            transform: translateX(-4%);
          }
          50% {
            transform: translateX(4%);
          }
        }

        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(25%);
          }
          100% {
            transform: translateX(140%);
          }
        }

        .animate-loading {
          animation: loading-bar 1.8s ease-in-out infinite;
        }

        @media (max-width: 980px) {
          .landing-nav {
            height: 76px;
            padding: 0 22px;
          }

          .hero-layout {
            width: min(100% - 36px, 720px);
            min-height: auto;
            padding: 116px 0 80px;
            grid-template-columns: 1fr;
            align-items: start;
            gap: 48px;
          }

          .hero-copy {
            min-height: auto;
            gap: 40px;
          }

          .hero-title {
            font-size: clamp(56px, 16vw, 92px);
          }

          .hero-deck {
            max-width: none;
            justify-self: stretch;
          }

          .landing-section {
            padding: 88px 22px;
          }

          .features-section {
            padding: 12px 22px 88px;
          }

          .features-grid,
          .productivity-grid,
          .knowledge-grid {
            grid-template-columns: 1fr;
          }

          .knowledge-grid {
            gap: 48px;
          }

          .knowledge-visual {
            min-height: 360px;
          }

          .section-title {
            font-size: clamp(48px, 13vw, 76px);
          }

          .cta-container {
            align-items: start;
            flex-direction: column;
          }
        }

        @media (max-width: 640px) {
          .landing-nav {
            padding: 0 16px;
          }

          .landing-nav > div {
            display: none;
          }

          .hero-layout {
            width: min(100% - 28px, 420px);
            padding-top: 104px;
          }

          .hero-title {
            font-size: clamp(48px, 18vw, 72px);
          }

          .hero-subtitle {
            max-width: 340px;
            font-size: 10px;
            letter-spacing: 0.2em;
          }

          .section-copy {
            font-size: 15px;
          }

          .product-frame {
            margin-top: 48px;
          }

          .knowledge-visual > div:nth-child(2) {
            left: 18px;
            right: 18px;
            width: auto;
          }

          .cta-title {
            font-size: clamp(46px, 16vw, 68px);
          }
        }
      `}</style>
    </main>
  );
}
