"""
Payments Router — Stripe integration for billing and subscriptions.
Uses Stripe test mode keys only.
"""

import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from config import settings

router = APIRouter(prefix="/payments", tags=["Payments"])
logger = logging.getLogger("AEGIS_Payments")


class CheckoutSession(BaseModel):
    price_id: str
    success_url: str = "http://localhost:3000/dashboard?payment=success"
    cancel_url: str = "http://localhost:3000/dashboard?payment=cancelled"
    customer_email: str = ""


class PortalRequest(BaseModel):
    customer_id: str
    return_url: str = "http://localhost:3000/dashboard"


def _get_stripe():
    if not settings.STRIPE_SECRET_KEY:
        raise HTTPException(status_code=503, detail="STRIPE_SECRET_KEY not configured.")
    try:
        import stripe
        stripe.api_key = settings.STRIPE_SECRET_KEY
        return stripe
    except ImportError:
        raise HTTPException(status_code=500, detail="stripe package not installed.")


@router.get("/plans")
async def list_plans():
    """Return available AEGIS subscription plans."""
    return {
        "plans": [
            {"id": "starter",    "name": "Starter",    "price": "$0/month",  "features": ["3 Agents", "5 Documents", "500 queries/mo"]},
            {"id": "pro",        "name": "Pro",         "price": "$49/month", "features": ["All Agents", "Unlimited Docs", "5,000 queries/mo", "SendGrid alerts"]},
            {"id": "enterprise", "name": "Enterprise",  "price": "Custom",    "features": ["White-label", "SLA", "Dedicated cluster", "HubSpot CRM sync"]},
        ]
    }


@router.post("/create-checkout-session")
async def create_checkout_session(payload: CheckoutSession):
    """Create a Stripe Checkout session for upgrading a subscription plan."""
    stripe = _get_stripe()
    try:
        session_params = {
            "payment_method_types": ["card"],
            "line_items": [{"price": payload.price_id, "quantity": 1}],
            "mode": "subscription",
            "success_url": payload.success_url,
            "cancel_url": payload.cancel_url,
        }
        if payload.customer_email:
            session_params["customer_email"] = payload.customer_email
        session = stripe.checkout.Session.create(**session_params)
        return {"session_id": session.id, "checkout_url": session.url}
    except Exception as e:
        logger.error("Stripe checkout error: %s", e)
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/customer-portal")
async def create_customer_portal(payload: PortalRequest):
    """Create a Stripe billing portal session for subscription management."""
    stripe = _get_stripe()
    try:
        session = stripe.billing_portal.Session.create(
            customer=payload.customer_id,
            return_url=payload.return_url,
        )
        return {"portal_url": session.url}
    except Exception as e:
        logger.error("Stripe portal error: %s", e)
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/subscription/{customer_id}")
async def get_subscription_status(customer_id: str):
    """Get the active subscription status for a customer."""
    stripe = _get_stripe()
    try:
        subscriptions = stripe.Subscription.list(customer=customer_id, limit=1)
        if subscriptions.data:
            sub = subscriptions.data[0]
            return {
                "status": sub.status,
                "plan": sub["items"].data[0].price.nickname or "Pro",
                "current_period_end": sub.current_period_end,
            }
        return {"status": "no_subscription", "plan": "Starter"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
