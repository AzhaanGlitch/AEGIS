"""
Authentication & Authorization Router
Handles login, OAuth simulation, MFA, and session management.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Authentication"])


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    email: str
    password: str
    organization: str = "Acme Enterprise Corp"


ROLE_MAP = {
    "sales": "Sales Mgr",
    "marketing": "Marketing Mgr",
    "hr": "HR",
    "finance": "Finance",
    "support": "Support",
    "customer": "Support",
    "admin": "Admin",
}


def _infer_role(email: str) -> str:
    email_lower = email.lower()
    for keyword, role in ROLE_MAP.items():
        if keyword in email_lower:
            return role
    return "Founder"


@router.post("/login")
async def login(request: LoginRequest):
    """Authenticate user and return a mock JWT + role assignment."""
    role = _infer_role(request.email)
    return {
        "access_token": "mock-jwt-token-aegis-12345",
        "refresh_token": "mock-refresh-token-aegis-67890",
        "token_type": "bearer",
        "expires_in": 900,  # 15 minutes
        "user": {
            "email": request.email,
            "role": role,
            "organization": "Acme Enterprise Corp",
            "mfa_enabled": role in ("Founder", "Admin"),
        },
    }


@router.post("/register")
async def register(request: RegisterRequest):
    """Register a new user and send verification email (mock)."""
    role = _infer_role(request.email)
    return {
        "message": "Verification email sent. Please check your inbox.",
        "user": {
            "email": request.email,
            "role": role,
            "organization": request.organization,
            "status": "pending_verification",
        },
    }


@router.get("/oauth/{provider}")
async def oauth_redirect(provider: str):
    """Simulate OAuth SSO redirect for Google, GitHub, Microsoft."""
    supported = ["google", "github", "microsoft"]
    if provider.lower() not in supported:
        raise HTTPException(status_code=400, detail=f"Provider '{provider}' not supported. Use: {supported}")
    return {
        "redirect_url": f"https://accounts.{provider}.com/o/oauth2/v2/auth?client_id=AEGIS_MOCK",
        "provider": provider,
    }


@router.post("/mfa/verify")
async def verify_mfa(code: str = "123456"):
    """Simulate MFA TOTP verification."""
    if code == "123456":
        return {"verified": True, "message": "MFA verification successful."}
    raise HTTPException(status_code=401, detail="Invalid MFA code.")


@router.post("/logout")
async def logout():
    """Invalidate session token (mock)."""
    return {"message": "Session invalidated successfully."}
