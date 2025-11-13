from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from twilio.rest import Client
from datetime import datetime, timezone
from pathlib import Path
import uuid
import os
import logging


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME")
if not (MONGO_URL and DB_NAME):
    raise RuntimeError("Missing MongoDB configuration in .env")


client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]


app = FastAPI(title="Markham Taxi API", version="1.0.0")
router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)
logger = logging.getLogger("markham-taxi")


class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class BookingRequest(BaseModel):
    name: str
    phone: str
    date: str
    time: str
    passengers: str
    pickup: str
    dropoff: str
    notes: Optional[str] = ""

class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    date: str
    time: str
    passengers: str
    pickup: str
    dropoff: str
    notes: Optional[str] = ""
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    sms_sent: bool = False


@router.get("/")
async def root():
    return {"message": "Markham Taxi API online"}


@router.post("/status", response_model=StatusCheck)
async def create_status_check(data: StatusCheckCreate):
    """Record a system status check"""
    status_obj = StatusCheck(**data.model_dump())
    doc = status_obj.model_dump()
    doc["timestamp"] = doc["timestamp"].isoformat()

    await db.status_checks.insert_one(doc)
    logger.info(f"Status check from {status_obj.client_name}")
    return status_obj

@router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    """Return all system status checks"""
    records = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for r in records:
        if isinstance(r.get("timestamp"), str):
            r["timestamp"] = datetime.fromisoformat(r["timestamp"])
    return records


def send_sms_notification(booking_data: dict) -> bool:
    """Send SMS via Twilio, returns True if successful."""
    try:
        account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        twilio_phone = os.getenv("TWILIO_PHONE_NUMBER")
        taxi_phone = os.getenv("TAXI_PHONE_NUMBER", "+14165668154")

        if not all([account_sid, auth_token, twilio_phone]):
            logger.warning("Twilio not configured; SMS skipped.")
            return False

        client = Client(account_sid, auth_token)
        message_body = f"""🚖 New Taxi Booking
Name: {booking_data['name']}
Phone: {booking_data['phone']}
Date: {booking_data['date']} {booking_data['time']}
From: {booking_data['pickup']}
To: {booking_data['dropoff']}
Passengers: {booking_data['passengers']}"""

        if booking_data.get("notes"):
            message_body += f"\nNotes: {booking_data['notes']}"

        message = client.messages.create(
            body=message_body,
            from_=twilio_phone,
            to=taxi_phone,
        )
        logger.info(f"SMS sent (SID: {message.sid})")
        return True

    except Exception as e:
        logger.error(f"SMS send failed: {e}")
        return False

@router.post("/book")
async def create_booking(data: BookingRequest):
    """Create a taxi booking, send SMS, and store in DB."""
    try:
        booking = Booking(**data.model_dump())
        booking.sms_sent = send_sms_notification(data.model_dump())

        doc = booking.model_dump()
        doc["created_at"] = doc["created_at"].isoformat()

        await db.bookings.insert_one(doc)
        logger.info(f"Booking created for {booking.name} ({booking.id})")

        return {
            "success": True,
            "booking_id": booking.id,
            "sms_sent": booking.sms_sent,
            "message": "Booking request processed successfully.",
        }

    except Exception as e:
        logger.exception("Booking creation failed")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/bookings", response_model=List[Booking])
async def get_bookings():
    """Retrieve all bookings."""
    records = await db.bookings.find({}, {"_id": 0}).to_list(1000)
    for r in records:
        if isinstance(r.get("created_at"), str):
            r["created_at"] = datetime.fromisoformat(r["created_at"])
    return records

# ────────────────────────────────────────────────────────────────────────────────
# Middleware & Shutdown
# ────────────────────────────────────────────────────────────────────────────────
app.include_router(router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    logger.info("Database connection closed.")
