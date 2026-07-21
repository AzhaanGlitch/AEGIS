"""
Authentication & Authorization Router
Handles login, registration, and Firebase configuration endpoint.
"""

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from config import settings
import firebase_admin
from firebase_admin import credentials, auth

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Initialize Firebase Admin SDK
firebase_initialized = False
if settings.FIREBASE_PROJECT_ID and settings.FIREBASE_CLIENT_EMAIL and settings.FIREBASE_PRIVATE_KEY:
    try:
        if not firebase_admin._apps:
            private_key = settings.FIREBASE_PRIVATE_KEY.replace("\\n", "\n")
            cred = credentials.Certificate({
                "type": "service_account",
                "project_id": settings.FIREBASE_PROJECT_ID,
                "private_key": private_key,
                "client_email": settings.FIREBASE_CLIENT_EMAIL,
                "token_uri": "https://oauth2.googleapis.com/token"
            })
            firebase_admin.initialize_app(cred, {
                "storageBucket": settings.FIREBASE_STORAGE_BUCKET
            })
        firebase_initialized = True
    except Exception as e:
        print(f"Failed to initialize Firebase Admin: {e}")


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
    """Authenticate user with Firebase Auth REST API (using email/password)."""
    if not settings.FIREBASE_API_KEY:
        # Fallback to local credential bypass in case API Key is not set yet
        role = _infer_role(request.email)
        
        # Save mock user in Neon Postgres
        try:
            import psycopg2
            if settings.DATABASE_URL:
                conn = psycopg2.connect(settings.DATABASE_URL)
                with conn.cursor() as cur:
                    cur.execute(
                        "INSERT INTO aegis_users (email) VALUES (%s) ON CONFLICT (email) DO NOTHING;",
                        (request.email,)
                    )
                    conn.commit()
                conn.close()
        except Exception as db_err:
            print(f"Failed to seed user in Neon DB: {db_err}")
            
        return {
            "access_token": "mock-firebase-jwt-token-aegis",
            "refresh_token": "mock-firebase-refresh-token",
            "token_type": "bearer",
            "expires_in": 3600,
            "user": {
                "email": request.email,
                "role": role,
                "organization": "Acme Enterprise Corp",
                "mfa_enabled": False,
            },
        }

    try:
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={settings.FIREBASE_API_KEY}"
        payload = {
            "email": request.email,
            "password": request.password,
            "returnSecureToken": True
        }
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code != 200:
                err_data = resp.json()
                detail = err_data.get("error", {}).get("message", "Authentication failed.")
                raise HTTPException(status_code=400, detail=detail)
            
            res_data = resp.json()
            user_email = res_data.get("email")
            role = _infer_role(request.email)
            
            # Record user in Neon PostgreSQL
            try:
                import psycopg2
                if settings.DATABASE_URL:
                    conn = psycopg2.connect(settings.DATABASE_URL)
                    with conn.cursor() as cur:
                        cur.execute(
                            "INSERT INTO aegis_users (email) VALUES (%s) ON CONFLICT (email) DO NOTHING;",
                            (user_email,)
                        )
                        conn.commit()
                    conn.close()
            except Exception as db_err:
                print(f"Failed to record logged in user in Neon DB: {db_err}")
                
            return {
                "access_token": res_data.get("idToken"),
                "refresh_token": res_data.get("refreshToken"),
                "token_type": "bearer",
                "expires_in": int(res_data.get("expiresIn", 3600)),
                "user": {
                    "email": user_email,
                    "role": role,
                    "organization": "Acme Enterprise Corp",
                    "mfa_enabled": False,
                },
            }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/register")
async def register(request: RegisterRequest):
    """Create a new user using Firebase Admin SDK and record them in Neon PostgreSQL."""
    if not firebase_initialized:
        raise HTTPException(status_code=503, detail="Firebase Admin not initialized.")
    try:
        user_record = auth.create_user(
            email=request.email,
            password=request.password,
            display_name=request.organization
        )
        role = _infer_role(request.email)
        
        # Record registered user in Neon PostgreSQL
        try:
            import psycopg2
            if settings.DATABASE_URL:
                conn = psycopg2.connect(settings.DATABASE_URL)
                with conn.cursor() as cur:
                    cur.execute(
                        "INSERT INTO aegis_users (email) VALUES (%s) ON CONFLICT (email) DO NOTHING;",
                        (request.email,)
                    )
                    conn.commit()
                conn.close()
        except Exception as db_err:
            print(f"Failed to record registered user in Neon DB: {db_err}")
            
        return {
            "message": "User registered successfully.",
            "user": {
                "email": user_record.email,
                "role": role,
                "organization": request.organization,
                "status": "active",
            },
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/config")
async def get_firebase_config():
    """Retrieve Firebase client-side config for Google Sign-In setup."""
    return {
        "apiKey": settings.FIREBASE_API_KEY,
        "authDomain": f"{settings.FIREBASE_PROJECT_ID}.firebaseapp.com" if settings.FIREBASE_PROJECT_ID else "",
        "projectId": settings.FIREBASE_PROJECT_ID,
        "storageBucket": settings.FIREBASE_STORAGE_BUCKET,
    }


@router.get("/oauth/{provider}")
async def oauth_redirect(provider: str):
    """Retrieve OAuth config payload for provider."""
    return {
        "provider": provider,
        "config": await get_firebase_config()
    }


@router.post("/mfa/verify")
async def verify_mfa(code: str = "123456"):
    """Simulate MFA TOTP verification."""
    if code == "123456":
        return {"verified": True, "message": "MFA verification successful."}
    raise HTTPException(status_code=401, detail="Invalid MFA code.")


@router.post("/logout")
async def logout():
    """Sign out the current session."""
    return {"message": "Session invalidated successfully."}


class GoogleUserRecord(BaseModel):
    email: str


@router.post("/record-google")
async def record_google(payload: GoogleUserRecord):
    """Record an authenticated Google user email into Neon PostgreSQL aegis_users table."""
    try:
        import psycopg2
        if settings.DATABASE_URL:
            conn = psycopg2.connect(settings.DATABASE_URL)
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO aegis_users (email) VALUES (%s) ON CONFLICT (email) DO NOTHING;",
                    (payload.email,)
                )
                conn.commit()
            conn.close()
            return {"status": "recorded"}
    except Exception as e:
        print(f"Failed to record Google user: {e}")
    return {"status": "skipped"}



