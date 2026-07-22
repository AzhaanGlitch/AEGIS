import sys
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_pdf():
    pdf_filename = "/Users/yashgoyal/Documents/AEGIS/AEGIS_System_Overview.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette (AEGIS Dark/Sleek Theme adapted for PDF)
    PRIMARY = colors.HexColor("#0f172a")      # Dark Slate
    ACCENT = colors.HexColor("#4f46e5")       # Indigo/Violet
    TEAL = colors.HexColor("#0d9488")         # Dark Teal
    TEXT_COLOR = colors.HexColor("#1e293b")   # Charcoal
    LIGHT_BG = colors.HexColor("#f8fafc")     # Light Cool Grey
    BORDER_COLOR = colors.HexColor("#e2e8f0")

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=PRIMARY,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=14,
        textColor=ACCENT,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=PRIMARY,
        spaceBefore=14,
        spaceAfter=8
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=TEXT_COLOR,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=body_style,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=4
    )

    story = []

    # Document Header
    story.append(Paragraph("AEGIS // Autonomous Multi-Agent Intelligence System", title_style))
    story.append(Paragraph("System Capability Audit, Architecture Overview & Improvement Roadmap", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=ACCENT, spaceBefore=0, spaceAfter=15))

    # Section 1: AEGIS Kya Hai?
    story.append(Paragraph("1. AEGIS Kya Hai? (Executive Summary)", h1_style))
    story.append(Paragraph(
        "<b>AEGIS</b> ek next-generation <b>Autonomous Enterprise Intelligence & Multi-Agent Orchestration Platform</b> hai. "
        "Yeh business workflows, enterprise data, aur daily operational decision-making ko AI agents ki network mesh dwara handle karne ke liye banaya gaya hai.",
        body_style
    ))
    story.append(Spacer(1, 8))

    # Section 2: Core Capabilities
    story.append(Paragraph("2. AEGIS me Kya-Kya Features Working Hain?", h1_style))

    caps_data = [
        [Paragraph("<b>Component / Module</b>", body_style), Paragraph("<b>Status & Key Capabilities</b>", body_style)],
        [
            Paragraph("<b>27-Agent Orchestrator Mesh</b>", body_style),
            Paragraph("Multi-LLM routing (Groq Llama 3.3, NVIDIA NIM, HuggingFace). Prompts ke intent ko auto-classify karke specialized agents (Coder, DevOps, Architect, Sales, etc.) ko tasks automatically delegate karta hai.", body_style)
        ],
        [
            Paragraph("<b>Workspace RAG Chat</b>", body_style),
            Paragraph("Live streaming WebSocket chat (`ws://localhost:8000/api/v1/chat/stream`). High-speed vector search powered by Qdrant DB for citing sources in answers.", body_style)
        ],
        [
            Paragraph("<b>Document Ingestion Pipeline</b>", body_style),
            Paragraph("PDF/TXT document upload, chunking, and embedding creation stored directly into PostgreSQL (Neon DB) & Qdrant.", body_style)
        ],
        [
            Paragraph("<b>Real-Time Metal Rates Integration</b>", body_style),
            Paragraph("Real-time Gold & Silver live rate tracking from external financial APIs with automatic currency conversion (INR).", body_style)
        ],
        [
            Paragraph("<b>Role-Based Access Control (RBAC)</b>", body_style),
            Paragraph("Customizable access profiles for Founder, Sales Manager, Marketing, Finance, and Support tiers.", body_style)
        ],
    ]

    t_caps = Table(caps_data, colWidths=[2.0 * inch, 5.0 * inch])
    t_caps.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), LIGHT_BG),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_caps)
    story.append(Spacer(1, 12))

    # Section 3: Current Limitations (Lackings)
    story.append(Paragraph("3. Abhi Kya-Kya Lackings & Mock Data Parts Hain?", h1_style))
    story.append(Paragraph("• <b>Stripe & HubSpot BI Feeds:</b> Dashboard yield metrics fallback mock JSON data par chal rahe hain jab tak environment keys (Stripe API / HubSpot Key) production mode me live attach nahi ki jaati.", bullet_style))
    story.append(Paragraph("• <b>Agent Sequential Workflows:</b> Multi-agent pipeline concurrent execution generate karti hai, par complex long-running persistent memory graphs (like LangGraph execution traces) abhi in-memory handled hain.", bullet_style))
    story.append(Paragraph("• <b>Live Database Auth:</b> User login and onboarding local app state me persistent authentication cookies ke bajaye standard JWT session token fallback run kar rahi hai.", bullet_style))
    story.append(Paragraph("• <b>Customer Support Automation:</b> Support tickets board resolution draft toh generate kar leta hai, par live Zendesk/Intercom integration pending hai.", bullet_style))

    story.append(Spacer(1, 12))

    # Section 4: Future Improvements Roadmap
    story.append(Paragraph("4. AEGIS me Kya-Kya Improvements Ki Ja Sakti Hain?", h1_style))
    
    improvements_data = [
        [Paragraph("<b>Priority Area</b>", body_style), Paragraph("<b>Proposed Enhancements & Action Plan</b>", body_style)],
        [
            Paragraph("<b>1. Production BI Connectors</b>", body_style),
            Paragraph("Stripe Webhooks & HubSpot OAuth sync set up karke live revenue analytics aur lead pipelines connect karna.", body_style)
        ],
        [
            Paragraph("<b>2. Persistent Agent Memory Graph</b>", body_style),
            Paragraph("LangGraph / Redis Checkpointers introduce karke persistent conversation states aur multi-turn agent execution memory store karna.", body_style)
        ],
        [
            Paragraph("<b>3. Automated Action Execution</b>", body_style),
            Paragraph("Agents ko sirf code/text response dene tak simit na rakh kar actual API execution (e.g. automatic Email dispatch, GitHub Commit push) capabilities dena.", body_style)
        ],
        [
            Paragraph("<b>4. Advanced Multi-Modal Ingestion</b>", body_style),
            Paragraph("Excel (XLSX), CSV financial ledgers, audio meeting transcripts, aur images ki automatic vision-parsing RAG pipeline start karna.", body_style)
        ],
    ]

    t_imp = Table(improvements_data, colWidths=[2.0 * inch, 5.0 * inch])
    t_imp.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), LIGHT_BG),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_imp)

    doc.build(story)
    print("PDF generated successfully at:", pdf_filename)

if __name__ == "__main__":
    generate_pdf()
