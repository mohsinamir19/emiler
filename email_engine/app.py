from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import pandas as pd
import io
from pydantic import BaseModel
from sendgrid_sender import send_bulk_emails
from langchain_core.output_parsers import PydanticOutputParser
from email_generator import run_graph, EmailOutput  # adjust import path
from csv_loader import validate_recipients, load_csv, RecipientRow
from template_engine import generate_personalized_emails


app = FastAPI(title="CSV Email Validator API")




# Allow CORS so frontend can call API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev, you can restrict to your frontend URL later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# Upload endpoint
# =========================
@app.post("/validate-csv")
async def validate_csv(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed." )

    try:
        contents = await file.read()
        # Convert bytes to pandas DataFrame
        df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading CSV: {e}")

    try:
        valid_rows, invalid_rows = validate_recipients(df)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error validating CSV: {e}")

    # Convert Pydantic objects to dicts for JSON response
    valid_list = [r.dict() for r in valid_rows]

    return {
        "valid_rows_count": len(valid_rows),
        "invalid_rows_count": len(invalid_rows),
        "valid_rows": valid_list,
        "invalid_rows": invalid_rows,
    }




# =========================
# Request/Response Models
# =========================
class ChatRequest(BaseModel):
    user_message: str
    history: list[dict]  # [{"role": "user", "content": "..."}, ...]

class ChatResponse(BaseModel):
    subject: str
    body: str

# =========================
# AI Email Generation Endpoint
# =========================
@app.post("/generate-email", response_model=ChatResponse)
async def generate_email(request: ChatRequest):
    try:
        print("Request received:", request.dict())

        raw_output = await run_graph(request.user_message, request.history)
        print("Raw output from run_graph:", raw_output)

        parsed = EmailOutput.parse_raw(raw_output)
        print("Parsed output:", parsed)

        return {"subject": parsed.subject, "body": parsed.body}
    except Exception as e:
        print("🔥 ERROR:", e)
        raise HTTPException(status_code=500, detail=f"AI generation failed: {e}")


# =========================
#  Email Personalization
# =========================

class BulkPersonalizeRequest(BaseModel):
    subject: str
    body: str
    recipients: list[dict]
    mode: str = "personalized"

class BulkPersonalizeResponse(BaseModel):
    subject: str
    emails: list[dict]  # {"email": ..., "rendered_body": ...}

@app.post("/personalize-emails", response_model=BulkPersonalizeResponse)
async def personalize_emails(request: BulkPersonalizeRequest):
    try:
        emails = generate_personalized_emails(request.body, request.recipients, mode=request.mode)
        print(emails)
        return {"subject": request.subject, "emails": emails}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Personalization failed: {e}")
    

    
# =========================
#  sendgrid send 
# =========================

class EmailItem(BaseModel):
    email: str
    rendered_body: str

class SendEmailsRequest(BaseModel):
    subject: str
    emails: List[EmailItem]

class SendEmailsResponse(BaseModel):
    sent: List[str]
    failed: List[str]


    
@app.post("/send-emails", response_model=SendEmailsResponse)
async def send_emails(request: SendEmailsRequest):
    sent = []
    failed = []

    try:
        # Convert request.emails (Pydantic objects) to list of dicts
        email_list = [{"email": item.email, "rendered_body": item.rendered_body} for item in request.emails]

        try:
            send_bulk_emails(email_list, request.subject)
            sent = [item["email"] for item in email_list]  # assume all succeeded
        except Exception as e:
            failed = [item["email"] for item in email_list]
            print("Send error:", e)

        return {"sent": sent, "failed": failed}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sending emails failed: {e}")
