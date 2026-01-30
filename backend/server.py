from fastapi import FastAPI, APIRouter, HTTPException, status
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import hashlib

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="FounderFund API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Mailchimp configuration (optional)
MAILCHIMP_API_KEY = os.environ.get('MAILCHIMP_API_KEY')
MAILCHIMP_SERVER_PREFIX = os.environ.get('MAILCHIMP_SERVER_PREFIX')
MAILCHIMP_AUDIENCE_ID = os.environ.get('MAILCHIMP_AUDIENCE_ID')

# Initialize Mailchimp client if configured
mailchimp_client = None
if MAILCHIMP_API_KEY and MAILCHIMP_SERVER_PREFIX:
    try:
        import mailchimp_marketing as MailchimpMarketing
        mailchimp_client = MailchimpMarketing.Client()
        mailchimp_client.set_config({
            "api_key": MAILCHIMP_API_KEY,
            "server": MAILCHIMP_SERVER_PREFIX
        })
    except Exception as e:
        logging.warning(f"Mailchimp not configured: {e}")

# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class WaitlistSignup(BaseModel):
    email: EmailStr
    role: str = Field(..., description="Founder, Investor, or Fund")
    founder_stage: Optional[str] = Field(None, description="Idea, MVP, Revenue, Growth")
    funding_stage: Optional[str] = Field(None, description="Pre-seed, Seed, Series A, Later")
    biggest_pain: str = Field(..., description="Selected pain point from dropdown")
    detailed_pain: Optional[str] = Field(None, description="Free-text detailed response")

class WaitlistSignupResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str
    email: str
    role: str
    created_at: str
    mailchimp_synced: bool

class WaitlistStats(BaseModel):
    total_signups: int
    founders: int
    investors: int
    funds: int

# Routes
@api_router.get("/")
async def root():
    return {"message": "FounderFund API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

@api_router.post("/waitlist", response_model=WaitlistSignupResponse, status_code=status.HTTP_201_CREATED)
async def signup_waitlist(signup: WaitlistSignup):
    """Add a user to the FounderFund waitlist"""
    
    # Check if email already exists
    existing = await db.waitlist.find_one({"email": signup.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This email is already on our waitlist. We'll be in touch soon!"
        )
    
    # Create waitlist entry
    signup_id = str(uuid.uuid4())
    created_at = datetime.now(timezone.utc)
    
    doc = {
        "id": signup_id,
        "email": signup.email,
        "role": signup.role,
        "founder_stage": signup.founder_stage,
        "funding_stage": signup.funding_stage,
        "biggest_pain": signup.biggest_pain,
        "detailed_pain": signup.detailed_pain,
        "created_at": created_at.isoformat(),
        "mailchimp_id": None,
        "mailchimp_status": None
    }
    
    # Add to Mailchimp if configured
    mailchimp_synced = False
    if mailchimp_client and MAILCHIMP_AUDIENCE_ID:
        try:
            from mailchimp_marketing.api_client import ApiClientError
            
            member_data = {
                "email_address": signup.email,
                "status": "pending",
                "merge_fields": {
                    "ROLE": signup.role,
                    "STAGE": signup.founder_stage or signup.funding_stage or "N/A",
                    "PAIN": signup.biggest_pain[:50] if signup.biggest_pain else ""
                }
            }
            
            response = mailchimp_client.lists.add_list_member(
                MAILCHIMP_AUDIENCE_ID,
                member_data
            )
            
            doc["mailchimp_id"] = response.get("id")
            doc["mailchimp_status"] = response.get("status")
            mailchimp_synced = True
            
        except Exception as e:
            logging.warning(f"Mailchimp sync failed: {e}")
    
    # Save to MongoDB
    await db.waitlist.insert_one(doc)
    
    return WaitlistSignupResponse(
        id=signup_id,
        email=signup.email,
        role=signup.role,
        created_at=created_at.isoformat(),
        mailchimp_synced=mailchimp_synced
    )

@api_router.get("/waitlist/stats", response_model=WaitlistStats)
async def get_waitlist_stats():
    """Get waitlist statistics"""
    total = await db.waitlist.count_documents({})
    founders = await db.waitlist.count_documents({"role": "Founder"})
    investors = await db.waitlist.count_documents({"role": "Investor"})
    funds = await db.waitlist.count_documents({"role": "Fund"})
    
    return WaitlistStats(
        total_signups=total,
        founders=founders,
        investors=investors,
        funds=funds
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
