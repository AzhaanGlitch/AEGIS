"""
Dashboard Feeds Router
Provides data endpoints for BI boards, Sales pipeline, Campaigns spend, and Support tickets.
"""

from fastapi import APIRouter
from agents.finance import FinanceAgent

router = APIRouter(prefix="/dashboard", tags=["Dashboard Feeds"])
finance_agent = FinanceAgent()

@router.get("/founder")
async def get_founder_dashboard():
    """Retrieve adaptive KPI metrics and coordination activity logs for the Founder."""
    return {
        "metrics": {
            "revenue": "$1,245,800",
            "revenueGrowth": "+14.2% MoM",
            "activeUsers": "14,890",
            "userGrowth": "+8.4%",
            "dealsClosed": "342",
            "anomalyAlerts": "1"
        },
        "recentActivity": [
            {"time": "10 mins ago", "type": "agent", "msg": "CEO Agent coordinated with Sales Agent to output Q3 forecast."},
            {"time": "1 hour ago", "type": "system", "msg": "Document ingestion complete: Q2_Financial_Report.pdf (82 pages)"},
            {"time": "3 hours ago", "type": "user", "msg": "Sales Manager drafted outbound campaign for lead 'Apex Logistics'"}
        ]
    }

@router.get("/sales")
async def get_sales_dashboard():
    """Retrieve HubSpot pipeline value, scored leads list, and calendar demo events."""
    return {
        "pipelineValue": "$842,500",
        "weightedValue": "$512,000",
        "dealsCount": 42,
        "meetingsCount": 5,
        "leads": [
            {"id": "L1", "name": "Apex Logistics Corp", "score": 92, "status": "Hot", "value": "$120,000"},
            {"id": "L2", "name": "Stellar Systems LLC", "score": 85, "status": "Warm", "value": "$75,000"},
            {"id": "L3", "name": "Omni Global Group", "score": 79, "status": "Warm", "value": "$95,000"},
            {"id": "L4", "name": "Pinnacle Tech", "score": 45, "status": "Cold", "value": "$50,000"}
        ],
        "meetings": [
            {"id": "M1", "time": "10:30 AM", "title": "Apex Logistics Demo", "duration": "45m", "status": "Ready (Brief Generated)"},
            {"id": "M2", "time": "2:00 PM", "title": "Stellar Systems Negotiation", "duration": "1h", "status": "Ready (Brief Generated)"}
        ]
    }

@router.get("/marketing")
async def get_marketing_dashboard():
    """Retrieve marketing campaign spends and channels performance details."""
    return {
        "kpis": {
            "totalSpend": "$45,000",
            "mqls": "1,240",
            "cpl": "$36.29",
            "roi": "342%"
        },
        "channels": [
            {"name": "Google Ads", "spend": "$18,000", "leads": 520, "roi": "290%"},
            {"name": "LinkedIn Ads", "spend": "$15,000", "leads": 390, "roi": "380%"},
            {"name": "SEO & Organic", "spend": "$7,000", "leads": 280, "roi": "510%"}
        ]
    }

@router.get("/finance")
async def get_finance_dashboard():
    """Retrieve budget inflows, outflows, and scanned ledger anomalies."""
    return {
        "cashFlow": {
            "cashIn": "$320,000",
            "cashOut": "$210,000",
            "netBurn": "-$110,000 (Positive)"
        },
        "anomalies": finance_agent.scan_anomalies(),
        "forecast": [
            {"month": "July", "base": 340000, "optimistic": 380000, "pessimistic": 310000},
            {"month": "Aug", "base": 365000, "optimistic": 420000, "pessimistic": 320000},
            {"month": "Sept", "base": 390000, "optimistic": 470000, "pessimistic": 330000}
        ]
    }

@router.get("/support")
async def get_support_dashboard():
    """Retrieve Zendesk ticket counts and suggested resolution briefs."""
    return {
        "ticketStats": {
            "open": 18,
            "critical": 3,
            "avgResolution": "1.8 hrs"
        },
        "tickets": [
            {"id": "T101", "subject": "Billing issue with invoice INV-882", "priority": "High", "customer": "Stellar Systems", "suggestedAction": "Refund the duplicate payment processing fee."},
            {"id": "T102", "subject": "API Timeout on /search endpoint", "priority": "Critical", "customer": "Apex Logistics", "suggestedAction": "Check Qdrant collection performance; retry connection."}
        ]
    }
