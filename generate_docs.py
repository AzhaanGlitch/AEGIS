import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether

def generate_pdf():
    pdf_filename = "/Users/yashgoyal/Documents/AEGIS/AEGIS_27_Agents_Architecture_Guide.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#1E1B4B'),
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#475569'),
        spaceAfter=15
    )

    cat_header_style = ParagraphStyle(
        'CategoryHeader',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=colors.HexColor('#4F46E5'),
        spaceBefore=14,
        spaceAfter=8
    )

    agent_title_style = ParagraphStyle(
        'AgentTitle',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=colors.HexColor('#0F172A'),
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#334155')
    )

    bold_label = ParagraphStyle(
        'BoldLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#1E293B')
    )

    elements = []

    # Title & Subtitle
    elements.append(Paragraph("AEGIS 27-Agent Architecture Guide", title_style))
    elements.append(Paragraph("Detailed Breakdown of Operations, Roles, Input/Output Pipelines, and LLM Provider Routing", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#E2E8F0'), spaceAfter=15))

    agents_data = [
        # Core Engineering
        {
            "category": "1. Core Engineering Suite",
            "agents": [
                {
                    "name": "Architect Agent",
                    "role": "Software & System Architect",
                    "provider": "NVIDIA NIM / Groq (Llama-3.1-70B)",
                    "workflow": "Analyzes system requirements, devises microservices architecture, schema designs, data flows, and tech stack trade-offs.",
                    "inputs": "Feature specs, user stories, scalability goals",
                    "outputs": "Architecture diagrams (Mermaid), API contracts, data flow specs"
                },
                {
                    "name": "Code Reviewer Agent",
                    "role": "Lead Code Reviewer & Security Auditor",
                    "provider": "NVIDIA NIM / Groq (Llama-3.1-70B)",
                    "workflow": "Audits PRs and codebases for bugs, anti-patterns, security flaws, performance bottlenecks, and adherence to style guides.",
                    "inputs": "Source code diffs, code files, PR descriptions",
                    "outputs": "Inline feedback, severity ratings (High/Med/Low), refactored code snippets"
                },
                {
                    "name": "Coder Agent",
                    "role": "Full-Stack Software Engineer",
                    "provider": "NVIDIA NIM / Groq (Llama-3.1-70B)",
                    "workflow": "Implements features, writes frontend components, backend APIs, database migrations, and complex algorithms.",
                    "inputs": "Technical requirements, function signatures, wireframes",
                    "outputs": "Production-ready code implementation with error handling"
                },
                {
                    "name": "Debugger Agent",
                    "role": "Root Cause Diagnostic Specialist",
                    "provider": "NVIDIA NIM / Groq (Llama-3.1-70B)",
                    "workflow": "Inspects stack traces, runtime logs, and exception dumps to pinpoint exact failure points and issue hotfixes.",
                    "inputs": "Error logs, exception tracebacks, failing code",
                    "outputs": "Root cause analysis, patch recommendation, bug fix"
                },
                {
                    "name": "DevOps Lead Agent",
                    "role": "Infrastructure & CI/CD Specialist",
                    "provider": "NVIDIA NIM / Groq (Llama-3.1-70B)",
                    "workflow": "Generates Dockerfiles, Kubernetes manifests, GitHub Action workflows, Terraform scripts, and deployment pipelines.",
                    "inputs": "Deployment target, environment requirements",
                    "outputs": "CI/CD YAML files, containerization scripts, IAC manifests"
                },
                {
                    "name": "Test Engineer Agent",
                    "role": "QA & Test Automation Specialist",
                    "provider": "Groq (Llama-3.1-8B-Instant)",
                    "workflow": "Generates unit tests, integration tests, end-to-end test scripts, edge-case assertions, and mock datasets.",
                    "inputs": "Source code files, API endpoint schemas",
                    "outputs": "PyTest / Jest test files, edge case matrices"
                },
                {
                    "name": "Ops Agent",
                    "role": "Site Reliability & Systems Ops Specialist",
                    "provider": "Groq (Llama-3.1-8B-Instant)",
                    "workflow": "Monitors system health metrics, configures Prometheus/Grafana alerts, and creates incident response runbooks.",
                    "inputs": "Server metrics, error rates, CPU/Memory logs",
                    "outputs": "Incident reports, alert configurations, runbooks"
                },
                {
                    "name": "LangChain Code Reviewer Agent",
                    "role": "LLM & Agent Pipeline Auditor",
                    "provider": "NVIDIA NIM / Groq (Llama-3.1-70B)",
                    "workflow": "Audits multi-agent pipelines, prompt templates, RAG vector retrieval, and token usage for efficiency and memory leaks.",
                    "inputs": "LangChain / LlamaIndex Python code",
                    "outputs": "Prompt optimizations, token reduction advice, pipeline refactoring"
                },
                {
                    "name": "Hello World Agent",
                    "role": "Instant Sanity & Latency Tester",
                    "provider": "Groq (Llama-3.1-8B-Instant)",
                    "workflow": "Executes ultra-fast sub-second ping tasks to test system latency, provider health, and basic API connectivity.",
                    "inputs": "Simple ping query or heartbeat test",
                    "outputs": "Sub-second status JSON, latency metrics"
                }
            ]
        },
        # Planning & Management
        {
            "category": "2. Planning & Management Suite",
            "agents": [
                {
                    "name": "Orchestrator Agent",
                    "role": "Central Task Classifier & Router",
                    "provider": "NVIDIA NIM / Groq (Llama-3.1-70B)",
                    "workflow": "Analyzes raw user prompts, classifies task intent, dynamically routes execution to the best agent, and formats final output.",
                    "inputs": "Unstructured user prompts or multi-step tasks",
                    "outputs": "Target agent selection, execution plan, synthesized response"
                },
                {
                    "name": "Planner Agent",
                    "role": "Agile Project Planner & Roadmap Strategist",
                    "provider": "NVIDIA NIM / Groq (Llama-3.1-70B)",
                    "workflow": "Deconstructs large project goals into sprints, epics, user stories, task dependencies, and milestone schedules.",
                    "inputs": "Project PRDs, high-level business goals",
                    "outputs": "Sprint breakdowns, Gantt chart structures, Kanban tasks"
                },
                {
                    "name": "Project / Meeting Assistant Agent",
                    "role": "Meeting Summarizer & Action Item Tracker",
                    "provider": "Groq (Llama-3.1-8B-Instant)",
                    "workflow": "Parses meeting transcripts, notes, and discussions to extract decisions, assignees, deadlines, and executive summaries.",
                    "inputs": "Raw meeting transcripts, audio notes",
                    "outputs": "Bullet-point meeting summaries, action items with owners"
                }
            ]
        },
        # Business & Support
        {
            "category": "3. Business & Support Suite",
            "agents": [
                {
                    "name": "Customer Support Agent",
                    "role": "Real-Time Support Representative",
                    "provider": "Groq (Llama-3.1-8B-Instant)",
                    "workflow": "Provides immediate, empathetic, customer-facing resolution for product inquiries, billing questions, and troubleshooting.",
                    "inputs": "User support tickets, chat inquiries",
                    "outputs": "Empathetic resolution messages, escalation flags"
                },
                {
                    "name": "Sales Assistant Agent",
                    "role": "B2B Sales & Lead Qualification Specialist",
                    "provider": "Groq / HuggingFace (Mixtral-8x7B)",
                    "workflow": "Drafts cold outreach emails, qualifies incoming leads, generates sales pitch decks, and crafts objection-handling scripts.",
                    "inputs": "Lead profiles, product value propositions",
                    "outputs": "Personalized email sequences, lead qualification scores"
                },
                {
                    "name": "HR / Recruiter Agent",
                    "role": "Talent Acquisition & HR Policy Specialist",
                    "provider": "Groq / HuggingFace (Mixtral-8x7B)",
                    "workflow": "Generates job descriptions, screens candidate resumes against role criteria, and answers employee HR policy queries.",
                    "inputs": "Resumes, job requirement specifications",
                    "outputs": "Candidate match reports, interview questions, job posts"
                },
                {
                    "name": "Legal Agent",
                    "role": "Corporate & Compliance Legal Specialist",
                    "provider": "NVIDIA NIM / Groq (Llama-3.1-70B)",
                    "workflow": "Reviews contracts, terms of service, privacy policies, NDAs, and regulatory compliance guidelines for legal risks.",
                    "inputs": "Contracts, terms documents, regulatory text",
                    "outputs": "Risk assessments, clause redlines, compliance checklists"
                },
                {
                    "name": "Marketing Agent",
                    "role": "Growth & Campaign Marketing Strategist",
                    "provider": "Groq / HuggingFace (Mixtral-8x7B)",
                    "workflow": "Creates ad copy, social media campaigns, SEO strategies, content calendars, and brand messaging strategies.",
                    "inputs": "Target demographics, campaign objectives",
                    "outputs": "Ad copies, content calendars, SEO keyword maps"
                },
                {
                    "name": "Finance Agent",
                    "role": "Financial Analyst & Budget Planner",
                    "provider": "NVIDIA NIM / Groq (Llama-3.1-70B)",
                    "workflow": "Analyzes balance sheets, cash flow statements, project budgets, unit economics, and detects spending anomalies.",
                    "inputs": "Financial spreadsheets, revenue data",
                    "outputs": "Forecast tables, anomaly alerts, budget variance reports"
                }
            ]
        },
        # Specialized / Utility
        {
            "category": "4. Specialized & Utility Suite",
            "agents": [
                {
                    "name": "Doc Writer Agent",
                    "role": "Technical Documentation Specialist",
                    "provider": "NVIDIA NIM / Groq (Llama-3.1-70B)",
                    "workflow": "Produces clean, comprehensive technical documentation, API reference guides, Swagger specs, and README files.",
                    "inputs": "Code repositories, API schemas",
                    "outputs": "Markdown documentation files, OpenAPI specs"
                },
                {
                    "name": "Writer Agent",
                    "role": "Creative Content & Copywriter",
                    "provider": "Groq / HuggingFace (Mixtral-8x7B)",
                    "workflow": "Drafts long-form blog posts, whitepapers, thought leadership articles, newsletters, and engaging stories.",
                    "inputs": "Topic outlines, target audience guidelines",
                    "outputs": "Polished articles, newsletters, stories"
                },
                {
                    "name": "Email Assistant Agent",
                    "role": "Executive Communication Specialist",
                    "provider": "Groq (Llama-3.1-8B-Instant)",
                    "workflow": "Drafts, refines, and formats professional emails, executive announcements, follow-ups, and inbox replies.",
                    "inputs": "Rough notes, email thread history",
                    "outputs": "Polished email drafts with subject lines"
                },
                {
                    "name": "Translator Agent",
                    "role": "Polyglot Localization Specialist",
                    "provider": "Groq (Llama-3.1-8B-Instant)",
                    "workflow": "Translates text across 50+ languages while preserving technical accuracy, cultural nuances, and context.",
                    "inputs": "Source text, target language, context notes",
                    "outputs": "Accurately localized translated text"
                },
                {
                    "name": "Travel Planner Agent",
                    "role": "Itinerary & Travel Concierge",
                    "provider": "Groq / HuggingFace",
                    "workflow": "Builds customized travel itineraries, flight/hotel recommendations, budget breakdowns, and daily schedules.",
                    "inputs": "Destination, duration, budget, preferences",
                    "outputs": "Day-by-day itineraries, cost breakdowns"
                },
                {
                    "name": "Health Tracker Agent",
                    "role": "Wellness & Fitness Coach",
                    "provider": "Groq / HuggingFace",
                    "workflow": "Tracks workouts, nutrition plans, calorie budgets, sleep metrics, and generates personalized fitness schedules.",
                    "inputs": "Fitness goals, dietary restrictions, workout logs",
                    "outputs": "Structured meal plans, exercise routines"
                },
                {
                    "name": "Home Automation Agent",
                    "role": "Smart Home & IoT Controller",
                    "provider": "Groq (Llama-3.1-8B-Instant)",
                    "workflow": "Writes Home Assistant YAML configurations, Zigbee routines, Node-RED flows, and IoT automation scripts.",
                    "inputs": "Smart devices list, desired automation triggers",
                    "outputs": "Home Assistant YAML, automation logic"
                }
            ]
        },
        # Skill-Creator Suite
        {
            "category": "5. Skill-Creator Suite",
            "agents": [
                {
                    "name": "Analyzer Agent",
                    "role": "Deep Pattern & Skill Data Deconstructor",
                    "provider": "NVIDIA NIM / Groq (Llama-3.1-70B)",
                    "workflow": "Deconstructs dataset inputs, prompt patterns, and workflows to extract core skills and reusable templates.",
                    "inputs": "Raw execution logs, prompt datasets",
                    "outputs": "Skill blueprints, prompt templates, pattern maps"
                },
                {
                    "name": "Comparator Agent",
                    "role": "Side-by-Side Evaluation Specialist",
                    "provider": "NVIDIA NIM / Groq (Llama-3.1-70B)",
                    "workflow": "Compares multi-model responses, alternative code solutions, or prompt versions to identify pros, cons, and diffs.",
                    "inputs": "Two or more solution candidates / responses",
                    "outputs": "Comparison matrix, differential analysis"
                },
                {
                    "name": "Grader Agent",
                    "role": "Automated Quality Assessment & Scoring",
                    "provider": "NVIDIA NIM / Groq (Llama-3.1-70B)",
                    "workflow": "Evaluates agent outputs against strict rubric criteria, assigning numerical quality scores and improvement suggestions.",
                    "inputs": "Agent response output, target evaluation rubric",
                    "outputs": "Quality scores (0-100), rubric breakdown, fix suggestions"
                }
            ]
        }
    ]

    for cat in agents_data:
        elements.append(Paragraph(cat["category"], cat_header_style))
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#C7D2FE'), spaceAfter=8))

        for agent in cat["agents"]:
            table_data = [
                [
                    Paragraph(f"<b>{agent['name']}</b>", agent_title_style),
                    Paragraph(f"<b>Role:</b> {agent['role']} | <b>Provider:</b> {agent['provider']}", body_style)
                ],
                [
                    Paragraph("<b>How it Works:</b>", bold_label),
                    Paragraph(agent['workflow'], body_style)
                ],
                [
                    Paragraph("<b>Input Data:</b>", bold_label),
                    Paragraph(agent['inputs'], body_style)
                ],
                [
                    Paragraph("<b>Output Data:</b>", bold_label),
                    Paragraph(agent['outputs'], body_style)
                ]
            ]

            t = Table(table_data, colWidths=[100, 440])
            t.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F8FAFC')),
                ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
                ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#EDF2F7')),
                ('TOPPADDING', (0, 0), (-1, -1), 4),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
                ('LEFTPADDING', (0, 0), (-1, -1), 6),
                ('RIGHTPADDING', (0, 0), (-1, -1), 6),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ]))

            elements.append(KeepTogether([t, Spacer(1, 8)]))

    doc.build(elements)
    print("PDF generated successfully:", pdf_filename)

if __name__ == "__main__":
    generate_pdf()
