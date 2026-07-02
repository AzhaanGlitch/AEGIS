"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ─── SVG Icons ─────────────────────────────────────────────────────────────
const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);

const MicIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
    <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 19v4M8 23h8"/>
  </svg>
);

// ─── Huly-compliant Tag Chip ───────────────────────────────────────────────
function TagChip({ color, text }: { color: string; text: string }) {
  return (
    <span
      className="tag-chip-custom"
      style={{
        color: color,
        backgroundColor: `${color}1e`, // 12% opacity
        borderColor: `${color}3b`,
      }}
    >
      {text}
    </span>
  );
}

// ─── In-App Workspace Preview (Inbox/Chat Panel) ───────────────────────────
function WorkspacePanel() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % 4);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card-custom text-left" style={{ minHeight: "340px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-slate-edge)", paddingBottom: "12px" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff8964" }}/>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-snow)", letterSpacing: "-0.02em" }}>AEGIS INTELLIGENCE WORKSPACE</span>
        </div>
        <TagChip color="#5683da" text="ACTIVE AGENTS" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Step 1: User Request */}
        <div style={{ opacity: step >= 0 ? 1 : 0.3, transition: "opacity 0.5s", display: "flex", gap: "10px" }}>
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "var(--color-slate-edge)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>👤</div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--color-smoke)", fontWeight: 500 }}>Founder Request</div>
            <div style={{ fontSize: "13px", color: "var(--color-snow)", marginTop: "2px" }}>Is there any high severity anomaly in our June ledger?</div>
          </div>
        </div>

        {/* Step 2: CEO Agent Routing */}
        <div style={{ opacity: step >= 1 ? 1 : 0.15, transition: "opacity 0.5s", display: "flex", gap: "10px", marginLeft: "12px" }}>
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#5683da", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>👑</div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--color-electric-iris)", fontWeight: 600 }}>CEO Agent <span style={{ color: "var(--color-smoke)", fontWeight: 400 }}>decomposing task</span></div>
            <div style={{ fontSize: "13px", color: "var(--color-snow)", marginTop: "2px" }}>Delegating lookup parameters to Finance Agent. Scanning June2026.csv ledger...</div>
          </div>
        </div>

        {/* Step 3: Finance Agent Response */}
        <div style={{ opacity: step >= 2 ? 1 : 0.15, transition: "opacity 0.5s", display: "flex", gap: "10px", marginLeft: "12px" }}>
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#ff8964", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>💰</div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--color-ember-pulse)", fontWeight: 600 }}>Finance Agent <span style={{ color: "var(--color-smoke)", fontWeight: 400 }}>parsing ledger</span></div>
            <div style={{ fontSize: "13px", color: "var(--color-snow)", marginTop: "2px" }}>
              🚨 Found <strong>1 high-severity anomaly</strong>: LinkedIn Ads charged <strong>$12,500</strong> vs. average <strong>$4,200</strong> on June 28.
            </div>
            {step >= 3 && (
              <div style={{ marginTop: "8px", display: "flex", gap: "6px" }}>
                <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "9999px", background: "rgba(86,131,218,0.12)", color: "#5683da" }}>📄 Ledger_June2026.csv</span>
                <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "9999px", background: "rgba(255,137,100,0.12)", color: "#ff8964" }}>High Severity</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflowX: "hidden", backgroundColor: "var(--color-void)" }}>
      <div className="noise-overlay" />

      {/* ─── HEADER / NAVIGATION BAR ─── */}
      <nav style={{ position: "absolute", top: 0, left: 0, right: 0, height: "72px", zIndex: 100, display: "flex", alignItems: "center" }}>
        <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Huly Logo Mark */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }} onClick={() => router.push("/")}>
            <div style={{ display: "flex", gap: "2px" }}>
              <div style={{ width: "8px", height: "18px", backgroundColor: "var(--color-snow)", transform: "skewX(-15deg)" }} />
              <div style={{ width: "4px", height: "18px", backgroundColor: "var(--color-electric-iris)", transform: "skewX(-15deg)" }} />
              <div style={{ width: "8px", height: "18px", backgroundColor: "var(--color-snow)", transform: "skewX(-15deg)" }} />
            </div>
            <span style={{ fontFamily: "var(--font-esbuild)", fontWeight: 700, fontSize: "19px", color: "var(--color-snow)", letterSpacing: "-0.5px" }}>huly</span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex" style={{ gap: "28px" }}>
            <a href="#pricing" className="nav-link">Pricing</a>
            <a href="#features" className="nav-link">Resources</a>
            <a href="#agents" className="nav-link">Community</a>
            <a href="#pricing" className="nav-link">Download</a>
          </div>

          {/* Action Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <a href="https://github.com" target="_blank" className="nav-link" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
              <GitHubIcon /> Star Us
            </a>
            <button className="pill-button-ghost" onClick={() => router.push("/login")}>SIGN IN</button>
            <button className="pill-button-filled" onClick={() => router.push("/onboarding")}>SIGN UP</button>
          </div>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section className="void-band" style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", paddingTop: "120px", textAlign: "center", paddingBottom: "60px", paddingLeft: "24px", paddingRight: "24px" }}>
        {/* Cosmic Grid & Vertical Aurora Beam */}
        <div className="cosmic-grid" />
        <div className="aurora-beam" style={{ top: "0", left: "50%", transform: "translateX(-50%)", width: "8px", opacity: 0.8, filter: "blur(20px)" }} />
        <div className="aurora-beam" style={{ top: "0", left: "50%", transform: "translateX(-50%)", width: "160px", opacity: 0.15, filter: "blur(90px)" }} />

        <div style={{ maxWidth: "800px", zIndex: 10, position: "relative" }}>
          {/* Display Headline */}
          <h1 className="font-display" style={{ fontSize: "clamp(46px, 8vw, 84px)", fontWeight: 700, lineHeight: 0.95, color: "var(--color-snow)", marginBottom: "20px" }}>
            Everything App<br />for your teams
          </h1>
          <p style={{ fontSize: "16px", color: "var(--color-smoke)", lineHeight: 1.6, maxWidth: "520px", margin: "0 auto 36px" }}>
            Huly, an open-source platform, serves as an all-in-one replacement of Linear, Jira, Slack, and Notion.
          </p>

          <div style={{ position: "relative", display: "inline-block", marginBottom: "64px" }}>
            {/* Ambient glow behind CTA */}
            <div className="sunburst-glow" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%) scale(1.2)", zIndex: -1, opacity: 0.4 }} />
            <button className="pill-button-white" onClick={() => router.push("/onboarding")}>
              SEE IN ACTION →
            </button>
          </div>
        </div>

        {/* Floating Product UI Preview Screenshot */}
        <div className="px-6" style={{ maxWidth: "1000px", width: "100%", zIndex: 10, marginTop: "20px" }}>
          <div className="screenshot-frame-custom" style={{ background: "var(--color-charcoal-card)" }}>
            {/* Mockup Tab bar */}
            <div className="px-4" style={{ display: "flex", backgroundColor: "var(--color-void)", height: "40px", borderBottom: "1px solid var(--color-slate-edge)", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: "6px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ff8964" }} />
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-electric-iris)" }} />
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-iron-veil)" }} />
              </div>
              <span style={{ fontSize: "11px", color: "var(--color-smoke)" }}>Huly Workspace / Issues / Kanban</span>
              <div style={{ width: "24px" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", height: "360px" }}>
              {/* Sidebar */}
              <div style={{ borderRight: "1px solid var(--color-slate-edge)", backgroundColor: "var(--color-void)", padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div className="px-2" style={{ height: "32px", borderRadius: "6px", backgroundColor: "var(--color-charcoal-card)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <SearchIcon />
                  <span style={{ fontSize: "11px", color: "var(--color-smoke)" }}>Tracker search...</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--color-snow)" }}>
                    <span>My Issues</span>
                    <span style={{ color: "var(--color-electric-iris)", fontWeight: 700 }}>56%</span>
                  </div>
                  <div style={{ height: "4px", backgroundColor: "var(--color-slate-edge)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ width: "56%", height: "100%", backgroundColor: "var(--color-electric-iris)" }} />
                  </div>
                </div>
              </div>
              {/* Kanban Grid */}
              <div style={{ padding: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", backgroundColor: "var(--color-charcoal-card)" }}>
                <div className="card-custom" style={{ background: "var(--color-void)", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-smoke)" }}>BACKLOG</span>
                  <div className="card-custom" style={{ padding: "12px", background: "var(--color-charcoal-card)" }}>
                    <span style={{ fontSize: "12px", color: "var(--color-snow)" }}>Fix sidebar alignment bug on dashboard</span>
                  </div>
                </div>
                <div className="card-custom" style={{ background: "var(--color-void)", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-smoke)" }}>IN PROGRESS</span>
                  <div className="card-custom" style={{ padding: "12px", background: "var(--color-charcoal-card)", borderColor: "var(--color-electric-iris)" }}>
                    <span style={{ fontSize: "12px", color: "var(--color-snow)" }}>Refactor LLM fallback providers logic</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── GITHUB SYNC SECTION (Image 2) ─── */}
      <section className="void-band" style={{ padding: "96px 24px", position: "relative" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-esbuild)", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 700, letterSpacing: "-1.5px", color: "var(--color-snow)", marginBottom: "16px" }}>
            Sync with GitHub.<br />Both ways.
          </h2>
          <p style={{ fontSize: "14px", color: "var(--color-smoke)", lineHeight: 1.6, maxWidth: "560px", margin: "0 auto 48px" }}>
            Manage your tasks efficiently with Huly&apos;s bidirectional GitHub synchronization. Use Huly as an advanced front-end for GitHub Issues and GitHub Projects.
          </p>

          {/* Screenshot with glowing amber top edge (Image 2) */}
          <div className="screenshot-frame-custom" style={{ position: "relative", background: "var(--color-void)", height: "300px", borderTop: "2px solid var(--color-ember-pulse)", boxShadow: "0 -4px 30px rgba(255,137,100,0.15)" }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,137,100,0.12)", border: "1px solid var(--color-ember-pulse)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                🐙
              </div>
              <span style={{ fontSize: "13px", color: "var(--color-snow)", fontWeight: 600 }}>Active Sync Session</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6-COLUMN FEATURES GRID (Image 4) ─── */}
      <section className="dark-band" id="features" style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "40px" }}>
            {/* Feature 1 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ fontSize: "24px", color: "var(--color-electric-iris)" }}>🔀</div>
              <h3 style={{ fontFamily: "var(--font-esbuild)", fontSize: "20px", fontWeight: 600, color: "var(--color-snow)", letterSpacing: "-0.5px" }}>Two-way synchronization</h3>
              <p style={{ fontSize: "13px", color: "var(--color-smoke)", lineHeight: 1.6 }}>
                Integrate your task tracker with GitHub to sync changes instantly.
              </p>
            </div>
            {/* Feature 2 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ fontSize: "24px", color: "var(--color-electric-iris)" }}>🔒</div>
              <h3 style={{ fontFamily: "var(--font-esbuild)", fontSize: "20px", fontWeight: 600, color: "var(--color-snow)", letterSpacing: "-0.5px" }}>Private tasks</h3>
              <p style={{ fontSize: "13px", color: "var(--color-smoke)", lineHeight: 1.6 }}>
                Integration and management of multiple data repositories effectively.
              </p>
            </div>
            {/* Feature 3 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ fontSize: "24px", color: "var(--color-electric-iris)" }}>📚</div>
              <h3 style={{ fontFamily: "var(--font-esbuild)", fontSize: "20px", fontWeight: 600, color: "var(--color-snow)", letterSpacing: "-0.5px" }}>Multiple repositories</h3>
              <p style={{ fontSize: "13px", color: "var(--color-smoke)", lineHeight: 1.6 }}>
                Organize multiple projects for more effective planning and collaboration.
              </p>
            </div>
            {/* Feature 4 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ fontSize: "24px", color: "var(--color-electric-iris)" }}>🗺️</div>
              <h3 style={{ fontFamily: "var(--font-esbuild)", fontSize: "20px", fontWeight: 600, color: "var(--color-snow)", letterSpacing: "-0.5px" }}>Milestone migration</h3>
              <p style={{ fontSize: "13px", color: "var(--color-smoke)", lineHeight: 1.6 }}>
                Seamless migration of key project milestones between repositories.
              </p>
            </div>
            {/* Feature 5 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ fontSize: "24px", color: "var(--color-electric-iris)" }}>📈</div>
              <h3 style={{ fontFamily: "var(--font-esbuild)", fontSize: "20px", fontWeight: 600, color: "var(--color-snow)", letterSpacing: "-0.5px" }}>Track progress</h3>
              <p style={{ fontSize: "13px", color: "var(--color-smoke)", lineHeight: 1.6 }}>
                Keep track of GitHub contributions and changes within your workspace.
              </p>
            </div>
            {/* Feature 6 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ fontSize: "24px", color: "var(--color-electric-iris)" }}>🔍</div>
              <h3 style={{ fontFamily: "var(--font-esbuild)", fontSize: "20px", fontWeight: 600, color: "var(--color-snow)", letterSpacing: "-0.5px" }}>Advanced filtering</h3>
              <p style={{ fontSize: "13px", color: "var(--color-smoke)", lineHeight: 1.6 }}>
                Precise project data search with advanced filtering capabilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── UNMATCHED PRODUCTIVITY SECTION (Image 1 - Light Canvas Band) ─── */}
      <section className="light-band" style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "left", marginBottom: "56px" }}>
            <h2 style={{ fontFamily: "var(--font-esbuild)", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 700, color: "var(--color-obsidian-canvas)", letterSpacing: "-2px", marginBottom: "16px" }}>
              Unmatched productivity
            </h2>
            <p style={{ fontSize: "15px", color: "var(--color-obsidian-canvas)", opacity: 0.8, lineHeight: 1.6, maxWidth: "620px" }}>
              Huly is a process, project, time, and knowledge management platform that provides amazing collaboration opportunities for developers and product teams alike.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px", marginBottom: "24px" }} className="md:grid-cols-3">
            {/* Grid Item 1: Keyboard shortcuts (Image 1 Top Left) */}
            <div className="card-custom md:col-span-1" style={{ padding: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "380px" }}>
              <div style={{ position: "relative", height: "180px", background: "rgba(9,10,12,0.6)", borderRadius: "8px", border: "1px solid var(--color-slate-edge)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* Command menu mockup */}
                <div style={{ width: "80%", background: "#111", border: "1px solid #333", borderRadius: "6px", padding: "10px" }}>
                  <div style={{ fontSize: "10px", color: "var(--color-smoke)", marginBottom: "6px" }}>Run command...</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ fontSize: "12px", background: "var(--color-electric-iris)", padding: "4px 8px", borderRadius: "4px", display: "flex", justifyContent: "space-between" }}>
                      <span>Mark Task as Done</span>
                      <span style={{ opacity: 0.8 }}>⌘D</span>
                    </div>
                    <div style={{ fontSize: "12px", padding: "4px 8px", display: "flex", justifyContent: "space-between" }}>
                      <span>Open To Do List</span>
                      <span style={{ color: "var(--color-smoke)" }}>⌘T</span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "24px" }}>
                <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--color-snow)" }}>Keyboard shortcuts.</h4>
                <p style={{ fontSize: "13px", color: "var(--color-smoke)", marginTop: "4px" }}>Work efficiently with instant access to common actions.</p>
              </div>
            </div>

            {/* Grid Item 2: Team Planner (Image 1 Top Right) */}
            <div className="card-custom md:col-span-2" style={{ padding: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "380px" }}>
              <div style={{ position: "relative", height: "180px", background: "rgba(9,10,12,0.6)", borderRadius: "8px", border: "1px solid var(--color-slate-edge)", padding: "16px", overflow: "hidden" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "70%", margin: "0 auto" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-smoke)" }}>Today</div>
                  <div className="card-custom" style={{ padding: "10px", background: "var(--color-charcoal-card)" }}>
                    <TagChip color="#ff8964" text="High" />
                    <div style={{ fontSize: "12px", color: "var(--color-snow)", marginTop: "6px" }}>Implement new features according to project requirements</div>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "24px" }}>
                <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--color-snow)" }}>Team Planner.</h4>
                <p style={{ fontSize: "13px", color: "var(--color-smoke)", marginTop: "4px" }}>Keep track of the bigger picture by viewing all individual tasks in one centralized team calendar.</p>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }} className="md:grid-cols-3">
            {/* Grid Item 3: Design Meeting (Image 1 Bottom Left) */}
            <div className="card-custom md:col-span-2" style={{ padding: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "340px" }}>
              <div style={{ position: "relative", height: "160px", background: "rgba(9,10,12,0.6)", borderRadius: "8px", border: "1px solid var(--color-slate-edge)", padding: "16px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "70%", background: "var(--color-snow)", color: "var(--color-void)", padding: "12px", borderRadius: "8px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-smoke)" }}>03:00 - 04:00 pm</span>
                  <div style={{ fontSize: "13px", fontWeight: 700, marginTop: "2px" }}>Design meeting</div>
                  <button className="pill-button-filled" style={{ padding: "6px 12px", fontSize: "11px", marginTop: "8px" }}>Join Meeting</button>
                </div>
              </div>
              <div style={{ marginTop: "24px" }}>
                <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--color-snow)" }}>Design meetings.</h4>
                <p style={{ fontSize: "13px", color: "var(--color-smoke)", marginTop: "4px" }}>Weekly review and refinement of project prototypes.</p>
              </div>
            </div>

            {/* Grid Item 4: Notification Alarm Circle (Image 1 Bottom Right) */}
            <div className="card-custom md:col-span-1" style={{ padding: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "340px", alignItems: "center" }}>
              <div style={{ position: "relative", width: "120px", height: "120px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,137,100,0.15) 0%, transparent 70%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "var(--color-charcoal-card)", border: "1px solid var(--color-slate-edge)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                  🔔
                </div>
                <div style={{ position: "absolute", top: "16px", right: "16px", width: "18px", height: "18px", borderRadius: "50%", background: "#ff8964", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, color: "var(--color-snow)" }}>
                  2
                </div>
              </div>
              <div style={{ marginTop: "24px", textAlign: "center" }}>
                <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--color-snow)" }}>Real-time Alerts.</h4>
                <p style={{ fontSize: "13px", color: "var(--color-smoke)", marginTop: "4px" }}>Never miss critical operational updates.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION DIVIDER ─── */}
      <div className="section-divider" />

      {/* ─── METABRAIN MOSAIC SECTION (Image 5 - Light Canvas Band) ─── */}
      <section id="metabrain" className="linen-band" style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ fontFamily: "var(--font-esbuild)", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 700, color: "var(--color-obsidian-canvas)", letterSpacing: "-2px", marginBottom: "16px" }}>
              Huly MetaBrain
            </h2>
            <p style={{ fontSize: "15px", color: "var(--color-obsidian-canvas)", opacity: 0.8, lineHeight: 1.6, maxWidth: "560px", margin: "0 auto" }}>
              Connect every element of your workflow to build a dynamic knowledge base. Soon, Huly AI will turn it into a powerful asset — a second brain for your team.
            </p>
          </div>

          {/* Mosaic Grid Layout */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {/* Card 1: Take Notes */}
            <div className="card-custom" style={{ padding: "24px" }}>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-snow)" }}>Take notes.</span>
              <p style={{ fontSize: "12px", color: "var(--color-smoke)", marginTop: "4px", marginBottom: "16px" }}>Create documents to keep track of team resources</p>
              <div style={{ padding: "10px", background: "var(--color-void)", borderRadius: "6px", border: "1px solid var(--color-slate-edge)", fontSize: "11px", color: "var(--color-frost)" }}>
                📄 docs / team-handbook.md
              </div>
            </div>

            {/* Card 2: Create Tasks */}
            <div className="card-custom" style={{ padding: "24px" }}>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-snow)" }}>Create tasks.</span>
              <p style={{ fontSize: "12px", color: "var(--color-smoke)", marginTop: "4px", marginBottom: "16px" }}>Schedule your personal events and todos.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ fontSize: "11px", color: "var(--color-snow)", display: "flex", gap: "6px" }}>☑ Setup Qdrant DB</div>
                <div style={{ fontSize: "11px", color: "var(--color-smoke)", display: "flex", gap: "6px" }}>☐ Review contract draft</div>
              </div>
            </div>

            {/* Card 3: Plan Your Work */}
            <div className="card-custom" style={{ padding: "24px" }}>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-snow)" }}>Plan your work.</span>
              <p style={{ fontSize: "12px", color: "var(--color-smoke)", marginTop: "4px", marginBottom: "16px" }}>Visualize your workday in your planner.</p>
              <div style={{ padding: "10px", background: "var(--color-void)", borderRadius: "6px", border: "1px solid var(--color-slate-edge)", fontSize: "11px" }}>
                ⏰ 10:00 AM - Sprint Planning
              </div>
            </div>

            {/* Card 4: Date Counter Widget (Image 5 Circle signature) */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className="metabrain-circle">
                <span style={{ fontSize: "36px", fontWeight: 700, color: "var(--color-snow)", fontFamily: "var(--font-esbuild)" }}>08</span>
                <span style={{ fontSize: "12px", color: "var(--color-smoke)", marginTop: "2px" }}>March</span>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "var(--color-electric-iris)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "white", marginTop: "8px", fontWeight: 700 }}>+</div>
              </div>
            </div>

            {/* Card 5: Sync in Real Time */}
            <div className="card-custom col-span-1 md:col-span-2" style={{ padding: "24px" }}>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-snow)" }}>Sync in real time.</span>
              <p style={{ fontSize: "12px", color: "var(--color-smoke)", marginTop: "4px", marginBottom: "16px" }}>Connect with your team instantly to monitor progress and track updates.</p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div className="pill-button-filled" style={{ padding: "6px 14px" }}>
                  <MicIcon /> Join voice room
                </div>
                <div style={{ display: "flex", gap: "-6px" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#5683da", border: "1px solid var(--color-void)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>AN</div>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#ff8964", border: "1px solid var(--color-void)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>JS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="void-band" style={{ padding: "48px 24px", borderTop: "1px solid var(--color-slate-edge)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ display: "flex", gap: "2px" }}>
              <div style={{ width: "8px", height: "18px", backgroundColor: "var(--color-snow)", transform: "skewX(-15deg)" }} />
              <div style={{ width: "4px", height: "18px", backgroundColor: "var(--color-electric-iris)", transform: "skewX(-15deg)" }} />
              <div style={{ width: "8px", height: "18px", backgroundColor: "var(--color-snow)", transform: "skewX(-15deg)" }} />
            </div>
            <span style={{ fontFamily: "var(--font-esbuild)", fontWeight: 700, fontSize: "19px", color: "var(--color-snow)", letterSpacing: "-0.5px" }}>huly</span>
          </div>
          <span style={{ fontSize: "13px", color: "var(--color-smoke)" }}>© 2026 Huly Platforms Inc. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
